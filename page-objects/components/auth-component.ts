import { Locator, Page } from '@playwright/test';

export class AuthComponent {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly googleLoginButton: Locator;
  readonly facebookLoginButton: Locator;

  constructor(page: Page) {
    this.page = page;
  this.emailInput = page.getByPlaceholder('Enter email address');
  this.passwordInput = page.getByPlaceholder('Enter password');
    // Prefer test ids for OAuth buttons (stable across text changes)
    this.googleLoginButton = page.locator('[data-testid="google-auth-button"]');
    this.facebookLoginButton = page.locator('[data-testid="facebook-auth-button"]');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async loginWithGoogle() {
    await this.googleLoginButton.click();
  }

  async loginWithFacebook() {
    await this.facebookLoginButton.click();
  }
}