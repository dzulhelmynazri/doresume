import { arrayMove } from "@dnd-kit/sortable";
import type {
  CertificationEntry,
  CustomSection,
  CustomSectionEntry,
  EducationEntry,
  ProjectEntry,
  ResumeDocument,
  ResumeSettings,
  WorkExperienceEntry,
} from "@doresume/contracts";
import {
  createEmptyBullet,
  createEmptyCertification,
  createEmptyCustomSection,
  createEmptyCustomSectionEntry,
  createEmptyEducation,
  createEmptyProject,
  createEmptyWorkExperience,
  createResumeId,
  isBuiltInSectionId,
  isEntryVisible,
} from "@doresume/contracts";

export const updateDocument = (
  document: ResumeDocument,
  updater: (current: ResumeDocument) => ResumeDocument
): ResumeDocument => updater(document);

const reorderEntries = <T extends { id: string }>(
  entries: T[],
  activeId: string,
  overId: string
): T[] => {
  const oldIndex = entries.findIndex((entry) => entry.id === activeId);
  const newIndex = entries.findIndex((entry) => entry.id === overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return entries;
  }

  return arrayMove(entries, oldIndex, newIndex);
};

const toggleEntryVisibility = <T extends { id: string; visible?: boolean }>(
  entries: T[],
  entryId: string
): T[] =>
  entries.map((entry) =>
    entry.id === entryId ? { ...entry, visible: !isEntryVisible(entry) } : entry
  );

export const reorderSections = (
  document: ResumeDocument,
  activeId: string,
  overId: string
): ResumeDocument => {
  const oldIndex = document.sectionOrder.indexOf(activeId);
  const newIndex = document.sectionOrder.indexOf(overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return document;
  }

  return {
    ...document,
    sectionOrder: arrayMove(document.sectionOrder, oldIndex, newIndex),
  };
};

export const toggleSectionVisibility = (
  document: ResumeDocument,
  sectionId: string
): ResumeDocument => ({
  ...document,
  sectionVisibility: {
    ...document.sectionVisibility,
    [sectionId]: !document.sectionVisibility[sectionId],
  },
});

export const removeCustomSection = (
  document: ResumeDocument,
  sectionId: string
): ResumeDocument => {
  const { [sectionId]: _removed, ...sectionVisibility } =
    document.sectionVisibility;

  return {
    ...document,
    customSections: document.customSections.filter(
      (section) => section.id !== sectionId
    ),
    sectionOrder: document.sectionOrder.filter((id) => id !== sectionId),
    sectionVisibility,
  };
};

export const clearSection = (
  document: ResumeDocument,
  sectionId: string
): ResumeDocument => {
  if (!isBuiltInSectionId(sectionId)) {
    return removeCustomSection(document, sectionId);
  }

  switch (sectionId) {
    case "summary": {
      return { ...document, summary: "" };
    }
    case "skills": {
      return { ...document, skills: [] };
    }
    case "education": {
      return { ...document, education: [] };
    }
    case "workExperience": {
      return { ...document, workExperience: [] };
    }
    case "projects": {
      return { ...document, projects: [] };
    }
    case "certifications": {
      return { ...document, certifications: [] };
    }
    default: {
      return document;
    }
  }
};

export const updateSettings = (
  document: ResumeDocument,
  settings: Partial<ResumeSettings>
): ResumeDocument => ({
  ...document,
  settings: { ...document.settings, ...settings },
});

export const updateSummary = (
  document: ResumeDocument,
  summary: string
): ResumeDocument => ({
  ...document,
  summary,
});

export const updateSkills = (
  document: ResumeDocument,
  skills: string[]
): ResumeDocument => ({
  ...document,
  skills,
});

export const updateHeader = (
  document: ResumeDocument,
  header: ResumeDocument["header"]
): ResumeDocument => ({
  ...document,
  header,
});

export const addWorkExperience = (
  document: ResumeDocument
): ResumeDocument => ({
  ...document,
  workExperience: [...document.workExperience, createEmptyWorkExperience()],
});

export const updateWorkExperience = (
  document: ResumeDocument,
  entryId: string,
  entry: WorkExperienceEntry
): ResumeDocument => ({
  ...document,
  workExperience: document.workExperience.map((item) =>
    item.id === entryId ? entry : item
  ),
});

export const removeWorkExperience = (
  document: ResumeDocument,
  entryId: string
): ResumeDocument => ({
  ...document,
  workExperience: document.workExperience.filter((item) => item.id !== entryId),
});

