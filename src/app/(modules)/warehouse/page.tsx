"use client";

const moduleLabel = "Quản trị kho";

export default function WarehousePage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">{moduleLabel}</h2>
        <p className="text-sm text-slate-600"></p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Kho lạnh & kho khô</h3>
        <p className="text-sm text-slate-600">
          Theo dõi tồn kho động, tiến độ staging và cảnh báo nhiệt độ trước khi bàn giao cho tổ sơ chế.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <p className="text-xs uppercase text-slate-500">Kho lạnh 01</p>
            <p className="text-2xl font-semibold text-slate-900">78% dung lượng</p>
            <p className="text-xs text-amber-600">Cảnh báo: rau lá wave 2</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <p className="text-xs uppercase text-slate-500">Kho khô</p>
            <p className="text-2xl font-semibold text-slate-900">65% dung lượng</p>
            <p className="text-xs text-emerald-600">Trạng thái: ổn định</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Việc cần thực hiện</h3>
        <ol className="mt-3 space-y-2 list-decimal pl-4">
          <li>Kết nối dữ liệu tồn kho realtime từ hệ thống ERP.</li>
          <li>Hiển thị tiến độ staging từng wave với mốc thời gian.</li>
          <li>Kích hoạt cảnh báo nhiệt độ cho từng phòng kho.</li>
        </ol>
        <button className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 hover:bg-emerald-100">
          Xem template staging
        </button>
      </div>
    </div>
  );
}
