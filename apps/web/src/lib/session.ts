import { auth } from "@doresume/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { userIsOnboarded } from "@/lib/onboarding";

export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
});

export const requireUser = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return user;
};

export const requireOnboardedUser = async () => {
  const user = await requireUser();

  if (!(await userIsOnboarded(user.id))) {
    redirect("/onboarding");
  }

  return user;
};

export const requireNotOnboardedUser = async () => {
  const user = await requireUser();

  if (await userIsOnboarded(user.id)) {
    redirect("/dashboard");
  }

  return user;
};

export const requireGuest = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  if (await userIsOnboarded(user.id)) {
    redirect("/dashboard");
  }

  redirect("/onboarding");
};
