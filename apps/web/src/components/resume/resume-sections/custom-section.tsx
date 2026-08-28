"use client";

import type {
  CustomSection,
  CustomSectionEntry,
  ResumeDocument,
} from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import { Input } from "@doresume/ui/components/input";
import { PlusIcon } from "lucide-react";

import {
  addCustomEntryBullet,
  addCustomSectionEntry,
  removeCustomEntryBullet,
  reorderCustomEntryBullets,
  reorderCustomSectionEntries,
  toggleCustomSectionEntryVisibility,
  updateCustomSection,
  updateCustomSectionEntry,
} from "../lib/resume-actions";
import { SortableBullets } from "./sortable-bullets";
import { SortableEntryList } from "./sortable-entry-list";

interface CustomSectionEditorProps {
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  section: CustomSection;
}

const CustomSectionEntryFields = ({
  entry,
  onChange,
}: {
  entry: CustomSectionEntry;
  onChange: (entry: CustomSectionEntry) => void;
}) => (
  <div className="flex flex-col gap-3">
    <div className="grid gap-2 sm:grid-cols-2">
      <Input
        onChange={(event) => onChange({ ...entry, name: event.target.value })}
        placeholder="Activity name, job title, book title..."
        value={entry.name ?? ""}
      />
      <Input
        onChange={(event) =>
          onChange({ ...entry, location: event.target.value })
        }
        placeholder="Location"
        value={entry.location ?? ""}
      />
      <Input
        onChange={(event) =>
          onChange({ ...entry, startDate: event.target.value })
        }
        placeholder="Start"
        value={entry.startDate ?? ""}
      />
      <Input
        onChange={(event) =>
          onChange({ ...entry, endDate: event.target.value })
        }
        placeholder="End"
        value={entry.endDate ?? ""}
      />
    </div>
    <SortableBullets
      bullets={entry.bullets}
      onAdd={() => onChange(addCustomEntryBullet(entry))}
      onChange={(bulletId, text) => {
        onChange({
          ...entry,
          bullets: entry.bullets.map((bullet) =>
            bullet.id === bulletId ? { ...bullet, text } : bullet
          ),
        });
      }}
      onRemove={(bulletId) =>
        onChange(removeCustomEntryBullet(entry, bulletId))
      }
      onReorder={(activeId, overId) => {
        onChange(reorderCustomEntryBullets(entry, activeId, overId));
      }}
      placeholder="Description..."
    />
  </div>
);

export const CustomSectionEditor = ({
  onChange,
  section,
}: CustomSectionEditorProps) => (
  <div className="flex flex-col gap-3">
    <Input
      onChange={(event) => {
        onChange((current) => {
          const currentSection = current.customSections.find(
            (item) => item.id === section.id
          );

          if (!currentSection) {
            return current;
          }

          return updateCustomSection(current, section.id, {
            ...currentSection,
            title: event.target.value,
          });
        });
      }}
      placeholder="Section title"
      value={section.title}
    />
    <SortableEntryList
      emptyMessage="No entries yet. Add your first item."
      getSubtitle={(entry) =>
        [entry.startDate, entry.endDate].filter(Boolean).join(" – ")
      }
      getTitle={(entry) => entry.name?.trim() || "Untitled entry"}
      items={section.entries}
      onRemove={(entryId) => {
        onChange((current) => ({
          ...current,
          customSections: current.customSections.map((item) =>
            item.id === section.id
              ? {
                  ...item,
                  entries: item.entries.filter((entry) => entry.id !== entryId),
                }
              : item
          ),
        }));
      }}
      onReorder={(activeId, overId) => {
        onChange((current) => {
          const currentSection = current.customSections.find(
            (item) => item.id === section.id
          );

          if (!currentSection) {
            return current;
          }

          return updateCustomSection(
            current,
            section.id,
            reorderCustomSectionEntries(currentSection, activeId, overId)
          );
        });
      }}
      onToggleVisible={(entryId) => {
        onChange((current) => {
          const currentSection = current.customSections.find(
            (item) => item.id === section.id
          );

          if (!currentSection) {
            return current;
          }

          return updateCustomSection(
            current,
            section.id,
            toggleCustomSectionEntryVisibility(currentSection, entryId)
          );
        });
      }}
      renderItem={(entry) => (
        <CustomSectionEntryFields
          entry={entry}
          onChange={(nextEntry) => {
            onChange((current) =>
              updateCustomSectionEntry(current, section.id, entry.id, nextEntry)
            );
          }}
        />
      )}
    />
    <Button
      className="w-full"
      onClick={() => {
        onChange((current) => addCustomSectionEntry(current, section.id));
      }}
      type="button"
      variant="ghost"
    >
      <PlusIcon data-icon="inline-start" />
      Add one more entry
    </Button>
  </div>
);
