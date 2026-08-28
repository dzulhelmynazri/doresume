"use client";

import type { ResumeDocument, ResumeProfile } from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";

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
  <div className="flex w-full min-w-0 items-center justify-between gap-2 overflow-x-auto">
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
    </div>

    <div className="flex shrink-0 items-center gap-2">
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
