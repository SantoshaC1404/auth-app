import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Only these routes use the sidebar layout (no Navbar/Footer)
const SIDEBAR_ROUTES = ["/dashboard", "/change-password"];

const RootLayout = () => {
  const { pathname } = useLocation();
  const isSidebarRoute = SIDEBAR_ROUTES.some((r) => pathname.startsWith(r));

  if (isSidebarRoute) {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col pt-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
