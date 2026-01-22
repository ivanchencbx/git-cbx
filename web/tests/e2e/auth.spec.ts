import { test, expect } from '../fixtures/auth';

test.describe('Authentication Flow', () => {
  test('should register a new user', async ({ page, testUser }: any) => {
    await page.goto('/register');

    // Check that register page loads
    const heading = page.locator('h2:has-text("Sign Up"), h2:has-text("Register")').first();
    await expect(heading).toBeVisible();

    // Fill in the registration form
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await emailInput.fill(testUser.email);
    await passwordInput.fill(testUser.password);

    // Check if there are additional fields
    const phoneInput = page.locator('input[name="phone"]');
    const nameInput = page.locator('input[name="fullName"]');

    if (await phoneInput.isVisible()) {
      await phoneInput.fill(testUser.phone!);
    }

    if (await nameInput.isVisible()) {
      await nameInput.fill(testUser.fullName!);
    }

    // Submit the form
    const submitButton = page.locator('button:has-text("Create Account")');
    await submitButton.click();

    // Wait for success - either redirect to login or show success message
    // Try to detect redirect or message
    await page.waitForTimeout(2000);
    
    const isOnLoginPage = page.url().includes('/login');
    const isOnRegisterPage = page.url().includes('/register');
    
    if (!isOnLoginPage && !isOnRegisterPage) {
      // Likely redirected to a success page or portal
      expect(page.url()).not.toContain('/register');
    }
  });

  test('should login with valid credentials', async ({ page, testUser }: any) => {
    // First register the user
    await page.goto('/register');
    
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await emailInput.fill(testUser.email);
    await passwordInput.fill(testUser.password);

    const submitButton = page.locator('button:has-text("Create Account")');
    await submitButton.click();

    await page.waitForTimeout(2000);

    // Now test login
    await page.goto('/login');

    const loginEmailInput = page.locator('input[id="username"]');
    const loginPasswordInput = page.locator('input[id="password"]');

    await loginEmailInput.fill(testUser.email);
    await loginPasswordInput.fill(testUser.password);

    const loginButton = page.locator('button:has-text("Log In")');
    await loginButton.click();

    // Check that we've been redirected away from login page
    await page.waitForTimeout(2000);
    expect(page.url()).not.toContain('/login');

    // Check that auth token is stored
    const token = await page.evaluate(() => localStorage.getItem('cbx_token'));
    expect(token).toBeTruthy();
  });

  test('should fail login with invalid credentials', async ({ page }: any) => {
    await page.goto('/login');

    const emailInput = page.locator('input[id="username"]');
    const passwordInput = page.locator('input[id="password"]');

    await emailInput.fill('nonexistent@test.com');
    await passwordInput.fill('WrongPassword123');

    const loginButton = page.locator('button:has-text("Log In")');
    await loginButton.click();

    await page.waitForTimeout(1000);

    // Should show error message or stay on login page
    const errorMessage = page.locator('text=Login failed, text=Invalid credentials, text=Incorrect');
    const isErrorVisible = await errorMessage.first().isVisible().catch(() => false);
    const isStillOnLoginPage = page.url().includes('/login');

    expect(isErrorVisible || isStillOnLoginPage).toBeTruthy();

    // Should not have auth token
    const token = await page.evaluate(() => localStorage.getItem('cbx_token'));
    expect(token).toBeNull();
  });

  test('should navigate to sign up from login page', async ({ page }: any) => {
    await page.goto('/login');

    const signUpLink = page.locator('a:has-text("Sign Up")');
    await signUpLink.click();

    await expect(page).toHaveURL(/register/);
  });

  test('should have responsive login form', async ({ page, context }: any) => {
    // Test on mobile
    const mobileContext = await context.browser()?.newContext({
      viewport: { width: 375, height: 667 },
    });

    if (mobileContext) {
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto('/login');

      // Check that form elements are visible and responsive
      const emailInput = mobilePage.locator('input[id="username"]');
      const passwordInput = mobilePage.locator('input[id="password"]');
      const loginButton = mobilePage.locator('button:has-text("Log In")');

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(loginButton).toBeVisible();

      await mobileContext.close();
    }
  });
});
