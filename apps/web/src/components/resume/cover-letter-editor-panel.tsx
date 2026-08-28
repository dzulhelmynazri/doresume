"use client";

import type { CoverLetter } from "@doresume/contracts";
import { Input } from "@doresume/ui/components/input";
import { Label } from "@doresume/ui/components/label";
import { Textarea } from "@doresume/ui/components/textarea";

interface CoverLetterEditorPanelProps {
  coverLetter: CoverLetter;
  onChange: (updater: (current: CoverLetter) => CoverLetter) => void;
}

export const CoverLetterEditorPanel = ({
  coverLetter,
  onChange,
}: CoverLetterEditorPanelProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Label htmlFor="cover-letter-salutation">Salutation</Label>
      <Input
        id="cover-letter-salutation"
        onChange={(event) => {
          const salutation = event.target.value;
          onChange((current) => ({ ...current, salutation }));
        }}
        placeholder="Dear Hiring Manager,"
        value={coverLetter.salutation}
      />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="cover-letter-body">Letter</Label>
      <Textarea
        className="min-h-[24rem] resize-y"
        id="cover-letter-body"
        onChange={(event) => {
          const body = event.target.value;
          onChange((current) => ({ ...current, body }));
        }}
        placeholder="Write your cover letter..."
        value={coverLetter.body ?? ""}
      />
    </div>
  </div>
);
