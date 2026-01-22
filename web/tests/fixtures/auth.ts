import { test as base, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface TestUser {
  email: string;
  password: string;
  phone?: string;
  fullName?: string;
}

interface AuthFixtures {
  authenticatedPage: any;
  testUser: TestUser;
  cleanupUser: (email: string) => Promise<void>;
}

/**
 * Generate unique test user credentials
 */
function generateTestUser(suffix?: string): TestUser {
  const timestamp = Date.now();
  const randomSuffix = suffix || Math.random().toString(36).substring(7);
  
  return {
    email: `testuser${timestamp}${randomSuffix}@test.com`,
    password: 'TestPassword123!@#',
    phone: `1${timestamp.toString().slice(-9)}`,
    fullName: `Test User ${timestamp}`,
  };
}

/**
 * API helper to cleanup test data
 */
async function cleanupUser(email: string): Promise<void> {
  try {
    // This could call a cleanup endpoint if available
    // For now, data will be cleaned up with DB fixtures
    console.log(`Marked user ${email} for cleanup`);
  } catch (error) {
    console.error(`Failed to cleanup user ${email}:`, error);
  }
}

/**
 * Custom fixture that provides authenticated page and test utilities
 */
export const test = base.extend<AuthFixtures>({
  testUser: async ({}, use: (user: TestUser) => Promise<void>) => {
    const user = generateTestUser();
    await use(user);
  },

  authenticatedPage: async ({ page, testUser }: any, use: (page: any) => Promise<void>) => {
    // Register and login a test user
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    
    // Submit registration (if phone and name fields exist)
    const phoneInput = await page.$('input[name="phone"]');
    if (phoneInput) {
      await page.fill('input[name="phone"]', testUser.phone!);
    }
    
    const nameInput = await page.$('input[name="fullName"]');
    if (nameInput) {
      await page.fill('input[name="fullName"]', testUser.fullName!);
    }
    
    // Look for any registration button and click it
    const registerButton = page.locator('button:has-text("Create Account")');
    if (await registerButton.isVisible()) {
      await registerButton.click();
      // Wait for navigation or success message
      await page.waitForURL(/login|portal/, { timeout: 5000 }).catch(() => {});
    }

    // Now login
    await page.goto('/login');
    
    await page.fill('input[id="username"]', testUser.email);
    await page.fill('input[id="password"]', testUser.password);
    
    const loginButton = page.locator('button:has-text("Log In")').first();
    await loginButton.click();
    
    // Wait for login to complete
    await page.waitForURL(/portal|dashboard/, { timeout: 10000 }).catch(() => {});
    
    // Verify authentication by checking localStorage
    const token = await page.evaluate(() => localStorage.getItem('cbx_token'));
    expect(token).toBeTruthy();

    // Provide authenticated page
    await use(page);

    // Cleanup after test
    await cleanupUser(testUser.email);
  },

  cleanupUser: async ({}, use: (func: (email: string) => Promise<void>) => Promise<void>) => {
    await use(cleanupUser);
  },
});

export { expect };
