"use client";

import type { DocumentBundle, DocumentsState } from "@doresume/contracts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@doresume/ui/components/alert-dialog";
import { Button } from "@doresume/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@doresume/ui/components/dropdown-menu";
import { Input } from "@doresume/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@doresume/ui/components/popover";
import { cn } from "@doresume/ui/lib/utils";
import {
  ChevronDownIcon,
  PencilIcon,
  PlusIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";

interface DocumentSelectorProps {
  activeDocument: DocumentBundle;
  canDelete: boolean;
  documents: DocumentsState["documents"];
  onAddDocument: () => void;
  onDeleteDocument: (documentId: string) => void;
  onRenameDocument: (documentId: string, name: string) => void;
  onSwitchDocument: (documentId: string) => void;
  onToggleStarred: (documentId: string) => void;
}

const DocumentGroupDivider = () => (
  <div aria-hidden className="bg-border mx-0.5 h-4 w-px shrink-0" />
);

export const DocumentSelector = ({
  activeDocument,
  canDelete,
  onAddDocument,
  onDeleteDocument,
  onRenameDocument,
  onSwitchDocument,
  onToggleStarred,
  documents,
}: DocumentSelectorProps) => {
  const [renameValue, setRenameValue] = useState(activeDocument.name);
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const handleRenameOpenChange = (open: boolean) => {
    setIsRenameOpen(open);

    if (open) {
      setRenameValue(activeDocument.name);
    }
  };

  const handleRenameSubmit = () => {
    const trimmedName = renameValue.trim();

    if (!trimmedName || trimmedName === activeDocument.name) {
      setIsRenameOpen(false);
      return;
    }

    onRenameDocument(activeDocument.id, trimmedName);
    setIsRenameOpen(false);
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <div className="bg-background flex h-8 items-center rounded-md border pr-0.5 pl-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                className="h-7 max-w-40 gap-1 px-2 font-medium"
              />
            }
          >
            <span className="truncate">{activeDocument.name}</span>
            <ChevronDownIcon className="text-muted-foreground size-4 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-48">
            {documents.map((entry) => (
              <DropdownMenuItem
                key={entry.id}
                className={cn(
                  entry.id === activeDocument.id && "bg-muted font-medium"
                )}
                onClick={() => {
                  void onSwitchDocument(entry.id);
                }}
              >
                <span className="flex-1 truncate">{entry.name}</span>
                {entry.starred ? (
                  <StarIcon className="size-3.5 fill-current text-amber-500" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DocumentGroupDivider />

        <Popover onOpenChange={handleRenameOpenChange} open={isRenameOpen}>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground size-7"
              />
            }
          >
            <PencilIcon className="size-3.5" />
            <span className="sr-only">Rename document</span>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56">
            <form
              className="flex flex-col gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                handleRenameSubmit();
              }}
            >
              <Input
                autoFocus
                onChange={(event) => setRenameValue(event.target.value)}
                placeholder="Document name"
                value={renameValue}
              />
              <Button size="sm" type="submit">
                Save name
              </Button>
            </form>
          </PopoverContent>
        </Popover>

        <DocumentGroupDivider />

        <Button
          aria-label={
            activeDocument.starred ? "Remove as default" : "Set as default"
          }
          aria-pressed={activeDocument.starred}
          className={cn(
            "size-7",
            activeDocument.starred
              ? "text-amber-500 hover:text-amber-600"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => {
            void onToggleStarred(activeDocument.id);
          }}
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <StarIcon
            className={cn("size-3.5", activeDocument.starred && "fill-current")}
          />
        </Button>

        <DocumentGroupDivider />

        <AlertDialog>
          <AlertDialogTrigger
            disabled={!canDelete}
            render={
              <Button
                aria-label="Delete document"
                className="text-muted-foreground/70 hover:bg-destructive/10 hover:text-destructive size-7 disabled:opacity-40"
                size="icon-xs"
                type="button"
                variant="ghost"
              />
            }
          >
            <Trash2Icon className="size-3.5" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {activeDocument.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This document and its resume content will be removed
                permanently.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  void onDeleteDocument(activeDocument.id);
                }}
                variant="destructive"
              >
                Delete document
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Button
        className="text-muted-foreground hover:text-foreground h-8 px-2"
        onClick={() => {
          void onAddDocument();
        }}
        type="button"
        variant="ghost"
      >
        <PlusIcon className="size-3.5" data-icon="inline-start" />
        Add document
      </Button>
    </div>
  );
};
