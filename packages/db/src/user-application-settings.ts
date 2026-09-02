import { applicationSettingsSchema } from "@doresume/contracts";
import type { ApplicationSettings } from "@doresume/contracts";
import { eq } from "drizzle-orm";

import { db } from "./index";
import { user } from "./schema/auth";

const settingsToStore = (settings: ApplicationSettings): ApplicationSettings =>
  settings.resumeOptimization === "off"
    ? { ...settings, autoApproveEdits: false }
    : settings;

export const saveUserApplicationSettings = async (
  userId: string,
  settings: ApplicationSettings
) => {
  await db
    .update(user)
    .set({ applicationSettings: settingsToStore(settings) })
    .where(eq(user.id, userId));
};

export const getUserApplicationSettings = async (userId: string) => {
  const record = await db.query.user.findFirst({
    columns: { applicationSettings: true },
    where: eq(user.id, userId),
  });

  if (!record?.applicationSettings) {
    return null;
  }

  const parsed = applicationSettingsSchema.safeParse(
    record.applicationSettings
  );

  if (!parsed.success) {
    return null;
  }

  return settingsToStore(parsed.data);
};
