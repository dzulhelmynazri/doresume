import type { ReactNode } from "react";

const ProfileLayout = ({ children }: { children: ReactNode }) => (
  <div className="-m-4 flex min-h-[calc(100%+2rem)] flex-1 flex-col">
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto">{children}</div>
  </div>
);

export default ProfileLayout;
