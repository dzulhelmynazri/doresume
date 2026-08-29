import {
  createDefaultResumeDocument,
  createResumeId,
  resumeDocumentSchema,
} from "@doresume/contracts";
import type {
  ResumeDocument,
  ResumeDocumentSeedUser,
} from "@doresume/contracts";

import type { AiParsedResume } from "./ai-schema";

const toBullets = (items: string[]) =>
  items.map((text) => ({
    id: createResumeId(),
    text,
  }));

const mergeHeader = (
  seed: ResumeDocumentSeedUser,
  parsed: AiParsedResume["header"]
) => {
  const base = createDefaultResumeDocument(seed).header;

  return {
    email: parsed.email?.trim() || base.email,
    linkedin: parsed.linkedin?.trim() || base.linkedin,
    location: parsed.location?.trim() || base.location,
    name: parsed.name.trim() || base.name,
    phone: parsed.phone?.trim() || base.phone,
    title: parsed.title?.trim() || base.title,
  };
};

export const toResumeDocument = (
  parsed: AiParsedResume,
  seed: ResumeDocumentSeedUser,
  sourceFileKey?: string
): ResumeDocument => {
  const base = createDefaultResumeDocument(seed);

  return resumeDocumentSchema.parse({
    ...base,
    certifications: parsed.certifications.map((entry) => ({
      date: entry.date,
      id: createResumeId(),
      issuer: entry.issuer,
      name: entry.name,
      visible: true,
    })),
    education: parsed.education.map((entry) => ({
      bullets: toBullets(entry.bullets),
      degree: entry.degree,
      endDate: entry.endDate,
      id: createResumeId(),
      location: entry.location,
      school: entry.school,
      startDate: entry.startDate,
      visible: true,
    })),
    header: mergeHeader(seed, parsed.header),
    projects: parsed.projects.map((entry) => ({
      bullets: toBullets(entry.bullets),
      endDate: entry.endDate,
      id: createResumeId(),
      name: entry.name,
      startDate: entry.startDate,
      url: entry.url,
      visible: true,
    })),
    skills: parsed.skills.map((skill) => skill.trim()).filter(Boolean),
    sourceFileKey,
    summary: parsed.summary.trim(),
    workExperience: parsed.workExperience.map((entry) => ({
      bullets: toBullets(entry.bullets),
      company: entry.company,
      endDate: entry.endDate,
      id: createResumeId(),
      location: entry.location,
      startDate: entry.startDate,
      title: entry.title,
      visible: true,
    })),
  });
};
