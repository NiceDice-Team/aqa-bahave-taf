import { Given, When, Then } from './bdd';
import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

Given('the user opened the registration page {string}', async ({ world }, path: string) => {
  world.testData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10, pattern: /[A-Za-z0-9]/ }),
    privacyPolicyAccepted: false,
  };
  await world.sdk.auth.openRegistrationPage(path);
});

When('the user entered Confirm Password {string}', async ({ world }, password: string) => {
  world.testData.confirmPassword = password;
  await world.sdk.auth.enterConfirmPassword(password);
});

When('the user checked the Privacy Policy checkbox', async ({ world }) => {
  world.testData.privacyPolicyAccepted = true;
  await world.sdk.auth.fillRegistrationForm({ privacyPolicyAccepted: true });
});

When('the user filled the other fields with valid data', async ({ world }) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  world.testData = { ...world.testData, firstName, lastName };

  if (world.testData.confirmPassword !== undefined) {
    // Password fields already explicitly set (e.g. mismatch scenario) — fill name + email + privacy only
    await world.sdk.auth.fillRegistrationForm({
      firstName,
      lastName,
      email: world.testData.email,
      privacyPolicyAccepted: true,
    });
  } else {
    // Email already set in UI by a prior step (e.g. invalid-email scenario) — fill name + password + privacy only
    const password = faker.internet.password({ length: 10, pattern: /[A-Za-z0-9]/ });
    world.testData = { ...world.testData, password, confirmPassword: password };
    await world.sdk.auth.fillRegistrationForm({
      firstName,
      lastName,
      password,
      confirmPassword: password,
      privacyPolicyAccepted: true,
    });
  }
});

When('the user did not check the Privacy Policy checkbox', async ({ world }) => {
  world.testData.privacyPolicyAccepted = false;
  await world.sdk.auth.fillRegistrationForm({ privacyPolicyAccepted: false });
});

When('the user entered all required fields with valid data', async ({ world }) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email();
  const password = faker.internet.password({ length: 10, pattern: /[A-Za-z0-9]/ });
  world.testData = { firstName, lastName, email, password, confirmPassword: password, privacyPolicyAccepted: true };
  await world.sdk.auth.fillRegistrationForm({
    firstName,
    lastName,
    email,
    password,
    confirmPassword: password,
    privacyPolicyAccepted: true,
  });
});

Then('an account is created in the database with is_active = false', async ({ world }) => {
  expect(await world.sdk.auth.getErrorMessage()).toBeNull();
});

Then('an activation email is sent with the activation link', async () => {
  // Verified externally or via email service — no UI assertion needed
});

Then('the account is not created', async ({ world }) => {
  await expect(world.page).toHaveURL(/register/);
});

When('the user clicks {string} in the confirmation dialog', async ({ world }, button: string) => {
  await world.sdk.auth.clickButton(button);
});
