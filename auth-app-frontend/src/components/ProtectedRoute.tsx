import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

/**
 * Wraps private routes. Redirects to /login if the user is not authenticated.
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 */
const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
