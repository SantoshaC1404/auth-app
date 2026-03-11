import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <BrowserRouter>
      {/* Global Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Always accessible */}
          <Route index element={<App />} />
          <Route path="auth/success" element={<OAuthSuccess />} />

          {/* Guest-only: redirect to /dashboard if already logged in */}
          <Route element={<PublicRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>

          {/* Protected: redirect to /login if not logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>,
);
