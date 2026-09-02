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

// Shared, portal-agnostic posting catalog: one row per posting, not per user.
// Derived fields (titleTokens, industries) are computed once at ingest time
// so per-user feed generation stays an indexed read plus a cheap score.
export const jobPosting = pgTable(
  "job_posting",
  {
    company: text("company"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    descriptionSections: jsonb("description_sections").$type<
      JobDescriptionSection[]
    >(),
    educationRequirement: text("education_requirement"),
    employmentType: text("employment_type"),
    externalId: text("external_id").notNull(),
    id: text("id").primaryKey(),
    industries: text("industries").array().notNull().default([]),
    location: text("location"),
    portal: text("portal").notNull(),
    postedAt: timestamp("posted_at"),
    salaryMax: integer("salary_max"),
    salaryMin: integer("salary_min"),
    stateName: text("state_name"),
    title: text("title").notNull(),
    titleTokens: text("title_tokens").array().notNull().default([]),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    url: text("url").notNull(),
  },
  (table) => [
    index("job_posting_postedAt_idx").on(table.postedAt),
    index("job_posting_stateName_idx").on(table.stateName),
    index("job_posting_industries_gin").using("gin", table.industries),
    index("job_posting_titleTokens_gin").using("gin", table.titleTokens),
    uniqueIndex("job_posting_portal_externalId_uidx").on(
      table.portal,
      table.externalId
    ),
  ]
);
