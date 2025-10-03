"use client";

import type { ChangeEvent, FormEvent, ReactElement } from "react";
import { useMemo, useState } from "react";

type IngredientRecord = {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  teamId: string;
  unit: string;
  packaging: string;
  standardPortion: number;
  wasteRate: number;
  minStock: number;
  leadTimeDays: number;
  supplier: string;
  storageNote: string;
};

type IngredientFormValues = {
  name: string;
  code: string;
  categoryId: string;
  teamId: string;
  unit: string;
  packaging: string;
  standardPortion: string;
  wasteRate: string;
  minStock: string;
  leadTimeDays: string;
  supplier: string;
  storageNote: string;
};

type SelectOption = {
  value: string;
  label: string;
};

const ingredientCategories: SelectOption[] = [
  { value: "cat-fresh", label: "Nguyên liệu tươi" },
  { value: "cat-dry", label: "Đồ khô & gia vị" },
  { value: "cat-frozen", label: "Đông lạnh" },
  { value: "cat-sauce", label: "Nước sốt & ướp" },
  { value: "cat-packaging", label: "Bao bì" },
];

const teamOptions: SelectOption[] = [
  { value: "prep", label: "Tổ Sơ chế" },
  { value: "cooking", label: "Tổ Nấu" },
  { value: "sauce", label: "Tổ Nước sốt" },
  { value: "dessert", label: "Tổ Tráng miệng" },
  { value: "plating", label: "Tổ Trang trí" },
  { value: "qc", label: "Tổ QC" },
];

const unitOptions: SelectOption[] = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "l", label: "Lít (l)" },
  { value: "ml", label: "Millilít (ml)" },
  { value: "pcs", label: "Cái / bộ (pcs)" },
];

const initialIngredients: IngredientRecord[] = [
  {
    id: "ing-01",
    name: "Ức gà fillet",
    code: "ING-UCGA",
    categoryId: "cat-fresh",
    teamId: "prep",
    unit: "kg",
    packaging: "Thùng 10kg (2 túi 5kg hút chân không)",
    standardPortion: 0.18,
    wasteRate: 5,
    minStock: 25,
    leadTimeDays: 2,
    supplier: "CP Foods",
    storageNote: "Bảo quản 0-2°C, sử dụng trong 48h sau khi rã đông.",
  },
  {
    id: "ing-02",
    name: "Xương ống bò",
    code: "ING-XUONGBO",
    categoryId: "cat-fresh",
    teamId: "cook",
    unit: "kg",
    packaging: "Bao 20kg, giữ lạnh 0-2°C",
    standardPortion: 1.2,
    wasteRate: 12,
    minStock: 40,
    leadTimeDays: 3,
    supplier: "An Phú Food",
    storageNote: "Luôn giữ lạnh, ưu tiên sử dụng trong 24h.",
  },
  {
    id: "ing-03",
    name: "Hành tím bóc sẵn",
    code: "ING-HANTIM",
    categoryId: "cat-fresh",
    teamId: "prep",
    unit: "kg",
    packaging: "Thùng xốp 5kg kèm đá gel",
    standardPortion: 0.05,
    wasteRate: 3,
    minStock: 12,
    leadTimeDays: 1,
    supplier: "HTX Nông sản Việt",
    storageNote: "Để nơi khô thoáng, tránh ánh sáng trực tiếp.",
  },
  {
    id: "ing-04",
    name: "Nước mắm Phú Quốc 40N",
    code: "ING-NUOCMAM",
    categoryId: "cat-sauce",
    teamId: "sauce",
    unit: "l",
    packaging: "Can nhựa 5l, giao theo lô kiểm định",
    standardPortion: 0.08,
    wasteRate: 0,
    minStock: 30,
    leadTimeDays: 4,
    supplier: "Nhà thùng Nam Ngư",
    storageNote: "Đậy kín sau khi dùng, bảo quản nhiệt độ phòng.",
  },
  {
    id: "ing-05",
    name: "Bơ lạt Anchor 1kg",
    code: "ING-BOLAT",
    categoryId: "cat-frozen",
    teamId: "dessert",
    unit: "kg",
    packaging: "Thùng 10 block x 1kg",
    standardPortion: 0.12,
    wasteRate: 2,
    minStock: 20,
    leadTimeDays: 5,
    supplier: "Fonterra Vietnam",
    storageNote: "Bảo quản -18°C, rã đông ngăn mát trước 12h.",
  },
  {
    id: "ing-06",
    name: "Hộp giấy kraft L",
    code: "ING-HOPL",
    categoryId: "cat-packaging",
    teamId: "prep", // Changed from warehouse
    unit: "pcs",
    packaging: "Thùng 200 hộp (50 x 4 gói)",
    standardPortion: 1,
    wasteRate: 0,
    minStock: 500,
    leadTimeDays: 7,
    supplier: "In bao bì Nam Việt",
    storageNote: "Để nơi khô ráo, tránh đè nặng lên thùng.",
  },
];

