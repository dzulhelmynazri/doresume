import { defineConfig } from "blume";

export default defineConfig({
  ai: {
    llmsTxt: true,
  },
  content: {
    root: "content",
  },
  description:
    "Write, tailor, and ship a resume that matches the job — across web, mobile, and the browser.",
  lastModified: true,
  title: "doresume",
});
