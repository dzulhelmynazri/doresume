import { z } from "zod";

export const RESUME_SECTION_IDS = [
  "summary",
  "education",
  "skills",
  "workExperience",
  "projects",
  "certifications",
] as const;

export type ResumeSectionId = (typeof RESUME_SECTION_IDS)[number];

export const RESUME_SECTION_LABELS: Record<ResumeSectionId, string> = {
  certifications: "Certifications",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  summary: "Summary",
  workExperience: "Work Experience",
};

export const RESUME_FONT_FAMILIES = ["times", "helvetica", "courier"] as const;
export const RESUME_FONT_SIZES = [10, 11, 12] as const;
export const RESUME_ALIGNMENTS = ["left", "justify"] as const;
export const RESUME_TEMPLATES = ["standard", "jake"] as const;

export type ResumeFontFamily = (typeof RESUME_FONT_FAMILIES)[number];
export type ResumeFontSize = (typeof RESUME_FONT_SIZES)[number];
export type ResumeAlignment = (typeof RESUME_ALIGNMENTS)[number];
export type ResumeTemplate = (typeof RESUME_TEMPLATES)[number];

const bulletSchema = z.object({
  id: z.string().min(1),
  text: z.string(),
});

export const createResumeId = () => crypto.randomUUID();

const normalizeEducationBullets = (
  bullets: z.infer<typeof bulletSchema>[] | undefined,
  details: string | undefined
): z.infer<typeof bulletSchema>[] => {
  if ((bullets?.length ?? 0) > 0) {
    return bullets;
  }

  if (details?.trim()) {
    return [{ id: createResumeId(), text: details }];
  }

  return [];
};

const educationEntrySchema = z
  .object({
    bullets: z.array(bulletSchema).optional().default([]),
    degree: z.string(),
    details: z.string().optional(),
    endDate: z.string().optional(),
    id: z.string().min(1),
    location: z.string().optional(),
    school: z.string(),
    startDate: z.string(),
    visible: z.boolean().optional().default(true),
  })
  .transform((entry) => ({
    bullets: normalizeEducationBullets(entry.bullets, entry.details),
    degree: entry.degree,
    endDate: entry.endDate,
    id: entry.id,
    location: entry.location,
    school: entry.school,
    startDate: entry.startDate,
    visible: entry.visible,
  }));

const workExperienceEntrySchema = z.object({
  bullets: z.array(bulletSchema),
  company: z.string(),
  endDate: z.string().optional(),
  id: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string(),
  title: z.string(),
  visible: z.boolean().optional().default(true),
});

const projectEntrySchema = z.object({
  bullets: z.array(bulletSchema),
  endDate: z.string().optional(),
  id: z.string().min(1),
  name: z.string(),
  startDate: z.string().optional(),
  url: z.string().optional(),
  visible: z.boolean().optional().default(true),
});

const certificationEntrySchema = z.object({
  date: z.string().optional(),
  id: z.string().min(1),
  issuer: z.string().optional(),
  name: z.string(),
  visible: z.boolean().optional().default(true),
});

const customSectionEntrySchema = z.object({
  bullets: z.array(bulletSchema),
  endDate: z.string().optional(),
  id: z.string().min(1),
  location: z.string().optional(),
  name: z.string().optional().default(""),
  startDate: z.string().optional(),
  visible: z.boolean().optional().default(true),
});

const normalizeCustomSectionEntries = (
  entries: z.infer<typeof customSectionEntrySchema>[] | undefined,
  bullets: z.infer<typeof bulletSchema>[] | undefined
): z.infer<typeof customSectionEntrySchema>[] => {
  if ((entries?.length ?? 0) > 0) {
    return entries;
  }

  if ((bullets?.length ?? 0) > 0) {
    return [
      {
        bullets,
        id: createResumeId(),
        name: "",
        visible: true,
      },
    ];
  }

  return [];
};

