import { z } from "zod";

// ---------------------------------------------------------------------------
// ATS provider names — the "routing name" for each adapter (like email-sdk)
// ---------------------------------------------------------------------------

export const ATS_PROVIDERS = [
  "greenhouse",
  "lever",
  "workday",
  "ashby",
  "taleo",
  "smartrecruiters",
  "linkedin",
  "generic",
] as const;

export type AtsProvider = (typeof ATS_PROVIDERS)[number];

// ---------------------------------------------------------------------------
// Form field types the renderer knows how to display
// ---------------------------------------------------------------------------

export const FORM_FIELD_TYPES = [
  "text",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "file",
  "date",
  "phone",
  "number",
  "eeo",
] as const;

export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];

// ---------------------------------------------------------------------------
// Field option (for select / radio / checkbox)
// ---------------------------------------------------------------------------

export interface FormFieldOption {
  label: string;
  value: string;
}

// ---------------------------------------------------------------------------
// A single field definition — what the agent found on the page
// ---------------------------------------------------------------------------

export interface FormFieldDefinition {
  /** Stable key within this snapshot, matches the key in `values` */
  id: string;
  /** Human-readable label shown to the user */
  label: string;
  /** How to render and interpret this field */
  type: FormFieldType;
  required?: boolean;
  /** Applicable for select / radio / checkbox fields */
  options?: FormFieldOption[];
  /** Groups fields into sections, e.g. "Basic Info", "EEO", "Custom Questions" */
  section?: string;
  /** Original attribute name on the form element (for debugging) */
  rawName?: string;
}

// ---------------------------------------------------------------------------
// The snapshot — a point-in-time capture of one form submission
// ---------------------------------------------------------------------------

export interface ApplicationFormSnapshot {
  /** ISO 8601 timestamp of when the form was captured/scraped */
  capturedAt?: string;
  /** All fields the agent found on the page */
  fields: FormFieldDefinition[];
  /** Human-friendly portal name, e.g. "Greenhouse at Stripe" */
  portalName?: string;
  /** Which adapter normalized this form */
  provider: AtsProvider;
  /** ISO 8601 timestamp of when the agent submitted (if submitted) */
  submittedAt?: string;
  /** Submitted or prefilled values, keyed by FormFieldDefinition.id */
  values: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Zod schema for DB storage / API validation
// ---------------------------------------------------------------------------

const formFieldOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const formFieldDefinitionSchema = z.object({
  id: z.string(),
  label: z.string(),
  options: z.array(formFieldOptionSchema).optional(),
  rawName: z.string().optional(),
  required: z.boolean().optional(),
  section: z.string().optional(),
  type: z.enum([...FORM_FIELD_TYPES]),
});

export const applicationFormSnapshotSchema = z.object({
  capturedAt: z.string().optional(),
  fields: z.array(formFieldDefinitionSchema),
  portalName: z.string().optional(),
  provider: z.enum([...ATS_PROVIDERS]),
  submittedAt: z.string().optional(),
  values: z.record(z.string(), z.unknown()),
});

// ---------------------------------------------------------------------------
// Adapter interface — what every factory function must return
// ---------------------------------------------------------------------------

export interface AtsAdapter {
  /**
   * Return true if this adapter can handle the given URL.
   * Adapters are checked in order; the first match wins.
   * The `generic` adapter always returns true (fallback).
   */
  canHandle: (url: string) => boolean;
  /** The routing name — unique identifier for this adapter */
  name: AtsProvider;
  /**
   * Normalize raw scraped fields + values into a standard FormSnapshot.
   * The agent calls this after extracting data from the page.
   */
  normalize: (
    rawFields: RawField[],
    rawValues: Record<string, unknown>
  ) => ApplicationFormSnapshot;
}

// ---------------------------------------------------------------------------
// Raw field shape — what the agent scrapes from the DOM before normalizing
// ---------------------------------------------------------------------------

export interface RawField {
  id?: string;
  label?: string;
  name: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  type?: string;
}
