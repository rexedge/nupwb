/**
 * NWOKE UDI PALM WINE BAR — Menu seed data
 *
 * Source: client menu supplied by Mr Timothy (Head of Operations, Transpay), 12 Aug 2026.
 *
 * CONVENTIONS
 * - All prices are integer KOBO. ₦1,500 => 150_000. Never use floats in the money path.
 * - An item with a single variant whose `label` is null renders as a plain "Name .... ₦Price" row.
 * - An item with multiple labelled variants renders as a parent row with indented sub-rows.
 * - Items flagged `todoConfirmPrice: true` are seeded UNAVAILABLE with price 0. Do not invent prices.
 * - `position` fields are implied by array order; the seed script assigns them by index.
 *
 * CLEANUP APPLIED TO THE SOURCE LIST
 * - "Castle lite" appeared twice in the beer section — deduplicated.
 * - Chapman / Sex on the Beach / Long Island appeared under BOTH Smoothies and Cocktails —
 *   assigned to Cocktails only.
 * - "Barbeque" / "Barbecue" spelling normalised to "Barbecue".
 * - Abacha split into its own category with a shared label prefix, so 16 near-identical
 *   rows become scannable.
 * - Naira written as "#" in the source has been read as ₦ throughout.
 */

export type SeedVariant = {
  label: string | null;
  priceMinor: number;
};

export type SeedItem = {
  name: string;
  description?: string;
  featured?: boolean;
  available?: boolean;
  todoConfirmPrice?: boolean;
  variants: SeedVariant[];
};

export type SeedCategory = {
  slug: string;
  name: string;
  type: "DRINK" | "FOOD";
  /** Stripped from item row labels on the public menu and shown once in the heading. */
  labelPrefix?: string;
  /** Small muted note rendered beneath the category heading. */
  note?: string;
  items: SeedItem[];
};

/** Helper: naira -> kobo. Keeps the data below readable. */
const N = (naira: number): number => Math.round(naira * 100);

/** Convenience for the common single-unlabelled-price case. */
const one = (naira: number): SeedVariant[] => [{ label: null, priceMinor: N(naira) }];

/** Placeholder for items the client has not priced yet. */
const UNPRICED: SeedVariant[] = [{ label: null, priceMinor: 0 }];

// ---------------------------------------------------------------------------
// DRINKS
// ---------------------------------------------------------------------------

const palmWine: SeedCategory = {
  slug: "palm-wine",
  name: "Palm Wine",
  type: "DRINK",
  note: "Tapped fresh daily — the house speciality.",
  items: [
    // "Nnaochie Di n'mmanya" is the house slogan for the akulu — carried through to the
    // palm wine feature block on the homepage.
    { name: "Akulu Pammy", description: "Nnaochie Di n'mmanya", featured: true, variants: one(6000) },
    { name: "Soft Pammy", featured: true, variants: one(5000) },
    {
      name: "Take-Away Can",
      variants: [
        { label: "Small", priceMinor: N(500) },
        { label: "Big", priceMinor: N(600) },
      ],
    },
  ],
};

const beerAlcoholic: SeedCategory = {
  slug: "beer-alcoholic",
  name: "Beer & Alcoholic Drinks",
  type: "DRINK",
  items: [
    {
      name: "Heineken",
      variants: [
        { label: "Medium", priceMinor: N(1500) },
        { label: "Large", priceMinor: N(1700) },
      ],
    },
    { name: "33 Export", variants: one(1300) },
    { name: "Star", variants: one(1400) },
    { name: "Star Radler", variants: one(1300) },
    { name: "Gulder", variants: one(1400) },
    { name: "Life", variants: one(1300) },
    { name: "Tiger", variants: one(1300) },
    { name: "Castle Lite", variants: one(1300) },
    {
      name: "Legend",
      variants: [
        { label: "Small", priceMinor: N(1300) },
        { label: "Big", priceMinor: N(1500) },
      ],
    },
    { name: "Legend Twist", variants: one(1100) },
    {
      name: "Stout",
      variants: [
        { label: "Small", priceMinor: N(1300) },
        { label: "Medium", priceMinor: N(1500) },
        { label: "Big", priceMinor: N(1800) },
      ],
    },
    { name: "Trophy Stout", variants: one(1400) },
    { name: "Trophy Beer", variants: one(1300) },
    { name: "Smirnoff Ice", variants: one(1300) },
    { name: "Smirnoff Ice Double Black", variants: one(1500) },
    { name: "Hero", variants: one(1300) },
    { name: "Budweiser", variants: one(1600) },
    { name: "Budweiser Royale", variants: one(1600) },
    { name: "Black Bullet", variants: one(2000) },
    { name: "Orijin Bitters", variants: one(1100) },
    { name: "Orijin Beer", variants: one(1500) },
    { name: "Desperado", variants: one(1300) },
    { name: "Flying Fish", variants: one(1300) },
    { name: "Wake Up", variants: one(1200) },
    { name: "Ballamour Bitters", variants: one(500) },
    { name: "Gold Berg", variants: one(1300) },
    { name: "De Boss", variants: one(2000) },
    { name: "Ace Bitters", variants: one(1000) },
  ],
};

