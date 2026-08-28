import { getUserResumeDocument } from "@doresume/db/user-resume-document";
import { Spinner } from "@doresume/ui/components/spinner";
import { Suspense } from "react";

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
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    }
  >
    <ProfilePageContent />
  </Suspense>
);

export default ProfilePage;
