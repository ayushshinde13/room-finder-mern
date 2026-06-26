import { chromium } from '@playwright/test';

const baseURL = 'http://localhost:3000';

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  // 1. Homepage
  await page.goto(`${baseURL}/`);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/01_home.png', fullPage: false });
  console.log('✅ Home page captured');

  // 2. Register page
  await page.goto(`${baseURL}/register`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/02_register.png', fullPage: false });
  console.log('✅ Register page captured');

  // 3. Login page
  await page.goto(`${baseURL}/login`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/03_login.png', fullPage: false });
  console.log('✅ Login page captured');

  // 4. Log in as a renter to access protected pages
  const email = `ss_renter_${Date.now()}@test.com`;
  await page.goto(`${baseURL}/register`);
  await page.fill('input[placeholder="John Doe"]', 'Screenshot User');
  await page.fill('input[placeholder="name@company.com"]', email);
  await page.fill('input[placeholder="••••••••"]', 'password123');
  await page.selectOption('select', 'RENTER');
  await page.click('button:has-text("Create Account")');
  await page.waitForURL(/\/login/);

  await page.fill('input[placeholder="name@company.com"]', email);
  await page.fill('input[placeholder="••••••••"]', 'password123');
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/\/profile/);

  // 5. Profile page
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/04_profile.png', fullPage: false });
  console.log('✅ Profile page captured');

  // 6. Explore page
  await page.goto(`${baseURL}/explore`);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/05_explore.png', fullPage: false });
  console.log('✅ Explore page captured');

  // 7. My Bookings page
  await page.goto(`${baseURL}/my-bookings`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/06_my_bookings.png', fullPage: false });
  console.log('✅ My Bookings page captured');

  await browser.close();
  console.log('\n🎉 All screenshots saved to screenshots/ folder');
};

run().catch(console.error);
