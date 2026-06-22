const { spawn } = require('child_process');
const killPort = require('kill-port');
const puppeteer = require('puppeteer');

const services = [
  { name: 'AdminService', port: 5001 },
  { name: 'AuthService', port: 5002 },
  { name: 'BookingService', port: 5003 },
  { name: 'CommunityService', port: 5004 },
  { name: 'PlaceService', port: 5005 },
  { name: 'TripService', port: 5006 },
  { name: 'ApiGateway', port: 5000 }
];

async function killPorts() {
  for (const s of services) {
    try { await killPort(s.port); } catch (e) {}
  }
  try { await killPort(4173); } catch (e) {} // Vite preview
}

async function run() {
  console.log("Killing old ports...");
  await killPorts();

  const procs = [];
  console.log("Starting backend services...");
  for (const s of services) {
    const p = spawn('dotnet', ['run', '--project', `Microservices/ezTravel.${s.name}/ezTravel.${s.name}.csproj`], { cwd: 'd:/eztravel', shell: true });
    procs.push(p);
  }

  console.log("Starting Vite preview server...");
  const vite = spawn('npm', ['run', 'preview'], { cwd: 'd:/eztravel/WebClient', shell: true });
  procs.push(vite);

  console.log("Waiting 15 seconds for servers to start...");
  await new Promise(r => setTimeout(r, 15000));

  console.log("Running puppeteer capture...");
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new", defaultViewport: { width: 1280, height: 800 } });
    const page = await browser.newPage();
    
    await page.goto('http://127.0.0.1:4173/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.type('input[type="email"]', 'traveler@eztravel.com');
    await page.type('input[type="password"]', 'Traveler@123');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      page.click('button[type="submit"]')
    ]);

    await page.waitForTimeout(2000); // Wait for redirect to finish

    // Capture Trips List (Module 1 Verification)
    await page.goto('http://127.0.0.1:4173/trips', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    // Test clicking a trip card to navigate to Details (Module 2)
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
        if(tabs.length >= 2) {
            await tabs[1].click(); // Timeline
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/trip-detail-timeline.png', fullPage: true });
            console.log("Captured Timeline");
        }

        // Capture Destinations
        if(tabs.length >= 3) {
            await tabs[2].click(); // Destinations
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/trip-detail-destinations.png', fullPage: true });
            console.log("Captured Destinations");
        }

        // Capture Budget
        if(tabs.length >= 4) {
            await tabs[3].click(); // Budget
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/trip-detail-budget.png', fullPage: true });
            console.log("Captured Budget");
        }
    } else {
        console.log("No trips found to click.");
    }

  } catch (error) {
    console.error("Puppeteer Failed", error);
  } finally {
    if (browser) await browser.close();
    console.log("Cleaning up servers...");
    procs.forEach(p => p.kill());
    process.exit(0);
  }
}

run();
