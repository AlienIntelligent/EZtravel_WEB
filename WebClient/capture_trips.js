import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1280, height: 800 }
  });
  const page = await browser.newPage();
  
  try {
    // 1. Go to login
    await page.goto('http://127.0.0.1:4173/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', 'traveler@eztravel.com');
    await page.type('input[type="password"]', 'Traveler@123');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('button[type="submit"]')
    ]);

    // 2. Go to /trips
    await page.goto('http://127.0.0.1:4173/trips', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(1000); // Wait for mock data
    await page.screenshot({ path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/trips_grid_view.png', fullPage: true });
    
    // 3. Switch to list view
    const listBtn = await page.$$('button');
    for (const btn of listBtn) {
        const html = await page.evaluate(el => el.innerHTML, btn);
        if (html.includes('lucide-list')) {
            await btn.click();
            break;
        }
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/trips_list_view.png', fullPage: true });

    console.log("SUCCESS");
  } catch (error) {
    console.error("FAILED", error);
  } finally {
    await browser.close();
  }
})();
