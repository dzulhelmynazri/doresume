"use client";

import { Badge } from "@doresume/ui/components/badge";
import { Button } from "@doresume/ui/components/button";
import { Spinner } from "@doresume/ui/components/spinner";
import { Google } from "@doresume/ui/socials/google";
import { LinkedIn } from "@doresume/ui/socials/linkedin";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

type SocialProvider = "google" | "linkedin";

const Auth = () => {
  const lastMethod = authClient.getLastUsedLoginMethod();
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(
    null
  );

  const signInWith = async (provider: SocialProvider) => {
    setPendingProvider(provider);

    const { error: signInError } = await authClient.signIn.social({
      callbackURL: "/onboarding",
      errorCallbackURL: "/auth",
      provider,
    });

    if (signInError) {
      setPendingProvider(null);
      toast.error(signInError.message);
    }
  };

  const isPending = pendingProvider !== null;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-2">
      <div className="text-xl font-bold">Welcome to doresume</div>
      <div className="text-muted-foreground">
        Continue with Google or LinkedIn to sign in.
      </div>
      <div className="mt-2 flex w-full flex-col gap-2">
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            disabled={isPending}
            onClick={() => {
              void signInWith("google");
            }}
          >
            {pendingProvider === "google" ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Google data-icon="inline-start" />
            )}
            Continue with Google
            {lastMethod === "google" ? (
              <Badge variant="secondary" className="absolute -top-2 -right-2">
                Last used
              </Badge>
            ) : null}
          </Button>
        </div>
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            disabled={isPending}
            onClick={() => {
              void signInWith("linkedin");
            }}
          >
            {pendingProvider === "linkedin" ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <LinkedIn data-icon="inline-start" />
            )}
            Continue with LinkedIn
            {lastMethod === "linkedin" ? (
              <Badge variant="secondary" className="absolute -top-2 -right-2">
                Last used
              </Badge>
            ) : null}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
