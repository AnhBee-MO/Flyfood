"use client";

const moduleLabel = "Quản trị chuỗi cung ứng & mua sắm";

export default function SupplyPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-900">{moduleLabel}</h2>
        <p className="text-sm text-slate-600"></p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Bảng điều hành PO</h3>
        <p className="text-sm text-slate-600">
          Giám sát tiến độ PO, trạng thái xác nhận và chi phí tiết kiệm trước khi nguyên liệu nhập kho staging.
        </p>
        <div className="mt-4 grid gap-3 text-sm text-slate-700">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <p className="text-xs uppercase text-slate-500">PO-3389 – Minh Phú seafood</p>
            <p className="mt-1 font-medium text-slate-900">Giao 14:30 – chờ xác nhận nhiệt độ vận chuyển</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <p className="text-xs uppercase text-slate-500">PO-3392 – Rau hữu cơ</p>
            <p className="mt-1 font-medium text-slate-900">Đã nhận – đang QC đầu vào</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 text-xs text-slate-600">
          <button className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 uppercase tracking-wide text-emerald-700 hover:bg-emerald-100">
            Tạo PO mới
          </button>
          <button className="rounded-full border border-slate-300 bg-white px-3 py-1 uppercase tracking-wide hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">
            Gửi nhắc xác nhận
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Kế hoạch tích hợp</h3>
        <ul className="mt-3 space-y-2">
          <li>- Đồng bộ bảng giá nhà cung ứng từ phòng Kinh doanh.</li>
          <li>- Bổ sung biểu đồ tiết kiệm chi phí theo kỳ.</li>
          <li>- Tự động gửi cảnh báo PO trễ cho nhóm Thu mua.</li>
        </ul>
      </div>
    </div>
  );
}
