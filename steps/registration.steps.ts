import { Given, When, Then } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { faker } from '@faker-js/faker';


Given('the user opened the registration page {string}', async function (this: CustomWorld, path: string) {
  this.testData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10, pattern: /[A-Za-z0-9]/ }),
    privacyPolicyAccepted: false
  };
  await this.sdk.auth.openRegistrationPage(path);
});

When('the user entered First Name {string}', async function (this: CustomWorld, firstName: string) {
  this.testData.firstName = firstName || faker.person.firstName();
  await this.sdk.auth.enterFirstName(this.testData.firstName);
});

When('the user entered Last Name {string}', async function (this: CustomWorld, lastName: string) {
  this.testData.lastName = lastName || faker.person.lastName();
  await this.sdk.auth.enterLastName(this.testData.lastName);
});

When('the user entered Email {string}', async function (this: CustomWorld, email: string) {
  this.testData.email = email || faker.internet.email();
  await this.sdk.auth.enterEmail(this.testData.email);
});

When('the user entered Password {string}', async function (this: CustomWorld, password: string) {
  this.testData.password = password || faker.internet.password({ length: 10, pattern: /[A-Za-z0-9]/ });
  await this.sdk.auth.enterPassword(this.testData.password);
});

When('the user entered Confirm Password {string}', async function (this: CustomWorld, password: string) {
  this.testData.confirmPassword = password || this.testData.password;
  await this.sdk.auth.enterConfirmPassword(this.testData.confirmPassword);
});

When('the user checked the Privacy Policy checkbox', async function (this: CustomWorld) {
  this.testData.privacyPolicyAccepted = true;
  await this.sdk.auth.setPrivacyPolicyAcceptance(true);
});

When('the user clicked the {string} button', async function (this: CustomWorld, buttonText: string) {
  await this.sdk.auth.clickButton(buttonText);
});

When('the user filled the other fields with valid data', async function (this: CustomWorld) {
  this.testData = {
    ...this.testData,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password({ length: 10, pattern: /[A-Za-z0-9]/ }),
  };
  await this.sdk.auth.fillRegistrationForm({
    firstName: this.testData.firstName,
    lastName: this.testData.lastName,
    password: this.testData.password,
    confirmPassword: this.testData.password
  });
});

When('the user did not check the Privacy Policy checkbox', async function (this: CustomWorld) {
  this.testData.privacyPolicyAccepted = false;
  await this.sdk.auth.setPrivacyPolicyAcceptance(false);
});

When('the user entered all required fields with valid data', async function (this: CustomWorld) {
  // Generate random test data
  this.testData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10, pattern: /[A-Za-z0-9]/ }),
    privacyPolicyAccepted: true
  };

  await this.sdk.auth.fillRegistrationForm({
    firstName: this.testData.firstName,
    lastName: this.testData.lastName,
    email: this.testData.email,
    password: this.testData.password,
    confirmPassword: this.testData.password,
    privacyPolicyAccepted: this.testData.privacyPolicyAccepted
  });
});

Then('an account is created in the database with is_active = false', async function (this: CustomWorld) {
  const status = await this.sdk.auth.getRegistrationStatus(this.testData.email);
  expect(status.statusMessage.toLowerCase()).toBe('registration successful');
  expect(status.isActive).toBe(false);
});

Then('an activation email is sent with the activation link', async function (this: CustomWorld) {
  await this.sdk.auth.resendVerificationEmail(this.testData.email);
  const message = await this.sdk.auth.getActivationMessage();
  expect(message).toMatch(/Please check your email/);
});

Then('the system shows an error {string}', async function (this: CustomWorld, errorMessage: string) {
  const errors = await this.sdk.auth.getValidationErrors();
  expect(errors).toContain(errorMessage);
});

Then('the account is not created', async function (this: CustomWorld) {
  const status = await this.sdk.auth.getRegistrationStatus(this.testData.email);
  expect(status.isRegistered).toBe(false);
});

When('the user clicks {string} in the confirmation dialog', async function (this: CustomWorld, button: string) {
  await this.sdk.auth.handleConfirmationDialog(button);
});