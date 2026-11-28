import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteAccount } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth.store";

export const DeleteAccountModal = ({ isOpen, onClose }) => {
  const { submitDeleteAccount, isLoading } = useDeleteAccount();
  const user = useAuthStore((s) => s.user);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-85 border-destructive/20 shadow-2xl z-100 rounded-3xl p-5">
        <DialogHeader className="space-y-2 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-1">
            <TriangleAlert size={20} />
          </div>
          <DialogTitle className="text-base font-bold text-destructive">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            This action is permanent and cannot be undone. Are you sure?
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 text-[11px] text-muted-foreground text-center bg-muted/30 rounded-xl px-2">
          Deleting{" "}
          <span className="font-semibold text-foreground break-all">
            {user?.email}
          </span>
        </div>

        <DialogFooter className="flex flex-row gap-2 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer flex-1 h-9 font-semibold text-xs rounded-xl"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await submitDeleteAccount();
              onClose();
            }}
            disabled={isLoading}
            className="cursor-pointer flex-1 h-9 font-bold text-xs rounded-xl shadow-sm shadow-destructive/20"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
