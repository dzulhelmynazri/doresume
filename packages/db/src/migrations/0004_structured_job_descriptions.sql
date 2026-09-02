ALTER TABLE "job_posting" DROP COLUMN "description";
ALTER TABLE "job_posting" ADD COLUMN "description_sections" jsonb;

ALTER TABLE "job" DROP COLUMN "description";
ALTER TABLE "job" ADD COLUMN "description_sections" jsonb;
