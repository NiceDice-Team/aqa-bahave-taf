import { ApiAdapter } from './base.adapter';
import { ENDPOINTS } from '../constants/endpoints';
import { 
  IAuthAdapter, 
  RegisterParams, 
  LoginParams, 
  PasswordResetParams 
} from '../interfaces/auth.interface';

export class AuthApiAdapter extends ApiAdapter implements IAuthAdapter {
  async register(params: RegisterParams): Promise<void> {
    await this.request('POST', ENDPOINTS.AUTH.REGISTER, params);
  }

  async login(params: LoginParams): Promise<void> {
    await this.request('POST', ENDPOINTS.AUTH.LOGIN, params);
  }

  async loginWithOAuth(provider: 'google' | 'facebook'): Promise<void> {
    await this.request('POST', `/api/auth/${provider}`);
  }

  async continueAsGuest(): Promise<void> {
    await this.request('POST', '/api/auth/guest');
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.request('POST', ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async resetPassword(params: PasswordResetParams): Promise<void> {
    await this.request('POST', ENDPOINTS.AUTH.RESET_PASSWORD, params);
  }

  async isLoggedIn(): Promise<boolean> {
    const response = await this.request<{ authenticated: boolean }>('GET', '/api/auth/status');
    return response.authenticated;
  }

  async logout(): Promise<void> {
    await this.request('POST', '/api/auth/logout');
  }
}