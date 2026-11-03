import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin Portal", template: "%s | Orange Lick Admin Portal" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh">{children}</div>;
}
