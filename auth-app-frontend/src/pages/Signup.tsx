import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

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

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  /*
  const onSubmit = async (data: SignupForm) => {
    try {
      console.log("Signup Data:", data);

      // Example API call
      // await axios.post("http://localhost:8080/api/auth/register", data);

      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error(error);
    }
  };
  */
  /*
  const onSubmit = async () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve("success"), 1500);
    });

    toast.promise(promise, {
      loading: "Creating account...",
      success: "Account created successfully!",
      error: "Something went wrong",
    });
  };
  */
  const onSubmit = async (data: SignupForm) => {
    try {
      console.log("Signup Data:", data);

      // await axios.post("/api/auth/register", data)

      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error("Registration failed");
    }
  };

  handleSubmit(onSubmit, (errors) => {
    const firstErrorKey = Object.keys(errors)[0] as keyof SignupForm;

    setFocus(firstErrorKey);
    toast.dismiss();
    toast.error(errors[firstErrorKey]?.message || "Invalid input");
  });

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4 pt-24">
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
            {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> */}
            <form
              onSubmit={handleSubmit(onSubmit, (errors) => {
                const firstErrorKey = Object.keys(
                  errors,
                )[0] as keyof SignupForm;

                setFocus(firstErrorKey);

                toast.error(errors[firstErrorKey]?.message || "Invalid input");
              })}
              className="space-y-4"
            >
              {/* Name */}
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="John Doe"
                  {...register("name")}
                  className={
                    errors.name
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {/* {errors.name && (
                  <p className="text-sm text-red-500 text-left block">
                    {errors.name.message}
                  </p>
                )} */}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  {...register("email")}
                  className={
                    errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />
                {errors.email && (
                  <p className="text-sm text-red-500 text-left block">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label>Password</Label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    {...register("password")}
                    className={
                      errors.password
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-sm text-red-500 text-left block">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                  className={
                    errors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                />

                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 text-left block">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Signup Button */}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2 my-6">
              <div className="h-px flex-1 bg-border"></div>
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border"></div>
            </div>

            {/* Google Signup */}
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 mb-3 cursor-pointer"
              type="button"
              onClick={() =>
                (window.location.href =
                  "http://localhost:8080/oauth2/authorization/google")
              }
            >
              <FcGoogle size={20} />
              Continue with Google
            </Button>

            {/* GitHub Signup */}
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 cursor-pointer"
              type="button"
              onClick={() =>
                (window.location.href =
                  "http://localhost:8080/oauth2/authorization/github")
              }
            >
              <FaGithub size={18} />
              Continue with GitHub
            </Button>

            {/* Login Link */}
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
  );
};

export default Signup;
