"use client";

import type {
  CoverLetter,
  ProfileDocumentType,
  ResumeDocument,
  ResumeProfilesState,
} from "@doresume/contracts";
import {
  createDefaultCoverLetter,
  createDefaultResumeDocument,
  createResumeProfile,
  getActiveResumeProfile,
  getNextProfileName,
  updateActiveProfileCoverLetter,
  updateActiveProfileDocument,
} from "@doresume/contracts";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { client } from "@/utils/orpc";

export const useResumeProfiles = (initialProfiles: ResumeProfilesState) => {
  const [savedProfiles, setSavedProfiles] =
    useState<ResumeProfilesState>(initialProfiles);
  const [profiles, setProfiles] =
    useState<ResumeProfilesState>(initialProfiles);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const activeProfile = useMemo(
    () => getActiveResumeProfile(profiles),
    [profiles]
  );
  const { document } = activeProfile;
  const coverLetter = activeProfile.coverLetter ?? createDefaultCoverLetter();

  const isDirty = useMemo(
    () => JSON.stringify(profiles) !== JSON.stringify(savedProfiles),
    [profiles, savedProfiles]
  );

  const persistProfiles = useCallback(
    async (nextProfiles: ResumeProfilesState) => {
      await client.saveResumeProfiles(nextProfiles);
      setSavedProfiles(nextProfiles);
      setProfiles(nextProfiles);
    },
    []
  );

  const updateDocument = useCallback(
    (updater: (current: ResumeDocument) => ResumeDocument) => {
      setProfiles((current) =>
        updateActiveProfileDocument(
          current,
          updater(getActiveResumeProfile(current).document)
        )
      );
    },
    []
  );

  const updateCoverLetter = useCallback(
    (updater: (current: CoverLetter) => CoverLetter) => {
      setProfiles((current) =>
        updateActiveProfileCoverLetter(
          current,
          updater(
            getActiveResumeProfile(current).coverLetter ??
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
      await persistProfiles(profiles);
      toast.success("Resume saved.");
      setIsSaving(false);
    } catch {
      toast.error("Could not save resume. Try again.");
      setIsSaving(false);
    }
  }, [persistProfiles, profiles]);

  const cancel = useCallback(() => {
    setProfiles(savedProfiles);
    setResetKey((current) => current + 1);
  }, [savedProfiles]);

  const switchProfile = useCallback(
    async (profileId: string) => {
      if (profileId === profiles.activeProfileId) {
        return;
      }

      try {
        await persistProfiles({ ...profiles, activeProfileId: profileId });
        setResetKey((current) => current + 1);
      } catch {
        toast.error("Could not switch profile. Try again.");
      }
    },
    [persistProfiles, profiles]
  );

  const addProfile = useCallback(async () => {
    const { header } = activeProfile.document;
    const nextProfile = createResumeProfile({
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
      name: getNextProfileName(profiles.profiles),
    });

    const nextProfiles: ResumeProfilesState = {
      activeProfileId: nextProfile.id,
      profiles: [...profiles.profiles, nextProfile],
    };

    try {
      await persistProfiles(nextProfiles);
      setResetKey((current) => current + 1);
      toast.success("Profile added.");
    } catch {
      toast.error("Could not add profile. Try again.");
    }
  }, [activeProfile.document, persistProfiles, profiles.profiles]);

  const renameProfile = useCallback(
    async (profileId: string, name: string) => {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return;
      }

      const nextProfiles: ResumeProfilesState = {
        ...profiles,
        profiles: profiles.profiles.map((profile) =>
          profile.id === profileId ? { ...profile, name: trimmedName } : profile
        ),
      };

      try {
        await persistProfiles(nextProfiles);
        toast.success("Profile renamed.");
      } catch {
        toast.error("Could not rename profile. Try again.");
      }
    },
    [persistProfiles, profiles]
  );

  const deleteProfile = useCallback(
    async (profileId: string) => {
      if (profiles.profiles.length <= 1) {
        return;
      }

      const remainingProfiles = profiles.profiles.filter(
        (profile) => profile.id !== profileId
      );
      const fallbackProfile =
        remainingProfiles.find((profile) => profile.starred) ??
        remainingProfiles[0];
      const nextActiveProfileId =
        profiles.activeProfileId === profileId
          ? (fallbackProfile?.id ?? profiles.activeProfileId)
          : profiles.activeProfileId;

      const nextProfiles: ResumeProfilesState = {
        activeProfileId: nextActiveProfileId,
        profiles: remainingProfiles,
      };

      try {
        await persistProfiles(nextProfiles);
        setResetKey((current) => current + 1);
        toast.success("Profile deleted.");
      } catch {
        toast.error("Could not delete profile. Try again.");
      }
    },
    [persistProfiles, profiles]
  );

  const toggleStarred = useCallback(
    async (profileId: string) => {
      const nextProfiles: ResumeProfilesState = {
        ...profiles,
        profiles: profiles.profiles.map((profile) => ({
          ...profile,
          starred: profile.id === profileId,
        })),
      };

      try {
        await persistProfiles(nextProfiles);
      } catch {
        toast.error("Could not update starred profile. Try again.");
      }
    },
    [persistProfiles, profiles]
  );

  const exportPdf = useCallback(
    async (documentType: ProfileDocumentType = "resume") => {
      setIsExporting(true);

      try {
        if (isDirty) {
          await persistProfiles(profiles);
        }

        const endpoint =
          documentType === "cover-letter"
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
          documentType === "cover-letter" ? "cover-letter.pdf" : "resume.pdf";
        const filename = disposition?.includes('filename="')
          ? (disposition.split('filename="')[1]?.split('"')[0] ??
            fallbackFilename)
          : fallbackFilename;

        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(
          documentType === "cover-letter"
            ? "Cover letter exported."
            : "Resume exported."
        );
        setIsExporting(false);
      } catch {
        toast.error("Could not export PDF. Try again.");
        setIsExporting(false);
      }
    },
    [isDirty, persistProfiles, profiles]
  );

  return {
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
  };
};
