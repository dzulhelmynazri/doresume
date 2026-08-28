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

export const markdownToResumeDocumentWithAi = async (
  markdown: string,
  seed: ResumeDocumentSeedUser,
  sourceFileKey?: string
): Promise<ResumeDocument> => {
  const { output } = await generateText({
    model: gateway("google/gemini-2.5-flash-lite"),
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
      - Normalize LinkedIn to a full https URL when possible.
      - Put technical and soft skills in skills.
      - Ignore page numbers, headers, footers, and decorative text.

      Resume markdown:
      ${markdown}
    `,
  });

  if (!output) {
    throw new Error("Resume parser did not return structured output.");
  }

  return toResumeDocument(output, seed, sourceFileKey);
};
