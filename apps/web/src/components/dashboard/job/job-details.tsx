import { Badge } from "@doresume/ui/components/badge";
import { Separator } from "@doresume/ui/components/separator";
import type { ReactNode } from "react";

import {
  formatMatchPercent,
  formatSalaryRange,
  formatWorkplaceLocation,
} from "../data/jobs";
import type { Job } from "../data/jobs";

const JobDetails = ({ children, job }: { children?: ReactNode; job: Job }) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap gap-2">
      {children}
      <Badge variant="secondary">
        {formatMatchPercent(job.matchPercent)} match
      </Badge>
      <Badge variant="outline">
        {formatWorkplaceLocation(job.location, job.workplace)}
      </Badge>
      <Badge variant="secondary">
        {formatSalaryRange(job.salaryMin, job.salaryMax)}
      </Badge>
      <Badge variant="secondary">{job.seniority}</Badge>
      <Badge variant="outline">{job.employmentType}</Badge>
      <Badge variant="outline">{job.experience}</Badge>
      <Badge variant="secondary">{job.category}</Badge>
    </div>
    <Separator />
    {job.sections.map((section) => (
      <section className="flex flex-col gap-2" key={section.heading}>
        <h3>{section.heading}</h3>
        {section.paragraphs.map((paragraph) => (
          <p className="text-muted-foreground" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </section>
    ))}
  </div>
);

export { JobDetails };
