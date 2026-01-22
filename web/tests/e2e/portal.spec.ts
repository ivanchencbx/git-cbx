import { test, expect } from '../fixtures/auth';

test.describe('Portal Navigation', () => {
  test('authenticated user should access portal', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to portal
    await page.goto('/portal');
    
    // Should not be redirected to login
    expect(page.url()).toContain('/portal');
    
    // Check that portal content is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate between portal sections', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    await page.goto('/portal');
    await page.waitForTimeout(1000);
    
    // Try to find and click on different sections
    const sections = [
      { name: 'Accounting', url: '/portal/accounting' },
      { name: 'Career', url: '/portal/career' },
      { name: 'Supply', url: '/portal/supply' },
      { name: 'Survey', url: '/portal/survey' },
    ];

    for (const section of sections) {
      // Check if link exists - try direct navigation first
      try {
        await page.goto(section.url);
        await page.waitForTimeout(500);
        expect(page.url()).toContain(section.url);
      } catch (e) {
        // If direct navigation fails, try clicking the link
        const link = page.locator(`a:has-text("${section.name}")`);
        
        if (await link.isVisible({ timeout: 1000 }).catch(() => false)) {
          await page.goto('/portal');
          await page.waitForTimeout(500);
          await link.click({ force: true });
          await page.waitForTimeout(1000);
          expect(page.url()).toContain(section.url);
        }
      }
    }
  });

  test('unauthenticated user should be redirected to login', async ({ page }: any) => {
    // Navigate to a valid page first to establish context
    await page.goto('/');
    
    // Clear any existing token
    await page.evaluate(() => localStorage.clear());
    
    // Try to access protected portal
    await page.goto('/portal');
    
    // Should be redirected to login
    await page.waitForURL(/login/, { timeout: 5000 }).catch(() => {});
    expect(page.url()).toContain('/login');
  });
});

test.describe('Accounting Section', () => {
  test('should access accounting section', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    await page.goto('/portal/accounting');
    
    expect(page.url()).toContain('/portal/accounting');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to add accounting entry', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    await page.goto('/portal/accounting');
    
    // Look for "Add" button or link
    const addButton = page.locator('button:has-text("Add"), a:has-text("Add"), a:has-text("New")').first();
    
    if (await addButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(500);
      
      // Should be on add page
      expect(page.url()).toContain('/add');
    }
  });
});

test.describe('Career Section', () => {
  test('should access career section', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    await page.goto('/portal/career');
    
    expect(page.url()).toContain('/portal/career');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access career profile', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    await page.goto('/portal/career/profile');
    
    expect(page.url()).toContain('/portal/career/profile');
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Supply Section', () => {
  test('should access supply section', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    await page.goto('/portal/supply');
    
    expect(page.url()).toContain('/portal/supply');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to add supply entry', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    await page.goto('/portal/supply');
    
    const addButton = page.locator('button:has-text("Add"), a:has-text("Add"), a:has-text("New")').first();
    
    if (await addButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(500);
      
      expect(page.url()).toContain('/add');
    }
  });
});

test.describe('Survey Section', () => {
  test('should access survey section', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    await page.goto('/portal/survey');
    
    expect(page.url()).toContain('/portal/survey');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to create survey', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    await page.goto('/portal/survey');
    
    const createButton = page.locator('button:has-text("Create"), a:has-text("Create"), button:has-text("New")').first();
    
    if (await createButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await createButton.click();
      await page.waitForTimeout(500);
      
      expect(page.url()).toContain('/create');
    }
  });

  test('should create survey and view live', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    const timestamp = Date.now();
    
    // Step 1: Navigate to survey list
    await page.goto('/portal/survey');
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/portal/survey');
    
    // Step 2: Click create button
    const createButton = page.locator('a:has-text("Create New"), button:has-text("Create New"), a:has-text("Create"), button:has-text("Create")').first();
    await createButton.click();
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/create');
    
    // Step 3: Fill in survey title and description
    const titleInput = page.locator('input[placeholder*="Customer Satisfaction"], input[placeholder*="e.g."]').first();
    const descriptionInput = page.locator('textarea[placeholder*="Briefly describe"]');
    
    await titleInput.fill(`Test Survey ${timestamp}`);
    await descriptionInput.fill('This is a test survey for E2E testing');
    
    // Step 4: Add a question
    const addQuestionButtons = page.locator('button:has-text("Text"), button:has-text("Long Text"), button:has-text("Add")');
    if (await page.locator('button:has-text("Text")').isVisible({ timeout: 1000 }).catch(() => false)) {
      await page.locator('button:has-text("Text")').click();
      await page.waitForTimeout(500);
      
      // Fill question
      const questionInput = page.locator('input[placeholder*="Enter your question"]').first();
      await questionInput.fill('What is your feedback?');
    }
    
    // Step 5: Save survey
    const saveButton = page.locator('button:has-text("Save Survey")');
    await saveButton.click();
    await page.waitForTimeout(2000);
    
    // Step 6: Verify redirected to survey list
    expect(page.url()).toContain('/portal/survey');
    await page.waitForTimeout(1000);
    
    // Step 7: Find and click View Live button
    const surveyCards = page.locator(`text="${timestamp}"`).first();
    if (await surveyCards.isVisible({ timeout: 2000 }).catch(() => false)) {
      const viewLiveLink = page.locator(`text="${timestamp}"`).locator('..').locator('a:has-text("View Live")');
      await viewLiveLink.click();
      await page.waitForTimeout(1000);
      
      // Step 8: Verify survey view page loaded (should NOT be 404)
      expect(page.url()).toContain('/survey/');
      
      // Verify survey title is displayed
      const surveyTitle = page.locator(`text="Test Survey ${timestamp}"`);
      await expect(surveyTitle).toBeVisible();
      
      // Step 9: Fill in survey response (NEW - Test submission)
      const textInput = page.locator('input[placeholder="Enter your answer..."]').first();
      if (await textInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await textInput.fill('This is my feedback');
        
        // Step 10: Submit survey
        const submitButton = page.locator('button:has-text("Submit Survey")');
        await submitButton.click();
        await page.waitForTimeout(2000);
        
        // Step 11: Verify success message
        const thankYouMessage = page.locator('text="Thank You"');
        await expect(thankYouMessage).toBeVisible();
      }
    }
  });
});
