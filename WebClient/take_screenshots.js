/* eslint-disable */
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = "C:/Users/ADMIN/.gemini/antigravity-ide/brain/1321d453-5749-48ad-abc9-1da81182699a";

const scenarios = [
  {
    name: 'real_desktop_dashboard.png',
    route: '/dashboard',
    viewport: { width: 1280, height: 800 },
    role: 'TRAVELER',
    profileMock: {
      id: "1",
      name: "Traveler User",
      email: "user@test.com",
      role: "TRAVELER",
    }
  },
  {
    name: 'real_desktop_admin.png',
    route: '/admin/dashboard',
    viewport: { width: 1280, height: 800 },
    role: 'ADMIN',
    profileMock: {
      id: "2",
      name: "Admin User",
      email: "admin@test.com",
      role: "ADMIN",
    }
  },
  {
    name: 'real_desktop_provider.png',
    route: '/provider/dashboard',
    viewport: { width: 1280, height: 800 },
    role: 'PROVIDER',
    profileMock: {
      id: "3",
      name: "Provider User",
      email: "provider@test.com",
      role: "PROVIDER",
      providerStatus: "APPROVED"
    }
  },
  {
    name: 'real_mobile_dashboard.png',
    route: '/dashboard',
    viewport: { width: 375, height: 667 }, // iPhone 8 dimensions
    role: 'TRAVELER',
    profileMock: {
      id: "1",
      name: "Traveler User",
      email: "user@test.com",
      role: "TRAVELER",
    }
  },
  {
    name: 'real_mobile_sidebar_open.png',
    route: '/dashboard',
    viewport: { width: 375, height: 667 }, // iPhone 8 dimensions
    role: 'TRAVELER',
    action: async (page) => {
      // Click the hamburger menu to open sidebar
      await page.waitForSelector('button[aria-label="Toggle Navigation"]', { timeout: 5000 }).catch(() => {});
      // Evaluate click if standard click fails
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Toggle Navigation"]') || 
                    document.querySelector('header button');
        if (btn) btn.click();
      });
      await page.waitForTimeout(500); // wait for animation
    },
    profileMock: {
      id: "1",
      name: "Traveler User",
      email: "user@test.com",
      role: "TRAVELER",
    }
  },
  {
    name: 'real_design_preview.png',
    route: '/preview/design-system',
    viewport: { width: 1280, height: 1600 },
    role: 'PUBLIC',
    profileMock: null // No auth needed or mock if needed
  }
];

async function run() {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const context = await browser.newContext();

  for (const scenario of scenarios) {
    console.log(`Processing scenario: ${scenario.name}`);
    const page = await context.newPage();
    await page.setViewportSize(scenario.viewport);

    // Mock API
    await page.route('**/profile', async (route) => {
      if (scenario.profileMock) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(scenario.profileMock)
        });
      } else {
        await route.abort();
      }
    });

    // Set local storage
    if (scenario.profileMock) {
      await page.addInitScript(() => {
        window.localStorage.setItem('token', 'fake-token-123');
      });
    }

    await page.goto(`http://localhost:3001${scenario.route}`, { waitUntil: 'networkidle' });
    
    // Give it a small delay to render
    await page.waitForTimeout(1000);

    if (scenario.action) {
      console.log(`Executing custom action for ${scenario.name}...`);
      await scenario.action(page);
    }

    const outputPath = path.join(ARTIFACTS_DIR, scenario.name);
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log(`Saved screenshot to ${outputPath}`);
    
    await page.close();
  }

  console.log("Closing browser...");
  await browser.close();
  console.log("Done.");
}

run().catch(console.error);
