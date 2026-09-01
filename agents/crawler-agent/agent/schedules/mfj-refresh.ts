import { defineSchedule } from "eve/schedules";

import { refreshAllFeeds } from "../../scripts/myfuturejobs-ingest";

// 22:00 UTC = 06:00 MYT. Crawls the MYFutureJobs delta into the shared
// catalog, then regenerates every job seeker's feed from it. Needs a host
// with a real browser (Playwright), so not Vercel serverless — see the
// crawler-agent-flow notes. Monthly full refresh stays manual for now.
export default defineSchedule({
  cron: "0 22 * * *",
  run({ waitUntil }) {
    waitUntil(refreshAllFeeds());
  },
});
