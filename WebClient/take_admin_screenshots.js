import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import net from 'net';

const BASE_URL = 'http://127.0.0.1:4173';
const OUT_DIR = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/screenshots-authenticated';
const LOG_DIR = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/service-logs';

['admin'].forEach(sub => {
  const dirPath = path.join(OUT_DIR, sub);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

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

async function waitForPort(port, timeoutMs = 90000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    if (await checkPort(port)) return true;
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error(`Port ${port} did not open in ${timeoutMs}ms`);
}

async function safeGoto(page, url, roleName) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  } catch (e) {
    console.log(`[${roleName}] networkidle timeout, continuing with domcontentloaded fallback for: ${url}`);
    try {
      await page.goto(url, { waitUntil: 'commit', timeout: 10000 });
    } catch (e2) {
      console.error(`[${roleName}] Navigation completely failed for ${url}:`, e2.message);
    }
  }
}

async function loginAndCaptureAdmin(browser) {
  const roleName = 'admin';
  const email = 'admin@eztravel.com';
  const password = 'Admin@123';

  console.log(`\n=== Starting Audit for Role: ${roleName} ===`);
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('JQMIGRATE')) console.log(`[${roleName} Console]`, text.substring(0, 200));
  });
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`[${roleName} HTTP]`, response.url().replace(BASE_URL, ''), response.status());
    }
  });

  console.log(`[${roleName}] Navigating to login page...`);
  await safeGoto(page, `${BASE_URL}/auth/login`, roleName);
  await page.waitForTimeout(2000);

  console.log(`[${roleName}] Filling credentials for ${email}...`);
  try {
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button[type="submit"]');
  } catch (e) {
    console.error(`[${roleName}] Could not fill login form:`, e.message);
    await page.screenshot({ path: path.join(OUT_DIR, roleName, 'error_form_fill.png'), fullPage: true });
    await context.close();
    return { success: false, reason: 'Could not fill login form' };
  }

  // Wait for login API response
  try {
    await page.waitForResponse(
      r => r.url().includes('/api/auth/login') && r.status() === 200,
      { timeout: 15000 }
    );
    console.log(`[${roleName}] Login API call succeeded!`);
    await page.waitForTimeout(3000);
  } catch (err) {
    console.error(`[${roleName}] Login API call failed:`, err.message);
    await page.screenshot({ path: path.join(OUT_DIR, roleName, 'error_login_failed.png'), fullPage: true });
    await context.close();
    return { success: false, reason: 'Login API call failed/timeout' };
  }

  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) {
    console.error(`[${roleName}] No token in localStorage after login!`);
    await page.screenshot({ path: path.join(OUT_DIR, roleName, 'error_no_token.png'), fullPage: true });
    await context.close();
    return { success: false, reason: 'No token in localStorage' };
  }
  console.log(`[${roleName}] Token verified. Starting captures...`);

  const routes = [
    { label: 'Admin Dashboard', route: '/admin/dashboard', filename: '01_admin_dashboard.png' },
    { label: 'User Management', route: '/admin/users', filename: '02_user_management.png' },
    { label: 'Provider Management', route: '/admin/providers', filename: '03_provider_management.png' },
    { label: 'Reports', route: '/admin/reports', filename: '04_reports.png' },
    { label: 'Settings', route: '/admin/settings', filename: '05_settings.png' },
  ];

  const results = [];
  for (const { label, route, filename } of routes) {
    console.log(`[${roleName}] Navigating to ${label} (${route})...`);
    await safeGoto(page, `${BASE_URL}${route}`, roleName);
    await page.waitForTimeout(2500);

    const currentUrl = page.url();
    console.log(`[${roleName}] Current URL: ${currentUrl}`);

    if (currentUrl.includes('/auth/login')) {
      console.error(`[${roleName}] Redirected to login on ${label}!`);
      results.push({ label, route, status: 'FAILED', reason: 'Redirected to login' });
      break;
    }

    const isBlank = await page.evaluate(() => {
      const root = document.getElementById('root');
      return !root || root.innerHTML.trim() === '' || root.innerText.trim() === 'Loading...';
    });

    const outPath = path.join(OUT_DIR, roleName, filename);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`[${roleName}] Saved: ${outPath}`);

    results.push({
      label, route,
      status: isBlank ? 'BLANK_PAGE' : 'SUCCESS',
      filename,
      screenshotUrl: `file:///${outPath.replace(/\\/g, '/')}`
    });
  }

  await context.close();
  return { success: true, results };
}

