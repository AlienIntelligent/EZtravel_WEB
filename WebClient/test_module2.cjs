const puppeteer = require('puppeteer');

(async () => {
    console.log("Starting Vite preview server for Module 2...");
    const { exec } = require('child_process');
    
    // We assume backend and frontend are already running if not we should start them.
    // For safety, let's just use the existing ports if they are up, or we can just try to hit them.
    // Given the previous script started servers, let's just try to connect to localhost:4173 directly.
    
    const browser = await puppeteer.launch({ headless: "new", defaultViewport: { width: 1280, height: 900 } });
    const page = await browser.newPage();
    
    try {
        console.log("Navigating to Login...");
        await page.goto('http://127.0.0.1:4173/login', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);
        await page.type('input[type="email"]', 'traveler@eztravel.com');
        await page.type('input[type="password"]', 'Traveler@123');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
            page.click('button[type="submit"]')
        ]);

        console.log("Logged in. Navigating to Trips...");
        await page.waitForTimeout(1000);
        await page.goto('http://127.0.0.1:4173/trips', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);

        const trips = await page.$$('h3');
        if (trips.length > 0) {
            console.log("Clicking first trip...");
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                trips[0].click()
            ]);
            await page.waitForTimeout(2000);
            
            // Capture Overview
            await page.screenshot({ path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/trip-detail-overview.png', fullPage: true });
            console.log("Captured Overview");

            // Capture Timeline
            const tabs = await page.$$('button[role="tab"]');
            await tabs[1].click(); // Timeline
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/trip-detail-timeline.png', fullPage: true });
            console.log("Captured Timeline");

            // Capture Destinations
            await tabs[2].click(); // Destinations
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/trip-detail-destinations.png', fullPage: true });
            console.log("Captured Destinations");

            // Capture Budget
            await tabs[3].click(); // Budget
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/trip-detail-budget.png', fullPage: true });
            console.log("Captured Budget");
        } else {
            console.log("No trips found on the trips page.");
        }
    } catch (e) {
        console.error("Puppeteer Failed", e);
    } finally {
        await browser.close();
    }
})();
