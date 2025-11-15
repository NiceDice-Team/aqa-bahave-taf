import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { AuthComponent } from './components/auth-component';

export class LoginPage extends BasePage {
  readonly auth: AuthComponent;
  readonly loginHeading: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly errorMessage: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly googleLoginButton: Locator;
  readonly facebookLoginButton: Locator;
  readonly guestLoginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.auth = new AuthComponent(page);
    this.loginHeading = page.getByRole('heading', { name: /login/i });
    this.loginButton = page.getByRole('button', { name: /login/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    this.registerLink = page.getByRole('link', { name: /register/i });
    this.errorMessage = page.getByTestId('error-message');
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.googleLoginButton = page.getByTestId('google-login-button');
    this.facebookLoginButton = page.getByTestId('facebook-login-button');
    this.guestLoginButton = page.getByTestId('guest-login-button');
  }

  async fillLoginForm(params: { email: string; password: string }): Promise<void> {
    await this.emailInput.fill(params.email);
    await this.passwordInput.fill(params.password);
  }

  async submitForm(): Promise<void> {
    await this.loginButton.click();
  }

  async loginWithProvider(provider: 'google' | 'facebook'): Promise<void> {
    if (provider === 'google') {
      await this.googleLoginButton.click();
    } else {
      await this.facebookLoginButton.click();
    }
  }

  async continueAsGuest(): Promise<void> {
    await this.guestLoginButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.auth.fillEmail(email);
    await this.auth.fillPassword(password);
    await this.loginButton.click();
  }

  async goToForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  async goToRegister(): Promise<void> {
    await this.registerLink.click();
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorMessage.textContent();
  }
}