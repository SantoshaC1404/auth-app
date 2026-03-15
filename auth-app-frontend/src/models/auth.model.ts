// ─── Request DTOs (match backend exactly) ────────────────────────────────────

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ─── Response DTOs (match backend exactly) ───────────────────────────────────

export type Provider = "LOCAL" | "GOOGLE" | "GITHUB";

export interface RoleDto {
  id: number;
  name: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  image?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  provider: Provider;
  roles: RoleDto[];
}

/** Matches backend TokenResponse record */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  userDto: UserDto;
}

// ─── Local app state ──────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  roles: string[];
}

// ─── OTP / Password Reset flow ────────────────────────────────────────────────

export interface VerifyOtpResponse {
  resetToken: string;
  message: string;
}
