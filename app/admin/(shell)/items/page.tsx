import { getItemsForScope } from "@/lib/queries";
import { ItemsClient } from "./ItemsClient";

export default async function ItemsPage() {
  const [drinkItems, foodItems] = await Promise.all([
    getItemsForScope("DRINK"),
    getItemsForScope("FOOD"),
  ]);

  return <ItemsClient drinkItems={drinkItems} foodItems={foodItems} initialScope="DRINK" />;
}
