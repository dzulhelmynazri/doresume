"use client";

import { cn } from "@doresume/ui/lib/utils";
import type { JSONContent } from "@tiptap/core";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";

interface ResumeTextEditorProps {
  className?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}

const plainTextToDoc = (text: string): JSONContent => {
  if (!text) {
    return { content: [], type: "doc" };
  }

  const blocks = text.split(/\n{2,}/u);

  return {
    content: blocks.map((block) => ({
      content: block ? [{ text: block, type: "text" }] : [],
      type: "paragraph",
    })),
    type: "doc",
  };
};

const setPlainTextContent = (
  editor: NonNullable<ReturnType<typeof useEditor>>,
  text: string
) => {
  if (editor.isDestroyed) {
    return;
  }

  editor.commands.setContent(plainTextToDoc(text), { emitUpdate: false });
};

export const ResumeTextEditor = ({
  className,
  onChange,
  placeholder,
  value,
}: ResumeTextEditorProps) => {
  const safeValue = value ?? "";
  const lastEmittedValue = useRef(safeValue);

  const editor = useEditor({
    content: plainTextToDoc(safeValue),
    extensions: [
      StarterKit.configure({
        blockquote: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Start typing...",
      }),
    ],
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      const nextValue = currentEditor.getText();
      lastEmittedValue.current = nextValue;
      onChange(nextValue);
    },
    shouldRerenderOnTransaction: false,
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      return;
    }

    if (safeValue === lastEmittedValue.current) {
      return;
    }

    if (editor.isFocused) {
      return;
    }

    lastEmittedValue.current = safeValue;
    setPlainTextContent(editor, safeValue);
  }, [editor, safeValue]);

  if (!editor || editor.isDestroyed) {
    return (
      <div
        className={cn(
          "bg-muted/30 min-h-[6rem] animate-pulse rounded-md border",
          className
        )}
      />
    );
  }

  return (
    <EditorContent
      className={cn(
        "prose prose-sm max-w-none cursor-text",
        "[&_.ProseMirror]:min-h-[1.5rem] [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:m-0",
        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground",
        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left",
        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0",
        "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none",
        className
      )}
      editor={editor}
    />
  );
};
