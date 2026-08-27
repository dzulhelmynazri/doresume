"use client";

import { Button } from "@doresume/ui/components/button";
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

import type { Job } from "../data/jobs";
import { JobDetails } from "./job-details";

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
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-6">
          <JobDetails job={job} />
        </div>
      ) : null}
      <SheetFooter>
        <div className="flex items-center justify-between gap-2">
          <Button
            nativeButton={false}
            render={
              <Link
                aria-label="View original posting"
                href={job?.url ?? "#"}
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
