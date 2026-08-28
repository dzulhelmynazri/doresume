"use client";

import type {
  ProfileDocumentType,
  ResumeProfilesState,
} from "@doresume/contracts";
import { useState } from "react";

import { CoverLetterEditorPanel } from "./cover-letter-editor-panel";
import { useResumeProfiles } from "./hooks/use-resume-profiles";
import { ResumeEditorPanel } from "./resume-editor-panel";
import {
  CoverLetterPreviewPane,
  ResumePreviewPane,
  ResumePreviewToolbar,
} from "./resume-preview-pane";
import { ResumeToolbar } from "./resume-toolbar";

export const ResumeEditor = ({
  initialProfiles,
}: {
  initialProfiles: ResumeProfilesState;
}) => {
  const [documentType, setDocumentType] =
    useState<ProfileDocumentType>("resume");
  const isCoverLetter = documentType === "cover-letter";

  const {
    activeProfile,
    addProfile,
    cancel,
    coverLetter,
    deleteProfile,
    document,
    exportPdf,
    isDirty,
    isExporting,
    isSaving,
    profiles,
    renameProfile,
    resetKey,
    save,
    switchProfile,
    toggleStarred,
    updateCoverLetter,
    updateDocument,
  } = useResumeProfiles(initialProfiles);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-border/60 sticky top-0 z-10 shrink-0 border-b">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="border-border/60 bg-background flex min-w-0 items-center px-4 py-2 lg:w-1/2 lg:border-r">
            <ResumeToolbar
              activeProfile={activeProfile}
              document={document}
              isDirty={isDirty}
              isSaving={isSaving}
              onAddProfile={addProfile}
              onCancel={cancel}
              onChange={updateDocument}
              onDeleteProfile={deleteProfile}
              onRenameProfile={renameProfile}
              onSave={() => {
                void save();
              }}
              onSwitchProfile={switchProfile}
              onToggleStarred={toggleStarred}
              profileCount={profiles.profiles.length}
              profiles={profiles.profiles}
              showSections={!isCoverLetter}
            />
          </div>
          <div className="border-border/60 bg-background flex min-w-0 items-center border-t px-4 py-2 lg:w-1/2 lg:border-t-0">
            <ResumePreviewToolbar
              document={document}
              documentType={documentType}
              isExporting={isExporting}
              isSaving={isSaving}
              onChange={updateDocument}
              onDocumentTypeChange={setDocumentType}
              onExport={() => {
                void exportPdf(documentType);
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="bg-muted/40 dark:bg-background flex min-h-0 w-full flex-col overflow-hidden lg:w-1/2">
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <div className="mx-auto w-full">
              {isCoverLetter ? (
                <CoverLetterEditorPanel
                  coverLetter={coverLetter}
                  onChange={updateCoverLetter}
                />
              ) : (
                <ResumeEditorPanel
                  document={document}
                  onChange={updateDocument}
                  resetKey={resetKey}
                />
              )}
            </div>
          </div>
        </div>

        <div className="border-border/60 bg-muted/40 dark:bg-background flex min-h-[50vh] w-full flex-col overflow-hidden lg:min-h-0 lg:w-1/2 lg:border-l">
          {isCoverLetter ? (
            <CoverLetterPreviewPane
              coverLetter={coverLetter}
              document={document}
            />
          ) : (
            <ResumePreviewPane document={document} />
          )}
        </div>
      </div>
    </div>
  );
};
