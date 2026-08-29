"use client";

import type { DocumentKind, DocumentsState } from "@doresume/contracts";
import { useState } from "react";

import { CoverLetterEditorPanel } from "./cover-letter-editor-panel";
import { useDocuments } from "./hooks/use-documents";
import { ResumeEditorPanel } from "./resume-editor-panel";
import {
  CoverLetterPreviewPane,
  ResumePreviewPane,
  ResumePreviewToolbar,
} from "./resume-preview-pane";
import { ResumeToolbar } from "./resume-toolbar";

export const ResumeEditor = ({
  initialDocuments,
  initialKind = "resume",
}: {
  initialDocuments: DocumentsState;
  initialKind?: DocumentKind;
}) => {
  const [documentKind, setDocumentKind] = useState<DocumentKind>(initialKind);
  const isCoverLetter = documentKind === "cover-letter";

  const {
    activeDocument,
    addDocument,
    cancel,
    coverLetter,
    deleteDocument,
    document,
    documents,
    exportPdf,
    isDirty,
    isExporting,
    isSaving,
    renameDocument,
    resetKey,
    save,
    switchDocument,
    toggleStarred,
    updateCoverLetter,
    updateDocument,
  } = useDocuments(initialDocuments);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-border/60 sticky top-0 z-10 shrink-0 border-b">
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          <div className="border-border/60 bg-background flex min-w-0 items-center px-4 py-2 lg:w-1/2 lg:border-r">
            <ResumeToolbar
              activeDocument={activeDocument}
              document={document}
              documentCount={documents.documents.length}
              documents={documents.documents}
              isDirty={isDirty}
              isSaving={isSaving}
              onAddDocument={addDocument}
              onCancel={cancel}
              onChange={updateDocument}
              onDeleteDocument={deleteDocument}
              onRenameDocument={renameDocument}
              onSave={() => {
                void save();
              }}
              onSwitchDocument={switchDocument}
              onToggleStarred={toggleStarred}
              showSections={!isCoverLetter}
            />
          </div>
          <div className="border-border/60 bg-background flex min-w-0 items-center border-t px-4 py-2 lg:w-1/2 lg:border-t-0">
            <ResumePreviewToolbar
              document={document}
              documentKind={documentKind}
              isExporting={isExporting}
              isSaving={isSaving}
              onChange={updateDocument}
              onDocumentKindChange={setDocumentKind}
              onExport={() => {
                void exportPdf(documentKind);
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
