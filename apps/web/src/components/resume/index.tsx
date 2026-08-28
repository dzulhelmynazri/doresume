"use client";

import type { ResumeDocument } from "@doresume/contracts";

import { useResumeDocument } from "./hooks/use-resume-document";
import { ResumeEditorPanel } from "./resume-editor-panel";
import { ResumePreviewPane, ResumePreviewToolbar } from "./resume-preview-pane";
import { ResumeToolbar } from "./resume-toolbar";

export const ResumeEditor = ({
  initialDocument,
}: {
  initialDocument: ResumeDocument;
}) => {
  const {
    cancel,
    document,
    exportPdf,
    isDirty,
    isExporting,
    isSaving,
    resetKey,
    save,
    updateDocument,
  } = useResumeDocument(initialDocument);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-border/60 sticky top-0 z-10 shrink-0 border-b">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="border-border/60 bg-background flex items-center px-4 py-3 lg:w-1/2 lg:border-r">
            <ResumeToolbar
              document={document}
              isDirty={isDirty}
              isSaving={isSaving}
              onCancel={cancel}
              onChange={updateDocument}
              onSave={() => {
                void save();
              }}
            />
          </div>
          <div className="border-border/60 bg-background flex items-center border-t px-4 py-3 lg:w-1/2 lg:border-t-0">
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
