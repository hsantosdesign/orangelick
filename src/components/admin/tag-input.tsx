"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
}

/** Chip-style list input: press Enter (or paste several lines) to add items. */
export function TagInput({ id, value, onChange, placeholder, invalid, describedBy }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const add = (items: string[]) => {
    const cleaned = items.map((item) => item.trim()).filter(Boolean);
    if (!cleaned.length) return;
    const existing = new Set(value.map((v) => v.toLowerCase()));
    onChange([...value, ...cleaned.filter((item) => !existing.has(item.toLowerCase()))]);
    setDraft("");
  };

  return (
    <div
      className={cn(
        "flex min-h-12 flex-wrap items-center gap-2 rounded-xl border bg-ink-900/70 px-3 py-2 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30",
        invalid ? "border-red-400/80" : "border-white/10",
      )}
    >
      {value.map((item, index) => (
        <span key={`${item}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-white/10 py-1 pl-3 pr-1 text-sm text-white">
          {item}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            className="inline-flex size-6 items-center justify-center rounded-full text-mist-400 hover:bg-white/10 hover:text-white"
            aria-label={`Remove ${item}`}
          >
            <X className="size-3.5" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add([draft]);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => add([draft])}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text");
          if (/[\n;]/.test(text)) {
            e.preventDefault();
            add(text.split(/[\n;]+/));
          }
        }}
        placeholder={value.length ? "Add another..." : placeholder}
        aria-describedby={describedBy}
        className="h-8 min-w-40 flex-1 bg-transparent text-white placeholder:text-mist-500 focus:outline-none"
      />
    </div>
  );
}
