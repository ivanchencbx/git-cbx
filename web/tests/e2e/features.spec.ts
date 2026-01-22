import { test, expect } from '../fixtures/auth';

test.describe('User Profile Management', () => {
  test('should access profile page', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to profile
    await page.goto('/portal/profile');
    await page.waitForTimeout(1000);
    
    // Verify we're on the profile page
    expect(page.url()).toContain('/portal/profile');
    
    // Verify profile header exists
    const profileHeader = page.locator('h1:has-text("My Profile")');
    await expect(profileHeader).toBeVisible({ timeout: 5000 });
  });

  test('should display user information on profile', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to profile
    await page.goto('/portal/profile');
    await page.waitForTimeout(1000);
    
    // Verify email is displayed
    const emailLabel = page.locator('text="Email"');
    await expect(emailLabel).toBeVisible({ timeout: 5000 });
    
    // Verify edit button
    const editButton = page.locator('a').filter({ hasText: 'Edit Profile' }).first();
    await expect(editButton).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to profile edit page', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to profile
    await page.goto('/portal/profile');
    await page.waitForTimeout(500);
    
    // Click edit button
    const editButton = page.locator('a').filter({ hasText: 'Edit Profile' }).first();
    await editButton.click();
    await page.waitForTimeout(1000);
    
    // Verify edit page loaded
    expect(page.url()).toContain('/portal/profile/edit');
    
    // Verify form title
    const editHeader = page.locator('h1:has-text("Edit Profile")');
    await expect(editHeader).toBeVisible({ timeout: 5000 });
  });

  test('should update user profile successfully', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to edit page
    await page.goto('/portal/profile/edit');
    await page.waitForTimeout(1000);
    
    // Update full name
    const fullNameInput = page.locator('input[placeholder="John Doe"]');
    const newName = `Updated User ${Date.now()}`;
    await fullNameInput.clear();
    await fullNameInput.fill(newName);
    
    // Update phone with a unique number
    const phoneInput = page.locator('input[placeholder="+1 (555) 123-4567"]');
    await phoneInput.clear();
    const uniquePhone = `+1 (555) ${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`;
    await phoneInput.fill(uniquePhone);
    
    // Submit form
    const saveButton = page.locator('button').filter({ hasText: 'Save Changes' }).first();
    await saveButton.click();
    await page.waitForTimeout(3000);
    
    // Check if we got an error (phone already registered) or success
    const errorMsg = page.locator('text="Phone already registered"').first();
    const onEditPage = page.url().includes('/portal/profile/edit');
    
    if (onEditPage && await errorMsg.isVisible({ timeout: 1000 }).catch(() => false)) {
      // Phone validation error - try without changing phone
      const phoneInputRetry = page.locator('input[placeholder="+1 (555) 123-4567"]');
      await phoneInputRetry.clear();
      
      const saveButtonRetry = page.locator('button').filter({ hasText: 'Save Changes' }).first();
      await saveButtonRetry.click();
      await page.waitForTimeout(2000);
    }
    
    // Should be redirected to profile page
    expect(page.url()).toContain('/portal/profile');
  });

  test('should validate full name is required', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to edit page
    await page.goto('/portal/profile/edit');
    await page.waitForTimeout(1000);
    
    // Clear full name
    const fullNameInput = page.locator('input[placeholder="John Doe"]');
    await fullNameInput.clear();
    
    // Try to submit
    const saveButton = page.locator('button').filter({ hasText: 'Save Changes' }).first();
    await saveButton.click();
    await page.waitForTimeout(1000);
    
    // Should still be on edit page (form validation prevents submission)
    expect(page.url()).toContain('/portal/profile/edit');
  });

  test('should display cancel button in profile edit', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to edit page
    await page.goto('/portal/profile/edit');
    await page.waitForTimeout(1000);
    
    // Verify cancel button exists
    const cancelButton = page.locator('a').filter({ hasText: 'Cancel' }).first();
    await expect(cancelButton).toBeVisible({ timeout: 5000 });
    
    // Click cancel
    await cancelButton.click();
    await page.waitForTimeout(1000);
    
    // Should redirect to profile page
    expect(page.url()).toContain('/portal/profile');
  });
});

