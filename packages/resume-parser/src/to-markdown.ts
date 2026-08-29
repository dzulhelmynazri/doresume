import { formatFromPath, toMarkdownBytes } from "@firecrawl/anydoc";

export interface DocumentToMarkdownOptions {
  filename?: string;
  ocr?: "hosted";
  apiKey?: string;
}

const isNeedsOcrError = (
  error: unknown
): error is Error & { code: "needsOcr" } =>
  error instanceof Error && "code" in error && error.code === "needsOcr";

export const documentToMarkdown = async (
  bytes: Uint8Array,
  options: DocumentToMarkdownOptions = {}
): Promise<string> => {
  const format = options.filename ? formatFromPath(options.filename) : null;
  const convertOptions =
    options.ocr || options.apiKey
      ? {
          apiKey: options.apiKey,
          ocr: options.ocr ?? ("hosted" as const),
        }
      : undefined;

  try {
    const markdown = await toMarkdownBytes(bytes, format, convertOptions);

    return markdown.trim();
  } catch (error) {
    if (!isNeedsOcrError(error)) {
      throw error;
    }

    const markdown = await toMarkdownBytes(bytes, format, {
      apiKey: options.apiKey,
      ocr: "hosted",
    });

    return markdown.trim();
  }
};
