import { env } from "@doresume/env/server";
import { z } from "zod";

import {
  authorizeIntegration,
  disconnectIntegration as removeIntegration,
  getIntegrationConnections,
  integrationToolkitSchema,
} from "../composio";
import { protectedProcedure } from "../index";

export const getConnections = protectedProcedure.handler(({ context }) =>
  getIntegrationConnections(context.session.user.id)
);

export const connectIntegration = protectedProcedure
  .input(
    z.object({
      returnTo: z.string().startsWith("/").optional(),
      toolkit: integrationToolkitSchema,
    })
  )
  .handler(({ context, input }) =>
    authorizeIntegration(
      context.session.user.id,
      input.toolkit,
      `${env.BETTER_AUTH_URL}${input.returnTo ?? "/integrations"}`
    )
  );

export const disconnectIntegration = protectedProcedure
  .input(z.object({ toolkit: integrationToolkitSchema }))
  .handler(({ context, input }) =>
    removeIntegration(context.session.user.id, input.toolkit)
  );