const createEmptyFormValues = (): IngredientFormValues => ({
  name: "",
  code: "",
  categoryId: "",
  teamId: "",
  unit: unitOptions[0]?.value ?? "kg",
  packaging: "",
  standardPortion: "",
  wasteRate: "",
  minStock: "",
  leadTimeDays: "",
  supplier: "",
  storageNote: "",
});

const parseNumberInput = (value: string) => {
  if (!value.trim()) {
    return 0;
  }

  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);

  return Number.isNaN(parsed) ? 0 : parsed;
};
export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<IngredientRecord[]>(initialIngredients);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<IngredientFormValues>(() => createEmptyFormValues());
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<IngredientFormValues | null>(null);
  const [deletePending, setDeletePending] = useState<{ id: string; name: string } | null>(null);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }),
    [],
  );

  const categoryLookup = useMemo(() => {
    return ingredientCategories.reduce<Record<string, string>>((acc, category) => {
      acc[category.value] = category.label;
      return acc;
    }, {});
  }, []);

  const teamLookup = useMemo(() => {
    return teamOptions.reduce<Record<string, string>>((acc, team) => {
      acc[team.value] = team.label;
      return acc;
    }, {});
  }, []);

  const filteredIngredients = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return ingredients
      .filter((ingredient) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          ingredient.name.toLowerCase().includes(normalizedQuery) ||
          ingredient.code.toLowerCase().includes(normalizedQuery);

        const matchesCategory =
          categoryFilter === "all" || ingredient.categoryId === categoryFilter;

        const matchesTeam = teamFilter === "all" || ingredient.teamId === teamFilter;

        return matchesQuery && matchesCategory && matchesTeam;
      })
      .sort((a, b) => a.name.localeCompare(b.name, "vi", { sensitivity: "base" }));
  }, [ingredients, searchQuery, categoryFilter, teamFilter]);

  const totalCount = ingredients.length;
  const filteredCount = filteredIngredients.length;
  const hasActiveFilters =
    searchQuery.trim().length > 0 || categoryFilter !== "all" || teamFilter !== "all";

  const handleCreateChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const key = name as keyof IngredientFormValues;

    setCreateForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleEditChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const key = name as keyof IngredientFormValues;

    setEditForm((previous) => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        [key]: value,
      };
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setTeamFilter("all");
  };

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = createForm.name.trim();
    const trimmedCode = createForm.code.trim().toUpperCase();

    if (!trimmedName || !trimmedCode || !createForm.categoryId || !createForm.teamId) {
      return;
    }

    const newIngredient: IngredientRecord = {
      id: `ing-${Date.now().toString(36)}`,
      name: trimmedName,
      code: trimmedCode,
      categoryId: createForm.categoryId,
      teamId: createForm.teamId,
      unit: createForm.unit,
      packaging: createForm.packaging.trim(),
      standardPortion: parseNumberInput(createForm.standardPortion),
      wasteRate: parseNumberInput(createForm.wasteRate),
      minStock: parseNumberInput(createForm.minStock),
      leadTimeDays: parseNumberInput(createForm.leadTimeDays),
      supplier: createForm.supplier.trim(),
      storageNote: createForm.storageNote.trim(),
    };

    setIngredients((previous) => [...previous, newIngredient]);
    closeCreateModal();
  };

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editForm || !editId) {
      return;
    }

    const trimmedName = editForm.name.trim();
    const trimmedCode = editForm.code.trim().toUpperCase();

    if (!trimmedName || !trimmedCode || !editForm.categoryId || !editForm.teamId) {
      return;
    }

    setIngredients((previous) =>
      previous.map((ingredient) =>
        ingredient.id === editId
          ? {
              ...ingredient,
              name: trimmedName,
              code: trimmedCode,
              categoryId: editForm.categoryId,
              teamId: editForm.teamId,
              unit: editForm.unit,
              packaging: editForm.packaging.trim(),
              standardPortion: parseNumberInput(editForm.standardPortion),
              wasteRate: parseNumberInput(editForm.wasteRate),
              minStock: parseNumberInput(editForm.minStock),
              leadTimeDays: parseNumberInput(editForm.leadTimeDays),
              supplier: editForm.supplier.trim(),
              storageNote: editForm.storageNote.trim(),
            }
          : ingredient,
      ),
    );

    closeEditModal();
  };

  const confirmDelete = () => {
    if (!deletePending) {
      return;
    }

    setIngredients((previous) => previous.filter((item) => item.id !== deletePending.id));
    setDeletePending(null);
  };

  const handleOpenCreate = () => {
    setCreateForm(createEmptyFormValues());
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setCreateForm(createEmptyFormValues());
  };

  const openEditModal = (ingredient: IngredientRecord) => {
    setEditId(ingredient.id);
    setEditForm({
      name: ingredient.name,
      code: ingredient.code,
      categoryId: ingredient.categoryId,
      teamId: ingredient.teamId,
      unit: ingredient.unit,
      packaging: ingredient.packaging,
      standardPortion: ingredient.standardPortion.toString(),
      wasteRate: ingredient.wasteRate.toString(),
      minStock: ingredient.minStock.toString(),
      leadTimeDays: ingredient.leadTimeDays.toString(),
      supplier: ingredient.supplier,
      storageNote: ingredient.storageNote,
    });
  };

  const closeEditModal = () => {
    setEditId(null);
    setEditForm(null);
  };
  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Danh sách nguyên liệu</h3>
            <p className="text-sm text-slate-600">
              Tổng {totalCount} nguyên liệu được cấu hình. Đang hiển thị {filteredCount} bản ghi theo bộ lọc hiện tại.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M10 4v12M4 10h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Tạo nguyên liệu
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative text-sm">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M19 19l-4-4m1-5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              type="search"
              name="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm theo tên, mã nguyên liệu"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200 sm:w-72"
            />
          </div>

          <select
            name="category-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="all">Danh mục: Tất cả</option>
            {ingredientCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            name="team-filter"
            value={teamFilter}
            onChange={(event) => setTeamFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="all">Tổ: Tất cả</option>
            {teamOptions.map((team) => (
              <option key={team.value} value={team.value}>
                {team.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
            className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Xóa bộ lọc
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Nguyên liệu</th>
                <th className="px-4 py-3 text-left">Thông số & Đóng gói</th>
                <th className="px-4 py-3 text-left">Phân loại & Vận hành</th>
                <th className="px-4 py-3 text-left">Nhà cung ứng</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-slate-500">
                    Không tìm thấy nguyên liệu phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredIngredients.map((ingredient) => (
                  <tr key={ingredient.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 align-top">
                      <div className="font-semibold text-slate-900">{ingredient.name}</div>
                      <div className="mt-1 text-xs font-mono text-slate-500">{ingredient.code}</div>
                      {ingredient.storageNote && (
                        <div className="mt-2 text-xs text-slate-500">{ingredient.storageNote}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="text-slate-500">Định mức</div>
                        <div className="font-medium text-slate-800">
                          {numberFormatter.format(ingredient.standardPortion)} {ingredient.unit}
                        </div>
                        <div className="text-slate-500">Hao hụt</div>
                        <div className="font-medium text-slate-800">
                          {numberFormatter.format(ingredient.wasteRate)}%
                        </div>
                        <div className="text-slate-500">Tồn tối thiểu</div>
                        <div className="font-medium text-slate-800">
                          {numberFormatter.format(ingredient.minStock)} {ingredient.unit}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-slate-900">
                        {categoryLookup[ingredient.categoryId] ?? "Không xác định"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {teamLookup[ingredient.teamId] ?? "Không xác định"}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-slate-900">{ingredient.supplier}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        Lead time: {numberFormatter.format(ingredient.leadTimeDays)} ngày
                      </div>
                      {ingredient.packaging && (
                        <div className="mt-1 text-xs text-slate-500">{ingredient.packaging}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(ingredient)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-emerald-600"
                          aria-label="Chỉnh sửa nguyên liệu"
                          title="Chỉnh sửa"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path
                              d="M13.25 3.5 16.5 6.75M4.5 15.5l2.21-.24 7.79-7.79a1.5 1.5 0 0 0-2.12-2.12L4.59 13.14 4.5 15.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletePending({ id: ingredient.id, name: ingredient.name })}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-rose-600"
                          aria-label="Xóa nguyên liệu"
                          title="Xóa"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path
                              d="M5 6h10m-1 0-.4 9.02a1.5 1.5 0 0 1-1.5 1.43H7.9a1.5 1.5 0 0 1-1.5-1.43L6 6m2.5 0V4.5A1.5 1.5 0 0 1 10 3h0a1.5 1.5 0 0 1 1.5 1.5V6"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <IngredientFormModal
        isOpen={isCreateOpen}
        mode="create"
        title="Tạo nguyên liệu"
        description="Định nghĩa dữ liệu chuẩn để các tổ nhập - xuất kho đồng bộ."
        primaryLabel="Lưu nguyên liệu"
        values={createForm}
        onChange={handleCreateChange}
        onClose={closeCreateModal}
        onSubmit={handleCreateSubmit}
        categoryOptions={ingredientCategories}
        teamOptions={teamOptions}
        unitOptions={unitOptions}
      />

      {editForm && editId && (
        <IngredientFormModal
          isOpen
          mode="edit"
          title="Chi tiết nguyên liệu"
          description="Cập nhật thông tin chuẩn để đồng bộ với kho và ERP."
          primaryLabel="Cập nhật"
          values={editForm}
          onChange={handleEditChange}
          onClose={closeEditModal}
          onSubmit={handleEditSubmit}
          categoryOptions={ingredientCategories}
          teamOptions={teamOptions}
          unitOptions={unitOptions}
        />
      )}

      {deletePending && (
        <DeleteConfirmModal
          isOpen
          itemName={deletePending.name}
          onCancel={() => setDeletePending(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
type IngredientFormModalProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  title: string;
  description: string;
  primaryLabel: string;
  values: IngredientFormValues;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  categoryOptions: SelectOption[];
  teamOptions: SelectOption[];
  unitOptions: SelectOption[];
};

function IngredientFormModal({
  isOpen,
  mode,
  title,
  description,
  primaryLabel,
  values,
  onChange,
  onClose,
  onSubmit,
  categoryOptions,
  teamOptions,
  unitOptions,
}: IngredientFormModalProps) {
  if (!isOpen) {
    return null;
  }

  const idPrefix = `ingredient-${mode}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
          >
            <span className="sr-only">Đóng</span>
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="m6 6 8 8m0-8-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="grid gap-4 px-6 py-4 sm:grid-cols-2">
            <Fieldset
              id={`${idPrefix}-name`}
              label="Tên nguyên liệu"
              control={
                <input
                  id={`${idPrefix}-name`}
                  name="name"
                  value={values.name}
                  onChange={onChange}
                  required
                  placeholder="VD: Ức gà fillet"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              }
              colSpan
            />

            <Fieldset
              id={`${idPrefix}-code`}
              label="Mã nguyên liệu"
              hint="Viết hoa để đồng bộ với mã trong ERP."
              control={
                <input
                  id={`${idPrefix}-code`}
                  name="code"
                  value={values.code}
                  onChange={onChange}
                  required
                  placeholder="VD: ING-001"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              }
            />

            <Fieldset
              id={`${idPrefix}-unit`}
              label="Đơn vị tính chuẩn"
              control={
                <select
                  id={`${idPrefix}-unit`}
                  name="unit"
                  value={values.unit}
                  onChange={onChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  {unitOptions.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              }
            />

            <Fieldset
              id={`${idPrefix}-categoryId`}
              label="Danh mục nguyên liệu"
              control={
                <select
                  id={`${idPrefix}-categoryId`}
                  name="categoryId"
                  value={values.categoryId}
                  onChange={onChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  <option value="">Chọn danh mục</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              }
            />

            <Fieldset
              id={`${idPrefix}-teamId`}
              label="Tổ phụ trách chính"
              control={
                <select
                  id={`${idPrefix}-teamId`}
                  name="teamId"
                  value={values.teamId}
                  onChange={onChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                >
                  <option value="">Chọn tổ vận hành</option>
                  {teamOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              }
            />

            <Fieldset
              id={`${idPrefix}-standardPortion`}
              label="Định mức cho 1 thành phẩm"
              hint="Số lượng theo đơn vị chuẩn cho 1 sản phẩm."
              control={
                <input
                  id={`${idPrefix}-standardPortion`}
                  name="standardPortion"
                  type="number"
                  value={values.standardPortion}
                  onChange={onChange}
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="VD: 0.18"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              }
            />

            <Fieldset
              id={`${idPrefix}-wasteRate`}
              label="Tỷ lệ hao hụt chuẩn (%)"
              hint="Áp dụng khi tính cost và đặt hàng."
              control={
                <input
                  id={`${idPrefix}-wasteRate`}
                  name="wasteRate"
                  type="number"
                  value={values.wasteRate}
                  onChange={onChange}
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  placeholder="VD: 5"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              }
            />

            <Fieldset
              id={`${idPrefix}-minStock`}
              label="Tồn tối thiểu"
              hint="Lượng tối thiểu cần duy trì trong kho."
              control={
                <input
                  id={`${idPrefix}-minStock`}
                  name="minStock"
                  type="number"
                  value={values.minStock}
                  onChange={onChange}
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  placeholder="VD: 25"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              }
            />

            <Fieldset
              id={`${idPrefix}-leadTimeDays`}
              label="Lead time đặt hàng (ngày)"
              control={
                <input
                  id={`${idPrefix}-leadTimeDays`}
                  name="leadTimeDays"
                  type="number"
                  value={values.leadTimeDays}
                  onChange={onChange}
                  inputMode="numeric"
                  min="0"
                  step="1"
                  placeholder="VD: 3"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              }
            />

            <Fieldset
              id={`${idPrefix}-supplier`}
              label="Nhà cung ứng chính"
              control={
                <input
                  id={`${idPrefix}-supplier`}
                  name="supplier"
                  value={values.supplier}
                  onChange={onChange}
                  placeholder="VD: CP Foods"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              }
            />

            <Fieldset
              id={`${idPrefix}-packaging`}
              label="Quy cách đóng gói / nhận hàng"
              control={
                <input
                  id={`${idPrefix}-packaging`}
                  name="packaging"
                  value={values.packaging}
                  onChange={onChange}
                  placeholder="VD: Thùng 10kg (2 túi 5kg hút chân không)"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              }
              colSpan
            />

            <Fieldset
              id={`${idPrefix}-storageNote`}
              label="Điều kiện bảo quản / ghi chú vận hành"
              control={
                <textarea
                  id={`${idPrefix}-storageNote`}
                  name="storageNote"
                  value={values.storageNote}
                  onChange={onChange}
                  rows={3}
                  placeholder="VD: Giữ lạnh 0-2°C, dùng trong 48h sau khi mở bao bì"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              }
              colSpan
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              {primaryLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
type FieldsetProps = {
  id: string;
  label: string;
  control: ReactElement;
  hint?: string;
  colSpan?: boolean;
};

function Fieldset({ id, label, control, hint, colSpan }: FieldsetProps) {
  return (
    <div className={colSpan ? "sm:col-span-2" : undefined}>
      <label className="text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      {control}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

type DeleteConfirmModalProps = {
  isOpen: boolean;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteConfirmModal({ isOpen, itemName, onCancel, onConfirm }: DeleteConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm"
      onClick={onCancel}
      role="alertdialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-100 px-6 py-4">
          <h4 className="text-lg font-semibold text-rose-600">Xóa nguyên liệu?</h4>
        </div>
        <div className="px-6 py-4 text-sm text-slate-600">
          Nguyên liệu <span className="font-semibold text-slate-900">{itemName}</span> sẽ bị xóa khỏi danh sách và không còn khả dụng trong các quy trình đặt hàng. Bạn có chắc chắn muốn tiếp tục?
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            Xóa nguyên liệu
          </button>
        </div>
      </div>
    </div>
  );
}