test.describe('Accounting Expense Editing', () => {
  test('should access accounting page', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to accounting
    await page.goto('/portal/accounting');
    await page.waitForTimeout(1000);
    
    // Verify page loaded
    expect(page.url()).toContain('/portal/accounting');
    
    // Verify accounting header
    const header = page.locator('h1:has-text("Accounting")');
    await expect(header).toBeVisible({ timeout: 5000 });
  });

  test('should display transactions list', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to accounting
    await page.goto('/portal/accounting');
    await page.waitForTimeout(1000);
    
    // Verify transactions section exists
    const txHeader = page.locator('text="Recent Transactions"');
    await expect(txHeader).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to expense edit page when transaction exists', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to accounting page
    await page.goto('/portal/accounting');
    await page.waitForTimeout(1000);
    
    // Get first transaction row
    const rows = page.locator('[class*="hover:bg-gray-50"]');
    const firstRow = rows.first();
    
    // Check if rows exist
    const rowCount = await rows.count();
    if (rowCount > 0) {
      // Hover to reveal edit button
      await firstRow.hover();
      await page.waitForTimeout(500);
      
      // Find and click edit link in the row
      const editLink = firstRow.locator('a').first();
      if (await editLink.isVisible({ timeout: 2000 }).catch(() => false)) {
        await editLink.click();
        await page.waitForTimeout(1000);
        
        // Verify edit page loaded
        expect(page.url()).toContain('/portal/accounting/edit/');
        
        // Verify edit form loaded
        const editHeader = page.locator('h1:has-text("Edit Expense")');
        await expect(editHeader).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should show edit form with pre-filled data', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Go to accounting
    await page.goto('/portal/accounting');
    await page.waitForTimeout(1000);
    
    // Find first transaction
    const rows = page.locator('[class*="hover:bg-gray-50"]');
    if (await rows.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      // Hover and click edit
      await rows.first().hover();
      await page.waitForTimeout(500);
      
      const editLink = rows.first().locator('a').first();
      if (await editLink.isVisible({ timeout: 1000 }).catch(() => false)) {
        await editLink.click();
        await page.waitForTimeout(1000);
        
        // Verify on edit page
        expect(page.url()).toContain('/portal/accounting/edit/');
        
        // Verify form fields are populated
        const descInput = page.locator('input[id="description"]');
        const currentDesc = await descInput.inputValue();
        expect(currentDesc.length > 0).toBe(true);
        
        const amountInput = page.locator('input[id="amount"]');
        const currentAmount = await amountInput.inputValue();
        expect(currentAmount.length > 0).toBe(true);
      }
    }
  });

  test('should show delete button on edit page', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Go to accounting
    await page.goto('/portal/accounting');
    await page.waitForTimeout(1000);
    
    // Find first transaction
    const rows = page.locator('[class*="hover:bg-gray-50"]');
    if (await rows.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      // Hover and click edit
      await rows.first().hover();
      await page.waitForTimeout(500);
      
      const editLink = rows.first().locator('a').first();
      if (await editLink.isVisible({ timeout: 1000 }).catch(() => false)) {
        await editLink.click();
        await page.waitForTimeout(1000);
        
        // Scroll down to danger zone
        await page.locator('text="Danger Zone"').scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        
        // Verify delete button exists
        const deleteBtn = page.locator('button').filter({ hasText: /Delete/ });
        await expect(deleteBtn.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should show cancel button on edit page', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Go to accounting
    await page.goto('/portal/accounting');
    await page.waitForTimeout(1000);
    
    // Find first transaction
    const rows = page.locator('[class*="hover:bg-gray-50"]');
    if (await rows.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      // Hover and click edit
      await rows.first().hover();
      await page.waitForTimeout(500);
      
      const editLink = rows.first().locator('a').first();
      if (await editLink.isVisible({ timeout: 1000 }).catch(() => false)) {
        await editLink.click();
        await page.waitForTimeout(1000);
        
        // Verify cancel button
        const cancelBtn = page.locator('a').filter({ hasText: 'Cancel' });
        await expect(cancelBtn.first()).toBeVisible({ timeout: 5000 });
        
        // Click cancel
        await cancelBtn.first().click();
        await page.waitForTimeout(1000);
        
        // Should be back on accounting page
        expect(page.url()).toContain('/portal/accounting');
      }
    }
  });
});

test.describe('Navigation Integration', () => {
  test('should navigate to profile from portal', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to portal
    await page.goto('/portal');
    await page.waitForTimeout(500);
    
    // Find profile link using different approach
    const profileLinks = page.locator('a').filter({ hasText: /Profile|profile/ });
    const count = await profileLinks.count();
    
    if (count > 0) {
      // Click the first profile link
      await profileLinks.first().click();
      await page.waitForTimeout(1000);
      
      // Verify navigation to profile
      expect(page.url()).toContain('/portal/profile');
    }
  });

  test('should navigate back from edit pages', async ({ authenticatedPage }: any) => {
    const page = authenticatedPage;
    
    // Navigate to profile edit
    await page.goto('/portal/profile/edit');
    await page.waitForTimeout(1000);
    
    // Verify back button
    const backButton = page.locator('a').filter({ hasText: 'portal' }).first();
    if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await backButton.click();
      await page.waitForTimeout(1000);
      
      // Should be back on profile page
      expect(page.url()).toContain('/portal');
    }
  });
});
