"use client";

import type { EducationEntry, ResumeDocument } from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import { Input } from "@doresume/ui/components/input";
import { PlusIcon } from "lucide-react";

import {
  addEducation,
  addEducationBullet,
  removeEducationBullet,
  reorderEducation,
  reorderEducationBullets,
  toggleEducationVisibility,
  updateEducation,
} from "../lib/resume-actions";
import { SortableBullets } from "./sortable-bullets";
import { SortableEntryList } from "./sortable-entry-list";

interface EducationSectionProps {
  document: ResumeDocument;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  showHeading?: boolean;
}

const EducationEntryFields = ({
  entry,
  onChange,
}: {
  entry: EducationEntry;
  onChange: (entry: EducationEntry) => void;
}) => (
  <div className="flex flex-col gap-3">
    <div className="grid gap-2 sm:grid-cols-2">
      <Input
        onChange={(event) => onChange({ ...entry, school: event.target.value })}
        placeholder="School"
        value={entry.school}
      />
      <Input
        onChange={(event) => onChange({ ...entry, degree: event.target.value })}
        placeholder="Degree"
        value={entry.degree}
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
      onAdd={() => onChange(addEducationBullet(entry))}
      onChange={(bulletId, text) => {
        onChange({
          ...entry,
          bullets: entry.bullets.map((bullet) =>
            bullet.id === bulletId ? { ...bullet, text } : bullet
          ),
        });
      }}
      onRemove={(bulletId) => onChange(removeEducationBullet(entry, bulletId))}
      onReorder={(activeId, overId) => {
        onChange(reorderEducationBullets(entry, activeId, overId));
      }}
    />
  </div>
);

export const EducationSection = ({
  document,
  onChange,
  showHeading = true,
}: EducationSectionProps) => (
  <section className="flex flex-col gap-3">
    {showHeading ? (
      <div className="flex items-center justify-between gap-2">
        <h2 className="border-foreground/20 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
          Education
        </h2>
        <Button
          onClick={() => onChange(addEducation)}
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
      emptyMessage="No education entries yet. Add your first school."
      getSubtitle={(entry) =>
        [entry.startDate, entry.endDate].filter(Boolean).join(" – ")
      }
      getTitle={(entry) =>
        [entry.degree, entry.school].filter(Boolean).join(" — ") ||
        "Untitled education"
      }
      items={document.education}
      onRemove={(entryId) => {
        onChange((current) => ({
          ...current,
          education: current.education.filter((item) => item.id !== entryId),
        }));
      }}
      onReorder={(activeId, overId) => {
        onChange((current) => reorderEducation(current, activeId, overId));
      }}
      onToggleVisible={(entryId) => {
        onChange((current) => toggleEducationVisibility(current, entryId));
      }}
      renderItem={(entry) => (
        <EducationEntryFields
          entry={entry}
          onChange={(nextEntry) => {
            onChange((current) =>
              updateEducation(current, entry.id, nextEntry)
            );
          }}
        />
      )}
    />
    {showHeading ? null : (
      <Button
        className="w-full"
        onClick={() => onChange(addEducation)}
        type="button"
        variant="ghost"
      >
        <PlusIcon data-icon="inline-start" />
        Add one more education
      </Button>
    )}
  </section>
);
