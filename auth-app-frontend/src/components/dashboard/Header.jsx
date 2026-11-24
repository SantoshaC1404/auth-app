import { Bell, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  const user = useAuthStore((s) => s.user);
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
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

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm shadow-primary/20">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold leading-none">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {user?.roles?.[0] ?? "Member"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
