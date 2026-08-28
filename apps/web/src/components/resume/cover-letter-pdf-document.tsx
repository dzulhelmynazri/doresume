import type { CoverLetter, ResumeDocument } from "@doresume/contracts";
import { Section } from "@doresume/ui/components/pdf/section/section";
import { Text } from "@doresume/ui/components/pdf/text/text";
import { PdfcnThemeProvider } from "@doresume/ui/components/pdf/theme-provider";
import { Document, Page } from "@doresume/ui/lib/pdf-primitives";

import { createResumePdfTheme } from "./lib/resume-pdf-theme";

interface CoverLetterPdfDocumentProps {
  coverLetter: CoverLetter;
  document: ResumeDocument;
}

const getTextAlign = (
  alignment: ResumeDocument["settings"]["alignment"]
): "left" | "justify" => (alignment === "justify" ? "justify" : "left");

const renderBodyParagraphs = (body: string, textAlign: "left" | "justify") => {
  if (!body.trim()) {
    return null;
  }

  return body.split(/\n{2,}/u).map((paragraph) => (
    <Text align={textAlign} key={paragraph} noMargin>
      {paragraph}
    </Text>
  ));
};

export const CoverLetterPdfDocument = ({
  coverLetter,
  document,
}: CoverLetterPdfDocumentProps) => {
  const theme = createResumePdfTheme(document);
  const textAlign = getTextAlign(document.settings.alignment);
  const contact = [
    document.header.email,
    document.header.phone,
    document.header.linkedin,
    document.header.location,
  ].filter(Boolean);

  return (
    <Document title={`${document.header.name || "Cover"} Letter`}>
      <Page size="LETTER">
        <PdfcnThemeProvider theme={theme}>
          <Section padding="lg" spacing="md">
            {document.header.name ? (
              <Text noMargin weight="semibold">
                {document.header.name}
              </Text>
            ) : null}
            {contact.map((line) => (
              <Text key={line} noMargin variant="sm">
                {line}
              </Text>
            ))}

            {coverLetter.salutation.trim() ? (
              <Text noMargin>{coverLetter.salutation.trim()}</Text>
            ) : null}

            {renderBodyParagraphs(coverLetter.body, textAlign) ?? (
              <Text align={textAlign} noMargin>
                {coverLetter.body.trim()}
              </Text>
            )}

            {document.header.name ? (
              <Section spacing="sm">
                <Text noMargin>Sincerely,</Text>
                <Text noMargin>{document.header.name}</Text>
              </Section>
            ) : null}
          </Section>
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
};
