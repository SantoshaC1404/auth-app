import {
  Shield,
  Lock,
  User,
  Zap,
  Mail,
  Phone,
  MailCheck,
  Clock,
  Sparkles,
  CheckCircle,
  Folder,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";
import { useAuthStore } from "@/store/auth.store";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
  transition: { staggerChildren: 0.12 },
};

const title = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

export default function HomePage() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="overflow-x-hidden bg-background text-foreground">
      {/* ===== HERO SECTION ===== */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-4 sm:px-6 py-16 sm:py-24 bg-linear-to-b from-background via-muted/30 to-background border-b border-border/40">
        <motion.h1
          initial={title.hidden}
          animate={title.show}
          transition={title.transition}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-3xl mb-6 leading-tight"
        >
          Secure Authentication <br />
          <span className="text-primary">for Modern Enterprises</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-normal"
        >
          Enterprise-grade authentication platform with JWT authorization,
          role-based access control, and scalable user management built for
          mission-critical applications.
        </motion.p>

        <div className="flex gap-4 flex-wrap justify-center">
          <NavLink to={isAuthenticated ? "/dashboard" : "/signup"}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-primary/20 cursor-pointer"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              </Button>
            </motion.div>
          </NavLink>
        </div>
      </section>

      {/* ===== TRUST BADGE HERO ===== */}
      <section className="py-16 sm:py-20 bg-muted/40 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mx-auto max-w-4xl">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/60 shadow-xs">
              <Sparkles className="h-8 w-8 text-primary mb-1" />
              <span className="text-2xl font-bold tracking-tight">99.9%</span>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Uptime guarantee
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/60 shadow-xs">
              <Lock className="h-8 w-8 text-primary mb-1" />
              <span className="text-2xl font-bold tracking-tight">256-bit</span>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                AES encryption
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/60 shadow-xs">
              <Shield className="h-8 w-8 text-primary mb-1" />
              <span className="text-2xl font-bold tracking-tight">GDPR</span>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Compliant
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/60 shadow-xs">
              <CheckCircle className="h-8 w-8 text-primary mb-1" />
              <span className="text-2xl font-bold tracking-tight">50ms</span>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Auth latency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <motion.h2
            initial={title.hidden}
            animate={title.show}
            transition={{ ...title.transition, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Powerful Authentication Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto"
          >
            Enterprise-grade security features designed for modern applications
            at scale.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
        >
          {[
            {
              Icon: Lock,
              title: "Enterprise-Grade Security",
              desc: "256-bit AES encryption, JWT tokens with refresh rotation, and secure password hashing with Argon2. Built to pass strict audits.",
            },
            {
              Icon: Shield,
              title: "Role-Based Access Control",
              desc: "Fine-grained permission system with nested roles, department-level access control, and dynamic policy evaluation.",
            },
            {
              Icon: User,
              title: "Scalable User Management",
              desc: "Manage millions of users with bulk operations, custom workflows, and real-time activity monitoring out of the box.",
            },
            {
              Icon: Zap,
              title: "Fast Integration",
              desc: "Type-safe SDKs for React, Vue, and native apps. Zero-configuration setup with webhook events for authentication lifecycle.",
            },
            {
              Icon: Folder,
              title: "Audit & Compliance",
              desc: "Complete audit trail with immutable logging, retention policies, and export capabilities for SOC 2, HIPAA, and GDPR.",
            },
            {
              Icon: MailCheck,
              title: "Secure Communication",
              desc: "End-to-end encrypted email notifications, password reset flows, and two-factor authentication integration ready.",
            },
            {
              Icon: Phone,
              title: "Multi-Factor Auth",
              desc: "TOTP, SMS-based OTP, email magic links, and push notifications. Adaptive risk-based authentication challenges.",
            },
            {
              Icon: Clock,
              title: "High Performance",
              desc: "Sub-50ms authentication latency globally with anycast routing and edge caching for zero-downtime reliability.",
            },
          ].map(({ Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={item}
              whileHover={{ y: -4 }}
              className="group flex flex-col h-full bg-card text-card-foreground border border-border/80 rounded-2xl p-6 sm:p-8 transition-all shadow-sm hover:shadow-md hover:border-primary/50"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon
                  className="text-primary group-hover:text-primary-foreground transition-colors"
                  size={24}
                />
              </div>
              <h3 className="font-semibold text-base mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground flex-1 leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 sm:py-32 bg-muted/30 border-y border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Get your secure authentication system up and running in three
              simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                step: "1",
                title: "User Onboarding",
                desc: "Users register with secure credential storage. Email verification and onboarding wizard guides new users through setup.",
                Icon: User,
              },
              {
                step: "2",
                title: "Authentication",
                desc: "Secure login with JWT generation, MFA challenge, and risk-based authentication. Token refresh and session management.",
                Icon: Lock,
              },
              {
                step: "3",
                title: "API Access",
                desc: "Protected routes and fine-grained authorization. API keys and client credentials for server-to-server access and throttling.",
                Icon: Shield,
              },
            ].map(({ step, title, desc, Icon }) => (
              <motion.div
                key={step}
                initial={stagger.hidden}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, ...stagger.transition }}
                viewport={{ once: true }}
                className="bg-card text-card-foreground border border-border/80 p-8 rounded-2xl shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-6 right-6 text-4xl font-extrabold text-muted/40">
                  0{step}
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 sm:py-32 overflow-hidden relative bg-linear-to-b from-transparent to-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center">
          <motion.h2
            initial={title.hidden}
            animate={title.show}
            transition={{ ...title.transition, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Ready to Secure Your Enterprise?
          </motion.h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of enterprises that trust AuthFlow for their
            authentication infrastructure. Start free, scale globally.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <NavLink to={isAuthenticated ? "/dashboard" : "/signup"}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
                </Button>
              </motion.div>
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}
