import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useRegister } from "@/hooks/useAuth";

const signupSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    email: z.string().trim().email("Enter a valid email"),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

const OAUTH_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8082";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading } = useRegister();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async ({ name, email, password }: SignupForm) => {
    await registerUser({ name, email, password });
  };

  const onError = (errs: typeof errors) => {
    const firstKey = Object.keys(errs)[0] as keyof SignupForm;
    setFocus(firstKey);
    toast.error(errs[firstKey]?.message ?? "Invalid input");
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 500,
  } as React.CSSProperties;

  return (
    <>
      <div className="flex items-center justify-center min-h-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Sign up to start using the platform
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="space-y-4"
              >
                {/* Name */}
                <div className="space-y-2">
                  <Label style={labelStyle}>
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <HiOutlineUser size={16} />
                    </span>
                    <Input
                      placeholder="John Doe"
                      {...register("name")}
                      className={`pl-9 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                  </div>
                  {/* {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )} */}
                </div>

                {/* Email */}
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
                      {...register("email")}
                      className={`pl-9 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                  </div>
                  {/* {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )} */}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label style={labelStyle}>
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <HiOutlineLockClosed size={16} />
                    </span>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      {...register("password")}
                      className={`pl-9 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )} */}
                </div>

                {/* Confirm Password */}
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
                      placeholder="Confirm password"
                      {...register("confirmPassword")}
                      className={`pl-9 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                  </div>
                  {/* {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )} */}
                </div>

                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-2 my-6">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2 mb-3 cursor-pointer"
                type="button"
                onClick={() =>
                  (window.location.href = `${OAUTH_BASE}/oauth2/authorization/google`)
                }
              >
                <FcGoogle size={18} /> Continue with Google
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2 cursor-pointer"
                type="button"
                onClick={() =>
                  (window.location.href = `${OAUTH_BASE}/oauth2/authorization/github`)
                }
              >
                <FaGithub size={18} /> Continue with GitHub
              </Button>

              <p className="text-sm text-center text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Login
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Signup;
