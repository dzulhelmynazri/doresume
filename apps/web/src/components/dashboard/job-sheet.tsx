"use client";

import { Badge } from "@doresume/ui/components/badge";
import { Button } from "@doresume/ui/components/button";
import { Separator } from "@doresume/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@doresume/ui/components/sheet";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import {
  formatMatchPercent,
  formatSalaryRange,
  formatWorkplaceLocation,
} from "./data";
import type { Job } from "./data";
import { JobResumeBadge } from "./job-resume-badge";
import { JobStatusBadge } from "./job-status-badge";

const JobSheet = ({
  job,
  onOpenChange,
  open,
}: {
  job: Job | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) => (
  <Sheet onOpenChange={onOpenChange} open={open}>
    <SheetContent className="min-w-lg" side="right" showCloseButton={false}>
      <SheetHeader>
        <SheetTitle>{job?.title ?? "Job"}</SheetTitle>
        <SheetDescription>{job?.company ?? ""}</SheetDescription>
      </SheetHeader>
      {job ? (
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            <JobStatusBadge status={job.status} />
            <JobResumeBadge status={job.resumeStatus} />
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
      ) : null}
      <SheetFooter>
        <div className="flex items-center justify-between gap-2">
          <Button
            nativeButton={false}
            render={
              <Link
                aria-label="View original posting"
                href="#"
                rel="noopener"
                target="_blank"
              />
            }
            variant="link"
          >
            View original posting
            <ArrowUpRight data-icon="inline-end" />
          </Button>
          <div className="flex items-center gap-2">
            <Button disabled={!job} type="button" variant="outline">
              Bookmark
            </Button>
            <Button disabled={!job} type="button">
              Apply
            </Button>
          </div>
        </div>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export { JobSheet };
