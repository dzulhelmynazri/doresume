import browserbase from "@browserbasehq/eve";

const apiKey = process.env.BROWSERBASE_API_KEY;

if (!apiKey) {
  throw new Error("BROWSERBASE_API_KEY is not set.");
}

export default browserbase({ apiKey });
