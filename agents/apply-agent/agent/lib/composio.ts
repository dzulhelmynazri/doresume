import { Composio } from "@composio/core";
import { EveProvider } from "@composio/experimental/eve";

const composio = new Composio({ provider: new EveProvider() });

/**
 * Inbox-scoped session for the doresume user who connected their Gmail or
 * Outlook account. The user id must match the one used when the connection
 * was created in the web app, so the agent sees the same connected accounts.
 */
export const inboxSessionFor = (userId: string) =>
  composio.create(userId, { toolkits: ["gmail", "outlook"] });
