# DoResume Application Flow

| Step | Status |
| --- | --- |
| **/auth** — Email + Google/LinkedIn | ✅ Better Auth wired with OAuth providers configured |
| **/onboarding** — Profile + Resume Upload | ✅ 13-step questionnaire; Step 1 includes resume upload with `parseResume` |
| **/documents** — Default Resume + Cover Letter | ✅ `getDocuments` / `saveDocuments` seeded from parsed resume |
| **/jobs** — Crawled Jobs Feed | ✅ Backend ready: `crawler-agent` → `save-job` → `job` table → `listJobs` |
| **apply-agent** — Detect → API or Browser Use | ✅ Portal client, Greenhouse adapter, Browser Use connection, per-job document regeneration, and `update-application` |
| **/dashboard/applications** + **[id]** | ✅ Application list and detail tabs (`Job` · `Form` · `Resume` · `Cover`) are implemented |
