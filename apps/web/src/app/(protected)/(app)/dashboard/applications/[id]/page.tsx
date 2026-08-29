import { redirect } from "next/navigation";

const ApplicationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  redirect(`/dashboard/applications/${id}/job`);
};

export default ApplicationPage;
