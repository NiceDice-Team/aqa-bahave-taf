export type OAuthProvider = 'google' | 'facebook';

export interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  privacyPolicyAccepted: boolean;
}

export interface LoginParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface PasswordResetParams {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegistrationStatus {
  isRegistered: boolean;
  isActive: boolean;
  statusMessage: string;
}

export interface IAuth {
  // ── Page navigation ────────────────────────────────────────────────────────
  openLoginPage(url: string): Promise<void>;
  openRegistrationPage(path: string): Promise<void>;
  openPasswordRecoveryPage(url: string): Promise<void>;
  openResetPasswordPage(path: string, uid?: string, token?: string): Promise<void>;

  // ── Fine-grained field inputs (used by individual-step scenarios) ──────────
  enterEmail(email: string): Promise<void>;
  enterPassword(password: string): Promise<void>;
  enterFirstName(firstName: string): Promise<void>;
  enterLastName(lastName: string): Promise<void>;
  enterNewPassword(password: string): Promise<void>;
  enterConfirmPassword(password: string): Promise<void>;
  clickButton(buttonText: string): Promise<void>;

  // ── High-level composite actions ───────────────────────────────────────────
  register(params: RegisterParams): Promise<void>;
  fillRegistrationForm(params: Partial<RegisterParams>): Promise<void>;
  login(params: LoginParams): Promise<void>;
  loginWithOAuth(provider: OAuthProvider): Promise<void>;
  continueAsGuest(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(params: PasswordResetParams): Promise<void>;
  logout(): Promise<void>;

  // ── Result / state queries ─────────────────────────────────────────────────
  isAuthenticated(): Promise<boolean>;
  getErrorMessage(): Promise<string | null>;
  getStatusMessage(): Promise<string | null>;
  getValidationErrors(): Promise<string[]>;
  navigateToAccountPage(): Promise<void>;
}
