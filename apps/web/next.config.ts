import { nextConfig } from "@doresume/next-config";
import { withEve } from "eve/next";

export default withEve(nextConfig, {
  agents: {
    "apply-agent": "../../agents/apply-agent",
    "crawler-agent": "../../agents/crawler-agent",
  },
});
