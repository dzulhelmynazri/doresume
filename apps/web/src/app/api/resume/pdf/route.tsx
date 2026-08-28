import { auth } from "@doresume/auth";
import { getUserResumeDocument } from "@doresume/db/user-resume-document";
import { render } from "takumi-pdf/next";

import { ResumePdfDocument } from "@/components/resume/resume-pdf-document";

export const GET = async (request: Request) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const document = await getUserResumeDocument(session.user.id);
    const pdf = await render(<ResumePdfDocument document={document} />);
    const filename = `${document.header.name || "resume"}.pdf`.replaceAll(
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
