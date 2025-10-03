import { NextResponse } from "next/server";
import orders from "@/data/orders.json";

type OrderStatus = "pending" | "cooking" | "completed" | "cancelled";
type OrderItem = { name: string; quantity: number; price: number; note?: string };
type Order = {
  code: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  brand: string;
  status: OrderStatus;
  orderedAt: string;
  total: number;
  paymentStatus: "Chưa thanh toán" | "Đã thanh toán" | "Thanh toán COD";
  shippingContact: { name: string; phone: string };
  items: OrderItem[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status") || "all";
  const searchOrder = (searchParams.get("searchOrder") || "").toLowerCase();
  const searchCustomer = (searchParams.get("searchCustomer") || "").toLowerCase();
  const brand = searchParams.get("brand") || "all";
  const filterStatus = searchParams.get("filterStatus") || "all";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const allOrders = orders as unknown as Order[];
  let data: Order[] = allOrders.slice();

  // status tab
  if (status !== "all") {
    data = data.filter((o: Order) => o.status === status);
  }
  // explicit status filter
  if (filterStatus !== "all") {
    data = data.filter((o: Order) => o.status === filterStatus);
  }
  // brand filter
  if (brand !== "all") {
    data = data.filter((o: Order) => o.brand === brand);
  }
  // search
  if (searchOrder) {
    data = data.filter((o: Order) => String(o.code).toLowerCase().includes(searchOrder));
  }
  if (searchCustomer) {
    data = data.filter((o: Order) => String(o.customerName).toLowerCase().includes(searchCustomer));
  }
  // date range
  const fromDate = dateFrom ? new Date(`${dateFrom}T00:00`) : null;
  const toDateObj = dateTo ? new Date(`${dateTo}T23:59`) : null;
  if (fromDate) data = data.filter((o: Order) => new Date(o.orderedAt) >= fromDate);
  if (toDateObj) data = data.filter((o: Order) => new Date(o.orderedAt) <= toDateObj);

  // sort by orderedAt desc by default
  data.sort((a: Order, b: Order) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime());

  const total = data.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginated = data.slice(startIndex, endIndex);

  // derive brands for filter options
  const brands = Array.from(new Set(allOrders.map((o: Order) => o.brand)));

  return NextResponse.json({ total, page, limit, orders: paginated, brands });
}
