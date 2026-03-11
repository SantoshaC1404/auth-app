import { ShieldCheck, Lock, UserCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const HomePage = () => {
  return (
    <div className="pt-14">
      {/* HERO SECTION */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-background to-muted">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold tracking-tight max-w-3xl"
        >
          Secure Authentication <br /> for Modern Applications
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mt-6 max-w-xl"
        >
          A powerful authentication system with secure login, JWT authorization,
          and scalable user management built for modern apps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 mt-8"
        >
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">
            View Documentation
          </Button>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14">
          Powerful Authentication Features
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <motion.div
            variants={item}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl border hover:shadow-xl transition"
          >
            <Lock className="mb-4 text-primary" size={32} />
            <h3 className="font-semibold mb-2">Secure Login</h3>
            <p className="text-sm text-muted-foreground">
              JWT based authentication with encrypted password protection.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl border hover:shadow-xl transition"
          >
            <ShieldCheck className="mb-4 text-primary" size={32} />
            <h3 className="font-semibold mb-2">Role Based Access</h3>
            <p className="text-sm text-muted-foreground">
              Control user permissions with flexible role-based authorization.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl border hover:shadow-xl transition"
          >
            <UserCheck className="mb-4 text-primary" size={32} />
            <h3 className="font-semibold mb-2">User Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage users securely and monitor activity easily.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl border hover:shadow-xl transition"
          >
            <Zap className="mb-4 text-primary" size={32} />
            <h3 className="font-semibold mb-2">Fast Integration</h3>
            <p className="text-sm text-muted-foreground">
              Easily integrate authentication into modern frontend apps.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-muted">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-2">1. Register</h3>
              <p className="text-muted-foreground text-sm">
                Users create an account with encrypted credentials.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-2">2. Authenticate</h3>
              <p className="text-muted-foreground text-sm">
                Login generates secure JWT tokens for authorization.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold mb-2">3. Access APIs</h3>
              <p className="text-muted-foreground text-sm">
                Protected routes ensure secure access to your APIs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-15 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-6"
        >
          Ready to Secure Your Application?
        </motion.h2>

        <motion.div whileHover={{ scale: 1.1 }}>
          <Button size="lg">Create Your Account</Button>
        </motion.div>
      </section>

      {/* FOOTER */}
      {/* <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Auth App • Built with React + Spring Boot
      </footer> */}
    </div>
  );
};

export default HomePage;
