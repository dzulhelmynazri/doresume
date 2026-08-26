import type { AppRouterClient } from "@doresume/api/routers/index";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const createQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      // oxlint-disable-next-line promise/prefer-await-to-callbacks
      onError: (error, query) => {
        toast.error(`Error: ${error.message}`, {
          action: {
            label: "retry",
            onClick: () => {
              query.invalidate();
            },
          },
        });
      },
    }),
  });

export const queryClient = createQueryClient();

export const link = new RPCLink({
  fetch: (url, options) =>
    fetch(url, {
      ...options,
      credentials: "include",
    }),
  headers: async () => {
    if (typeof window === "undefined") {
      const { headers } = await import("next/headers");
      return Object.fromEntries(await headers());
    }

    return {};
  },
  url: `${typeof window === "undefined" ? "http://localhost:3001" : window.location.origin}/api/rpc`,
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
