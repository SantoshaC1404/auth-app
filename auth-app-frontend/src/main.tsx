import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import About from "./pages/About.tsx";
import Login from "./pages/Login.tsx";
import RootLayout from "./pages/RootLayout.tsx";
import Signup from "./pages/Signup.tsx";
import Services from "./pages/Services.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "react-hot-toast";
import OAuthSuccess from "./pages/OAuthSuccess.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import PublicRoute from "./components/PublicRoute.tsx";
import ChangePassword from "./pages/ChangePassword.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import SessionGuard from "./components/SessionGuard.tsx";
import DeleteAccount from "./pages/DeleteAccount.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <BrowserRouter>
      {/* Global Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Validates session on every app boot before rendering routes */}
      <SessionGuard>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            {/* Always accessible */}
            <Route index element={<App />} />
            <Route path="auth/success" element={<OAuthSuccess />} />

            {/* Guest-only: redirect to /dashboard if already logged in */}
            <Route element={<PublicRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Protected: redirect to /login if not logged in */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="delete-account" element={<DeleteAccount />} />
              <Route path="logout" element={<Navigate to="/login" replace />} />
            </Route>
          </Route>
        </Routes>
      </SessionGuard>
    </BrowserRouter>
  </ThemeProvider>,
);
