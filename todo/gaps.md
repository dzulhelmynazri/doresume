# Remaining gaps to one-click apply

Ordered by dependency.

## Gap 1: /jobs on live data + Apply persists an application

`apps/web/src/components/jobs/index.tsx` renders static data from `apps/web/src/components/dashboard/data/jobs.ts` and mutates local `useState` only.

### Do

- Replace the static import with a live query (crawler-agent feed via an oRPC procedure; `saveApplicationProcedure` in `packages/api/src/routers/applications.ts` already exists and gates on the `applications` plan limit).
- Apply click: call `saveApplication` with `status: "pending"`, `jobUrl`, `companyName`, `jobTitle`, then hand off to gap 2.
- Pass click: persist the skip decision (no application row, or a `skipped` job record) so the feed does not resurface it.

### Do not

- Keep applying/passing in local state. Nothing survives a refresh today.

## Gap 2: Apply click launches apply-agent with the signed-in user

Nothing starts an eve session yet. Route auth is ready, so this is purely client wiring.

### Do

- From the Apply handler, create an eve session on the agent's `/eve/v1/session` route with `Authorization: Bearer <session.token>` (bearer token from the better-auth client; cross-origin cookies will not reach the agent deployment).
- Pass the application id and job URL in the first message so the agent can call its `update-application` / `save-job` tools back.
- Surface session progress on the application detail page (`apps/web/src/app/(protected)/(app)/dashboard/applications/[id]/`).
- Keep `vercelOidc()`/`localDev()` in the walk so the eve TUI and dev still work.

### Do not

- Forward the session cookie cross-origin.
- Accept forwarded principals (`trustedForwarders`) unless a separate router deployment asserts users later.

## Gap 3: per-application resume/cover letter + formSnapshot persistence

Applications currently do not snapshot the tailored resume, cover letter, or the form answers the agent used.

### Do

- Regenerate resume/cover letter per application (tailored to the job) and store them with the application row.
- Persist `formSnapshot` (the answers submitted) so the application detail page can show exactly what was sent.
- Respect `reviewBeforeSubmit` and `autoApproveEdits` from application settings in the agent's workflow.

### Do not

- Reuse the single onboarding resume verbatim for every application.

## Related, deferred

- `todo/application-password-decrypt.md` — decrypt `user.application_password` at fill time; needed once apply-agent fills Workday/iCIMS/Oracle. Blocked on nothing, queued behind gaps 1–2.
