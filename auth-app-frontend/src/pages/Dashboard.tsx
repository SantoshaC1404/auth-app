import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsCards from "@/components/dashboard/StatsCards";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen pt-14 md:pt-0">
        <div className="hidden md:block">
          <Header />
        </div>

        <main className="p-4 md:p-6 space-y-6 md:space-y-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Welcome back 👋</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Here is your authentication overview
            </p>
          </div>

          <StatsCards />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
