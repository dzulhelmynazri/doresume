import { relations } from "drizzle-orm";
import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const application = pgTable(
  "application",
  {
    companyName: text("company_name"),
    confirmationUrl: text("confirmation_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    formSnapshot: jsonb("form_snapshot"),
    id: text("id").primaryKey(),
    jobTitle: text("job_title"),
    jobUrl: text("job_url"),
    portal: text("portal"),
    status: text("status")
      .$type<"pending" | "submitted" | "failed">()
      .default("pending")
      .notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("application_userId_idx").on(table.userId)]
);

export const applicationRelations = relations(application, ({ one }) => ({
  user: one(user, {
    fields: [application.userId],
    references: [user.id],
  }),
}));
