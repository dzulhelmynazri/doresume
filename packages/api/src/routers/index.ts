import type { RouterClient } from "@orpc/server";

import { healthCheck } from "./health";
import { privateData } from "./private-data";

export const appRouter = {
  healthCheck,
  privateData,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
