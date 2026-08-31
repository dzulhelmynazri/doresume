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

import { LoadingImage } from "@/components/loading-image";
import {
  APPLICATION_SETTINGS_DEFAULTS,
  ApplicationSettingsFields,
  useApplicationSettingsForm,
} from "@/components/onboarding/12-application-settings";
import { client, orpc } from "@/utils/orpc";

const SETTINGS_STALE_TIME_MS = 5 * 60 * 1000;

const ApplySettingsForm = () => {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery(
    orpc.getApplicationSettings.queryOptions({
      staleTime: SETTINGS_STALE_TIME_MS,
    })
  );
  const form = useApplicationSettingsForm(
    async (value) => {
      await client.saveApplicationSettings(value);
      await queryClient.invalidateQueries({
        queryKey: orpc.getApplicationSettings.key(),
      });
      toast.success("Apply settings saved.");
    },
    { ...APPLICATION_SETTINGS_DEFAULTS, ...data?.settings }
  );

  if (isPending || !data) {
    return (
      <div className="py-6">
        <LoadingImage />
      </div>
    );
  }

  const { settings } = data;
  const hasSavedSettings = settings !== null;

  return (
    <form
      className="py-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="flex max-w-lg flex-col gap-4 py-2">
        <CardHeader>
          <CardTitle>Apply settings</CardTitle>
          <CardDescription>
            {hasSavedSettings
              ? "These are the settings saved during onboarding. Change them anytime."
              : "How should we apply?"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationSettingsFields form={form} />
        </CardContent>
        <CardFooter>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                {hasSavedSettings ? "Update settings" : "Save settings"}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </div>
    </form>
  );
};

export { ApplySettingsForm };
