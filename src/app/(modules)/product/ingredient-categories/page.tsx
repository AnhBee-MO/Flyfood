"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type CategoryStatus = "active" | "inactive";

type IngredientCategory = {
  id: string;
  name: string;
  ingredientCount: number;
  status: CategoryStatus;
};

const initialCategories: IngredientCategory[] = [
  { id: "cat-01", name: "Nguyên liệu tươi", ingredientCount: 18, status: "active" },
  { id: "cat-02", name: "Gia vị & nước sốt", ingredientCount: 24, status: "active" },
  { id: "cat-03", name: "Đồ khô", ingredientCount: 9, status: "active" },
  { id: "cat-04", name: "Đồ đông lạnh", ingredientCount: 6, status: "inactive" },
  { id: "cat-05", name: "Bao bì", ingredientCount: 12, status: "inactive" },
];

const statusLabel: Record<CategoryStatus, string> = {
  active: "Hoạt động",
  inactive: "Tạm ngưng",
};

const statusBadgeStyles: Record<CategoryStatus, string> = {
  active: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  inactive: "border border-slate-200 bg-slate-50 text-slate-500",
};

const StatusSwitch = ({ status, onToggle }: { status: CategoryStatus; onToggle: () => void }) => {
  const isActive = status === "active";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
        isActive ? "bg-emerald-500" : "bg-slate-300"
      }`}
    >
      <span className="sr-only">
        {isActive ? "Chuyển sang trạng thái tạm ngưng" : "Khôi phục trạng thái hoạt động"}
      </span>
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
          isActive ? "translate-x-6" : "translate-x-1"
        }`}
        aria-hidden="true"
      />
    </button>
  );
};

