import type { ReactNode } from "react";

import type { Style } from "@doresume/ui/lib/pdf-primitives";

export type { Style };

export interface PDFComponentProps {
  children?: ReactNode;
  style?: Style | Style[];
}
