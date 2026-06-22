import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import net from 'net';

const BASE_URL = 'http://localhost:4173';
const OUT_DIR = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/69d8e62b-a912-42a6-baaa-db7e084e8267';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const scenarios = [
  { name: 'design_system_desktop.png', route: '/preview/design-system', role: 'PUBLIC', viewport: { width: 1280, height: 800 } },
  { name: 'design_system_mobile.png', route: '/preview/design-system', role: 'PUBLIC', viewport: { width: 375, height: 812 } },
  
  { name: 'home_desktop.png', route: '/', role: 'PUBLIC', viewport: { width: 1280, height: 800 } },
  { name: 'home_mobile.png', route: '/', role: 'PUBLIC', viewport: { width: 375, height: 812 } },
  
  { name: 'explore_desktop.png', route: '/explore', role: 'PUBLIC', viewport: { width: 1280, height: 800 } },
  { name: 'explore_mobile.png', route: '/explore', role: 'PUBLIC', viewport: { width: 375, height: 812 } },
  
  { name: 'login_desktop.png', route: '/auth/login', role: 'PUBLIC', viewport: { width: 1280, height: 800 } },
  { name: 'login_mobile.png', route: '/auth/login', role: 'PUBLIC', viewport: { width: 375, height: 812 } },
  
  { name: 'register_desktop.png', route: '/auth/register', role: 'PUBLIC', viewport: { width: 1280, height: 800 } },
  { name: 'register_mobile.png', route: '/auth/register', role: 'PUBLIC', viewport: { width: 375, height: 812 } },
  
  { name: 'dashboard_traveler_desktop.png', route: '/dashboard', role: 'TRAVELER', viewport: { width: 1280, height: 800 } },
  { name: 'dashboard_traveler_mobile.png', route: '/dashboard', role: 'TRAVELER', viewport: { width: 375, height: 812 } },
  
  { name: 'dashboard_admin_desktop.png', route: '/admin/dashboard', role: 'ADMIN', viewport: { width: 1280, height: 800 } },
  { name: 'dashboard_admin_mobile.png', route: '/admin/dashboard', role: 'ADMIN', viewport: { width: 375, height: 812 } },
  
  { name: 'dashboard_provider_desktop.png', route: '/provider/dashboard', role: 'PROVIDER_APPROVED', viewport: { width: 1280, height: 800 } },
  { name: 'dashboard_provider_mobile.png', route: '/provider/dashboard', role: 'PROVIDER_APPROVED', viewport: { width: 375, height: 812 } },
];

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const onError = () => {
      socket.destroy();
      resolve(false);
    };
    socket.setTimeout(1000);
    socket.once('error', onError);
    socket.once('timeout', onError);
    socket.connect(port, '127.0.0.1', () => {
      socket.end();
      resolve(true);
    });
  });
}

async function waitForPort(port, timeoutMs = 15000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const isOpen = await checkPort(port);
    if (isOpen) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Port ${port} did not open in ${timeoutMs}ms`);
}

async function run() {
  console.log("Starting preview server...");
  const serverProc = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    cwd: 'd:/eztravel/WebClient',
    stdio: 'ignore'
  });

  try {
    await waitForPort(4173);
    console.log("Vite preview server is ready on http://localhost:4173!");

    console.log("Launching browser...");
    const browser = await chromium.launch();

    for (const sc of scenarios) {
      console.log(`Taking screenshot for ${sc.name}...`);
      const context = await browser.newContext({ viewport: sc.viewport });
      const page = await context.newPage();

      // Intercept profile & explore/stats APIs
      await page.route('**/api/*', async (routeObj) => {
        const url = routeObj.request().url();
        if (url.includes('/api/profile')) {
          let userObj = null;
          if (sc.role === 'TRAVELER') {
            userObj = { id: '1', email: 'traveler@test.com', name: 'Traveler User', role: 'TRAVELER' };
          } else if (sc.role === 'ADMIN') {
            userObj = { id: '2', email: 'admin@test.com', name: 'Admin User', role: 'ADMIN' };
          } else if (sc.role === 'PROVIDER_APPROVED') {
            userObj = { id: '3', email: 'provider@test.com', name: 'Provider Partner', role: 'PROVIDER', providerStatus: 'APPROVED' };
          }
          await routeObj.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: userObj }) // api response might be { data: user } or user directly. baseApi transformResponse has response.data || response
          });
        } else if (url.includes('/api/admin/stats')) {
          await routeObj.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: { totalUsers: 1420, totalTrips: 345 } })
          });
        } else if (url.includes('/api/provider/stats') || url.includes('/api/provider/dashboard')) {
          await routeObj.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                totalServices: 12,
                activeServices: 10,
                averageRating: 4.8,
                totalReviews: 86
              }
            })
          });
        } else if (url.includes('/api/public/home/trending-destinations')) {
          await routeObj.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: [] })
          });
        } else if (url.includes('/api/places/search') || url.includes('/api/places/hotels/search')) {
          await routeObj.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: [
                {
                  id: "1",
                  name: "Vịnh Hạ Long",
                  description: "Vịnh Hạ Long - Di sản thiên nhiên thế giới UNESCO kì vĩ và thơ mộng.",
                  address: "Hạ Long, Quảng Ninh",
                  cityId: "QN",
                  latitude: 20.9101,
                  longitude: 107.1839,
                  images: ["https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=600&q=85"],
                  tags: ["Thiên nhiên", "UNESCO"],
                  averageRating: 4.9,
                  totalReviews: 148,
                  status: "ACTIVE"
                },
                {
                  id: "2",
                  name: "Phố cổ Hội An",
                  description: "Phố cổ Hội An với vẻ đẹp hoài cổ yên bình bên sông Thu Bồn.",
                  address: "Hội An, Quảng Nam",
                  cityId: "QN",
                  latitude: 15.8801,
                  longitude: 108.3380,
                  images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=85"],
                  tags: ["Văn hóa", "Cổ kính"],
                  averageRating: 4.7,
                  totalReviews: 92,
                  status: "ACTIVE"
                }
              ]
            })
          });
        } else {
          await routeObj.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: {} })
          });
        }
      });

      // Inject token if authenticated
      if (sc.role !== 'PUBLIC') {
        await context.addInitScript(() => {
          localStorage.setItem('token', 'fake-jwt-token-123');
        });
      } else {
        await context.addInitScript(() => {
          localStorage.clear();
        });
      }

      await page.goto(`${BASE_URL}${sc.route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000); // Wait for transition animations or components to finish loading

      // Open mobile sidebars or menus if appropriate
      if (sc.name.includes('mobile') && sc.route === '/dashboard') {
        // Just take regular view first
      }

      const outPath = path.join(OUT_DIR, sc.name);
      await page.screenshot({ path: outPath, fullPage: true });
      console.log(`Saved screenshot: ${outPath}`);
      await context.close();
    }

    await browser.close();
    console.log("All screenshots successfully captured!");

  } catch (err) {
    console.error("Error capturing screenshots:", err);
  } finally {
    console.log("Stopping preview server...");
    serverProc.kill();
  }
}

run();
