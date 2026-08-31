import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const job = pgTable(
  "job",
  {
    company: text("company"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    description: text("description"),
    id: text("id").primaryKey(),
    location: text("location"),
    portal: text("portal"),
    postedAt: timestamp("posted_at"),
    title: text("title").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    url: text("url").notNull(),
  },
  (table) => [uniqueIndex("job_url_uidx").on(table.url)]
);
