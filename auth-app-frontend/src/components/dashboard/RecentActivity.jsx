import { useAuthStore } from "@/store/auth.store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LogIn, KeyRound, UserCheck, Shield } from "lucide-react";

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
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const RecentActivity = () => {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  const activities = [
    {
      icon: LogIn,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      label: "Recent Authentication",
      detail: `Signed in ${timeAgo(user.loginAt)}`,
    },
    {
      icon: KeyRound,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      label: "Profile / Security Update",
      detail: `Last modified ${timeAgo(user.updatedAt)} (${formatDate(user.updatedAt)})`,
    },
    {
      icon: UserCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      label: "Account Registration",
      detail: `Joined platform ${timeAgo(user.createdAt)} (${formatDate(user.createdAt)})`,
    },
  ];

  return (
    <Card className="border border-border/80 shadow-sm bg-card/60 backdrop-blur-xs">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10">
            <Shield size={18} className="text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Activity Log</CardTitle>
            <CardDescription className="text-xs">
              Recent security events and authentication milestones
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {activities.map(({ icon: Icon, color, bg, label, detail }) => (
          <div
            key={label}
            className="flex items-start gap-4 p-3 rounded-xl bg-muted/30 border border-border/40 transition-colors hover:bg-muted/50"
          >
            <div className={`p-2.5 rounded-xl ${bg} shrink-0 mt-0.5`}>
              <Icon size={16} className={color} />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground font-medium">
                {detail}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
