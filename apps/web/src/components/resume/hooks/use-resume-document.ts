"use client";

import type { ResumeDocument } from "@doresume/contracts";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { client } from "@/utils/orpc";

import { documentsAreEqual } from "../lib/resume-actions";

export const useResumeDocument = (initialDocument: ResumeDocument) => {
  const [savedDocument, setSavedDocument] = useState(initialDocument);
  const [document, setDocument] = useState(initialDocument);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const isDirty = !documentsAreEqual(document, savedDocument);

  const updateDocument = useCallback(
    (updater: (current: ResumeDocument) => ResumeDocument) => {
      setDocument((current) => updater(current));
    },
    []
  );

  const save = useCallback(async () => {
    setIsSaving(true);

    try {
      await client.saveResumeDocument(document);
      setSavedDocument(document);
      toast.success("Resume saved.");
      setIsSaving(false);
    } catch {
      toast.error("Could not save resume. Try again.");
      setIsSaving(false);
    }
  }, [document]);

  const cancel = useCallback(() => {
    setDocument(savedDocument);
    setResetKey((current) => current + 1);
  }, [savedDocument]);

  const exportPdf = useCallback(async () => {
    setIsExporting(true);

    try {
      if (isDirty) {
        await client.saveResumeDocument(document);
        setSavedDocument(document);
      }

      const response = await fetch("/api/resume/pdf");

      if (!response.ok) {
        toast.error("Could not export PDF. Try again.");
        setIsExporting(false);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      const disposition = response.headers.get("Content-Disposition");
      const filename = disposition?.includes('filename="')
        ? (disposition.split('filename="')[1]?.split('"')[0] ?? "resume.pdf")
        : "resume.pdf";

      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Resume exported.");
      setIsExporting(false);
    } catch {
      toast.error("Could not export PDF. Try again.");
      setIsExporting(false);
    }
  }, [document, isDirty]);

  return {
    cancel,
    document,
    exportPdf,
    isDirty,
    isExporting,
    isSaving,
    resetKey,
    save,
    updateDocument,
  };
};
