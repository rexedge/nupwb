import { prisma } from "@/lib/prisma";
import type { CategoryType, Prisma } from "@/app/generated/prisma/client";

// ---------------------------------------------------------------------------
// Public menu reads
// ---------------------------------------------------------------------------

const categoryWithItems = {
  include: {
    items: {
      orderBy: { position: "asc" as const },
      include: { variants: { orderBy: { position: "asc" as const } } },
    },
  },
  orderBy: { position: "asc" as const },
} satisfies Prisma.CategoryFindManyArgs;

export type CategoryWithItems = Prisma.CategoryGetPayload<typeof categoryWithItems>;

export async function getMenu(type: CategoryType): Promise<CategoryWithItems[]> {
  return prisma.category.findMany({ where: { type }, ...categoryWithItems });
}

export async function getFeaturedItems(limit = 4) {
  return prisma.item.findMany({
    where: { featured: true, available: true },
    take: limit,
    orderBy: [{ category: { position: "asc" } }, { position: "asc" }],
    include: { variants: { orderBy: { position: "asc" } } },
  });
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export async function getSetting(key: string): Promise<string | null> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function updateSettings(entries: Record<string, string>): Promise<void> {
  await prisma.$transaction(
    Object.entries(entries).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );
}

// ---------------------------------------------------------------------------
// Admin: dashboard
// ---------------------------------------------------------------------------

export async function getDashboardMetrics() {
  const [totalItems, totalCategories, finishedCount, lastUpdatedItem] = await Promise.all([
    prisma.item.count(),
    prisma.category.count(),
    prisma.item.count({ where: { available: false } }),
    prisma.item.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
  ]);
  return {
    totalItems,
    totalCategories,
    finishedCount,
    lastUpdatedAt: lastUpdatedItem?.updatedAt ?? null,
  };
}

export async function getRecentActivity(limit = 5) {
  const items = await prisma.item.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: { variants: { orderBy: { position: "asc" } } },
  });
  return items;
}

// ---------------------------------------------------------------------------
// Admin: categories
// ---------------------------------------------------------------------------

export async function getAllCategoriesForPicker() {
  return prisma.category.findMany({
    orderBy: [{ type: "asc" }, { position: "asc" }],
    select: { id: true, name: true, type: true },
  });
}

export async function getCategoriesForScope(type: CategoryType) {
  return prisma.category.findMany({
    where: { type },
    orderBy: { position: "asc" },
    include: { _count: { select: { items: true } } },
  });
}

export async function createCategory(input: { name: string; type: CategoryType }) {
  const slug = input.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const count = await prisma.category.count({ where: { type: input.type } });
  return prisma.category.create({
    data: { name: input.name, slug, type: input.type, position: count },
  });
}

export async function deleteCategory(id: string, moveItemsToCategoryId?: string) {
  if (moveItemsToCategoryId) {
    await prisma.item.updateMany({ where: { categoryId: id }, data: { categoryId: moveItemsToCategoryId } });
  }
  return prisma.category.delete({ where: { id } });
}

export async function reorderCategories(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, position) => prisma.category.update({ where: { id }, data: { position } })),
  );
}

export async function setCategoryHidden(id: string, hidden: boolean) {
  return prisma.category.update({ where: { id }, data: { hidden } });
}

// ---------------------------------------------------------------------------
// Admin: items
// ---------------------------------------------------------------------------

export async function getItemsForScope(
  type: CategoryType,
  opts: { search?: string; categoryId?: string } = {},
) {
  const where: Prisma.ItemWhereInput = {
    category: { type, ...(opts.categoryId ? { id: opts.categoryId } : {}) },
    ...(opts.search ? { name: { contains: opts.search, mode: "insensitive" } } : {}),
  };
  return prisma.item.findMany({
    where,
    orderBy: [{ category: { position: "asc" } }, { position: "asc" }],
    include: { variants: { orderBy: { position: "asc" } }, category: true },
  });
}

export async function getItem(id: string) {
  return prisma.item.findUnique({
    where: { id },
    include: { variants: { orderBy: { position: "asc" } }, category: true },
  });
}

export type ItemInput = {
  name: string;
  description?: string | null;
  categoryId: string;
  featured: boolean;
  available: boolean;
  imagePath?: string | null;
  variants: { label: string | null; priceMinor: number }[];
};

export async function createItem(input: ItemInput) {
  const count = await prisma.item.count({ where: { categoryId: input.categoryId } });
  return prisma.item.create({
    data: {
      name: input.name,
      description: input.description,
      categoryId: input.categoryId,
      featured: input.featured,
      available: input.available,
      imagePath: input.imagePath,
      position: count,
      variants: {
        create: input.variants.map((v, i) => ({ label: v.label, priceMinor: v.priceMinor, position: i })),
      },
    },
  });
}

export async function updateItem(id: string, input: ItemInput) {
  await prisma.variant.deleteMany({ where: { itemId: id } });
  return prisma.item.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      categoryId: input.categoryId,
      featured: input.featured,
      available: input.available,
      imagePath: input.imagePath,
      variants: {
        create: input.variants.map((v, i) => ({ label: v.label, priceMinor: v.priceMinor, position: i })),
      },
    },
  });
}

export async function deleteItem(id: string) {
  return prisma.item.delete({ where: { id } });
}

export async function setItemsAvailable(ids: string[], available: boolean) {
  await prisma.item.updateMany({ where: { id: { in: ids } }, data: { available } });
}

export async function setItemsCategory(ids: string[], categoryId: string) {
  await prisma.item.updateMany({ where: { id: { in: ids } }, data: { categoryId } });
}

/** Tap-to-edit flow: only valid for single-variant items. */
export async function updateSingleVariantPrice(itemId: string, priceMinor: number) {
  const item = await prisma.item.findUnique({ where: { id: itemId }, include: { variants: true } });
  if (!item || item.variants.length !== 1) {
    throw new Error("updateSingleVariantPrice requires an item with exactly one variant");
  }
  return prisma.variant.update({ where: { id: item.variants[0].id }, data: { priceMinor } });
}

export async function bulkAdjustPrices(
  itemIds: string[],
  direction: "increase" | "decrease",
  amount: number,
  unit: "naira" | "percent",
) {
  const items = await prisma.item.findMany({
    where: { id: { in: itemIds } },
    include: { variants: true },
  });
  const sign = direction === "increase" ? 1 : -1;

  await prisma.$transaction(
    items.flatMap((item) =>
      item.variants.map((variant) => {
        const delta =
          unit === "percent"
            ? Math.round(variant.priceMinor * (amount / 100))
            : Math.round(amount * 100);
        const next = Math.max(0, variant.priceMinor + sign * delta);
        return prisma.variant.update({ where: { id: variant.id }, data: { priceMinor: next } });
      }),
    ),
  );
}