const softDrinks: SeedCategory = {
  slug: "soft-drinks",
  name: "Soft Drinks & Non-Alcoholic",
  type: "DRINK",
  items: [
    { name: "Water", variants: one(400) },
    { name: "Mineral", description: "Assorted soft drinks", variants: one(500) },
    { name: "Amstel Malt", variants: one(900) },
    { name: "Maltina", variants: one(900) },
    { name: "Fayrouz", variants: one(900) },
    { name: "Hollandia", variants: one(3000) },
    { name: "Exotic", variants: one(3000) },
    { name: "Fearless", variants: one(1000) },
    { name: "Climax", variants: one(1000) },
    { name: "Monster", variants: one(1300) },
    { name: "Nosco", variants: one(1000) },
    { name: "5Alive", variants: one(2000) },
    { name: "Vita Milk", variants: one(1700) },
    { name: "Kylin Yoghurt", variants: one(3000) },
    {
      name: "Nelly Yoghurt",
      variants: [
        { label: "Medium", priceMinor: N(2000) },
        { label: "Big", priceMinor: N(3000) },
      ],
    },
    { name: "V-Smartic", variants: one(3000) },
    { name: "Tiger Nut", variants: one(2000) },
  ],
};

const arabianTea: SeedCategory = {
  slug: "arabian-tea",
  name: "Arabian Tea",
  type: "DRINK",
  note: "Served by the jug.",
  items: [
    {
      name: "Arabian Tea",
      variants: [
        { label: "Half Jug", priceMinor: N(3500) },
        { label: "Full Jug", priceMinor: N(6000) },
      ],
    },
  ],
};

const smoothies: SeedCategory = {
  slug: "smoothies",
  name: "Smoothies & Milkshakes",
  type: "DRINK",
  items: [
    { name: "Vanilla Milkshake", variants: one(4000) },
    { name: "Strawberry Milkshake", variants: one(4000) },
    { name: "Banana Milkshake", variants: one(2500) },
    { name: "Natural Smoothie", variants: one(3500) },
    { name: "Parfait", variants: one(5000) },
  ],
};

const cocktails: SeedCategory = {
  slug: "cocktails",
  name: "Cocktails",
  type: "DRINK",
  items: [
    { name: "Chapman (Alcoholic)", variants: one(4000) },
    {
      name: "Chapman (Non-Alcoholic)",
      // Source list showed "Non alcoholic Chapman #" with no figure.
      todoConfirmPrice: true,
      available: false,
      variants: UNPRICED,
    },
    { name: "Sex on the Beach", variants: one(4000) },
    { name: "Long Island Iced Tea", variants: one(5000) },
  ],
};

const cigarettes: SeedCategory = {
  slug: "cigarettes",
  name: "Cigarettes",
  type: "DRINK",
  items: [
    { name: "Benson", variants: one(1200) },
    { name: "Benson Switch", variants: one(1800) },
    { name: "Dorchester", variants: one(1100) },
  ],
};

// ---------------------------------------------------------------------------
// FOOD
// ---------------------------------------------------------------------------

const signatureDishes: SeedCategory = {
  slug: "signature-dishes",
  name: "Signature Dishes",
  type: "FOOD",
  note: "What we are known for.",
  items: [
    {
      name: "Isi Ewu",
      description: "Spiced goat head, the classic Igbo delicacy",
      featured: true,
      variants: one(12000),
    },
    {
      name: "Nkwobi",
      description: "Cow foot in spiced palm oil sauce",
      featured: true,
      variants: one(4500),
    },
    {
      name: "Abacha with Isi Ewu",
      description: "African salad served with spiced goat head",
      featured: true,
      variants: one(13500),
    },
  ],
};

