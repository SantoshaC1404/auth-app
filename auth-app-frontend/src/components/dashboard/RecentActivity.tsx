import { useAuthStore } from "@/store/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, KeyRound, UserCheck } from "lucide-react";

// ─── Time helper ──────────────────────────────────────────────────────────────

function timeAgo(isoString: string): string {
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

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

const RecentActivity = () => {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const activities = [
    {
      icon: LogIn,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      label: "Signed in",
      detail: `Logged in ${timeAgo(user.loginAt)}`,
    },
    {
      icon: KeyRound,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      label: "Password / profile updated",
      detail: `Last updated ${timeAgo(user.updatedAt)} · ${formatDate(user.updatedAt)}`,
    },
    {
      icon: UserCheck,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      label: "Account created",
      detail: `Joined ${timeAgo(user.createdAt)} · ${formatDate(user.createdAt)}`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {activities.map(({ icon: Icon, color, bg, label, detail }) => (
          <div key={label} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${bg} shrink-0 mt-0.5`}>
              <Icon size={14} className={color} />
            </div>
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
