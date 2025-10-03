export type TeamLabel = { key: string; label: string };

export type Brand = {
  id: string;
  name: string;
  category?: string;
  channel?: string;
  status: string;
  manager?: string;
  lastUpdated?: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  shift: string;
  teamKey: string | null;
  brandId: string;
  permissions: string[];
  status: string;
  dob?: string;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
};

export type OrderItem = { name: string; quantity: number; price: number; note?: string };

export type Order = {
  code: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  brand: string;
  status: "pending" | "cooking" | "completed" | "cancelled";
  orderedAt: string;
  total: number;
  paymentStatus: "Chưa thanh toán" | "Đã thanh toán" | "Thanh toán COD";
  shippingContact: { name: string; phone: string };
  items: OrderItem[];
};

