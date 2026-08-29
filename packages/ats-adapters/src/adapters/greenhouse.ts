import type {
  ApplicationFormSnapshot,
  AtsAdapter,
  FormFieldDefinition,
} from "../types";
import { mapFieldType } from "../utils/field-types";

const GREENHOUSE_DOMAINS = ["greenhouse.io", "boards.greenhouse.io"];

const mapSection = (rawName: string): string => {
  const n = rawName.toLowerCase();
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
  if (n.includes("custom_field") || n.includes("question")) {
    return "Additional Questions";
  }
  return "Basic Information";
};

/**
 * Greenhouse adapter.
 *
 * Handles Greenhouse ATS portals (boards.greenhouse.io and employer domains
 * that embed the Greenhouse iframe).
 *
 * @example
 * ```ts
 * const client = createApplyClient({ adapters: [greenhouse()] });
 * ```
 */
export const greenhouse = (): AtsAdapter => ({
  canHandle: (url) => GREENHOUSE_DOMAINS.some((d) => url.includes(d)),

  name: "greenhouse",

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
    portalName: "Greenhouse",
    provider: "greenhouse",
    values: rawValues,
  }),
});
