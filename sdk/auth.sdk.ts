import { IAuthSDK, RegisterParams, LoginParams, PasswordResetParams, RegistrationStatus, OAuthProvider, SDKOptions } from './interfaces/index';
import { WebAuthAdapter } from '../adapters/auth.web.adapter';
import { AuthApiAdapter } from '../adapters/auth.api.adapter';
import { Page } from '@playwright/test';
import { ENDPOINTS } from '../constants/endpoints';

export class AuthSDK implements IAuthSDK {
  private webAdapter?: WebAuthAdapter;
  private apiAdapter?: AuthApiAdapter;
  private adapterType: 'web' | 'api' | 'both';
  
  constructor(private page: Page, options: SDKOptions = { adapterType: 'both' }) {
    this.adapterType = options.adapterType;
    
    if (this.adapterType === 'web' || this.adapterType === 'both') {
      this.webAdapter = new WebAuthAdapter(page);
    }
    
    if (this.adapterType === 'api' || this.adapterType === 'both') {
      this.apiAdapter = new AuthApiAdapter(page);
    }
  }

  private ensureAdapter(type: 'web' | 'api') {
    if (type === 'web' && !this.webAdapter) {
      throw new Error('Web adapter not initialized. Use web or both adapter type.');
    }
    if (type === 'api' && !this.apiAdapter) {
      throw new Error('API adapter not initialized. Use api or both adapter type.');
    }
  }

  async openRegistrationPage(path: string): Promise<void> {
    this.ensureAdapter('web');
    await this.webAdapter!.openRegistrationPage(path);
  }

  async navigateToRegistration(): Promise<void> {
    await this.openRegistrationPage(ENDPOINTS.AUTH.REGISTER);
  }

  async enterFirstName(firstName: string): Promise<void> {
    this.ensureAdapter('web');
    await this.webAdapter!.enterFirstName(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    this.ensureAdapter('web');
    await this.webAdapter!.enterLastName(lastName);
  }

  async enterEmail(email: string): Promise<void> {
    this.ensureAdapter('web');
    await this.webAdapter!.enterEmail(email);
  }

  async enterPassword(password: string): Promise<void> {
    this.ensureAdapter('web');
    await this.webAdapter!.enterPassword(password);
  }

  async enterConfirmPassword(password: string): Promise<void> {
    this.ensureAdapter('web');
    await this.webAdapter!.enterConfirmPassword(password);
  }

  async setPrivacyPolicyAcceptance(accepted: boolean): Promise<void> {
    this.ensureAdapter('web');
    await this.webAdapter!.setPrivacyPolicyAcceptance(accepted);
  }

  async fillRegistrationForm(params: Partial<RegisterParams>): Promise<void> {
    this.ensureAdapter('web');
    await this.webAdapter!.fillRegistrationForm(params);
  }

  async clickButton(buttonText: string): Promise<void> {
    this.ensureAdapter('web');
    await this.webAdapter!.clickButton(buttonText);
  }

  async handleConfirmationDialog(button: string): Promise<void> {
    this.ensureAdapter('web');
    await this.webAdapter!.handleConfirmationDialog(button);
  }

  async register(params: RegisterParams): Promise<void> {
    if (this.adapterType === 'both') {
      // In 'both' mode, use web for UI and API for verification
      this.ensureAdapter('web');
      await this.webAdapter!.register(params);
      this.ensureAdapter('api');
      await this.apiAdapter!.register(params);
    } else if (this.adapterType === 'web') {
      this.ensureAdapter('web');
      await this.webAdapter!.register(params);
    } else {
      this.ensureAdapter('api');
      await this.apiAdapter!.register(params);
    }
  }

  async login(params: LoginParams): Promise<void> {
    if (this.adapterType === 'web') {
      this.ensureAdapter('web');
      await this.webAdapter!.login(params);
    } else {
      this.ensureAdapter('api');
      await this.apiAdapter!.login(params);
    }
  }

  async loginWithOAuth(provider: OAuthProvider): Promise<void> {
    if (this.adapterType === 'web') {
      this.ensureAdapter('web');
      await this.webAdapter!.loginWithOAuth(provider);
    } else {
      this.ensureAdapter('api');
      await this.apiAdapter!.loginWithOAuth(provider);
    }
  }

  async continueAsGuest(): Promise<void> {
    if (this.adapterType === 'web') {
      this.ensureAdapter('web');
      await this.webAdapter!.continueAsGuest();
    } else {
      this.ensureAdapter('api');
      await this.apiAdapter!.continueAsGuest();
    }
  }

  async logout(): Promise<void> {
    if (this.adapterType === 'web') {
      this.ensureAdapter('web');
      await this.webAdapter!.logout();
    } else {
      this.ensureAdapter('api');
      await this.apiAdapter!.logout();
    }
  }

  async forgotPassword(email: string): Promise<void> {
    if (this.adapterType === 'web') {
      this.ensureAdapter('web');
      await this.webAdapter!.requestPasswordReset(email);
    } else {
      this.ensureAdapter('api');
      await this.apiAdapter!.requestPasswordReset(email);
    }
  }

  async resetPassword(params: PasswordResetParams): Promise<void> {
    if (this.adapterType === 'web') {
      this.ensureAdapter('web');
      await this.webAdapter!.resetPassword(params);
    } else {
      this.ensureAdapter('api');
      await this.apiAdapter!.resetPassword(params);
    }
  }

  // These methods will be implemented later as needed
  async verifyEmail(token: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async resendVerificationEmail(email: string): Promise<void> {
    if (this.adapterType === 'web' || this.adapterType === 'both') {
      this.ensureAdapter('web');
      await this.webAdapter!.resendVerificationEmail(email);
      return;
    }

    throw new Error('Resending verification email is only available when using a web adapter.');
  }

  async getAuthStatus(): Promise<{ isAuthenticated: boolean; user?: any }> {
    if (this.adapterType === 'api' || this.adapterType === 'both') {
      this.ensureAdapter('api');
      const isAuthenticated = await this.apiAdapter!.isLoggedIn();
      return { isAuthenticated };
    }

    this.ensureAdapter('web');
    const isAuthenticated = await this.webAdapter!.isLoggedIn();
    return { isAuthenticated };
  }

  async getValidationErrors(): Promise<string[]> {
    if (this.adapterType === 'web' || this.adapterType === 'both') {
      this.ensureAdapter('web');
      return this.webAdapter!.getValidationErrors();
    }

    throw new Error('Validation errors are only available when using a web adapter.');
  }

  async getActivationMessage(): Promise<string | null> {
    this.ensureAdapter('web');
    return this.webAdapter!.getActivationMessage();
  }

  async getRegistrationStatus(email: string): Promise<RegistrationStatus> {
    if (this.adapterType === 'web' || this.adapterType === 'both') {
      this.ensureAdapter('web');
      return this.webAdapter!.getRegistrationStatus(email);
    }

    throw new Error('Registration status is only available when using a web adapter.');
  }

  async checkVerificationEmailStatus(email: string): Promise<{ isSent: boolean }> {
    throw new Error('Method not implemented.');
  }
}