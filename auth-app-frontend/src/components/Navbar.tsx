import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { LogOut, LayoutDashboard, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/useAuth";

// ─── Profile Dropdown ─────────────────────────────────────────────────────────

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const { logout, isLoading } = useLogout();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Profile menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-popover text-popover-foreground shadow-md z-50 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="py-1">
            <NavLink
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LayoutDashboard size={15} />
              Dashboard
            </NavLink>

            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              disabled={isLoading}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <LogOut size={15} />
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <nav className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-6 md:px-10 dark:bg-gray-800 bg-white shadow-sm z-50">
      {/* Brand */}
      <div className="font-bold flex items-center gap-2">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-gradient-to-r from-primary to-primary/40 text-white text-xs">
          A
        </span>
        <NavLink to="/" className="text-base tracking-tight font-bold">
          Auth
        </NavLink>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-3 items-center">
        {/* Home — always visible */}
        <NavLink to="/" end>
          {({ isActive }) => (
            <Button
              size="sm"
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer"
            >
              Home
            </Button>
          )}
        </NavLink>

        {/* About + Services — only when logged in */}
        {isAuthenticated && (
          <>
            <NavLink to="/about">
              {({ isActive }) => (
                <Button
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  About
                </Button>
              )}
            </NavLink>
            <NavLink to="/services">
              {({ isActive }) => (
                <Button
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  Services
                </Button>
              )}
            </NavLink>
          </>
        )}

        {/* Login + Signup — only when logged out */}
        {!isAuthenticated && (
          <>
            <NavLink to="/login">
              {({ isActive }) => (
                <Button
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  Login
                </Button>
              )}
            </NavLink>
            <NavLink to="/signup">
              {({ isActive }) => (
                <Button
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  Signup
                </Button>
              )}
            </NavLink>
          </>
        )}

        <ThemeToggle />
        {isAuthenticated && <ProfileMenu />}
      </div>

      {/* Mobile: theme + avatar + hamburger */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle />
        {isAuthenticated && <ProfileMenu />}
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile slide-down */}
      {mobileOpen && (
        <div className="absolute top-14 left-0 w-full bg-white dark:bg-gray-800 shadow-md flex flex-col items-center gap-3 py-6 md:hidden">
          <NavLink to="/" end onClick={() => setMobileOpen(false)}>
            {({ isActive }) => (
              <Button
                size="sm"
                variant={isActive ? "default" : "outline"}
                className="cursor-pointer w-36"
              >
                Home
              </Button>
            )}
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/about" onClick={() => setMobileOpen(false)}>
                {({ isActive }) => (
                  <Button
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    className="cursor-pointer w-36"
                  >
                    About
                  </Button>
                )}
              </NavLink>
              <NavLink to="/services" onClick={() => setMobileOpen(false)}>
                {({ isActive }) => (
                  <Button
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    className="cursor-pointer w-36"
                  >
                    Services
                  </Button>
                )}
              </NavLink>
            </>
          )}

          {!isAuthenticated && (
            <>
              <NavLink to="/login" onClick={() => setMobileOpen(false)}>
                {({ isActive }) => (
                  <Button
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    className="cursor-pointer w-36"
                  >
                    Login
                  </Button>
                )}
              </NavLink>
              <NavLink to="/signup" onClick={() => setMobileOpen(false)}>
                {({ isActive }) => (
                  <Button
                    size="sm"
                    variant={isActive ? "default" : "outline"}
                    className="cursor-pointer w-36"
                  >
                    Signup
                  </Button>
                )}
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
