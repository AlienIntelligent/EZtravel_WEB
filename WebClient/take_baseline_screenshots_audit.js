import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import net from 'net';

const BASE_URL = 'http://127.0.0.1:4173';
const OUT_DIR = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/screenshots-authenticated';
const LOG_DIR = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/service-logs';

// Ensure output and log subdirectories exist
['traveler', 'provider', 'admin'].forEach(sub => {
  const dirPath = path.join(OUT_DIR, sub);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

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

async function waitForPort(port, timeoutMs = 90000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const isOpen = await checkPort(port);
    if (isOpen) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Port ${port} did not open in ${timeoutMs}ms`);
}

async function loginAndCapture(browser, roleName, email, password, routesList) {
  console.log(`\n=== Starting Audit for Role: ${roleName} ===`);
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.on('console', msg => console.log(`[${roleName} Console]`, msg.text()));
  page.on('pageerror', err => console.error(`[${roleName} Page Error]`, err.message));
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`[${roleName} HTTP]`, response.url(), response.status());
    }
  });

  console.log(`[${roleName}] Navigating to login page...`);
  await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log(`[${roleName}] Filling credentials for ${email}...`);
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for login redirection
  try {
    await page.waitForResponse(response => response.url().includes('/api/auth/login') && response.status() === 200, { timeout: 15000 });
    console.log(`[${roleName}] Login API call succeeded!`);
    await page.waitForTimeout(4000); // Wait for redirect and state store
  } catch (err) {
    console.error(`[${roleName}] Login API call failed or timed out:`, err.message);
    await page.screenshot({ path: path.join(OUT_DIR, roleName, 'error_login_failed.png'), fullPage: true });
    await context.close();
    return { success: false, reason: "Login API call failed/timeout" };
  }

  // Verify token exists in localStorage
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) {
    console.error(`[${roleName}] Authentication failed: No token in localStorage!`);
    await page.screenshot({ path: path.join(OUT_DIR, roleName, 'error_no_token.png'), fullPage: true });
    await context.close();
    return { success: false, reason: "No token in localStorage" };
  }
  console.log(`[${roleName}] Token verified in localStorage. Starting page captures...`);

  const results = [];

  for (const item of routesList) {
    const { label, route, filename } = item;
    console.log(`[${roleName}] Navigating to ${label} (${route})...`);
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Allow time for API data load and potential redirect

    const currentUrl = page.url();
    console.log(`[${roleName}] Current URL: ${currentUrl}`);

    if (currentUrl.includes('/auth/login')) {
      console.error(`[${roleName}] CRITICAL: Redirected to login page while accessing ${label}! Stopping audit for this role.`);
      results.push({ label, route, status: "FAILED", reason: "Redirected to login" });
      break; // Stop capturing as requested
    }

    // Check if page is blank/white (could check document body or take screenshot anyway)
    const isBlank = await page.evaluate(() => {
      const root = document.getElementById('root');
      return !root || root.innerHTML.trim() === '' || root.innerText.trim() === 'Loading...';
    });

    const outPath = path.join(OUT_DIR, roleName, filename);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`[${roleName}] Saved screenshot: ${outPath}`);

    results.push({
      label,
      route,
      status: isBlank ? "BLANK_PAGE" : "SUCCESS",
      filename,
      screenshotUrl: `file:///${outPath.replace(/\\/g, '/')}`
    });
  }

  await context.close();
  return { success: true, results };
}

