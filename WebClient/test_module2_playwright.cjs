const { chromium } = require('playwright');

async function run() {
  console.log("Running Playwright capture...");
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    
    await page.goto('http://localhost:4173/auth/login', { waitUntil: 'networkidle' });
    await page.fill('#email', 'traveler@eztravel.com');
    await page.fill('#password', 'Traveler@123');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    console.log("Logged in. Navigating to /trips...");
    await page.goto('http://localhost:4173/trips', { waitUntil: 'networkidle' });
    
    const trips = await page.locator('h3').elementHandles();
    if (trips.length > 0) {
        console.log("Clicking first trip...");
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            trips[0].click()
        ]);
        
        await page.waitForTimeout(1000); // Wait for animations
        
        const savePath = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/';
        // Capture Overview
        await page.screenshot({ path: savePath + 'trip-detail-overview.png', fullPage: true });
        console.log("Captured Overview");

        const tabs = await page.locator('button[role="tab"]').elementHandles();
        if(tabs.length >= 2) {
            await tabs[1].click(); // Timeline
            await page.waitForTimeout(500);
            await page.screenshot({ path: savePath + 'trip-detail-timeline.png', fullPage: true });
            console.log("Captured Timeline");
        }

        if(tabs.length >= 3) {
            await tabs[2].click(); // Destinations
            await page.waitForTimeout(500);
            await page.screenshot({ path: savePath + 'trip-detail-destinations.png', fullPage: true });
            console.log("Captured Destinations");
        }

        if(tabs.length >= 4) {
            await tabs[3].click(); // Budget
            await page.waitForTimeout(500);
            await page.screenshot({ path: savePath + 'trip-detail-budget.png', fullPage: true });
            console.log("Captured Budget");
        }
    } else {
        console.log("No trips found.");
    }

  } catch (error) {
    console.error("Playwright Failed", error);
  } finally {
    if (browser) await browser.close();
    process.exit(0);
  }
}

run();
