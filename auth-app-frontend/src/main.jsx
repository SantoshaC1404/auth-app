import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import RootLayout from "./pages/RootLayout.jsx";
import Signup from "./pages/Signup.jsx";
import Services from "./pages/Services.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { ThemeProvider } from "./components/theme-provider.jsx";
import { Toaster } from "react-hot-toast";
import OAuthSuccess from "./pages/OAuthSuccess.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import SessionGuard from "./components/SessionGuard.jsx";
import DeleteAccount from "./pages/DeleteAccount.jsx";
createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <BrowserRouter>
      {/* Global Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

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
