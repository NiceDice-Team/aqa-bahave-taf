import { BaseAdapter } from './base.adapters';
import { Page } from '@playwright/test';

export class RegistrationPage {
  private page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async fillRegistrationForm(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }) {
    if (data.firstName) {
      await this.page.locator('input[name="firstName"]').fill(data.firstName);
    }
    if (data.lastName) {
      await this.page.locator('input[name="lastName"]').fill(data.lastName);
    }
    if (data.email) {
      await this.page.locator('input[name="email"]').fill(data.email);
    }
    if (data.password) {
      await this.page.locator('input[name="password"]').fill(data.password);
    }
    if (data.confirmPassword) {
      await this.page.locator('input[name="confirmPassword"]').fill(data.confirmPassword);
    }
  }

  async clickButton(buttonText: string) {
    await this.page.locator('button', { hasText: buttonText }).click();
  }

  async clickDialogButton(button: string) {
    if (button.toLowerCase() === 'yes' || button.toLowerCase() === 'continue') {
      await this.page.locator('dialog button', { hasText: /Continue|Yes/i }).click();
    } else {
      await this.page.locator('dialog button', { hasText: /Cancel|No/i }).click();
    }
  }

  async getActivationMessage() {
    return await this.page.locator('.activation-message').textContent();
  }
}