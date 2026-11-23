import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useAuthStore = create()(
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
