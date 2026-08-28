"use client";

import type { ResumeDocument, WorkExperienceEntry } from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import { Input } from "@doresume/ui/components/input";
import { PlusIcon } from "lucide-react";

import {
  addWorkExperience,
  addWorkExperienceBullet,
  removeWorkExperienceBullet,
  reorderWorkExperience,
  reorderWorkExperienceBullets,
  toggleWorkExperienceVisibility,
  updateWorkExperience,
} from "../lib/resume-actions";
import { SortableBullets } from "./sortable-bullets";
import { SortableEntryList } from "./sortable-entry-list";

interface WorkExperienceSectionProps {
  document: ResumeDocument;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  showHeading?: boolean;
}

const WorkExperienceEntryFields = ({
  entry,
  onChange,
}: {
  entry: WorkExperienceEntry;
  onChange: (entry: WorkExperienceEntry) => void;
}) => (
  <div className="flex flex-col gap-3">
    <div className="grid gap-2 sm:grid-cols-2">
      <Input
        onChange={(event) =>
          onChange({ ...entry, company: event.target.value })
        }
        placeholder="Company"
        value={entry.company}
      />
      <Input
        onChange={(event) => onChange({ ...entry, title: event.target.value })}
        placeholder="Title"
        value={entry.title}
      />
      <Input
        onChange={(event) =>
          onChange({ ...entry, location: event.target.value })
        }
        placeholder="Location"
        value={entry.location ?? ""}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          onChange={(event) =>
            onChange({ ...entry, startDate: event.target.value })
          }
          placeholder="Start"
          value={entry.startDate}
        />
        <Input
          onChange={(event) =>
            onChange({ ...entry, endDate: event.target.value })
          }
          placeholder="End"
          value={entry.endDate ?? ""}
        />
      </div>
    </div>
    <SortableBullets
      bullets={entry.bullets}
      onAdd={() => onChange(addWorkExperienceBullet(entry))}
      onChange={(bulletId, text) => {
        onChange({
          ...entry,
          bullets: entry.bullets.map((bullet) =>
            bullet.id === bulletId ? { ...bullet, text } : bullet
          ),
        });
      }}
      onRemove={(bulletId) =>
        onChange(removeWorkExperienceBullet(entry, bulletId))
      }
      onReorder={(activeId, overId) => {
        onChange(reorderWorkExperienceBullets(entry, activeId, overId));
      }}
    />
  </div>
);

export const WorkExperienceSection = ({
  document,
  onChange,
  showHeading = true,
}: WorkExperienceSectionProps) => (
  <section className="flex flex-col gap-3">
    {showHeading ? (
      <div className="flex items-center justify-between gap-2">
        <h2 className="border-foreground/20 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
          Work Experience
        </h2>
        <Button
          onClick={() => onChange(addWorkExperience)}
          size="sm"
          type="button"
          variant="outline"
        >
          <PlusIcon data-icon="inline-start" />
          Add
        </Button>
      </div>
    ) : null}
    <SortableEntryList
      emptyMessage="No work experience yet. Add your first role."
      getSubtitle={(entry) =>
        [entry.startDate, entry.endDate].filter(Boolean).join(" – ")
      }
      getTitle={(entry) =>
        [entry.title, entry.company].filter(Boolean).join(" at ") ||
        "Untitled role"
      }
      items={document.workExperience}
      onRemove={(entryId) => {
        onChange((current) => ({
          ...current,
          workExperience: current.workExperience.filter(
            (item) => item.id !== entryId
          ),
        }));
      }}
      onReorder={(activeId, overId) => {
        onChange((current) => reorderWorkExperience(current, activeId, overId));
      }}
      onToggleVisible={(entryId) => {
        onChange((current) => toggleWorkExperienceVisibility(current, entryId));
      }}
      renderItem={(entry) => (
        <WorkExperienceEntryFields
          entry={entry}
          onChange={(nextEntry) => {
            onChange((current) =>
              updateWorkExperience(current, entry.id, nextEntry)
            );
          }}
        />
      )}
    />
    {showHeading ? null : (
      <Button
        className="w-full"
        onClick={() => onChange(addWorkExperience)}
        type="button"
        variant="ghost"
      >
        <PlusIcon data-icon="inline-start" />
        Add one more employment
      </Button>
    )}
  </section>
);
