import { motion } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  RefreshCw,
  Users,
  Globe,
  Lock,
  Zap,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const services = [
  {
    icon: <KeyRound className="text-primary" size={28} />,
    title: "JWT Authentication",
    description:
      "Stateless, secure access tokens with short TTL and automatic refresh via HttpOnly cookies.",
  },
  {
    icon: <RefreshCw className="text-primary" size={28} />,
    title: "Token Refresh",
    description:
      "Silent access token renewal using rotating refresh tokens stored in secure HttpOnly cookies.",
  },
  {
    icon: <Globe className="text-primary" size={28} />,
    title: "OAuth2 / Social Login",
    description:
      "One-click sign-in with Google and GitHub using Spring Security's OAuth2 client.",
  },
  {
    icon: <ShieldCheck className="text-primary" size={28} />,
    title: "Role-Based Access Control",
    description:
      "Fine-grained authorization with user roles enforced on every protected API endpoint.",
  },
  {
    icon: <Users className="text-primary" size={28} />,
    title: "User Management",
    description:
      "Full CRUD operations for users — create, update, fetch by ID or email, and delete.",
  },
  {
    icon: <Lock className="text-primary" size={28} />,
    title: "Password Encryption",
    description:
      "Passwords hashed with BCrypt before storage — plaintext is never persisted.",
  },
  {
    icon: <Zap className="text-primary" size={28} />,
    title: "Stateless Architecture",
    description:
      "No server-side sessions. Every request is independently verified via JWT signature.",
  },
  {
    icon: <BadgeCheck className="text-primary" size={28} />,
    title: "Token Revocation",
    description:
      "Refresh tokens are stored in the database and can be individually revoked on logout.",
  },
];

const Services = () => {
  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="min-h-[40vh] flex flex-col justify-center items-center text-center px-6 bg-gradient-to-b from-background to-muted">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold tracking-tight max-w-2xl"
        >
          What We Offer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mt-4 max-w-xl"
        >
          A full-stack authentication suite built on React and Spring Boot —
          secure, scalable, and production-ready.
        </motion.p>
      </section>

      {/* Services grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={item}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-xl border hover:shadow-xl transition flex flex-col gap-3"
            >
              {s.icon}
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Tech stack */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-10"
          >
            Built With
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "React JS", sub: "Frontend" },
              { label: "Spring Boot", sub: "Backend" },
              { label: "JWT / JJWT", sub: "Tokens" },
              { label: "MySQL", sub: "Database" },
              { label: "Zustand", sub: "State" },
              { label: "Zod", sub: "Validation" },
              { label: "Tailwind CSS", sub: "Styling" },
              { label: "OAuth2", sub: "Social Login" },
            ].map((t) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-lg border bg-background px-4 py-4 text-center"
              >
                <p className="font-semibold text-sm">{t.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* <section className="py-24 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-6"
        >
          Ready to Get Started?
        </motion.h2>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/signup">
            <Button size="lg">Create Your Account</Button>
          </Link>
        </motion.div>
      </section> */}
    </div>
  );
};

export default Services;
