"use client";

import { useEffect, useMemo, useState } from "react";

type OrderStatus = "all" | "pending" | "cooking" | "completed" | "cancelled";

const orderTabs: Array<{ key: OrderStatus; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "cooking", label: "Đang chế biến" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

const orderStatusLabel: Record<Exclude<OrderStatus, "all">, string> = {
  pending: "Chờ xác nhận",
  cooking: "Đang chế biến",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const orderStatusBadge: Record<Exclude<OrderStatus, "all">, string> = {
  pending: "border border-amber-200 bg-amber-50 text-amber-700",
  cooking: "border border-sky-200 bg-sky-50 text-sky-700",
  completed: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border border-rose-200 bg-rose-50 text-rose-700",
};

type OrderItem = { name: string; quantity: number; price: number; note?: string };
type OrderRecord = {
  code: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  brand: string;
  status: Exclude<OrderStatus, "all">;
  orderedAt: string;
  total: number;
  paymentStatus: "Chưa thanh toán" | "Đã thanh toán" | "Thanh toán COD";
  shippingContact: { name: string; phone: string };
  items: OrderItem[];
};

const formatCurrency = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");
  const [searchOrder, setSearchOrder] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [filterBrand, setFilterBrand] = useState("all");
  const [filterStatus, setFilterStatus] = useState<OrderStatus>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [detailOrderCode, setDetailOrderCode] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params = new URLSearchParams({
          status: activeTab,
          searchOrder,
          searchCustomer,
          brand: filterBrand,
          filterStatus,
          dateFrom,
          dateTo,
          page: "1",
          limit: "200",
        });
        const res = await fetch(`/api/orders?${params.toString()}`);
        const json = await res.json();
        if (!cancelled) setOrders(json.orders ?? []);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab, searchOrder, searchCustomer, filterBrand, filterStatus, dateFrom, dateTo]);

  const brands = useMemo(() => Array.from(new Set(orders.map((o) => o.brand))), [orders]);

  const filteredOrders = useMemo(() => {
    const fromDate = dateFrom ? new Date(`${dateFrom}T00:00`) : null;
    const toDateObj = dateTo ? new Date(`${dateTo}T23:59`) : null;
    return orders.filter((order) => {
      if (activeTab !== "all" && order.status !== activeTab) return false;
      if (searchOrder && !order.code.toLowerCase().includes(searchOrder.toLowerCase())) return false;
      if (searchCustomer && !order.customerName.toLowerCase().includes(searchCustomer.toLowerCase())) return false;
      if (filterBrand !== "all" && order.brand !== filterBrand) return false;
      if (filterStatus !== "all" && order.status !== filterStatus) return false;
      const orderedDate = new Date(order.orderedAt);
      if (fromDate && orderedDate < fromDate) return false;
      if (toDateObj && orderedDate > toDateObj) return false;
      return true;
    });
  }, [orders, activeTab, searchOrder, searchCustomer, filterBrand, filterStatus, dateFrom, dateTo]);

  const detailOrder = detailOrderCode ? orders.find((o) => o.code === detailOrderCode) ?? null : null;

  const openOrderDetail = (orderCode: string) => {
    setDetailOrderCode(orderCode);
    setIsDetailOpen(true);
  };
  const closeOrderDetail = () => {
    setIsDetailOpen(false);
    setDetailOrderCode(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quản lý đơn hàng</h2>
          <p className="text-sm text-slate-600">Theo dõi, lọc và thao tác nhanh trên từng đơn từ tiếp nhận tới bàn giao.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <button className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 font-semibold uppercase tracking-wide text-emerald-700 hover:bg-emerald-100">
            Tạo đơn mới
          </button>
          <button className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 font-semibold uppercase tracking-wide text-rose-700 hover:bg-rose-100">
            Hủy đơn đã chọn
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {orderTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${
              activeTab === tab.key
                ? "border border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border border-transparent text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="flex flex-col gap-1 text-xs uppercase text-slate-500">
            Mã đơn
            <input
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              placeholder="Nhập mã đơn"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase text-slate-500">
            Khách hàng
            <input
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              placeholder="Tên khách hàng"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase text-slate-500">
            Thương hiệu
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">Tất cả</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase text-slate-500">
            Trạng thái
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as OrderStatus)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="cooking">Đang chế biến</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-xs uppercase text-slate-500">
              Từ ngày
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs uppercase text-slate-500">
              Đến ngày
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Đơn hàng</th>
                <th className="px-4 py-3 text-left">Khách hàng</th>
                <th className="px-4 py-3 text-left">Thời gian đặt</th>
                <th className="px-4 py-3 text-left">Thương hiệu</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-right">Tổng tiền</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">Không tìm thấy đơn hàng phù hợp.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.code} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{order.code}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-slate-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(order.orderedAt).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{order.brand}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${orderStatusBadge[order.status]}`}>
                        {orderStatusLabel[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-center gap-2 text-xs">
                        <button className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-emerald-700 hover:bg-emerald-100" title="Xác nhận">Duyệt</button>
                        <button className="rounded-full border border-rose-300 bg-rose-50 px-2 py-1 text-rose-700 hover:bg-rose-100" title="Hủy đơn">Hủy</button>
                        <button className="rounded-full border border-slate-300 bg-white px-2 py-1 text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700" title="Xem chi tiết" onClick={() => openOrderDetail(order.code)}>Chi tiết</button>
                        <button className="rounded-full border border-slate-300 bg-white px-2 py-1 text-slate-600 hover:border-slate-400" title="Sao chép đơn">Sao chép</button>
                        <button className="rounded-full border border-slate-300 bg-white px-2 py-1 text-slate-600 hover:border-slate-400" title="Xuất dữ liệu">Xuất</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailOpen && detailOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase text-slate-500">Mã đơn</p>
                <h3 className="text-xl font-semibold text-slate-900">{detailOrder.code}</h3>
              </div>
              <button onClick={closeOrderDetail} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs uppercase tracking-wide text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">Đóng</button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <section>
                <p className="text-xs uppercase text-slate-500">Thông tin khách hàng</p>
                <p className="mt-1 font-medium text-slate-900">{detailOrder.customerName}</p>
                <p>{detailOrder.customerPhone}</p>
                <p>{detailOrder.customerAddress}</p>
              </section>
              <section>
                <p className="text-xs uppercase text-slate-500">Thời gian đặt</p>
                <p className="mt-1">{new Date(detailOrder.orderedAt).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}</p>
              </section>
              <section>
                <p className="text-xs uppercase text-slate-500">Thông tin món</p>
                <ul className="mt-2 space-y-2">
                  {detailOrder.items.map((item) => (
                    <li key={`${detailOrder.code}-${item.name}`} className="rounded-lg bg-slate-50 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">{item.name} x {item.quantity}</span>
                        <span>{formatCurrency(item.price)}</span>
                      </div>
                      {item.note ? (<p className="text-xs text-slate-500">Ghi chú: {item.note}</p>) : null}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <p className="text-xs uppercase text-slate-500">Tình trạng thanh toán</p>
                <p className="mt-1 font-medium text-slate-900">{detailOrder.paymentStatus}</p>
              </section>
              <section>
                <p className="text-xs uppercase text-slate-500">Thông tin giao vận</p>
                <p className="mt-1">{detailOrder.shippingContact.name}</p>
                <p>{detailOrder.shippingContact.phone}</p>
              </section>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-sm font-medium text-slate-600">Tổng cộng</span>
                <span className="text-lg font-semibold text-slate-900">{formatCurrency(detailOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

