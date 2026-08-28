"use client";

import type {
  CoverLetter,
  ProfileDocumentType,
  ResumeAlignment,
  ResumeDocument,
  ResumeFontFamily,
  ResumeFontSize,
  ResumeTemplate,
} from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@doresume/ui/components/dropdown-menu";
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
import { cn } from "@doresume/ui/lib/utils";
import {
  AlignJustifyIcon,
  AlignLeftIcon,
  ChevronDownIcon,
  DownloadIcon,
} from "lucide-react";

import { CoverLetterPreviewDisplay } from "./cover-letter-preview-display";
import { updateSettings } from "./lib/resume-actions";
import { ResumePreviewDisplay } from "./resume-preview-display";

interface ResumePreviewToolbarProps {
  document: ResumeDocument;
  documentType: ProfileDocumentType;
  isExporting: boolean;
  isSaving: boolean;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  onDocumentTypeChange: (documentType: ProfileDocumentType) => void;
  onExport: () => void;
}

const FONT_FAMILY_LABELS: Record<ResumeFontFamily, string> = {
  courier: "Courier",
  helvetica: "Helvetica",
  times: "Times New Roman",
};

const DOCUMENT_TYPE_LABELS: Record<ProfileDocumentType, string> = {
  "cover-letter": "Cover letter",
  resume: "Resume",
};

export const ResumePreviewToolbar = ({
  document,
  documentType,
  isExporting,
  isSaving,
  onChange,
  onDocumentTypeChange,
  onExport,
}: ResumePreviewToolbarProps) => {
  const isCoverLetter = documentType === "cover-letter";

  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-3 overflow-x-auto">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="h-7 w-[8.5rem] justify-between gap-1 px-2 font-normal"
            />
          }
        >
          <span className="truncate">{DOCUMENT_TYPE_LABELS[documentType]}</span>
          <ChevronDownIcon className="text-muted-foreground size-3.5 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[8.5rem]">
          {(Object.keys(DOCUMENT_TYPE_LABELS) as ProfileDocumentType[]).map(
            (value) => (
              <DropdownMenuItem
                key={value}
                className={cn(documentType === value && "bg-muted font-medium")}
                onClick={() => {
                  onDocumentTypeChange(value);
                }}
              >
                {DOCUMENT_TYPE_LABELS[value]}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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

        {isCoverLetter ? null : (
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
        )}

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
};

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

interface CoverLetterPreviewPaneProps {
  coverLetter: CoverLetter;
  document: ResumeDocument;
}

export const CoverLetterPreviewPane = ({
  coverLetter,
  document,
}: CoverLetterPreviewPaneProps) => (
  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex justify-center p-2">
        <div className="w-full max-w-[8.5in]">
          <CoverLetterPreviewDisplay
            coverLetter={coverLetter}
            document={document}
          />
        </div>
      </div>
    </div>
  </div>
);
