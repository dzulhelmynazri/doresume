"use client";

import type { CoverLetter, ResumeDocument } from "@doresume/contracts";
import { cn } from "@doresume/ui/lib/utils";

const FONT_FAMILY_STYLES: Record<
  ResumeDocument["settings"]["fontFamily"],
  string
> = {
  courier: '"Courier New", Courier, monospace',
  helvetica: "Helvetica, Arial, sans-serif",
  times: '"Times New Roman", Times, serif',
};

interface CoverLetterPreviewDisplayProps {
  coverLetter: CoverLetter;
  document: ResumeDocument;
}

export const CoverLetterPreviewDisplay = ({
  coverLetter,
  document,
}: CoverLetterPreviewDisplayProps) => {
  const { settings, header } = document;
  const { fontSize } = settings;
  const textAlign = settings.alignment === "justify" ? "justify" : "left";

  return (
    <article
      className={cn(
        "min-h-[11in] w-full rounded-md border bg-white p-[0.75in] text-black shadow-sm",
        textAlign === "justify" && "text-justify"
      )}
      style={{
        fontFamily: FONT_FAMILY_STYLES[settings.fontFamily],
        fontSize: `${fontSize}pt`,
        lineHeight: 1.4,
        textAlign,
      }}
    >
      <header className="mb-8 flex flex-col gap-1">
        {header.name ? (
          <p className="m-0 font-semibold">{header.name}</p>
        ) : null}
        {[header.email, header.phone, header.linkedin, header.location]
          .filter(Boolean)
          .map((line) => (
            <p className="m-0 text-neutral-600" key={line}>
              {line}
            </p>
          ))}
      </header>

      {coverLetter.salutation.trim() ? (
        <p className="mb-4">{coverLetter.salutation.trim()}</p>
      ) : null}

      <div className="flex flex-col gap-4">
        {coverLetter.body.trim() ? (
          <p className="m-0 whitespace-pre-wrap">{coverLetter.body}</p>
        ) : (
          <p className="m-0 text-neutral-500">
            Your cover letter preview will appear here.
          </p>
        )}
      </div>

      {header.name ? (
        <footer className="mt-8">
          <p className="m-0">Sincerely,</p>
          <p className="mt-4 mb-0">{header.name}</p>
        </footer>
      ) : null}
    </article>
  );
};
