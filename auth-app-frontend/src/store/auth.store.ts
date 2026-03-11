import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/models/auth.model";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  /** Called after login / token refresh */
  setAuth: (user: AuthUser, accessToken: string) => void;

  /** Called after logout or on session expiry */
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // key in localStorage
      partialize: (state) => ({
        // ⚠️ never persist the token in production
        user: state.user, // (use HttpOnly cookies instead; this is for
        accessToken: state.accessToken, // demo/dev convenience only)
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
