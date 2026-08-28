"use client";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@doresume/ui/components/attachment";
import { Button } from "@doresume/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@doresume/ui/components/empty";
import { Spinner } from "@doresume/ui/components/spinner";
import { cn } from "@doresume/ui/lib/utils";
import type { UseFilesResult } from "files-sdk/react";
import { FileTextIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const MAX_RESUME_BYTES = 10 * 1024 * 1024;
const RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const RESUME_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);
const RESUME_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export interface UploadedResume {
  key: string;
  name: string;
  size: number;
}

interface ResumeDropzoneProps {
  files: UseFilesResult;
  onClear: () => void;
  onUploaded: (resume: UploadedResume) => void;
  uploaded: UploadedResume | null;
}

const getFileExtension = (name: string) => {
  const separatorIndex = name.lastIndexOf(".");
  return separatorIndex === -1 ? "" : name.slice(separatorIndex).toLowerCase();
};

const isResumeFile = (file: File) => {
  if (RESUME_MIME_TYPES.has(file.type)) {
    return true;
  }

  return RESUME_EXTENSIONS.has(getFileExtension(file.name));
};

const resumeKindLabel = (name: string) => {
  const extension = getFileExtension(name).slice(1).toUpperCase();
  return extension.length > 0 ? extension : "File";
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isAbortError = (error: unknown) =>
  error instanceof Error && error.name === "AbortError";

const EmptyResumeDropzone = ({
  disabled,
  isDragActive,
  onDragActiveChange,
  onFiles,
  onPick,
}: {
  disabled: boolean;
  isDragActive: boolean;
  onDragActiveChange: (active: boolean) => void;
  onFiles: (fileList: FileList | null) => void;
  onPick: () => void;
}) => (
  <Empty
    className={cn(isDragActive && "ring-ring/30 ring-2")}
    onDragLeave={(event) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
        return;
      }

      onDragActiveChange(false);
    }}
    onDragOver={(event) => {
      event.preventDefault();
      onDragActiveChange(true);
    }}
    onDrop={(event) => {
      event.preventDefault();
      onDragActiveChange(false);
      onFiles(event.dataTransfer.files);
    }}
  >
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <UploadIcon />
      </EmptyMedia>
      <EmptyTitle>Drop your resume here</EmptyTitle>
      <EmptyDescription>PDF, DOC, or DOCX · up to 10 MB</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button
        disabled={disabled}
        type="button"
        variant="outline"
        onClick={onPick}
      >
        <UploadIcon data-icon="inline-start" />
        Choose file
      </Button>
    </EmptyContent>
  </Empty>
);

const UploadingResumeAttachment = ({
  name,
  onCancel,
  percent,
}: {
  name: string;
  onCancel: () => void;
  percent: number;
}) => (
  <Attachment className="w-full" state="uploading">
    <AttachmentMedia>
      <Spinner />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>{name}</AttachmentTitle>
      <AttachmentDescription>Uploading · {percent}%</AttachmentDescription>
    </AttachmentContent>
    <AttachmentActions>
      <AttachmentAction
        aria-label="Cancel upload"
        type="button"
        onClick={onCancel}
      >
        <XIcon />
      </AttachmentAction>
    </AttachmentActions>
  </Attachment>
);

const UploadedResumeAttachment = ({
  onPick,
  onRemove,
  resume,
}: {
  onPick: () => void;
  onRemove: () => void;
  resume: UploadedResume;
}) => (
  <Attachment className="w-full">
    <AttachmentMedia>
      <FileTextIcon />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>{resume.name}</AttachmentTitle>
      <AttachmentDescription>
        {resumeKindLabel(resume.name)} · {formatFileSize(resume.size)}
      </AttachmentDescription>
    </AttachmentContent>
    <AttachmentActions>
      <AttachmentAction
        aria-label={`Remove ${resume.name}`}
        type="button"
        onClick={onRemove}
      >
        <XIcon />
      </AttachmentAction>
    </AttachmentActions>
    <AttachmentTrigger aria-label={`Replace ${resume.name}`} onClick={onPick} />
  </Attachment>
);

const ResumeDropzone = ({
  files,
  onClear,
  onUploaded,
  uploaded,
}: ResumeDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [pendingName, setPendingName] = useState<string | null>(null);

  const { abort, isUploading, progress, reset } = files;
  const uploadPercent = Math.round(progress.fraction * 100);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const clearResume = () => {
    reset();
    setPendingName(null);
    onClear();
  };

  const uploadResume = async (file: File) => {
    if (!isResumeFile(file)) {
      throw new Error("Use a PDF, DOC, or DOCX file.");
    }

    if (file.size > MAX_RESUME_BYTES) {
      throw new Error("Resume must be 10 MB or smaller.");
    }

    setPendingName(file.name);
    const result = await files.upload(file, { contentType: file.type });
    onUploaded({
      key: result.key,
      name: file.name,
      size: file.size,
    });
    setPendingName(null);
  };

  const handleFiles = async (fileList: FileList | null) => {
    const file = fileList?.[0];

    if (!file || isUploading) {
      return;
    }

    try {
      await uploadResume(file);
    } catch (error: unknown) {
      setPendingName(null);

      if (isAbortError(error)) {
        return;
      }

      toast.error(
        error instanceof Error ? error.message : "Could not upload resume."
      );
    }
  };

  let attachment = (
    <EmptyResumeDropzone
      disabled={isUploading}
      isDragActive={isDragActive}
      onDragActiveChange={setIsDragActive}
      onFiles={(fileList) => {
        void handleFiles(fileList);
      }}
      onPick={openPicker}
    />
  );

  if (isUploading) {
    attachment = (
      <UploadingResumeAttachment
        name={pendingName ?? uploaded?.name ?? "Resume"}
        percent={uploadPercent}
        onCancel={() => {
          abort();
          clearResume();
        }}
      />
    );
  } else if (uploaded) {
    attachment = (
      <UploadedResumeAttachment
        resume={uploaded}
        onPick={openPicker}
        onRemove={clearResume}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        accept={RESUME_ACCEPT}
        aria-hidden
        className="sr-only"
        disabled={isUploading}
        tabIndex={-1}
        type="file"
        onChange={(event) => {
          void handleFiles(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />
      {attachment}
    </div>
  );
};

export { ResumeDropzone };
