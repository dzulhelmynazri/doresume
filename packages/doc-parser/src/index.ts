import type {
  ResumeDocument,
  ResumeDocumentSeedUser,
} from "@doresume/contracts";

import { markdownToResumeDocumentWithAi } from "./ai-resume-parser";
import { documentToMarkdown } from "./to-markdown";
import type { DocumentToMarkdownOptions } from "./to-markdown";

export interface ParseResumeBytesOptions extends DocumentToMarkdownOptions {
  seed: ResumeDocumentSeedUser;
  sourceFileKey?: string;
}

export const parseResumeBytes = async (
  bytes: Uint8Array,
  options: ParseResumeBytesOptions
): Promise<ResumeDocument> => {
  const markdown = await documentToMarkdown(bytes, {
    apiKey: options.apiKey,
    filename: options.filename,
    ocr: options.ocr,
  });

  return markdownToResumeDocumentWithAi(
    markdown,
    options.seed,
    options.sourceFileKey
  );
};

export {
  documentToMarkdown,
  type DocumentToMarkdownOptions,
} from "./to-markdown";
export { markdownToResumeDocumentWithAi } from "./ai-resume-parser";
