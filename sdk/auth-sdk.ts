import { AuthApiAdapter, AuthWebAdapter } from '../adapters';
import { IAuth, RegisterParams, LoginParams, OAuthProvider, PasswordResetParams } from '../interfaces/auth.interface';
import { th } from '@faker-js/faker/.';


export class AuthSDK implements IAuth {
  private adapter: AuthApiAdapter | AuthWebAdapter;

  constructor(adapter: AuthApiAdapter | AuthWebAdapter) {
    this.adapter = adapter;
  }

  async register(params: RegisterParams): Promise<void> {
    await this.adapter.register(params);
  }

  async login(params: LoginParams): Promise<void> {
    await this.adapter.login(params);
  }

  async loginWithOAuth(provider: OAuthProvider): Promise<void> {
    await this.adapter.loginWithOAuth(provider);
  }

  async continueAsGuest(): Promise<void> {
    await this.adapter.continueAsGuest();
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.adapter.requestPasswordReset(email);
  }

  async resetPassword(params: PasswordResetParams): Promise<void> {
    await this.adapter.resetPassword(params);
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.adapter.isLoggedIn();
  }

  async logout(): Promise<void> {
    await this.adapter.logout();
  }
}