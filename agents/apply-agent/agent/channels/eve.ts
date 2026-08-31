import { localDev, vercelOidc } from "eve/channels/auth";
import { eveChannel } from "eve/channels/eve";

import { betterAuth } from "../lib/better-auth";

export default eveChannel({
  auth: [
    // Verifies the doresume better-auth session and maps it to the user.
    betterAuth(),
    // Lets the eve TUI and your Vercel deployments reach the deployed agent.
    vercelOidc(),
    // Open on localhost for `eve dev` and the REPL; ignored in production.
    localDev(),
  ],
});
