import { WebAdapter } from './base.adapters';
import { LoginPage } from '../page-objects/login-page';
import { RegisterPage } from '../page-objects/register-page';
import { PasswordRecoveryPage } from '../page-objects/password-recovery-page';
import { ENDPOINTS } from '../constants/endpoints';
import {
  IAuth,
  RegisterParams,
  LoginParams,
  PasswordResetParams,
  OAuthProvider,
  RegistrationStatus,
} from '../interfaces/auth.interface';

export class AuthWebAdapter extends WebAdapter implements IAuth {
  // ── Page object accessors ───────────────────────────────────────────────────

  private getLoginPage(): LoginPage {
    return this.getPage(LoginPage);
  }

  private getRegisterPage(): RegisterPage {
    return this.getPage(RegisterPage);
  }

  private getPasswordRecoveryPage(): PasswordRecoveryPage {
    return this.getPage(PasswordRecoveryPage);
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  async openLoginPage(url: string): Promise<void> {
    await this.navigateTo(url);
    await this.getLoginPage().waitForPageLoad?.();
  }

  async openRegistrationPage(path: string): Promise<void> {
    await this.navigateTo(path);
    await this.getRegisterPage().waitForReady();
  }

  async openPasswordRecoveryPage(url: string): Promise<void> {
    await this.navigateTo(url);
  }

  async openResetPasswordPage(path: string, uid?: string, token?: string): Promise<void> {
    const qs = uid && token ? `?uid=${uid}&token=${token}` : '';
    await this.navigateTo(`${path}${qs}`);
  }

  // ── Fine-grained field inputs ────────────────────────────────────────────────

  async enterEmail(email: string): Promise<void> {
    const url = this.page.url();
    if (url.includes('/register')) {
      await this.getRegisterPage().enterEmail(email);
    } else if (url.includes('/forgot-password') || url.includes('/reset-password')) {
      await this.getPasswordRecoveryPage().enterEmail(email);
    } else {
      await this.getLoginPage().auth.fillEmail(email);
    }
  }

  async enterPassword(password: string): Promise<void> {
    const url = this.page.url();
    if (url.includes('/register')) {
      await this.getRegisterPage().enterPassword(password);
    } else {
      await this.getLoginPage().auth.fillPassword(password);
    }
  }

  async enterFirstName(firstName: string): Promise<void> {
    await this.getRegisterPage().enterFirstName(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.getRegisterPage().enterLastName(lastName);
  }

  async enterNewPassword(password: string): Promise<void> {
    await this.getPasswordRecoveryPage().enterNewPassword(password);
  }

  async enterConfirmPassword(password: string): Promise<void> {
    const url = this.page.url();
    if (url.includes('/reset-password')) {
      await this.getPasswordRecoveryPage().enterConfirmPassword(password);
    } else {
      await this.getRegisterPage().enterConfirmPassword(password);
    }
  }

  async clickButton(buttonText: string): Promise<void> {
    const normalized = buttonText.trim().toLowerCase();
    if (normalized === 'create account' || normalized === 'register') {
      await this.getRegisterPage().submitForm();
      return;
    }
    if (normalized === 'submit') {
      await this.getPasswordRecoveryPage().submitResetRequest();
      return;
    }
    if (normalized === 'reset password') {
      await this.getPasswordRecoveryPage().submitPasswordReset();
      return;
    }
    await this.page.getByRole('button', { name: new RegExp(buttonText, 'i') }).click();
  }

  // ── High-level composite actions ─────────────────────────────────────────────

  async register(params: RegisterParams): Promise<void> {
    const rp = this.getRegisterPage();
    await rp.enterFirstName(params.firstName);
    await rp.enterLastName(params.lastName);
    await rp.enterEmail(params.email);
    await rp.enterPassword(params.password);
    await rp.enterConfirmPassword(params.confirmPassword);
    await rp.setPrivacyPolicyAcceptance(params.privacyPolicyAccepted);
    await rp.submitForm();
  }

  async fillRegistrationForm(params: Partial<RegisterParams>): Promise<void> {
    const rp = this.getRegisterPage();
    if (params.firstName !== undefined) await rp.enterFirstName(params.firstName);
    if (params.lastName !== undefined) await rp.enterLastName(params.lastName);
    if (params.email !== undefined) await rp.enterEmail(params.email);
    if (params.password !== undefined) await rp.enterPassword(params.password);
    if (params.confirmPassword !== undefined) await rp.enterConfirmPassword(params.confirmPassword);
    if (params.privacyPolicyAccepted !== undefined) await rp.setPrivacyPolicyAcceptance(params.privacyPolicyAccepted);
  }

  async login(params: LoginParams): Promise<void> {
    const lp = this.getLoginPage();
    await this.navigateTo(ENDPOINTS.AUTH.LOGIN);
    await lp.fillLoginForm(params);
    await lp.submitForm();
  }

  async loginWithOAuth(provider: OAuthProvider): Promise<void> {
    await this.navigateTo(ENDPOINTS.AUTH.LOGIN);
    await this.getLoginPage().loginWithProvider(provider);
  }

  async continueAsGuest(): Promise<void> {
    await this.navigateTo(ENDPOINTS.AUTH.LOGIN);
    await this.getLoginPage().continueAsGuest();
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.navigateTo(ENDPOINTS.AUTH.FORGOT_PASSWORD);
    const rp = this.getPasswordRecoveryPage();
    await rp.enterEmail(email);
    await rp.submitResetRequest();
  }

  async resetPassword(params: PasswordResetParams): Promise<void> {
    const rp = this.getPasswordRecoveryPage();
    await rp.enterNewPassword(params.newPassword);
    await rp.enterConfirmPassword(params.confirmPassword);
    await rp.submitPasswordReset();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: /log ?out|sign ?out/i }).click();
  }

