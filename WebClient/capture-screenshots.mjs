import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import net from 'net';

const BASE_URL = 'http://localhost:3001';
const SCREENSHOT_DIR = 'd:/eztravel/docs/screenshot';

// Ensure screenshot directory exists and is empty
if (fs.existsSync(SCREENSHOT_DIR)) {
  fs.rmSync(SCREENSHOT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const PUBLIC_ROUTES = [
  { name: 'home', path: '/' },
  { name: 'login', path: '/auth/login' },
  { name: 'register', path: '/auth/register' },
  { name: 'explore', path: '/explore' },
  { name: 'destination_details', path: '/explore/destinations/1' },
  { name: 'community', path: '/community' },
  { name: 'blogs', path: '/community/blogs' },
  { name: 'design_preview', path: '/preview/design-system' }
];

const TRAVELER_ROUTES = [
  { name: 'dashboard', path: '/dashboard' },
  { name: 'trips', path: '/trips' },
  { name: 'trip_create', path: '/trips/create' },
  { name: 'profile', path: '/profile' },
  { name: 'notifications', path: '/notifications' }
];

const PROVIDER_ROUTES = [
  { name: 'provider_dashboard', path: '/provider/dashboard' },
  { name: 'provider_services', path: '/provider/services' },
  { name: 'provider_reviews', path: '/provider/reviews' },
  { name: 'provider_packages', path: '/provider/packages' }
];

const ADMIN_ROUTES = [
  { name: 'admin_dashboard', path: '/admin/dashboard' },
  { name: 'admin_users', path: '/admin/users' },
  { name: 'admin_moderation', path: '/admin/moderation' },
  { name: 'admin_categories', path: '/admin/categories' }
];

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const onError = () => { socket.destroy(); resolve(false); };
    socket.setTimeout(1000);
    socket.once('error', onError);
    socket.once('timeout', onError);
    socket.connect(port, '127.0.0.1', () => { socket.end(); resolve(true); });
  });
}

async function waitForPort(port, timeoutMs = 20000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if (await checkPort(port)) return true;
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Port ${port} did not open in ${timeoutMs}ms`);
}

async function captureRoutes(page, routes, folder) {
  const targetDir = path.join(SCREENSHOT_DIR, folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const route of routes) {
    console.log(`Navigating to ${route.path}...`);
    await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.error(`Failed to navigate: ${e.message}`));
    await page.waitForTimeout(1500); // Allow images to load

    // 1. Desktop Light
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(targetDir, `${route.name}_desktop_light.png`), fullPage: true });

    // 2. Desktop Dark
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(targetDir, `${route.name}_desktop_dark.png`), fullPage: true });

    // 3. Mobile Dark
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(targetDir, `${route.name}_mobile_dark.png`), fullPage: true });

    // 4. Mobile Light
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(targetDir, `${route.name}_mobile_light.png`), fullPage: true });
  }
}

async function login(page, email, password) {
  console.log(`Logging in as ${email}...`);
  await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 15000 }).catch(() => console.log('Did not redirect to dashboard, continuing...'));
  await page.waitForTimeout(2000);
}

(async () => {
  console.log("Starting Vite server on port 3001...");
  const serverProc = spawn('npx.cmd', ['vite', '--port', '3001'], {
    shell: true,
    cwd: 'd:/eztravel/WebClient',
    stdio: 'inherit'
  });

  try {
    // Wait for Vite to compile and start
    await new Promise(r => setTimeout(r, 6000));
    console.log("Server is assumed ready!");

    console.log('Launching browser...');
    const browser = await chromium.launch({ headless: true });

    // PUBLIC
    console.log('--- Capturing Public Routes ---');
    const publicCtx = await browser.newContext();
    const publicPage = await publicCtx.newPage();
    await captureRoutes(publicPage, PUBLIC_ROUTES, 'public');
    await publicCtx.close();

    // TRAVELER
    console.log('--- Capturing Traveler Routes ---');
    const travelerCtx = await browser.newContext();
    const travelerPage = await travelerCtx.newPage();
    await login(travelerPage, 'traveler@eztravel.com', 'Traveler@123');
    await captureRoutes(travelerPage, TRAVELER_ROUTES, 'traveler');
    await travelerCtx.close();

    // PROVIDER
    console.log('--- Capturing Provider Routes ---');
    const providerCtx = await browser.newContext();
    const providerPage = await providerCtx.newPage();
    await login(providerPage, 'provider@eztravel.com', 'Provider@123');
    await captureRoutes(providerPage, PROVIDER_ROUTES, 'provider');
    await providerCtx.close();

    // ADMIN
    console.log('--- Capturing Admin Routes ---');
    const adminCtx = await browser.newContext();
    const adminPage = await adminCtx.newPage();
    await login(adminPage, 'admin@eztravel.com', 'Admin@123');
    await captureRoutes(adminPage, ADMIN_ROUTES, 'admin');
    await adminCtx.close();

    await browser.close();
    console.log('Done capturing screenshots.');

  } catch (err) {
    console.error("Error during capture:", err);
  } finally {
    console.log("Stopping server...");
    serverProc.kill();
  }
})();
