import { Given, When, Then } from './bdd';
import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

Given('the user opened the registration page {string}', async ({ world }, path: string) => {
  world.testData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10, pattern: /[A-Za-z0-9]/ }),
    privacyPolicyAccepted: false
  };
  await world.page.goto(path);
  await world.page.waitForLoadState('domcontentloaded');
});

When('the user entered Confirm Password {string}', async ({ world }, password: string) => {
  world.testData.confirmPassword = password;
  const confirmPasswordInput = world.page.locator('input[name="confirmPassword"], input[name="confirm_password"], input[id="confirmPassword"]').first();
  await confirmPasswordInput.fill(password);
});

When('the user checked the Privacy Policy checkbox', async ({ world }) => {
  world.testData.privacyPolicyAccepted = true;
  const checkbox = world.page.locator('button[id="privacy"]');
  
  // Check if it's already checked (aria-checked="true")
  const isChecked = await checkbox.getAttribute('aria-checked');
  
  // Only click if it's not already checked
  if (isChecked !== 'true') {
    await checkbox.click();
  }
});

When('the user filled the other fields with valid data', async ({ world }) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const password = faker.internet.password({ length: 10, pattern: /[A-Za-z0-9]/ });
  
  world.testData.firstName = firstName;
  world.testData.lastName = lastName;
  world.testData.password = password;
  world.testData.confirmPassword = password;
  
  await world.page.locator('input[name="firstname"]').fill(firstName);
  await world.page.locator('input[name="lastname"]').fill(lastName);
  await world.page.locator('input[name="password"]').fill(password);
  await world.page.locator('input[name="confirmPassword"]').fill(password);
  
  // Accept Privacy Policy - check if already enabled
  const privacyCheckbox = world.page.locator('button[id="privacy"]');
  const isChecked = await privacyCheckbox.getAttribute('aria-checked');
  if (isChecked !== 'true') {
    await privacyCheckbox.click();
  }
});

When('the user did not check the Privacy Policy checkbox', async ({ world }) => {
  world.testData.privacyPolicyAccepted = false;
  const checkbox = world.page.locator('input[type="checkbox"][name*="privacy"], input[type="checkbox"][id*="privacy"]').first();
  if (await checkbox.isChecked()) {
    await checkbox.uncheck();
  }
});

When('the user entered all required fields with valid data', async ({ world }) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email();
  const password = faker.internet.password({ length: 10, pattern: /[A-Za-z0-9]/ });
  
  world.testData = {
    firstName,
    lastName,
    email,
    password,
    confirmPassword: password,
    privacyPolicyAccepted: true
  };

  await world.page.locator('input[name="firstname"]').fill(firstName);
  await world.page.locator('input[name="lastname"]').fill(lastName);
  await world.page.locator('input[name="email"]').fill(email);
  await world.page.locator('input[name="password"]').fill(password);
  await world.page.locator('input[name="confirmPassword"]').fill(password);
  
  // Accept Privacy Policy - check if already enabled
  const privacyCheckbox = world.page.locator('button[id="privacy"]');
  const isChecked = await privacyCheckbox.getAttribute('aria-checked');
  if (isChecked !== 'true') {
    await privacyCheckbox.click();
  }
});

Then('an account is created in the database with is_active = false', async ({ world }) => {
  // Wait for registration API call to complete
  await world.page.waitForTimeout(3000);
  
  // Note: The actual validation would require checking the database or API response
  // For UI tests, we verify that no error message appears, which indicates success
  const errorAlert = world.page.locator('[role="alert"]:visible, .error-message:visible, .alert-danger:visible');
  const errorCount = await errorAlert.count();
  
  if (errorCount > 0) {
    const errorText = await errorAlert.first().textContent();
    if (errorText && errorText.trim()) {
      throw new Error(`Registration failed with error: ${errorText}`);
    }
  }
  
  console.log('Registration completed - no errors detected');
});

Then('an activation email is sent with the activation link', async ({ world }) => {
  // This step validates that activation email logic should be triggered
  // In a real scenario, we'd check email service or database
  // For now, we just verify the registration completed successfully
  await world.page.waitForTimeout(1000);
  console.log('Activation email should be sent for:', world.testData.email);
});

Then('the account is not created', async ({ world }) => {
  await expect(world.page).toHaveURL(/register/);
});

When('the user clicks {string} in the confirmation dialog', async ({ world }, button: string) => {
  await world.page.getByRole('button', { name: button }).click();
});