import { Page } from '@playwright/test';
import { PlaywrightFetch } from '../utils/playwright-fetch';
import { ENDPOINTS } from '../constants/endpoints';
import {
  RegisterParams,
  LoginParams,
  PasswordResetParams,
  RegistrationStatus,
} from '../interfaces/auth.interface';

export class RegistrationApiAdapter {
  private fetch: PlaywrightFetch;

  constructor(page: Page) {
    this.fetch = new PlaywrightFetch(page);
  }

  async apiRegister(params: RegisterParams): Promise<RegistrationStatus> {
    return await this.fetch.request<RegistrationStatus>('POST', ENDPOINTS.AUTH.REGISTER, params);
  }

  async apiLogin(params: LoginParams): Promise<{ token: string }> {
    return await this.fetch.request<{ token: string }>('POST', ENDPOINTS.AUTH.LOGIN, params);
  }

  async apiRequestPasswordReset(email: string): Promise<{ message: string }> {
    return await this.fetch.request<{ message: string }>('POST', ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async apiResetPassword(params: PasswordResetParams): Promise<{ message: string }> {
    return await this.fetch.request<{ message: string }>('POST', ENDPOINTS.AUTH.RESET_PASSWORD, params);
  }
  
  async apiGetRegistrationStatus(): Promise<RegistrationStatus> {
    // Example endpoint, update if needed
    return await this.fetch.request<RegistrationStatus>('GET', '/api/registration/status');
  }
}