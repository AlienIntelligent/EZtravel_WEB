import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://localhost:4173';
const OUT_DIR = 'artifacts/screenshots';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch();

  async function takeScreenshot(name, route, role, viewport, openMenu = false) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    page.on('console', msg => console.log(`[${name}] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.log(`[${name}] PAGE ERROR: ${err.message}\n${err.stack}`));



    if (role) {
      await page.route('**/api/*', async (routeObj) => {
        if (routeObj.request().url().includes('/api/profile')) {
          await routeObj.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ id: 1, email: 'test@example.com', name: 'Test User', role })
          });
        } else {
          await routeObj.fulfill({ status: 200, body: JSON.stringify({}) });
        }
      });
      
      // Inject token so that useAuth doesn't fail on first check
      await context.addInitScript(() => {
        localStorage.setItem('token', 'dummy');
      });
    }

    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // Give it a second to render
    
    if (openMenu) {
      try {
        await page.click('button[aria-label="Toggle Menu"]');
        await page.waitForTimeout(500); // wait for animation
      } catch (err) {
        console.log(`[${name}] Could not open menu: ${err.message}`);
      }
    }
    
    await page.screenshot({ path: path.join(OUT_DIR, name) });
    await context.close();
  }

  const desktop = { width: 1280, height: 720 };
  const mobile = { width: 375, height: 812 };

  console.log('Taking FE-0007 screenshots...');
  await takeScreenshot('fe-0007-traveler-desktop.png', '/dashboard', 'TRAVELER', desktop);
  await takeScreenshot('fe-0007-provider-desktop.png', '/provider/dashboard', 'PROVIDER_APPROVED', desktop);
  await takeScreenshot('fe-0007-admin-desktop.png', '/admin/dashboard', 'ADMIN', desktop);
  
  await takeScreenshot('fe-0007-traveler-mobile-closed.png', '/dashboard', 'TRAVELER', mobile, false);
  await takeScreenshot('fe-0007-traveler-mobile-open.png', '/dashboard', 'TRAVELER', mobile, true);
  await takeScreenshot('fe-0007-admin-mobile-open.png', '/admin/dashboard', 'ADMIN', mobile, true);

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);
