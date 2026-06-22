# BUSINESS IMPACT MATRIX

Ma trận này đánh giá mức độ tác động và tính khả thi của từng Domain để xác định thứ tự ưu tiên (Priority) cho các Sprint tiếp theo.

## Tiêu chí đánh giá (Thang điểm 1-10)

*   **Business Value (Giá trị nghiệp vụ):** Mức độ ảnh hưởng trực tiếp tới Doanh thu, User Acquisition, hoặc Core USP của sản phẩm. Càng cao càng tốt.
*   **Technical Effort (Nỗ lực kỹ thuật):** Khối lượng công việc ước tính (Frontend, Backend, DB). Càng cao thì làm càng lâu.
*   **Dependency (Mức độ phụ thuộc):** Domain này có bị khóa bởi Domain khác không? (VD: Admin không thể duyệt nội dung nếu Provider/User chưa có tính năng tạo nội dung). Càng cao càng rủi ro.

## Công thức tính

`Priority Score = (Business Value * 10) / (Technical Effort + Dependency)`

*(Điểm Priority càng cao, ưu tiên triển khai càng lớn)*

---

## Bảng đánh giá

| Domain | Business Value | Technical Effort | Dependency | Priority Score | Rank | Phân tích |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Provider** | **10** | **5** | **2** | **14.28** | **1** | Mảng cốt lõi tạo ra doanh thu. NCC đã mua gói nhưng chưa có chức năng tạo Dịch Vụ. Phải làm ngay để hoàn thiện vòng lặp kiếm tiền. Phụ thuộc ít vì bảng DICH_VU đã sẵn sàng. |
| **Traveler** | 5 | 3 | 2 | **10.00** | **2** | Cập nhật Profile cá nhân. Giá trị kinh doanh không quá cao nhưng làm rất nhanh (Low hanging fruit). |
| **Planner** | 8 | 7 | 4 | **7.27** | **3** | Tính năng Share Public và Realtime (SignalR). Tạo ra tính Viral cao nhưng tốn effort để setup WebSocket và đồng bộ state frontend. |
| **Admin** | 8 | 6 | 7 | **6.15** | **4** | Moderation Center để duyệt bài. Rất cần thiết nhưng bị phụ thuộc nặng vào Provider và Community (Phải có dữ liệu mới có cái để duyệt). |
| **Community**| 7 | 6 | 6 | **5.83** | **5** | Đánh giá, Blog. Cần thiết để tạo UGC (User Generated Content) nhưng giao diện khá phức tạp (Form rating 4 chiều, CMS viết bài). |
| **AI** | 6 | 9 | 2 | **5.45** | **6** | Tạo điểm nhấn (USP) nhưng quá phức tạp, rủi ro cao nếu đâm đầu vào lúc này khi các mảng Core chưa ổn định. |

---

## KẾT LUẬN & QUYẾT ĐỊNH

Dữ liệu chứng minh rõ ràng **Provider Domain** mang lại Priority Score cao nhất (**14.28**). Việc giải quyết nút thắt cổ chai ở tính năng tạo dịch vụ cho NCC sẽ khép kín mô hình kinh doanh của EZTravel.

**=> SPRINT ƯU TIÊN SỐ 1: PROVIDER CORE (Quản lý Dịch vụ NCC)**
