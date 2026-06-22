const { chromium } = require('playwright');

const SAVE = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7';
const BASE = 'http://localhost:3000';

async function run() {
  const browser = await chromium.launch({ headless: true });

  // ── DESKTOP GUEST ──
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    // Guest Home
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SAVE}/guest_home_desktop.png`, fullPage: true });
    console.log('✓ guest_home_desktop');

    // Guest Explore
    await page.goto(`${BASE}/explore`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SAVE}/guest_explore_desktop.png` });
    console.log('✓ guest_explore_desktop');

    await page.close();
  }

  // ── DESKTOP TRAVELER ──
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    // Login
    await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle' });
    await page.fill('#email', 'traveler@eztravel.com');
    await page.fill('#password', 'Traveler@123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect away from login
    let waited = 0;
    while (page.url().includes('/auth/login') && waited < 30000) {
      await page.waitForTimeout(1000);
      waited += 1000;
    }
    console.log('Logged in, URL:', page.url());

    // My Trips
    await page.goto(`${BASE}/trips`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${SAVE}/traveler_trips_desktop.png`, fullPage: true });
    console.log('✓ traveler_trips_desktop');

    // Check for sidebar (should NOT exist)
    const sidebar = await page.$('aside.md\\:flex.w-\\[280px\\]');
    console.log('Sidebar present:', !!sidebar, '(should be false)');

    // Check for consumer header
    const header = await page.$('header.consumer-header');
    console.log('ConsumerHeader present:', !!header, '(should be true)');

    // Trip Detail
    await page.goto(`${BASE}/trips/4`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${SAVE}/traveler_trip_detail_desktop.png`, fullPage: true });
    console.log('✓ traveler_trip_detail_desktop');

    await page.close();
  }

  // ── MOBILE GUEST ──
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SAVE}/guest_home_mobile.png`, fullPage: true });
    console.log('✓ guest_home_mobile');

    // Open hamburger
    const hamburger = await page.$('#consumer-mobile-menu-btn');
    if (hamburger) {
      await hamburger.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${SAVE}/mobile_drawer_open.png` });
      console.log('✓ mobile_drawer_open');
    } else {
      console.log('! hamburger not found');
      await page.screenshot({ path: `${SAVE}/mobile_drawer_open.png` });
    }

    await page.close();
  }

  // ── MOBILE TRAVELER ──
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    
    // Login on mobile
    await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle' });
    await page.fill('#email', 'traveler@eztravel.com');
    await page.fill('#password', 'Traveler@123');
    await page.click('button[type="submit"]');
    let waited = 0;
    while (page.url().includes('/auth/login') && waited < 25000) {
      await page.waitForTimeout(1000);
      waited += 1000;
    }

    await page.goto(`${BASE}/trips`, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${SAVE}/traveler_trips_mobile.png`, fullPage: true });
    console.log('✓ traveler_trips_mobile');

    await page.close();
  }

  await browser.close();
  console.log('\nAll done!');
  process.exit(0);
}

run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
