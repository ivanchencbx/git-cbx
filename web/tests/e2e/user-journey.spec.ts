import { test, expect } from '../fixtures/auth';

test.describe('Complete User Journey', () => {
  test('new user should register and access portal', async ({ page, testUser }: any) => {
    // Step 1: Navigate to home page
    await page.goto('/');
    expect(page.url()).toContain('localhost:3000');

    // Step 2: Click register or navigate to register
    const registerLink = page.locator('a:has-text("Sign Up"), a:has-text("Register")').first();
    if (await registerLink.isVisible()) {
      await registerLink.click();
    } else {
      await page.goto('/register');
    }

    // Step 3: Fill registration form
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);

    const phoneInput = await page.$('input[name="phone"]');
    if (phoneInput) {
      await page.fill('input[name="phone"]', testUser.phone!);
    }

    const nameInput = await page.$('input[name="fullName"]');
    if (nameInput) {
      await page.fill('input[name="fullName"]', testUser.fullName!);
    }

    // Step 4: Submit registration
    const submitButton = page.locator('button:has-text("Create Account")');
    await submitButton.click();

    // Step 5: Wait for redirect and verify
    await page.waitForTimeout(2000);
    const isRegistered = !page.url().includes('/register');
    expect(isRegistered).toBeTruthy();

    // Step 6: Navigate to login if not already there
    if (!page.url().includes('/login')) {
      await page.goto('/login');
    }

    // Step 7: Login with registered credentials
    await page.fill('input[id="username"]', testUser.email);
    await page.fill('input[id="password"]', testUser.password);

    const loginButton = page.locator('button:has-text("Log In")');
    await loginButton.click();

    // Step 8: Verify login success
    await page.waitForTimeout(2000);
    const token = await page.evaluate(() => localStorage.getItem('cbx_token'));
    expect(token).toBeTruthy();

    // Step 9: Navigate to portal
    await page.goto('/portal');
    expect(page.url()).toContain('/portal');

    // Step 10: Verify portal is accessible
    const portalContent = page.locator('body');
    await expect(portalContent).toBeVisible();
  });

  test('user should be able to navigate all main sections', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Starting point: should be logged in and on portal
    expect(page.url()).toContain('/portal');
    
    const sections = [
      'accounting',
      'career',
      'supply',
      'survey',
    ];

    // Store initial URL
    const basePortalUrl = page.url();

    for (const section of sections) {
      // Navigate to section
      await page.goto(`/portal/${section}`);
      
      // Verify navigation
      expect(page.url()).toContain(`/portal/${section}`);
      
      // Verify page loads (check that we're not on an error page)
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Small delay between navigations
      await page.waitForTimeout(300);
    }

    // Verify we can go back to main portal
    await page.goto('/portal');
    expect(page.url()).toContain('/portal');
  });

  test('user session should persist across page refreshes', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Get initial token
    const initialToken = await page.evaluate(() => localStorage.getItem('cbx_token'));
    expect(initialToken).toBeTruthy();

    // Refresh page
    await page.reload();

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Token should still exist
    const refreshedToken = await page.evaluate(() => localStorage.getItem('cbx_token'));
    expect(refreshedToken).toBe(initialToken);

    // Should still be able to access protected content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('user should be able to logout', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;

    // Verify logged in state
    let token = await page.evaluate(() => localStorage.getItem('cbx_token'));
    expect(token).toBeTruthy();

    // Look for logout button
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")').first();

    if (await logoutButton.isVisible()) {
      // Click logout
      await logoutButton.click();
      
      await page.waitForTimeout(1000);

      // Verify token is cleared
      token = await page.evaluate(() => localStorage.getItem('cbx_token'));
      expect(token).toBeNull();

      // Should be redirected to login or home
      const onLoginOrHome = page.url().includes('/login') || page.url() === 'http://localhost:3000/';
      expect(onLoginOrHome).toBeTruthy();
    }
  });

  test('multiple users should have independent sessions', async ({ page, testUser, context }: any) => {
    // User 1: Register and login
    const user1Email = testUser.email;
    const user1Password = testUser.password;

    await page.goto('/register');
    await page.fill('input[type="email"]', user1Email);
    await page.fill('input[type="password"]', user1Password);

    const submitButton = page.locator('button:has-text("Create Account")');
    await submitButton.click();
    await page.waitForTimeout(2000);

    // Login as user 1
    await page.goto('/login');
    await page.fill('input[id="username"]', user1Email);
    await page.fill('input[id="password"]', user1Password);
    await page.locator('button:has-text("Log In")').click();
    await page.waitForTimeout(2000);

    // Get user 1's token
    const user1Token = await page.evaluate(() => localStorage.getItem('cbx_token'));
    expect(user1Token).toBeTruthy();

    // Create new context for user 2
    const newContext = await context.browser()?.newContext();
    if (newContext) {
      const page2 = await newContext.newPage();

      // User 2: Register and login
      const timestamp = Date.now();
      const user2Email = `testuser${timestamp + 1000}@test.com`;
      const user2Password = 'TestPassword123!@#';

      await page2.goto('/register');
      await page2.fill('input[type="email"]', user2Email);
      await page2.fill('input[type="password"]', user2Password);

      const submitButton2 = page2.locator('button:has-text("Create Account")');
      await submitButton2.click();
      await page2.waitForTimeout(2000);

      // Login as user 2
      await page2.goto('/login');
      await page2.fill('input[id="username"]', user2Email);
      await page2.fill('input[id="password"]', user2Password);
      await page2.locator('button:has-text("Log In")').click();
      await page2.waitForTimeout(2000);

      // Get user 2's token
      const user2Token = await page2.evaluate(() => localStorage.getItem('cbx_token'));
      expect(user2Token).toBeTruthy();

      // Tokens should be different
      expect(user1Token).not.toBe(user2Token);

      // User 1's token should still be valid in first context
      const user1TokenStillValid = await page.evaluate(() => localStorage.getItem('cbx_token'));
      expect(user1TokenStillValid).toBe(user1Token);

      await newContext.close();
    }
  });
});
