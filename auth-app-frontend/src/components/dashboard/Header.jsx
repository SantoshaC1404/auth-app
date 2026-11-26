import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Sparkles,
  LogOut,
  LayoutDashboard,
  KeyRound,
  Trash2,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/useAuth";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
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
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
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
        className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm shadow-primary/20 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none"
        aria-label="Profile menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl z-50 overflow-hidden">
          {/* User Profile Summary Header */}
          <div className="px-5 py-5 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground text-lg font-bold shrink-0 shadow-sm shadow-primary/30">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-foreground">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate font-medium">
                  {user?.email}
                </p>
                <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {user?.roles?.[0] ?? "Member"}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 space-y-0.5">
            <NavLink
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </NavLink>

            <NavLink
              to="/change-password"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <KeyRound size={16} />
              Change Password
            </NavLink>

            <NavLink
              to="/delete-account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 size={16} />
              Delete Account
            </NavLink>

            <div className="h-px bg-border/50 my-1" />

            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <LogOut size={16} />
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 fixed top-0 right-0 left-0 md:left-64 z-30">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 bg-muted px-2.5 py-1 rounded-md">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <div className="relative">
          <button
            className="relative p-2 rounded-xl border border-border/60 hover:bg-muted/80 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
          </button>
        </div>

        <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block" />

        <ProfileMenu />
      </div>
    </header>
  );
};

export default Header;
