# Flyfood Admin Dashboard Wireframes

## 1. Overview
- **Mục tiêu**: Hỗ trợ quản trị chuỗi Flyfood vận hành trơn tru từ thương hiệu, sản phẩm đến sản xuất và phân phối
- **Persona chính**: Quản trị viên tổng (Admin), Quản lý vận hành (Ops), Nhân sự tổ/ca
- **Nguyên tắc UX**: Tập trung vào các cảnh báo theo thời gian thực, thao tác nhanh ngay tại danh sách, đảm bảo truy vết và quyền hạn rõ ràng

## 2. Kiến trúc thông tin
```
+----------------------------------------------------------------------------------+
| Header: Logo | Flyfood Admin | Quick Search | Alerts Icon | User Menu            |
+--------------+--------------------------------------------------------------+----+
| Left Nav     | Dashboard                                                     |    |
|              | 1. Thương hiệu                                                |    |
|              | 2. Nhân sự & Phân quyền                                       |    |
|              | 3. Đơn hàng                                                   |    |
|              | 4. Kho nguyên vật liệu                                        |    |
|              | 5. Chuỗi cung ứng                                             |    |
|              | 6. Sản phẩm                                                   |    |
|              | 7. Phân phối NLV                                             |    |
|              | 8. Tổ sản xuất                                                |    |
|              | 9. Chế biến thành phẩm                                        |    |
|              | Reports | Settings | Support                                  |    |
+--------------+--------------------------------------------------------------------+
| Breadcrumbs | Bộ lọc tổng | Nút hành động cấp module                             |
+----------------------------------------------------------------------------------+
| Main Content: Cards, Bảng dữ liệu, Timeline, Tabs tùy từng module                |
+----------------------------------------------------------------------------------+
```

### Global Dashboard (Trang chủ)
```
+----------------------------------------------------------------------------------+
| KPI Tiles: Tổng đơn hôm nay | Đơn chờ xử lý | Ca đang mở | Cảnh báo quy trình    |
+----------------------------------------------------------------------------------+
| Column 1 (60%):                                                 | Column 2 (40%): |
| - Timeline đơn hàng theo trạng thái                             | - Cảnh báo kho  |
| - Nút "Chi tiết" từng đơn                                       | - Danh sách ca  |
|                                                                  |   đang hoạt động|
+----------------------------------------------------------------------------------+
| Footer: Log hoạt động gần nhất | Liên hệ hỗ trợ                                |
+----------------------------------------------------------------------------------+
```

## 3. Wireframe chi tiết theo module

### 3.1 Module Quản lý thương hiệu
- **Trang danh sách**: Bảng thương hiệu (Logo, Tên, Kênh hoạt động, Trạng thái, Số lượng chi nhánh)
  - Bộ lọc: trạng thái, khu vực, kênh giao hàng
  - CTA: `+ Tạo thương hiệu`, `Xuất dữ liệu`
- **Trang chi tiết**
```
[Header] Tên thương hiệu | Trạng thái | Actions: Chỉnh sửa, Tạm dừng, Gán menu
[Tabs] Tổng quan | Menu | Kênh phân phối | Nhật ký hoạt động
[Section] KPIs: Đơn theo ngày, Doanh thu, Tồn kho cảnh báo
[Section] Danh sách điểm bán (table) với quick edit trạng thái
```
- **Form tạo/cập nhật**: 2 cột (Thông tin cơ bản / Thiết lập vận hành); side panel Preview menu chính

### 3.2 Module Nhân sự & Phân quyền
- **Danh sách nhân viên**: Table với avatar, tên, bộ phận, ca, vai trò, trạng thái
  - Tabs: Tất cả | Đang làm | Nghỉ phép | Đình chỉ
  - Quick filters: Tổ sản xuất, Chi nhánh
- **Chi tiết nhân viên**: Thẻ thông tin, lịch sử chấm công, quyền, thiết bị đang đăng nhập
- **Phân quyền**: Ma trận vai trò (vai trò vs module) + nút "Clone quyền"
- **Chấm công/Mở ca**: Modal nổi hiển thị danh sách ca, nút mở/đóng, đồng bộ máy chấm công

### 3.3 Module Quản lý đơn hàng
```
[Header] Đơn hàng | Bộ lọc trạng thái | Tìm nhanh theo mã đơn
[Segmented Controls] Trực tiếp | Từ nền tảng khác | Đơn đã gom
[Main Table] Mã đơn | Thương hiệu | Kênh | Giờ tạo | SLA | Trạng thái | Thao tác
[Side Panel] Chi tiết đơn (xuất hiện khi chọn dòng): timeline, nguyên liệu, tổ phụ trách
[Action Bar] + Tạo đơn | Nhập từ file | Đồng bộ API
```
- **Flow nhận đơn API**: Trang cấu hình API, mapping trạng thái, test connection
- **Flow chuyển trạng thái**: Modal chọn trạng thái kế tiếp, checkbox báo tổ liên quan, gợi ý checklist

