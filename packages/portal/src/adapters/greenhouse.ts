import { z } from "zod";

import { PortalError } from "../errors";
import type {
  PortalAdapter,
  PortalFieldKind,
  PortalFormField,
  PortalJob,
  PortalSubmitInput,
  PortalSubmissionResult,
} from "../types";

const BOARDS_API_BASE = "https://boards-api.greenhouse.io/v1";

const GREENHOUSE_HOSTS = new Set([
  "boards.greenhouse.io",
  "job-boards.greenhouse.io",
]);

const RESERVED_ANSWER_FIELDS = new Set([
  "cover_letter",
  "email",
  "first_name",
  "last_name",
  "location",
  "mapped_url_token",
  "phone",
  "resume",
]);

const greenhouseOptionSchema = z.object({
  label: z.string(),
  value: z.union([z.number(), z.string()]),
});

const greenhouseFieldSchema = z.object({
  name: z.string(),
  type: z.string(),
  values: z.array(greenhouseOptionSchema),
});

const greenhouseQuestionSchema = z.object({
  fields: z.array(greenhouseFieldSchema),
  label: z.string(),
  required: z.boolean(),
});

const greenhouseComplianceSchema = z.object({
  questions: z.array(greenhouseQuestionSchema).default([]),
});

const greenhouseJobSchema = z.object({
  company_name: z.string().optional(),
  compliance: z.array(greenhouseComplianceSchema).default([]),
  content: z.string().optional(),
  id: z.number(),
  location: z.object({ name: z.string() }).optional(),
  location_questions: z.array(greenhouseQuestionSchema).nullish(),
  questions: z.array(greenhouseQuestionSchema).default([]),
  title: z.string(),
});

type GreenhouseQuestion = z.infer<typeof greenhouseQuestionSchema>;

export interface GreenhouseJobTarget {
  boardToken: string;
  jobId: string;
}

export interface GreenhouseAdapterOptions {
  apiKey?: string;
}

export const parseGreenhouseJobUrl = (
  url: string
): GreenhouseJobTarget | null => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (!GREENHOUSE_HOSTS.has(parsed.hostname)) {
    return null;
  }

  const segments = parsed.pathname.split("/").filter(Boolean);
  const jobsIndex = segments.findIndex(
    (segment) => segment === "job" || segment === "jobs"
  );
  const [boardToken] = segments;
  const jobId = jobsIndex === -1 ? undefined : segments[jobsIndex + 1];

  if (!(boardToken && jobId)) {
    return null;
  }

  return { boardToken, jobId };
};

const FIELD_KIND_BY_GREENHOUSE_TYPE: Record<string, PortalFieldKind> = {
  input_file: "file",
  input_hidden: "hidden",
  input_text: "text",
  multi_value_multiselect: "multiselect",
  multi_value_single_select: "select",
  textarea: "textarea",
};

const mapGreenhouseFieldType = (type: string): PortalFieldKind =>
  FIELD_KIND_BY_GREENHOUSE_TYPE[type] ?? "custom";

const toPortalFields = (questions: GreenhouseQuestion[]): PortalFormField[] =>
  questions.flatMap((question) =>
    question.fields.map((field) => ({
      id: field.name,
      kind: mapGreenhouseFieldType(field.type),
      label: question.label,
      ...(field.values.length > 0
        ? {
            options: field.values.map((value) => ({
              label: value.label,
              value: String(value.value),
            })),
          }
        : {}),
      required: question.required,
    }))
  );

export const greenhouse = (
  options: GreenhouseAdapterOptions = {}
): PortalAdapter => {
  const detect = (url: string): boolean => {
    try {
      return GREENHOUSE_HOSTS.has(new URL(url).hostname);
    } catch {
      return false;
    }
  };

  const parseJob = async (url: string): Promise<PortalJob> => {
    const target = parseGreenhouseJobUrl(url);

    if (!target) {
      throw new PortalError(
        "job-not-found",
        `Not a Greenhouse job board URL: ${url}`
      );
    }

    const { boardToken, jobId } = target;
    const response = await fetch(
      `${BOARDS_API_BASE}/boards/${boardToken}/jobs/${jobId}?questions=true`
    );

    if (!response.ok) {
      throw new PortalError(
        "job-not-found",
        `Greenhouse job ${jobId} not found on board "${boardToken}".`
      );
    }

    const data = greenhouseJobSchema.parse(await response.json());
    const complianceQuestions = data.compliance.flatMap(
      (section) => section.questions
    );

    return {
      boardToken,
      company: data.company_name,
      descriptionHtml: data.content,
      fields: [
        ...toPortalFields(data.questions),
        ...toPortalFields(data.location_questions ?? []),
        ...toPortalFields(complianceQuestions),
      ],
      jobId: String(data.id),
      location: data.location?.name,
      provider: "greenhouse",
      title: data.title,
      url,
    };
  };

  const submit = async (
    job: PortalJob,
    input: PortalSubmitInput
  ): Promise<PortalSubmissionResult> => {
    const boardToken =
      job.boardToken ?? parseGreenhouseJobUrl(job.url)?.boardToken;

    if (!boardToken) {
      throw new PortalError(
        "job-not-found",
        `Missing Greenhouse board token for job ${job.jobId}.`
      );
    }

    const form = new FormData();

    form.append("first_name", input.applicant.firstName);
    form.append("last_name", input.applicant.lastName);
    form.append("email", input.applicant.email);

    if (input.applicant.phone) {
      form.append("phone", input.applicant.phone);
    }

    if (input.applicant.location) {
      form.append("location", input.applicant.location);
    }

    if (input.referralToken) {
      form.append("mapped_url_token", input.referralToken);
    }

    form.append(
      "resume",
      new Blob([input.resume.bytes], { type: input.resume.contentType }),
      input.resume.name
    );

    if (input.coverLetter) {
      form.append(
        "cover_letter",
        new Blob([input.coverLetter.bytes], {
          type: input.coverLetter.contentType,
        }),
        input.coverLetter.name
      );
    }

    for (const [name, value] of Object.entries(input.answers ?? {})) {
      if (RESERVED_ANSWER_FIELDS.has(name)) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const entry of value) {
          form.append(`${name}[]`, entry);
        }
      } else {
        form.append(name, value);
      }
    }

    const headers: Record<string, string> = {};

    if (options.apiKey) {
      headers.Authorization = `Basic ${btoa(`${options.apiKey}:`)}`;
    }

    const response = await fetch(
      `${BOARDS_API_BASE}/boards/${boardToken}/jobs/${job.jobId}`,
      {
        body: form,
        headers,
        method: "POST",
        redirect: "follow",
      }
    );

    if (!response.ok) {
      const body = await response.text();

      throw new PortalError(
        "submission-failed",
        `Greenhouse rejected the application (${response.status}): ${body.slice(0, 300)}`
      );
    }

    return {
      confirmationUrl: response.url,
      jobId: job.jobId,
      provider: "greenhouse",
      submittedAt: new Date(),
    };
  };

  return {
    detect,
    label: "Greenhouse",
    parseJob,
    provider: "greenhouse",
    submit,
  };
};
