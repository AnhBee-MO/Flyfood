"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type CreateBrandPayload = {
  id: string;
  name: string;
  manager?: string;
};

type CreateBrandModalProps = {
  onClose: () => void;
  onSubmit: (payload: CreateBrandPayload) => void | Promise<void>;
};

export default function CreateBrandModal({ onClose, onSubmit }: CreateBrandModalProps) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [manager, setManager] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ id, name, manager: manager || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-brand-title"
        className="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="create-brand-title" className="text-lg font-semibold text-slate-900">
              Tạo thương hiệu
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Điền đầy đủ thông tin để khởi tạo thương hiệu mới trong hệ thống.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="brand-name">
                Tên thương hiệu
              </label>
              <input
                id="brand-name"
                name="brand-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="VD: Flyfood Wedding"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="brand-code">
                Mã thương hiệu
              </label>
              <input
                id="brand-code"
                name="brand-code"
                type="text"
                required
                value={id}
                onChange={(event) => setId(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="VD: BR-001"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700" htmlFor="brand-manager">
                Người phụ trách
              </label>
              <input
                id="brand-manager"
                name="brand-manager"
                type="text"
                value={manager}
                onChange={(event) => setManager(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-sm transition focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="VD: Trần Lê"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-xl border border-transparent bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Tạo mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
