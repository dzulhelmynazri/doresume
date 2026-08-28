import type { ReactNode } from "react";

const ProfileLayout = ({ children }: { children: ReactNode }) => (
  <div className="-m-4 flex min-h-0 flex-1 flex-col overflow-hidden">
    {children}
  </div>
);

export default ProfileLayout;
