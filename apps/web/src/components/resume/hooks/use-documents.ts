"use client";

import type {
  CoverLetter,
  DocumentKind,
  DocumentsState,
  ResumeDocument,
} from "@doresume/contracts";
import {
  createDefaultCoverLetter,
  createDefaultResumeDocument,
  createDocumentBundle,
  getActiveDocumentBundle,
  getNextDocumentName,
  updateActiveDocumentCoverLetter,
  updateActiveDocumentResume,
} from "@doresume/contracts";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { client, orpc } from "@/utils/orpc";

export const useDocuments = (initialDocuments: DocumentsState) => {
  const queryClient = useQueryClient();
  const [savedDocuments, setSavedDocuments] =
    useState<DocumentsState>(initialDocuments);
  const [documents, setDocuments] = useState<DocumentsState>(initialDocuments);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const activeDocument = useMemo(
    () => getActiveDocumentBundle(documents),
    [documents]
  );
  const { document } = activeDocument;
  const coverLetter = activeDocument.coverLetter ?? createDefaultCoverLetter();

  const isDirty = useMemo(
    () => JSON.stringify(documents) !== JSON.stringify(savedDocuments),
    [documents, savedDocuments]
  );

  const persistDocuments = useCallback(
    async (nextDocuments: DocumentsState) => {
      await client.saveDocuments(nextDocuments);
      setSavedDocuments(nextDocuments);
      setDocuments(nextDocuments);
      await queryClient.invalidateQueries({
        queryKey: orpc.getDocuments.key(),
      });
    },
    [queryClient]
  );

  const updateDocument = useCallback(
    (updater: (current: ResumeDocument) => ResumeDocument) => {
      setDocuments((current) =>
        updateActiveDocumentResume(
          current,
          updater(getActiveDocumentBundle(current).document)
        )
      );
    },
    []
  );

  const updateCoverLetter = useCallback(
    (updater: (current: CoverLetter) => CoverLetter) => {
      setDocuments((current) =>
        updateActiveDocumentCoverLetter(
          current,
          updater(
            getActiveDocumentBundle(current).coverLetter ??
              createDefaultCoverLetter()
          )
        )
      );
    },
    []
  );

  const save = useCallback(async () => {
    setIsSaving(true);

    try {
      await persistDocuments(documents);
      toast.success("Resume saved.");
      setIsSaving(false);
    } catch {
      toast.error("Could not save resume. Try again.");
      setIsSaving(false);
    }
  }, [documents, persistDocuments]);

  const cancel = useCallback(() => {
    setDocuments(savedDocuments);
    setResetKey((current) => current + 1);
  }, [savedDocuments]);

  const switchDocument = useCallback(
    async (documentId: string) => {
      if (documentId === documents.activeDocumentId) {
        return;
      }

      try {
        await persistDocuments({ ...documents, activeDocumentId: documentId });
        setResetKey((current) => current + 1);
      } catch {
        toast.error("Could not switch document. Try again.");
      }
    },
    [documents, persistDocuments]
  );

  const addDocument = useCallback(async () => {
    const { header } = activeDocument.document;
    const nextDocument = createDocumentBundle({
      document: {
        ...createDefaultResumeDocument({
          city: null,
          country: null,
          email: header.email ?? "",
          linkedin: header.linkedin ?? null,
          name: header.name,
          phone: header.phone ?? null,
          state: null,
        }),
        header: { ...header },
      },
      name: getNextDocumentName(documents.documents),
    });

    const nextDocuments: DocumentsState = {
      activeDocumentId: nextDocument.id,
      documents: [...documents.documents, nextDocument],
    };

    try {
      await persistDocuments(nextDocuments);
      setResetKey((current) => current + 1);
      toast.success("Document added.");
    } catch {
      toast.error("Could not add document. Try again.");
    }
  }, [activeDocument.document, documents.documents, persistDocuments]);

  const renameDocument = useCallback(
    async (documentId: string, name: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return;
      }

      const nextDocuments: DocumentsState = {
        ...documents,
        documents: documents.documents.map((entry) =>
          entry.id === documentId ? { ...entry, name: trimmedName } : entry
        ),
      };

      try {
        await persistDocuments(nextDocuments);
        toast.success("Document renamed.");
      } catch {
        toast.error("Could not rename document. Try again.");
      }
    },
    [documents, persistDocuments]
  );

  const deleteDocument = useCallback(
    async (documentId: string) => {
      if (documents.documents.length <= 1) {
        return;
      }

      const remainingDocuments = documents.documents.filter(
        (entry) => entry.id !== documentId
      );
      const fallbackDocument =
        remainingDocuments.find((entry) => entry.starred) ??
        remainingDocuments[0];
      const nextActiveDocumentId =
        documents.activeDocumentId === documentId
          ? (fallbackDocument?.id ?? documents.activeDocumentId)
          : documents.activeDocumentId;

      const nextDocuments: DocumentsState = {
        activeDocumentId: nextActiveDocumentId,
        documents: remainingDocuments,
      };

      try {
        await persistDocuments(nextDocuments);
        setResetKey((current) => current + 1);
        toast.success("Document deleted.");
      } catch {
        toast.error("Could not delete document. Try again.");
      }
    },
    [documents, persistDocuments]
  );

  const toggleStarred = useCallback(
    async (documentId: string) => {
      const nextDocuments: DocumentsState = {
        ...documents,
        documents: documents.documents.map((entry) => ({
          ...entry,
          starred: entry.id === documentId,
        })),
      };

      try {
        await persistDocuments(nextDocuments);
      } catch {
        toast.error("Could not update default document. Try again.");
      }
    },
    [documents, persistDocuments]
  );

  const exportPdf = useCallback(
    async (documentKind: DocumentKind = "resume") => {
      setIsExporting(true);

      try {
        if (isDirty) {
          await persistDocuments(documents);
        }

        const endpoint =
          documentKind === "cover-letter"
            ? "/api/resume/cover-letter/pdf"
            : "/api/resume/pdf";
        const response = await fetch(endpoint);

        if (!response.ok) {
          toast.error("Could not export PDF. Try again.");
          setIsExporting(false);
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = window.document.createElement("a");
        const disposition = response.headers.get("Content-Disposition");
        const fallbackFilename =
          documentKind === "cover-letter" ? "cover-letter.pdf" : "resume.pdf";
        const filename = disposition?.includes('filename="')
          ? (disposition.split('filename="')[1]?.split('"')[0] ??
            fallbackFilename)
          : fallbackFilename;

        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(
          documentKind === "cover-letter"
            ? "Cover letter exported."
            : "Resume exported."
        );
        setIsExporting(false);
      } catch {
        toast.error("Could not export PDF. Try again.");
        setIsExporting(false);
      }
    },
    [documents, isDirty, persistDocuments]
  );

  return {
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
  };
};
