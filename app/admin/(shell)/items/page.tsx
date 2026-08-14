import { getItemsForScope } from "@/lib/queries";
import { ItemsClient } from "./ItemsClient";

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const [{ filter }, drinkItems, foodItems] = await Promise.all([
    searchParams,
    getItemsForScope("DRINK"),
    getItemsForScope("FOOD"),
  ]);

  const showFinishedOnly = filter === "finished";
  // Landing on ?filter=finished from the dashboard should show the finished items, not an empty
  // Drinks tab — open on whichever scope actually has some.
  const initialScope =
    showFinishedOnly && !drinkItems.some((i) => !i.available) && foodItems.some((i) => !i.available)
      ? "FOOD"
      : "DRINK";

  return (
    <ItemsClient
      drinkItems={drinkItems}
      foodItems={foodItems}
      initialScope={initialScope}
      initialAvailability={showFinishedOnly ? "finished" : "all"}
    />
  );
}
