import { defineSchedule } from "eve/schedules";

import { refreshAllFeeds } from "../../scripts/maukerja-ingest";

// 22:30 UTC = 06:30 MYT, after the MYFutureJobs refresh. Crawls the
// Maukerja delta into the shared catalog, then regenerates every job
// seeker's Maukerja feed rows from it. Plain HTTP against the portal's
// services API — no browser host required.
export default defineSchedule({
  cron: "30 22 * * *",
  run({ waitUntil }) {
    waitUntil(refreshAllFeeds());
  },
});
