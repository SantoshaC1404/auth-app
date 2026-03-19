import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useDeleteAccount } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth.store";

const CONFIRM_TEXT = "DELETE MY ACCOUNT";

const DeleteAccount = () => {
  const [inputValue, setInputValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { submitDeleteAccount, isLoading } = useDeleteAccount();
  const user = useAuthStore((s) => s.user);

  const isConfirmed = inputValue === CONFIRM_TEXT;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen pt-14 md:pt-0">
        <div className="hidden md:block">
          <Header />
        </div>

        <main className="p-4 md:p-6 flex items-start justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-lg"
          >
            <Card className="border-destructive/40">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <TriangleAlert size={20} className="text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-destructive">
                      Delete Account
                    </CardTitle>
                    <CardDescription>
                      This action is permanent and cannot be undone.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Warning box */}
                <div className="rounded-lg bg-destructive/8 border border-destructive/20 p-4 space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    What will be deleted:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Your account ({user?.email})</li>
                    <li>All active sessions and tokens</li>
                    <li>All associated data</li>
                  </ul>
                </div>

                {/* Confirmation input */}
                <div className="space-y-2">
                  <Label className="text-sm">
                    Type{" "}
                    <span className="font-mono font-bold text-destructive">
                      {CONFIRM_TEXT}
                    </span>{" "}
                    to confirm
                  </Label>
                  <Input
                    placeholder={CONFIRM_TEXT}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className={`font-mono ${isConfirmed ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button
                    variant="destructive"
                    className="w-full cursor-pointer"
                    disabled={!isConfirmed || isLoading}
                    onClick={() => setDialogOpen(true)}
                  >
                    Delete My Account
                  </Button>
                  <Link to="/dashboard" className="w-full">
                    <Button variant="outline" className="w-full cursor-pointer">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>

      {/* Final confirmation dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <TriangleAlert size={18} /> Are you absolutely sure?
            </DialogTitle>
            <DialogDescription>
              Your account <span className="font-medium">{user?.email}</span>{" "}
              will be permanently deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isLoading}
              className="cursor-pointer"
            >
              No, keep my account
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                setDialogOpen(false);
                await submitDeleteAccount();
              }}
              disabled={isLoading}
              className="cursor-pointer"
            >
              {isLoading ? "Deleting..." : "Yes, delete permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteAccount;
