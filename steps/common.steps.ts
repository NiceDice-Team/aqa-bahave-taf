import { When, Then } from './bdd';
import { expect } from '@playwright/test';

// Generic button click - handles most buttons
When('the user clicked the {string} button', async ({ world }, buttonText: string) => {
  // Special mappings for common button texts
  const buttonMap: Record<string, string> = {
    'Create Account': 'REGISTER',
    'Login': 'SIGN IN',
    'Sign In': 'SIGN IN',
    'Reset Password': 'RESET PASSWORD',
    'Confirm': 'CONFIRM',
    'Place Order': 'PLACE ORDER',
    'Cancel Order': 'CANCEL ORDER',
    'Pay': 'PAY',
    'Apply': 'APPLY',
  };
  
  const targetText = buttonMap[buttonText] || buttonText;
  
  const selectors = [
    `button:has-text("${targetText}")`,
    `button[type="submit"]:has-text("${targetText}")`,
    `input[type="submit"][value="${targetText}"]`,
    `a:has-text("${targetText}")`,
  ];
  
  for (const selector of selectors) {
    const element = world.page.locator(selector).first();
    if (await element.count() > 0) {
      // Wait for button to be enabled before clicking
      await element.waitFor({ state: 'visible', timeout: 15000 });
      await element.click({ force: false, timeout: 15000 });
      return;
    }
  }
  
  // Fallback: click any clickable element with the text
  await world.page.getByRole('button', { name: targetText }).click();
});

// Generic form inputs
When('the user entered Email {string}', async ({ world }, email: string) => {
  const emailInput = world.page.locator('input[name="email"], input[id="email"]');
  await emailInput.fill(email);
});

When('the user entered Password {string}', async ({ world }, password: string) => {
  const passwordInput = world.page.locator('input[name="password"], input[id="password"]');
  await passwordInput.fill(password);
});

When('the user entered First Name {string}', async ({ world }, firstName: string) => {
  const firstNameInput = world.page.locator('input[name="firstname"], input[id="firstname"]');
  await firstNameInput.fill(firstName);
});

When('the user entered Last Name {string}', async ({ world }, lastName: string) => {
  const lastNameInput = world.page.locator('input[name="lastname"], input[id="lastname"]');
  await lastNameInput.fill(lastName);
});

// Generic error message check
Then('the system shows an error {string}', async ({ world }, errorMessage: string) => {
  const errorElement = world.page.locator('[role="alert"], .error-message, .alert-danger, .error, .invalid-feedback').first();
  await expect(errorElement).toContainText(errorMessage, { timeout: 10000 });
});
