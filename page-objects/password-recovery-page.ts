import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class PasswordRecoveryPage extends BasePage {
  readonly emailInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly resetPasswordButton: Locator;
  readonly newPasswordInput: Locator;
  readonly successMessage: Locator;
  readonly statusMessage: Locator;
  readonly infoMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"], input[id="email"]');
    this.confirmPasswordInput = page.locator(
      'input[name="confirmPassword"], input[name="confirm_password"], input[id="confirmPassword"]'
    );
    this.submitButton = page.getByRole('button', { name: /submit/i });
    this.resetPasswordButton = page.getByRole('button', { name: /reset password/i });
    this.newPasswordInput = page.locator('input[name="newPassword"], input[name="new_password"]');
    this.successMessage = page.locator('.success-message, [role="status"]');
    this.statusMessage = page.locator('.message, [role="status"], .alert-info');
    this.infoMessage = page.locator('.message, [role="status"], .alert-info');
    this.errorMessage = page.locator(this.genericErrorSelector);
  }

  private getPasswordRecoveryFieldLocator(fieldName: string): Locator {
    const aliases: Record<string, string[]> = {
      email: ['email', 'user_email'],
      confirmpassword: ['confirm_password', 'confirm-password', 'confirmPassword'],
      newpassword: ['new_password', 'new-password', 'newPassword', 'password'],
    };

    const knownFields: Record<string, Locator> = {
      email: this.emailInput.first(),
      confirmpassword: this.confirmPasswordInput.first(),
      newpassword: this.newPasswordInput.first(),
    };

    return this.resolveFieldLocator(fieldName, { aliases, knownFields });
  }

  async enterNewPassword(password: string): Promise<void> {
    await this.newPasswordInput.first().fill(password);
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.first().fill(email);
  }

  async enterConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.first().fill(password);
  }

  async submitResetRequest(): Promise<void> {
    await this.submitButton.click();
  }

  async submitPasswordReset(): Promise<void> {
    await this.resetPasswordButton.click();
  }

  async getSuccessMessages(): Promise<string[]> {
    const texts = await this.successMessage.allTextContents();
    return this.toCleanTexts(texts);
  }

  async getStatusMessages(): Promise<string[]> {
    const texts = await this.statusMessage.allTextContents();
    return this.toCleanTexts(texts);
  }

  async getErrorMessages(): Promise<string[]> {
    const texts = await this.errorMessage.allTextContents();
    return this.toCleanTexts(texts);
  }

  async getFieldValidationErrors(fieldName: string): Promise<string[]> {
    const field = this.getPasswordRecoveryFieldLocator(fieldName);
    const errorSelector = `${await field.evaluate((el) => {
      const id = el.getAttribute('id') ?? el.getAttribute('name') ?? '';
      return `[data-error-for="${id}"], #${id}-error, [id*="${id}"][class*="error"]`;
    })}, .invalid-feedback, [class*="field-error"]`;
    const errors = this.page.locator(errorSelector);
    try {
      await errors.first().waitFor({ state: 'visible', timeout: 3000 });
    } catch {
      return [];
    }
    return this.toCleanTexts(await errors.allTextContents());
  }
}
