const { chromium } = require('playwright');

async function testAudioBrowser() {
  console.log('Starting Playwright Chrome test...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Dismiss first-visit onboarding if present by seeding localStorage
  await page.addInitScript(() => {
    window.localStorage.setItem('yaqeen_onboarding_completed', 'true');
    window.localStorage.setItem('yaqeen_tour_seen', 'true');
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  console.log('Homepage loaded');

  // Verify Wide Logo is rendered on Homepage
  const logoWide = page.locator('img[alt="يقين | قرآن كريم"]');
  await logoWide.waitFor({ state: 'visible', timeout: 5000 });
  console.log('Wide logo verified on homepage');

  // Navigate to /radio and click an active station
  await page.goto('http://localhost:4173/radio', { waitUntil: 'domcontentloaded' });
  console.log('Radio page loaded');

  const cairoRadio = page.locator('button:has-text("إذاعة القرآن الكريم (القاهرة)")');
  await cairoRadio.waitFor({ state: 'visible', timeout: 5000 });
  await cairoRadio.click();
  console.log('Clicked Cairo Radio play button');

  // Check if GlobalAudioPlayer is mounted
  const audioPlayer = page.locator('div[role="region"][aria-label="مشغل الصوت العام"]');
  await audioPlayer.waitFor({ state: 'visible', timeout: 5000 });
  console.log('GlobalAudioPlayer mounted and visible');

  // Expand player controls
  const expandBtn = page.locator('button[aria-label="توسيع المشغل"]');
  if (await expandBtn.isVisible()) {
    await expandBtn.click();
    console.log('Expanded audio player controls');
  }

  // Verify Car Mode launcher
  const carBtn = page.locator('button:has-text("وضع القيادة")').first();
  await carBtn.waitFor({ state: 'visible', timeout: 3000 });
  await carBtn.click();
  console.log('Car Mode button clicked');

  // Verify Car Mode Modal
  const carModal = page.locator('div[role="dialog"][aria-label="وضع القيادة والسيارة"]');
  await carModal.waitFor({ state: 'visible', timeout: 3000 });
  console.log('Car Mode modal is active and visible');

  // Take Car Mode screenshot
  await page.screenshot({ path: 'scripts/screenshot_car_mode.png' });
  console.log('Saved Car Mode screenshot to scripts/screenshot_car_mode.png');

  // Exit Car Mode
  const exitCarBtn = carModal.locator('button:has-text("خروج")');
  await exitCarBtn.click();
  await carModal.waitFor({ state: 'detached', timeout: 3000 });
  console.log('Exited Car Mode');

  // Open Offline Audio Drawer
  const offlineBtn = page.locator('button:has-text("بدون إنترنت")').first();
  await offlineBtn.click();
  const offlineDrawer = page.locator('div[role="dialog"][aria-label="إدارة الاستماع بدون إنترنت"]');
  await offlineDrawer.waitFor({ state: 'visible', timeout: 3000 });
  console.log('Offline Audio Drawer is visible');

  // Close Offline Drawer with close button
  const closeOfflineBtn = offlineDrawer.locator('button').first();
  await closeOfflineBtn.click();
  await offlineDrawer.waitFor({ state: 'detached', timeout: 3000 });
  console.log('Closed Offline Drawer');

  // Open Queue Drawer
  const queueBtn = page.locator('button:has-text("قائمة الانتظار")').first();
  await queueBtn.click();
  const queueDrawer = page.locator('div[role="dialog"][aria-label="قائمة الانتظار وقوائم التشغيل"]');
  await queueDrawer.waitFor({ state: 'visible', timeout: 3000 });
  console.log('Queue Drawer is visible');

  const closeQueueBtn = queueDrawer.locator('button').first();
  await closeQueueBtn.click();
  await queueDrawer.waitFor({ state: 'detached', timeout: 3000 });
  console.log('Closed Queue Drawer');

  // Open Diagnostics Modal
  const diagBtn = page.locator('button:has-text("فحص البث")').first();
  await diagBtn.click();
  const diagModal = page.locator('div[role="dialog"][aria-label="لوحة فحص جودة وتشخيص الصوت"]');
  await diagModal.waitFor({ state: 'visible', timeout: 3000 });
  console.log('Audio Diagnostics Modal is visible');

  // Click Ping button
  const pingBtn = diagModal.locator('button:has-text("فحص استجابة الرابط")');
  if (await pingBtn.isVisible()) {
    await pingBtn.click();
    console.log('Clicked Ping button');
  }

  // Close Diagnostics
  const closeDiagBtn = diagModal.locator('button').first();
  await closeDiagBtn.click();
  await diagModal.waitFor({ state: 'detached', timeout: 3000 });
  console.log('Closed Diagnostics Modal');

  // Take Final Audio Experience Screenshot
  await page.screenshot({ path: 'scripts/screenshot_audio_experience.png' });
  console.log('Saved audio experience screenshot to scripts/screenshot_audio_experience.png');

  await browser.close();
  console.log('All Playwright tests passed successfully!');
}

testAudioBrowser().catch((err) => {
  console.error(err);
  process.exit(1);
});
