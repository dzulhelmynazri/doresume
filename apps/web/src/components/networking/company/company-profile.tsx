import { Button } from "@doresume/ui/components/button";
import { Facebook } from "@doresume/ui/socials/facebook";
import { Instagram } from "@doresume/ui/socials/instagram";
import { LinkedIn } from "@doresume/ui/socials/linkedin";
import { GlobeIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { Company } from "../data/companies";
import { CompanyDetails } from "./company-details";

const SocialLink = ({
  href,
  icon,
  label,
}: {
  href: string | null;
  icon: ReactNode;
  label: string;
}) => {
  if (!href) {
    return null;
  }

  return (
    <Button
      nativeButton={false}
      render={
        <Link aria-label={label} href={href} rel="noopener" target="_blank" />
      }
      size="icon"
      variant="outline"
    >
      {icon}
    </Button>
  );
};

const CompanyProfile = ({ company }: { company: Company }) => (
  <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1>{company.name}</h1>
        <p className="text-muted-foreground">{company.location}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SocialLink
          href={company.socials.facebook}
          icon={<Facebook />}
          label={`${company.name} on Facebook`}
        />
        <SocialLink
          href={company.socials.instagram}
          icon={<Instagram />}
          label={`${company.name} on Instagram`}
        />
        <SocialLink
          href={company.socials.linkedin}
          icon={<LinkedIn />}
          label={`${company.name} on LinkedIn`}
        />
        <SocialLink
          href={company.socials.website}
          icon={<GlobeIcon />}
          label={`${company.name} website`}
        />
      </div>
    </div>
    <CompanyDetails company={company} />
  </div>
);

export { CompanyProfile };
