import type { Metadata, Viewport } from "next";
import { Inter, Unbounded } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { SITE_URL } from "@/lib/env";
import { siteConfig } from "@/lib/site";
import { Footer } from "@/components/layout/footer";
import { InteractiveBackground } from "@/components/layout/interactive-background";
import { MotionProvider } from "@/components/layout/motion-provider";
import { Navbar } from "@/components/layout/navbar";
import { SiteChrome } from "@/components/layout/site-chrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-unbounded", display: "swap", weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} | Authentic Russian Snacks, Made in the USA`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Authentic Russian Snacks`,
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#1B2024",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${unbounded.variable}`}>
      <body className="min-h-dvh overflow-x-hidden">
        <MotionProvider>
          <InteractiveBackground />
          <SiteChrome navbar={<Navbar />} footer={<Footer />}>
            {children}
          </SiteChrome>
        </MotionProvider>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            classNames: {
              toast: "!bg-ink-800 !border !border-white/10 !text-white !rounded-2xl",
              description: "!text-mist-400",
            },
          }}
        />
      </body>
    </html>
  );
}
