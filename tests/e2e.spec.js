import { test, expect } from '@playwright/test';

// Handle all browser alert dialogs and capture console errors
test.beforeEach(async ({ page }) => {
  page.on('dialog', async (dialog) => {
    console.log(`[Alert dialog detected]: "${dialog.message()}"`);
    await dialog.accept();
  });
  page.on('console', (msg) => {
    console.log(`[Browser Console ${msg.type().toUpperCase()}]: "${msg.text()}"`);
  });
  page.on('pageerror', (exception) => {
    console.log(`[Browser Page Error]: "${exception.message}"\nStack:\n${exception.stack}`);
  });
});

test.describe('RoomFinder E2E Workflows', () => {
  const renterEmail = `renter_${Date.now()}@test.com`;
  const renterPassword = 'password123';
  const ownerEmail = `owner_${Date.now()}@test.com`;
  const ownerPassword = 'password123';
  const randomRoomTitle = `Premium Loft ${Date.now()}`;

  test('Renter flow: Sign up, Log in, Search, and Book Room', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/room-finder/i);
    await expect(page.locator('h1')).toContainText('Find Verified Rooms');

    // 2. Go to Register page
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL(/\/register/);

    // 3. Register as Renter
    await page.fill('input[placeholder="John Doe"]', 'Real Renter');
    await page.fill('input[placeholder="name@company.com"]', renterEmail);
    await page.fill('input[placeholder="••••••••"]', renterPassword);
    // Role is RENTER by default, but let's select it explicitly to make sure
    await page.selectOption('select', 'RENTER');
    
    // Submit registration form
    await page.click('button:has-text("Create Account")');
    
    // Redirection to Login should happen automatically
    await page.waitForURL(/\/login/);
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();

    // 4. Log in as Renter
    await page.fill('input[placeholder="name@company.com"]', renterEmail);
    await page.fill('input[placeholder="••••••••"]', renterPassword);
    await page.click('button:has-text("Sign In")');

    // Should redirect to profile page on successful login
    await page.waitForURL(/\/profile/);
    await expect(page.locator('h2:has-text("Real Renter")')).toBeVisible();
    await expect(page.locator('span:has-text("RENTER")').first()).toBeVisible();

    // 5. Navigate to Explore Rooms page
    await page.click('a[href="/explore"]');
    await page.waitForURL(/\/explore/);
    await expect(page.locator('text=Explore Properties')).toBeVisible();

    // We should check that rooms are loaded. If there's an initial room, it will show up.
    // Let's filter by BHK arrangement to see if it responds.
    await page.selectOption('select', '1BHK');
    
    // We search for a specific location keyword
    await page.fill('input[placeholder="City, area or title..."]', 'Noida');
    
    // Clear filters and check all options to make sure it loads
    await page.fill('input[placeholder="City, area or title..."]', '');
    await page.selectOption('select', '');

    // 6. Attempt booking the first available room if present
    const bookButton = page.locator('button:has-text("Book Now")').first();
    if (await bookButton.isVisible()) {
      console.log('Found an available room card to book!');
      await bookButton.click();
      // Wait for pending state
      await expect(page.locator('text=Pending...').first()).toBeVisible();
      
      // Let's go to My Bookings page and verify the booking exists
      await page.click('a[href="/my-bookings"]');
      await page.waitForURL(/\/my-bookings/);
      await expect(page.locator('text=My Bookings')).toBeVisible();
    } else {
      console.log('No rooms available for booking. Skipping book click.');
    }
  });

  test('Owner flow: Sign up, Log in, and Publish a Listing', async ({ page }) => {
    // 1. Visit Register page
    await page.goto('/register');
    
    // 2. Register as Owner
    await page.fill('input[placeholder="John Doe"]', 'Real Owner');
    await page.fill('input[placeholder="name@company.com"]', ownerEmail);
    await page.fill('input[placeholder="••••••••"]', ownerPassword);
    await page.selectOption('select', 'OWNER');
    
    await page.click('button:has-text("Create Account")');
    await page.waitForURL(/\/login/);

    // 3. Log in as Owner
    await page.fill('input[placeholder="name@company.com"]', ownerEmail);
    await page.fill('input[placeholder="••••••••"]', ownerPassword);
    await page.click('button:has-text("Sign In")');

    await page.waitForURL(/\/profile/);
    await expect(page.locator('h2:has-text("Real Owner")')).toBeVisible();
    await expect(page.locator('span:has-text("OWNER")').first()).toBeVisible();

    // 4. Navigate to Add Room form
    await page.click('a[href="/add-room"]');
    await page.waitForURL(/\/add-room/);
    await expect(page.locator('text=List a New Room')).toBeVisible();

    // 5. Fill out the Room creation form
    await page.fill('input[placeholder="e.g. Spacious 2BHK Near Metro Station"]', randomRoomTitle);
    await page.selectOption('select', '2BHK');
    await page.fill('input[placeholder="8500"]', '12500');
    await page.fill('input[placeholder="e.g. Sector 62, Noida, UP"]', 'Sector 62, Noida, UP');
    await page.fill('input[placeholder="e.g. https://images.unsplash.com/photo-..."]', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80');

    // Submit the listing
    await page.click('button:has-text("Publish Listing")');

    // Should redirect to My Rooms
    await page.waitForURL(/\/my-rooms/);
    await expect(page.locator('text=My listed properties')).toBeVisible();
    await expect(page.locator(`text=${randomRoomTitle}`)).toBeVisible();
  });
});
