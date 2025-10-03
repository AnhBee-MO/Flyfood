"use client";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({ isOpen, itemName, onCancel, onConfirm }: DeleteConfirmModalProps) {
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
          <h4 className="text-lg font-semibold text-rose-600">Xóa món ăn?</h4>
        </div>
        <div className="px-6 py-4 text-sm text-slate-600">
          Món ăn <span className="font-semibold text-slate-900">{itemName}</span> sẽ bị xóa khỏi danh sách và không
          thể khôi phục. Bạn có chắc chắn muốn tiếp tục?
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
            Xóa món ăn
          </button>
        </div>
      </div>
    </div>
  );
}
