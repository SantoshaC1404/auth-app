import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
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
import { useChangePassword } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type FormData = z.infer<typeof schema>;

const ChangePassword = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const { submitChangePassword, isLoading } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async ({ currentPassword, newPassword }: FormData) => {
    await submitChangePassword(currentPassword, newPassword);
  };

  // Show all validation errors as toasts, no inline messages
  const onError = (errs: typeof errors) => {
    const first = Object.values(errs)[0];
    if (first?.message) toast.error(first.message);
  };

  return (
    <div className="flex items-center justify-center min-h-full px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Change Password</CardTitle>
            <CardDescription>
              Enter your current password and choose a new one.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-4"
            >
              {/* Current Password */}
              <div className="space-y-2">
                <Label>Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter current password"
                    {...register("currentPassword")}
                    className={errors.currentPassword ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    {...register("newPassword")}
                    className={errors.newPassword ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Changing..." : "Change Password"}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                <Link
                  to="/dashboard"
                  className="text-primary font-medium hover:underline"
                >
                  Back to Dashboard
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
