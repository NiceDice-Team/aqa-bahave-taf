
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { LoginPage } from '../page-objects/login-page';

function getLoginPage(world: CustomWorld): LoginPage {
  return new LoginPage(world.page);
}

Given('the user opened the login page {string}', async function(this: CustomWorld, url: string) {
  await getLoginPage(this).goto(url);
});

When('the user entered Email {string}', async function(this: CustomWorld, email: string) {
  await getLoginPage(this).emailInput.fill(email);
});

When('the user entered Password {string}', async function(this: CustomWorld, password: string) {
  await getLoginPage(this).passwordInput.fill(password);
});

When('the user clicked the {string} button', async function(this: CustomWorld, button: string) {
  const loginPage = getLoginPage(this);
  const btn = button.toLowerCase();
  if (btn === 'sign in' || btn === 'login') {
    await loginPage.loginButton.click();
  } else if (btn.includes('google')) {
    await loginPage.googleLoginButton.click();
  } else if (btn.includes('facebook')) {
    await loginPage.facebookLoginButton.click();
  } else if (btn.includes('guest')) {
    await loginPage.guestLoginButton.click();
  } else {
    throw new Error(`Unknown button: ${button}`);
  }
});

When('the user clicked {string}', async function(this: CustomWorld, button: string) {
  // Alias for button click
  return await (When as any).call(this, `the user clicked the {string} button`, button);
});

Then('the system authenticates the user', async function(this: CustomWorld) {
  // Assume successful login redirects to /account or sets a cookie/token
  await expect(this.page).toHaveURL(/\/account/);
});

Then('the user is redirected to the account page {string}', async function(this: CustomWorld, url: string) {
  await expect(this.page).toHaveURL(url);
});

Then('the system shows an error {string}', async function(this: CustomWorld, error: string) {
  const msg = await getLoginPage(this).getErrorMessage();
  expect(msg).toContain(error);
});

Then('the user is not logged in', async function(this: CustomWorld) {
  // Not logged in: still on login page or error shown
  const url = this.page.url();
  expect(url).toMatch(/login/);
});

Then('the system shows errors {string} and {string}', async function(this: CustomWorld, err1: string, err2: string) {
  const msg = await getLoginPage(this).getErrorMessage();
  expect(msg).toContain(err1);
  expect(msg).toContain(err2);
});

Given('the user {string} exists in the database with is_active = false', async function(this: CustomWorld, email: string) {
  // Setup user via API
  await this.page.request.post('/api/test/setup-inactive-user', { data: { email } });
});

When('the OAuth provider authenticated the user', async function(this: CustomWorld) {
  // Simulate OAuth authentication (test env should handle this)
  // Optionally, set a cookie or mock the callback
  await this.page.evaluate(() => {
    document.cookie = 'oauth_authenticated=true';
  });
});

Then('the system logs the user in', async function(this: CustomWorld) {
  await expect(this.page).toHaveURL(/\/account/);
});

Then('the system creates a guest session', async function(this: CustomWorld) {
  // Check for guest session indicator (cookie, localStorage, or UI)
  const guest = await this.page.evaluate(() => !!window.localStorage.getItem('guestSession'));
  expect(guest).toBeTruthy();
});

Then('the user is redirected to the home page {string}', async function(this: CustomWorld, url: string) {
  await expect(this.page).toHaveURL(url);
});