export default function IngredientCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [activeTab, setActiveTab] = useState<CategoryStatus>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [editState, setEditState] = useState<{ id: string; name: string } | null>(null);
  const [deleteState, setDeleteState] = useState<
    { id: string; name: string; ingredientCount: number } | null
  >(null);

  const visibleCategories = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesStatus = category.status === activeTab;
      const matchesQuery =
        normalizedQuery.length === 0 || category.name.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [categories, activeTab, searchQuery]);

  const totalInTab = useMemo(() => {
    return categories.filter((category) => category.status === activeTab).length;
  }, [categories, activeTab]);

  const handleDragStart = (categoryId: string) => {
    setDraggedId(categoryId);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      return;
    }

    setCategories((previous) => {
      const updated = [...previous];
      const fromIndex = updated.findIndex((item) => item.id === draggedId);
      const toIndex = updated.findIndex((item) => item.id === targetId);

      if (fromIndex === -1 || toIndex === -1) {
        return previous;
      }

      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);

      return updated;
    });

    setDraggedId(null);
  };

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = createName.trim();

    if (trimmedName.length === 0) {
      return;
    }

    setCategories((previous) => [
      ...previous,
      {
        id: "cat-" + Date.now().toString(36),
        name: trimmedName,
        ingredientCount: 0,
        status: "active",
      },
    ]);

    setCreateName("");
    setIsCreateOpen(false);
    setActiveTab("active");
  };

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editState) {
      return;
    }

    const trimmedName = editState.name.trim();

    if (trimmedName.length === 0) {
      return;
    }

    setCategories((previous) =>
      previous.map((category) =>
        category.id === editState.id ? { ...category, name: trimmedName } : category,
      ),
    );

    setEditState(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find((item) => item.id === categoryId);

    if (!category) {
      return;
    }

    if (category.ingredientCount > 0) {
      setDeleteState({
        id: category.id,
        name: category.name,
        ingredientCount: category.ingredientCount,
      });
      return;
    }

    setCategories((previous) => previous.filter((item) => item.id !== categoryId));
  };

  const confirmDelete = () => {
    if (!deleteState) {
      return;
    }

    setCategories((previous) => previous.filter((item) => item.id !== deleteState.id));
    setDeleteState(null);
  };

  const handleToggleStatus = (categoryId: string) => {
    setCategories((previous) =>
      previous.map((category) =>
        category.id === categoryId
          ? { ...category, status: category.status === "active" ? "inactive" : "active" }
          : category,
      ),
    );
  };

  const emptyState = visibleCategories.length === 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Danh mục nguyên liệu</h1>
          <p className="mt-1 text-sm text-slate-600">
            Đang hiển thị {visibleCategories.length} / {totalInTab} danh mục trong tab{" "}
            {activeTab === "active" ? "Hoạt động" : "Tạm ngưng"}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
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
          Tạo danh mục
        </button>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "active"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "hover:text-emerald-700"
              }`}
            >
              Hoạt động
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("inactive")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "inactive"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "hover:text-emerald-700"
              }`}
            >
              Tạm ngưng
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full text-sm sm:w-72">
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
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm danh mục"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="w-16 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Thứ tự
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tên danh mục
                </th>
                <th scope="col" className="w-40 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                  Số nguyên liệu
                </th>
                <th scope="col" className="w-52 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                  Trạng thái
                </th>
                <th scope="col" className="w-40 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleCategories.map((category, index) => {
                const isDragging = draggedId === category.id;

                return (
                  <tr
                    key={category.id}
                    draggable
                    onDragStart={() => handleDragStart(category.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(category.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className={`group cursor-grab select-none bg-white transition ${
                      isDragging ? "opacity-60" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-4 py-3 text-center align-middle">
                      <div
                        className={`mx-auto flex h-9 w-14 items-center justify-center gap-2 rounded-full border text-xs font-semibold transition ${
                          isDragging
                            ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                            : "border-slate-200 bg-slate-50 text-slate-400"
                        }`}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path
                            d="M7 4h-.01M7 7h-.01M7 10h-.01M7 13h-.01M7 16h-.01M13 4h-.01M13 7h-.01M13 10h-.01M13 13h-.01M13 16h-.01"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="block max-w-[260px] truncate font-medium text-slate-800">
                        {category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle text-center">
                      <span className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                        {category.ingredientCount} nguyên liệu
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center justify-center gap-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusBadgeStyles[category.status]
                          }`}
                        >
                          {statusLabel[category.status]}
                        </span>
                        <StatusSwitch
                          status={category.status}
                          onToggle={() => handleToggleStatus(category.id)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center justify-end gap-2 text-slate-500">
                        <button
                          type="button"
                          onClick={() => setEditState({ id: category.id, name: category.name })}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 transition hover:border-sky-200 hover:text-sky-700"
                          title="Chỉnh sửa danh mục"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path
                              d="M4 13.5V16h2.5L15 7.5 12.5 5 4 13.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 transition hover:border-rose-200 hover:text-rose-600"
                          title="Xoá danh mục"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path
                              d="M5 6h10m-8 0V4h6v2m-1 0v9a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V6"
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
                );
              })}
            </tbody>
          </table>

          {emptyState && (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center text-sm text-slate-500">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-400">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 7h10M7 12h7M7 17h5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p>Không có danh mục nào trong danh sách này.</p>
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
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
                Tạo danh mục mới
              </button>
            </div>
          )}
        </div>
      </section>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <header className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">Tạo danh mục mới</h2>
              <p className="text-sm text-slate-600">Nhap ten danh muc de bat dau phan loai nguyên liệu.</p>
            </header>
            <form className="mt-4 space-y-4" onSubmit={handleCreateSubmit}>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="create-category-name">
                  Tên danh mục
                </label>
                <input
                  id="create-category-name"
                  name="create-category-name"
                  type="text"
                  value={createName}
                  onChange={(event) => setCreateName(event.target.value)}
                  autoFocus
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="VD: Nguyên liệu tươi"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setCreateName("");
                  }}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Lưu danh mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <header className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-900">Chỉnh sửa danh mục</h2>
              <p className="text-sm text-slate-600">Cập nhật tên danh mục để đồng bộ với kho.</p>
            </header>
            <form className="mt-4 space-y-4" onSubmit={handleEditSubmit}>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="edit-category-name">
                  Tên danh mục
                </label>
                <input
                  id="edit-category-name"
                  name="edit-category-name"
                  type="text"
                  value={editState.name}
                  onChange={(event) =>
                    setEditState((previous) =>
                      previous ? { ...previous, name: event.target.value } : null,
                    )
                  }
                  autoFocus
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="VD: Nguyên liệu tươi"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditState(null)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-rose-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path
                    d="M10 6.5v5m0 2v-.01M4.5 4.5h11l-1 11h-9l-1-11Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Xác nhận xoá danh mục</h2>
                <p className="text-sm text-slate-600">
                  Danh mục &quot;{deleteState.name}&quot; vẫn còn {deleteState.ingredientCount} nguyên liệu được gán.
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Xác nhận xoá sẽ bỏ danh mục khỏi hệ thống. Bạn có thể chuyển danh mục sang trạng thái tạm
              ngưng thay vì xoá nếu muốn giữ lịch sử.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteState(null)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
              >
                Vẫn xoá danh mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
