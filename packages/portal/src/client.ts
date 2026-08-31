import { PortalError } from "./errors";
import type {
  PortalAdapter,
  PortalProviderId,
  PortalSubmitInput,
  PortalSubmissionResult,
} from "./types";

export interface PortalClientOptions {
  adapters: PortalAdapter[];
}

export interface PortalApplyInput extends PortalSubmitInput {
  url: string;
}

export const createPortalClient = ({ adapters }: PortalClientOptions) => {
  const byProvider = new Map<PortalProviderId, PortalAdapter>(
    adapters.map((adapter) => [adapter.provider, adapter])
  );

  const detect = (url: string): PortalAdapter | null =>
    adapters.find((adapter) => adapter.detect(url)) ?? null;

  const get = (provider: PortalProviderId): PortalAdapter | null =>
    byProvider.get(provider) ?? null;

  const apply = async ({
    url,
    ...input
  }: PortalApplyInput): Promise<PortalSubmissionResult> => {
    const adapter = detect(url);

    if (!adapter) {
      throw new PortalError(
        "not-supported",
        `No portal adapter handles URL: ${url}`
      );
    }

    const job = await adapter.parseJob(url);

    return adapter.submit(job, input);
  };

  return { adapters, apply, detect, get };
};

export type PortalClient = ReturnType<typeof createPortalClient>;
