# SPRINT 01 EXECUTION SPEC: PROVIDER CORE

Tài liệu này đóng vai trò là "Blueprint" (Bản vẽ kỹ thuật) để bắt đầu code Sprint 1 ngay lập tức. 

---

## 1. PHẠM VI (SCOPE)

*   **Tên Sprint:** Provider Core - Quản lý Dịch vụ NCC
*   **Mục tiêu chính:** Cho phép Nhà Cung Cấp (Provider) tự thêm, sửa, xóa, và xem danh sách các dịch vụ của họ (Khách sạn, Nhà hàng, v.v.). Đồng thời, tái cấu trúc lại `BookingService` cho đúng tên gọi.
*   **Domain:** Provider
*   **Duration (Estimate):** 2 Weeks
*   **Team:** 1 Backend, 1 Frontend

---

## 2. USER STORIES

*   **US-PROV-01:** Là một Nhà Cung Cấp, tôi muốn xem danh sách toàn bộ các dịch vụ (Khách sạn, Nhà hàng) do tôi sở hữu để quản lý chúng.
*   **US-PROV-02:** Là một Nhà Cung Cấp, tôi muốn tạo mới một Dịch vụ (Khách sạn) để bắt đầu kinh doanh trên platform.
*   **US-PROV-03:** Là một Nhà Cung Cấp, tôi muốn chỉnh sửa thông tin Dịch vụ (Tên, Giá, Hình ảnh) để cập nhật thông tin mới nhất.
*   **US-PROV-04:** Là một Admin/Dev, tôi muốn đổi tên Microservice `BookingService` thành `ProviderService` để code base phản ánh đúng nghiệp vụ thực tế (Do hệ thống không có luồng Booking).

---

## 3. BACKEND CHANGES

### 3.1. Tái cấu trúc Microservice (Refactoring)
*   **Hành động:** 
    *   Đổi tên project `ezTravel.BookingService` thành `ezTravel.ProviderService`.
    *   Sửa đổi route trong `YARP ApiGateway` (`appsettings.json` hoặc config file) trỏ các endpoint `/api/providers/*` về cluster `ProviderService` mới.
    *   Cập nhật CI/CD hoặc Dockerfile (nếu có) tương ứng.

### 3.2. Cập nhật PlaceService (CRUD Dịch vụ)
*   *Hiện trạng:* `HotelService.cs` đã có `CreateHotelAsync` và `UpdateHotelAsync` kiểm tra quyền sở hữu (`currentUserId`).
*   **Hành động:** 
    *   Bổ sung endpoint `GET /api/places/providers/{providerId}/services` để liệt kê TOÀN BỘ dịch vụ (Khách sạn, Nhà hàng, Hoạt động, Xe) thuộc về một `MaNhaCungCap`.
    *   Trong `PlaceService`, viết hàm lấy List `DichVu` filter theo `MaNhaCungCap`.

---

## 4. DATABASE CHANGES

*   *Không có thay đổi về Schema (Zero downtime deployment).*
*   Các bảng `DICH_VU`, `NHA_CUNG_CAP` đã đầy đủ trường dữ liệu.

---

## 5. FRONTEND CHANGES

### 5.1. Khởi tạo Component
*   **File cần sửa:** `d:\eztravel\WebClient\src\modules\provider\ServicesManager.tsx` (Hiện tại đang là Stub).
*   **Tạo mới các Component:**
    *   `src/modules/provider/components/ServiceTable.tsx` (Bảng hiển thị danh sách).
    *   `src/modules/provider/components/ServiceFormModal.tsx` (Popup/Modal để Thêm/Sửa dịch vụ).

### 5.2. Tích hợp RTK Query
*   **File:** `src/store/api/providerApi.ts` (Hoặc file tương đương).
*   **Endpoints cần nối:**
    *   `getProviderServices(providerId)`
    *   `createHotel(data)`
    *   `updateHotel({id, data})`
    *   `deleteHotel(id)`

### 5.3. UI/UX
*   Sử dụng Tailwind CSS để dựng Form.
*   Form tạo khách sạn phải có các trường: `Tên Khách Sạn` (Input), `Địa Điểm` (Select Tỉnh/Thành phố), `Địa chỉ cụ thể` (Input), `Giá Từ - Đến` (Number), `Ảnh Đại Diện` (URL input tạm thời hoặc Upload nếu có), `Mô tả` (Textarea).

---

## 6. API CONTRACTS

### 6.1. Get Provider Services
*   **Method:** `GET`
*   **URL:** `/api/places/providers/{providerId}/services`
*   **Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "tenDichVu": "Khách sạn Mường Thanh",
      "loaiDichVu": "KHACH_SAN",
      "giaTu": 500000,
      "trangThai": "ACTIVE",
      "tongDanhGia": 10,
      "ratingAvg": 4.5
    }
  ],
  "totalCount": 1
}
```

---

## 7. DTO CONTRACTS

*   Tái sử dụng các DTO có sẵn trong thư mục `ezTravel.DTO/Places/ServiceDtos.cs`.
*   Tạo thêm `ProviderServiceListDto` nếu cần để trả về danh sách rút gọn cho Table.

---

## 8. ACCEPTANCE CRITERIA (Tiêu chí nghiệm thu)

1.  **AC1:** Provider đăng nhập thành công, vào tab "Quản lý Dịch vụ" thấy được bảng danh sách dịch vụ mình đang sở hữu. Không thấy dịch vụ của người khác.
2.  **AC2:** Provider ấn "Thêm mới", điền form hợp lệ, ấn Submit -> DB lưu thành công, bảng danh sách tự động cập nhật (Refetch).
3.  **AC3:** Provider ấn "Sửa" một dịch vụ, điền giá mới, Submit -> Dữ liệu cập nhật thành công.
4.  **AC4:** Swagger UI cập nhật tên service thành `Provider Service` (không còn chữ `Booking`). ApiGateway routing chuẩn xác.

---

## 9. DEFINITION OF DONE (DoD)

*   [ ] Code Backend được push, pass SonarQube (nếu có).
*   [ ] Không có lỗi N+1 Query khi load danh sách dịch vụ của Provider.
*   [ ] Giao diện Frontend hiển thị tốt trên màn hình Desktop và Tablet.
*   [ ] React components không có warning/error trên console.
*   [ ] Đã test bằng tài khoản Provider thật dưới local.

---

## 10. RỦI RO (RISKS)

*   **Rủi ro 1:** Việc đổi tên `BookingService` -> `ProviderService` có thể làm hỏng các URL CROS/Reverse Proxy nếu không sửa triệt để trong YARP.
*   *Mitigation:* Cần Search & Replace toàn project chữ "BookingService", cẩn thận check lại `docker-compose` hoặc `launchSettings.json`.

---

## 11. ƯỚC TÍNH (ESTIMATE)

*   **Backend Refactor & API:** 3 Man-days.
*   **Frontend UI & Integration:** 4 Man-days.
*   **Testing & Bug fix:** 2 Man-days.
*   **Total:** 9 Man-days (~ 1 Sprint chuẩn).
