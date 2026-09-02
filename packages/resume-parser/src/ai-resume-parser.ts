import type {
  ResumeDocument,
  ResumeDocumentSeedUser,
} from "@doresume/contracts";
import { env } from "@doresume/env/server";
import { createGateway, generateText, Output } from "ai";
import dedent from "dedent";

import { aiParsedResumeSchema } from "./ai-schema";
import { toResumeDocument } from "./to-resume-document";

const gateway = createGateway({
  apiKey: env.AI_GATEWAY_API_KEY,
});

// Deterministic extraction: bound the output so a degenerate response can never
// run away, and disable Gemini thinking so it answers directly instead of
// burning reasoning tokens (a big part of why parsing felt like it hung).
const EXTRACTION_MAX_OUTPUT_TOKENS = 8192;
const EXTRACTION_TEMPERATURE = 0.2;

export const markdownToResumeDocumentWithAi = async (
  markdown: string,
  seed: ResumeDocumentSeedUser,
  sourceFileKey?: string
): Promise<ResumeDocument> => {
  const { output } = await generateText({
    maxOutputTokens: EXTRACTION_MAX_OUTPUT_TOKENS,
    model: gateway("google/gemini-2.5-flash"),
    output: Output.object({
      schema: aiParsedResumeSchema,
    }),
    prompt: dedent`
      Extract structured resume data from the markdown below.

      Rules:
      - Preserve factual content from the resume. Do not invent employers, degrees, or credentials.
      - Use empty strings or empty arrays when a section is missing.
      - Keep dates as written on the resume (examples: "Jan 2020", "2020 – 2022", "Present").
      - Bullets should be achievement/responsibility statements without leading bullet characters.
      - For the header, extract name, job title, email, phone, LinkedIn URL, and location when present.
      - header.title is a short job title only (for example "Senior Software Engineer"). It must never be a sentence, a summary, or a list of skills.
      - Put any professional summary or objective prose in summary (at most 3-4 sentences), never in header.title.
      - Keep every field concise. Never repeat a phrase or sentence, and never pad a field with filler text.
      - Normalize LinkedIn to a full https URL when possible.
      - Put technical and soft skills in skills.
      - Ignore page numbers, headers, footers, and decorative text.

      Resume markdown:
      ${markdown}
    `,
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    },
    temperature: EXTRACTION_TEMPERATURE,
  });

  if (!output) {
    throw new Error("Resume parser did not return structured output.");
  }

  return toResumeDocument(output, seed, sourceFileKey);
};
