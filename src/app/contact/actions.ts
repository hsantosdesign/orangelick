"use server";

import { contactSchema, toFieldErrors, type ContactPayload, type FieldErrors } from "@/lib/validation";

export type ContactState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: FieldErrors<ContactPayload> };

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    message: formData.get("message") ?? "",
    company: formData.get("company") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: toFieldErrors<ContactPayload>(parsed.error),
    };
  }

  const { company, ...message } = parsed.data;
  // Honeypot filled in: quietly accept without forwarding.
  if (company) return { status: "success", message: "Thanks! Your message is on its way." };

  const webhook = process.env.CONTACT_FORM_WEBHOOK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...message, source: "orangelick.com/contact", submitted_at: new Date().toISOString() }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Contact webhook responded with ${response.status}`);
    } catch (error) {
      console.error("[contact] delivery failed:", error);
      return { status: "error", message: "We couldn't send your message right now. Please try again in a moment." };
    }
  } else {
    console.info("[contact] new message (no delivery endpoint configured):", message);
  }

  return {
    status: "success",
    message: `Thanks, ${message.name.split(" ")[0]}! We got your message and will reply within one or two business days.`,
  };
}
