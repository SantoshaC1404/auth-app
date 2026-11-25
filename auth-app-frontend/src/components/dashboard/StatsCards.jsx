import { motion } from "framer-motion";
import {
  ShieldCheck,
  Globe,
  Clock,
  LogIn,
  KeyRound,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";

function timeAgo(isoString) {
  if (!isoString) return "—";
  const diff = Math.max(0, Date.now() - new Date(isoString).getTime());
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  return `${months}mo ago`;
}

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const StatsCards = () => {
  const user = useAuthStore((s) => s.user);
  const providerLabel =
    user?.provider === "GOOGLE"
      ? "Google"
      : user?.provider === "GITHUB"
        ? "GitHub"
        : "Local";

  const stats = [
    {
      label: "Account Status",
      value: "Active",
      sub: "All security systems normal",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/40",
    },
    {
      label: "Auth Provider",
      value: providerLabel,
      sub: user?.email ?? "—",
      icon: Globe,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/40",
    },
    {
      label: "Session Token",
      value: "Secure JWT",
      sub: "Encrypted & HttpOnly",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-500/40",
    },
    {
      label: "Last Login",
      value: user?.loginAt ? timeAgo(user.loginAt) : "—",
      sub: user?.loginAt
        ? new Date(user.loginAt).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            month: "short",
            day: "numeric",
          })
        : "—",
      icon: LogIn,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/40",
    },
    {
      label: "Profile Updated",
      value: user?.updatedAt ? timeAgo(user.updatedAt) : "—",
      sub: user?.updatedAt ? formatDate(user.updatedAt) : "—",
      icon: KeyRound,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "hover:border-rose-500/40",
    },
    {
      label: "Member Since",
      value: user?.createdAt ? timeAgo(user.createdAt) : "—",
      sub: user?.createdAt ? formatDate(user.createdAt) : "—",
      icon: UserCheck,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "hover:border-indigo-500/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            whileHover={{ rotate: 2, scale: 1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card
              className={`border border-border/80 shadow-sm transition-all duration-200 hover:shadow-md ${stat.border} bg-card/60 backdrop-blur-xs`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 overflow-hidden">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-extrabold tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground truncate font-medium">
                      {stat.sub}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.bg} shrink-0`}>
                    <Icon size={22} className={stat.color} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;
