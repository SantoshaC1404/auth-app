import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  KeyRound,
  LogOut,
  ShieldCheck,
  Layers,
  Menu,
  X,
} from "lucide-react";
import { logoutUser } from "@/services/auth.service";
import toast from "react-hot-toast";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/change-password", icon: KeyRound, label: "Change Password" },
  { to: "/about", icon: ShieldCheck, label: "About" },
  { to: "/services", icon: Layers, label: "Services" },
  { to: "/logout", icon: LogOut, label: "Logout" },
];

const navLinkClass =
  (label: string) =>
  ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary text-primary-foreground"
        : label === "Logout"
          ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    }`;

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const navigate = useNavigate();

  const handleNavClick = async (
    e: React.MouseEvent,
    to: string,
    label: string,
  ) => {
    if (label === "Logout") {
      e.preventDefault();
      try {
        await logoutUser();
        toast.success("Logged out.");
        navigate("/login");
      } catch {
        toast.error("Logout failed.");
      }
      onClose?.();
    } else {
      onClose?.();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 h-14 border-b shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-gradient-to-r from-primary to-primary/50 text-primary-foreground text-xs font-bold">
            A
          </span>
          <span className="font-bold text-base tracking-tight">Auth App</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-accent cursor-pointer"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={navLinkClass(label)}
            onClick={(e) => handleNavClick(e, to, label)}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen border-r bg-background shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 border-b bg-background flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-gradient-to-r from-primary to-primary/50 text-primary-foreground text-xs font-bold">
            A
          </span>
          <span className="font-bold text-base tracking-tight">Auth App</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-accent cursor-pointer"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-background border-r z-50 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;
