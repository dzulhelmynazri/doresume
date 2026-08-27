import { auth } from "@doresume/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

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
