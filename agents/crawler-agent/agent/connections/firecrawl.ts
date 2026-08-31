import { defineMcpClientConnection } from "eve/connections";

const apiKey = process.env.FIRECRAWL_API_KEY;

if (!apiKey) {
  throw new Error("FIRECRAWL_API_KEY is not set.");
}

export default defineMcpClientConnection({
  auth: { getToken: () => Promise.resolve({ token: apiKey }) },
  description:
    "Firecrawl: search the web for job postings, scrape career sites and job portals into structured job data, and monitor pages for new or changed job listings.",
  url: "https://mcp.firecrawl.dev/v2/mcp",
});
