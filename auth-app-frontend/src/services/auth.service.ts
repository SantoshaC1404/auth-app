import {
  registerApi,
  loginApi,
  refreshTokenApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
} from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import type {
  RegisterRequest,
  LoginRequest,
  AuthUser,
  UserDto,
  TokenResponse,
} from "@/models/auth.model";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toAuthUser(dto: UserDto): AuthUser {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    image: dto.image,
    roles: dto.roles.map((r) => r.name),
  };
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Register a new user.
 * Returns the created UserDto (no token — user must log in after).
 */
export async function registerUser(data: RegisterRequest): Promise<UserDto> {
  const response = await registerApi(data);
  return response.data;
}

/**
 * Log in with email + password.
 * Stores user and access token in Zustand; refresh token arrives via cookie.
 */
export async function loginUser(data: LoginRequest): Promise<TokenResponse> {
  const response = await loginApi(data);
  const tokenResponse = response.data;

  const { setAuth } = useAuthStore.getState();
  setAuth(toAuthUser(tokenResponse.userDto), tokenResponse.accessToken);

  return tokenResponse;
}

/**
 * Silently refresh the access token using the HttpOnly cookie.
 * Called on app boot to restore session.
 */
export async function refreshSession(): Promise<void> {
  const response = await refreshTokenApi();
  const tokenResponse = response.data;

  const { setAuth } = useAuthStore.getState();
  setAuth(toAuthUser(tokenResponse.userDto), tokenResponse.accessToken);
}

/**
 * Log out: revokes server-side refresh token, clears the cookie,
 * and wipes local auth state.
 */
export async function logoutUser(): Promise<void> {
  try {
    await logoutApi();
  } finally {
    // Always clear local state even if the server call fails
    useAuthStore.getState().logout();
  }
}

export async function forgotPassword(email: string): Promise<string> {
  const response = await forgotPasswordApi(email);
  return response.data.message;
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<string> {
  const response = await resetPasswordApi(token, newPassword);
  return response.data.message;
}
