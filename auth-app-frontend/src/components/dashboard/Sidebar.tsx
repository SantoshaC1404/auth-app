import { LayoutDashboard, User, Shield, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Profile", icon: User },
  { name: "Security", icon: Shield },
  { name: "Settings", icon: Settings },
];

const Sidebar = () => {
  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 border-r bg-background h-screen p-5 flex flex-col justify-between"
    >
      <div>
        <h2 className="text-xl font-bold mb-8">Auth Dashboard</h2>

        <nav className="space-y-3">
          {menu.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className="w-full justify-start gap-3"
            >
              <item.icon size={18} />
              {item.name}
            </Button>
          ))}
        </nav>
      </div>

      <Button variant="outline" className="gap-2">
        <LogOut size={16} />
        Logout
      </Button>
    </motion.div>
  );
};

export default Sidebar;