### 3.4 Module Quản trị kho
- **Danh mục nguyên vật liệu**: Grid cards theo nhóm (Rau, Thịt, Gia vị...), click vào xem chi tiết tồn
- **Trang quản lý NLV**: Bảng với SKU, tên, đơn vị chính, định mức tối thiểu, tồn hiện tại, trạng thái cảnh báo
- **Quản lý đơn vị & đổi đơn vị**: Modal cấu hình đơn vị chính, phụ, hệ số chuyển đổi
- **Xuất/Nhập kho**: Tab đôi (Xuất | Nhập), form wizard 3 bước (Chọn nguồn/đích → Danh sách NLV → Xác nhận)
- **Kiểm kê & cân bằng**: Bảng chênh lệch, highlight đỏ nếu vượt ngưỡng, nút "Tạo phiếu điều chỉnh"

### 3.5 Module Chuỗi cung ứng & Mua sắm
- **Nhà cung ứng**: Card list với đánh giá SLA, trạng thái hợp đồng, công nợ
- **Đặt hàng & tạo PO**: Workflow dạng kanban (Nháp → Chờ duyệt → Đã gửi → Nhận hàng)
- **Công nợ**: Table với số tiền, hạn thanh toán, phần đã trả, cảnh báo trễ hạn
- **Tự động tách đơn**: Trang cấu hình rule (theo thương hiệu, SKU, kho nguồn)
- **Chạy POM**: Action lớn trên header, mở modal hiển thị summary các đơn được tạo tự động

### 3.6 Module Quản lý sản phẩm
- **Danh sách sản phẩm**: Gallery hiển thị ảnh, tên, thương hiệu, trạng thái bán
- **Chi tiết sản phẩm**: Tabs `Thông tin`, `Định lượng`, `Sơ chế`, `Chi phí`
  - Phần định lượng: bảng nguyên liệu, định mức, % hao hụt
- **Tạo sản phẩm**: Form 3 bước (Thông tin chung → Định lượng → Kiểm tra chi phí & duyệt)

### 3.7 Module Phân phối nguyên vật liệu
- **Tổ chế biến**: Card theo tổ (Rau, Gà, Cá, Gia vị...), badge trạng thái
- **Bảng phân phối**: Layout bảng 2 chiều (Tổ vs Đơn hàng/Nguyên liệu), drag & drop để phân chia
- **Cảnh báo sai quy trình**: Feed real-time bên phải, highlight đơn bị trễ hoặc sai (tooltip lý do)
- **Cập nhật trạng thái**: Button checklist (Đang chuẩn bị → Đang giao → Hoàn tất)

### 3.8 Module Quản trị tổ sản xuất
- **Màn hình theo tổ** (full-screen mode): timeline đơn, thẻ nguyên liệu, nút hoàn thành từng bước
- **Phân luồng hiển thị**: Kanban `Chờ nguyên liệu` → `Đang sơ chế` → `Chuyển tổ chế biến`
- **Cập nhật trạng thái hiển thị**: Quick toggle hiển thị/ẩn tổ trên màn hình lớn

### 3.9 Module Chế biến thành phẩm
- **Bảng đơn đang sản xuất**: Table với màu trạng thái; highlight xanh khi đủ nguyên liệu
- **Theo dõi quy trình**: Checklist bắt buộc, video hướng dẫn nếu tổ cần
- **Hoàn tất nhập kho**: Form confirm dữ liệu, chọn kho, ghi chú kiểm tra chất lượng

## 4. Luồng xử lý đơn hàng trên thực tế
1. **Thu ngân** xác nhận đơn trên màn hình Window → đơn được sinh ra trong Module 3 (Quản lý đơn hàng)
2. Đơn lập tức được gửi tới Module 7 (Phân phối NLV) → hệ thống tự động rã nguyên liệu tới các tổ sơ chế
3. Các **tổ sơ chế** thao tác trên màn hình riêng (Module 7): khi hoàn thành, nhấn "Hoàn tất", trạng thái cập nhật
4. Module 8 nhận trạng thái từ các tổ → hiển thị tiến độ, cảnh báo nếu chậm
5. Khi đủ nguyên liệu, Module 9 báo món "đủ nguyên liệu" (màu xanh) → Tổ chế biến nấu và xác nhận hoàn tất
6. Thành phẩm chuyển sang kho thành phẩm (Module 9 → Module 4) kèm biên bản kiểm tra chất lượng
7. Nhật ký hoạt động ghi nhận toàn bộ bước, hiển thị ở Dashboard và các module liên quan

## 5. Thành phần dùng chung
- **Right Panel**: Notifications real-time cho cảnh báo kho, ca, quy trình
- **Modal**: Dùng cho tạo mới, chỉnh sửa, confirm hành động quan trọng
- **Secondary Nav**: Tabs trong từng module để giữ layout nhất quán
- **State Indicators**: Badge màu (Xanh: On-track, Vàng: Cảnh báo, Đỏ: Lỗi quy trình)
- **Audit Trail**: Drawer hiển thị lịch sử thao tác người dùng (áp dụng cho mọi module quan trọng)

## 6. Gợi ý mở rộng tương lai
- Bản mobile cho quản lý ca/tổ trong kho
- Bảng điều khiển BI chuyên sâu (Power BI/Looker) kết nối cùng dữ liệu
- Tích hợp IoT (cân điện tử, cảm biến nhiệt độ) để giảm nhập tay
