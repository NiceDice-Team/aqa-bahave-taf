import { When, Then } from './bdd';
import { expect } from '@playwright/test';

When('the user clicked the {string} button', async ({ world }, buttonText: string) => {
  await world.sdk.auth.clickButton(buttonText);
});

When('the user entered Email {string}', async ({ world }, email: string) => {
  await world.sdk.auth.enterEmail(email);
});

When('the user entered Password {string}', async ({ world }, password: string) => {
  await world.sdk.auth.enterPassword(password);
});

When('the user entered First Name {string}', async ({ world }, firstName: string) => {
  await world.sdk.auth.enterFirstName(firstName);
});

When('the user entered Last Name {string}', async ({ world }, lastName: string) => {
  await world.sdk.auth.enterLastName(lastName);
});

Then('the system shows an error {string}', async ({ world }, errorMessage: string) => {
  const msg = await world.sdk.auth.getErrorMessage();
  const shown = msg !== null && msg.toLowerCase().includes(errorMessage.toLowerCase());
  expect(shown).toBe(true);
});
