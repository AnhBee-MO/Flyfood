export default function ProductPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quản lý sản phẩm</h2>
          <p className="text-sm text-slate-600">Quản lý thực đơn theo thương hiệu, danh mục và trạng thái.</p>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-sm text-slate-600">
          <p>
            Vào mục “Thực đơn theo thương hiệu” để tạo/sửa món, quản lý giá và trạng thái.
          </p>
          <div className="mt-4">
            <a
              href="/product/brand-menus"
              className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
            >
              Mở Thực đơn theo thương hiệu
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