const mainDishes: SeedCategory = {
  slug: "main-dishes",
  name: "Main Dishes",
  type: "FOOD",
  items: [
    // Bush meat
    { name: "Bush Meat Ugba", variants: one(6000) },
    { name: "Bush Meat Vegetable", variants: one(6000) },
    { name: "Bush Meat Pepper Sauce", variants: one(6000) },
    // Stock fish
    { name: "Stock Fish Ugba", variants: one(7000) },
    { name: "Stock Fish Vegetable", variants: one(7000) },
    { name: "Stock Fish Pepper Sauce", variants: one(7000) },
    // Dry fish
    { name: "Dry Fish Ugba", variants: one(4500) },
    { name: "Dry Fish Vegetable", variants: one(4500) },
    { name: "Dry Fish Pepper Sauce", variants: one(4500) },
    // Turkey
    { name: "Turkey Ugba", variants: one(6000) },
    { name: "Turkey Vegetable", variants: one(6000) },
    { name: "Turkey Pepper Sauce", variants: one(6000) },
    // Chicken
    { name: "Chicken Ugba", variants: one(5000) },
    { name: "Chicken Vegetable", variants: one(5000) },
    { name: "Chicken Pepper Sauce", variants: one(5000) },
    // Snail
    { name: "Snail Vegetable", variants: one(5000) },
    { name: "Snail Nkwobi", variants: one(5000) },
    { name: "Snail Pepper Sauce", variants: one(5000) },
    { name: "Fried Snail", variants: one(5000) },
    // Fish
    { name: "Cat Fish Ugba", variants: one(5000) },
    {
      name: "Ice Fish Ugba",
      // Source read "Ice fish ugba" — confirm whether this is iced fish or a named species.
      todoConfirmPrice: true,
      available: false,
      variants: UNPRICED,
    },
    // Goat & other
    { name: "Ugba", variants: one(4500) },
    { name: "Goat Meat Nkwobi", variants: one(4500) },
    { name: "Goat Meat Sauce", variants: one(4500) },
    // Pepper soups
    { name: "Goat Pepper Soup", variants: one(4500) },
    { name: "Fish Pepper Soup", variants: one(5000) },
    { name: "Cow Tail Pepper Soup", variants: one(5000) },
    // Rice
    { name: "Rice & Vegetable", variants: one(4500) },
    { name: "Rice & Sauce", variants: one(4500) },
    { name: "Rice & Vegetable with Goat Meat", variants: one(5200) },
    { name: "Rice & Sauce with Goat Meat", variants: one(5200) },
    { name: "Rice with Goat Meat Pepper Soup", variants: one(5200) },
    { name: "Rice with Fish Pepper Soup", variants: one(5700) },
    { name: "Rice with Cow Tail Pepper Soup", variants: one(5700) },
  ],
};

const abacha: SeedCategory = {
  slug: "abacha",
  name: "Abacha",
  type: "FOOD",
  // The public menu strips this prefix from every row and shows it once in the heading.
  labelPrefix: "Abacha with ",
  note: "All served with abacha (African salad).",
  items: [
    { name: "Abacha with Centre Fish", variants: one(3200) },
    { name: "Abacha with Small Tail Fish", variants: one(3700) },
    { name: "Abacha with Big Tail Fish", variants: one(4200) },
    { name: "Abacha with Fish Vegetable", variants: one(5000) },
    { name: "Abacha with Dry Fish", variants: one(6000) },
    { name: "Abacha with Ugba", variants: one(6000) },
    { name: "Abacha with Nkwobi", variants: one(6000) },
    { name: "Abacha with Goat Meat Pepper Soup", variants: one(6000) },
    { name: "Abacha with Goat Meat Nkwobi", variants: one(6000) },
    { name: "Abacha with Goat Meat Sauce", variants: one(6000) },
    { name: "Abacha with Chicken", variants: one(6500) },
    { name: "Abacha with Snail", variants: one(6500) },
    { name: "Abacha with Bush Meat", variants: one(7500) },
    { name: "Abacha with Turkey", variants: one(7500) },
    { name: "Abacha with Stock Fish", variants: one(8500) },
    { name: "Abacha with Isi Ewu", variants: one(13500) },
  ],
};

const grills: SeedCategory = {
  slug: "grills",
  name: "Grills",
  type: "FOOD",
  note: "Ask staff for today's available sizes.",
  items: [
    {
      name: "Barbecue Fish",
      // Source listed three prices with no size labels. Labels below are PROVISIONAL —
      // confirm with the client before launch.
      todoConfirmPrice: true,
      variants: [
        { label: "Small", priceMinor: N(13000) },
        { label: "Medium", priceMinor: N(15000) },
        { label: "Large", priceMinor: N(16000) },
      ],
    },
    {
      name: "Roasted Barbecue Fish",
      // Source listed four prices with no size labels. PROVISIONAL — confirm.
      todoConfirmPrice: true,
      variants: [
        { label: "Small", priceMinor: N(15000) },
        { label: "Medium", priceMinor: N(16000) },
        { label: "Large", priceMinor: N(17000) },
        { label: "Extra Large", priceMinor: N(18000) },
      ],
    },
    { name: "Full Roasted Chicken", featured: true, variants: one(15000) },
    { name: "Full Native Chicken", featured: true, variants: one(18000) },
    { name: "Full Roasted Guinea Fowl", featured: true, variants: one(25000) },
  ],
};

