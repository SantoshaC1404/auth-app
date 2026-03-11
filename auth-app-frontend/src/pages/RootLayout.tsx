import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
