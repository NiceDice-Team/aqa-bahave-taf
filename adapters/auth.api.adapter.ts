import { ApiAdapter } from './base.adapters';
import { ENDPOINTS } from '../constants/endpoints';
import { IAuth, RegisterParams, LoginParams, PasswordResetParams, OAuthProvider } from '../interfaces/auth.interface';

export class AuthApiAdapter extends ApiAdapter implements IAuth {
  // ── Navigation (no-op for API adapter) ───────────────────────────────
  async openLoginPage(_url: string): Promise<void> {}
  async openRegistrationPage(_path: string): Promise<void> {}
  async openPasswordRecoveryPage(_url: string): Promise<void> {}
  async openResetPasswordPage(_path: string, _uid?: string, _token?: string): Promise<void> {}

  // ── Field inputs (no-op for API adapter) ─────────────────────────────
  async enterEmail(_email: string): Promise<void> {}
  async enterPassword(_password: string): Promise<void> {}
  async enterFirstName(_firstName: string): Promise<void> {}
  async enterLastName(_lastName: string): Promise<void> {}
  async enterNewPassword(_password: string): Promise<void> {}
  async enterConfirmPassword(_password: string): Promise<void> {}
  async clickButton(_buttonText: string): Promise<void> {}

  // ── High-level actions ──────────────────────────────────────────────
  async register(params: RegisterParams): Promise<void> {
    await this.sendRequest('POST', ENDPOINTS.AUTH.REGISTER, params);
  }

  async fillRegistrationForm(_params: Partial<RegisterParams>): Promise<void> {}

  async login(params: LoginParams): Promise<void> {
    const body = await this.sendRequest<Record<string, unknown>>('POST', ENDPOINTS.AUTH.LOGIN, params);
    const token = body?.access ?? body?.token ?? body?.key;
    if (token) this.setAuthToken(String(token));
  }

  async loginWithOAuth(provider: OAuthProvider): Promise<void> {
    await this.sendRequest('POST', `/api/auth/${provider}`);
  }

  async continueAsGuest(): Promise<void> {
    await this.sendRequest('POST', '/api/auth/guest');
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.sendRequest('POST', ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async resetPassword(params: PasswordResetParams): Promise<void> {
    await this.sendRequest('POST', ENDPOINTS.AUTH.RESET_PASSWORD, params);
  }

  async logout(): Promise<void> {
    await this.sendRequest('POST', '/api/auth/logout');
    this.authToken = undefined;
  }

  // ── State queries ──────────────────────────────────────────────────
  async isAuthenticated(): Promise<boolean> {
    return !!this.authToken;
  }

  async getErrorMessage(): Promise<string | null> {
    return null;
  }

  async getStatusMessage(): Promise<string | null> {
    return null;
  }

  async getValidationErrors(): Promise<string[]> {
    return [];
  }

  async navigateToAccountPage(): Promise<void> {}
}
