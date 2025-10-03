"use client";

const moduleLabel = "Quản lý thành phẩm";

export default function ProductionFinishPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">{moduleLabel}</h2>
        <p className="text-sm text-slate-600"></p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Checklist đóng gói & bàn giao</h3>
        <p className="text-sm text-slate-600">
          Tổng hợp kết quả QC, trạng thái đóng gói và mức độ sẵn sàng của từng tuyến trước khi bàn giao cho giao vận.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-slate-700">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <p className="text-xs uppercase text-slate-500">Tuyến Q1</p>
            <p className="mt-1 font-medium text-slate-900">QC 85% – đang đóng gói món tráng miệng</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <p className="text-xs uppercase text-slate-500">Tuyến Q7</p>
            <p className="mt-1 font-medium text-slate-900">Thiếu tem cảm biến – cần bổ sung ngay</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 text-xs text-slate-600">
          <button className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 uppercase tracking-wide text-emerald-700 hover:bg-emerald-100">
            In checklist
          </button>
          <button className="rounded-full border border-slate-300 bg-white px-3 py-1 uppercase tracking-wide hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">
            Gửi báo cáo QC
          </button>
        </div>
      </div>
    </div>
  );
}