const sharwama: SeedCategory = {
  slug: "sharwama",
  name: "Sharwama",
  type: "FOOD",
  // Source: client, 14 Aug 2026. Spelling is the client's own ("Sharwama") and matches the
  // category already live in the database — deliberately NOT normalised to "Shawarma" here,
  // because renaming it would change what guests see. Flagged in outstandingQueries instead.
  items: [
    { name: "Beef Sharwama", variants: one(4500) },
    { name: "Chicken Sharwama", variants: one(5500) },
    { name: "Special Sharwama", variants: one(7000) },
  ],
};

const shisha: SeedCategory = {
  slug: "shisha",
  name: "Shisha",
  type: "FOOD",
  items: [
    {
      name: "Shisha",
      // No price supplied in the source list.
      todoConfirmPrice: true,
      available: false,
      variants: UNPRICED,
    },
  ],
};

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

export const drinkCategories: SeedCategory[] = [
  palmWine,
  beerAlcoholic,
  softDrinks,
  arabianTea,
  smoothies,
  cocktails,
  cigarettes,
];

export const foodCategories: SeedCategory[] = [
  signatureDishes,
  mainDishes,
  abacha,
  grills,
  sharwama,
  shisha,
];

export const allCategories: SeedCategory[] = [...drinkCategories, ...foodCategories];

/** Venue settings seeded into the Setting key/value table. */
export const venueSettings = {
  venueName: "Nwoke Udi Palm Wine Bar",
  shortName: "NUPWB",
  tagline: "Promoting culture and maintaining tradition",
  menuSlug: "nwoke-udi", // IMMUTABLE once QR codes are printed.
  // Source: Mr Timothy (Head of Operations, Transpay), WhatsApp, 13 Aug 2026.
  address: "85 Club Road (Abakaliki Street), Awka, Anambra State",
  phone: "+234 806 332 6573",
  whatsappNumber: "+234 806 332 6573",
  // Working placeholder in the venue's own domain — not a confirmed inbox. See outstandingQueries.
  email: "hello@nupwb.ng",
  // Confirmed Google Maps place link (exact coordinates), supplied by the site owner.
  mapUrl:
    "https://www.google.com/maps/place/Nwoke+Udi+Palm+Wine+Bar/@6.2259697,7.0671269,17z/data=!3m1!4b1!4m6!3m5!1s0x104383654c4fdbfb:0x19eabe1a7e74e26f!8m2!3d6.2259876!4d7.0672134!16s%2Fg%2F11jktnr0mx",
  mapLat: 6.2259876,
  mapLng: 7.0672134,
  socialLinks: {
    instagram: "https://www.instagram.com/nwokeudipalmwinebar/" as string | null,
    facebook: null as string | null,
    tiktok: "https://www.tiktok.com/@nwokeudipalmwinebar.awka" as string | null,
  },
  openingHours: {
    monday: { open: "12:00", close: "23:00", closed: false },
    tuesday: { open: "12:00", close: "23:00", closed: false },
    wednesday: { open: "12:00", close: "23:00", closed: false },
    thursday: { open: "12:00", close: "23:00", closed: false },
    friday: { open: "12:00", close: "00:00", closed: false },
    saturday: { open: "12:00", close: "00:00", closed: false },
    sunday: { open: "12:00", close: "23:00", closed: false },
  },
  /** Public menu shows finished items greyed out rather than hiding them. Confirm with client. */
  showFinishedItems: true,
};

/**
 * Items still needing client confirmation. The seed script prints this at the end of a run
 * so nothing ships with a placeholder price.
 */
export const outstandingQueries: string[] = [
  "Sharwama — confirm Chicken (₦5,500) is priced above Beef (₦4,500), and what goes into Special (₦7,000)",
  "Sharwama — confirm the spelling; the standard rendering is \"Shawarma\"",
  "Chapman (Non-Alcoholic) — no price supplied",
  "Shisha — no price supplied",
  "Ice Fish Ugba — confirm item name and price (₦3,000 in source)",
  "Barbecue Fish — confirm the three size labels (₦13,000 / ₦15,000 / ₦16,000)",
  "Roasted Barbecue Fish — confirm the four size labels (₦15,000 / ₦16,000 / ₦17,000 / ₦18,000)",
  "Mineral ₦500 — source carried an asterisk with no footnote",
  "Orijin Beer ₦1,500 — source carried an asterisk with no footnote",
  "Climax — ₦1,000 in first message, truncated in second; confirm",
  "Email — seeded as hello@nupwb.ng placeholder, confirm real inbox",
  "Facebook page — not supplied yet (Instagram and TikTok confirmed)",
  "Opening hours — placeholders seeded, confirm actual times",
];
