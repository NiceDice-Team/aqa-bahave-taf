import { Page } from '@playwright/test';
import { Page } from '@playwright/test';
import { BaseSDK } from './base-sdk';
import { WebAuthAdapter } from '../adapters/WebAuthAdapter';
import { RegisterParams, LoginParams, PasswordResetParams } from '../adapters/WebAuthAdapter';

export class AuthSDK extends BaseSDK {
  private webAdapter: WebAuthAdapter;
  
  constructor(page: Page) {
    super(page);
    this.webAdapter = new WebAuthAdapter(this.page);
  }

  async register(params: RegisterParams): Promise<void> {
    await this.webAdapter.register(params);
  }

  async login(params: LoginParams): Promise<void> {
    await this.webAdapter.login(params);
  }

  async loginWithOAuth(provider: 'google' | 'facebook'): Promise<void> {
    await this.webAdapter.loginWithOAuth(provider);
  }

  async continueAsGuest(): Promise<void> {
    await this.webAdapter.continueAsGuest();
  }

  async requestPasswordReset(email: string): Promise<void> {
    // Implement password reset request
  }

  async resetPassword(params: PasswordResetParams): Promise<void> {
    // Implement password reset
  }

  async isLoggedIn(): Promise<boolean> {
    // Implement logged in check
    return false;
  }

  async logout(): Promise<void> {
    // Implement logout
  }
}