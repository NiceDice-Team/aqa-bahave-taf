import { Given, When, Then } from './bdd';
import { expect } from '@playwright/test';

Given('the user opened the login page {string}', async ({ world }, url: string) => {
  await world.sdk.auth.openLoginPage(url);
});

When(
  /^the user clicked "(Sign in with Google|Sign in with Facebook|Continue as Guest)"$/,
  async ({ world }, button: string) => {
    const lower = button.toLowerCase();
    if (lower.includes('google')) {
      await world.sdk.auth.loginWithOAuth('google');
    } else if (lower.includes('facebook')) {
      await world.sdk.auth.loginWithOAuth('facebook');
    } else {
      await world.sdk.auth.continueAsGuest();
    }
  }
);

Then('the system authenticates the user', async ({ world }) => {
  expect(await world.sdk.auth.isAuthenticated()).toBe(true);
});

Then('the user can go to the account page {string}', async ({ world }, url: string) => {
  await world.sdk.auth.navigateToAccountPage();
  await expect(world.page).toHaveURL(url, { timeout: 10000 });
});

Then('the user is not logged in', async ({ world }) => {
  expect(await world.sdk.auth.isAuthenticated()).toBe(false);
});

Then('the system shows errors {string} and {string}', async ({ world }, err1: string, err2: string) => {
  const errors = await world.sdk.auth.getValidationErrors();
  const joined = errors.join(' ');
  expect(joined).toContain(err1);
  expect(joined).toContain(err2);
});

Given('the user {string} exists in the database with is_active = false', async ({ world }, email: string) => {
  world.testData.inactiveUserEmail = email;
  try {
    await world.page.request.post('/api/test/setup-inactive-user', {
      data: { email },
      failOnStatusCode: false,
    });
  } catch {
    // Ignore if endpoint doesn't exist
  }
});

When('the OAuth provider authenticated the user', async ({ world }) => {
  await world.page.evaluate(() => {
    localStorage.setItem('oauth_authenticated', 'true');
    document.cookie = 'oauth_token=mock_token_123';
  });
});

Then('the system logs the user in', async ({ world }) => {
  await expect(world.page).toHaveURL(/\/account|\/dashboard|\/home/, { timeout: 10000 });
});

Then('the system creates a guest session', async ({ world }) => {
  const hasGuestSession = await world.page.evaluate(
    () => !!localStorage.getItem('guestSession') || !!sessionStorage.getItem('guestSession')
  );
  expect(hasGuestSession).toBeTruthy();
});

Then('the user is redirected to the home page {string}', async ({ world }, url: string) => {
  await expect(world.page).toHaveURL(url, { timeout: 10000 });
});
