import type { ResumeDocument, ResumeSectionId } from "@doresume/contracts";
import {
  getCustomSection,
  getSectionTitle,
  getVisibleSectionIds,
  hasCustomSectionContent,
  hasCustomSectionEntryContent,
  isBuiltInSectionId,
  isEntryVisible,
  RESUME_SECTION_LABELS,
} from "@doresume/contracts";
import { Heading } from "@doresume/ui/components/pdf/heading/heading";
import { KeepTogether } from "@doresume/ui/components/pdf/keep-together/keep-together";
import { PdfList } from "@doresume/ui/components/pdf/list/list";
import { Section } from "@doresume/ui/components/pdf/section/section";
import { Text } from "@doresume/ui/components/pdf/text/text";
import { PdfcnThemeProvider } from "@doresume/ui/components/pdf/theme-provider";
import { Document, Page } from "@doresume/ui/lib/pdf-primitives";
import type { ReactNode } from "react";

import { createResumePdfTheme } from "./lib/resume-pdf-theme";

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

const SectionHeading = ({
  document,
  children,
}: {
  document: ResumeDocument;
  children: ReactNode;
}) =>
  document.settings.template === "jake" ? (
    <Heading align="center" level={2} tracking="wider" transform="uppercase">
      {children}
    </Heading>
  ) : (
    <Heading level={2}>{children}</Heading>
  );

const HeaderBlock = ({ document }: { document: ResumeDocument }) => {
  const contact = [
    document.header.email,
    document.header.phone,
    document.header.linkedin,
    document.header.location,
  ].filter(Boolean);

  return (
    <Section spacing="sm">
      <Heading align="center" level={1} noMargin>
        {document.header.name}
      </Heading>
      {document.header.title ? (
        <Text align="center" noMargin variant="lg">
          {document.header.title}
        </Text>
      ) : null}
      {contact.length > 0 ? (
        <Text align="center" noMargin variant="sm">
          {contact.join(" | ")}
        </Text>
      ) : null}
    </Section>
  );
};

const SummaryBlock = ({ document }: { document: ResumeDocument }) =>
  document.summary.trim().length > 0 ? (
    <Section spacing="md">
      <SectionHeading document={document}>
        {RESUME_SECTION_LABELS.summary}
      </SectionHeading>
      <Text>{document.summary}</Text>
    </Section>
  ) : null;

const EducationBlock = ({ document }: { document: ResumeDocument }) => {
  const entries = document.education.filter(isEntryVisible);

  return entries.length > 0 ? (
    <Section spacing="md">
      <SectionHeading document={document}>
        {RESUME_SECTION_LABELS.education}
      </SectionHeading>
      {entries.map((entry) => (
        <KeepTogether key={entry.id}>
          <Text weight="semibold">
            {[entry.degree, entry.school].filter(Boolean).join(" — ")}
          </Text>
          <Text noMargin variant="sm">
            {[formatDateRange(entry.startDate, entry.endDate), entry.location]
              .filter(Boolean)
              .join(" | ")}
          </Text>
          {entry.bullets.some((bullet) => bullet.text.trim().length > 0) ? (
            <PdfList
              gap="xs"
              items={entry.bullets
                .filter((bullet) => bullet.text.trim().length > 0)
                .map((bullet) => ({ text: bullet.text }))}
              variant="bullet"
            />
          ) : null}
        </KeepTogether>
      ))}
    </Section>
  ) : null;
};

const SkillsBlock = ({ document }: { document: ResumeDocument }) =>
  document.skills.length > 0 ? (
    <Section spacing="md">
      <SectionHeading document={document}>
        {RESUME_SECTION_LABELS.skills}
      </SectionHeading>
      <Text>{document.skills.join(", ")}</Text>
    </Section>
  ) : null;

const WorkExperienceBlock = ({ document }: { document: ResumeDocument }) => {
  const entries = document.workExperience.filter(isEntryVisible);

  return entries.length > 0 ? (
    <Section spacing="md">
      <SectionHeading document={document}>
        {RESUME_SECTION_LABELS.workExperience}
      </SectionHeading>
      {entries.map((entry) => (
        <KeepTogether key={entry.id}>
          <Text weight="semibold">
            {[entry.title, entry.company].filter(Boolean).join(" — ")}
          </Text>
          <Text noMargin variant="sm">
            {[formatDateRange(entry.startDate, entry.endDate), entry.location]
              .filter(Boolean)
              .join(" | ")}
          </Text>
          {entry.bullets.some((bullet) => bullet.text.trim().length > 0) ? (
            <PdfList
              gap="xs"
              items={entry.bullets
                .filter((bullet) => bullet.text.trim().length > 0)
                .map((bullet) => ({ text: bullet.text }))}
              variant="bullet"
            />
          ) : null}
        </KeepTogether>
      ))}
    </Section>
  ) : null;
};

