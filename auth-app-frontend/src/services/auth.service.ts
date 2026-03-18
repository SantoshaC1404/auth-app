import {
  registerApi,
  loginApi,
  refreshTokenApi,
  logoutApi,
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
  changePasswordApi,
} from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import type {
  RegisterRequest,
  LoginRequest,
  AuthUser,
  UserDto,
  TokenResponse,
  VerifyOtpResponse,
} from "@/models/auth.model";

function toAuthUser(dto: UserDto): AuthUser {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    image: dto.image,
    roles: dto.roles.map((r) => r.name),
    provider: dto.provider,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    loginAt: new Date().toISOString(), // stamped at login time
  };
}

export async function registerUser(data: RegisterRequest): Promise<UserDto> {
  const response = await registerApi(data);
  return response.data;
}

export async function loginUser(data: LoginRequest): Promise<TokenResponse> {
  const response = await loginApi(data);
  const tokenResponse = response.data;
  useAuthStore
    .getState()
    .setAuth(toAuthUser(tokenResponse.userDto), tokenResponse.accessToken);
  return tokenResponse;
}

export async function refreshSession(): Promise<void> {
  const response = await refreshTokenApi();
  const tokenResponse = response.data;
  useAuthStore
    .getState()
    .setAuth(toAuthUser(tokenResponse.userDto), tokenResponse.accessToken);
}

export async function logoutUser(): Promise<void> {
  try {
    await logoutApi();
  } finally {
    useAuthStore.getState().logout();
  }
}

/** Step 1: request OTP */
export async function sendForgotPasswordOtp(email: string): Promise<void> {
  await forgotPasswordApi(email);
}

/** Step 2: verify OTP → returns resetToken */
export async function verifyOtp(
  email: string,
  otp: string,
): Promise<VerifyOtpResponse> {
  const response = await verifyOtpApi(email, otp);
  return response.data;
}

/** Step 3: set new password using resetToken */
export async function resetPassword(
  resetToken: string,
  newPassword: string,
): Promise<void> {
  await resetPasswordApi(resetToken, newPassword);
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<string> {
  const response = await changePasswordApi(currentPassword, newPassword);
  return response.data.message;
}