const customSectionSchema = z
  .object({
    bullets: z.array(bulletSchema).optional().default([]),
    entries: z.array(customSectionEntrySchema).optional().default([]),
    id: z.string().min(1),
    title: z.string().min(1),
    visible: z.boolean().optional().default(true),
  })
  .transform((section) => ({
    entries: normalizeCustomSectionEntries(section.entries, section.bullets),
    id: section.id,
    title: section.title,
    visible: section.visible,
  }));

const resumeHeaderSchema = z.object({
  email: z.string().optional(),
  linkedin: z.string().optional(),
  location: z.string().optional(),
  name: z.string(),
  phone: z.string().optional(),
  title: z.string().optional(),
});

const resumeSettingsSchema = z.object({
  alignment: z.enum(RESUME_ALIGNMENTS),
  fontFamily: z.enum(RESUME_FONT_FAMILIES),
  fontSize: z.union([z.literal(10), z.literal(11), z.literal(12)]),
  template: z.enum(RESUME_TEMPLATES),
});

export const DEFAULT_SECTION_VISIBILITY: Record<ResumeSectionId, boolean> = {
  certifications: true,
  education: true,
  projects: true,
  skills: true,
  summary: true,
  workExperience: true,
};

export const resumeDocumentSchema = z
  .object({
    certifications: z.array(certificationEntrySchema),
    customSections: z.array(customSectionSchema).default([]),
    education: z.array(educationEntrySchema),
    header: resumeHeaderSchema,
    projects: z.array(projectEntrySchema),
    sectionOrder: z.array(z.string()),
    sectionVisibility: z.record(z.string(), z.boolean()),
    settings: resumeSettingsSchema,
    skills: z.array(z.string()),
    sourceFileKey: z.string().optional(),
    summary: z.string(),
    workExperience: z.array(workExperienceEntrySchema),
  })
  .transform((document) => {
    const customSectionIds = new Set(
      document.customSections.map((section) => section.id)
    );
    const sectionOrder = document.sectionOrder.filter(
      (sectionId) =>
        (RESUME_SECTION_IDS as readonly string[]).includes(sectionId) ||
        customSectionIds.has(sectionId)
    );

    for (const section of document.customSections) {
      if (!sectionOrder.includes(section.id)) {
        sectionOrder.push(section.id);
      }
    }

    for (const sectionId of RESUME_SECTION_IDS) {
      if (!sectionOrder.includes(sectionId)) {
        sectionOrder.push(sectionId);
      }
    }

    const sectionVisibility: Record<string, boolean> = {
      ...DEFAULT_SECTION_VISIBILITY,
      ...document.sectionVisibility,
    };

    for (const section of document.customSections) {
      if (sectionVisibility[section.id] === undefined) {
        sectionVisibility[section.id] = section.visible !== false;
      }
    }

    return {
      ...document,
      sectionOrder,
      sectionVisibility,
    };
  });

export type ResumeBullet = z.infer<typeof bulletSchema>;
export type WorkExperienceEntry = z.infer<typeof workExperienceEntrySchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type ProjectEntry = z.infer<typeof projectEntrySchema>;
export type CertificationEntry = z.infer<typeof certificationEntrySchema>;
export type CustomSectionEntry = z.infer<typeof customSectionEntrySchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;
export type ResumeHeader = z.infer<typeof resumeHeaderSchema>;
export type ResumeSettings = z.infer<typeof resumeSettingsSchema>;
export type ResumeDocument = z.infer<typeof resumeDocumentSchema>;

export const RESUME_SETTINGS_DEFAULTS: ResumeSettings = {
  alignment: "left",
  fontFamily: "times",
  fontSize: 11,
  template: "standard",
};

