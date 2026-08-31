import { defineComposioTools } from "@composio/experimental/eve";

import { inboxSessionFor } from "../lib/composio";

export default defineComposioTools((ctx) => {
  const userId = ctx.session.auth.current?.principalId;

  if (!userId) {
    throw new Error(
      "No authenticated user for this session. Start the agent for a signed-in doresume user so inbox connections can be resolved."
    );
  }

  return inboxSessionFor(userId);
});
