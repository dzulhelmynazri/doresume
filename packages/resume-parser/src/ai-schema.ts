import { z } from "zod";

const aiResumeBulletSchema = z.string().trim().min(1);

export const aiParsedResumeSchema = z.object({
  certifications: z
    .array(
      z.object({
        date: z.string().optional(),
        issuer: z.string().optional(),
        name: z.string(),
      })
    )
    .default([]),
  education: z
    .array(
      z.object({
        bullets: z.array(aiResumeBulletSchema).default([]),
        degree: z.string(),
        endDate: z.string().optional(),
        location: z.string().optional(),
        school: z.string(),
        startDate: z.string().default(""),
      })
    )
    .default([]),
  header: z.object({
    email: z.string().optional(),
    linkedin: z.string().optional(),
    location: z.string().optional(),
    name: z.string(),
    phone: z.string().optional(),
    title: z.string().optional(),
  }),
  projects: z
    .array(
      z.object({
        bullets: z.array(aiResumeBulletSchema).default([]),
        endDate: z.string().optional(),
        name: z.string(),
        startDate: z.string().optional(),
        url: z.string().optional(),
      })
    )
    .default([]),
  skills: z.array(z.string()).default([]),
  summary: z.string().default(""),
  workExperience: z
    .array(
      z.object({
        bullets: z.array(aiResumeBulletSchema).default([]),
        company: z.string(),
        endDate: z.string().optional(),
        location: z.string().optional(),
        startDate: z.string().default(""),
        title: z.string(),
      })
    )
    .default([]),
});

export type AiParsedResume = z.infer<typeof aiParsedResumeSchema>;
