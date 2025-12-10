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
  register(params: RegisterParams): Promise<void>;
  login(params: LoginParams): Promise<void>;
  loginWithOAuth(provider: OAuthProvider): Promise<void>;
  continueAsGuest(): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(params: PasswordResetParams): Promise<void>;
  isLoggedIn(): Promise<boolean>;
  logout(): Promise<void>;
}