export const reorderWorkExperience = (
  document: ResumeDocument,
  activeId: string,
  overId: string
): ResumeDocument => ({
  ...document,
  workExperience: reorderEntries(document.workExperience, activeId, overId),
});

export const toggleWorkExperienceVisibility = (
  document: ResumeDocument,
  entryId: string
): ResumeDocument => ({
  ...document,
  workExperience: toggleEntryVisibility(document.workExperience, entryId),
});

export const reorderWorkExperienceBullets = (
  entry: WorkExperienceEntry,
  activeId: string,
  overId: string
): WorkExperienceEntry => {
  const oldIndex = entry.bullets.findIndex((bullet) => bullet.id === activeId);
  const newIndex = entry.bullets.findIndex((bullet) => bullet.id === overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return entry;
  }

  return {
    ...entry,
    bullets: arrayMove(entry.bullets, oldIndex, newIndex),
  };
};

export const addWorkExperienceBullet = (
  entry: WorkExperienceEntry
): WorkExperienceEntry => ({
  ...entry,
  bullets: [...entry.bullets, createEmptyBullet()],
});

export const removeWorkExperienceBullet = (
  entry: WorkExperienceEntry,
  bulletId: string
): WorkExperienceEntry => ({
  ...entry,
  bullets: entry.bullets.filter((bullet) => bullet.id !== bulletId),
});

export const addEducation = (document: ResumeDocument): ResumeDocument => ({
  ...document,
  education: [...document.education, createEmptyEducation()],
});

export const updateEducation = (
  document: ResumeDocument,
  entryId: string,
  entry: EducationEntry
): ResumeDocument => ({
  ...document,
  education: document.education.map((item) =>
    item.id === entryId ? entry : item
  ),
});

export const removeEducation = (
  document: ResumeDocument,
  entryId: string
): ResumeDocument => ({
  ...document,
  education: document.education.filter((item) => item.id !== entryId),
});

export const reorderEducation = (
  document: ResumeDocument,
  activeId: string,
  overId: string
): ResumeDocument => ({
  ...document,
  education: reorderEntries(document.education, activeId, overId),
});

export const toggleEducationVisibility = (
  document: ResumeDocument,
  entryId: string
): ResumeDocument => ({
  ...document,
  education: toggleEntryVisibility(document.education, entryId),
});

export const reorderEducationBullets = (
  entry: EducationEntry,
  activeId: string,
  overId: string
): EducationEntry => {
  const oldIndex = entry.bullets.findIndex((bullet) => bullet.id === activeId);
  const newIndex = entry.bullets.findIndex((bullet) => bullet.id === overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return entry;
  }

  return {
    ...entry,
    bullets: arrayMove(entry.bullets, oldIndex, newIndex),
  };
};

export const addEducationBullet = (entry: EducationEntry): EducationEntry => ({
  ...entry,
  bullets: [...entry.bullets, createEmptyBullet()],
});

export const removeEducationBullet = (
  entry: EducationEntry,
  bulletId: string
): EducationEntry => ({
  ...entry,
  bullets: entry.bullets.filter((bullet) => bullet.id !== bulletId),
});

export const addProject = (document: ResumeDocument): ResumeDocument => ({
  ...document,
  projects: [...document.projects, createEmptyProject()],
});

export const updateProject = (
  document: ResumeDocument,
  entryId: string,
  entry: ProjectEntry
): ResumeDocument => ({
  ...document,
  projects: document.projects.map((item) =>
    item.id === entryId ? entry : item
  ),
});

export const removeProject = (
  document: ResumeDocument,
  entryId: string
): ResumeDocument => ({
  ...document,
  projects: document.projects.filter((item) => item.id !== entryId),
});

export const reorderProjects = (
  document: ResumeDocument,
  activeId: string,
  overId: string
): ResumeDocument => ({
  ...document,
  projects: reorderEntries(document.projects, activeId, overId),
});

export const toggleProjectVisibility = (
  document: ResumeDocument,
  entryId: string
): ResumeDocument => ({
  ...document,
  projects: toggleEntryVisibility(document.projects, entryId),
});

export const reorderProjectBullets = (
  entry: ProjectEntry,
  activeId: string,
  overId: string
): ProjectEntry => {
  const oldIndex = entry.bullets.findIndex((bullet) => bullet.id === activeId);
  const newIndex = entry.bullets.findIndex((bullet) => bullet.id === overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return entry;
  }

  return {
    ...entry,
    bullets: arrayMove(entry.bullets, oldIndex, newIndex),
  };
};

export const addProjectBullet = (entry: ProjectEntry): ProjectEntry => ({
  ...entry,
  bullets: [...entry.bullets, createEmptyBullet()],
});

