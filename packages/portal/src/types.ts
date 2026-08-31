export const PORTAL_FIELD_KINDS = [
  "custom",
  "file",
  "hidden",
  "multiselect",
  "select",
  "text",
  "textarea",
] as const;

export type PortalFieldKind = (typeof PORTAL_FIELD_KINDS)[number];

export const PORTAL_PROVIDERS = ["generic", "greenhouse"] as const;

export type PortalProviderId = (typeof PORTAL_PROVIDERS)[number];

export interface PortalFile {
  bytes: Uint8Array<ArrayBuffer>;
  contentType: string;
  name: string;
}

export interface PortalApplicant {
  email: string;
  firstName: string;
  lastName: string;
  linkedin?: string;
  location?: string;
  phone?: string;
}

export type PortalAnswers = Record<string, string | string[]>;

export interface PortalFormField {
  id: string;
  kind: PortalFieldKind;
  label: string;
  options?: { label: string; value: string }[];
  required: boolean;
}

export interface PortalJob {
  boardToken?: string;
  company?: string;
  descriptionHtml?: string;
  fields: PortalFormField[];
  jobId: string;
  location?: string;
  provider: PortalProviderId;
  title: string;
  url: string;
}

export interface PortalSubmitInput {
  answers?: PortalAnswers;
  applicant: PortalApplicant;
  coverLetter?: PortalFile;
  referralToken?: string;
  resume: PortalFile;
}

export interface PortalSubmissionResult {
  confirmationUrl?: string;
  jobId: string;
  provider: PortalProviderId;
  submittedAt: Date;
}

export interface PortalAdapter {
  detect: (url: string) => boolean;
  label: string;
  parseJob: (url: string) => Promise<PortalJob>;
  provider: PortalProviderId;
  submit: (
    job: PortalJob,
    input: PortalSubmitInput
  ) => Promise<PortalSubmissionResult>;
}
