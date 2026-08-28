"use client";

import type { ResumeDocument } from "@doresume/contracts";
import { Input } from "@doresume/ui/components/input";
import { Label } from "@doresume/ui/components/label";

import { updateHeader } from "../lib/resume-actions";

interface HeaderSectionProps {
  document: ResumeDocument;
  onChange: (updater: (current: ResumeDocument) => ResumeDocument) => void;
  variant?: "form" | "preview";
}

export const HeaderSection = ({
  document,
  onChange,
  variant = "preview",
}: HeaderSectionProps) => {
  if (variant === "form") {
    return (
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="resume-name">Full name</Label>
          <Input
            id="resume-name"
            onChange={(event) => {
              onChange((current) =>
                updateHeader(current, {
                  ...current.header,
                  name: event.target.value,
                })
              );
            }}
            placeholder="Your name"
            value={document.header.name}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="resume-title">Job title</Label>
          <Input
            id="resume-title"
            onChange={(event) => {
              onChange((current) =>
                updateHeader(current, {
                  ...current.header,
                  title: event.target.value,
                })
              );
            }}
            placeholder="Professional title"
            value={document.header.title ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resume-email">Email</Label>
          <Input
            id="resume-email"
            onChange={(event) => {
              onChange((current) =>
                updateHeader(current, {
                  ...current.header,
                  email: event.target.value,
                })
              );
            }}
            placeholder="you@email.com"
            type="email"
            value={document.header.email ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resume-phone">Phone</Label>
          <Input
            id="resume-phone"
            onChange={(event) => {
              onChange((current) =>
                updateHeader(current, {
                  ...current.header,
                  phone: event.target.value,
                })
              );
            }}
            placeholder="+1 555 000 0000"
            value={document.header.phone ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resume-linkedin">LinkedIn</Label>
          <Input
            id="resume-linkedin"
            onChange={(event) => {
              onChange((current) =>
                updateHeader(current, {
                  ...current.header,
                  linkedin: event.target.value,
                })
              );
            }}
            placeholder="linkedin.com/in/you"
            value={document.header.linkedin ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resume-location">Location</Label>
          <Input
            id="resume-location"
            onChange={(event) => {
              onChange((current) =>
                updateHeader(current, {
                  ...current.header,
                  location: event.target.value,
                })
              );
            }}
            placeholder="Location"
            value={document.header.location ?? ""}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 text-center">
      <Input
        className="border-none bg-transparent text-center text-2xl font-semibold shadow-none focus-visible:ring-0"
        onChange={(event) => {
          onChange((current) =>
            updateHeader(current, {
              ...current.header,
              name: event.target.value,
            })
          );
        }}
        placeholder="Your name"
        value={document.header.name}
      />
      <Input
        className="border-none bg-transparent text-center text-sm shadow-none focus-visible:ring-0"
        onChange={(event) => {
          onChange((current) =>
            updateHeader(current, {
              ...current.header,
              title: event.target.value,
            })
          );
        }}
        placeholder="Professional title"
        value={document.header.title ?? ""}
      />
      <div className="text-muted-foreground flex flex-wrap justify-center gap-2 text-xs">
        <Input
          className="h-7 w-auto min-w-28 border-none bg-transparent text-center shadow-none focus-visible:ring-0"
          onChange={(event) => {
            onChange((current) =>
              updateHeader(current, {
                ...current.header,
                email: event.target.value,
              })
            );
          }}
          placeholder="Email"
          value={document.header.email ?? ""}
        />
        <Input
          className="h-7 w-auto min-w-28 border-none bg-transparent text-center shadow-none focus-visible:ring-0"
          onChange={(event) => {
            onChange((current) =>
              updateHeader(current, {
                ...current.header,
                phone: event.target.value,
              })
            );
          }}
          placeholder="Phone"
          value={document.header.phone ?? ""}
        />
        <Input
          className="h-7 w-auto min-w-28 border-none bg-transparent text-center shadow-none focus-visible:ring-0"
          onChange={(event) => {
            onChange((current) =>
              updateHeader(current, {
                ...current.header,
                linkedin: event.target.value,
              })
            );
          }}
          placeholder="LinkedIn"
          value={document.header.linkedin ?? ""}
        />
        <Input
          className="h-7 w-auto min-w-28 border-none bg-transparent text-center shadow-none focus-visible:ring-0"
          onChange={(event) => {
            onChange((current) =>
              updateHeader(current, {
                ...current.header,
                location: event.target.value,
              })
            );
          }}
          placeholder="Location"
          value={document.header.location ?? ""}
        />
      </div>
    </section>
  );
};
