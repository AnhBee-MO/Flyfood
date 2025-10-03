"use client";

const moduleLabel = "Phân phối nguyên liệu";

export default function DistributionPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">{moduleLabel}</h2>
        <p className="text-sm text-slate-600"></p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Tổng quan wave trong ca</h3>
        <p className="text-sm text-slate-600">
          Theo dõi luồng nguyên liệu giữa kho, tổ sơ chế và bếp để bảo đảm bàn giao đúng lịch.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <p className="text-xs uppercase text-slate-500">Wave 2 - 18:00</p>
            <p className="mt-1 text-sm text-slate-700">Kho → PREP → COOK</p>
            <p className="text-xs text-emerald-600">Trạng thái: Đang bàn giao</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <p className="text-xs uppercase text-slate-500">Wave 3 - 19:15</p>
            <p className="mt-1 text-sm text-slate-700">Kho → PREP → DESSERT</p>
            <p className="text-xs text-amber-600">Trạng thái: chờ bổ sung rau thơm</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Lộ trình triển khai</h3>
        <ol className="mt-3 space-y-2 list-decimal pl-4">
          <li>Kết nối dữ liệu wave realtime từ hệ thống kế hoạch.</li>
          <li>Thiết lập cảnh báo khi tổ nhận chậm quá 5 phút.</li>
          <li>Tự động tạo bảng phân phối cho ca kế tiếp.</li>
        </ol>
      </div>
    </div>
  );
}
