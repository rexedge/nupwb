"use server";

import { redirect } from "next/navigation";
import * as queries from "@/lib/queries";
import type { ItemInput } from "@/lib/queries";

export async function createItemAction(input: ItemInput) {
  await queries.createItem(input);
  redirect("/admin/items");
}

export async function updateItemAction(id: string, input: ItemInput) {
  await queries.updateItem(id, input);
  redirect("/admin/items");
}

export async function deleteItemAndRedirectAction(id: string) {
  await queries.deleteItem(id);
  redirect("/admin/items");
}

export async function setItemsAvailableAction(ids: string[], available: boolean) {
  await queries.setItemsAvailable(ids, available);
}

export async function setItemsCategoryAction(ids: string[], categoryId: string) {
  await queries.setItemsCategory(ids, categoryId);
}

export async function deleteItemAction(id: string) {
  await queries.deleteItem(id);
}

export async function updateSingleVariantPriceAction(itemId: string, priceMinor: number) {
  await queries.updateSingleVariantPrice(itemId, priceMinor);
}

export async function bulkAdjustPricesAction(
  itemIds: string[],
  direction: "increase" | "decrease",
  amount: number,
  unit: "naira" | "percent",
) {
  await queries.bulkAdjustPrices(itemIds, direction, amount, unit);
}
