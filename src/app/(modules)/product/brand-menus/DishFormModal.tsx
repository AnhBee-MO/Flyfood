"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { BrandRecord, DishFormValues, SelectOption } from "./types";

type DishFormModalProps = {
  isOpen: boolean;
  mode: "create" | "edit";
  title: string;
  description: string;
  primaryLabel: string;
  initialValues?: DishFormValues;
  onClose: () => void;
  onSubmit: (values: DishFormValues) => void;
  categoryOptions: SelectOption[];
  brandOptions: BrandRecord[];
};

export default function DishFormModal({
  isOpen,
  mode,
  title,
  description,
  primaryLabel,
  initialValues,
  onClose,
  onSubmit,
  categoryOptions,
  brandOptions,
}: DishFormModalProps) {
  const [formValues, setFormValues] = useState<DishFormValues>(() =>
    mode === "edit" && initialValues
      ? initialValues
      : {
          name: "",
          code: `MN-${Date.now().toString(36).toUpperCase()}`,
          categoryId: "",
          brandId: "",
          description: "",
          imageFileName: "",
          sellingUnit: "",
          nutritionalInfo: "",
          allergenInfo: "",
          shelfLifeStorage: "",
        },
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  if (!isOpen) {
    return null;
  }

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

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {/* Dish Code (auto-generated, read-only) */}
            <div className="sm:col-span-1">
              <label htmlFor="dish-code" className="text-sm font-medium text-slate-700">
                Mã món
              </label>
              <input
                id="dish-code"
                name="code"
                value={formValues.code}
                readOnly
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 shadow-sm"
              />
            </div>

            {/* Dish Name */}
            <div className="sm:col-span-1">
              <label htmlFor="dish-name" className="text-sm font-medium text-slate-700">
                Tên món
              </label>
              <input
                id="dish-name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
                placeholder="VD: Gỏi gà xé phay"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            {/* Dish Category */}
            <div className="sm:col-span-1">
              <label htmlFor="dish-category" className="text-sm font-medium text-slate-700">
                Danh mục món
              </label>
              <select
                id="dish-category"
                name="categoryId"
                value={formValues.categoryId}
                onChange={handleChange}
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
            </div>

            {/* Brand */}
            <div className="sm:col-span-1">
              <label htmlFor="dish-brand" className="text-sm font-medium text-slate-700">
                Thương hiệu
              </label>
              <select
                id="dish-brand"
                name="brandId"
                value={formValues.brandId}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="">Chọn thương hiệu</option>
                {brandOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Selling Unit */}
            <div className="sm:col-span-1">
              <label htmlFor="dish-selling-unit" className="text-sm font-medium text-slate-700">
                Đơn vị bán
              </label>
              <input
                id="dish-selling-unit"
                name="sellingUnit"
                value={formValues.sellingUnit}
                onChange={handleChange}
                placeholder="VD: Phần, Đĩa, Ly"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            {/* Dish Image */}
            <div className="sm:col-span-2">
              <label htmlFor="dish-image" className="text-sm font-medium text-slate-700">
                Hình ảnh món
              </label>
              <input
                id="dish-image"
                name="imageFile"
                type="file"
                onChange={(event) => {
                  const files = event.target.files;
                  if (files && files.length > 0) {
                    setFormValues((prev) => ({ ...prev, imageFileName: files[0].name }));
                  }
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {formValues.imageFileName && (
                <p className="mt-2 text-xs text-slate-500">Đã chọn: {formValues.imageFileName}</p>
              )}
            </div>

            {/* Detailed Description */}
            <div className="sm:col-span-2">
              <label htmlFor="dish-description" className="text-sm font-medium text-slate-700">
                Mô tả chi tiết
              </label>
              <textarea
                id="dish-description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                rows={3}
                placeholder="Mô tả ngắn gọn về món ăn..."
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            {/* Nutritional Information */}
            <div className="sm:col-span-2">
              <label htmlFor="dish-nutritional-info" className="text-sm font-medium text-slate-700">
                Thông tin dinh dưỡng
              </label>
              <textarea
                id="dish-nutritional-info"
                name="nutritionalInfo"
                value={formValues.nutritionalInfo}
                onChange={handleChange}
                rows={3}
                placeholder="VD: Calo, Protein, Carb, Chất béo..."
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            {/* Allergen Information */}
            <div className="sm:col-span-2">
              <label htmlFor="dish-allergen-info" className="text-sm font-medium text-slate-700">
                Thông tin về chất gây dị ứng
              </label>
              <textarea
                id="dish-allergen-info"
                name="allergenInfo"
                value={formValues.allergenInfo}
                onChange={handleChange}
                rows={3}
                placeholder="VD: Đậu phộng, hải sản, sữa..."
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>

            {/* Shelf Life and Storage */}
            <div className="sm:col-span-2">
              <label htmlFor="dish-shelf-life-storage" className="text-sm font-medium text-slate-700">
                Hạn sử dụng và bảo quản
              </label>
              <textarea
                id="dish-shelf-life-storage"
                name="shelfLifeStorage"
                value={formValues.shelfLifeStorage}
                onChange={handleChange}
                rows={3}
                placeholder="VD: Bảo quản lạnh 0-4°C, dùng trong 3 ngày..."
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
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
