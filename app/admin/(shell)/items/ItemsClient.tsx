"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { SegmentedControl } from "@/components/admin/SegmentedControl";
import { BottomSheet } from "@/components/admin/BottomSheet";
import { naira } from "@/lib/money";
import type { CategoryType } from "@/app/generated/prisma/client";
import {
  setItemsAvailableAction,
  deleteItemAction,
  updateSingleVariantPriceAction,
  bulkAdjustPricesAction,
} from "./actions";

type Variant = { id: string; label: string | null; priceMinor: number };
type ItemRow = {
  id: string;
  name: string;
  available: boolean;
  categoryId: string;
  category: { id: string; name: string; type: CategoryType };
  variants: Variant[];
};

const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "⌫"];

function priceLabel(item: ItemRow): string {
  const dim = !item.available;
  if (item.variants.length === 1) {
    const v = item.variants[0];
    if (dim && v.priceMinor === 0) return "—";
    return naira(v.priceMinor);
  }
  if (item.variants.length === 0) return "—";
  const min = Math.min(...item.variants.map((v) => v.priceMinor));
  return `from ${naira(min)}`;
}

function ItemMenu({
  item,
  onToggleFinished,
  onDelete,
}: {
  item: ItemRow;
  onToggleFinished: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Item options"
        className="flex h-11 w-11 items-center justify-center text-xl text-[#6E6455]"
      >
        ⋮
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-md border border-[#E0CD98] bg-[#FFFDF8] shadow-lg">
            <button
              type="button"
              onClick={() => {
                onToggleFinished();
                setOpen(false);
              }}
              className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-[#B5562A] hover:bg-[#EFE7D6]"
            >
              {item.available ? "Mark Finished" : "Mark Available"}
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-[#B7202B] hover:bg-[#B7202B]/5"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function ItemsClient({
  drinkItems,
  foodItems,
  initialScope,
}: {
  drinkItems: ItemRow[];
  foodItems: ItemRow[];
  initialScope: CategoryType;
}) {
  const router = useRouter();
  const [scope, setScope] = useState<CategoryType>(initialScope);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [bulkMode, setBulkMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState("");
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [direction, setDirection] = useState<"increase" | "decrease">("increase");
  const [unit, setUnit] = useState<"naira" | "percent">("naira");
  const [amount, setAmount] = useState("50");
  const [, startTransition] = useTransition();

  const items = scope === "DRINK" ? drinkItems : foodItems;

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) map.set(item.category.id, item.category.name);
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== "all" && item.categoryId !== categoryFilter) return false;
      if (search.trim() && !item.name.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [items, categoryFilter, search]);

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleFinished(item: ItemRow) {
    startTransition(async () => {
      await setItemsAvailableAction([item.id], !item.available);
      router.refresh();
    });
  }

  function removeItem(item: ItemRow) {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      await deleteItemAction(item.id);
      router.refresh();
    });
  }

  function startEdit(item: ItemRow) {
    if (item.variants.length !== 1) return;
    setEditingId(item.id);
    setDraftPrice(String(Math.round(item.variants[0].priceMinor / 100)));
  }

  function pressKey(key: string) {
    if (key === "⌫") {
      setDraftPrice((p) => p.slice(0, -1));
    } else {
      setDraftPrice((p) => (p + key).slice(0, 7));
    }
  }

  async function saveEdit() {
    if (!editingId) return;
    const naira = parseInt(draftPrice || "0", 10);
    await updateSingleVariantPriceAction(editingId, naira * 100);
    setEditingId(null);
    router.refresh();
  }

  async function applyBulkAdjust() {
    const amt = parseFloat(amount || "0");
    if (!amt || selected.size === 0) return;
    await bulkAdjustPricesAction(Array.from(selected), direction, amt, unit);
    setAdjustOpen(false);
    setSelected(new Set());
    setBulkMode(false);
    router.refresh();
  }

  async function markSelectedFinished() {
    if (selected.size === 0) return;
    await setItemsAvailableAction(Array.from(selected), false);
    setSelected(new Set());
    setBulkMode(false);
    router.refresh();
  }

  const editingItem = items.find((i) => i.id === editingId) ?? null;

  return (
    <div className="flex flex-1 flex-col pb-24">
      <div className="sticky top-0 z-20 flex flex-col gap-3 border-b border-[#E0CD98] bg-[#FBF6EC] p-4 lg:top-0">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-[#1E1B16]">Items</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/categories"
              className="hidden rounded-md border border-[#D4A32C] px-3 py-2 text-sm font-semibold text-[#0E5C34] lg:block"
            >
              Categories
            </Link>
            <button
              type="button"
              onClick={() => {
                setBulkMode((v) => !v);
                setSelected(new Set());
              }}
              className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                bulkMode ? "border-[#0E5C34] bg-[#0E5C34] text-[#FBF6EC]" : "border-[#D4A32C] text-[#0E5C34]"
              }`}
            >
              ☰ Bulk
            </button>
          </div>
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items…"
          className="rounded-md border border-[#E0CD98] bg-[#FFFDF8] px-4 py-2.5 text-base text-[#1E1B16] placeholder:text-[#6E6455] focus:border-[#0E5C34] focus:outline-none"
        />

        <div className="flex items-center justify-between gap-3">
          <SegmentedControl
            options={[
              { value: "DRINK" as CategoryType, label: "Drinks" },
              { value: "FOOD" as CategoryType, label: "Food" },
            ]}
            value={scope}
            onChange={(v) => {
              setScope(v);
              setCategoryFilter("all");
            }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold ${
              categoryFilter === "all" ? "border-[#B5562A] bg-[#B5562A] text-[#FBF6EC]" : "border-[#D4A32C] bg-[#FFFDF8] text-[#1E1B16]"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryFilter(c.id)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-semibold ${
                categoryFilter === c.id ? "border-[#B5562A] bg-[#B5562A] text-[#FBF6EC]" : "border-[#D4A32C] bg-[#FFFDF8] text-[#1E1B16]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#6E6455]">
          {filtered.length} {filtered.length === 1 ? "item" : "items"} · {scope === "DRINK" ? "drinks" : "food"}
        </p>
      </div>

      <div className="flex flex-col divide-y divide-[#F0E6CF] px-4">
        {filtered.map((item) => {
          const editable = item.variants.length === 1;
          const isEditing = editingId === item.id;
          return (
            <div key={item.id} className={`flex items-center gap-3 py-3 ${!item.available ? "opacity-60" : ""}`}>
              {bulkMode && (
                <input
                  type="checkbox"
                  checked={selected.has(item.id)}
                  onChange={() => toggleSelected(item.id)}
                  className="h-6 w-6 rounded border-[#D4A32C]"
                />
              )}
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#EFE7D6] font-display text-lg font-bold text-[#B5562A]">
                {item.name[0]}
              </span>

              {isEditing ? (
                <div className="flex flex-1 items-center gap-2">
                  <div className="flex flex-1 flex-col">
                    <span className="text-[15px] font-semibold text-[#1E1B16]">{item.name}</span>
                    <span className="flex items-baseline gap-1 font-mono text-lg font-bold text-[#0E5C34]">
                      ₦{draftPrice || "0"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={saveEdit}
                    aria-label="Save price"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0E5C34] text-[#FBF6EC]"
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4A32C] text-[#1E1B16]"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-1 flex-col">
                    <span className="flex items-baseline gap-2 text-[16px] font-semibold text-[#1E1B16]">
                      {item.name}
                      {!item.available && (
                        <span className="rounded-full bg-[#B7202B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#FBF6EC]">
                          Finished
                        </span>
                      )}
                    </span>
                    <span className="text-[13px] text-[#6E6455]">{item.category.name}</span>
                  </div>
                  <button
                    type="button"
                    disabled={!editable}
                    onClick={() => startEdit(item)}
                    className="flex flex-col items-end disabled:cursor-default"
                  >
                    <span className="tabular-nums font-semibold text-[#1E1B16]">{priceLabel(item)}</span>
                    {editable && <span className="text-[11px] font-semibold text-[#B5562A]">tap to edit</span>}
                  </button>
                  <ItemMenu item={item} onToggleFinished={() => toggleFinished(item)} onDelete={() => removeItem(item)} />
                </>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-[#6E6455]">No items match.</p>}
      </div>

      {editingItem && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E0CD98] bg-[#FFFDF8] p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#1E1B16]">{editingItem.name}</span>
            <span className="text-[#6E6455]">was {naira(editingItem.variants[0].priceMinor)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {KEYPAD_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => pressKey(key)}
                className={`h-12 rounded-md text-lg font-semibold ${
                  key === "⌫" ? "bg-[#E0CD98] text-[#1E1B16]" : "bg-[#EFE7D6] text-[#1E1B16]"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      )}

      {bulkMode && selected.size > 0 && !editingItem && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E0CD98] bg-[#FFFDF8] p-4 shadow-2xl">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#1E1B16]">{selected.size} selected</span>
            <button type="button" onClick={() => setSelected(new Set())} className="font-semibold text-[#0E5C34]">
              Clear
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setAdjustOpen(true)}
              className="h-11 rounded-md bg-[#0E5C34] text-sm font-semibold text-[#FBF6EC]"
            >
              Adjust Prices
            </button>
            <button
              type="button"
              onClick={markSelectedFinished}
              className="h-11 rounded-md border border-[#B5562A] text-sm font-semibold text-[#B5562A]"
            >
              Mark Finished
            </button>
          </div>
        </div>
      )}

      {!bulkMode && !editingItem && (
        <Link
          href="/admin/items/new"
          className="fixed bottom-6 right-5 z-20 flex h-15 w-15 items-center justify-center rounded-full border border-[#D4A32C] bg-[#0E5C34] text-2xl font-bold text-[#FBF6EC] shadow-lg"
        >
          +
        </Link>
      )}

      <BottomSheet open={adjustOpen} onClose={() => setAdjustOpen(false)} title="Adjust prices">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDirection("increase")}
              className={`h-11 rounded-md border text-sm font-semibold ${
                direction === "increase" ? "border-[#0E5C34] bg-[#0E5C34] text-[#FBF6EC]" : "border-[#D4A32C] text-[#1E1B16]"
              }`}
            >
              + Increase
            </button>
            <button
              type="button"
              onClick={() => setDirection("decrease")}
              className={`h-11 rounded-md border text-sm font-semibold ${
                direction === "decrease" ? "border-[#B7202B] bg-[#B7202B] text-[#FBF6EC]" : "border-[#D4A32C] text-[#1E1B16]"
              }`}
            >
              − Decrease
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bulk-adjust-amount" className="text-sm font-semibold text-[#1E1B16]">
              By
            </label>
            <div className="flex gap-2">
              <input
                id="bulk-adjust-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                className="flex-1 rounded-md border border-[#E0CD98] bg-[#FBF6EC] px-3.5 py-2.5 text-base text-[#1E1B16]"
              />
              <div className="flex overflow-hidden rounded-md border border-[#E0CD98]">
                <button
                  type="button"
                  onClick={() => setUnit("naira")}
                  className={`px-3 text-sm font-semibold ${unit === "naira" ? "bg-[#0E5C34] text-[#FBF6EC]" : "bg-[#FBF6EC] text-[#1E1B16]"}`}
                >
                  ₦
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("percent")}
                  className={`px-3 text-sm font-semibold ${unit === "percent" ? "bg-[#0E5C34] text-[#FBF6EC]" : "bg-[#FBF6EC] text-[#1E1B16]"}`}
                >
                  %
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-md bg-[#EFE7D6] p-3 text-sm text-[#1E1B16]">
            Preview: {selected.size} items · {direction === "increase" ? "+" : "-"}
            {amount || 0}
            {unit === "percent" ? "%" : " naira"}
          </div>
          <button
            type="button"
            onClick={applyBulkAdjust}
            className="h-14 rounded-md bg-[#0E5C34] text-base font-semibold text-[#FBF6EC]"
          >
            Apply to {selected.size} items
          </button>
          <button
            type="button"
            onClick={() => setAdjustOpen(false)}
            className="h-12 rounded-md border border-[#D4A32C] text-base font-semibold text-[#0E5C34]"
          >
            Cancel
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
