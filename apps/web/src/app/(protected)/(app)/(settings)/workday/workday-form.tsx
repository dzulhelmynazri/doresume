"use client";

import { Button } from "@doresume/ui/components/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@doresume/ui/components/card";
import { Spinner } from "@doresume/ui/components/spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  ApplicationPasswordFields,
  useApplicationPasswordForm,
} from "@/app/(protected)/onboarding/12-application-password";
import { LoadingImage } from "@/components/loading-image";
import { client, orpc } from "@/utils/orpc";

const SETTINGS_STALE_TIME_MS = 5 * 60 * 1000;

const WorkdayPasswordForm = () => {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery(
    orpc.getApplicationPassword.queryOptions({
      staleTime: SETTINGS_STALE_TIME_MS,
    })
  );
  const form = useApplicationPasswordForm(
    async (value) => {
      await client.saveApplicationPassword(value);
      await queryClient.invalidateQueries({
        queryKey: orpc.getApplicationPassword.key(),
      });
      toast.success("Application password saved.");
    },
    { password: data?.password ?? "" }
  );

  if (isPending || !data) {
    return (
      <div className="py-6">
        <LoadingImage />
      </div>
    );
  }

  const { password } = data;
  const hasSavedPassword = password.length > 0;

  return (
    <form
      className="py-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="max-w-lg space-y-4 py-2">
        <CardHeader>
          <CardTitle>Workday password</CardTitle>
          <CardDescription>
            {hasSavedPassword
              ? "This is the password saved during onboarding. Change it only if you need a new one."
              : "Set a password for sites that ask"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationPasswordFields form={form} />
        </CardContent>
        <CardFooter>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                {hasSavedPassword ? "Update password" : "Save password"}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </div>
    </form>
  );
};

export { WorkdayPasswordForm };
