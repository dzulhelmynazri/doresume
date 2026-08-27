import { Composio } from "@composio/core";
import { env } from "@doresume/env/server";
import { z } from "zod";

export const INTEGRATION_TOOLKITS = ["outlook", "linkedin", "gmail"] as const;

export const integrationToolkitSchema = z.enum(INTEGRATION_TOOLKITS);

export type IntegrationToolkit = z.infer<typeof integrationToolkitSchema>;

export interface ToolkitConnection {
  connected: boolean;
  connectedAccountId: string | null;
}

const INTEGRATION_LABELS: Record<IntegrationToolkit, string> = {
  gmail: "Gmail",
  linkedin: "LinkedIn",
  outlook: "Outlook",
};

export const composio = new Composio({
  apiKey: env.COMPOSIO_API_KEY,
});

const createIntegrationSession = (userId: string) =>
  composio.create(userId, {
    manageConnections: {
      waitForConnections: true,
    },
    toolkits: [...INTEGRATION_TOOLKITS],
  });

const connectionFromToolkit = (
  items: {
    slug: string;
    connection?: {
      isActive: boolean;
      connectedAccount?: { id: string } | undefined;
    };
  }[],
  toolkit: IntegrationToolkit
): ToolkitConnection => {
  const match = items.find((item) => item.slug === toolkit);

  return {
    connected: Boolean(match?.connection?.isActive),
    connectedAccountId: match?.connection?.connectedAccount?.id ?? null,
  };
};

export const getIntegrationConnections = async (userId: string) => {
  const session = await createIntegrationSession(userId);
  const { items } = await session.toolkits();

  return {
    gmail: connectionFromToolkit(items, "gmail"),
    linkedin: connectionFromToolkit(items, "linkedin"),
    outlook: connectionFromToolkit(items, "outlook"),
  };
};

export const authorizeIntegration = async (
  userId: string,
  toolkit: IntegrationToolkit,
  callbackUrl: string
) => {
  const session = await createIntegrationSession(userId);
  const connectionRequest = await session.authorize(toolkit, {
    callbackUrl,
  });

  if (!connectionRequest.redirectUrl) {
    throw new Error(
      `Composio did not return a ${INTEGRATION_LABELS[toolkit]} Connect Link.`
    );
  }

  return { redirectUrl: connectionRequest.redirectUrl };
};

export const disconnectIntegration = async (
  userId: string,
  toolkit: IntegrationToolkit
) => {
  const connections = await getIntegrationConnections(userId);
  const connection = connections[toolkit];

  if (!(connection.connected && connection.connectedAccountId)) {
    throw new Error(`${INTEGRATION_LABELS[toolkit]} is not connected.`);
  }

  await composio.connectedAccounts.delete(connection.connectedAccountId);

  return { ok: true as const };
};
