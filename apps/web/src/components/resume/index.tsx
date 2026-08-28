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
      <div className="border-border/60 bg-background sticky top-0 z-10 shrink-0 border-b">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="border-border/60 flex items-center px-4 py-3 lg:w-1/2 lg:border-r">
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
          <div className="border-border/60 flex items-center border-t px-4 py-3 lg:w-1/2 lg:border-t-0">
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

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex min-h-0 w-full flex-col lg:w-1/2">
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mx-auto w-full">
              <ResumeEditorPanel
                document={document}
                onChange={updateDocument}
                resetKey={resetKey}
              />
            </div>
          </div>
        </div>

        <div className="border-border/60 min-h-[50vh] w-full lg:min-h-0 lg:w-1/2 lg:border-l">
          <ResumePreviewPane document={document} />
        </div>
      </div>
    </div>
  );
};
