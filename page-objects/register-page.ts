import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { RegistrationStatus } from '../interfaces/auth.interface';

export class RegisterPage extends BasePage {
  // Form inputs
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly nameInput: Locator;
  readonly lastNameInput: Locator;
  readonly privacyPolicyCheckbox: Locator;
  
  // Buttons
  readonly registerButton: Locator;
  readonly resendButton: Locator;
  
  // Messages and status
  readonly errorMessage: Locator;
  readonly activationMessage: Locator;
  readonly statusMessage: Locator;

  constructor(page: Page) {
    super(page);
  this.emailInput = page.locator('#email');
  this.passwordInput = page.locator('#password');
  this.confirmPasswordInput = page.locator('#confirmPassword');
  this.nameInput = page.locator('[data-testid="firstname-input"], #firstname');
  this.lastNameInput = page.locator('#lastname');
  this.privacyPolicyCheckbox = page.locator('#privacy');
  this.registerButton = page.getByRole('button', { name: /register|create account/i });
    this.resendButton = page.locator('[data-testid="resend-verification-email"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.activationMessage = page.locator('[data-testid="activation-message"]');
    this.statusMessage = page.locator('[data-testid="registration-status"]');
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.nameInput.first().waitFor({ state: 'visible' });
  }

  async enterFirstName(firstName: string): Promise<void> {
    const field = this.nameInput.first();
    await field.waitFor({ state: 'visible' });
    await field.fill(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.lastNameInput.waitFor({ state: 'visible' });
    await this.lastNameInput.fill(lastName);
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill(password);
  }

  async enterConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.waitFor({ state: 'visible' });
    await this.confirmPasswordInput.fill(password);
  }

  async setPrivacyPolicyAcceptance(accepted: boolean): Promise<void> {
    const currentState = await this.privacyPolicyCheckbox.getAttribute('data-state');
    const isChecked = currentState === 'checked' || currentState === 'true';

    if (accepted !== isChecked) {
      await this.privacyPolicyCheckbox.click();
    }
  }

  async submitForm(): Promise<void> {
    await this.registerButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    return (await this.errorMessage.isVisible()) ? this.errorMessage.textContent() : null;
  }

  async getActivationMessage(): Promise<string | null> {
    return (await this.activationMessage.isVisible()) ? this.activationMessage.textContent() : null;
  }

  async getRegistrationStatus(): Promise<RegistrationStatus> {
    const status = await this.statusMessage.textContent() || '';
    const error = await this.getErrorMessage();
    
    return {
      isRegistered: !error && status.toLowerCase().includes('successful'),
      isActive: status.toLowerCase().includes('active'),
      statusMessage: error || status
    };
  }

  async getValidationErrors(): Promise<string[]> {
    const errors: string[] = [];
    const error = await this.getErrorMessage();
    if (error) {
      errors.push(error);
    }
    return errors;
  }

  async resendVerificationEmail(): Promise<void> {
    await this.resendButton.click();
  }
}