"use client";

import type {
  ApplicationFormSnapshot,
  FormFieldDefinition,
} from "@doresume/ats-adapters";
import { Badge } from "@doresume/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@doresume/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@doresume/ui/components/empty";
import { Separator } from "@doresume/ui/components/separator";
import { FileTextIcon } from "lucide-react";

import { FieldRegistry } from "./field-registry";

// ---------------------------------------------------------------------------
// Group fields by their section label
// ---------------------------------------------------------------------------

const groupBySection = (
  fields: FormFieldDefinition[]
): Map<string, FormFieldDefinition[]> => {
  const map = new Map<string, FormFieldDefinition[]>();
  for (const field of fields) {
    const section = field.section ?? "General";
    const existing = map.get(section);
    if (existing) {
      existing.push(field);
    } else {
      map.set(section, [field]);
    }
  }
  return map;
};

// ---------------------------------------------------------------------------
// Provider label mapping
// ---------------------------------------------------------------------------

const PROVIDER_LABELS: Record<string, string> = {
  ashby: "Ashby",
  generic: "Custom Portal",
  greenhouse: "Greenhouse",
  lever: "Lever",
  linkedin: "LinkedIn",
  smartrecruiters: "SmartRecruiters",
  taleo: "Taleo",
  workday: "Workday",
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface ApplicationFormSnapshotViewProps {
  snapshot: ApplicationFormSnapshot | null | undefined;
}

export const ApplicationFormSnapshotView = ({
  snapshot,
}: ApplicationFormSnapshotViewProps) => {
  const sections = snapshot ? groupBySection(snapshot.fields) : null;

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1>Application Form</h1>
          <p className="text-muted-foreground text-sm">
            {snapshot
              ? `${snapshot.submittedAt ? "Submitted" : "Captured"} via ${PROVIDER_LABELS[snapshot.provider] ?? snapshot.portalName ?? snapshot.provider}`
              : "Review the form fields and answers recorded by the agent."}
          </p>
        </div>
        {snapshot ? (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {PROVIDER_LABELS[snapshot.provider] ??
                snapshot.portalName ??
                snapshot.provider}
            </Badge>
            <Badge variant="outline">{snapshot.fields.length} fields</Badge>
          </div>
        ) : null}
      </div>

      <Separator />

      {/* Content */}
      {!snapshot || snapshot.fields.length === 0 ? (
        <Empty className="border border-dashed py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileTextIcon />
            </EmptyMedia>
            <EmptyTitle>No form data yet</EmptyTitle>
            <EmptyDescription>
              The apply-agent has not submitted or captured this application
              form yet.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          {sections &&
            [...sections.entries()].map(([sectionTitle, fields]) => (
              <Card key={sectionTitle}>
                <CardHeader className="pb-3">
                  <CardTitle>{sectionTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {fields.map((field) => {
                      const Component =
                        FieldRegistry[field.type] ?? FieldRegistry.text;
                      return (
                        <Component
                          key={field.id}
                          field={field}
                          value={snapshot.values[field.id]}
                        />
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};
