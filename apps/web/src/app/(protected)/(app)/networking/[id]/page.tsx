import { Spinner } from "@doresume/ui/components/spinner";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CompanyProfile } from "@/components/networking/company/company-profile";
import { getCompanyById } from "@/components/networking/data/companies";

const CompanyContent = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const company = getCompanyById(id);

  if (!company) {
    notFound();
  }

  return <CompanyProfile company={company} />;
};

const CompanyPage = ({ params }: { params: Promise<{ id: string }> }) => (
  <Suspense
    fallback={
      <div className="flex min-h-40 items-center justify-center">
        <Spinner />
      </div>
    }
  >
    <CompanyContent params={params} />
  </Suspense>
);

export default CompanyPage;
