"use client";

import type { ResumeProfilesState } from "@doresume/contracts";

import { useResumeProfiles } from "./hooks/use-resume-profiles";
import { ResumeEditorPanel } from "./resume-editor-panel";
import { ResumePreviewPane, ResumePreviewToolbar } from "./resume-preview-pane";
import { ResumeToolbar } from "./resume-toolbar";

export const ResumeEditor = ({
  initialProfiles,
}: {
  initialProfiles: ResumeProfilesState;
}) => {
  const {
    activeProfile,
    addProfile,
    cancel,
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
    updateDocument,
  } = useResumeProfiles(initialProfiles);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-border/60 sticky top-0 z-10 shrink-0 border-b">
        <div className="bg-background flex min-w-0 items-center gap-3 overflow-x-auto px-4 py-2">
          <div className="flex min-w-0 flex-1 items-center">
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
            />
          </div>
          <div
            aria-hidden
            className="bg-border hidden h-6 w-px shrink-0 lg:block"
          />
          <div className="flex shrink-0 items-center">
            <ResumePreviewToolbar
              document={document}
              isExporting={isExporting}
              isSaving={isSaving}
              onChange={updateDocument}
              onExport={() => {
                void exportPdf();
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="bg-muted/40 dark:bg-background flex min-h-0 w-full flex-col overflow-hidden lg:w-1/2">
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <div className="mx-auto w-full">
              <ResumeEditorPanel
                document={document}
                onChange={updateDocument}
                resetKey={resetKey}
              />
            </div>
          </div>
        </div>

        <div className="border-border/60 bg-muted/40 dark:bg-background flex min-h-[50vh] w-full flex-col overflow-hidden lg:min-h-0 lg:w-1/2 lg:border-l">
          <ResumePreviewPane document={document} />
        </div>
      </div>
    </div>
  );
};
