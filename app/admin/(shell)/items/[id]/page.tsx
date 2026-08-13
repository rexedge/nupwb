import { notFound } from "next/navigation";
import { getItem, getAllCategoriesForPicker } from "@/lib/queries";
import { ItemEditorForm } from "../ItemEditorForm";

export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, categories] = await Promise.all([getItem(id), getAllCategoriesForPicker()]);
  if (!item) notFound();

  return (
    <ItemEditorForm
      mode="edit"
      itemId={item.id}
      categories={categories}
      initial={{
        name: item.name,
        description: item.description,
        categoryId: item.categoryId,
        featured: item.featured,
        available: item.available,
        imagePath: item.imagePath,
        variants: item.variants.map((v) => ({ label: v.label, priceMinor: v.priceMinor })),
      }}
    />
  );
}