const ProjectsBlock = ({ document }: { document: ResumeDocument }) => {
  const entries = document.projects.filter(isEntryVisible);

  return entries.length > 0 ? (
    <Section spacing="md">
      <SectionHeading document={document}>
        {RESUME_SECTION_LABELS.projects}
      </SectionHeading>
      {entries.map((entry) => (
        <KeepTogether key={entry.id}>
          <Text weight="semibold">{entry.name}</Text>
          {formatDateRange(entry.startDate, entry.endDate) || entry.url ? (
            <Text noMargin variant="sm">
              {[formatDateRange(entry.startDate, entry.endDate), entry.url]
                .filter(Boolean)
                .join(" | ")}
            </Text>
          ) : null}
          {entry.bullets.some((bullet) => bullet.text.trim().length > 0) ? (
            <PdfList
              gap="xs"
              items={entry.bullets
                .filter((bullet) => bullet.text.trim().length > 0)
                .map((bullet) => ({ text: bullet.text }))}
              variant="bullet"
            />
          ) : null}
        </KeepTogether>
      ))}
    </Section>
  ) : null;
};

const CertificationsBlock = ({ document }: { document: ResumeDocument }) => {
  const entries = document.certifications.filter(isEntryVisible);

  return entries.length > 0 ? (
    <Section spacing="md">
      <SectionHeading document={document}>
        {RESUME_SECTION_LABELS.certifications}
      </SectionHeading>
      <PdfList
        gap="xs"
        items={entries.map((entry) => ({
          text: [entry.name, entry.issuer, entry.date]
            .filter(Boolean)
            .join(" — "),
        }))}
        variant="bullet"
      />
    </Section>
  ) : null;
};

const CustomSectionBlock = ({
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
    <Section spacing="md">
      <SectionHeading document={document}>
        {getSectionTitle(document, sectionId)}
      </SectionHeading>
      {section.entries
        .filter(isEntryVisible)
        .filter(hasCustomSectionEntryContent)
        .map((entry) => (
          <KeepTogether key={entry.id}>
            {entry.name?.trim() ? (
              <Text weight="semibold">{entry.name}</Text>
            ) : null}
            {formatDateRange(entry.startDate, entry.endDate) ||
            entry.location?.trim() ? (
              <Text noMargin variant="sm">
                {[
                  formatDateRange(entry.startDate, entry.endDate),
                  entry.location,
                ]
                  .filter(Boolean)
                  .join(" | ")}
              </Text>
            ) : null}
            {entry.bullets.some((bullet) => bullet.text.trim().length > 0) ? (
              <PdfList
                gap="xs"
                items={entry.bullets
                  .filter((bullet) => bullet.text.trim().length > 0)
                  .map((bullet) => ({ text: bullet.text }))}
                variant="bullet"
              />
            ) : null}
          </KeepTogether>
        ))}
    </Section>
  );
};

const SECTION_BLOCKS: Record<
  ResumeSectionId,
  (props: { document: ResumeDocument }) => ReactNode
> = {
  certifications: CertificationsBlock,
  education: EducationBlock,
  projects: ProjectsBlock,
  skills: SkillsBlock,
  summary: SummaryBlock,
  workExperience: WorkExperienceBlock,
};

export const ResumePdfDocument = ({
  document,
}: {
  document: ResumeDocument;
}) => {
  const visibleSections = getVisibleSectionIds(document);
  const theme = createResumePdfTheme(document);

  return (
    <Document title={`${document.header.name} Resume`}>
      <Page size="LETTER">
        <PdfcnThemeProvider theme={theme}>
          <Section spacing="none">
            <HeaderBlock document={document} />
            {visibleSections.map((sectionId) => {
              if (isBuiltInSectionId(sectionId)) {
                const Block = SECTION_BLOCKS[sectionId];
                return <Block document={document} key={sectionId} />;
              }

              return (
                <CustomSectionBlock
                  document={document}
                  key={sectionId}
                  sectionId={sectionId}
                />
              );
            })}
          </Section>
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
};
