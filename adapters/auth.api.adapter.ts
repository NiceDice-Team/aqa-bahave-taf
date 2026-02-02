import { ApiAdapter } from './base.adapters';
import { ENDPOINTS } from '../constants/endpoints';
import { 
  IAuth, 
  RegisterParams, 
  LoginParams, 
  PasswordResetParams,
  OAuthProvider
} from '../interfaces/auth.interface';

export class AuthApiAdapter extends ApiAdapter implements IAuth {
  async register(params: RegisterParams): Promise<void> {
    await this.sendRequest('POST', ENDPOINTS.AUTH.REGISTER, undefined, params);
  }

  async login(params: LoginParams): Promise<void> {
    await this.sendRequest('POST', ENDPOINTS.AUTH.LOGIN, undefined, params);
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
    await this.sendRequest('POST', ENDPOINTS.AUTH.RESET_PASSWORD, undefined, params);
  }

  async isLoggedIn(): Promise<boolean> {
    const response = await this.sendRequest('GET', '/api/auth/status');
    // Narrow the type of response to access isLoggedIn property
    if (typeof response === 'object' && response !== null && 'isLoggedIn' in response) {
      return Boolean((response as { isLoggedIn: unknown }).isLoggedIn);
    }
    return false;
  }

  async logout(): Promise<void> {
    await this.sendRequest('POST', '/api/auth/logout');
  }
}