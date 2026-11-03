export type SocialPlatform = "instagram" | "tiktok" | "facebook" | "youtube" | "x";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  handle: string;
  href: string;
}

export const siteConfig = {
  name: "Orange Lick",
  tagline: "Russian snacks. Made for right now.",
  description:
    "Orange Lick makes and delivers authentic Russian snacks in the US, crafted from family recipes for a new generation of snackers.",
  email: "hello@orangelick.com",
  location: "Made with love in the USA",
  /** Where the "Order" CTA on product pages points. */
  orderUrl: "https://www.instagram.com/orangelick",
  social: [
    { platform: "instagram", label: "Instagram", handle: "@orangelick", href: "https://www.instagram.com/orangelick" },
    { platform: "tiktok", label: "TikTok", handle: "@orangelick", href: "https://www.tiktok.com/@orangelick" },
    { platform: "facebook", label: "Facebook", handle: "Orange Lick", href: "https://www.facebook.com/orangelick" },
    { platform: "youtube", label: "YouTube", handle: "@orangelick", href: "https://www.youtube.com/@orangelick" },
    { platform: "x", label: "X", handle: "@orangelick", href: "https://x.com/orangelick" },
  ] satisfies SocialLink[],
  nav: [
    { href: "/", label: "Home" },
    { href: "/products", label: "Snacks" },
    { href: "/blog", label: "Journal" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

/** Suggested categories for the admin editors; any custom category is still accepted. */
export const PRODUCT_CATEGORIES = ["Traditional", "Baked", "Savory", "Sweet", "Drinks"] as const;
export const POST_CATEGORIES = ["Recipes", "Culture", "Behind the Scenes", "News"] as const;
