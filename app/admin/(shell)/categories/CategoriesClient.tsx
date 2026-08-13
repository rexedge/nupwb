"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SegmentedControl } from "@/components/admin/SegmentedControl";
import { Toggle } from "@/components/admin/Toggle";
import { BottomSheet } from "@/components/admin/BottomSheet";
import type { CategoryType } from "@/app/generated/prisma/client";
import {
  createCategoryAction,
  deleteCategoryAction,
  reorderCategoriesAction,
  setCategoryHiddenAction,
} from "./actions";

type CategoryRow = {
  id: string;
  name: string;
  hidden: boolean;
  _count: { items: number };
};

export function CategoriesClient({
  drinkCategories,
  foodCategories,
}: {
  drinkCategories: CategoryRow[];
  foodCategories: CategoryRow[];
}) {
  const router = useRouter();
  const [scope, setScope] = useState<CategoryType>("DRINK");
  const [rows, setRows] = useState(scope === "DRINK" ? drinkCategories : foodCategories);
  const [dragId, setDragId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newScope, setNewScope] = useState<CategoryType>("DRINK");
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);
  const [moveTo, setMoveTo] = useState("");
  const [, startTransition] = useTransition();

  function switchScope(next: CategoryType) {
    setScope(next);
    setRows(next === "DRINK" ? drinkCategories : foodCategories);
  }

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...rows];
    const fromIdx = next.findIndex((r) => r.id === dragId);
    const toIdx = next.findIndex((r) => r.id === targetId);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setRows(next);
    setDragId(null);
    startTransition(async () => {
      await reorderCategoriesAction(next.map((r) => r.id));
      router.refresh();
    });
  }

  function toggleHidden(row: CategoryRow) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, hidden: !r.hidden } : r)));
    startTransition(async () => {
      await setCategoryHiddenAction(row.id, !row.hidden);
      router.refresh();
    });
  }

  async function submitAdd() {
    if (!newName.trim()) return;
    await createCategoryAction(newName.trim(), newScope);
    setAddOpen(false);
    setNewName("");
    router.refresh();
  }

  const otherRows = rows.filter((r) => r.id !== deleteTarget?.id);

  async function confirmDelete(moveItems: boolean) {
    if (!deleteTarget) return;
    await deleteCategoryAction(deleteTarget.id, moveItems ? moveTo || undefined : undefined);
    setDeleteTarget(null);
    setMoveTo("");
    router.refresh();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pb-24 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[#1E1B16]">Categories</h1>
        <SegmentedControl
          options={[
            { value: "DRINK" as CategoryType, label: "Drinks" },
            { value: "FOOD" as CategoryType, label: "Food" },
          ]}
          value={scope}
          onChange={switchScope}
        />
      </div>
      <p className="text-sm text-[#6E6455]">Drag to reorder. The order here is the order on the public menu.</p>

      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div
            key={row.id}
            draggable
            onDragStart={() => setDragId(row.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(row.id)}
            className={`flex items-center gap-3 rounded-lg border bg-[#FFFDF8] p-3 shadow-sm transition-opacity ${
              row.hidden ? "opacity-55" : ""
            } ${dragId === row.id ? "border-[#D4A32C]" : "border-[#E0CD98]"}`}
          >
            <span className="flex h-12 w-12 shrink-0 cursor-grab items-center justify-center text-[#6E6455]">
              ⠿
            </span>
            <div className="flex flex-1 flex-col">
              <span className="text-[17px] font-semibold text-[#1E1B16]">{row.name}</span>
              <span className="text-xs text-[#6E6455]">{row._count.items} items</span>
            </div>
            <Toggle checked={!row.hidden} onChange={() => toggleHidden(row)} label={`${row.name} visible`} />
            <button
              type="button"
              onClick={() => setDeleteTarget(row)}
              aria-label={`Options for ${row.name}`}
              className="flex h-11 w-11 items-center justify-center text-xl text-[#6E6455]"
            >
              ⋮
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          setNewScope(scope);
          setAddOpen(true);
        }}
        className="fixed inset-x-4 bottom-20 z-20 flex h-14 items-center justify-center gap-2 rounded-md bg-[#0E5C34] text-base font-semibold text-[#FBF6EC] shadow-lg lg:static lg:mt-2 lg:w-fit lg:px-8"
      >
        + Add Category
      </button>

      <BottomSheet open={addOpen} onClose={() => setAddOpen(false)} title="New category">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1E1B16]">Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Pepper Soups"
              className="rounded-md border border-[#E0CD98] bg-[#FBF6EC] px-3.5 py-2.5 text-base text-[#1E1B16] focus:border-[#0E5C34] focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1E1B16]">Shows under</label>
            <SegmentedControl
              options={[
                { value: "DRINK" as CategoryType, label: "Drinks" },
                { value: "FOOD" as CategoryType, label: "Food" },
              ]}
              value={newScope}
              onChange={setNewScope}
            />
          </div>
          <button
            type="button"
            onClick={submitAdd}
            className="h-14 rounded-md bg-[#0E5C34] text-base font-semibold text-[#FBF6EC]"
          >
            Save Category
          </button>
          <button
            type="button"
            onClick={() => setAddOpen(false)}
            className="h-12 rounded-md border border-[#D4A32C] text-base font-semibold text-[#0E5C34]"
          >
            Cancel
          </button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={!!deleteTarget}
        onClose={() => {
          setDeleteTarget(null);
          setMoveTo("");
        }}
      >
        {deleteTarget && (
          <div className="flex flex-col gap-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B7202B] text-sm font-bold text-[#FBF6EC]">
              !
            </span>
            <h2 className="font-display text-[23px] font-bold text-[#1E1B16]">
              Delete &ldquo;{deleteTarget.name}&rdquo;?
            </h2>
            <p className="text-sm text-[#6E6455]">
              This category has <strong className="text-[#1E1B16]">{deleteTarget._count.items} items</strong>.
              Deleting it will also delete them, and that cannot be undone.
            </p>
            {otherRows.length > 0 && (
              <select
                value={moveTo}
                onChange={(e) => setMoveTo(e.target.value)}
                className="rounded-md border border-[#E0CD98] bg-[#FBF6EC] px-3.5 py-2.5 text-base text-[#1E1B16]"
              >
                <option value="">Choose a category to move items to…</option>
                {otherRows.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            )}
            <div className="border-t border-[#E0CD98] pt-4" />
            <button
              type="button"
              disabled={!moveTo}
              onClick={() => confirmDelete(true)}
              className="h-14 rounded-md border border-[#B5562A] text-base font-semibold text-[#B5562A] disabled:opacity-40"
            >
              Move items to another category
            </button>
            <button
              type="button"
              onClick={() => confirmDelete(false)}
              className="h-14 rounded-md bg-[#B7202B] text-base font-semibold text-[#FBF6EC]"
            >
              Delete category and {deleteTarget._count.items} items
            </button>
            <button
              type="button"
              onClick={() => {
                setDeleteTarget(null);
                setMoveTo("");
              }}
              className="h-12 rounded-md border border-[#D4A32C] text-base font-semibold text-[#0E5C34]"
            >
              Cancel
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
