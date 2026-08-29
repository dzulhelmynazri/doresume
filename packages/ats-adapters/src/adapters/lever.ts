import type {
  ApplicationFormSnapshot,
  AtsAdapter,
  FormFieldDefinition,
} from "../types";
import { mapFieldType } from "../utils/field-types";

const LEVER_DOMAINS = ["jobs.lever.co", "lever.co"];

const mapSection = (rawName: string): string => {
  const n = rawName.toLowerCase();
  if (
    n.includes("eeo") ||
    n.includes("diversity") ||
    n.includes("race") ||
    n.includes("gender")
  ) {
    return "EEO / Diversity";
  }
  if (n.startsWith("card[") || n.includes("custom")) {
    return "Additional Questions";
  }
  return "Basic Information";
};

/**
 * Lever adapter.
 *
 * Handles Lever ATS job postings at jobs.lever.co.
 *
 * @example
 * ```ts
 * const client = createApplyClient({ adapters: [lever()] });
 * ```
 */
export const lever = (): AtsAdapter => ({
  canHandle: (url) => LEVER_DOMAINS.some((d) => url.includes(d)),

  name: "lever",

  normalize: (rawFields, rawValues): ApplicationFormSnapshot => ({
    capturedAt: new Date().toISOString(),
    fields: rawFields.map((field): FormFieldDefinition => ({
      id: field.id ?? field.name,
      label: field.label ?? field.name,
      options: field.options,
      rawName: field.name,
      required: field.required,
      section: mapSection(field.name),
      type: mapFieldType(field.type),
    })),
    portalName: "Lever",
    provider: "lever",
    values: rawValues,
  }),
});
