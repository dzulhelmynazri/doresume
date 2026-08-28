"use client";

import type {
  ResumeAlignment,
  ResumeDocument,
  ResumeFontFamily,
  ResumeFontSize,
  ResumeTemplate,
} from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@doresume/ui/components/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@doresume/ui/components/toggle-group";
import { AlignJustifyIcon, AlignLeftIcon, DownloadIcon } from "lucide-react";

import { updateSettings } from "./lib/resume-actions";
import { ResumePreviewDisplay } from "./resume-preview-display";

interface ResumePreviewToolbarProps {
  document: ResumeDocument;
  isExporting: boolean;
  isSaving: boolean;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  onExport: () => void;
}

const FONT_FAMILY_LABELS: Record<ResumeFontFamily, string> = {
  courier: "Courier",
  helvetica: "Helvetica",
  times: "Times New Roman",
};

export const ResumePreviewToolbar = ({
  document,
  isExporting,
  isSaving,
  onChange,
  onExport,
}: ResumePreviewToolbarProps) => (
  <div className="flex w-full min-w-0 items-center justify-between gap-3 overflow-x-auto">
    <span className="shrink-0 text-sm font-medium">Preview</span>
    <div className="flex shrink-0 items-center gap-2">
      <Select
        items={Object.entries(FONT_FAMILY_LABELS).map(([value, label]) => ({
          label,
          value,
        }))}
        onValueChange={(value) => {
          if (!value) {
            return;
          }

          onChange((current) =>
            updateSettings(current, {
              fontFamily: value as ResumeFontFamily,
            })
          );
        }}
        value={document.settings.fontFamily}
      >
        <SelectTrigger className="w-[6.75rem]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(FONT_FAMILY_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={[
          { label: "10", value: "10" },
          { label: "11", value: "11" },
          { label: "12", value: "12" },
        ]}
        onValueChange={(value) => {
          if (!value) {
            return;
          }

          onChange((current) =>
            updateSettings(current, {
              fontSize: Number(value) as ResumeFontSize,
            })
          );
        }}
        value={String(document.settings.fontSize)}
      >
        <SelectTrigger className="w-14">
          <SelectValue className="flex-none" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="11">11</SelectItem>
          <SelectItem value="12">12</SelectItem>
        </SelectContent>
      </Select>

      <ToggleGroup
        onValueChange={([alignment]) => {
          if (!alignment) {
            return;
          }

          onChange((current) =>
            updateSettings(current, {
              alignment: alignment as ResumeAlignment,
            })
          );
        }}
        value={[document.settings.alignment]}
        variant="outline"
      >
        <ToggleGroupItem aria-label="Align left" value="left">
          <AlignLeftIcon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Justify text" value="justify">
          <AlignJustifyIcon className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>

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
        type="button"
      >
        <DownloadIcon data-icon="inline-start" />
        {isExporting ? "Exporting..." : "Download PDF"}
      </Button>
    </div>
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
