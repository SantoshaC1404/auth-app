import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

/**
 * Blocks access to guest-only pages (login, signup) for authenticated users.
 * Redirects them to /dashboard instead.
 */
const PublicRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
