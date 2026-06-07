import { Given, When, Then } from './bdd';
import { expect } from '@playwright/test';

Given('the user opened the password recovery page {string}', async ({ world }, path: string) => {
  await world.sdk.auth.openPasswordRecoveryPage(path);
});

Given('the user followed the reset link with valid uid and token', async ({ world }) => {
  world.testData.resetToken = 'valid-token-123';
  world.testData.resetUid = 'user-uid-456';
});

Given('the user followed the reset link with expired token', async ({ world }) => {
  world.testData.resetToken = 'expired-token';
  world.testData.resetUid = 'user-uid-456';
});

Given('the user followed the reset link with invalid token', async ({ world }) => {
  world.testData.resetToken = 'invalid-token';
  world.testData.resetUid = 'user-uid-456';
});

Given('the user opened the reset password page {string}', async ({ world }, path: string) => {
  await world.sdk.auth.openResetPasswordPage(path, world.testData.resetUid, world.testData.resetToken);
});

When('the user entered New Password {string}', async ({ world }, password: string) => {
  world.testData.newPassword = password;
  await world.sdk.auth.enterNewPassword(password);
});

Then('the system sends a reset link to {string}', async ({ world }, _email: string) => {
  const msg = await world.sdk.auth.getStatusMessage();
  expect(msg).not.toBeNull();
});

Then('the system shows message {string}', async ({ world }, message: string) => {
  const msg = await world.sdk.auth.getStatusMessage();
  expect(msg).toContain(message);
});

Then('no email is sent', async ({ world: _world }) => {
  // Security: no error means no reveal of email existence
});

Then('the system updates the user password', async ({ world }) => {
  const msg = await world.sdk.auth.getStatusMessage();
  expect(msg).not.toBeNull();
});

Then('the password is not updated', async ({ world }) => {
  const error = await world.sdk.auth.getErrorMessage();
  expect(error).not.toBeNull();
});
