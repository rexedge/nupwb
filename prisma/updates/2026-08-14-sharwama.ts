/**
 * One-off menu update — 14 Aug 2026.
 *
 * 1. Reconciles the Sharwama category the admin created in the CMS with lib/seed-data.ts:
 *    adds any of the three rows that are missing, and moves the category below Grills.
 *    (It was created at FOOD position 5, which put it above Signature Dishes on the public
 *    menu — see the createCategory fix in lib/queries.ts.)
 * 2. Puts the "Nnaochie Di n'mmanya" slogan on Akulu Pammy.
 *
 * WHY NOT `pnpm db:seed`: the seed upserts EVERY item and replaces every variant row, so it
 * would roll back prices, availability and category deletions the admin has made since launch.
 * This script only adds what is missing and never touches an existing price.
 *
 * Run:  pnpm tsx prisma/updates/2026-08-14-sharwama.ts   (safe to run more than once)
 */
import "dotenv/config";
import { prisma } from "../../lib/prisma";
import { allCategories } from "../../lib/seed-data";

const CATEGORY_SLUG = "sharwama";
const SLOGAN_ITEM = "Akulu Pammy";

async function main() {
  const seed = allCategories.find((c) => c.slug === CATEGORY_SLUG);
  if (!seed) throw new Error(`No "${CATEGORY_SLUG}" category in lib/seed-data.ts`);

  // Sit directly after the last other FOOD category, so it reads last on the public menu.
  const lastOther = await prisma.category.findFirst({
    where: { type: "FOOD", slug: { not: CATEGORY_SLUG } },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  const position = (lastOther?.position ?? -1) + 1;

  const category = await prisma.category.upsert({
    where: { slug: CATEGORY_SLUG },
    update: { name: seed.name, note: seed.note ?? null, position },
    create: {
      slug: seed.slug,
      name: seed.name,
      type: seed.type,
      note: seed.note ?? null,
      position,
    },
  });
  console.log(`Category "${category.name}" at FOOD position ${category.position}`);

  for (const [index, item] of seed.items.entries()) {
    const already = await prisma.item.findUnique({
      where: { categoryId_name: { categoryId: category.id, name: item.name } },
      include: { variants: true },
    });
    if (already) {
      const live = already.variants.map((v) => v.priceMinor).join(",");
      const want = item.variants.map((v) => v.priceMinor).join(",");
      console.log(`  = ${item.name} exists — price left as-is (${live}${live === want ? "" : `, seed says ${want}`})`);
      continue;
    }
    await prisma.item.create({
      data: {
        name: item.name,
        categoryId: category.id,
        position: index,
        variants: {
          create: item.variants.map((v, i) => ({ label: v.label, priceMinor: v.priceMinor, position: i })),
        },
      },
    });
    console.log(`  + ${item.name}`);
  }

  // Description only — availability and price stay whatever the admin last set.
  const slogan = allCategories.flatMap((c) => c.items).find((i) => i.name === SLOGAN_ITEM)?.description;
  if (slogan) {
    const updated = await prisma.item.updateMany({
      where: { name: SLOGAN_ITEM },
      data: { description: slogan },
    });
    console.log(`  ~ ${SLOGAN_ITEM} description set on ${updated.count} row(s): "${slogan}"`);
  }
}

main()
  .then(async () => {
    console.log("Menu update applied.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
