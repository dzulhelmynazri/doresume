import { Badge } from "@doresume/ui/components/badge";
import { Separator } from "@doresume/ui/components/separator";

import type { Company } from "../data/companies";
import { CompanyRecruiters } from "./company-recruiters";

const CompanyDetails = ({ company }: { company: Company }) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">{company.location}</Badge>
      <Badge variant="secondary">{company.industry}</Badge>
      <Badge variant="secondary">{company.size} employees</Badge>
    </div>
    <Separator />
    {company.sections.map((section) => (
      <section className="flex flex-col gap-2" key={section.heading}>
        <h3>{section.heading}</h3>
        {section.paragraphs.map((paragraph) => (
          <p className="text-muted-foreground" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </section>
    ))}
    <CompanyRecruiters recruiters={company.recruiters} />
  </div>
);

export { CompanyDetails };