  // ── Result / state queries ───────────────────────────────────────────────────

  async isAuthenticated(): Promise<boolean> {
    // If we just submitted a login form, wait for redirect away from /login
    if (this.page.url().includes('/login')) {
      try {
        await this.page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 7000 });
      } catch {
        // Still on /login after timeout → not authenticated
        return false;
      }
    }
    const url = this.page.url();
    if (url.includes('/login')) return false;
    // Check for account/profile link in header as authentication indicator
    const profileLink = this.page.locator('a[href*="/account"], a[href*="/profile"], [data-testid="user-menu"]');
    try {
      await profileLink.first().waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string | null> {
    const url = this.page.url();
    if (url.includes('/register')) {
      return this.getRegisterPage().getErrorMessage();
    }
    if (url.includes('/forgot-password') || url.includes('/reset-password')) {
      const msgs = await this.getPasswordRecoveryPage().getErrorMessages();
      return msgs[0] ?? null;
    }
    return this.getLoginPage().getErrorMessage();
  }

  async getStatusMessage(): Promise<string | null> {
    const url = this.page.url();
    if (url.includes('/forgot-password') || url.includes('/reset-password')) {
      const msgs = await this.getPasswordRecoveryPage().getStatusMessages();
      return msgs[0] ?? null;
    }
    return null;
  }

  async getValidationErrors(): Promise<string[]> {
    const url = this.page.url();
    if (url.includes('/register')) {
      return this.getRegisterPage().getValidationErrors();
    }
    const msg = await this.getErrorMessage();
    return msg ? [msg] : [];
  }

  async navigateToAccountPage(): Promise<void> {
    // Try to find account link with explicit wait
    const accountLink = this.page
      .locator('a[href*="/account"], a[href*="/profile"], button:has-text("Account"), [data-testid="user-menu"]')
      .first();
    try {
      await accountLink.waitFor({ state: 'visible', timeout: 10000 });
      await accountLink.click();
    } catch {
      // If link not found, try navigating directly
      await this.page.goto('/account');
    }
    await this.page.waitForLoadState('networkidle');

    // Handle potential redirects (e.g., /account → /profile)
    await this.page.waitForURL(/\/(account|profile)/, { timeout: 5000 }).catch(() => {});
  }

  // ── Extra registration helpers ───────────────────────────────────────────────

  async setPrivacyPolicyAcceptance(accepted: boolean): Promise<void> {
    await this.getRegisterPage().setPrivacyPolicyAcceptance(accepted);
  }

  async handleConfirmationDialog(button: string): Promise<void> {
    await this.page.click(`[role="dialog"] button:has-text("${button}")`);
  }

  async getRegistrationStatus(email: string): Promise<RegistrationStatus> {
    await this.navigateTo(`${ENDPOINTS.AUTH.REGISTER}?email=${encodeURIComponent(email)}`);
    return this.getRegisterPage().getRegistrationStatus();
  }

  async getActivationMessage(): Promise<string | null> {
    return this.getRegisterPage().getActivationMessage();
  }

  async resendVerificationEmail(email: string): Promise<void> {
    await this.navigateTo(`${ENDPOINTS.AUTH.REGISTER}?email=${encodeURIComponent(email)}`);
    await this.getRegisterPage().resendVerificationEmail();
  }
}
