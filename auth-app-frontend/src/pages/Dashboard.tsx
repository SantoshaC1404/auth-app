import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsCards from "@/components/dashboard/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header />

        <main className="p-6 space-y-8">
          {/* Welcome */}
          <div>
            <h2 className="text-2xl font-bold">Welcome back 👋</h2>
            <p className="text-muted-foreground">
              Here is your authentication overview
            </p>
          </div>

          <StatsCards />

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>✔ Logged in from Chrome — 3 minutes ago</p>
              <p>✔ Google account linked</p>
              <p>✔ Password updated — 2 days ago</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
