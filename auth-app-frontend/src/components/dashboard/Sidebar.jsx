import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  KeyRound,
  LogOut,
  ShieldCheck,
  Layers,
  Trash2,
  Menu,
  X,
  Sparkles,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useLogout } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/change-password", icon: KeyRound, label: "Change Password" },
  { to: "/about", icon: ShieldCheck, label: "About" },
  { to: "/services", icon: Layers, label: "Services" },
];

const secondaryItems = [
  { to: "/help", icon: HelpCircle, label: "Help & Support" },
  {
    to: "/delete-account",
    icon: Trash2,
    label: "Delete Account",
    dangerous: true,
  },
];

const navLinkClass =
  (label, dangerous) =>
  ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
        : dangerous
          ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

const SidebarContent = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout, isLoading } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border/50">
      {/* Brand */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">AuthFlow</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer md:hidden"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
          Main Menu
        </p>
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={navLinkClass(label)}
            onClick={() => onClose?.()}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        <div className="pt-6">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Support & Settings
          </p>
          {secondaryItems.map(({ to, icon: Icon, label, dangerous }) => (
            <NavLink
              key={to}
              to={to}
              className={navLinkClass(label, dangerous)}
              onClick={() => onClose?.()}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-border/40 shrink-0">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-all disabled:opacity-50 cursor-pointer"
        >
          <LogOut size={18} />
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar - Fixed */}
      <aside className="hidden md:flex flex-col w-64 h-screen border-r bg-background fixed top-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">AuthFlow</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl hover:bg-muted transition-colors cursor-pointer"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-72 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;
