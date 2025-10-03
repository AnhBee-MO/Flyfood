"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBrands } from "@/hooks/useApi";

const statusStyles: Record<string, string> = {
  "Hoạt động": "border border-emerald-200 bg-emerald-50 text-emerald-700",
  "Tạm ngưng": "border border-slate-200 bg-slate-50 text-slate-600",
};

export default function BrandingPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { brands, loading } = useBrands();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const statusOptions = useMemo(() => {
    return Array.from(new Set(brands.map((brand) => brand.status)));
  }, [brands]);

  const filteredBrands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return brands.filter((brand) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        brand.name.toLowerCase().includes(normalizedQuery) ||
        brand.category.toLowerCase().includes(normalizedQuery) ||
        brand.manager.toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || brand.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [brands, query, statusFilter]);

  const totalBrands = brands.length;
  const visibleCount = filteredBrands.length;

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsCreateOpen(false);
    }
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) setIsCreateOpen(false);
    }
    if (isCreateOpen) {
      document.addEventListener("keydown", handleKeydown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCreateOpen]);

  const handleResetFilters = () => {
    setQuery("");
    setStatusFilter("all");
  };

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Danh sách thương hiệu</h3>
            <p className="text-sm text-slate-600">
              Tổng {totalBrands} thương hiệu đang theo dõi. Đang hiển thị {visibleCount} kết quả theo bộ lọc hiện tại.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Tạo thương hiệu
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative text-sm">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M19 19l-4-4m1-5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên, danh mục, người phụ trách"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200 sm:w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="all">Trạng thái: Tất cả</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleResetFilters}
            disabled={query.length === 0 && statusFilter === "all"}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4.5 4.5l11 11m0-11-11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Xóa bộ lọc
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">Đang tải dữ liệu...</div>
          ) : visibleCount > 0 ? (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">Thương hiệu</th>
                  <th scope="col" className="px-3 py-3 text-left">Trạng thái</th>
                  <th scope="col" className="px-3 py-3 text-left">Cập nhật</th>
                  <th scope="col" className="px-6 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{brand.name}</div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">{brand.id}</div>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[brand.status] ?? "border border-slate-200 bg-slate-50 text-slate-600"}`}>
                        {brand.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-slate-600">{brand.lastUpdated}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-sky-200 hover:text-sky-700" aria-label={`Chỉnh sửa ${brand.name}`}>
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182l-9.45 9.45a2.25 2.25 0 0 1-.948.564l-3.182.795a.75.75 0 0 1-.91-.91l.795-3.182a2.25 2.25 0 0 1 .564-.948l9.45-9.45Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.5 10.5V19.5H4.5V4.5H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-sky-200 hover:text-sky-700" aria-label={`Xem chi tiết ${brand.name}`}>
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </button>
                        <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-500 transition hover:border-rose-200 hover:text-rose-600" aria-label={`Xóa ${brand.name}`}>
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 7.5H18M9.75 7.5V5.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V7.5m6 0v12.375a1.125 1.125 0 0 1-1.125 1.125H7.125A1.125 1.125 0 0 1 6 19.875V7.5h12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.5 11.25V16.5M13.5 11.25V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-sky-200 hover:text-sky-700" aria-label={`Xuất ${brand.name}`}>
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 3v12m0 0 4.5-4.5M12 15 7.5 10.5M4.5 18.75h15a1.5 1.5 0 0 0 1.5-1.5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center text-sm text-slate-500">
              <svg className="h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20.25 12a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.75 9.75h.008v.008H9.75V9.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 15.75c1.148 0 2.25-.563 3-1.5a3.75 3.75 0 0 0-6 0c.75.937 1.852 1.5 3 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>Không có thương hiệu phù hợp với bộ lọc. Thử thay đổi từ khóa hoặc bộ lọc khác.</p>
            </div>
          )}
        </div>
      </section>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" />
          <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="create-brand-title" className="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="create-brand-title" className="text-lg font-semibold text-slate-900">Tạo thương hiệu</h3>
                <p className="mt-1 text-sm text-slate-600">Điền đầy đủ thông tin để khởi tạo thương hiệu mới trong hệ thống.</p>
              </div>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50">×</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="brand-name">Tên thương hiệu</label>
                  <input id="brand-name" name="brand-name" type="text" required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="VD: Flyfood Wedding" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="brand-code">Mã thương hiệu</label>
                  <input id="brand-code" name="brand-code" type="text" required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="VD: BR-001" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="brand-manager">Người phụ trách</label>
                  <input id="brand-manager" name="brand-manager" type="text" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="VD: Trần Lê" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50">Hủy</button>
                <button type="submit" className="rounded-xl border border-transparent bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">Tạo mới</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

