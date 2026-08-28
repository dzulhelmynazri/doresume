export const TRACKER_COLUMN_IDS = [
  "applied",
  "ghosted",
  "interviewing",
  "rejected",
  "offer",
] as const;

export type TrackerColumnId = (typeof TRACKER_COLUMN_IDS)[number];

export interface TrackerApplication {
  appliedAt: string;
  company: string;
  id: string;
  location: string;
  title: string;
}

export const TRACKER_COLUMNS: {
  color: string;
  id: TrackerColumnId;
  title: string;
}[] = [
  { color: "bg-primary", id: "applied", title: "Applied" },
  { color: "bg-muted-foreground", id: "ghosted", title: "Ghosted" },
  { color: "bg-info", id: "interviewing", title: "Interviewing" },
  { color: "bg-destructive", id: "rejected", title: "Rejected" },
  { color: "bg-success", id: "offer", title: "Offer" },
];

export const initialTrackerColumns: Record<
  TrackerColumnId,
  TrackerApplication[]
> = {
  applied: [
    {
      appliedAt: "Mar 12, 2026",
      company: "Vercel",
      id: "t1",
      location: "San Francisco, CA",
      title: "Senior Software Engineer, Platform",
    },
    {
      appliedAt: "Mar 10, 2026",
      company: "Stripe",
      id: "t2",
      location: "San Francisco, CA",
      title: "Software Engineer, Frontend",
    },
    {
      appliedAt: "Mar 8, 2026",
      company: "Notion",
      id: "t3",
      location: "San Francisco, CA",
      title: "Software Engineer, Full Stack",
    },
  ],
  ghosted: [
    {
      appliedAt: "Feb 28, 2026",
      company: "Meta",
      id: "t4",
      location: "Menlo Park, CA",
      title: "Software Engineer, Product",
    },
  ],
  interviewing: [
    {
      appliedAt: "Mar 5, 2026",
      company: "Linear",
      id: "t5",
      location: "Remote",
      title: "Staff Software Engineer, Frontend",
    },
    {
      appliedAt: "Mar 1, 2026",
      company: "Figma",
      id: "t6",
      location: "San Francisco, CA",
      title: "Senior Software Engineer, Full Stack",
    },
  ],
  offer: [
    {
      appliedAt: "Feb 15, 2026",
      company: "Datadog",
      id: "t8",
      location: "New York, NY",
      title: "Senior Software Engineer, Front End",
    },
  ],
  rejected: [
    {
      appliedAt: "Feb 20, 2026",
      company: "OpenAI",
      id: "t7",
      location: "San Francisco, CA",
      title: "Software Engineer, Front End",
    },
  ],
};
