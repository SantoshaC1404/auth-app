import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, ShieldCheck, KeyRound } from "lucide-react";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useForgotPassword } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const OTP_SECONDS = 10 * 60; // 10 minutes

function useOtpTimer(active: boolean) {
  const [seconds, setSeconds] = useState(OTP_SECONDS);
  const [expired, setExpired] = useState(false);

  const reset = useCallback(() => {
    setSeconds(OTP_SECONDS);
    setExpired(false);
  }, []);

  useEffect(() => {
    if (!active) return;
    setSeconds(OTP_SECONDS);
    setExpired(false);
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setExpired(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const formatted = `${mm}:${ss}`;

  return { formatted, expired, reset };
}

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailForm = z.infer<typeof emailSchema>;
type OtpForm = z.infer<typeof otpSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const steps = [
  { icon: Mail, label: "Email" },
  { icon: ShieldCheck, label: "Verify OTP" },
  { icon: KeyRound, label: "New Password" },
];

const StepIndicator = ({ current }: { current: number }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {steps.map((s, i) => {
      const Icon = s.icon;
      const done = i < current;
      const active = i === current;
      return (
        <div key={s.label} className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-colors
              ${done || active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            {done ? "✓" : <Icon size={14} />}
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-px w-8 transition-colors ${done ? "bg-primary" : "bg-border"}`}
            />
          )}
        </div>
      );
    })}
  </div>
);

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { step, isLoading, email, submitEmail, submitOtp, submitNewPassword } =
    useForgotPassword();
  const {
    formatted: timerDisplay,
    expired: otpExpired,
    reset: resetTimer,
  } = useOtpTimer(step === "otp");

  const stepIndex = step === "email" ? 0 : step === "otp" ? 1 : 2;

  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });
  const otpForm = useForm<OtpForm>({ resolver: zodResolver(otpSchema) });
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onPasswordError = (errs: any) => {
    const first = Object.values(errs)[0] as any;
    if (first?.message) toast.error(first.message);
  };

  const slideVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 500,
  } as React.CSSProperties;

  return (
    <>
      <div className="auth-bg flex-1">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Forgot Password</CardTitle>
              <CardDescription>
                {step === "email" && "Enter your email to receive an OTP."}
                {step === "otp" && `Enter the 6-digit OTP sent to ${email}`}
                {step === "password" &&
                  "Choose a new password for your account."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <StepIndicator current={stepIndex} />

              <AnimatePresence mode="wait">
                {/* Step 1: Email */}
                {step === "email" && (
                  <motion.form
                    key="email"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onSubmit={emailForm.handleSubmit(
                      (d) => submitEmail(d.email),
                      (errs) => {
                        const first = Object.values(errs)[0] as any;
                        if (first?.message) toast.error(first.message);
                      },
                    )}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label style={labelStyle}>
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                          <HiOutlineMail size={16} />
                        </span>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          {...emailForm.register("email")}
                          className={`pl-9 ${emailForm.formState.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">
                      Remember your password?{" "}
                      <Link
                        to="/login"
                        className="text-primary font-medium hover:underline"
                      >
                        Back to Login
                      </Link>
                    </p>
                  </motion.form>
                )}

                {/* Step 2: OTP */}
                {step === "otp" && (
                  <motion.form
                    key="otp"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onSubmit={otpForm.handleSubmit(
                      (d) => submitOtp(d.otp),
                      (errs) => {
                        const first = Object.values(errs)[0] as any;
                        if (first?.message) toast.error(first.message);
                      },
                    )}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label style={labelStyle}>
                        One-Time Password{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        {...otpForm.register("otp")}
                        className={`tracking-[0.5em] text-center text-lg font-bold ${
                          otpForm.formState.errors.otp ? "border-red-500" : ""
                        }`}
                      />
                      <p
                        className={`text-xs text-center font-medium ${otpExpired ? "text-destructive" : "text-muted-foreground"}`}
                      >
                        {otpExpired
                          ? "OTP expired — please resend"
                          : `Expires in ${timerDisplay}`}
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">
                      Didn't receive it?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          submitEmail(email);
                          resetTimer();
                        }}
                        className="text-primary font-medium hover:underline"
                        disabled={isLoading}
                      >
                        Resend OTP
                      </button>
                    </p>
                  </motion.form>
                )}

                {/* Step 3: New Password */}
                {step === "password" && (
                  <motion.form
                    key="password"
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onSubmit={passwordForm.handleSubmit(
                      (d) => submitNewPassword(d.newPassword),
                      onPasswordError,
                    )}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label style={labelStyle}>
                        New Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                          <HiOutlineLockClosed size={16} />
                        </span>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...passwordForm.register("newPassword")}
                          className={`pl-9 pr-10 ${passwordForm.formState.errors.newPassword ? "border-red-500" : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label style={labelStyle}>
                        Confirm Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                          <HiOutlineLockClosed size={16} />
                        </span>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          {...passwordForm.register("confirmPassword")}
                          className={`pl-9 ${passwordForm.formState.errors.confirmPassword ? "border-red-500" : ""}`}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;
