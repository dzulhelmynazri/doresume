import { auth } from "@doresume/auth";
import { getUserActiveCoverLetter } from "@doresume/db/user-documents";
import { render } from "takumi-pdf/next";

import { CoverLetterPdfDocument } from "@/components/resume/cover-letter-pdf-document";

export const GET = async (request: Request) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { coverLetter, document } = await getUserActiveCoverLetter(
      session.user.id
    );
    const pdf = await render(
      <CoverLetterPdfDocument coverLetter={coverLetter} document={document} />
    );
    const filename =
      `${document.header.name || "cover-letter"}-cover-letter.pdf`.replaceAll(
        /\s+/gu,
        "-"
      );

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/pdf",
      },
    });
  } catch {
    return new Response("Could not generate PDF.", { status: 500 });
  }
};
