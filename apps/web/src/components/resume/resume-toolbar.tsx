"use client";

import type { DocumentBundle, ResumeDocument } from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";

import { DocumentSelector } from "./document-selector";
import { SectionsPopover } from "./sections-popover";

interface ResumeToolbarProps {
  activeDocument: DocumentBundle;
  document: ResumeDocument;
  documentCount: number;
  documents: DocumentBundle[];
  isDirty: boolean;
  isSaving: boolean;
  onAddDocument: () => void | Promise<void>;
  onCancel: () => void;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  onDeleteDocument: (documentId: string) => void | Promise<void>;
  onRenameDocument: (documentId: string, name: string) => void | Promise<void>;
  onSave: () => void;
  onSwitchDocument: (documentId: string) => void | Promise<void>;
  onToggleStarred: (documentId: string) => void | Promise<void>;
  showSections?: boolean;
}

export const ResumeToolbar = ({
  activeDocument,
  document,
  documentCount,
  documents,
  isDirty,
  isSaving,
  onAddDocument,
  onCancel,
  onChange,
  onDeleteDocument,
  onRenameDocument,
  onSave,
  onSwitchDocument,
  onToggleStarred,
  showSections = true,
}: ResumeToolbarProps) => (
  <div className="flex w-full min-w-0 items-center justify-between gap-2 overflow-x-auto">
    <div className="flex shrink-0 items-center gap-2">
      <DocumentSelector
        activeDocument={activeDocument}
        canDelete={documentCount > 1}
        documents={documents}
        onAddDocument={onAddDocument}
        onDeleteDocument={onDeleteDocument}
        onRenameDocument={onRenameDocument}
        onSwitchDocument={onSwitchDocument}
        onToggleStarred={onToggleStarred}
      />
      {showSections ? (
        <SectionsPopover document={document} onChange={onChange} />
      ) : null}
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
