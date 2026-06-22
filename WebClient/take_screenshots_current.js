import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'http://localhost:3009';
const ARTIFACTS_DIR = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/26f2a372-ee21-41c4-b7fe-13ccb06ba7ac';
const REPO_SCREENSHOTS_DIR = 'd:/eztravel/docs/screenshots';

// Ensure directories exist
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}
if (!fs.existsSync(REPO_SCREENSHOTS_DIR)) {
  fs.mkdirSync(REPO_SCREENSHOTS_DIR, { recursive: true });
}

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
      isPremium: false
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
      isPremium: false
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
      providerStatus: "APPROVED",
      isPremium: false
    }
  },
  {
    name: 'real_mobile_dashboard.png',
    route: '/dashboard',
    viewport: { width: 375, height: 667 },
    role: 'TRAVELER',
    profileMock: {
      id: "1",
      name: "Traveler User",
      email: "user@test.com",
      role: "TRAVELER",
      isPremium: false
    }
  },
  {
    name: 'real_mobile_sidebar_open.png',
    route: '/dashboard',
    viewport: { width: 375, height: 667 },
    role: 'TRAVELER',
    action: async (page) => {
      console.log("Waiting for mobile toggle and clicking...");
      await page.waitForTimeout(1000);
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Toggle Navigation"]') || 
                    document.querySelector('header button');
        if (btn) {
          btn.click();
        } else {
          console.log("Mobile toggle button not found");
        }
      });
      await page.waitForTimeout(800);
    },
    profileMock: {
      id: "1",
      name: "Traveler User",
      email: "user@test.com",
      role: "TRAVELER",
      isPremium: false
    }
  },
  {
    name: 'real_design_preview.png',
    route: '/preview/design-system',
    viewport: { width: 1280, height: 2500 },
    role: 'PUBLIC',
    profileMock: null
  }
];

async function run() {
  console.log(`Connecting to Vite dev server at ${BASE_URL}...`);
  console.log("Launching Chromium browser...");
  const browser = await chromium.launch();

  for (const sc of scenarios) {
    console.log(`\n---------------------------------------------`);
    console.log(`Processing scenario: ${sc.name}`);
    const context = await browser.newContext({ viewport: sc.viewport });
    const page = await context.newPage();

    // Route ONLY API endpoints, ignore source code files served by Vite
    await page.route('**/*', async (route) => {
      const url = route.request().url();

      if (url.includes('/src/')) {
        await route.continue();
        return;
      }

      // 1. Profile Mocking
      if (url.endsWith('/profile')) {
        if (sc.profileMock) {
          console.log(`[Mock API] Mocking profile: ${sc.profileMock.role}`);
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(sc.profileMock)
          });
        } else {
          console.log(`[Mock API] Aborting profile`);
          await route.abort();
        }
        return;
      }

      // 2. Admin Stats Mocking
      if (url.endsWith('/api/admin/stats') || url.endsWith('/admin/stats')) {
        console.log(`[Mock API] Mocking admin stats`);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            totalUsers: 1420,
            totalTrips: 345,
            totalBookings: 110,
            totalRevenue: 25000000
          })
        });
        return;
      }

      // 3. Provider Dashboard KPI Stats Mocking
      if (url.includes('/providers/user/') && url.endsWith('/dashboard')) {
        console.log(`[Mock API] Mocking provider KPIs`);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            totalServices: 12,
            activeServices: 10,
            totalReviews: 86,
            averageRating: 4.8
          })
        });
        return;
      }

      // 4. Provider Packages Mocking
      if (url.endsWith('/packages/provider')) {
        console.log(`[Mock API] Mocking provider packages`);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            tenGoi: "Gói Commercial",
            trangThai: "ACTIVE",
            ngayBatDau: "2026-01-01T00:00:00Z",
            ngayKetThuc: "2026-12-31T23:59:59Z"
          })
        });
        return;
      }

      // 5. Explore Grid Mocking
      if (url.endsWith('/explore')) {
        console.log(`[Mock API] Mocking explore grid`);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { providerId: 3, badgeType: "PROMOTED_TOP" }
          ])
        });
        return;
      }

      // Pass-through other static assets or routes
      await route.continue();
    });

    // Inject Token in LocalStorage for authenticated scenarios
    if (sc.profileMock) {
      await context.addInitScript((mockUser) => {
        window.localStorage.setItem('token', 'fake-jwt-token-xyz-999');
        window.localStorage.setItem('user', JSON.stringify(mockUser));
      }, sc.profileMock);
    } else {
      await context.addInitScript(() => {
        window.localStorage.clear();
      });
    }

    console.log(`Navigating to: ${BASE_URL}${sc.route}`);
    try {
      await page.goto(`${BASE_URL}${sc.route}`, { waitUntil: 'load', timeout: 10000 });
    } catch (err) {
      console.warn(`Navigation warning/timeout (proceeding anyway): ${err.message}`);
    }
    await page.waitForTimeout(2000); // Allow components to render

    // Execute custom action if defined
    if (sc.action) {
      try {
        await sc.action(page);
      } catch (err) {
        console.warn(`Custom action error (proceeding anyway): ${err.message}`);
      }
    }

    // Save to artifacts directory
    const artifactPath = path.join(ARTIFACTS_DIR, sc.name);
    await page.screenshot({ path: artifactPath, fullPage: true });
    console.log(`Saved screenshot to artifacts: ${artifactPath}`);

    // Save to codebase documentation directory
    const repoPath = path.join(REPO_SCREENSHOTS_DIR, sc.name);
    await page.screenshot({ path: repoPath, fullPage: true });
    console.log(`Saved screenshot to codebase: ${repoPath}`);

    await page.close();
    await context.close();
  }

  await browser.close();
  console.log("\nAll screenshots successfully captured!");
}

run().catch(console.error);
