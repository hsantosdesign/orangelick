"use client";

import { useCallback, useId, useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/env";
import { ACCEPTED_IMAGE_TYPES, buildImagePath, validateImageFile } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SnackImage } from "@/components/ui/snack-image";

interface ImageDropzoneProps {
  id: string;
  value: string;
  onChange: (url: string) => void;
  folder: "products" | "posts";
  error?: string;
  aspect?: "square" | "wide";
  onUploadingChange?: (uploading: boolean) => void;
}

/** Drag & drop (or click/paste) image uploader that stores files and returns their public address. */
export function ImageDropzone({ id, value, onChange, folder, error, aspect = "square", onUploadingChange }: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const setBusy = useCallback(
    (busy: boolean) => {
      setUploading(busy);
      onUploadingChange?.(busy);
    },
    [onUploadingChange],
  );

  const upload = useCallback(
    async (file: File) => {
      const problem = validateImageFile(file);
      if (problem) {
        setUploadError(problem);
        return;
      }

      setUploadError(null);
      const preview = URL.createObjectURL(file);
      setLocalPreview(preview);
      setBusy(true);

      try {
        const supabase = createClient();
        const path = buildImagePath(folder, file);
        const { error: uploadErr } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
          cacheControl: "31536000",
          contentType: file.type,
          upsert: false,
        });
        if (uploadErr) throw uploadErr;

        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        onChange(data.publicUrl);
      } catch (err) {
        console.error("[upload] failed:", err);
        setUploadError("We couldn't upload that image. Please check your connection and try again.");
      } finally {
        setBusy(false);
        setLocalPreview(null);
        URL.revokeObjectURL(preview);
      }
    },
    [folder, onChange, setBusy],
  );

  const onFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) void upload(file);
  };

  const shown = localPreview ?? value;
  const message = uploadError ?? error;

  return (
    <div>
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          if (!uploading) setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!uploading) onFiles(e.dataTransfer.files);
        }}
        onPaste={(e) => {
          const file = Array.from(e.clipboardData.files)[0];
          if (file) {
            e.preventDefault();
            void upload(file);
          }
        }}
        className={cn(
          "group relative overflow-hidden rounded-2xl border-2 border-dashed transition-all",
          aspect === "square" ? "aspect-[4/3] sm:aspect-square" : "aspect-[16/9]",
          dragging ? "scale-[1.01] border-brand bg-brand/10" : message ? "border-red-400/60 bg-red-400/5" : "border-white/15 bg-ink-900/60",
        )}
      >
        {shown ? (
          <>
            <SnackImage src={shown} alt="Selected image preview" fill sizes="(min-width: 640px) 400px, 100vw" className="object-cover" />
            <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-ink/80 via-transparent to-transparent p-3 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
              <Button size="sm" variant="light" onClick={() => inputRef.current?.click()} disabled={uploading}>
                <RefreshCw /> Replace
              </Button>
              <Button size="sm" variant="danger" onClick={() => onChange("")} disabled={uploading} aria-label="Remove image">
                <Trash2 />
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            aria-describedby={hintId}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
          >
            <span
              className={cn(
                "flex size-16 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/25 transition-transform",
                dragging && "scale-110",
              )}
            >
              {dragging ? <UploadCloud className="size-7" /> : <ImagePlus className="size-7" />}
            </span>
            <span className="font-semibold text-white">{dragging ? "Drop it here" : "Drag & drop an image"}</span>
            <span className="text-sm text-mist-400">
              or <span className="text-brand underline underline-offset-4">browse your files</span>
            </span>
          </button>
        )}

        {uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/70 backdrop-blur-sm" role="status">
            <Loader2 className="size-8 animate-spin text-brand" aria-hidden />
            <span className="text-sm font-medium text-white">Uploading image...</span>
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {message ? (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {message}
        </p>
      ) : (
        <p id={hintId} className="mt-2 text-sm text-mist-500">
          JPG, PNG, WebP, AVIF or GIF, up to 5 MB. You can also paste an image.
        </p>
      )}
    </div>
  );
}
