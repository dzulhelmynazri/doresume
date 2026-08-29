import type {
  ApplicationFormSnapshot,
  AtsAdapter,
  FormFieldDefinition,
} from "../types";
import { mapFieldType } from "../utils/field-types";

const WORKDAY_DOMAINS = [
  "myworkdayjobs.com",
  "wd1.myworkday.com",
  "wd3.myworkday.com",
  "wd5.myworkday.com",
];

const mapSection = (rawName: string, rawLabel?: string): string => {
  const n = `${rawName} ${rawLabel ?? ""}`.toLowerCase();
  if (
    n.includes("eeo") ||
    n.includes("veteran") ||
    n.includes("disability") ||
    n.includes("diversity")
  ) {
    return "EEO / Diversity";
  }
  if (n.includes("question") || n.includes("screening")) {
    return "Screening Questions";
  }
  if (n.includes("experience") || n.includes("education")) {
    return "Background";
  }
  return "Basic Information";
};

/**
 * Workday adapter.
 *
 * Handles Workday ATS job applications on myworkdayjobs.com domains.
 * Workday forms are heavily dynamic (React-based), so `rawFields` should be
 * extracted by the agent via aria-label / data-automation-id selectors.
 *
 * @example
 * ```ts
 * const client = createApplyClient({ adapters: [workday()] });
 * ```
 */
export const workday = (): AtsAdapter => ({
  canHandle: (url) => WORKDAY_DOMAINS.some((d) => url.includes(d)),

  name: "workday",

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
    portalName: "Workday",
    provider: "workday",
    values: rawValues,
  }),
});
