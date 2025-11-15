import { WebAdapter } from './base.adapter';
import { LoginPage } from '../page-objects/login-page';
import { RegisterPage } from '../page-objects/register-page';
import { ENDPOINTS } from '../constants/endpoints';
import { 
  IAuthAdapter, 
  RegisterParams, 
  LoginParams, 
  PasswordResetParams,
  RegistrationStatus 
} from '../interfaces/auth.interface';

export class WebAuthAdapter extends WebAdapter implements IAuthAdapter {
  private getRegisterPage(): RegisterPage {
    return this.getPage(RegisterPage);
  }

  private getLoginPage(): LoginPage {
    return this.getPage(LoginPage);
  }

  async clickButton(buttonText: string): Promise<void> {
    const normalized = buttonText.trim().toLowerCase();
    if (normalized === 'create account' || normalized === 'register') {
      await this.getRegisterPage().submitForm();
      return;
    }

    await this.page.getByRole('button', { name: new RegExp(buttonText, 'i') }).click();
  }

  async handleConfirmationDialog(button: string): Promise<void> {
    await this.page.click(`[role="dialog"] button:has-text("${button}")`);
  }

  async getRegistrationStatus(email: string): Promise<RegistrationStatus> {
    const registerPage = this.getRegisterPage();
    await this.navigateTo(`${ENDPOINTS.AUTH.REGISTER}?email=${encodeURIComponent(email)}`);
    return registerPage.getRegistrationStatus();
  }

  async getValidationErrors(): Promise<string[]> {
    const registerPage = this.getRegisterPage();
    const errorMessage = await registerPage.getErrorMessage();
    return errorMessage ? [errorMessage] : [];
  }

  async getActivationMessage(): Promise<string | null> {
    const registerPage = this.getRegisterPage();
    return registerPage.getActivationMessage();
  }

  async resendVerificationEmail(email: string): Promise<void> {
    await this.navigateTo(`${ENDPOINTS.AUTH.REGISTER}?email=${encodeURIComponent(email)}`);
    const registerPage = this.getRegisterPage();
    await registerPage.resendVerificationEmail();
  }

  async openRegistrationPage(path: string): Promise<void> {
    await this.navigateTo(path);
    await this.getRegisterPage().waitForReady();
  }

  async enterFirstName(firstName: string): Promise<void> {
    const registerPage = this.getRegisterPage();
    await registerPage.enterFirstName(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    const registerPage = this.getRegisterPage();
    await registerPage.enterLastName(lastName);
  }

  async enterEmail(email: string): Promise<void> {
    const registerPage = this.getRegisterPage();
    await registerPage.enterEmail(email);
  }

  async enterPassword(password: string): Promise<void> {
    const registerPage = this.getRegisterPage();
    await registerPage.enterPassword(password);
  }

  async enterConfirmPassword(password: string): Promise<void> {
    const registerPage = this.getRegisterPage();
    await registerPage.enterConfirmPassword(password);
  }

  async setPrivacyPolicyAcceptance(accepted: boolean): Promise<void> {
    const registerPage = this.getRegisterPage();
    await registerPage.setPrivacyPolicyAcceptance(accepted);
  }

  async fillRegistrationForm(params: Partial<RegisterParams>): Promise<void> {
    if (params.firstName !== undefined) await this.enterFirstName(params.firstName);
    if (params.lastName !== undefined) await this.enterLastName(params.lastName);
    if (params.email !== undefined) await this.enterEmail(params.email);
    if (params.password !== undefined) await this.enterPassword(params.password);
    if (params.confirmPassword !== undefined) await this.enterConfirmPassword(params.confirmPassword);
    if (params.privacyPolicyAccepted !== undefined) await this.setPrivacyPolicyAcceptance(params.privacyPolicyAccepted);
  }

  async register(params: RegisterParams): Promise<void> {
    await this.enterFirstName(params.firstName);
    await this.enterLastName(params.lastName);
    await this.enterEmail(params.email);
    await this.enterPassword(params.password);
    await this.enterConfirmPassword(params.confirmPassword);
    await this.setPrivacyPolicyAcceptance(params.privacyPolicyAccepted);
    await this.getRegisterPage().submitForm();
  }

  async login(params: LoginParams): Promise<void> {
    const loginPage = this.getLoginPage();
    await this.navigateTo(ENDPOINTS.AUTH.LOGIN);
    await loginPage.fillLoginForm(params);
    await loginPage.submitForm();
  }

  async loginWithOAuth(provider: 'google' | 'facebook'): Promise<void> {
    const loginPage = this.getLoginPage();
    await this.navigateTo(ENDPOINTS.AUTH.LOGIN);
    await loginPage.loginWithProvider(provider);
  }

  async continueAsGuest(): Promise<void> {
    const loginPage = this.getLoginPage();
    await this.navigateTo(ENDPOINTS.AUTH.LOGIN);
    await loginPage.continueAsGuest();
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.navigateTo(ENDPOINTS.AUTH.FORGOT_PASSWORD);
    // Implement password reset request UI interaction
  }

  async resetPassword(params: PasswordResetParams): Promise<void> {
    await this.navigateTo(ENDPOINTS.AUTH.RESET_PASSWORD);
    // Implement password reset UI interaction
  }

  async isLoggedIn(): Promise<boolean> {
    // Implement logged in check through UI
    return false;
  }

  async logout(): Promise<void> {
    // Implement logout through UI
  }
}