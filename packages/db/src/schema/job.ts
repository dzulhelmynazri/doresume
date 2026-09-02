import type { JobDescriptionSection } from "@doresume/contracts";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const job = pgTable(
  "job",
  {
    company: text("company"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    descriptionSections: jsonb("description_sections").$type<
      JobDescriptionSection[]
    >(),
    employmentType: text("employment_type"),
    id: text("id").primaryKey(),
    location: text("location"),
    matchPercent: integer("match_percent"),
    portal: text("portal"),
    postedAt: timestamp("posted_at"),
    postingId: text("posting_id"),
    salaryMax: integer("salary_max"),
    salaryMin: integer("salary_min"),
    seniority: text("seniority"),
    title: text("title").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    url: text("url").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("job_userId_idx").on(table.userId),
    uniqueIndex("job_url_uidx").on(table.url, table.userId),
  ]
);
