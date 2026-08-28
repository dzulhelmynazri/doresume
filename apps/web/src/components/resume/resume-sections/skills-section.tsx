"use client";

import type { ResumeDocument } from "@doresume/contracts";
import { Textarea } from "@doresume/ui/components/textarea";
import { useState } from "react";

import {
  formatSkillsInput,
  parseSkillsInput,
  updateSkills,
} from "../lib/resume-actions";

interface SkillsSectionProps {
  document: ResumeDocument;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  showHeading?: boolean;
}

export const SkillsSection = ({
  document,
  onChange,
  showHeading = true,
}: SkillsSectionProps) => {
  const [inputValue, setInputValue] = useState(() =>
    formatSkillsInput(document.skills)
  );

  return (
    <section className="flex flex-col gap-2">
      {showHeading ? (
        <h2 className="border-foreground/20 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
          Skills
        </h2>
      ) : null}
      <Textarea
        className="min-h-20 resize-y border-none bg-transparent p-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
        onBlur={() => {
          const normalized = formatSkillsInput(parseSkillsInput(inputValue));
          setInputValue(normalized);
          onChange((current) =>
            updateSkills(current, parseSkillsInput(normalized))
          );
        }}
        onChange={(event) => {
          const { value } = event.target;
          setInputValue(value);
          onChange((current) => updateSkills(current, parseSkillsInput(value)));
        }}
        placeholder="TypeScript, React, Next.js, PostgreSQL..."
        value={inputValue}
      />
      <p className="text-muted-foreground text-xs">
        Separate skills with commas.
      </p>
    </section>
  );
};
