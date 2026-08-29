import {
  ashby,
  createApplyClient,
  generic,
  greenhouse,
  lever,
  workday,
} from "@doresume/ats-adapters";
import { defineAgent } from "eve";

/**
 * Apply client — routes form normalization to the right ATS adapter.
 *
 * Usage inside agent tools:
 *   const snapshot = applyClient.normalize(jobUrl, rawFields, rawValues);
 *
 * Force a specific adapter:
 *   const snapshot = applyClient.withAdapter("greenhouse").normalize(url, fields, values);
 *
 * Escape hatch to the raw adapter:
 *   const adapter = applyClient.adapter("lever");
 */
export const applyClient = createApplyClient({
  // Order matters — first canHandle() match wins. generic() must be last.
  adapters: [greenhouse(), lever(), workday(), ashby(), generic()],
});

export default defineAgent({
  model: "zai/glm-5.2",
});
