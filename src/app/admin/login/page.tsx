import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { isBackendConfigured } from "@/lib/env";
import { LogoMark } from "@/components/layout/logo";
import { LoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ next?: string | string[] }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : "";

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-mist-400 transition-colors hover:text-white">
          <ArrowLeft className="size-4" aria-hidden /> Back to the website
        </Link>

        <div className="glass relative overflow-hidden rounded-[2rem] p-8 shadow-2xl sm:p-10">
          <div aria-hidden className="absolute -right-20 -top-20 size-56 rounded-full bg-brand/20 blur-3xl" />

          <div className="relative">
            <LogoMark className="size-14" />
            <p className="eyebrow mt-6">Orange Lick Admin Portal</p>
            <h1 className="mt-3 text-3xl font-extrabold">Welcome back</h1>
            <p className="mt-2 text-mist-400">Sign in to manage snacks and journal articles.</p>

            <div className="mt-8">
              {isBackendConfigured ? (
                <LoginForm next={nextPath} />
              ) : (
                <p role="alert" className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-mist">
                  The admin portal isn&apos;t available right now. Please contact your site administrator.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-mist-500">
          <ShieldCheck className="size-4" aria-hidden /> Secure area for the Orange Lick team only
        </p>
      </div>
    </div>
  );
}
