/**
 * Sample content for local UI work ONLY.
 * Rendered exclusively when NEXT_PUBLIC_USE_MOCK_DATA=true (see src/lib/env.ts).
 * Production builds read 100% live data from the database.
 */
import type { Post, Product } from "@/types/database";

const now = "2026-10-01T12:00:00.000Z";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "mock-product-1",
    name: "Babushka's Sushki Rings",
    slug: "babushkas-sushki-rings",
    category: "Baked",
    price: 6.99,
    short_description: "Crunchy little bread rings with a hint of poppy seed. The tea-time classic.",
    full_description:
      "Sushki are the small, crunchy bread rings every Russian grandmother keeps in a jar next to the samovar. We bake ours low and slow so they snap, then finish them with a light dusting of poppy seed. Dunk them in tea, string them on a ribbon, or just eat the whole bag on the couch.",
    ingredients: ["Wheat flour", "Sugar", "Poppy seeds", "Sunflower oil", "Salt", "Yeast"],
    image_url: "/mock/sushki.svg",
    is_highlight: true,
    is_available: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-product-2",
    name: "Smoky Rye Sukhariki",
    slug: "smoky-rye-sukhariki",
    category: "Savory",
    price: 4.49,
    short_description: "Garlicky rye croutons with a campfire finish. Dangerously snackable.",
    full_description:
      "Made from dark Borodinsky-style rye bread, toasted until shatter-crisp and tossed in garlic, dill and a whisper of smoke. The ultimate study-session, game-night, road-trip snack.",
    ingredients: ["Rye flour", "Wheat flour", "Molasses", "Coriander", "Garlic", "Dill", "Natural smoke flavor", "Sunflower oil", "Salt"],
    image_url: "/mock/sukhariki.svg",
    is_highlight: true,
    is_available: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-product-3",
    name: "Honey Cake Bites",
    slug: "honey-cake-bites",
    category: "Traditional",
    price: 8.99,
    short_description: "Bite-sized medovik layers with caramelized honey and a soft cream center.",
    full_description:
      "Medovik is the cake of birthdays and holidays. We turned its thin honey layers and tangy cream into a two-bite treat, so you never have to wait for a special occasion.",
    ingredients: ["Wheat flour", "Buckwheat honey", "Butter", "Eggs", "Sour cream", "Sugar", "Baking soda"],
    image_url: "/mock/medovik.svg",
    is_highlight: true,
    is_available: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-product-4",
    name: "Sunflower Kozinaki",
    slug: "sunflower-kozinaki",
    category: "Sweet",
    price: 3.99,
    short_description: "Toasted sunflower seeds held together with golden honey brittle.",
    full_description:
      "A street-market favorite: roasted sunflower seeds bound in a crackly honey caramel. Sweet, nutty and impossible to share.",
    ingredients: ["Sunflower seeds", "Honey", "Sugar", "Molasses"],
    image_url: "/mock/kozinaki.svg",
    is_highlight: false,
    is_available: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-product-5",
    name: "Classic Pryaniki",
    slug: "classic-pryaniki",
    category: "Traditional",
    price: 5.49,
    short_description: "Soft spiced gingerbread cookies with a crisp sugar glaze.",
    full_description:
      "Pryaniki are pillowy, spiced cookies glazed with a thin sugar shell. Ours are spiced with cinnamon, clove and orange zest, a nod to our name.",
    ingredients: ["Wheat flour", "Honey", "Sugar", "Cinnamon", "Clove", "Orange zest", "Eggs", "Baking soda"],
    image_url: "/mock/pryaniki.svg",
    is_highlight: false,
    is_available: false,
    created_at: now,
    updated_at: now,
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: "mock-post-1",
    title: "Why Every Russian Kitchen Has a Jar of Sushki",
    slug: "why-every-russian-kitchen-has-sushki",
    excerpt: "The humble bread ring is part snack, part ritual. Here is the story behind our best seller.",
    content:
      "If you grew up in a Russian household, you know the jar. It sits next to the kettle, it is never empty, and it is always full of sushki.\n\n## A snack built for tea\n\nSushki are small, dry bread rings that keep for weeks. That made them perfect for long winters and even longer conversations over tea.\n\n## How we make ours\n\n- Slow-baked for maximum crunch\n- Finished with real poppy seed\n- No preservatives, ever\n\n> \"Tea without sushki is just hot water.\" - every grandmother, probably\n\nGrab a bag, put the kettle on, and start a new tradition.",
    cover_image: "/mock/sushki.svg",
    author_name: "Anya Volkova",
    category: "Culture",
    read_time: "3 min read",
    published: true,
    published_at: "2026-09-12T15:00:00.000Z",
    created_at: now,
    updated_at: now,
  },
  {
    id: "mock-post-2",
    title: "Three Ways to Snack on Sukhariki",
    slug: "three-ways-to-snack-on-sukhariki",
    excerpt: "From soup topper to salad crunch, our rye croutons do a lot more than you think.",
    content:
      "Sukhariki are great straight from the bag, but they shine in the kitchen too.\n\n## 1. Soup topper\n\nDrop a handful into borscht or tomato soup right before serving.\n\n## 2. Salad crunch\n\nToss them into a Caesar or a simple cucumber salad with dill.\n\n## 3. Party mix\n\nMix with roasted peanuts and pretzels for the ultimate game-night bowl.",
    cover_image: "/mock/sukhariki.svg",
    author_name: "Dmitri Sokolov",
    category: "Recipes",
    read_time: "2 min read",
    published: true,
    published_at: "2026-10-02T15:00:00.000Z",
    created_at: now,
    updated_at: now,
  },
];
