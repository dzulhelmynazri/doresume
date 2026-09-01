CREATE TABLE "job_posting" (
  "id" text PRIMARY KEY NOT NULL,
  "portal" text NOT NULL,
  "external_id" text NOT NULL,
  "title" text NOT NULL,
  "company" text,
  "location" text,
  "state_name" text,
  "employment_type" text,
  "salary_min" integer,
  "salary_max" integer,
  "education_requirement" text,
  "description" text,
  "url" text NOT NULL,
  "posted_at" timestamp,
  "title_tokens" text[] DEFAULT '{}' NOT NULL,
  "industries" text[] DEFAULT '{}' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
ALTER TABLE "job" ADD COLUMN "posting_id" text;
CREATE INDEX "job_posting_postedAt_idx" ON "job_posting" USING btree ("posted_at");
CREATE INDEX "job_posting_stateName_idx" ON "job_posting" USING btree ("state_name");
CREATE INDEX "job_posting_industries_gin" ON "job_posting" USING gin ("industries");
CREATE INDEX "job_posting_titleTokens_gin" ON "job_posting" USING gin ("title_tokens");
CREATE UNIQUE INDEX "job_posting_portal_externalId_uidx" ON "job_posting" USING btree ("portal","external_id");
