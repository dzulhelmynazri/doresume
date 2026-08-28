"use client";

import { useQuery } from "@tanstack/react-query";

import { LoadingImage } from "@/components/loading-image";
import { ResumeEditor } from "@/components/resume";
import { orpc } from "@/utils/orpc";

const STALE_TIME_MS = 5 * 60 * 1000;

const ProfilePage = () => {
  const { data, isPending } = useQuery(
    orpc.getResumeProfiles.queryOptions({
      staleTime: STALE_TIME_MS,
    })
  );

  if (isPending || !data) {
    return (
      <div className="p-6">
        <LoadingImage />
      </div>
    );
  }

  const { profiles } = data;

  return <ResumeEditor initialProfiles={profiles} />;
};

export default ProfilePage;
