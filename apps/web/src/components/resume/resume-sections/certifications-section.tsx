"use client";

import type { CertificationEntry, ResumeDocument } from "@doresume/contracts";
import { Button } from "@doresume/ui/components/button";
import { Input } from "@doresume/ui/components/input";
import { PlusIcon } from "lucide-react";

import {
  addCertification,
  reorderCertifications,
  toggleCertificationVisibility,
  updateCertification,
} from "../lib/resume-actions";
import { SortableEntryList } from "./sortable-entry-list";

interface CertificationsSectionProps {
  document: ResumeDocument;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  showHeading?: boolean;
}

const CertificationEntryFields = ({
  entry,
  onChange,
}: {
  entry: CertificationEntry;
  onChange: (entry: CertificationEntry) => void;
}) => (
  <div className="grid gap-2 sm:grid-cols-3">
    <Input
      onChange={(event) => onChange({ ...entry, name: event.target.value })}
      placeholder="Certification"
      value={entry.name}
    />
    <Input
      onChange={(event) => onChange({ ...entry, issuer: event.target.value })}
      placeholder="Issuer"
      value={entry.issuer ?? ""}
    />
    <Input
      onChange={(event) => onChange({ ...entry, date: event.target.value })}
      placeholder="Date"
      value={entry.date ?? ""}
    />
  </div>
);

export const CertificationsSection = ({
  document,
  onChange,
  showHeading = true,
}: CertificationsSectionProps) => (
  <section className="flex flex-col gap-3">
    {showHeading ? (
      <div className="flex items-center justify-between gap-2">
        <h2 className="border-foreground/20 border-b pb-1 text-sm font-semibold tracking-wide uppercase">
          Certifications
        </h2>
        <Button
          onClick={() => onChange(addCertification)}
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
      emptyMessage="No certifications yet. Add your first certification."
      getSubtitle={(entry) =>
        [entry.issuer, entry.date].filter(Boolean).join(" — ")
      }
      getTitle={(entry) => entry.name || "Untitled certification"}
      items={document.certifications}
      onRemove={(entryId) => {
        onChange((current) => ({
          ...current,
          certifications: current.certifications.filter(
            (item) => item.id !== entryId
          ),
        }));
      }}
      onReorder={(activeId, overId) => {
        onChange((current) => reorderCertifications(current, activeId, overId));
      }}
      onToggleVisible={(entryId) => {
        onChange((current) => toggleCertificationVisibility(current, entryId));
      }}
      renderItem={(entry) => (
        <CertificationEntryFields
          entry={entry}
          onChange={(nextEntry) => {
            onChange((current) =>
              updateCertification(current, entry.id, nextEntry)
            );
          }}
        />
      )}
    />
    {showHeading ? null : (
      <Button
        className="w-full"
        onClick={() => onChange(addCertification)}
        type="button"
        variant="ghost"
      >
        <PlusIcon data-icon="inline-start" />
        Add one more certification
      </Button>
    )}
  </section>
);
