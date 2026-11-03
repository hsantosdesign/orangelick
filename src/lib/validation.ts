import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const optionalText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .transform((value) => (value.length ? value : null));

const imageField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `Please add ${label}.`)
    .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), "Please upload a valid image.");

const slugField = z
  .string()
  .trim()
  .min(1, "Web address is required.")
  .max(120, "Web address must be 120 characters or fewer.")
  .regex(slugPattern, "Use lowercase letters, numbers and dashes only (for example: honey-cake-bites).");

export const productSchema = z.object({
  name: requiredText("Name", 120),
  slug: slugField,
  category: requiredText("Category", 60),
  price: z.coerce
    .number({ error: "Please enter a price." })
    .refine(Number.isFinite, "Please enter a valid price.")
    .min(0, "Price can't be negative.")
    .max(100000, "Price looks too high. Please double-check it."),
  short_description: requiredText("Short description", 280),
  full_description: optionalText("Full description", 5000),
  ingredients: z
    .array(z.string().trim().min(1).max(120, "Each ingredient must be 120 characters or fewer."))
    .max(60, "Please list 60 ingredients or fewer.")
    .transform((list) => (list.length ? list : null)),
  image_url: imageField("a product photo"),
  is_highlight: z.boolean(),
  is_available: z.boolean(),
});

export type ProductFormValues = z.input<typeof productSchema>;
export type ProductPayload = z.output<typeof productSchema>;

export const postSchema = z.object({
  title: requiredText("Title", 160),
  slug: slugField,
  excerpt: requiredText("Summary", 400),
  content: requiredText("Article body", 50000),
  cover_image: imageField("a cover image"),
  author_name: optionalText("Author", 80),
  category: requiredText("Category", 60),
  read_time: optionalText("Read time", 30),
  published: z.boolean(),
  published_at: z
    .string()
    .min(1, "Please choose a publish date.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Please choose a valid publish date.")
    .transform((value) => new Date(value).toISOString()),
});

export type PostFormValues = z.input<typeof postSchema>;
export type PostPayload = z.output<typeof postSchema>;

export const contactSchema = z.object({
  name: requiredText("Name", 100).min(2, "Please enter your full name."),
  email: z.string().trim().min(1, "Email is required.").pipe(z.email("Please enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(10, "Your message should be at least 10 characters.")
    .max(2000, "Your message must be 2,000 characters or fewer."),
  // Honeypot: real visitors never see or fill this field.
  company: z.string().max(0).optional(),
});

export type ContactPayload = z.output<typeof contactSchema>;

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** Flattens a Zod error into one friendly message per field. */
export function toFieldErrors<T>(error: z.ZodError): FieldErrors<T> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in result)) result[key] = issue.message;
  }
  return result as FieldErrors<T>;
}
