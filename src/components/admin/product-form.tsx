"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types/database";
import { saveProduct } from "@/app/admin/actions";
import { PRODUCT_CATEGORIES } from "@/lib/site";
import { slugify } from "@/lib/utils";
import { productSchema, toFieldErrors, type ProductFormValues } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Switch, Textarea } from "@/components/ui/form-controls";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { TagInput } from "@/components/admin/tag-input";

type FormState = {
  name: string;
  slug: string;
  category: string;
  price: string;
  short_description: string;
  full_description: string;
  ingredients: string[];
  image_url: string;
  is_highlight: boolean;
  is_available: boolean;
};

type Errors = Partial<Record<keyof FormState, string>>;

function toFormState(product: Product | null): FormState {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category: product?.category ?? "",
    price: product ? String(product.price) : "",
    short_description: product?.short_description ?? "",
    full_description: product?.full_description ?? "",
    ingredients: product?.ingredients ?? [],
    image_url: product?.image_url ?? "",
    is_highlight: product?.is_highlight ?? false,
    is_available: product?.is_available ?? true,
  };
}

interface ProductFormProps {
  open: boolean;
  product: Product | null;
  categories: string[];
  onClose: () => void;
  onSaved: (product: Product) => void;
}

export function ProductForm({ open, product, categories, onClose, onSaved }: ProductFormProps) {
  const [values, setValues] = useState<FormState>(() => toFormState(product));
  const [errors, setErrors] = useState<Errors>({});
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setValues(toFormState(product));
      setErrors({});
      setSlugTouched(Boolean(product));
    }
  }, [open, product]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (uploading) return;

    const payload: ProductFormValues = { ...values, price: values.price };
    const check = productSchema.safeParse(payload);
    if (!check.success) {
      setErrors(toFieldErrors<FormState>(check.error));
      toast.error("Please fix the highlighted fields.");
      return;
    }

    startTransition(async () => {
      const result = await saveProduct(product?.id ?? null, payload);
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

  const categoryOptions = Array.from(new Set([...PRODUCT_CATEGORIES, ...categories])).sort();
  const busy = pending || uploading;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      locked={pending}
      title={product ? "Edit product" : "Add a new product"}
      description={product ? `Update the details for ${product.name}.` : "Fill in the details below. Fields marked * are required."}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="product-form" disabled={busy}>
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />}
            {pending ? "Saving..." : uploading ? "Uploading image..." : product ? "Save changes" : "Add product"}
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={submit} noValidate className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-6">
          <Field id="product-image" label="Product photo" required>
            <ImageDropzone
              id="product-image"
              folder="products"
              value={values.image_url}
              onChange={(url) => set("image_url", url)}
              error={errors.image_url}
              onUploadingChange={setUploading}
            />
          </Field>
          <Switch
            id="product-available"
            checked={values.is_available}
            onCheckedChange={(v) => set("is_available", v)}
            label="In stock"
            description="Turn off to show this snack as temporarily sold out."
          />
          <Switch
            id="product-highlight"
            checked={values.is_highlight}
            onCheckedChange={(v) => set("is_highlight", v)}
            label="Fan favorite"
            description="Featured on the home page."
          />
        </div>

        <div className="space-y-5">
          <Field id="product-name" label="Name" error={errors.name} required>
            <Input id="product-name" value={values.name} onChange={(e) => set("name", e.target.value)} aria-invalid={Boolean(errors.name)} placeholder="Honey Cake Bites" />
          </Field>

          <Field
            id="product-slug"
            label="Web address"
            error={errors.slug}
            hint={`orangelick.com/products/${values.slug || "your-snack"}`}
            required
          >
            <Input
              id="product-slug"
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              aria-invalid={Boolean(errors.slug)}
              placeholder="honey-cake-bites"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="product-category" label="Category" error={errors.category} required>
              <Input
                id="product-category"
                list="product-category-options"
                value={values.category}
                onChange={(e) => set("category", e.target.value)}
                aria-invalid={Boolean(errors.category)}
                placeholder="Traditional"
              />
              <datalist id="product-category-options">
                {categoryOptions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field id="product-price" label="Price (USD)" error={errors.price} required>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist-500">$</span>
                <Input
                  id="product-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={values.price}
                  onChange={(e) => set("price", e.target.value)}
                  aria-invalid={Boolean(errors.price)}
                  className="pl-8"
                  placeholder="6.99"
                />
              </div>
            </Field>
          </div>

          <Field id="product-short" label="Short description" error={errors.short_description} hint={`${values.short_description.length}/280 · Shown on product cards.`} required>
            <Textarea
              id="product-short"
              rows={2}
              className="min-h-20"
              value={values.short_description}
              onChange={(e) => set("short_description", e.target.value)}
              aria-invalid={Boolean(errors.short_description)}
              placeholder="One or two sentences that make people hungry."
            />
          </Field>

          <Field id="product-full" label="Full description" error={errors.full_description} hint="The story behind the snack. Leave a blank line between paragraphs.">
            <Textarea
              id="product-full"
              rows={5}
              value={values.full_description}
              onChange={(e) => set("full_description", e.target.value)}
              aria-invalid={Boolean(errors.full_description)}
            />
          </Field>

          <Field id="product-ingredients" label="Ingredients" error={errors.ingredients} hint="Press Enter after each ingredient, or paste a list.">
            <TagInput
              id="product-ingredients"
              value={values.ingredients}
              onChange={(list) => set("ingredients", list)}
              placeholder="e.g. Wheat flour"
              invalid={Boolean(errors.ingredients)}
            />
          </Field>
        </div>
      </form>
    </Dialog>
  );
}
