import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShieldCheck, User } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Active Sessions",
    value: "2",
    icon: Activity,
  },
  {
    title: "Security Score",
    value: "98%",
    icon: ShieldCheck,
  },
  {
    title: "Profile Status",
    value: "Complete",
    icon: User,
  },
];

const StatsCards = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <stat.icon className="text-primary" size={18} />
            </CardHeader>

            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
