import type { ReactNode } from "react";

import { View } from "@doresume/ui/lib/pdf-primitives";
import type { Style } from "@doresume/ui/components/pdf-components";

export interface KeepTogetherProps {
  children?: ReactNode;
  minPresenceAhead?: number;
  style?: Style;
}

export const KeepTogether = ({ children, style }: KeepTogetherProps) => (
  <View style={[{ breakInside: "avoid" }, style].filter(Boolean) as never}>
    {children}
  </View>
);
