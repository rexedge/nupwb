import "dotenv/config";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth";
import { allCategories, venueSettings, outstandingQueries } from "../lib/seed-data";

async function seedCategories() {
  for (const [index, category] of allCategories.entries()) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        type: category.type,
        labelPrefix: category.labelPrefix ?? null,
        note: category.note ?? null,
        position: index,
      },
      create: {
        slug: category.slug,
        name: category.name,
        type: category.type,
        labelPrefix: category.labelPrefix ?? null,
        note: category.note ?? null,
        position: index,
      },
    });

    for (const [itemIndex, item] of category.items.entries()) {
      const itemRow = await prisma.item.upsert({
        where: { categoryId_name: { categoryId: row.id, name: item.name } },
        update: {
          description: item.description ?? null,
          featured: item.featured ?? false,
          available: item.available ?? true,
          todoConfirmPrice: item.todoConfirmPrice ?? false,
          position: itemIndex,
        },
        create: {
          name: item.name,
          description: item.description ?? null,
          featured: item.featured ?? false,
          available: item.available ?? true,
          todoConfirmPrice: item.todoConfirmPrice ?? false,
          position: itemIndex,
          categoryId: row.id,
        },
      });

      // Variants have no natural unique key (label can repeat/ be null) — full replace is
      // simplest and keeps re-seeding idempotent without a synthetic slug per variant.
      await prisma.variant.deleteMany({ where: { itemId: itemRow.id } });
      await prisma.variant.createMany({
        data: item.variants.map((variant, variantIndex) => ({
          itemId: itemRow.id,
          label: variant.label,
          priceMinor: variant.priceMinor,
          position: variantIndex,
        })),
      });
    }
  }
}

async function seedSettings() {
  const entries: [string, unknown][] = [
    ["venueName", venueSettings.venueName],
    ["shortName", venueSettings.shortName],
    ["tagline", venueSettings.tagline],
    ["menuSlug", venueSettings.menuSlug],
    ["address", venueSettings.address],
    ["phone", venueSettings.phone],
    ["whatsappNumber", venueSettings.whatsappNumber],
    ["email", venueSettings.email],
    ["mapUrl", venueSettings.mapUrl],
    ["socialLinks", venueSettings.socialLinks],
    ["openingHours", venueSettings.openingHours],
    ["showFinishedItems", venueSettings.showFinishedItems],
  ];

  for (const [key, value] of entries) {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    await prisma.setting.upsert({
      where: { key },
      update: { value: serialized },
      create: { key, value: serialized },
    });
  }
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "timothy@nupwb.ng";
  const password = process.env.ADMIN_PASSWORD ?? "pammy2026";

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return;

  await prisma.admin.create({
    data: { email, passwordHash: hashPassword(password) },
  });
  console.log(`Seeded admin account: ${email} / ${password} (change this before going live)`);
}

async function main() {
  await seedCategories();
  await seedSettings();
  await seedAdmin();

  const categoryCount = await prisma.category.count();
  const itemCount = await prisma.item.count();
  console.log(`Seeded ${categoryCount} categories, ${itemCount} items.`);

  if (outstandingQueries.length) {
    console.log("\nOutstanding queries for the client before launch:");
    for (const q of outstandingQueries) console.log(` - ${q}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
