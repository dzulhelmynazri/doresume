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

// Conversion/OCR output often carries long runs of blank lines. Left as-is they
// bloat the prompt and can trigger repetition loops in the parser model, so
// normalize line endings and collapse three-or-more newlines to one break.
const CARRIAGE_RETURNS = /\r\n?/gu;
const CONSECUTIVE_NEWLINES = /\n{3,}/gu;

const normalizeMarkdown = (value: string) =>
  value
    .replace(CARRIAGE_RETURNS, "\n")
    .replace(CONSECUTIVE_NEWLINES, "\n\n")
    .trim();

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

    return normalizeMarkdown(markdown);
  } catch (error) {
    if (!isNeedsOcrError(error)) {
      throw error;
    }

    const markdown = await toMarkdownBytes(bytes, format, {
      apiKey: options.apiKey,
      ocr: "hosted",
    });

    return normalizeMarkdown(markdown);
  }
};
