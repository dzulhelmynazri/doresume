import { getUserChecklist } from "@doresume/db/user-checklist";
import { getUserWorkEligibility } from "@doresume/db/user-eligibility";
import { getUserMinimumSalary } from "@doresume/db/user-minimum-salary";
import { Suspense } from "react";

import { LoadingImage } from "@/components/loading-image";
import { requireUser } from "@/lib/session";

import { AtsForm } from "./ats-form";

const AtsPageContent = async () => {
  const user = await requireUser();
  const [eligibility, minimumSalary, checklist] = await Promise.all([
    getUserWorkEligibility(user.id),
    getUserMinimumSalary(user.id),
    getUserChecklist(user.id),
  ]);

  return (
    <AtsForm
      checklist={checklist}
      eligibility={eligibility}
      minimumSalary={minimumSalary}
    />
  );
};

const AtsPage = () => (
  <Suspense
    fallback={
      <div className="py-6">
        <LoadingImage />
      </div>
    }
  >
    <AtsPageContent />
  </Suspense>
);

export default AtsPage;
