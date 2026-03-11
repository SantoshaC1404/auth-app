import { motion } from "framer-motion";
import { Github, Linkedin, Code2, BookOpen, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const timeline = [
  {
    icon: <BookOpen size={18} className="text-primary" />,
    title: "Project Setup",
    desc: "Initialized React + Vite frontend and Spring Boot backend with multi-profile YAML configuration.",
  },
  {
    icon: <Shield size={18} className="text-primary" />,
    title: "Auth System",
    desc: "Implemented JWT access & rotating refresh tokens with HttpOnly cookie storage.",
  },
  {
    icon: <Code2 size={18} className="text-primary" />,
    title: "OAuth2 Integration",
    desc: "Added Google and GitHub social login using Spring Security OAuth2 client.",
  },
  {
    icon: <Heart size={18} className="text-primary" />,
    title: "Frontend Polish",
    desc: "Built a clean UI with Tailwind CSS, shadcn/ui, Framer Motion, and dark mode support.",
  },
];

const About = () => {
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
          About This Project
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mt-4 max-w-xl"
        >
          A full-stack authentication application built to learn and demonstrate
          industry-standard security practices with React and Spring Boot.
        </motion.p>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border p-10 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">The Goal</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Most tutorials cover only the basics of authentication. This project
            goes further — implementing rotating refresh tokens, token
            revocation, silent re-authentication, role-based route guards,
            OAuth2 social login, and a layered frontend architecture that
            mirrors what you'd find in a production codebase.
          </p>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="py-10 px-6 max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          How It Was Built
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative border-l-2 border-border pl-8 space-y-10"
        >
          {timeline.map((t) => (
            <motion.div key={t.title} variants={item} className="relative">
              {/* Dot */}
              <span className="absolute -left-[2.65rem] flex items-center justify-center h-8 w-8 rounded-full bg-background border-2 border-border">
                {t.icon}
              </span>
              <h3 className="font-semibold mb-1">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Tech highlights */}
      <section className="py-20 bg-muted mt-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Architecture Highlights
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                title: "Layered Frontend",
                desc: "API layer → Service layer → Custom hooks → Pages. Each layer has a single responsibility.",
              },
              {
                title: "Secure Token Flow",
                desc: "Access tokens live in memory (Zustand). Refresh tokens live in HttpOnly cookies — never accessible to JavaScript.",
              },
              {
                title: "Spring Security",
                desc: "JWT filter chain, stateless session policy, custom auth entry point, and CORS configured for the React origin.",
              },
            ].map((h) => (
              <motion.div
                key={h.title}
                variants={item}
                whileHover={{ scale: 1.03 }}
                className="p-6 rounded-xl border bg-background hover:shadow-lg transition"
              >
                <h3 className="font-semibold mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4"
        >
          Try It Yourself
        </motion.h2>
        <p className="text-muted-foreground mb-8">
          Create a free account and explore the authentication flow.
        </p>
        <div className="flex justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/services">
              <Button size="lg" variant="outline">
                View Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
