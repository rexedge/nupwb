import { getCategoriesForScope } from "@/lib/queries";
import { CategoriesClient } from "./CategoriesClient";

export default async function CategoriesPage() {
  const [drinkCategories, foodCategories] = await Promise.all([
    getCategoriesForScope("DRINK"),
    getCategoriesForScope("FOOD"),
  ]);

  return <CategoriesClient drinkCategories={drinkCategories} foodCategories={foodCategories} />;
}
