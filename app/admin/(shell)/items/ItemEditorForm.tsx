"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomSheet } from "@/components/admin/BottomSheet";
import { Toggle } from "@/components/admin/Toggle";
import { toNaira, toMinor } from "@/lib/money";
import type { ItemInput } from "@/lib/queries";
import { createItemAction, updateItemAction, deleteItemAndRedirectAction, setItemsAvailableAction } from "./actions";

type CategoryOption = { id: string; name: string; type: "DRINK" | "FOOD" };
type VariantDraft = { key: string; label: string; priceMinor: number };

function newKey() {
  return Math.random().toString(36).slice(2);
}

export function ItemEditorForm({
  mode,
  itemId,
  categories,
  initial,
}: {
  mode: "create" | "edit";
  itemId?: string;
  categories: CategoryOption[];
  initial?: {
    name: string;
    description: string | null;
    categoryId: string;
    featured: boolean;
    available: boolean;
    imagePath: string | null;
    variants: { label: string | null; priceMinor: number }[];
  };
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [available, setAvailable] = useState(initial?.available ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [imagePath, setImagePath] = useState<string | null>(initial?.imagePath ?? null);
  const [uploading, setUploading] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [deleteSheetOpen, setDeleteSheetOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const isMultiVariant = (initial?.variants.length ?? 0) > 1 || initial?.variants[0]?.label !== null;
  const [multiVariant, setMultiVariant] = useState(isMultiVariant && (initial?.variants.length ?? 0) > 0);
  const [singlePrice, setSinglePrice] = useState(
    initial && !isMultiVariant ? toNaira(initial.variants[0]?.priceMinor ?? 0) : 0,
  );
  const [variants, setVariants] = useState<VariantDraft[]>(
    initial && isMultiVariant
      ? initial.variants.map((v) => ({ key: newKey(), label: v.label ?? "", priceMinor: v.priceMinor }))
      : [],
  );

  const selectedCategory = categories.find((c) => c.id === categoryId);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setImagePath(data.path);
      else alert(data.error ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function addVariant() {
    if (!multiVariant) {
      setVariants([
        { key: newKey(), label: "", priceMinor: toMinor(singlePrice) },
        { key: newKey(), label: "", priceMinor: 0 },
      ]);
      setMultiVariant(true);
    } else {
      setVariants((v) => [...v, { key: newKey(), label: "", priceMinor: 0 }]);
    }
  }

  function removeVariant(key: string) {
    setVariants((v) => {
      const next = v.filter((r) => r.key !== key);
      if (next.length <= 1) {
        setSinglePrice(toNaira(next[0]?.priceMinor ?? 0));
        setMultiVariant(false);
        return [];
      }
      return next;
    });
  }

  function collapseToSingle() {
    setSinglePrice(toNaira(variants[0]?.priceMinor ?? 0));
    setMultiVariant(false);
    setVariants([]);
  }

  async function handleSave() {
    if (!name.trim() || !categoryId) return;
    setSaving(true);

    const input: ItemInput = {
      name: name.trim(),
      description: description.trim() || null,
      categoryId,
      featured,
      available,
      imagePath,
      variants: multiVariant
        ? variants.map((v) => ({ label: v.label.trim() || null, priceMinor: v.priceMinor }))
        : [{ label: null, priceMinor: toMinor(singlePrice) }],
    };

    if (mode === "create") await createItemAction(input);
    else if (itemId) await updateItemAction(itemId, input);
    setSaving(false);
  }

  async function handleMarkFinishedInstead() {
    if (!itemId) return;
    await setItemsAvailableAction([itemId], false);
    router.push("/admin/items");
  }

  async function handleDelete() {
    if (!itemId) return;
    await deleteItemAndRedirectAction(itemId);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E0CD98] bg-[#FBF6EC] px-4 py-3 lg:px-8">
        <h1 className="font-display text-xl font-bold text-[#1E1B16]">
          {mode === "create" ? "Add item" : "Edit item"}
        </h1>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-[#FFFDF8] px-4 py-1.5 text-sm font-semibold text-[#0E5C34] disabled:opacity-50"
        >
          Save
        </button>
      </div>

      <div className="flex flex-col gap-6 p-4 pb-28 lg:mx-auto lg:w-full lg:max-w-xl lg:p-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1E1B16]">
            Photo <span className="font-normal text-[#6E6455]">Optional</span>
          </label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-[#D4A32C] bg-[#EFE7D6] p-6 text-center hover:bg-[#E0CD98]/30">
            {imagePath ? (
              <Image src={imagePath} alt="" width={120} height={90} className="mb-2 h-24 w-auto rounded object-cover" />
            ) : (
              <span className="text-2xl">📷</span>
            )}
            <span className="text-sm font-semibold text-[#0E5C34]">
              {uploading ? "Uploading…" : "Take photo or upload"}
            </span>
            <span className="text-xs text-[#6E6455]">JPG or PNG, up to 5 MB</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1E1B16]">
            Item name <span className="font-normal text-[#B7202B]">Required</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-[#E0CD98] bg-[#FFFDF8] px-3.5 py-2.5 text-base text-[#1E1B16] focus:border-[#0E5C34] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1E1B16]">Category</label>
          <button
            type="button"
            onClick={() => setCategorySheetOpen(true)}
            className="flex items-center justify-between rounded-md border border-[#E0CD98] bg-[#FFFDF8] px-3.5 py-2.5 text-left text-base text-[#1E1B16]"
          >
            {selectedCategory?.name ?? "Choose a category"}
            <span className="text-[#6E6455]">›</span>
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#1E1B16]">
            Description <span className="font-normal text-[#6E6455]">Optional — leave blank for drinks</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="min-h-[76px] rounded-md border border-[#E0CD98] bg-[#FFFDF8] px-3.5 py-2.5 text-base text-[#1E1B16] focus:border-[#0E5C34] focus:outline-none"
          />
        </div>

        <div className="border-t border-[#E0CD98] pt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#6E6455]">Price</p>
          {!multiVariant ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center rounded-md border border-[#E0CD98] bg-[#FFFDF8] px-3.5">
                <span className="mr-2 font-bold text-[#0E5C34]">₦</span>
                <input
                  type="number"
                  value={singlePrice}
                  onChange={(e) => setSinglePrice(Number(e.target.value))}
                  className="w-full bg-transparent py-2.5 font-mono text-base text-[#1E1B16] focus:outline-none"
                />
              </div>
              <button type="button" onClick={addVariant} className="self-start text-sm font-semibold text-[#0E5C34]">
                + Add size or variant
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6E6455]">
                  {variants.length} sizes · shown as sub-rows on the menu
                </span>
                <button type="button" onClick={collapseToSingle} className="font-semibold text-[#B5562A]">
                  Single price
                </button>
              </div>
              {variants.map((v) => (
                <div key={v.key} className="flex items-center gap-2">
                  <span className="flex h-10 w-8 items-center justify-center text-[#6E6455]">⠿</span>
                  <input
                    value={v.label}
                    onChange={(e) =>
                      setVariants((prev) => prev.map((r) => (r.key === v.key ? { ...r, label: e.target.value } : r)))
                    }
                    placeholder="Small"
                    className="flex-1 rounded-md border border-[#E0CD98] bg-[#FFFDF8] px-3 py-2 text-sm text-[#1E1B16]"
                  />
                  <div className="flex w-28 items-center rounded-md border border-[#E0CD98] bg-[#FFFDF8] px-2">
                    <span className="mr-1 text-xs font-bold text-[#0E5C34]">₦</span>
                    <input
                      type="number"
                      value={toNaira(v.priceMinor)}
                      onChange={(e) =>
                        setVariants((prev) =>
                          prev.map((r) => (r.key === v.key ? { ...r, priceMinor: toMinor(Number(e.target.value)) } : r)),
                        )
                      }
                      className="w-full bg-transparent py-2 font-mono text-sm text-[#1E1B16] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(v.key)}
                    aria-label="Remove size"
                    className="flex h-10 w-10 items-center justify-center text-[#B7202B]"
                  >
                    −
                  </button>
                </div>
              ))}
              <button type="button" onClick={addVariant} className="self-start text-sm font-semibold text-[#0E5C34]">
                + Add another size
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-[#E0CD98] pt-5">
          <div className="flex items-center justify-between rounded-md border border-[#E0CD98] bg-[#FFFDF8] p-4">
            <div>
              <p className="text-[17px] font-semibold text-[#1E1B16]">{available ? "Available" : "Finished"}</p>
              <p className="text-sm text-[#6E6455]">Shows on the public menu</p>
            </div>
            <Toggle checked={available} onChange={setAvailable} size="lg" label="Availability" />
          </div>
          {!available && (
            <div className="flex items-center gap-2 rounded-md border border-[#B7202B]/40 bg-[#B7202B]/10 px-4 py-3 text-sm text-[#B7202B]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B7202B] text-xs font-bold text-[#FBF6EC]">
                !
              </span>
              This item will show as finished on the public menu.
            </div>
          )}

          <div className="flex items-center justify-between rounded-md border border-[#E0CD98] bg-[#FFFDF8] p-4">
            <div>
              <p className="text-[17px] font-semibold text-[#1E1B16]">Show in Signature Dishes</p>
              <p className="text-sm text-[#6E6455]">Photo card on the food menu and homepage</p>
            </div>
            <Toggle checked={featured} onChange={setFeatured} size="lg" label="Featured" />
          </div>
        </div>

        {mode === "edit" && (
          <button
            type="button"
            onClick={() => setDeleteSheetOpen(true)}
            className="border-t border-[#E0CD98] py-4 text-center text-base font-semibold text-[#B7202B]"
          >
            Delete this item
          </button>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-[#E0CD98] bg-[#FBF6EC] p-4 lg:hidden">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="h-14 w-full rounded-md bg-[#0E5C34] text-base font-semibold text-[#FBF6EC] disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>

      <BottomSheet open={categorySheetOpen} onClose={() => setCategorySheetOpen(false)} title="Choose category">
        <div className="flex flex-col divide-y divide-[#F0E6CF]">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCategoryId(c.id);
                setCategorySheetOpen(false);
              }}
              className="flex items-center justify-between py-3 text-left"
            >
              <span className={c.id === categoryId ? "font-bold text-[#1E1B16]" : "text-[#1E1B16]"}>{c.name}</span>
              {c.id === categoryId && <span className="text-[#0E5C34]">✓</span>}
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet open={deleteSheetOpen} onClose={() => setDeleteSheetOpen(false)}>
        <div className="flex flex-col gap-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B7202B] text-sm font-bold text-[#FBF6EC]">
            !
          </span>
          <h2 className="font-display text-[23px] font-bold text-[#1E1B16]">Delete &ldquo;{name}&rdquo;?</h2>
          <p className="text-sm text-[#6E6455]">
            It will be removed from the public menu straight away. This cannot be undone.
          </p>
          <button
            type="button"
            onClick={handleMarkFinishedInstead}
            className="h-14 rounded-md border border-[#B5562A] text-base font-semibold text-[#B5562A]"
          >
            Mark finished instead
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-md bg-[#B7202B] text-base font-semibold text-[#FBF6EC]"
          >
            Delete item
          </button>
          <button
            type="button"
            onClick={() => setDeleteSheetOpen(false)}
            className="h-12 rounded-md border border-[#D4A32C] text-base font-semibold text-[#0E5C34]"
          >
            Cancel
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
