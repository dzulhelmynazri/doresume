"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@doresume/ui/components/alert-dialog";
import { Button } from "@doresume/ui/components/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@doresume/ui/components/card";
import { Spinner } from "@doresume/ui/components/spinner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const AccountDeletion = () => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, startDeleting] = useTransition();

  const handleDelete = () => {
    startDeleting(async () => {
      try {
        const { error } = await authClient.deleteUser();

        if (error) {
          toast.error(error.message ?? "Could not delete your account.");
          return;
        }

        setConfirmOpen(false);
        toast.success("Your account has been deleted.");
        router.push("/");
      } catch {
        toast.error("Could not delete your account.");
      }
    });
  };

  return (
    <div className="flex max-w-md flex-col gap-4 py-4">
      <CardHeader>
        <CardTitle>Account deletion</CardTitle>
        <CardDescription>
          Permanently remove your account and everything stored on it. This
          cannot be undone.
        </CardDescription>
      </CardHeader>
      <AlertDialog
        onOpenChange={(open) => {
          if (isDeleting) {
            return;
          }
          setConfirmOpen(open);
        }}
        open={confirmOpen}
      >
        <AlertDialogTrigger
          className="self-start"
          render={<Button type="button" variant="destructive" />}
        >
          Delete account
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              Your profile, applications, documents, and connected integrations
              will be removed permanently. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDelete}
              variant="destructive"
            >
              {isDeleting ? <Spinner data-icon="inline-start" /> : null}
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { AccountDeletion };
