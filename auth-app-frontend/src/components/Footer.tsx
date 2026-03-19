import { NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

const Footer = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <footer className="mt-16 border-t bg-background w-full">
      <div className="px-6 md:px-10 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-gradient-to-r from-primary to-primary/40 text-white text-xs">
              A
            </span>
            <span className="text-base tracking-tight">Auth App</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Secure authentication for modern applications, built with React
            &amp; Spring Boot.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Navigation</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <NavLink to="/" className="hover:text-primary transition-colors">
                Home
              </NavLink>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <NavLink
                    to="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/services"
                    className="hover:text-primary transition-colors"
                  >
                    Services
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard"
                    className="hover:text-primary transition-colors"
                  >
                    Dashboard
                  </NavLink>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className="hover:text-primary transition-colors"
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/signup"
                    className="hover:text-primary transition-colors"
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Tech stack */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Built With</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>React 19 + TypeScript</li>
            <li>Spring Boot 3 + Spring Security</li>
            <li>JWT + OAuth2</li>
            <li>MySQL + Tailwind CSS</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Auth App. Built with React + Spring Boot.
      </div>
    </footer>
  );
};

export default Footer;
