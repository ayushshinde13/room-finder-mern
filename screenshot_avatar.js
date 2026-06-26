import { chromium } from '@playwright/test';

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  const email = `avatar_test_${Date.now()}@test.com`;

  // Register
  await page.goto('http://localhost:3000/register');
  await page.fill('input[placeholder="John Doe"]', 'Avatar Tester');
  await page.fill('input[placeholder="name@company.com"]', email);
  await page.fill('input[placeholder="••••••••"]', 'password123');
  await page.selectOption('select', 'RENTER');
  await page.click('button:has-text("Create Account")');
  await page.waitForURL(/\/login/);

  // Login
  await page.fill('input[placeholder="name@company.com"]', email);
  await page.fill('input[placeholder="••••••••"]', 'password123');
  await page.click('button:has-text("Sign In")');
  await page.waitForURL(/\/profile/);
  await page.waitForTimeout(1000);

  // Open avatar modal by clicking the avatar
  await page.click('.group.cursor-pointer');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/avatar_modal_people.png' });
  console.log('✅ Avatar modal (People tab) captured');

  // Click Fun tab
  await page.click('button:has-text("Fun")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'screenshots/avatar_modal_fun.png' });
  console.log('✅ Avatar modal (Fun tab) captured');

  // Click Abstract tab
  await page.click('button:has-text("Abstract")');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'screenshots/avatar_modal_abstract.png' });
  console.log('✅ Avatar modal (Abstract tab) captured');

  // Click an avatar to preview it
  await page.click('button:has-text("People")');
  await page.waitForTimeout(300);
  const firstAvatar = page.locator('.grid .cursor-pointer').first();
  await firstAvatar.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'screenshots/avatar_preview.png' });
  console.log('✅ Avatar preview captured');

  await browser.close();
  console.log('\n🎉 Done!');
};

run().catch(console.error);
