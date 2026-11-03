"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2, Save, Timer } from "lucide-react";
import { toast } from "sonner";
import type { Post } from "@/types/database";
import { savePost } from "@/app/admin/actions";
import { POST_CATEGORIES } from "@/lib/site";
import { estimateReadTime, slugify } from "@/lib/utils";
import { postSchema, toFieldErrors, type PostFormValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Switch, Textarea } from "@/components/ui/form-controls";
import { ImageDropzone } from "@/components/admin/image-dropzone";

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  category: string;
  read_time: string;
  published: boolean;
  /** Local "YYYY-MM-DDTHH:mm" for the datetime picker. */
  published_at: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

function toLocalInput(iso: string | Date): string {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function toFormState(post: Post | null): FormState {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    cover_image: post?.cover_image ?? "",
    author_name: post?.author_name ?? "",
    category: post?.category ?? "",
    read_time: post?.read_time ?? "",
    published: post?.published ?? true,
    published_at: toLocalInput(post?.published_at ?? new Date()),
  };
}

interface PostFormProps {
  open: boolean;
  post: Post | null;
  categories: string[];
  defaultAuthor?: string;
  onClose: () => void;
  onSaved: (post: Post) => void;
}

export function PostForm({ open, post, categories, defaultAuthor, onClose, onSaved }: PostFormProps) {
  const [values, setValues] = useState<FormState>(() => toFormState(post));
  const [errors, setErrors] = useState<Errors>({});
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      const initial = toFormState(post);
      if (!post && defaultAuthor) initial.author_name = defaultAuthor;
      setValues(initial);
      setErrors({});
      setSlugTouched(Boolean(post));
    }
  }, [open, post, defaultAuthor]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (key === "title" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (uploading) return;

    const publishedAt = new Date(values.published_at);
    const payload: PostFormValues = {
      ...values,
      read_time: values.read_time || estimateReadTime(values.content),
      published_at: Number.isNaN(publishedAt.getTime()) ? "" : publishedAt.toISOString(),
    };

    const check = postSchema.safeParse(payload);
    if (!check.success) {
      setErrors(toFieldErrors<FormState>(check.error));
      toast.error("Please fix the highlighted fields.");
      return;
    }

    startTransition(async () => {
      const result = await savePost(post?.id ?? null, payload);
      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors as Errors);
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      onSaved(result.data);
      onClose();
    });
  };

  const categoryOptions = Array.from(new Set([...POST_CATEGORIES, ...categories])).sort();
  const busy = pending || uploading;
  const submitLabel = post ? "Save changes" : values.published ? "Publish article" : "Save draft";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      locked={pending}
      title={post ? "Edit article" : "Write a new article"}
      description={post ? `Update "${post.title}".` : "Share a recipe, a story or some news. Fields marked * are required."}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="post-form" disabled={busy}>
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />}
            {pending ? "Saving..." : uploading ? "Uploading image..." : submitLabel}
          </Button>
        </>
      }
    >
      <form id="post-form" onSubmit={submit} noValidate className="space-y-6">
        <Field id="post-cover" label="Cover image" required>
          <ImageDropzone
            id="post-cover"
            folder="posts"
            aspect="wide"
            value={values.cover_image}
            onChange={(url) => set("cover_image", url)}
            error={errors.cover_image}
            onUploadingChange={setUploading}
          />
        </Field>

        <Field id="post-title" label="Title" error={errors.title} required>
          <Input id="post-title" value={values.title} onChange={(e) => set("title", e.target.value)} aria-invalid={Boolean(errors.title)} placeholder="Why every kitchen has a jar of sushki" />
        </Field>

        <Field id="post-slug" label="Web address" error={errors.slug} hint={`orangelick.com/blog/${values.slug || "your-article"}`} required>
          <Input
            id="post-slug"
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            aria-invalid={Boolean(errors.slug)}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field id="post-category" label="Category" error={errors.category} required>
            <Input
              id="post-category"
              list="post-category-options"
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
              aria-invalid={Boolean(errors.category)}
              placeholder="Recipes"
            />
            <datalist id="post-category-options">
              {categoryOptions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field id="post-author" label="Author" error={errors.author_name}>
            <Input id="post-author" value={values.author_name} onChange={(e) => set("author_name", e.target.value)} placeholder="Anya Volkova" />
          </Field>
          <Field id="post-read-time" label="Read time" error={errors.read_time} hint="Leave empty to estimate.">
            <div className="flex gap-2">
              <Input id="post-read-time" value={values.read_time} onChange={(e) => set("read_time", e.target.value)} placeholder="4 min read" />
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-xl"
                onClick={() => set("read_time", estimateReadTime(values.content))}
                aria-label="Estimate read time from the article"
                title="Estimate from article"
              >
                <Timer />
              </Button>
            </div>
          </Field>
        </div>

        <Field id="post-excerpt" label="Summary" error={errors.excerpt} hint={`${values.excerpt.length}/400 · Shown on the journal page and in link previews.`} required>
          <Textarea id="post-excerpt" rows={2} className="min-h-20" value={values.excerpt} onChange={(e) => set("excerpt", e.target.value)} aria-invalid={Boolean(errors.excerpt)} />
        </Field>

        <Field
          id="post-content"
          label="Article"
          error={errors.content}
          required
          hint={
            <>
              Leave a blank line between paragraphs. Start a line with <b>##</b> for a heading, <b>-</b> for a bullet, or <b>&gt;</b> for a quote. Use **bold** and [link text](https://...).
            </>
          }
        >
          <Textarea id="post-content" rows={12} className="min-h-72 font-mono text-sm" value={values.content} onChange={(e) => set("content", e.target.value)} aria-invalid={Boolean(errors.content)} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Switch
            id="post-published"
            checked={values.published}
            onCheckedChange={(v) => set("published", v)}
            label="Published"
            description={values.published ? "Visible on the journal." : "Saved as a draft. Only admins can see it."}
          />
          <Field id="post-date" label="Publish date" error={errors.published_at} required>
            <Input
              id="post-date"
              type="datetime-local"
              value={values.published_at}
              onChange={(e) => set("published_at", e.target.value)}
              aria-invalid={Boolean(errors.published_at)}
            />
          </Field>
        </div>
      </form>
    </Dialog>
  );
}
