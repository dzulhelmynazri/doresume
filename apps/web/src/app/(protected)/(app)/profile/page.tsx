import { getUserResumeDocument } from "@doresume/db/user-resume-document";
import { Suspense } from "react";

import { LoadingImage } from "@/components/loading-image";
import { ResumeEditor } from "@/components/resume";
import { requireUser } from "@/lib/session";

const ProfilePageContent = async () => {
  const user = await requireUser();
  const document = await getUserResumeDocument(user.id);

  return <ResumeEditor initialDocument={document} />;
};

const ProfilePage = () => (
  <Suspense
    fallback={
      <div className="p-6">
        <LoadingImage />
      </div>
    }
  >
    <ProfilePageContent />
  </Suspense>
);

export default ProfilePage;