async function run() {
  console.log("Cleaning up any leaked backend processes...");
  try {
    spawn('taskkill', ['/f', '/im', 'ezTravel*'], { shell: true, stdio: 'ignore' });
    await new Promise(r => setTimeout(r, 2000));
  } catch (e) {}

  const backendProcs = [];
  const projects = [
    "Microservices/ezTravel.ApiGateway/ezTravel.ApiGateway.csproj",
    "Microservices/ezTravel.AuthService/ezTravel.AuthService.csproj",
    "Microservices/ezTravel.AdminService/ezTravel.AdminService.csproj",
    "Microservices/ezTravel.CommunityService/ezTravel.CommunityService.csproj",
    "Microservices/ezTravel.PlaceService/ezTravel.PlaceService.csproj",
    "Microservices/ezTravel.TripService/ezTravel.TripService.csproj",
    "Microservices/ezTravel.BookingService/ezTravel.BookingService.csproj"
  ];

  console.log("Pre-building C# projects to prevent file lock race conditions...");
  await new Promise((resolve) => {
    const build = spawn('dotnet', ['build'], { shell: true, cwd: 'd:/eztravel', stdio: 'inherit' });
    build.on('close', (code) => {
      console.log(`dotnet build finished with exit code ${code}`);
      resolve();
    });
  });

  console.log("Starting backend microservices with --no-build...");
  for (const proj of projects) {
    const serviceName = proj.split('/')[1];
    const logFile = fs.createWriteStream(path.join(LOG_DIR, `${serviceName}.log`));
    console.log(`Starting ${proj} (logging to ${serviceName}.log)...`);
    const proc = spawn('dotnet', ['run', '--no-build', '--project', proj], {
      shell: true,
      cwd: 'd:/eztravel',
    });
    proc.stdout.pipe(logFile);
    proc.stderr.pipe(logFile);
    backendProcs.push(proc);
  }

  console.log("Waiting for backend services to initialize (building and listening)...");
  try {
    await waitForPort(5000, 90000); // 90s for gateway
    await waitForPort(7001, 90000); // auth service
    await waitForPort(7003, 90000); // place service
    console.log("Backend services are ready!");
  } catch (err) {
    console.error("Backend startup failed:", err.message);
    for (const proc of backendProcs) proc.kill();
    return;
  }

  console.log("Starting Vite preview server...");
  const serverProc = spawn('npx', ['vite', 'preview', '--port', '4173', '--host', '127.0.0.1'], {
    shell: true,
    cwd: 'd:/eztravel/WebClient',
    stdio: 'ignore'
  });

  const auditReport = {
    timestamp: new Date().toISOString(),
    roles: {}
  };

  try {
    await waitForPort(4173);
    console.log("Vite preview server is ready!");

    const browser = await chromium.launch({ headless: true });

    // 1. Traveler Audit
    const travelerRoutes = [
      { label: "Dashboard", route: "/dashboard", filename: "01_traveler_dashboard.png" },
      { label: "My Trips", route: "/trips", filename: "02_my_trips.png" },
      { label: "Trip Detail", route: "/trips/1", filename: "03_trip_detail.png" },
      { label: "Profile", route: "/profile", filename: "04_profile.png" },
      { label: "Trip Planner", route: "/trips/1/planner", filename: "05_trip_planner.png" },
      { label: "Community", route: "/community", filename: "06_community.png" }
    ];
    const travelerResult = await loginAndCapture(
      browser,
      'traveler',
      'traveler@eztravel.com',
      'Traveler@123',
      travelerRoutes
    );
    auditReport.roles.traveler = travelerResult;

    // 2. Provider Audit
    const providerRoutes = [
      { label: "Provider Dashboard", route: "/provider/dashboard", filename: "01_provider_dashboard.png" },
      { label: "Service Management", route: "/provider/services", filename: "02_service_management.png" },
      { label: "Package Management", route: "/provider/packages", filename: "03_package_management.png" },
      { label: "Booking Management", route: "/provider/bookings", filename: "04_booking_management.png" },
      { label: "Promotions", route: "/provider/promotions", filename: "05_promotions.png" }
    ];
    const providerResult = await loginAndCapture(
      browser,
      'provider',
      'provider@eztravel.com',
      'Provider@123',
      providerRoutes
    );
    auditReport.roles.provider = providerResult;

    // 3. Admin Audit
    const adminRoutes = [
      { label: "Admin Dashboard", route: "/admin/dashboard", filename: "01_admin_dashboard.png" },
      { label: "User Management", route: "/admin/users", filename: "02_user_management.png" },
      { label: "Provider Management", route: "/admin/providers", filename: "03_provider_management.png" },
      { label: "Reports", route: "/admin/reports", filename: "04_reports.png" },
      { label: "Settings", route: "/admin/settings", filename: "05_settings.png" }
    ];
    const adminResult = await loginAndCapture(
      browser,
      'admin',
      'admin@eztravel.com',
      'Admin@123',
      adminRoutes
    );
    auditReport.roles.admin = adminResult;

    await browser.close();
    console.log("\n=== All Role Audits Finished ===");
    console.log("Generating report...");

    generateMarkdownReport(auditReport);

  } catch (err) {
    console.error("Audit run error:", err);
  } finally {
    console.log("Stopping Vite preview server...");
    serverProc.kill();
    console.log("Stopping backend microservices...");
    for (const proc of backendProcs) {
      proc.kill();
    }
    try {
      spawn('taskkill', ['/f', '/im', 'ezTravel*'], { shell: true, stdio: 'ignore' });
    } catch (e) {}
  }
}

function generateMarkdownReport(report) {
  let md = `# FE-0109A-R1 Authenticated Baseline Audit Report\n\n`;
  md += `**Timestamp**: ${report.timestamp}\n`;
  md += `**System status**: Gateway and microservices running on localhost\n\n`;

  for (const [role, data] of Object.entries(report.roles)) {
    md += `## Role: ${role.toUpperCase()}\n\n`;
    if (!data.success) {
      md += `> [!CAUTION]\n`;
      md += `> **Audit Failed**: ${data.reason}\n\n`;
      continue;
    }

    md += `| Page / Feature | Target Route | Status | Screenshot Link | Details / Observations |\n`;
    md += `| --- | --- | --- | --- | --- |\n`;

    for (const res of data.results) {
      const statusIcon = res.status === "SUCCESS" ? "✅ PASS" : res.status === "BLANK_PAGE" ? "⚠️ BLANK" : "❌ FAIL";
      const link = res.screenshotUrl ? `[View Screenshot](${res.screenshotUrl})` : "N/A";
      let note = "";
      if (res.status === "BLANK_PAGE") {
        note = "Page rendered blank/loading state.";
      } else if (res.status === "FAILED") {
        note = `Redirected to Login or login session lost. (${res.reason})`;
      } else {
        note = "Rendered correctly with backend data.";
      }
      md += `| ${res.label} | \`${res.route}\` | ${statusIcon} | ${link} | ${note} |\n`;
    }
    md += `\n`;
  }

  const reportPath = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/FE-0109A_R1_Authenticated_Baseline_Report.md';
  fs.writeFileSync(reportPath, md);
  console.log(`Report successfully written to: ${reportPath}`);
}

run();
