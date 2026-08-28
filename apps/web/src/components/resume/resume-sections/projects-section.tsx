"use client";

import type { ProjectEntry, ResumeDocument } from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import { Input } from "@doresume/ui/components/input";
import { PlusIcon } from "lucide-react";

import {
  addProject,
  addProjectBullet,
  removeProjectBullet,
  reorderProjectBullets,
  reorderProjects,
  toggleProjectVisibility,
  updateProject,
} from "../lib/resume-actions";
import { SortableBullets } from "./sortable-bullets";
import { SortableEntryList } from "./sortable-entry-list";

interface ProjectsSectionProps {
  document: ResumeDocument;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  showHeading?: boolean;
}

const ProjectEntryFields = ({
  entry,
  onChange,
}: {
  entry: ProjectEntry;
  onChange: (entry: ProjectEntry) => void;
}) => (
  <div className="flex flex-col gap-3">
    <div className="grid gap-2 sm:grid-cols-2">
      <Input
        onChange={(event) => onChange({ ...entry, name: event.target.value })}
        placeholder="Project name"
        value={entry.name}
      />
      <Input
        onChange={(event) => onChange({ ...entry, url: event.target.value })}
        placeholder="URL"
        value={entry.url ?? ""}
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
      onAdd={() => onChange(addProjectBullet(entry))}
      onChange={(bulletId, text) => {
        onChange({
          ...entry,
          bullets: entry.bullets.map((bullet) =>
            bullet.id === bulletId ? { ...bullet, text } : bullet
          ),
        });
      }}
      onRemove={(bulletId) => onChange(removeProjectBullet(entry, bulletId))}
      onReorder={(activeId, overId) => {
        onChange(reorderProjectBullets(entry, activeId, overId));
      }}
    />
  </div>
);

export const ProjectsSection = ({
  document,
  onChange,
  showHeading = true,
}: ProjectsSectionProps) => (
  <section className="flex flex-col gap-3">
    {showHeading ? (
      <div className="flex items-center justify-between gap-2">
        <h2 className="border-foreground/20 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
          Projects
        </h2>
        <Button
          onClick={() => onChange(addProject)}
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
      emptyMessage="No projects yet. Add your first project."
      getSubtitle={(entry) => entry.url ?? ""}
      getTitle={(entry) => entry.name || "Untitled project"}
      items={document.projects}
      onRemove={(entryId) => {
        onChange((current) => ({
          ...current,
          projects: current.projects.filter((item) => item.id !== entryId),
        }));
      }}
      onReorder={(activeId, overId) => {
        onChange((current) => reorderProjects(current, activeId, overId));
      }}
      onToggleVisible={(entryId) => {
        onChange((current) => toggleProjectVisibility(current, entryId));
      }}
      renderItem={(entry) => (
        <ProjectEntryFields
          entry={entry}
          onChange={(nextEntry) => {
            onChange((current) => updateProject(current, entry.id, nextEntry));
          }}
        />
      )}
    />
    {showHeading ? null : (
      <Button
        className="w-full"
        onClick={() => onChange(addProject)}
        type="button"
        variant="ghost"
      >
        <PlusIcon data-icon="inline-start" />
        Add one more project
      </Button>
    )}
  </section>
);
