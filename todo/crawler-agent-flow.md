# Crawler-Agent Flow

How a user's profile becomes the `/jobs` feed, hop by hop.

| Hop | Status |
| --- | --- |
| **Trigger** — eve session started for a user | ⚠️ MYFutureJobs lane now scheduled (`agent/schedules/mfj-refresh.ts`, daily); eve-agent lane still manual only |
| **Auth** — session carries the better-auth user | ✅ `betterAuth()` walk ported from apply-agent; `placeholderAuth()` removed |
| **Profile** — target role, industries, experience, work type/arrangement, location, minimum salary | ⚠️ Only reaches the eve agent if pasted into the first message; the MYFutureJobs prototype reads them directly (`loadProfile` in `scripts/match.ts`) |
| **Discover** — `firecrawl_search` turns profile into posting queries | ✅ Firecrawl MCP connection wired (`agent/connections/firecrawl.ts`); MYFutureJobs prototype live (`scripts/myfuturejobs-ingest.ts`) |
| **Extract** — `firecrawl_scrape` / `firecrawl_map` pull structured posting data | ✅ Same connection |
| **Match** — keep only postings that fit the profile | ✅ LLM-side for the eve agent (`agent/instructions.md` step 4); deterministic scorer for the prototype |
| **Monitor** — recurring monitors on boards surface new postings | ✅ Instructions use `firecrawl_monitor_*`; avoids re-scraping |
| **Persist** — catalog upsert → per-user feed → `job` table | ✅ Shared `job_posting` catalog (migration `0003`); feed generator materializes top matches into `job` with `match_percent` + `posting_id` |
| **Read** — `listJobs` API | ✅ `listJobsProcedure` filters by `context.session.user.id` |
| **/jobs UI** — matched feed | ✅ Renders live `listJobs` rows (`components/jobs/index.tsx` + `live-jobs.ts` mapper); Apply/Pass still local-only |

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

MYFutureJobs lane done: `agent/schedules/mfj-refresh.ts` fires daily (cron `0 22 * * *` UTC = 06:00 MYT), crawls the delta, then regenerates every job-seeker feed. Caveat: the handler drives Playwright, so it needs a host with a real browser (`eve start` on a VPS/container) — Vercel serverless cannot run it. Iterate locally with `curl -X POST localhost:2000/eve/v1/dev/schedules/mfj-refresh`. The eve-agent/firecrawl lane still has no schedule.

## MYFutureJobs prototype (Malaysia)

`agents/crawler-agent/scripts/myfuturejobs-ingest.ts` — rides the candidates portal's own API requests (the site WAF 403s curl/headless clients). Shared catalog + per-user feeds: every posting lives once in `job_posting` (portal-agnostic, derived `title_tokens`/`industries` computed at ingest, GIN-indexed), and each user's feed is regenerated from it.

**Catalog crawl** (`crawl` mode, default): list phase intercepts `/api/jobs?limit=30&offset=N` on the search page (~30 postings/page via scroll) and upserts listing rows; detail phase visits each _new_ job's `/search-jobs/description?jobId=<id>` route and intercepts `GET /api/jobs/<id>` for the full `jobDescription`, company facts, education requirement, MYR salary range (`offeredRemunerationPackages` → `salaryMin`/`salaryMax`, stored raw), and sectors → mapped industries. Already-seen `externalId`s are skipped (watermark delta).

**Feed generation** (`feed <userId>`): loads the onboarding profile (`state`, `educationLevel`, `workType`, `industries`, `minimumSalary`) plus resume titles (header title + past roles from `resume-parser` output on `user.resume_document`), pulls eligible catalog rows via indexed overlap (`title_tokens && … OR industries && … OR state = …`, cap 2000), scores each deterministically — title 25, location 25, salary 20, industry 20, education 5, work type 5 (`scripts/match.ts`) — and materializes the top 100 with ≥ 25% into the user's `job` rows (`match_percent` + `posting_id`), pruning stale portal rows. Title overlap tokenizes both sides (filler/seniority words stripped, prefix-tolerant); salary compares the posting's MYR maximum against the user's monthly minimum. `/jobs` UI, `listJobs` API, and apply flow are untouched — `listJobs` now orders `match_percent desc nulls last`.

Runs:

- `bun run scripts/myfuturejobs-ingest.ts crawl` — delta crawl into the catalog
- `bun run scripts/myfuturejobs-ingest.ts feed <userId>` — regenerate one user's feed from the catalog
- `bun run scripts/myfuturejobs-ingest.ts full <userId>` — force re-fetch every detail, then feed (monthly refresh)
- `bun run scripts/myfuturejobs-ingest.ts probe <jobId>` — dump one detail payload

**Cadence**: daily schedule `agent/schedules/mfj-refresh.ts` = delta crawl + regenerate every job seeker's feed (`listJobSeekerIds` = users whose onboarding picked industries). Monthly `full` re-fetch stays manual for now.

**Future portals**: Hiredly, Maukerja, etc. plug in as new adapters writing the same `job_posting` schema (portal-prefixed `id`, mapped industries, title tokens); the feed generator is already portal-agnostic.

Ingested rows render on `/jobs` via the live feed (above); `saveJob` upserts on `(url, userId)` so re-runs merge.

## Do not

- Do not make `userId` optional again — the feed is per-user by design.
- Do not let `save-job` accept user-supplied scores above 100 or un-annualized salary (schema enforces ints; keep dollar-annual values).
- Do not have the agent submit applications; discovery only (`apply-agent` owns submitting).
