import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser, registerUser, logoutUser } from "@/services/auth.service";
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
