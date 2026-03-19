import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  loginUser,
  registerUser,
  logoutUser,
  sendForgotPasswordOtp,
  verifyOtp,
  resetPassword,
  changePassword,
  deleteAccount,
} from "@/services/auth.service";
import type { LoginRequest, RegisterRequest } from "@/models/auth.model";

// ─── useLogin ─────────────────────────────────────────────────────────────────

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await loginUser(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
}

// ─── useRegister ──────────────────────────────────────────────────────────────

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
}

// ─── useLogout ────────────────────────────────────────────────────────────────

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      toast.success("Logged out.");
      navigate("/login");
    } catch {
      toast.error("Logout failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
}

// ─── useForgotPassword ────────────────────────────────────────────────────────
// 3-step flow: email → OTP → new password

export type ForgotStep = "email" | "otp" | "password";

export function useForgotPassword() {
  const [step, setStep] = useState<ForgotStep>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();

  // Step 1 — send OTP
  const submitEmail = async (emailValue: string) => {
    setIsLoading(true);
    try {
      await sendForgotPasswordOtp(emailValue);
      setEmail(emailValue);
      setStep("otp");
      toast.success("OTP sent! Check your inbox.");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to send OTP. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 — verify OTP
  const submitOtp = async (otp: string) => {
    setIsLoading(true);
    try {
      const response = await verifyOtp(email, otp);
      setResetToken(response.resetToken);
      setStep("password");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 — reset password
  const submitNewPassword = async (newPassword: string) => {
    setIsLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      toast.success("Password reset! Please log in.");
      navigate("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to reset password.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { step, isLoading, email, submitEmail, submitOtp, submitNewPassword };
}

// ─── useChangePassword ────────────────────────────────────────────────────────

export function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitChangePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    setIsLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      await logoutUser();
      toast.success("Password changed! Please log in again.");
      navigate("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Failed to change password. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { submitChangePassword, isLoading };
}

// ─── useDeleteAccount ─────────────────────────────────────────────────────────

export function useDeleteAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submitDeleteAccount = async () => {
    setIsLoading(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully.");
      navigate("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to delete account.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { submitDeleteAccount, isLoading };
}
