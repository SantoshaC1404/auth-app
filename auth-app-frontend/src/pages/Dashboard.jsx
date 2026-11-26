import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useAuthStore } from "@/store/auth.store";
import { Sparkles, ShieldCheck } from "lucide-react";

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen pt-16 md:ml-64">
        <Header />

        <main className="flex-1 p-6 md:p-10 space-y-8 max-w-7xl w-full mx-auto">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  <Sparkles size={13} />
                  Enterprise Portal
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || "User"}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground font-medium">
                Here is your live authentication and account security overview.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-muted/40 border border-border/60 px-4 py-3 rounded-xl shrink-0">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Security Status
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  Fully Protected
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight">
              Account Overview
            </h2>
            <StatsCards />
          </div>

          {/* Recent Activity Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight">
              Activity & Security Log
            </h2>
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
