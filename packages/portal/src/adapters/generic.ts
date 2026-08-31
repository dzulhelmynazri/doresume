import { PortalError } from "../errors";
import type {
  PortalAdapter,
  PortalFile,
  PortalJob,
  PortalSubmitInput,
  PortalSubmissionResult,
} from "../types";

export interface BrowserFormField {
  /** Natural-language description specific enough for an act() instruction. */
  hint: string;
  label: string;
  options?: { label: string; value: string }[];
  required: boolean;
}

export interface BrowserConfirmOutcome {
  pageText: string;
  url: string;
}

export interface BrowserDriver {
  /** Performs a natural-language browser action (fill, select, click). */
  act: (instruction: string) => Promise<void>;
  /** Ends the browser session so billable browser time is released. */
  close: () => Promise<void>;
  /** Verifies the submission and captures the outcome page as evidence. */
  confirm: () => Promise<BrowserConfirmOutcome>;
  navigate: (url: string) => Promise<void>;
  /** Lists the form fields visible on the current page. */
  observe: (instruction?: string) => Promise<BrowserFormField[]>;
  /** Uploads a file into the field described by the natural-language hint. */
  upload: (file: PortalFile, fieldHint: string) => Promise<void>;
}

export interface GenericAdapterOptions {
  driver: BrowserDriver;
}

const parseJob = async (url: string): Promise<PortalJob> => {
  let title = url;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const html = await response.text();
      const match = html.match(/<title[^>]*>(?<title>.*?)<\/title>/isu);

      if (match?.groups?.title) {
        title = match.groups.title.trim();
      }
    }
  } catch {
    // Leave the URL as the title; the browser driver resolves the real
    // page during submission.
  }

  return { fields: [], jobId: url, provider: "generic", title, url };
};

const identityValueForField = (
  field: BrowserFormField,
  input: PortalSubmitInput
): string | undefined => {
  const label = field.label.toLowerCase();
  const { applicant } = input;

  if (label.includes("first") && label.includes("name")) {
    return applicant.firstName;
  }

  if (label.includes("last") && label.includes("name")) {
    return applicant.lastName;
  }

  if (label.includes("email")) {
    return applicant.email;
  }

  if (label.includes("phone")) {
    return applicant.phone;
  }

  if (label.includes("linkedin")) {
    return applicant.linkedin;
  }

  if (label.includes("location") || label.includes("city")) {
    return applicant.location;
  }

  return undefined;
};

const fileForField = (
  field: BrowserFormField,
  input: PortalSubmitInput
): PortalFile | undefined => {
  const label = field.label.toLowerCase();

  if (label.includes("cover letter")) {
    return input.coverLetter;
  }

  if (label.includes("resume") || label.includes("cv")) {
    return input.resume;
  }

  return undefined;
};

const resolveFieldValue = (
  field: BrowserFormField,
  input: PortalSubmitInput
): PortalFile | string | undefined => {
  const file = fileForField(field, input);

  if (file) {
    return file;
  }

  const answer = input.answers?.[field.label] ?? input.answers?.[field.hint];

  if (answer !== undefined) {
    return Array.isArray(answer) ? answer.join(", ") : answer;
  }

  return identityValueForField(field, input);
};

export const generic = (options: GenericAdapterOptions): PortalAdapter => {
  const submit = async (
    job: PortalJob,
    input: PortalSubmitInput
  ): Promise<PortalSubmissionResult> => {
    const { driver } = options;

    await driver.navigate(job.url);

    try {
      const fields = await driver.observe();

      for (const field of fields) {
        const value = resolveFieldValue(field, input);

        if (value === undefined) {
          if (field.required) {
            throw new PortalError(
              "submission-failed",
              `Career site form requires "${field.label}".`
            );
          }

          continue;
        }

        const action =
          typeof value === "string"
            ? driver.act(`Enter "${value}" into the "${field.label}" field.`)
            : driver.upload(value, field.hint);

        // Browser form actions must run in order on the same page.
        // oxlint-disable-next-line no-await-in-loop
        await action;
      }

      const outcome = await driver.confirm();

      return {
        confirmationUrl: outcome.url,
        jobId: job.jobId,
        provider: "generic",
        submittedAt: new Date(),
      };
    } finally {
      await driver.close();
    }
  };

  return {
    detect: (_url: string) => false,
    label: "Career site",
    parseJob,
    provider: "generic",
    submit,
  };
};
