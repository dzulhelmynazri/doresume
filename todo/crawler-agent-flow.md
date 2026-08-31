# Crawler-Agent Flow

How a user's profile becomes the `/jobs` feed, hop by hop.

| Hop | Status |
| --- | --- |
| **Trigger** — eve session started for a user | ⚠️ Manual only (`eve dev` / TUI); no web trigger, no schedule |
| **Auth** — session carries the better-auth user | ✅ `betterAuth()` walk ported from apply-agent; `placeholderAuth()` removed |
| **Profile** — target role, industries, experience, work type/arrangement, location, minimum salary | ⚠️ Only reaches the agent if pasted into the first message; no tool reads the onboarding answers |
| **Discover** — `firecrawl_search` turns profile into posting queries | ✅ Firecrawl MCP connection wired (`agent/connections/firecrawl.ts`) |
| **Extract** — `firecrawl_scrape` / `firecrawl_map` pull structured posting data | ✅ Same connection |
| **Match** — keep only postings that fit the profile | ✅ LLM-side, per `agent/instructions.md` step 4 |
| **Monitor** — recurring monitors on boards surface new postings | ✅ Instructions use `firecrawl_monitor_*`; avoids re-scraping |
| **Persist** — `save-job` → `job` table | ✅ Now stores `userId`, `matchPercent`, `salaryMin`/`salaryMax`, `seniority`, `employmentType`; unique per `(url, userId)` (migration `0002`) |
| **Read** — `listJobs` API | ✅ `listJobsProcedure` filters by `context.session.user.id` |
| **/jobs UI** — matched feed | ❌ Still static `data/jobs.ts` mock (see `gaps.md` Gap 1) |

## What changed in the persist hop

- `packages/db/src/schema/job.ts` — added `user_id` (FK → `user.id`, cascade, indexed), `match_percent`, `salary_min`, `salary_max`, `seniority`, `employment_type`; `job_url_uidx` is now `(url, user_id)` so each user gets their own copy of a posting.
- `agents/crawler-agent/agent/tools/save-job.ts` — `userId` required; new optional fields carry `.describe()` guidance so the model fills them.
- `packages/db/src/jobs.ts` — `saveJob` upserts on `(url, userId)`; `listJobs(userId, limit)` scopes to one user.
- `agent/instructions.md` step 6 — tells the agent to pass `userId` plus `matchPercent` and posting facts when saving.

## Remaining gaps (ordered)

### 1. Trigger: web app starts a crawl per user

Nothing launches a session today. From apps/web, POST the agent's `/eve/v1/session` with `Authorization: Bearer <session.token>` and a first message naming the user's preferences (same pattern as `gaps.md` Gap 2 for apply-agent).

### 2. Profile context: give the agent the onboarding answers

Two options, pick one:

- **Message-side**: the trigger message includes industries, experience level, work type, arrangement, location, and minimum salary fetched server-side.
- **Tool-side**: add a `get-profile` tool that reads the `user-*` tables via `@doresume/db` for `ctx.session.auth.current?.principalId` (apply-agent's `composio.ts` shows the pattern).

Without this, matching quality depends entirely on whatever the prompt happens to contain.

### 3. Schedule: recurring discovery runs

Add an eve schedule (e.g. daily per active user) so the feed refreshes without manual runs; the existing monitor step covers in-between page changes.

### 4. Feed UI: render `listJobs`

Blocked on nothing now that rows carry every field the UI needs — map DB rows to the `Job` shape in `apps/web/src/components/dashboard/data/jobs.ts` (`matchPercent`, `salaryMin`/`salaryMax`, `seniority`, `employmentType` all exist). This is `gaps.md` Gap 1.

## Do not

- Do not make `userId` optional again — the feed is per-user by design.
- Do not let `save-job` accept user-supplied scores above 100 or un-annualized salary (schema enforces ints; keep dollar-annual values).
- Do not have the agent submit applications; discovery only (`apply-agent` owns submitting).
