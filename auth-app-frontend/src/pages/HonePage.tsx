import { ShieldCheck, Lock, UserCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const HomePage = () => {
  return (
    <div className="overflow-x-hidden pt-4">
      {/* HERO SECTION */}
      <section className="min-h-[calc(80vh-5rem)] flex flex-col justify-center items-center text-center px-4 sm:px-4 py-10 sm:py-0 bg-gradient-to-b from-background to-muted">
        {" "}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-3xl"
        >
          Secure Authentication <br /> for Modern Applications
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mt-4 sm:mt-6 max-w-xl text-sm sm:text-base px-2"
        >
          A powerful authentication system with secure login, JWT authorization,
          and scalable user management built for modern apps.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 mt-6 sm:mt-8"
        >
          <NavLink to={"/signup"}>
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <Button size="lg" className="hover:bg-gray-400 cursor-pointer">
                Get Started
              </Button>
            </motion.div>
          </NavLink>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-14">
          Powerful Authentication Features
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {[
            {
              Icon: Lock,
              title: "Secure Login",
              desc: "JWT based authentication with encrypted password protection.",
            },
            {
              Icon: ShieldCheck,
              title: "Role Based Access",
              desc: "Control user permissions with flexible role-based authorization.",
            },
            {
              Icon: UserCheck,
              title: "User Management",
              desc: "Manage users securely and monitor activity easily.",
            },
            {
              Icon: Zap,
              title: "Fast Integration",
              desc: "Easily integrate authentication into modern frontend apps.",
            },
          ].map(({ Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="p-5 sm:p-6 rounded-xl border hover:shadow-xl transition"
            >
              <Icon className="mb-3 sm:mb-4 text-primary" size={28} />
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-12 sm:py-20 bg-muted">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                step: "1. Register",
                desc: "Users create an account with encrypted credentials.",
                delay: 0,
              },
              {
                step: "2. Authenticate",
                desc: "Login generates secure JWT tokens for authorization.",
                delay: 0.2,
              },
              {
                step: "3. Access APIs",
                desc: "Protected routes ensure secure access to your APIs.",
                delay: 0.4,
              },
            ].map(({ step, desc, delay }) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold mb-2">{step}</h3>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-24 text-center px-4 sm:px-6 overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-4xl font-bold mb-6"
        >
          Ready to Secure Your Application?
        </motion.h2>

        <NavLink to={"/signup"}>
          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <Button size="lg" className="hover:bg-gray-500 cursor-pointer">
              Create Your Account
            </Button>
          </motion.div>
        </NavLink>
      </section>
    </div>
  );
};

export default HomePage;
