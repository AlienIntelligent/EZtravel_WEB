const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = "C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\49205406-c93e-4a47-975d-3dc47299d208";

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log("Taking Design System Light Theme screenshot...");
  await page.goto('http://localhost:3000/design-system');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'design_system_light.png'), fullPage: true });

  console.log("Taking Design System Dark Theme screenshot...");
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'design_system_dark.png'), fullPage: true });
  await page.evaluate(() => document.documentElement.classList.remove('dark'));

  console.log("Taking Main Layout screenshot...");
  await page.goto('http://localhost:3000/test-main');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'layout_main.png'), fullPage: true });

  console.log("Taking Auth Layout screenshot (Desktop)...");
  await page.goto('http://localhost:3000/test-auth');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'layout_auth_desktop.png'), fullPage: true });

  console.log("Taking Auth Layout screenshot (Mobile)...");
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/test-auth');
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(OUT_DIR, 'layout_auth_mobile.png'), fullPage: true });

  console.log("Taking Planner Layout screenshot...");
  await page.goto('http://localhost:3000/test-planner');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'layout_planner.png') }); // fullPage false for planner due to fixed h-screen

  console.log("Taking Admin Layout screenshot...");
  await page.goto('http://localhost:3000/test-admin');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, 'layout_admin.png') });

  await browser.close();
  console.log("Screenshots completed successfully!");
}

run().catch(console.error);
