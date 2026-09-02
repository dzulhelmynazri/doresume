import { Spinner } from "@doresume/ui/components/spinner";
import { Suspense } from "react";

import Auth from "@/components/auth";
import { requireGuest } from "@/lib/session";

const AuthPageContent = async () => {
  await requireGuest();

  return <Auth />;
};

const AuthPage = () => (
  <div className="flex h-svh items-center justify-center p-6">
    <Suspense fallback={<Spinner />}>
      <AuthPageContent />
    </Suspense>
  </div>
);

export default AuthPage;
