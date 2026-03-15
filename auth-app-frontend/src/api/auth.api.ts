import { publicApi, api } from "@/lib/api";
import type {
  RegisterRequest,
  LoginRequest,
  TokenResponse,
  UserDto,
  VerifyOtpResponse,
} from "@/models/auth.model";

/** POST /auth/register */
export const registerApi = (data: RegisterRequest) =>
  publicApi.post<UserDto>("/auth/register", data);

/** POST /auth/login */
export const loginApi = (data: LoginRequest) =>
  publicApi.post<TokenResponse>("/auth/login", data);

/** POST /auth/refresh-token */
export const refreshTokenApi = () =>
  publicApi.post<TokenResponse>("/auth/refresh-token");

/** POST /auth/logout */
export const logoutApi = () => api.post<void>("/auth/logout");

/** POST /auth/forgot-password — Step 1: send OTP */
export const forgotPasswordApi = (email: string) =>
  publicApi.post<{ message: string }>("/auth/forgot-password", { email });

/** POST /auth/verify-otp — Step 2: verify OTP, get resetToken */
export const verifyOtpApi = (email: string, otp: string) =>
  publicApi.post<VerifyOtpResponse>("/auth/verify-otp", { email, otp });

/** POST /auth/reset-password — Step 3: set new password using resetToken */
export const resetPasswordApi = (resetToken: string, newPassword: string) =>
  publicApi.post<{ message: string }>("/auth/reset-password", {
    resetToken,
    newPassword,
  });

/** POST /users/change-password — requires Bearer token */
export const changePasswordApi = (
  currentPassword: string,
  newPassword: string,
) =>
  api.post<{ message: string }>("/users/change-password", {
    currentPassword,
    newPassword,
  });
