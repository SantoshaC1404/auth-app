import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { refreshSession } from "@/services/auth.service";

/**
 * Runs once on app boot.
 * - If the user appears logged in (Zustand persisted state), silently validate
 *   the session by calling /auth/refresh-token using the HttpOnly cookie.
 * - If the cookie is expired or missing, clear the store and let the user log in.
 * - Renders children only after the check completes so routes don't flicker.
 */
const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const [checking, setChecking] = useState(true);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in — nothing to validate
      setChecking(false);
      return;
    }

    // Validate the session against the backend
    refreshSession()
      .catch(() => {
        // Cookie expired or revoked — wipe local state
        logout();
      })
      .finally(() => {
        setChecking(false);
      });
  }, []); // Run once on mount only

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-muted-foreground animate-pulse text-sm">
          Loading...
        </span>
      </div>
    );
  }

  return <>{children}</>;
};

export default SessionGuard;
