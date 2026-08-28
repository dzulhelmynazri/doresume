"use client";

import type {
  ResumeAlignment,
  ResumeDocument,
  ResumeFontFamily,
  ResumeFontSize,
  ResumeProfile,
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
import { ResumeProfileSelector } from "./resume-profile-selector";
import { SectionsPopover } from "./sections-popover";

interface ResumeToolbarProps {
  activeProfile: ResumeProfile;
  document: ResumeDocument;
  isDirty: boolean;
  isSaving: boolean;
  onAddProfile: () => void | Promise<void>;
  onCancel: () => void;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  onDeleteProfile: (profileId: string) => void | Promise<void>;
  onRenameProfile: (profileId: string, name: string) => void | Promise<void>;
  onSave: () => void;
  onSwitchProfile: (profileId: string) => void | Promise<void>;
  onToggleStarred: (profileId: string) => void | Promise<void>;
  profileCount: number;
  profiles: ResumeProfile[];
}

const FONT_FAMILY_LABELS: Record<ResumeFontFamily, string> = {
  courier: "Courier",
  helvetica: "Helvetica",
  times: "Times New Roman",
};

export const ResumeToolbar = ({
  activeProfile,
  document,
  isDirty,
  isSaving,
  onAddProfile,
  onCancel,
  onChange,
  onDeleteProfile,
  onRenameProfile,
  onSave,
  onSwitchProfile,
  onToggleStarred,
  profileCount,
  profiles,
}: ResumeToolbarProps) => (
  <div className="flex w-full min-w-0 items-center gap-2 overflow-x-auto">
    <div className="flex shrink-0 items-center gap-2">
      <ResumeProfileSelector
        activeProfile={activeProfile}
        canDelete={profileCount > 1}
        onAddProfile={onAddProfile}
        onDeleteProfile={onDeleteProfile}
        onRenameProfile={onRenameProfile}
        onSwitchProfile={onSwitchProfile}
        onToggleStarred={onToggleStarred}
        profiles={profiles}
      />
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
    </div>

    <div className="ml-auto flex shrink-0 items-center gap-2">
      <Button
        disabled={!isDirty || isSaving}
        onClick={onCancel}
        size="sm"
        type="button"
        variant="outline"
      >
        Cancel
      </Button>
      <Button
        disabled={!isDirty || isSaving}
        onClick={onSave}
        size="sm"
        type="button"
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  </div>
);
