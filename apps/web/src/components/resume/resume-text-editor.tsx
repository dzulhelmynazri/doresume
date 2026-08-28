"use client";

import { cn } from "@doresume/ui/lib/utils";
import { Extension } from "@tiptap/core";
import type { JSONContent } from "@tiptap/core";
import { Placeholder } from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";

interface ResumeTextEditorProps {
  className?: string;
  lineBreakOnEnter?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}

const EnterAsHardBreak = Extension.create({
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => editor.commands.setHardBreak(),
    };
  },
  name: "enterAsHardBreak",
  priority: 1000,
});

const plainTextToParagraphDoc = (text: string): JSONContent => {
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

const plainTextToLineBreakDoc = (text: string): JSONContent => {
  if (!text) {
    return { content: [], type: "doc" };
  }

  const lines = text.split("\n");
  const inlineContent: JSONContent[] = [];

  for (const [index, line] of lines.entries()) {
    if (line.length > 0) {
      inlineContent.push({ text: line, type: "text" });
    }

    if (index < lines.length - 1) {
      inlineContent.push({ type: "hardBreak" });
    }
  }

  return {
    content: [{ content: inlineContent, type: "paragraph" }],
    type: "doc",
  };
};

const setPlainTextContent = (
  editor: NonNullable<ReturnType<typeof useEditor>>,
  text: string,
  lineBreakOnEnter: boolean
) => {
  if (editor.isDestroyed) {
    return;
  }

  const toDoc = lineBreakOnEnter
    ? plainTextToLineBreakDoc
    : plainTextToParagraphDoc;

  editor.commands.setContent(toDoc(text), { emitUpdate: false });
};

export const ResumeTextEditor = ({
  className,
  lineBreakOnEnter = false,
  onChange,
  placeholder,
  value,
}: ResumeTextEditorProps) => {
  const safeValue = value ?? "";
  const lastEmittedValue = useRef(safeValue);

  const editor = useEditor(
    {
      content: lineBreakOnEnter
        ? plainTextToLineBreakDoc(safeValue)
        : plainTextToParagraphDoc(safeValue),
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
        ...(lineBreakOnEnter ? [EnterAsHardBreak] : []),
      ],
      immediatelyRender: false,
      onUpdate: ({ editor: currentEditor }) => {
        const nextValue = currentEditor.getText();
        lastEmittedValue.current = nextValue;
        onChange(nextValue);
      },
      shouldRerenderOnTransaction: false,
    },
    [lineBreakOnEnter, placeholder]
  );

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
    setPlainTextContent(editor, safeValue, lineBreakOnEnter);
  }, [editor, lineBreakOnEnter, safeValue]);

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
