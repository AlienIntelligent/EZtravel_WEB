const { chromium } = require('playwright');
const path = require('path');

const SAVE_DIR = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7';
const BASE = 'http://localhost:4173';

async function login(page) {
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('#email', 'traveler@eztravel.com');
  await page.fill('#password', 'Traveler@123');
  await page.click('button[type="submit"]');
  // Wait for redirect away from login
  await page.waitForURL(url => !url.toString().includes('/auth/login'), { timeout: 30000 });
  await page.waitForTimeout(1000);
  console.log('Logged in as traveler, URL:', page.url());
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  // ─── DESKTOP ───────────────────────────────
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await login(page);

    // 1. My Trips — populated state
    await page.goto(`${BASE}/trips`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SAVE_DIR}/ui_trips_populated_desktop.png`, fullPage: true });
    console.log('Captured: trips populated desktop');

    // 2. My Trips — grid view (default)
    await page.screenshot({ path: `${SAVE_DIR}/ui_trips_grid_desktop.png` });

    // 3. My Trips — list view
    await page.click('.trips-view-btn:last-child');
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${SAVE_DIR}/ui_trips_list_desktop.png`, fullPage: true });
    console.log('Captured: trips list desktop');

    // 4. My Trips — search state
    await page.click('.trips-view-btn:first-child'); // back to grid
    await page.fill('.trips-search__input', 'test');
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SAVE_DIR}/ui_trips_search_desktop.png`, fullPage: true });
    console.log('Captured: trips search');

    // 5. My Trips — status filter (COMPLETED)
    await page.fill('.trips-search__input', '');
    const chips = await page.locator('.trips-filter-chip').elementHandles();
    if (chips.length >= 5) {
      await chips[4].click(); // COMPLETED
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${SAVE_DIR}/ui_trips_filter_completed_desktop.png`, fullPage: true });
      console.log('Captured: trips filter completed');
    }

    // Reset filter
    if (chips.length > 0) await chips[0].click();
    await page.waitForTimeout(300);

    // 6. Trip Detail — click first trip card
    const tripCards = await page.locator('.trip-grid-card').elementHandles();
    if (tripCards.length > 0) {
      const currentUrl = page.url();
      await tripCards[0].click();
      await page.waitForURL(url => url.toString() !== currentUrl, { timeout: 15000 });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${SAVE_DIR}/ui_trip_detail_timeline_desktop.png`, fullPage: true });
      console.log('Captured: trip detail timeline desktop');

      // Budget tab
      const tabBtns = await page.locator('.td-tab-btn').elementHandles();
      if (tabBtns.length >= 2) {
        await tabBtns[1].click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: `${SAVE_DIR}/ui_trip_detail_budget_desktop.png`, fullPage: true });
        console.log('Captured: trip detail budget desktop');
      }
    } else {
      console.log('No trip cards found');
    }

    await page.close();
  }

  // ─── MOBILE ────────────────────────────────
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await login(page);

    // My Trips mobile
    await page.goto(`${BASE}/trips`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${SAVE_DIR}/ui_trips_mobile.png`, fullPage: true });
    console.log('Captured: trips mobile');

    // Trip Detail mobile
    const cards = await page.locator('.trip-grid-card').elementHandles();
    if (cards.length > 0) {
      const curUrl = page.url();
      await cards[0].click();
      await page.waitForURL(url => url.toString() !== curUrl, { timeout: 15000 });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${SAVE_DIR}/ui_trip_detail_mobile.png`, fullPage: true });
      console.log('Captured: trip detail mobile');
    }

    await page.close();
  }

  await browser.close();
  console.log('All screenshots captured!');
  process.exit(0);
}

run().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
