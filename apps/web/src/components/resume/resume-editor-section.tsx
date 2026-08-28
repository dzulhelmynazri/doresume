"use client";

import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Button } from "@doresume/ui/components/button";
import { ButtonGroup } from "@doresume/ui/components/button-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@doresume/ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@doresume/ui/components/collapsible";
import { cn } from "@doresume/ui/lib/utils";
import {
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import type { ReactNode } from "react";

interface ResumeEditorSectionProps {
  children: ReactNode;
  defaultOpen?: boolean;
  description?: string;
  dragHandle?: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
  isDragging?: boolean;
  isVisible?: boolean;
  onRemove?: () => void;
  onToggleVisible?: () => void;
  title: string;
}

export const ResumeEditorSection = ({
  children,
  defaultOpen = true,
  description,
  dragHandle,
  isDragging = false,
  isVisible = true,
  onRemove,
  onToggleVisible,
  title,
}: ResumeEditorSectionProps) => (
  <Collapsible className="group" defaultOpen={defaultOpen}>
    <Card
      className={cn(isDragging && "opacity-60", !isVisible && "opacity-70")}
    >
      <CardHeader
        className={cn(
          "grid items-center gap-x-2",
          dragHandle ? "grid-cols-[auto_1fr_auto_auto]" : "grid-cols-[1fr_auto]"
        )}
      >
        {dragHandle ? (
          <button
            aria-label={`Reorder ${title}`}
            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
            type="button"
            {...dragHandle.attributes}
            {...dragHandle.listeners}
          >
            <GripVerticalIcon className="size-4" />
          </button>
        ) : null}
        <CollapsibleTrigger
          className="min-w-0 rounded-md text-left transition-colors"
          type="button"
        >
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </CollapsibleTrigger>
        {onToggleVisible && onRemove ? (
          <CardAction className="col-auto row-auto self-center justify-self-end">
            <ButtonGroup>
              <Button
                aria-label={
                  isVisible
                    ? `Hide ${title} from resume`
                    : `Show ${title} on resume`
                }
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleVisible();
                }}
                size="icon"
                type="button"
                variant="outline"
              >
                {isVisible ? <EyeIcon /> : <EyeOffIcon />}
              </Button>
              <Button
                aria-label={`Remove ${title} content`}
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove();
                }}
                size="icon"
                type="button"
                variant="outline"
              >
                <Trash2Icon />
              </Button>
            </ButtonGroup>
          </CardAction>
        ) : null}
        <CollapsibleTrigger
          className="text-muted-foreground rounded-md transition-colors"
          type="button"
        >
          <ChevronDownIcon
            className={cn(
              "size-5 transition-transform",
              "group-data-[panel-open]:rotate-180"
            )}
          />
        </CollapsibleTrigger>
      </CardHeader>
      <CollapsibleContent>
        <CardContent className="pt-4">{children}</CardContent>
      </CollapsibleContent>
    </Card>
  </Collapsible>
);
