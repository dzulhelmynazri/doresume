"use client";

import { Badge } from "@doresume/ui/components/reui/badge";
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@doresume/ui/components/reui/frame";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@doresume/ui/components/reui/kanban";
import { cn } from "@doresume/ui/lib/utils";
import { useState } from "react";
import type { ComponentProps } from "react";

import { initialTrackerColumns, TRACKER_COLUMNS } from "./data/applications";
import type { TrackerApplication, TrackerColumnId } from "./data/applications";

const ApplicationCard = ({
  application,
  asHandle,
  ...props
}: {
  application: TrackerApplication;
  asHandle?: boolean;
} & Omit<ComponentProps<typeof KanbanItem>, "value" | "children">) => {
  const content = (
    <Frame className="p-0" spacing="sm" variant="ghost">
      <FramePanel className="p-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">{application.title}</span>
          <span className="text-muted-foreground text-xs">
            {application.company}
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground truncate text-xs">
              {application.location}
            </span>
            <span className="text-muted-foreground shrink-0 text-[10px] tabular-nums">
              {application.appliedAt}
            </span>
          </div>
        </div>
      </FramePanel>
    </Frame>
  );

  return (
    <KanbanItem value={application.id} {...props}>
      {asHandle ? <KanbanItemHandle>{content}</KanbanItemHandle> : content}
    </KanbanItem>
  );
};

export const TrackerKanban = () => {
  const [columns, setColumns] = useState(initialTrackerColumns);

  return (
    <Kanban
      getItemValue={(item) => item.id}
      onValueChange={(nextColumns) =>
        setColumns(nextColumns as Record<TrackerColumnId, TrackerApplication[]>)
      }
      value={columns}
    >
      <KanbanBoard className="grid auto-cols-[minmax(240px,1fr)] grid-flow-col auto-rows-fr gap-4 overflow-x-auto pb-2 sm:grid-cols-none">
        {TRACKER_COLUMNS.map((column) => {
          const applications = columns[column.id];

          return (
            <KanbanColumn key={column.id} value={column.id}>
              <Frame className="h-full min-h-96" spacing="sm">
                <FrameHeader className="flex flex-row items-center gap-2">
                  <div className={cn("size-2 rounded-full", column.color)} />
                  <FrameTitle>{column.title}</FrameTitle>
                  <Badge className="ml-auto" size="sm" variant="outline">
                    {applications.length}
                  </Badge>
                </FrameHeader>
                <KanbanColumnContent
                  className="flex flex-col gap-2 p-0.5"
                  value={column.id}
                >
                  {applications.map((application) => (
                    <ApplicationCard
                      application={application}
                      asHandle
                      key={application.id}
                    />
                  ))}
                </KanbanColumnContent>
              </Frame>
            </KanbanColumn>
          );
        })}
      </KanbanBoard>
      <KanbanOverlay className="bg-muted/10 rounded-md border-2 border-dashed" />
    </Kanban>
  );
};
