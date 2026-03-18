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

function timeAgo(isoString: string): string {
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

function formatDate(isoString: string): string {
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
      sub: "All systems normal",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Auth Provider",
      value: providerLabel,
      sub: user?.email ?? "—",
      icon: Globe,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Session",
      value: "Active",
      sub: "Auto-expires in 15 min idle",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
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
    },
    {
      label: "Profile/Password Updated",
      value: user?.updatedAt ? timeAgo(user.updatedAt) : "—",
      sub: user?.updatedAt ? formatDate(user.updatedAt) : "—",
      icon: KeyRound,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      label: "Account Created",
      value: user?.createdAt ? timeAgo(user.createdAt) : "—",
      sub: user?.createdAt ? formatDate(user.createdAt) : "—",
      icon: UserCheck,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Card className="hover:shadow-md transition-shadow hover:scale-[1.03] transition-transform duration-200">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 overflow-hidden">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {stat.sub}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${stat.bg} shrink-0`}>
                    <Icon size={20} className={stat.color} />
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
