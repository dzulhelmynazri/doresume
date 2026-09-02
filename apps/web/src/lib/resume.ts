import { storage } from "@doresume/storage";
import { cache } from "react";

export const MAX_RESUME_BYTES = 10 * 1024 * 1024;

export const userResumePrefix = (userId: string) => `users/${userId}/resumes/`;

export const getUserResume = cache(async (userId: string) => {
  try {
    const resumes = await storage.list({
      limit: 1,
      prefix: userResumePrefix(userId),
    });
    const [file] = resumes.items;

    if (!file) {
      return null;
    }

    const separatorIndex = file.key.lastIndexOf("/");
    const name =
      separatorIndex === -1 ? file.key : file.key.slice(separatorIndex + 1);

    return {
      key: file.key,
      name,
      size: file.size,
    };
  } catch {
    return null;
  }
});

export const userHasResume = async (userId: string) => {
  const resume = await getUserResume(userId);
  return resume !== null;
};
