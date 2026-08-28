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
import type { ResumeBullet } from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import { cn } from "@doresume/ui/lib/utils";
import { GripVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { ResumeTextEditor } from "../resume-text-editor";

interface SortableBulletsProps {
  bullets: ResumeBullet[];
  onAdd: () => void;
  onChange: (bulletId: string, text: string) => void;
  onRemove: (bulletId: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  placeholder?: string;
}

const SortableBulletRow = ({
  bullet,
  onChange,
  onRemove,
  placeholder,
}: {
  bullet: ResumeBullet;
  onChange: (text: string) => void;
  onRemove: () => void;
  placeholder?: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bullet.id });

  return (
    <div
      className={cn("flex items-start gap-2", isDragging && "opacity-60")}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <button
        aria-label="Reorder bullet"
        className="text-muted-foreground hover:text-foreground mt-2 cursor-grab active:cursor-grabbing"
        type="button"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-4" />
      </button>
      <ResumeTextEditor
        className="min-h-16 flex-1"
        onChange={onChange}
        placeholder={placeholder ?? "Describe your impact..."}
        value={bullet.text ?? ""}
      />
      <Button
        aria-label="Remove bullet"
        onClick={onRemove}
        size="icon"
        type="button"
        variant="ghost"
      >
        <Trash2Icon />
      </Button>
    </div>
  );
};

export const SortableBullets = ({
  bullets,
  onAdd,
  onChange,
  onRemove,
  onReorder,
  placeholder,
}: SortableBulletsProps) => {
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

  return (
    <div className="flex flex-col gap-1">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={bullets.map((bullet) => bullet.id)}
          strategy={verticalListSortingStrategy}
        >
          {bullets.map((bullet) => (
            <SortableBulletRow
              bullet={bullet}
              key={bullet.id}
              onChange={(text) => onChange(bullet.id, text)}
              onRemove={() => onRemove(bullet.id)}
              placeholder={placeholder}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button onClick={onAdd} type="button" variant="ghost">
        <PlusIcon data-icon="inline-start" />
        Add bullet
      </Button>
    </div>
  );
};
