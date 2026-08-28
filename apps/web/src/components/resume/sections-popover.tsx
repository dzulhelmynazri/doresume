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
import type { ResumeDocument } from "@doresume/contracts";
import {
  getSectionTitle,
  getVisibleSectionIds,
  isSectionVisible,
} from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import { Input } from "@doresume/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@doresume/ui/components/popover";
import { cn } from "@doresume/ui/lib/utils";
import {
  ArrowUpDownIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  PlusIcon,
} from "lucide-react";
import { useState } from "react";

import {
  addCustomSection,
  reorderSections,
  toggleSectionVisibility,
} from "./lib/resume-actions";

interface SectionsPopoverProps {
  document: ResumeDocument;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
}

const SortableSectionRow = ({
  id,
  index,
  isVisible,
  onToggleVisibility,
  title,
}: {
  id: string;
  index: number;
  isVisible: boolean;
  onToggleVisibility: () => void;
  title: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5",
        isDragging && "border-border bg-muted/50"
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <button
        aria-label={`Reorder ${title}`}
        className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        type="button"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-4" />
      </button>
      <span className="text-muted-foreground w-4 tabular-nums">
        {index + 1}
      </span>
      <span className="flex-1 text-sm">{title}</span>
      <Button
        aria-label={isVisible ? `Hide ${title}` : `Show ${title}`}
        onClick={onToggleVisibility}
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        {isVisible ? (
          <EyeIcon className="size-4" />
        ) : (
          <EyeOffIcon className="text-muted-foreground size-4" />
        )}
      </Button>
    </div>
  );
};

export const SectionsPopover = ({
  document,
  onChange,
}: SectionsPopoverProps) => {
  const [newSectionTitle, setNewSectionTitle] = useState("");

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

    onChange((current) =>
      reorderSections(current, String(active.id), String(over.id))
    );
  };

  const handleAddSection = () => {
    const title = newSectionTitle.trim() || "Custom section";
    onChange((current) => addCustomSection(current, title));
    setNewSectionTitle("");
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button type="button" variant="outline">
            <ArrowUpDownIcon data-icon="inline-start" />
            Sections
          </Button>
        }
      />
      <PopoverContent align="start" className="w-72">
        <PopoverHeader>
          <PopoverTitle>Sections</PopoverTitle>
          <p className="text-muted-foreground text-xs">
            Drag to reorder. Use the eye icon to show or hide a section.
          </p>
        </PopoverHeader>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={document.sectionOrder}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-1">
              {document.sectionOrder.map((sectionId, index) => (
                <SortableSectionRow
                  id={sectionId}
                  index={index}
                  isVisible={isSectionVisible(document, sectionId)}
                  key={sectionId}
                  onToggleVisibility={() => {
                    onChange((current) =>
                      toggleSectionVisibility(current, sectionId)
                    );
                  }}
                  title={getSectionTitle(document, sectionId)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="mt-3 flex gap-2">
          <Input
            onChange={(event) => setNewSectionTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddSection();
              }
            }}
            placeholder="New section title"
            value={newSectionTitle}
          />
          <Button onClick={handleAddSection} type="button" variant="outline">
            <PlusIcon data-icon="inline-start" />
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const getVisibleSections = (document: ResumeDocument) =>
  getVisibleSectionIds(document);