export interface ResumeDocumentSeedUser {
  name: string;
  email: string;
  phone?: string | null;
  linkedin?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

const formatLocation = (user: ResumeDocumentSeedUser) => {
  const parts = [user.city, user.state, user.country].filter(
    (part): part is string => Boolean(part?.trim())
  );

  return parts.join(", ");
};

export const isEntryVisible = (entry: { visible?: boolean }) =>
  entry.visible !== false;

export const isBuiltInSectionId = (
  sectionId: string
): sectionId is ResumeSectionId =>
  (RESUME_SECTION_IDS as readonly string[]).includes(sectionId);

export const getSectionTitle = (
  document: ResumeDocument,
  sectionId: string
): string => {
  if (isBuiltInSectionId(sectionId)) {
    return RESUME_SECTION_LABELS[sectionId];
  }

  return (
    document.customSections.find((section) => section.id === sectionId)
      ?.title ?? "Custom section"
  );
};

export const getCustomSection = (
  document: ResumeDocument,
  sectionId: string
): CustomSection | undefined =>
  document.customSections.find((section) => section.id === sectionId);

export const isSectionVisible = (
  document: ResumeDocument,
  sectionId: string
): boolean => document.sectionVisibility[sectionId] !== false;

export const getVisibleSectionIds = (document: ResumeDocument): string[] =>
  document.sectionOrder.filter((sectionId) =>
    isSectionVisible(document, sectionId)
  );

export const hasCustomSectionContent = (section: CustomSection): boolean =>
  section.entries.some(
    (entry) =>
      isEntryVisible(entry) &&
      (Boolean(entry.name?.trim()) ||
        Boolean(entry.location?.trim()) ||
        Boolean(entry.startDate?.trim()) ||
        Boolean(entry.endDate?.trim()) ||
        entry.bullets.some((bullet) => bullet.text.trim().length > 0))
  );

export const hasCustomSectionEntryContent = (
  entry: CustomSectionEntry
): boolean =>
  Boolean(entry.name?.trim()) ||
  Boolean(entry.location?.trim()) ||
  Boolean(entry.startDate?.trim()) ||
  Boolean(entry.endDate?.trim()) ||
  entry.bullets.some((bullet) => bullet.text.trim().length > 0);

export const createEmptyBullet = (): ResumeBullet => ({
  id: createResumeId(),
  text: "",
});

export const createEmptyWorkExperience = (): WorkExperienceEntry => ({
  bullets: [createEmptyBullet()],
  company: "",
  id: createResumeId(),
  startDate: "",
  title: "",
  visible: true,
});

export const createEmptyEducation = (): EducationEntry => ({
  bullets: [createEmptyBullet()],
  degree: "",
  id: createResumeId(),
  school: "",
  startDate: "",
  visible: true,
});

export const createEmptyProject = (): ProjectEntry => ({
  bullets: [createEmptyBullet()],
  id: createResumeId(),
  name: "",
  visible: true,
});

export const createEmptyCertification = (): CertificationEntry => ({
  id: createResumeId(),
  name: "",
  visible: true,
});

export const createEmptyCustomSectionEntry = (): CustomSectionEntry => ({
  bullets: [createEmptyBullet()],
  id: createResumeId(),
  name: "",
  visible: true,
});

export const createEmptyCustomSection = (
  title = "Custom section"
): CustomSection => ({
  entries: [createEmptyCustomSectionEntry()],
  id: createResumeId(),
  title,
  visible: true,
});

export const createDefaultResumeDocument = (
  user: ResumeDocumentSeedUser
): ResumeDocument => {
  const location = formatLocation(user);

  return {
    certifications: [],
    customSections: [],
    education: [],
    header: {
      email: user.email,
      linkedin: user.linkedin ?? undefined,
      location: location.length > 0 ? location : undefined,
      name: user.name,
      phone: user.phone ?? undefined,
    },
    projects: [],
    sectionOrder: [...RESUME_SECTION_IDS],
    sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
    settings: { ...RESUME_SETTINGS_DEFAULTS },
    skills: [],
    summary: "",
    workExperience: [],
  };
};
