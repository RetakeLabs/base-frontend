"use client";

import { useRef, useState, type DragEvent } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useObjectUrl } from "@/lib/use-object-url";

export interface DropzoneProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export function Dropzone({
  onFilesSelected,
  accept,
  multiple = true,
  className,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const imageFile = files.find((file) => file.type.startsWith("image/")) ?? null;
  const previewUrl = useObjectUrl(imageFile);

  function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const next = Array.from(list);
    setFiles(next);
    onFilesSelected?.(next);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 px-4 py-8 text-center transition-colors sm:px-6 sm:py-10",
          isDragging && "border-primary bg-primary/5"
        )}
      >
        <UploadCloud
          className={cn(
            "size-8 text-muted-foreground transition-colors",
            isDragging && "text-primary"
          )}
        />
        <p className="text-sm font-medium">
          Arraste arquivos aqui ou{" "}
          <span className="text-primary">clique para selecionar</span>
        </p>
        <p className="text-xs text-muted-foreground">PNG, JPG ou PDF até 10MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
        {files.length > 0 && (
          <ul className="mt-2 flex w-full flex-col gap-1 text-left text-xs text-muted-foreground">
            {files.map((file) => (
              <li key={file.name} className="truncate">
                {file.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {previewUrl && (
        <div className="w-full max-w-full overflow-hidden rounded-lg border border-border bg-muted/20 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- preview of a user-selected local file (object URL) */}
          <img
            src={previewUrl}
            alt="Pré-visualização"
            className="max-h-40 w-full max-w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
