"use server";

import type { CategoryType } from "@/app/generated/prisma/client";
import * as queries from "@/lib/queries";

export async function createCategoryAction(name: string, type: CategoryType) {
  await queries.createCategory({ name, type });
}

export async function deleteCategoryAction(id: string, moveItemsToCategoryId?: string) {
  await queries.deleteCategory(id, moveItemsToCategoryId);
}

export async function reorderCategoriesAction(orderedIds: string[]) {
  await queries.reorderCategories(orderedIds);
}

export async function setCategoryHiddenAction(id: string, hidden: boolean) {
  await queries.setCategoryHidden(id, hidden);
}
