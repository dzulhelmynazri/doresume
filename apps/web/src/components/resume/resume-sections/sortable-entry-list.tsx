"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { isEntryVisible } from "@doresume/contracts";
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
import { cn } from "@doresume/ui/lib/utils";
import {
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import type { ReactNode } from "react";

interface SortableEntryListProps<T extends { id: string; visible?: boolean }> {
  emptyMessage: string;
  getSubtitle?: (item: T) => string;
  getTitle: (item: T) => string;
  items: T[];
  onRemove: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  onToggleVisible: (id: string) => void;
  renderItem: (item: T) => ReactNode;
}

const SortableEntryRow = <T extends { id: string; visible?: boolean }>({
  getSubtitle,
  getTitle,
  item,
  onRemove,
  onToggleVisible,
  renderItem,
}: {
  getSubtitle?: (item: T) => string;
  getTitle: (item: T) => string;
  item: T;
  onRemove: () => void;
  onToggleVisible: () => void;
  renderItem: (item: T) => ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
  const visible = isEntryVisible(item);
  const title = getTitle(item);
  const subtitle = getSubtitle?.(item);

  return (
    <Card
      className={cn(isDragging && "opacity-60", !visible && "opacity-70")}
      ref={setNodeRef}
      size="sm"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <CardHeader className="grid-cols-[auto_1fr_auto] items-center gap-x-2">
        <button
          aria-label="Reorder entry"
          className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          type="button"
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon className="size-4" />
        </button>
        <div className="min-w-0">
          <CardTitle className="truncate">
            {title.length > 0 ? title : "Untitled entry"}
          </CardTitle>
          {subtitle ? (
            <CardDescription className="truncate">{subtitle}</CardDescription>
          ) : null}
        </div>
        <CardAction>
          <ButtonGroup>
            <Button
              aria-label={
                visible ? "Hide entry from resume" : "Show entry on resume"
              }
              onClick={onToggleVisible}
              size="icon"
              type="button"
              variant="outline"
            >
              {visible ? <EyeIcon /> : <EyeOffIcon />}
            </Button>
            <Button
              aria-label="Remove entry"
              onClick={onRemove}
              size="icon"
              type="button"
              variant="outline"
            >
              <Trash2Icon />
            </Button>
          </ButtonGroup>
        </CardAction>
      </CardHeader>
      <CardContent>{renderItem(item)}</CardContent>
    </Card>
  );
};

export const SortableEntryList = <T extends { id: string; visible?: boolean }>({
  emptyMessage,
  getSubtitle,
  getTitle,
  items,
  onRemove,
  onReorder,
  onToggleVisible,
  renderItem,
}: SortableEntryListProps<T>) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    onReorder(String(active.id), String(over.id));
  };

  if (items.length === 0) {
    return <p className="text-muted-foreground text-sm">{emptyMessage}</p>;
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <SortableEntryRow
              getSubtitle={getSubtitle}
              getTitle={getTitle}
              item={item}
              key={item.id}
              onRemove={() => onRemove(item.id)}
              onToggleVisible={() => onToggleVisible(item.id)}
              renderItem={renderItem}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
