import {
  registerApi,
  loginApi,
  refreshTokenApi,
  logoutApi,
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
  changePasswordApi,
  deleteAccountApi,
} from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
function toAuthUser(dto) {
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
export async function registerUser(data) {
  const response = await registerApi(data);
  return response.data;
}
export async function loginUser(data) {
  const response = await loginApi(data);
  const tokenResponse = response.data;
  useAuthStore
    .getState()
    .setAuth(toAuthUser(tokenResponse.userDto), tokenResponse.accessToken);
  return tokenResponse;
}
export async function refreshSession() {
  const response = await refreshTokenApi();
  const tokenResponse = response.data;
  useAuthStore
    .getState()
    .setAuth(toAuthUser(tokenResponse.userDto), tokenResponse.accessToken);
}
export async function logoutUser() {
  try {
    await logoutApi();
  } finally {
    useAuthStore.getState().logout();
  }
}
/** Step 1: request OTP */
export async function sendForgotPasswordOtp(email) {
  await forgotPasswordApi(email);
}
/** Step 2: verify OTP → returns resetToken */
export async function verifyOtp(email, otp) {
  const response = await verifyOtpApi(email, otp);
  return response.data;
}
/** Step 3: set new password using resetToken */
export async function resetPassword(resetToken, newPassword) {
  await resetPasswordApi(resetToken, newPassword);
}
export async function changePassword(currentPassword, newPassword) {
  const response = await changePasswordApi(currentPassword, newPassword);
  return response.data.message;
}
export async function deleteAccount() {
  await deleteAccountApi();
  useAuthStore.getState().logout();
}
