import { publicApi, api } from "@/lib/api";
/** POST /auth/register */
export const registerApi = (data) => publicApi.post("/auth/register", data);
/** POST /auth/login */
export const loginApi = (data) => publicApi.post("/auth/login", data);
/** POST /auth/refresh-token */
export const refreshTokenApi = () => publicApi.post("/auth/refresh-token");
/** POST /auth/logout */
export const logoutApi = () => api.post("/auth/logout");
/** POST /auth/forgot-password — Step 1: send OTP */
export const forgotPasswordApi = (email) =>
  publicApi.post("/auth/forgot-password", { email });
/** POST /auth/verify-otp — Step 2: verify OTP, get resetToken */
export const verifyOtpApi = (email, otp) =>
  publicApi.post("/auth/verify-otp", { email, otp });
/** POST /auth/reset-password — Step 3: set new password using resetToken */
export const resetPasswordApi = (resetToken, newPassword) =>
  publicApi.post("/auth/reset-password", {
    resetToken,
    newPassword,
  });
/** POST /users/change-password — requires Bearer token */
export const changePasswordApi = (currentPassword, newPassword) =>
  api.post("/users/change-password", {
    currentPassword,
    newPassword,
  });
/** DELETE /users/me — deletes authenticated user's account */
export const deleteAccountApi = () => api.delete("/users/me");
