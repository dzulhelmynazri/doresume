import { auth } from "@doresume/auth";
import type { AuthFn } from "eve/channels/auth";

/**
 * Verifies the better-auth session on inbound requests and maps it to the
 * doresume user principal. The principal id must match the user id used
 * when inbox connections were created in the web app, so Composio tools
 * resolve the same connected Gmail or Outlook accounts.
 */
const authenticateSession: AuthFn<Request> = async (request) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return null;
  }

  return {
    attributes: { email: session.user.email, name: session.user.name },
    authenticator: "better-auth",
    principalId: session.user.id,
    principalType: "user",
  };
};

export const betterAuth = (): AuthFn<Request> => authenticateSession;
