import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
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
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { useLogin } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const OAUTH_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8082";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useLogin();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  const onError = (errs: any) => {
    const firstErrorKey = Object.keys(errs)[0] as keyof LoginForm;
    setFocus(firstErrorKey);
    toast.error(errs[firstErrorKey]?.message || "Invalid input");
  };

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
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Login to your account</CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="space-y-4"
              >
                {/* Email */}
                <div className="space-y-2">
                  <Label>
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
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label>
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-end text-sm">
                  {/* <div className="flex items-center gap-2">
                    <Checkbox />
                    <span>Remember me</span>
                  </div> */}
                  <Link
                    to="/forgot-password"
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full cursor-pointer hover:bg-gray-400"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-2 my-6">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* OAuth */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 cursor-pointer"
                  type="button"
                  onClick={() =>
                    (window.location.href = `${OAUTH_BASE}/oauth2/authorization/google`)
                  }
                >
                  <FcGoogle size={18} />
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 cursor-pointer"
                  type="button"
                  onClick={() =>
                    (window.location.href = `${OAUTH_BASE}/oauth2/authorization/github`)
                  }
                >
                  <FaGithub size={18} />
                  Continue with GitHub
                </Button>
              </div>

              <p className="text-sm text-center mt-5 text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary font-medium hover:underline"
                >
                  Create account
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
