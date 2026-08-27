"use client";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@doresume/ui/components/empty";
import { Input } from "@doresume/ui/components/input";
import { Label } from "@doresume/ui/components/label";
import { Switch } from "@doresume/ui/components/switch";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@doresume/ui/components/toggle-group";
import Link from "next/link";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useState } from "react";

import { INBOX_CATEGORIES, INBOX_FILTERS, INBOX_MAILS } from "./inbox-mails";
import type { InboxFilter, InboxMail } from "./inbox-mails";

const inboxCategoryParser = parseAsStringLiteral(INBOX_CATEGORIES);

const InboxMailItem = ({ mail }: { mail: InboxMail }) => (
  <Link
    className="hover:bg-accent hover:text-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
    href={`#${mail.email}`}
  >
    <div className="flex w-full items-center gap-2">
      <span>{mail.name}</span>
      <span className="ml-auto text-xs">{mail.date}</span>
    </div>
    <span className="font-medium">{mail.subject}</span>
    <span className="line-clamp-2 w-[260px] text-xs whitespace-break-spaces">
      {mail.teaser}
    </span>
  </Link>
);

const isInboxFilter = (value: string): value is InboxFilter =>
  INBOX_FILTERS.some((filter) => filter.value === value);

const InboxFilterBar = ({
  value,
  onChange,
}: {
  onChange: (filter: InboxFilter) => void;
  value: InboxFilter;
}) => (
  <ToggleGroup
    aria-label="Filter messages"
    className="flex flex-wrap"
    onValueChange={([selected]) => {
      if (selected && isInboxFilter(selected)) {
        onChange(selected);
      }
    }}
    spacing={1}
    value={[value]}
  >
    {INBOX_FILTERS.map((filter) => (
      <ToggleGroupItem
        className="aria-pressed:bg-primary aria-pressed:text-primary-foreground rounded-full"
        key={filter.value}
        size="sm"
        value={filter.value}
        variant="outline"
      >
        {filter.label}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
);

export const Inbox = () => {
  const [category, setCategory] = useQueryState(
    "category",
    inboxCategoryParser
  );
  const [query, setQuery] = useState("");
  const filter: InboxFilter = category ?? "all";
  const normalizedQuery = query.trim().toLowerCase();
  const mails = INBOX_MAILS.filter((mail) => {
    const matchesFilter = category === null || mail.category === category;

    if (!matchesFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack =
      `${mail.name} ${mail.subject} ${mail.teaser}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return (
    <div className="-m-4 flex h-[calc(100%+2rem)] flex-col overflow-hidden">
      <div className="border-b p-4">
        <InboxFilterBar
          onChange={(next) => {
            void setCategory(next === "all" ? null : next);
          }}
          value={filter}
        />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex w-[350px] shrink-0 flex-col border-r">
          <div className="flex items-center gap-2 border-b p-4">
            <Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search..."
              value={query}
            />
            <Label htmlFor="inbox-unreads">
              Unreads
              <Switch id="inbox-unreads" />
            </Label>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {mails.length > 0 ? (
              mails.map((mail) => (
                <InboxMailItem key={mail.email} mail={mail} />
              ))
            ) : (
              <Empty className="h-full border-0">
                <EmptyHeader>
                  <EmptyTitle>No messages</EmptyTitle>
                  <EmptyDescription>
                    Nothing matches this filter.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </div>
        <div aria-hidden="true" className="bg-muted/50 min-w-0 flex-1" />
      </div>
    </div>
  );
};
