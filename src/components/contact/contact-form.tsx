"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { contactSchema, toFieldErrors, type ContactPayload, type FieldErrors } from "@/lib/validation";
import { sendContactMessage, type ContactState } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form-controls";

const initialState: ContactState = { status: "idle" };
type Values = { name: string; email: string; message: string };
const empty: Values = { name: "", email: "", message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  const [values, setValues] = useState<Values>(empty);
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [clientErrors, setClientErrors] = useState<FieldErrors<ContactPayload>>({});
  const formRef = useRef<HTMLFormElement>(null);
  // Remembers which success result the visitor dismissed, so "Send another" brings the form back.
  const [dismissed, setDismissed] = useState<ContactState | null>(null);
  const showSuccess = state.status === "success" && dismissed !== state;

  const validate = (next: Values) => {
    const result = contactSchema.safeParse(next);
    const errors = result.success ? {} : toFieldErrors<ContactPayload>(result.error);
    setClientErrors(errors);
    return errors;
  };

  useEffect(() => {
    if (state.status === "success") {
      setValues(empty);
      setTouched({});
      setClientErrors({});
    }
  }, [state]);

  const serverErrors = state.status === "error" ? state.fieldErrors ?? {} : {};
  const errorFor = (field: keyof Values) => (touched[field] ? clientErrors[field] : undefined) ?? serverErrors[field];

  const update = (field: keyof Values) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: event.target.value };
    setValues(next);
    if (touched[field]) validate(next);
  };

  const blur = (field: keyof Values) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    validate(values);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      event.preventDefault();
      setTouched({ name: true, email: true, message: true });
      const firstInvalid = (["name", "email", "message"] as const).find((f) => errors[f]);
      if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`#contact-${firstInvalid}`)?.focus();
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {showSuccess && state.status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-12 text-center"
            role="status"
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="flex size-20 items-center justify-center rounded-full bg-brand text-ink"
            >
              <CheckCircle2 className="size-10" aria-hidden />
            </motion.div>
            <h3 className="mt-6 text-2xl font-bold">Message sent!</h3>
            <p className="mt-3 max-w-sm text-mist-400">{state.message}</p>
            <Button variant="secondary" className="mt-8" onClick={() => setDismissed(state)}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            action={formAction}
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="contact-name" label="Your name" error={errorFor("name")} required>
                <Input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Alex Smirnov"
                  value={values.name}
                  onChange={update("name")}
                  onBlur={blur("name")}
                  aria-invalid={Boolean(errorFor("name"))}
                  aria-describedby={errorFor("name") ? "contact-name-error" : undefined}
                />
              </Field>
              <Field id="contact-email" label="Email" error={errorFor("email")} required>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={values.email}
                  onChange={update("email")}
                  onBlur={blur("email")}
                  aria-invalid={Boolean(errorFor("email"))}
                  aria-describedby={errorFor("email") ? "contact-email-error" : undefined}
                />
              </Field>
            </div>

            <Field
              id="contact-message"
              label="Message"
              error={errorFor("message")}
              hint={`${values.message.trim().length}/2000 characters`}
              required
            >
              <Textarea
                id="contact-message"
                name="message"
                rows={6}
                placeholder="Tell us what's on your mind: orders, wholesale, collabs, or your favorite snack memory."
                value={values.message}
                onChange={update("message")}
                onBlur={blur("message")}
                aria-invalid={Boolean(errorFor("message"))}
                aria-describedby={errorFor("message") ? "contact-message-error" : "contact-message-hint"}
              />
            </Field>

            {/* Honeypot for bots */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="contact-company">Company</label>
              <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            {state.status === "error" && !state.fieldErrors ? (
              <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {state.message}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden /> Sending...
                </>
              ) : (
                <>
                  <Send aria-hidden /> Send message
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
