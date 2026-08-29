import { generic } from "./adapters/generic";
import type { ApplicationFormSnapshot, AtsAdapter, RawField } from "./types";

export interface ApplyClientConfig {
  adapters: AtsAdapter[];
}

export interface ApplyClient {
  /**
   * Access a specific adapter instance directly (escape hatch).
   *
   * Mirrors `email.adapter("resend").raw` from email-sdk.
   *
   * @example
   * ```ts
   * const adapter = applyClient.adapter("greenhouse");
   * ```
   */
  adapter: (name: string) => AtsAdapter | undefined;

  /**
   * Automatically route to the right adapter based on the job URL,
   * normalize raw scraped fields + values into a standard FormSnapshot.
   *
   * Specific adapters always take precedence over fallback/generic adapters.
   *
   * Mirrors `email.send(message)` from email-sdk.
   */
  normalize: (
    url: string,
    rawFields: RawField[],
    rawValues: Record<string, unknown>
  ) => ApplicationFormSnapshot;

  /**
   * Bind to a specific adapter by name, regardless of URL.
   *
   * Mirrors `email.withAdapter("postmark")` from email-sdk.
   *
   * @example
   * ```ts
   * const snapshot = applyClient.withAdapter("greenhouse").normalize(url, fields, values);
   * ```
   */
  withAdapter: (name: string) => {
    normalize: (
      url: string,
      rawFields: RawField[],
      rawValues: Record<string, unknown>
    ) => ApplicationFormSnapshot;
  };
}

/**
 * Create an apply client with the given adapters.
 *
 * Specific adapters are checked first in order; if none match, fallback / generic
 * adapters are checked. If no generic adapter was provided in config, a default
 * generic adapter is used automatically.
 *
 * @example
 * ```ts
 * import { createApplyClient, greenhouse, lever, workday, ashby, generic } from "@doresume/ats-adapters";
 *
 * const applyClient = createApplyClient({
 *   adapters: [generic(), greenhouse(), lever()], // Order doesn't matter, greenhouse/lever checked before generic!
 * });
 *
 * const snapshot = applyClient.normalize(jobUrl, rawFields, rawValues);
 * ```
 */
export const createApplyClient = (config: ApplyClientConfig): ApplyClient => {
  const userAdapters = config.adapters ?? [];

  // Partition into specific adapters vs catch-all / generic fallbacks
  const specificAdapters = userAdapters.filter(
    (a) => a.name !== "generic" && !a.canHandle("")
  );
  const fallbackAdapters = userAdapters.filter(
    (a) => a.name === "generic" || a.canHandle("")
  );

  // Guarantee fallback is present and last
  const resolvedFallback =
    fallbackAdapters.length > 0 ? fallbackAdapters : [generic()];
  const orderedAdapters = [...specificAdapters, ...resolvedFallback];

  const resolveAdapter = (url: string): AtsAdapter => {
    const match = orderedAdapters.find((a) => a.canHandle(url));
    if (!match) {
      throw new Error(
        `[ats-adapters] No adapter matched URL: ${url}. Add a generic() adapter as a fallback.`
      );
    }
    return match;
  };

  return {
    adapter: (name) => orderedAdapters.find((a) => a.name === name),

    normalize: (url, rawFields, rawValues) => {
      const adapter = resolveAdapter(url);
      return adapter.normalize(rawFields, rawValues);
    },

    withAdapter: (name) => {
      const adapter = orderedAdapters.find((a) => a.name === name);
      if (!adapter) {
        throw new Error(`[ats-adapters] No adapter with name: "${name}"`);
      }
      return {
        normalize: (_url, rawFields, rawValues) =>
          adapter.normalize(rawFields, rawValues),
      };
    },
  };
};
