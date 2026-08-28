"use client";

import type {
  ResumeAlignment,
  ResumeDocument,
  ResumeFontFamily,
  ResumeFontSize,
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
import { AlignJustifyIcon, AlignLeftIcon } from "lucide-react";

import { updateSettings } from "./lib/resume-actions";
import { SectionsPopover } from "./sections-popover";

interface ResumeToolbarProps {
  document: ResumeDocument;
  isDirty: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  onSave: () => void;
}

const FONT_FAMILY_LABELS: Record<ResumeFontFamily, string> = {
  courier: "Courier",
  helvetica: "Helvetica",
  times: "Times New Roman",
};

export const ResumeToolbar = ({
  document,
  isDirty,
  isSaving,
  onCancel,
  onChange,
  onSave,
}: ResumeToolbarProps) => (
  <div className="flex w-full flex-wrap items-center justify-between gap-3">
    <div className="flex flex-wrap items-center gap-2">
      <SectionsPopover document={document} onChange={onChange} />

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
        <SelectTrigger>
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
        <SelectTrigger>
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
    </div>

    <div className="flex items-center gap-2">
      <Button
        disabled={!isDirty || isSaving}
        onClick={onCancel}
        type="button"
        variant="outline"
      >
        Cancel
      </Button>
      <Button disabled={!isDirty || isSaving} onClick={onSave} type="button">
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  </div>
);
