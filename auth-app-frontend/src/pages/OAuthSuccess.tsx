import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { refreshSession } from "@/services/auth.service";

/**
 * Landing page after a successful OAuth2 redirect from the backend.
 * The backend sets the HttpOnly refresh-token cookie and redirects here.
 * We call /auth/refresh-token to get an access token and hydrate the store.
 *
 * Backend redirect URL: app.auth.frontend.success-redirect=http://localhost:5173/auth/success
 */
const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    refreshSession()
      .then(() => navigate("/dashboard", { replace: true }))
      .catch(() => navigate("/login?error=oauth_failed", { replace: true }));
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground animate-pulse">Signing you in…</p>
    </div>
  );
};

export default OAuthSuccess;