async function run() {
  console.log('Cleaning up leaked backend processes...');
  try {
    spawn('taskkill', ['/f', '/im', 'dotnet.exe'], { shell: true, stdio: 'ignore' });
    await new Promise(r => setTimeout(r, 3000));
  } catch (e) {}

  const backendProcs = [];
  const projects = [
    'Microservices/ezTravel.ApiGateway/ezTravel.ApiGateway.csproj',
    'Microservices/ezTravel.AuthService/ezTravel.AuthService.csproj',
    'Microservices/ezTravel.AdminService/ezTravel.AdminService.csproj',
    'Microservices/ezTravel.CommunityService/ezTravel.CommunityService.csproj',
    'Microservices/ezTravel.PlaceService/ezTravel.PlaceService.csproj',
    'Microservices/ezTravel.TripService/ezTravel.TripService.csproj',
    'Microservices/ezTravel.BookingService/ezTravel.BookingService.csproj',
  ];

  console.log('Pre-building C# projects...');
  await new Promise(resolve => {
    const build = spawn('dotnet', ['build'], { shell: true, cwd: 'd:/eztravel', stdio: 'inherit' });
    build.on('close', code => { console.log(`dotnet build exit code ${code}`); resolve(); });
  });

  console.log('Starting microservices with --no-build...');
  for (const proj of projects) {
    const serviceName = proj.split('/')[1];
    const logFile = fs.createWriteStream(path.join(LOG_DIR, `${serviceName}_admin.log`));
    const proc = spawn('dotnet', ['run', '--no-build', '--project', proj], {
      shell: true, cwd: 'd:/eztravel',
    });
    proc.stdout.pipe(logFile);
    proc.stderr.pipe(logFile);
    backendProcs.push(proc);
    console.log(`Started ${serviceName}`);
  }

  console.log('Waiting for backend services...');
  try {
    await waitForPort(5000, 90000);
    await waitForPort(7001, 90000);
    console.log('Backend ready!');
  } catch (err) {
    console.error('Backend startup failed:', err.message);
    for (const proc of backendProcs) proc.kill();
    return;
  }

  console.log('Starting Vite preview...');
  const serverProc = spawn('npx', ['vite', 'preview', '--port', '4173', '--host', '127.0.0.1'], {
    shell: true, cwd: 'd:/eztravel/WebClient', stdio: 'ignore'
  });

  try {
    await waitForPort(4173, 30000);
    console.log('Vite preview ready!');

    const browser = await chromium.launch({ headless: true });
    const adminResult = await loginAndCaptureAdmin(browser);
    await browser.close();

    console.log('\n=== Admin Audit Result ===');
    console.log(JSON.stringify(adminResult, null, 2));

    // Append to existing report
    const reportPath = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/24d0dd50-d453-47fe-8a54-77e9596afba7/FE-0109A_R1_Authenticated_Baseline_Report.md';
    let existing = '';
    try { existing = fs.readFileSync(reportPath, 'utf-8'); } catch(e) {}

    const adminSection = generateAdminSection(adminResult);
    // Replace existing admin section or append
    if (existing.includes('## Role: ADMIN')) {
      const updated = existing.replace(/## Role: ADMIN[\s\S]*?(?=## Role:|$)/m, adminSection + '\n\n');
      fs.writeFileSync(reportPath, updated);
    } else {
      fs.appendFileSync(reportPath, '\n\n' + adminSection);
    }
    console.log(`Report updated: ${reportPath}`);

  } catch (err) {
    console.error('Admin audit error:', err);
  } finally {
    console.log('Shutting down...');
    serverProc.kill();
    for (const proc of backendProcs) proc.kill();
    try { spawn('taskkill', ['/f', '/im', 'dotnet.exe'], { shell: true, stdio: 'ignore' }); } catch(e) {}
  }
}

function generateAdminSection(data) {
  let md = `## Role: ADMIN\n\n`;
  if (!data.success) {
    md += `> [!CAUTION]\n> **Audit Failed**: ${data.reason}\n`;
    return md;
  }
  md += `| Page / Feature | Target Route | Status | Screenshot Link | Details |\n`;
  md += `| --- | --- | --- | --- | --- |\n`;
  for (const res of data.results) {
    const icon = res.status === 'SUCCESS' ? '✅ PASS' : res.status === 'BLANK_PAGE' ? '⚠️ BLANK' : '❌ FAIL';
    const link = res.screenshotUrl ? `[View](${res.screenshotUrl})` : 'N/A';
    const note = res.status === 'SUCCESS' ? 'Rendered correctly.' : res.status === 'BLANK_PAGE' ? 'Blank/loading state.' : res.reason;
    md += `| ${res.label} | \`${res.route}\` | ${icon} | ${link} | ${note} |\n`;
  }
  return md;
}

run();
