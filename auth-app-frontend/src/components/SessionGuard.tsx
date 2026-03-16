import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { refreshSession, logoutUser } from "@/services/auth.service";
import toast from "react-hot-toast";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes of inactivity
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

/**
 * SessionGuard does two things:
 *
 * 1. On app boot — validates the session via /auth/refresh-token.
 *    If the cookie is expired, clears the store.
 *
 * 2. While logged in — starts an idle timer. If the user has no activity
 *    for IDLE_TIMEOUT_MS, they are automatically logged out.
 *    Any user activity resets the timer.
 */
const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  const [checking, setChecking] = useState(true);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Boot: validate session ───────────────────────────────────────────────

  useEffect(() => {
    if (!isAuthenticated) {
      setChecking(false);
      return;
    }

    refreshSession()
      .catch(() => logout())
      .finally(() => setChecking(false));
  }, []);

  // ─── Idle timeout ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleLogout = async () => {
      try {
        await logoutUser();
      } catch {
        logout();
      }
      toast("Logged out due to inactivity.", { icon: "🔒" });
    };

    const resetTimer = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(handleLogout, IDLE_TIMEOUT_MS);
    };

    // Start timer and attach activity listeners
    resetTimer();
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, resetTimer));

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [isAuthenticated]);

  // ─── Render ───────────────────────────────────────────────────────────────

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
