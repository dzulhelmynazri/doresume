"use client";

import type { ApplicationSettings } from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@doresume/ui/components/card";
import { Spinner } from "@doresume/ui/components/spinner";
import { toast } from "sonner";

import {
  APPLICATION_SETTINGS_DEFAULTS,
  ApplicationSettingsFields,
  useApplicationSettingsForm,
} from "@/app/(protected)/onboarding/13-application-settings";
import { client } from "@/utils/orpc";

const ApplySettingsForm = ({
  settings,
}: {
  settings: ApplicationSettings | null;
}) => {
  const hasSavedSettings = settings !== null;
  const form = useApplicationSettingsForm(async (value) => {
    await client.saveApplicationSettings(value);
    toast.success("Apply settings saved.");
  }, settings ?? APPLICATION_SETTINGS_DEFAULTS);

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
