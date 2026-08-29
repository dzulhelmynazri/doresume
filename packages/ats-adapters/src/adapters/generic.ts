import type {
  ApplicationFormSnapshot,
  AtsAdapter,
  FormFieldDefinition,
} from "../types";
import { mapFieldType } from "../utils/field-types";

const mapSection = (rawName: string, rawLabel?: string): string => {
  const n = `${rawName} ${rawLabel ?? ""}`.toLowerCase();
  if (
    n.includes("eeo") ||
    n.includes("diversity") ||
    n.includes("race") ||
    n.includes("gender") ||
    n.includes("veteran") ||
    n.includes("disability")
  ) {
    return "EEO / Diversity";
  }
  if (
    n.includes("question") ||
    n.includes("additional") ||
    n.includes("custom")
  ) {
    return "Additional Questions";
  }
  return "Basic Information";
};

/**
 * Generic fallback adapter.
 *
 * Used when no specific adapter matches the job portal URL.
 * Works with any standard HTML form on career sites, custom portals, etc.
 *
 * `createApplyClient` will always test specific adapters before this fallback.
 *
 * @example
 * ```ts
 * const client = createApplyClient({
 *   adapters: [greenhouse(), lever(), generic()],
 * });
 * ```
 */
export const generic = (): AtsAdapter => ({
  // Always handles — this is the fallback
  canHandle: () => true,

  name: "generic",

  normalize: (rawFields, rawValues): ApplicationFormSnapshot => ({
    capturedAt: new Date().toISOString(),
    fields: rawFields.map((field): FormFieldDefinition => ({
      id: field.id ?? field.name,
      label: field.label ?? field.name,
      options: field.options,
      rawName: field.name,
      required: field.required,
      section: mapSection(field.name, field.label),
      type: mapFieldType(field.type),
    })),
    provider: "generic",
    values: rawValues,
  }),
});
