"use client";

import type { ResumeDocument, ResumeSectionId } from "@doresume/contracts";
import {
  getCustomSection,
  getSectionTitle,
  hasCustomSectionContent,
  hasCustomSectionEntryContent,
  isBuiltInSectionId,
  isEntryVisible,
  RESUME_SECTION_LABELS,
} from "@doresume/contracts";
import { cn } from "@doresume/ui/lib/utils";
import type { ReactNode } from "react";

import { getVisibleSections } from "./sections-popover";

const FONT_FAMILY_STYLES: Record<
  ResumeDocument["settings"]["fontFamily"],
  string
> = {
  courier: '"Courier New", Courier, monospace',
  helvetica: "Helvetica, Arial, sans-serif",
  times: '"Times New Roman", Times, serif',
};

const TEMPLATE_CLASSES = {
  jake: "[&_h2]:text-center [&_h2]:uppercase [&_h2]:tracking-[0.2em]",
  standard: "",
} as const;

const formatDateRange = (start?: string, end?: string) => {
  if (!start && !end) {
    return "";
  }

  if (!start) {
    return end ?? "";
  }

  if (!end) {
    return start;
  }

  return `${start} – ${end}`;
};

const PreviewHeader = ({ document }: { document: ResumeDocument }) => {
  const contact = [
    document.header.email,
    document.header.phone,
    document.header.linkedin,
    document.header.location,
  ].filter(Boolean);

  return (
    <header className="flex flex-col gap-1 text-center">
      {document.header.name ? (
        <h1 className="text-2xl font-semibold">{document.header.name}</h1>
      ) : null}
      {document.header.title ? (
        <p className="text-sm">{document.header.title}</p>
      ) : null}
      {contact.length > 0 ? (
        <p className="text-xs opacity-80">{contact.join(" | ")}</p>
      ) : null}
    </header>
  );
};

const PreviewSummary = ({ document }: { document: ResumeDocument }) =>
  document.summary.trim().length > 0 ? (
    <section>
      <h2 className="mb-2 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
        {RESUME_SECTION_LABELS.summary}
      </h2>
      <p className="whitespace-pre-wrap">{document.summary}</p>
    </section>
  ) : null;

