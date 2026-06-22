/* eslint-disable no-undef */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3009';
const OUT_DIR = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  
  // Scenarios to test
  const scenarios = [
    {
      name: '01_guest_pending_redirect.png',
      roleName: 'Guest',
      route: '/provider/pending',
      expectedUrl: '/auth/login',
      user: null
    },
    {
      name: '02_traveler_pending_redirect.png',
      roleName: 'Traveler',
      route: '/provider/pending',
      expectedUrl: '/provider/registration',
      user: { id: '1', fullName: 'Mock Traveler', email: 'traveler@eztravel.com', role: 'TRAVELER', status: 'ACTIVE' }
    },
    {
      name: '03_premium_traveler_pending_redirect.png',
      roleName: 'Premium Traveler',
      route: '/provider/pending',
      expectedUrl: '/provider/registration',
      user: { id: '2', fullName: 'Mock Premium Traveler', email: 'premium@eztravel.com', role: 'TRAVELER', isPremium: true, status: 'ACTIVE' }
    },
    {
      name: '04_provider_pending_allowed.png',
      roleName: 'Provider Pending',
      route: '/provider/pending',
      expectedUrl: '/provider/pending',
      user: { id: '3', fullName: 'Mock Pending Provider', email: 'pending@eztravel.com', role: 'PROVIDER', providerStatus: 'PENDING', status: 'ACTIVE' }
    },
    {
      name: '05_provider_approved_pending_redirect.png',
      roleName: 'Provider Approved',
      route: '/provider/pending',
      expectedUrl: '/provider/dashboard',
      user: { id: '4', fullName: 'Mock Approved Provider', email: 'approved@eztravel.com', role: 'PROVIDER', providerStatus: 'APPROVED', status: 'ACTIVE' }
    },
    {
      name: '06_admin_pending_redirect.png',
      roleName: 'Admin',
      route: '/provider/pending',
      expectedUrl: '/admin/dashboard',
      user: { id: '5', fullName: 'Mock Admin', email: 'admin@eztravel.com', role: 'ADMIN', status: 'ACTIVE' }
    },
    {
      name: '07_error_boundary_fallback.png',
      roleName: 'Error Fallback',
      route: '/dashboard?crash=true',
      expectedUrl: '/dashboard?crash=true',
      user: { id: '1', fullName: 'Mock Traveler', email: 'traveler@eztravel.com', role: 'TRAVELER', status: 'ACTIVE' }
    }
  ];

  console.log("| Role | Route thử | Kết quả thực tế | Kết quả mong đợi | Status | Screenshot |");
  console.log("| :--- | :--- | :--- | :--- | :---: | :--- |");

  for (const sc of scenarios) {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Mock API requests to bypass backend dependencies during verification
    if (sc.user) {
      await page.route('**/api/profile', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: sc.user.id,
            fullName: sc.user.fullName,
            email: sc.user.email,
            role: sc.user.role,
            providerStatus: sc.user.providerStatus || '',
            isPremium: sc.user.isPremium || false,
            avatarUrl: '',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        });
      });

      // Mock auth tokens in local storage
      await context.addInitScript(({ token, user }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }, { token: 'mock-jwt-token', user: sc.user });
    } else {
      // Clear localStorage for Guest
      await context.addInitScript(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }

    // Navigate
    await page.goto(`${BASE_URL}${sc.route}`);
    
    // Wait for animations/render stable
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    const actualPath = new URL(currentUrl).pathname + new URL(currentUrl).search;
    const isPass = actualPath === sc.expectedUrl;
    const statusText = isPass ? "PASS" : "FAIL";

    console.log(`| ${sc.roleName} | \`${sc.route}\` | \`${actualPath}\` | \`${sc.expectedUrl}\` | **${statusText}** | \`${sc.name}\` |`);

    const outPath = path.join(OUT_DIR, sc.name);
    await page.screenshot({ path: outPath, fullPage: false });

    await context.close();
  }

  await browser.close();
  console.log("\nVerification finished!");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