export const removeProjectBullet = (
  entry: ProjectEntry,
  bulletId: string
): ProjectEntry => ({
  ...entry,
  bullets: entry.bullets.filter((bullet) => bullet.id !== bulletId),
});

export const addCertification = (document: ResumeDocument): ResumeDocument => ({
  ...document,
  certifications: [...document.certifications, createEmptyCertification()],
});

export const updateCertification = (
  document: ResumeDocument,
  entryId: string,
  entry: CertificationEntry
): ResumeDocument => ({
  ...document,
  certifications: document.certifications.map((item) =>
    item.id === entryId ? entry : item
  ),
});

export const removeCertification = (
  document: ResumeDocument,
  entryId: string
): ResumeDocument => ({
  ...document,
  certifications: document.certifications.filter((item) => item.id !== entryId),
});

export const reorderCertifications = (
  document: ResumeDocument,
  activeId: string,
  overId: string
): ResumeDocument => ({
  ...document,
  certifications: reorderEntries(document.certifications, activeId, overId),
});

export const toggleCertificationVisibility = (
  document: ResumeDocument,
  entryId: string
): ResumeDocument => ({
  ...document,
  certifications: toggleEntryVisibility(document.certifications, entryId),
});

export const addCustomSection = (
  document: ResumeDocument,
  title = "Custom section"
): ResumeDocument => {
  const section = createEmptyCustomSection(title);

  return {
    ...document,
    customSections: [...document.customSections, section],
    sectionOrder: [...document.sectionOrder, section.id],
    sectionVisibility: {
      ...document.sectionVisibility,
      [section.id]: true,
    },
  };
};

export const updateCustomSection = (
  document: ResumeDocument,
  sectionId: string,
  section: CustomSection
): ResumeDocument => ({
  ...document,
  customSections: document.customSections.map((item) =>
    item.id === sectionId ? section : item
  ),
});

export const addCustomSectionEntry = (
  document: ResumeDocument,
  sectionId: string
): ResumeDocument => ({
  ...document,
  customSections: document.customSections.map((section) =>
    section.id === sectionId
      ? {
          ...section,
          entries: [...section.entries, createEmptyCustomSectionEntry()],
        }
      : section
  ),
});

export const updateCustomSectionEntry = (
  document: ResumeDocument,
  sectionId: string,
  entryId: string,
  entry: CustomSectionEntry
): ResumeDocument => ({
  ...document,
  customSections: document.customSections.map((section) =>
    section.id === sectionId
      ? {
          ...section,
          entries: section.entries.map((item) =>
            item.id === entryId ? entry : item
          ),
        }
      : section
  ),
});

export const reorderCustomSectionEntries = (
  section: CustomSection,
  activeId: string,
  overId: string
): CustomSection => {
  const oldIndex = section.entries.findIndex((entry) => entry.id === activeId);
  const newIndex = section.entries.findIndex((entry) => entry.id === overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return section;
  }

  return {
    ...section,
    entries: arrayMove(section.entries, oldIndex, newIndex),
  };
};

export const toggleCustomSectionEntryVisibility = (
  section: CustomSection,
  entryId: string
): CustomSection => ({
  ...section,
  entries: toggleEntryVisibility(section.entries, entryId),
});

export const reorderCustomEntryBullets = (
  entry: CustomSectionEntry,
  activeId: string,
  overId: string
): CustomSectionEntry => {
  const oldIndex = entry.bullets.findIndex((bullet) => bullet.id === activeId);
  const newIndex = entry.bullets.findIndex((bullet) => bullet.id === overId);

  if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
    return entry;
  }

  return {
    ...entry,
    bullets: arrayMove(entry.bullets, oldIndex, newIndex),
  };
};

export const addCustomEntryBullet = (
  entry: CustomSectionEntry
): CustomSectionEntry => ({
  ...entry,
  bullets: [...entry.bullets, createEmptyBullet()],
});

export const removeCustomEntryBullet = (
  entry: CustomSectionEntry,
  bulletId: string
): CustomSectionEntry => ({
  ...entry,
  bullets: entry.bullets.filter((bullet) => bullet.id !== bulletId),
});

export const documentsAreEqual = (
  left: ResumeDocument,
  right: ResumeDocument
) => JSON.stringify(left) === JSON.stringify(right);

export const createSkillFromInput = (value: string) => value.trim();

export const parseSkillsInput = (value: string) =>
  value
    .split(",")
    .map(createSkillFromInput)
    .filter((skill) => skill.length > 0);

export const formatSkillsInput = (skills: string[]) => skills.join(", ");

export const newSkillId = () => createResumeId();
