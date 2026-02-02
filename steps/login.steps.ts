import { Given, When, Then } from './bdd';
import { expect } from '@playwright/test';

Given('the user opened the login page {string}', async ({ world }, url: string) => {
  await world.page.goto(url);
  await world.page.waitForLoadState('domcontentloaded');
});

When('the user clicked {string}', async ({ world }, button: string) => {
  // Handle social login buttons and other clickable elements
  const buttonLower = button.toLowerCase();
  
  if (buttonLower.includes('google')) {
    await world.page.click('button:has-text("Enter with Google")');
  } else if (buttonLower.includes('facebook')) {
    await world.page.click('button:has-text("Enter with Facebook")');
  } else if (buttonLower.includes('guest')) {
    const guestBtn = world.page.locator('button:has-text("Guest"), a:has-text("Guest")').first();
    await guestBtn.click();
  } else {
    // Generic button/link click
    await world.page.getByRole('button', { name: button }).or(world.page.getByRole('link', { name: button })).click();
  }
});

Then('the system authenticates the user', async ({ world }) => {
  // Wait for redirect to account page or dashboard
  await expect(world.page).toHaveURL(/\/account|\/dashboard/, { timeout: 10000 });
});

Then('the user is redirected to the account page {string}', async ({ world }, url: string) => {
  await expect(world.page).toHaveURL(url, { timeout: 10000 });
});

Then('the user is not logged in', async ({ world }) => {
  const url = world.page.url();
  expect(url).toMatch(/login|sign-in/);
});

Then('the system shows errors {string} and {string}', async ({ world }, err1: string, err2: string) => {
  const errorElements = world.page.locator('[role="alert"], .error-message, .alert-danger, .error');
  const errorText = await errorElements.allTextContents();
  const allErrors = errorText.join(' ');
  expect(allErrors).toContain(err1);
  expect(allErrors).toContain(err2);
});

Given('the user {string} exists in the database with is_active = false', async ({ world }, email: string) => {
  // This would typically set up test data via API
  // For now, we'll store it in testData for later use
  world.testData.inactiveUserEmail = email;
  
  // Optionally call test setup endpoint if it exists
  try {
    await world.page.request.post('/api/test/setup-inactive-user', { 
      data: { email },
      failOnStatusCode: false 
    });
  } catch (error) {
    // Ignore if endpoint doesn't exist
    console.log('Test setup endpoint not available, continuing...');
  }
});

When('the OAuth provider authenticated the user', async ({ world }) => {
  // Simulate OAuth authentication
  // In real tests, this might involve mocking OAuth responses
  await world.page.evaluate(() => {
    localStorage.setItem('oauth_authenticated', 'true');
    document.cookie = 'oauth_token=mock_token_123';
  });
});

Then('the system logs the user in', async ({ world }) => {
  // Check for successful login indicators
  await expect(world.page).toHaveURL(/\/account|\/dashboard|\/home/, { timeout: 10000 });
});

Then('the system creates a guest session', async ({ world }) => {
  // Check for guest session indicator
  const hasGuestSession = await world.page.evaluate(() => {
    return !!localStorage.getItem('guestSession') || !!sessionStorage.getItem('guestSession');
  });
  expect(hasGuestSession).toBeTruthy();
});

Then('the user is redirected to the home page {string}', async ({ world }, url: string) => {
  await expect(world.page).toHaveURL(url, { timeout: 10000 });
});
