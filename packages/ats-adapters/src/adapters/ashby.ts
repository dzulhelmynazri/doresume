import type {
  ApplicationFormSnapshot,
  AtsAdapter,
  FormFieldDefinition,
} from "../types";
import { mapFieldType } from "../utils/field-types";

const ASHBY_DOMAINS = ["ashbyhq.com", "jobs.ashby.com"];

const mapSection = (rawName: string): string => {
  const n = rawName.toLowerCase();
  if (
    n.includes("eeo") ||
    n.includes("diversity") ||
    n.includes("gender") ||
    n.includes("race")
  ) {
    return "EEO / Diversity";
  }
  if (n.includes("question") || n.includes("custom")) {
    return "Additional Questions";
  }
  return "Basic Information";
};

/**
 * Ashby adapter.
 *
 * Handles Ashby HQ job postings (ashbyhq.com, jobs.ashby.com).
 *
 * @example
 * ```ts
 * const client = createApplyClient({ adapters: [ashby()] });
 * ```
 */
export const ashby = (): AtsAdapter => ({
  canHandle: (url) => ASHBY_DOMAINS.some((d) => url.includes(d)),

  name: "ashby",

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
    portalName: "Ashby",
    provider: "ashby",
    values: rawValues,
  }),
});
