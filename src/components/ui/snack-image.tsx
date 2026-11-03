"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { isOptimizableImage } from "@/lib/storage";
import { cn } from "@/lib/utils";

type SnackImageProps = Omit<ImageProps, "src"> & { src: string };

/**
 * next/image wrapper that serves our own uploads through the optimizer,
 * falls back to the raw file for other hosts, and shows a calm placeholder if loading fails.
 */
export function SnackImage({ src, alt, className, ...props }: SnackImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={cn("flex size-full items-center justify-center bg-ink-800 text-mist-500", className)} role="img" aria-label={alt}>
        <ImageOff className="size-8" aria-hidden />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      unoptimized={!isOptimizableImage(src)}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
