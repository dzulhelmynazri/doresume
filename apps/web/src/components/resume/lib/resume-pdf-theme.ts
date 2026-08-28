import type { ResumeDocument } from "@doresume/contracts";
import type { PdfcnTheme } from "@doresume/ui/components/pdf/theme-provider";
import { professionalTheme } from "@doresume/ui/components/professional";

const PDF_FONT_FAMILIES: Record<
  ResumeDocument["settings"]["fontFamily"],
  { body: string; heading: string }
> = {
  courier: { body: "Courier", heading: "Courier" },
  helvetica: { body: "Helvetica", heading: "Helvetica" },
  times: { body: "Times-Roman", heading: "Times-Roman" },
};

export const createResumePdfTheme = (document: ResumeDocument): PdfcnTheme => {
  const fonts = PDF_FONT_FAMILIES[document.settings.fontFamily];

  return {
    ...professionalTheme,
    typography: {
      ...professionalTheme.typography,
      body: {
        ...professionalTheme.typography.body,
        fontFamily: fonts.body,
        fontSize: document.settings.fontSize,
      },
      heading: {
        ...professionalTheme.typography.heading,
        fontFamily: fonts.heading,
      },
    },
  };
};
