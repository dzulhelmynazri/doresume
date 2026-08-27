import { Badge } from "@doresume/ui/components/badge";
import { Button } from "@doresume/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@doresume/ui/components/card";
import { cn } from "@doresume/ui/lib/utils";

import { formatMatchPercent, formatWorkplaceLocation } from "../data/jobs";
import type { Job } from "../data/jobs";

const MATCH_RING_RADIUS = 16;
const MATCH_RING_CIRCUMFERENCE = 2 * Math.PI * MATCH_RING_RADIUS;

const FEATURED_POSTED_LABELS = [
  "2 days ago",
  "14 hours ago",
  "a day ago",
  "6 days ago",
  "3 days ago",
] as const;

const FEATURED_TONES = [
  {
    card: "bg-featured-1/15 ring-featured-1/30",
    ring: "stroke-featured-1",
  },
  {
    card: "bg-featured-2/15 ring-featured-2/30",
    ring: "stroke-featured-2",
  },
  {
    card: "bg-featured-3/15 ring-featured-3/30",
    ring: "stroke-featured-3",
  },
  {
    card: "bg-featured-4/15 ring-featured-4/30",
    ring: "stroke-featured-4",
  },
  {
    card: "bg-featured-5/15 ring-featured-5/30",
    ring: "stroke-featured-5",
  },
] as const;

const MatchRing = ({
  strokeClassName,
  value,
}: {
  strokeClassName: string;
  value: number;
}) => {
  const offset = MATCH_RING_CIRCUMFERENCE * (1 - value / 100);

  return (
    <div
      aria-label={`${formatMatchPercent(value)} match`}
      className="relative size-12"
    >
      <svg className="size-12 -rotate-90" viewBox="0 0 40 40">
        <circle
          className="stroke-muted fill-none"
          cx="20"
          cy="20"
          r={MATCH_RING_RADIUS}
          strokeWidth="3"
        />
        <circle
          className={cn("fill-none", strokeClassName)}
          cx="20"
          cy="20"
          r={MATCH_RING_RADIUS}
          strokeDasharray={MATCH_RING_CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium tabular-nums">
          {formatMatchPercent(value)}
        </span>
      </div>
    </div>
  );
};

const JobCard = ({
  className,
  job,
  onApply,
  onPass,
  onSelect,
  postedLabel,
  ringClassName,
}: {
  className: string;
  job: Job;
  onApply: (job: Job) => void;
  onPass: (job: Job) => void;
  onSelect: (job: Job) => void;
  postedLabel: string;
  ringClassName: string;
}) => {
  const location = formatWorkplaceLocation(job.location, job.workplace);

  return (
    <Card
      className={cn("h-full cursor-pointer", className)}
      onClick={() => onSelect(job)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(job);
        }
      }}
      size="sm"
      tabIndex={0}
    >
      <CardHeader>
        <CardDescription>
          {location} <br /> {postedLabel}
        </CardDescription>
        <CardAction>
          <MatchRing strokeClassName={ringClassName} value={job.matchPercent} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        <CardTitle className="line-clamp-2">{job.title}</CardTitle>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline">{job.workplace}</Badge>
          <Badge variant="secondary">{job.seniority}</Badge>
        </div>
      </CardContent>
      <CardFooter className="mt-auto justify-between gap-2 border-t">
        <span className="min-w-0 truncate">{job.company}</span>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onPass(job);
            }}
            size="sm"
            type="button"
            variant="outline"
          >
            Pass
          </Button>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onApply(job);
            }}
            size="sm"
            type="button"
          >
            Apply
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const JobCards = ({
  jobs,
  onApplyAction,
  onPassAction,
  onSelectAction,
}: {
  jobs: Job[];
  onApplyAction: (job: Job) => void;
  onPassAction: (job: Job) => void;
  onSelectAction: (job: Job) => void;
}) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
    {jobs.map((job, index) => {
      const postedLabel = FEATURED_POSTED_LABELS[index] ?? "7 days ago";
      const tone =
        FEATURED_TONES[index % FEATURED_TONES.length] ?? FEATURED_TONES[0];

      return (
        <JobCard
          className={tone.card}
          job={job}
          key={job.id}
          onApply={onApplyAction}
          onPass={onPassAction}
          onSelect={onSelectAction}
          postedLabel={postedLabel}
          ringClassName={tone.ring}
        />
      );
    })}
  </div>
);

export { JobCards };
