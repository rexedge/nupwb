import { getAllCategoriesForPicker } from "@/lib/queries";
import { ItemEditorForm } from "../ItemEditorForm";

export default async function NewItemPage() {
  const categories = await getAllCategoriesForPicker();
  return <ItemEditorForm mode="create" categories={categories} />;
}
