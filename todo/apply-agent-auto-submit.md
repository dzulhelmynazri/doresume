# Apply flow: auto-submit via Browserbase + Stagehand

User clicks Apply Job (e.g. MyFutureJobs `candidates.myfuturejobs.gov.my`) → apply-agent opens the job in a cloud browser, logs in with saved credentials, fills the form from the user profile, submits, records the `FormSnapshot`. Auto-submit is authorized — flow runs unattended, no review gate.

Status: PLAN — not implemented yet. Builds on `todo/application-password-decrypt.md` (Phase 1 completes it; delete that file after).

## Stack decisions

- Stagehand v4 (`@browserbasehq/stagehand`) with `browserbase.launch()`. Skip the "native Eve integration" — it's experimental and requires cloning/building the Stagehand repo. Author a normal eve tool instead.
- Apply-agent compiles into the web app via `withEve` (`apps/web/next.config.ts`), so the tool runs with server env + `@doresume/db` already available. No new API surface needed between web and agent.
- No Stagehand LLM key needed: omit `model` in `Stagehand.create()` → inference routes through Browserbase Model Gateway, billed to the Browserbase account.
- Browserbase session config: region `ap-southeast-1` (closest to MY), `proxies: true` (MyFutureJobs 403s non-browser / datacenter traffic), `solveCaptchas: true`, `recordSession: false`.
- Existing `applyClient.normalize()` already handles MyFutureJobs via the generic adapter — no new adapter needed for v1.

## Security rules (non-negotiable)

- Decrypt the application password only at fill time, inside the agent tool. Never return plaintext to the web client.
- Credentials go into the page via raw Playwright `fill()` on an element verified to be `input[type="password"]`, on a page verified same-site with the job URL. Never inside an `act()` instruction, tool output, log, or recording — `act("fill password with ...")` sends the instruction to the model provider.
- `recordSession: false` always.
- Never invent EEO-style answers (gender/race/disability/veteran) or submit a half-filled form — stop with a reason instead.
- Before production: replace `placeholderAuth()` in `agents/apply-agent/agent/channels/eve.ts` with app auth. Until then anyone who can reach the agent can drive any user's credentials.

## Phase 1 — credentials + env

- [ ] `packages/env/src/server.ts`: add `APPLICATION_PASSWORD_KEY` (min 32, required) and `BROWSERBASE_API_KEY` (optional).
- [ ] `packages/db/src/user-application-password.ts`: derive the AES key from `APPLICATION_PASSWORD_KEY` instead of `BETTER_AUTH_SECRET`; expose decrypt-at-fill-time function (`decryptApplicationPassword`, same shape as `getUserApplicationPassword`). This completes `todo/application-password-decrypt.md` — delete it.
- [ ] Key change invalidates existing ciphertext: users (incl. dev) re-save their application password once.

Env values needed (`apps/web/.env` + Vercel):

- `APPLICATION_PASSWORD_KEY` → `openssl rand -base64 32`
- `BROWSERBASE_API_KEY` → from Browserbase dashboard

## Phase 2 — apply-agent flow

- [ ] `agents/apply-agent/package.json`: add `@browserbasehq/stagehand` (~4.0), `@doresume/db`, `@doresume/env`, `@doresume/contracts`, `drizzle-orm`.
- [ ] New `agent/lib/apply-flow.ts` — an async generator yielding phases (for tool progress events), returning `{ status, rawFields, values, unmappedFields, reason }`:
  1. Launch Browserbase session (config above). No `keepAlive` — session destroyed in `finally` (`stagehand.close()` + `browser.close()`).
  2. `page.goto(jobUrl)`; click Apply/Mohon (best-effort — some portals deep-link to the form).
  3. If login wall: `observe()` the email field → raw fill; `observe()` the password field → verify it's `input[type="password"]` → raw fill → `act()` submit → post-submit check: still on password page = captcha/OTP present (`captcha_or_verification_required`) vs wrong creds (`invalid_credentials`). Domain check before filling.
  4. `extract()` all form fields with a zod schema: label, type, required, options, current value.
  5. Fill required empty fields using a profile answer resolver; loop re-read/fill up to ~4 rounds (one page of fields per round handles validation reveals).
  6. Unmapped required fields remain → stop, `incomplete_form`, list them.
  7. `act()` submit (Hantar/Send) → `extract()` confirmation vs validation errors → `submitted` or `failed`.
- [ ] New `agent/tools/run_job_application.ts` (eve `defineTool`):
  - Input: `applicationId` only — never jobUrl/userId from the model.
  - Loads application row, user profile, decrypted password; missing password → `missing_credentials` status pointing to Settings.
  - Runs the flow, normalizes via `applyClient.normalize(jobUrl, rawFields, values)`, sets `submittedAt` when submitted.
  - `saveApplication()` with status `submitted`/`failed` + formSnapshot (existing web UI already renders this).
  - Billing note: tool only updates; metered creation stays in the `saveApplication` oRPC procedure.
- [ ] `agent/instructions.md`: unattended (never ask confirmation), never self-retry failures, never ask users for passwords in chat; map statuses to user-facing messages.
- [ ] Answer resolver — match field labels English + BM (Nama, Emel, Telefon, Poskod, Negeri, Bandar, Alamat, Gaji, Jantina, Bangsa, Pendidikan, Pengalaman): name, email, phone, LinkedIn, address/city/state/zip/country, salary (from `minimumSalary`), education/experience (label lookups from contracts), gender/race/disability/veteran (checklist → labels), yes/no checklist answers (relocate, clearance, accommodations, start immediately, transportation, in-person).

## Phase 3 — web trigger

- [ ] Dashboard `handleApply` (`apps/web/src/components/jobs/index.tsx`): create the application via `orpc.saveApplication` first (feature check + usage tracking), then send the `applicationId` to apply-agent through the eve channel mounted by `withEve`.
- [ ] Application row starts `pending` → agent sets `submitted`/`failed`; `ApplicationFormSnapshotView` shows the captured form.

## Phase 4 — hardening (before real users)

- [ ] Replace `placeholderAuth()` with doresume auth on the eve channel.
- [ ] `getApplicationPassword` returns `{ hasPassword: boolean }` only; settings/workday forms become set/replace (currently prefills plaintext).
- [ ] Multi-step wizard support (Workday next/next/submit) — paginate the fill loop; MyFutureJobs-style single page is v1.
- [ ] Consider per-portal credentials keyed by domain (single `application_password` assumes portal login email = `user.email`, which may not hold for pre-existing MyFutureJobs accounts).

## Open questions

- Browserbase plan tier: `proxies` + `solveCaptchas` may need Startup/Scale plan — verify before testing.
- MyFutureJobs TAC/SMS OTP: fail fast (`login_blocked`) for v1, or pause-and-resume via Live View takeover later?
- Notify user on failed runs (email) or in-app only?
