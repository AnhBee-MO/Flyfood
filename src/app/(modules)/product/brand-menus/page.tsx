"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";
import type {
  BrandMenusResponse,
  DishStatus,
  DishRecord,
  BrandRecord,
  SelectOption,
  DishFormValues,
} from "./types";

const DishFormModal = dynamic(() => import("./DishFormModal"));
const DeleteConfirmModal = dynamic(() => import("./DeleteConfirmModal"));

const statusLabel: Record<DishStatus, string> = {
  selling: "Đang bán",
  paused: "Tạm ngừng",
};

const statusBadgeStyles: Record<DishStatus, string> = {
  selling: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  paused: "border border-slate-200 bg-slate-50 text-slate-500",
};

const StatusSwitch = ({ status, onToggle }: { status: DishStatus; onToggle: () => void }) => {
  const isActive = status === "selling";

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
        {isActive ? "Chuyển sang trạng thái tạm ngừng" : "Khôi phục trạng thái đang bán"}
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

export default function BrandMenusPage() {
  const [brands, setBrands] = useState<BrandRecord[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [dishes, setDishes] = useState<DishRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | DishStatus>("all");
  const [isCreateDishOpen, setIsCreateDishOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState<DishRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/brand-menus");
        if (!response.ok) {
          throw new Error(`Failed to fetch brand menus: ${response.status}`);
        }

        const data: BrandMenusResponse = await response.json();
        if (!isMounted) {
          return;
        }

        setBrands(data.brands);
        setCategories(data.categories);
        setDishes(data.dishes);
        setLoadError(null);

        if (data.brands.length > 0) {
          setSelectedBrand((previous) => (previous === "all" ? data.brands[0].id : previous));
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }
        console.error("Không thể tải dữ liệu menu thương hiệu", error);
        setLoadError("Không thể tải dữ liệu menu thương hiệu. Vui lòng thử lại sau.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
    [],
  );

  const categoryLookup = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, category) => {
      acc[category.value] = category.label;
      return acc;
    }, {});
  }, [categories]);

  const brandLookup = useMemo(() => {
    return brands.reduce<Record<string, string>>((acc, brand) => {
      acc[brand.id] = brand.name;
      return acc;
    }, {});
  }, [brands]);

  const filteredDishes = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return dishes
      .filter((dish) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          dish.name.toLowerCase().includes(normalizedQuery) ||
          dish.code.toLowerCase().includes(normalizedQuery);

        const matchesCategory = categoryFilter === "all" || dish.categoryId === categoryFilter;
        const matchesStatus = activeTab === "all" || dish.status === activeTab;
        const matchesBrand = selectedBrand === "all" || dish.brandId === selectedBrand;

        return matchesQuery && matchesCategory && matchesStatus && matchesBrand;
      })
      .sort((a, b) => a.name.localeCompare(b.name, "vi", { sensitivity: "base" }));
  }, [dishes, searchQuery, categoryFilter, activeTab, selectedBrand]);

  const totalCount = dishes.length;
  const filteredCount = filteredDishes.length;
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    categoryFilter !== "all" ||
    activeTab !== "all" ||
    selectedBrand !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setActiveTab("all");
    setSelectedBrand("all");
  };

  const handleToggleStatus = (dishId: string) => {
    setDishes((previous) =>
      previous.map((dish) =>
        dish.id === dishId
          ? { ...dish, status: dish.status === "selling" ? "paused" : "selling" }
          : dish,
      ),
    );
  };

  const handleOpenCreateDish = () => {
    setIsCreateDishOpen(true);
  };

  const closeCreateDishModal = () => {
    setIsCreateDishOpen(false);
  };

  const handleCreateDishSubmit = (values: DishFormValues) => {
    const newDish: DishRecord = {
      id: `dish-${Date.now().toString(36)}`,
      name: values.name,
      image: values.imageFileName ? `/uploads/${values.imageFileName}` : "/next.svg",
      code: values.code,
      categoryId: values.categoryId,
      brandId: values.brandId,
      price: 0,
      status: "selling",
      description: values.description,
      sellingUnit: values.sellingUnit,
      nutritionalInfo: values.nutritionalInfo,
      allergenInfo: values.allergenInfo,
      shelfLifeStorage: values.shelfLifeStorage,
    };

    setDishes((prev) => [...prev, newDish]);
    closeCreateDishModal();
  };

  const handleDeleteDish = (dish: DishRecord) => {
    setDishToDelete(dish);
  };

  const handleConfirmDelete = () => {
    if (dishToDelete) {
      setDishes((prev) => prev.filter((d) => d.id !== dishToDelete.id));
      setDishToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Menu thương hiệu</h1>
          <p className="mt-1 text-sm text-slate-600">
            Tổng {totalCount} món ăn được cấu hình. Đang hiển thị {filteredCount}{" "}
            món ăn theo bộ lọc hiện tại.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateDish}
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
          Tạo món mới
        </button>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "all" ? "bg-white text-emerald-700 shadow-sm" : "hover:text-emerald-700"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("selling")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "selling"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "hover:text-emerald-700"
              }`}
            >
              Đang bán
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("paused")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "paused"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "hover:text-emerald-700"
              }`}
            >
              Ngừng bán
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
                placeholder="Tìm món ăn theo tên, mã"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <select
              name="category-filter"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <option value="all">Danh mục: Tất cả</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              name="brand-filter"
              value={selectedBrand}
              onChange={(event) => setSelectedBrand(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <option value="all">Thương hiệu: Tất cả</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
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
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 text-left">Món ăn</th>
                <th className="px-4 py-3 text-left">Thương hiệu</th>
                <th className="px-4 py-3 text-left">Danh mục</th>
                <th className="px-4 py-3 text-right">Giá bán</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : loadError ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-rose-500">
                    {loadError}
                  </td>
                </tr>
              ) : filteredDishes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
                    Không tìm thấy món ăn phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredDishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <Image
                          src={dish.image}
                          alt={dish.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-slate-900">{dish.name}</div>
                          <div className="text-xs font-mono text-slate-500">{dish.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="font-medium text-slate-900">
                        {brandLookup[dish.brandId] ?? "Không xác định"}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="font-medium text-slate-900">
                        {categoryLookup[dish.categoryId] ?? "Không xác định"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right align-middle font-medium text-slate-900">
                      {numberFormatter.format(dish.price)}
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusBadgeStyles[dish.status]
                          }`}
                        >
                          {statusLabel[dish.status]}
                        </span>
                        <StatusSwitch status={dish.status} onToggle={() => handleToggleStatus(dish.id)} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-sky-700"
                          aria-label={`Xem chi tiết ${dish.name}`}
                          title="Chi tiết"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path
                              d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDish(dish)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                          aria-label={`Xóa ${dish.name}`}
                          title="Xóa"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path
                              d="M14 6l-1 10H7L6 6m3-3h2a1 1 0 0 1 1 1v2H6V4a1 1 0 0 1 1-1h2Z"
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

      {isCreateDishOpen && (
        <DishFormModal
          isOpen={isCreateDishOpen}
          mode="create"
          title="Tạo món mới"
          description="Thêm món ăn mới vào danh sách của bạn."
          primaryLabel="Lưu món mới"
          onClose={closeCreateDishModal}
          onSubmit={handleCreateDishSubmit}
          categoryOptions={categories}
          brandOptions={brands}
        />
      )}

      {dishToDelete && (
        <DeleteConfirmModal
          isOpen={!!dishToDelete}
          itemName={dishToDelete.name}
          onCancel={() => setDishToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