const PreviewEducation = ({ document }: { document: ResumeDocument }) =>
  document.education.length > 0 ? (
    <section>
      <h2 className="mb-2 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
        {RESUME_SECTION_LABELS.education}
      </h2>
      <div className="flex flex-col gap-3">
        {document.education.filter(isEntryVisible).map((entry) => (
          <div key={entry.id}>
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold">
                {[entry.degree, entry.school].filter(Boolean).join(" — ")}
              </p>
              <p className="shrink-0 text-sm opacity-80">
                {formatDateRange(entry.startDate, entry.endDate)}
              </p>
            </div>
            {entry.location ? (
              <p className="text-sm opacity-80">{entry.location}</p>
            ) : null}
            {entry.bullets.some((bullet) => bullet.text.trim().length > 0) ? (
              <ul className="mt-1 list-disc pl-5">
                {entry.bullets
                  .filter((bullet) => bullet.text.trim().length > 0)
                  .map((bullet) => (
                    <li className="whitespace-pre-wrap" key={bullet.id}>
                      {bullet.text}
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  ) : null;

const PreviewSkills = ({ document }: { document: ResumeDocument }) =>
  document.skills.length > 0 ? (
    <section>
      <h2 className="mb-2 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
        {RESUME_SECTION_LABELS.skills}
      </h2>
      <p>{document.skills.join(", ")}</p>
    </section>
  ) : null;

const PreviewWorkExperience = ({ document }: { document: ResumeDocument }) =>
  document.workExperience.length > 0 ? (
    <section>
      <h2 className="mb-2 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
        {RESUME_SECTION_LABELS.workExperience}
      </h2>
      <div className="flex flex-col gap-3">
        {document.workExperience.filter(isEntryVisible).map((entry) => (
          <div key={entry.id}>
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold">
                {[entry.title, entry.company].filter(Boolean).join(" — ")}
              </p>
              <p className="shrink-0 text-sm opacity-80">
                {formatDateRange(entry.startDate, entry.endDate)}
              </p>
            </div>
            {entry.location ? (
              <p className="text-sm opacity-80">{entry.location}</p>
            ) : null}
            {entry.bullets.some((bullet) => bullet.text.trim().length > 0) ? (
              <ul className="mt-1 list-disc pl-5">
                {entry.bullets
                  .filter((bullet) => bullet.text.trim().length > 0)
                  .map((bullet) => (
                    <li className="whitespace-pre-wrap" key={bullet.id}>
                      {bullet.text}
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  ) : null;

const PreviewProjects = ({ document }: { document: ResumeDocument }) =>
  document.projects.length > 0 ? (
    <section>
      <h2 className="mb-2 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
        {RESUME_SECTION_LABELS.projects}
      </h2>
      <div className="flex flex-col gap-3">
        {document.projects.filter(isEntryVisible).map((entry) => (
          <div key={entry.id}>
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold">{entry.name}</p>
              {formatDateRange(entry.startDate, entry.endDate) ? (
                <p className="shrink-0 text-sm opacity-80">
                  {formatDateRange(entry.startDate, entry.endDate)}
                </p>
              ) : null}
            </div>
            {entry.url ? (
              <p className="text-sm opacity-80">{entry.url}</p>
            ) : null}
            {entry.bullets.some((bullet) => bullet.text.trim().length > 0) ? (
              <ul className="mt-1 list-disc pl-5">
                {entry.bullets
                  .filter((bullet) => bullet.text.trim().length > 0)
                  .map((bullet) => (
                    <li className="whitespace-pre-wrap" key={bullet.id}>
                      {bullet.text}
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  ) : null;

const PreviewCertifications = ({ document }: { document: ResumeDocument }) =>
  document.certifications.length > 0 ? (
    <section>
      <h2 className="mb-2 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
        {RESUME_SECTION_LABELS.certifications}
      </h2>
      <ul className="list-disc pl-5">
        {document.certifications.filter(isEntryVisible).map((entry) => (
          <li key={entry.id}>
            {[entry.name, entry.issuer, entry.date].filter(Boolean).join(" — ")}
          </li>
        ))}
      </ul>
    </section>
  ) : null;

const PreviewCustomSection = ({
  document,
  sectionId,
}: {
  document: ResumeDocument;
  sectionId: string;
}) => {
  const section = getCustomSection(document, sectionId);

  if (!section || !hasCustomSectionContent(section)) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-2 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
        {getSectionTitle(document, sectionId)}
      </h2>
      <div className="flex flex-col gap-3">
        {section.entries
          .filter(isEntryVisible)
          .filter(hasCustomSectionEntryContent)
          .map((entry) => (
            <div key={entry.id}>
              <div className="flex items-start justify-between gap-4">
                {entry.name?.trim() ? (
                  <p className="font-semibold">{entry.name}</p>
                ) : null}
                {formatDateRange(entry.startDate, entry.endDate) ? (
                  <p className="shrink-0 text-sm opacity-80">
                    {formatDateRange(entry.startDate, entry.endDate)}
                  </p>
                ) : null}
              </div>
              {entry.location?.trim() ? (
                <p className="text-sm opacity-80">{entry.location}</p>
              ) : null}
              {entry.bullets.some((bullet) => bullet.text.trim().length > 0) ? (
                <ul className="mt-1 list-disc pl-5">
                  {entry.bullets
                    .filter((bullet) => bullet.text.trim().length > 0)
                    .map((bullet) => (
                      <li className="whitespace-pre-wrap" key={bullet.id}>
                        {bullet.text}
                      </li>
                    ))}
                </ul>
              ) : null}
            </div>
          ))}
      </div>
    </section>
  );
};

const SECTION_COMPONENTS: Record<
  ResumeSectionId,
  (props: { document: ResumeDocument }) => ReactNode
> = {
  certifications: PreviewCertifications,
  education: PreviewEducation,
  projects: PreviewProjects,
  skills: PreviewSkills,
  summary: PreviewSummary,
  workExperience: PreviewWorkExperience,
};

export const ResumePreviewDisplay = ({
  document,
}: {
  document: ResumeDocument;
}) => {
  const visibleSections = getVisibleSections(document);

  return (
    <div
      className={cn(
        "min-h-[11in] w-full rounded-md border bg-white p-8 text-black",
        TEMPLATE_CLASSES[document.settings.template],
        document.settings.alignment === "justify" && "text-justify"
      )}
      style={{
        fontFamily: FONT_FAMILY_STYLES[document.settings.fontFamily],
        fontSize: `${document.settings.fontSize}pt`,
        lineHeight: 1.35,
      }}
    >
      <div className="flex flex-col gap-6">
        <PreviewHeader document={document} />
        {visibleSections.map((sectionId) => {
          if (isBuiltInSectionId(sectionId)) {
            const Section = SECTION_COMPONENTS[sectionId];
            return <Section document={document} key={sectionId} />;
          }

          return (
            <PreviewCustomSection
              document={document}
              key={sectionId}
              sectionId={sectionId}
            />
          );
        })}
      </div>
    </div>
  );
};
