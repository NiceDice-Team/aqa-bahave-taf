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
    await this.request.post(ENDPOINTS.AUTH.REGISTER, { data: params });
  }

  async login(params: LoginParams): Promise<void> {
    await this.request.post(ENDPOINTS.AUTH.LOGIN, { data: params });
  }

  async loginWithOAuth(provider: OAuthProvider): Promise<void> {
    await this.request.post(`/api/auth/${provider}`);
  }

  async continueAsGuest(): Promise<void> {
    await this.request.post('/api/auth/guest');
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.request.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { data: { email } });
  }

  async resetPassword(params: PasswordResetParams): Promise<void> {
    await this.request.post(ENDPOINTS.AUTH.RESET_PASSWORD, { data: params });
  }

  async isLoggedIn(): Promise<boolean> {
    const response = await this.request.get('/api/auth/status');
    return Boolean(response.text);
  }

  async logout(): Promise<void> {
    await this.request.post('/api/auth/logout');
  }
}