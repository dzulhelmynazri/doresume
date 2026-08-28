"use client";

import type { ResumeDocument, ResumeTemplate } from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@doresume/ui/components/toggle-group";
import { DownloadIcon } from "lucide-react";

import { updateSettings } from "./lib/resume-actions";
import { ResumePreviewDisplay } from "./resume-preview-display";

interface ResumePreviewToolbarProps {
  document: ResumeDocument;
  isExporting: boolean;
  isSaving: boolean;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  onExport: () => void;
}

export const ResumePreviewToolbar = ({
  document,
  isExporting,
  isSaving,
  onChange,
  onExport,
}: ResumePreviewToolbarProps) => (
  <div className="flex shrink-0 items-center gap-2">
    <span className="text-muted-foreground hidden text-xs font-medium sm:inline">
      Preview
    </span>
    <ToggleGroup
      onValueChange={([template]) => {
        if (!template) {
          return;
        }

        onChange((current) =>
          updateSettings(current, {
            template: template as ResumeTemplate,
          })
        );
      }}
      spacing={0}
      value={[document.settings.template]}
      variant="outline"
    >
      <ToggleGroupItem value="standard">Standard</ToggleGroupItem>
      <ToggleGroupItem value="jake">Jake</ToggleGroupItem>
    </ToggleGroup>
    <Button
      disabled={isExporting || isSaving}
      onClick={onExport}
      size="sm"
      type="button"
    >
      <DownloadIcon data-icon="inline-start" />
      {isExporting ? "Exporting..." : "Download PDF"}
    </Button>
  </div>
);

interface ResumePreviewPaneProps {
  document: ResumeDocument;
}

export const ResumePreviewPane = ({ document }: ResumePreviewPaneProps) => (
  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex justify-center p-2">
        <div className="w-full max-w-[8.5in]">
          <ResumePreviewDisplay document={document} />
        </div>
      </div>
    </div>
  </div>
);
