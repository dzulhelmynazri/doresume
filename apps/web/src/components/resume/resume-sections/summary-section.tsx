"use client";

import type { ResumeDocument } from "@doresume/contracts";

import { updateSummary } from "../lib/resume-actions";
import { ResumeTextEditor } from "../resume-text-editor";

interface SummarySectionProps {
  document: ResumeDocument;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  showHeading?: boolean;
}

export const SummarySection = ({
  document,
  onChange,
  showHeading = true,
}: SummarySectionProps) => (
  <section className="flex flex-col gap-2">
    {showHeading ? (
      <h2 className="border-foreground/20 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
        Summary
      </h2>
    ) : null}
    <ResumeTextEditor
      className="min-h-24"
      onChange={(value) => {
        onChange((current) => updateSummary(current, value));
      }}
      placeholder="Write a short professional summary..."
      value={document.summary}
    />
  </section>
);
