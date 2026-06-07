import { IAuth, RegisterParams, LoginParams, OAuthProvider, PasswordResetParams } from '../interfaces/auth.interface';

export class AuthSDK implements IAuth {
  constructor(private adapter: IAuth) {}

  // Navigation
  openLoginPage(url: string) {
    return this.adapter.openLoginPage(url);
  }
  openRegistrationPage(path: string) {
    return this.adapter.openRegistrationPage(path);
  }
  openPasswordRecoveryPage(url: string) {
    return this.adapter.openPasswordRecoveryPage(url);
  }
  openResetPasswordPage(p: string, u?: string, t?: string) {
    return this.adapter.openResetPasswordPage(p, u, t);
  }

  // Field inputs
  enterEmail(email: string) {
    return this.adapter.enterEmail(email);
  }
  enterPassword(password: string) {
    return this.adapter.enterPassword(password);
  }
  enterFirstName(firstName: string) {
    return this.adapter.enterFirstName(firstName);
  }
  enterLastName(lastName: string) {
    return this.adapter.enterLastName(lastName);
  }
  enterNewPassword(password: string) {
    return this.adapter.enterNewPassword(password);
  }
  enterConfirmPassword(password: string) {
    return this.adapter.enterConfirmPassword(password);
  }
  clickButton(buttonText: string) {
    return this.adapter.clickButton(buttonText);
  }

  // High-level composite actions
  register(params: RegisterParams) {
    return this.adapter.register(params);
  }
  fillRegistrationForm(p: Partial<RegisterParams>) {
    return this.adapter.fillRegistrationForm(p);
  }
  login(params: LoginParams) {
    return this.adapter.login(params);
  }
  loginWithOAuth(provider: OAuthProvider) {
    return this.adapter.loginWithOAuth(provider);
  }
  continueAsGuest() {
    return this.adapter.continueAsGuest();
  }
  requestPasswordReset(email: string) {
    return this.adapter.requestPasswordReset(email);
  }
  resetPassword(params: PasswordResetParams) {
    return this.adapter.resetPassword(params);
  }
  logout() {
    return this.adapter.logout();
  }

  // State queries
  isAuthenticated() {
    return this.adapter.isAuthenticated();
  }
  getErrorMessage() {
    return this.adapter.getErrorMessage();
  }
  getStatusMessage() {
    return this.adapter.getStatusMessage();
  }
  getValidationErrors() {
    return this.adapter.getValidationErrors();
  }
  navigateToAccountPage() {
    return this.adapter.navigateToAccountPage();
  }
}
