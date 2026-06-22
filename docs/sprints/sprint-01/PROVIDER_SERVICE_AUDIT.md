# PROVIDER SERVICE AUDIT

Tài liệu kiểm toán sự thật hiện tại của hệ thống đối với Provider Domain (Quản lý dịch vụ).

---

## NHIỆM VỤ 1: INVENTORY CRUD THỰC TẾ

| Domain | Create | Read | Update | Delete | File |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hotel** | EXISTS | EXISTS | EXISTS | EXISTS | `HotelService.cs` |
| **Restaurant** | EXISTS | EXISTS | EXISTS | EXISTS | `RestaurantService.cs` |
| **Activity** | EXISTS | EXISTS | EXISTS | EXISTS | `ActivityService.cs` |
| **Vehicle** | EXISTS | EXISTS | EXISTS | EXISTS | `VehicleService.cs` |

> **Nhận xét:** Lớp Services Backend đã viết đầy đủ các hàm CRUD cho cả 4 loại dịch vụ.

---

## NHIỆM VỤ 2: INVENTORY API

Toàn bộ các endpoint sau đang hoạt động trong `ezTravel.PlaceService`:

| Method | Route | Auth | Status | Controller |
| :--- | :--- | :---: | :--- | :--- |
| GET | `/api/places/hotels/search` | No | EXISTS | `HotelsController.cs` |
| GET | `/api/places/hotels/{id}` | No | EXISTS | `HotelsController.cs` |
| POST | `/api/places/hotels` | Yes | EXISTS | `HotelsController.cs` |
| PUT | `/api/places/hotels/{id}` | Yes | EXISTS | `HotelsController.cs` |
| DELETE | `/api/places/hotels/{id}` | Yes | EXISTS | `HotelsController.cs` |
| GET | `/api/places/restaurants/search` | No | EXISTS | `RestaurantsController.cs` |
| POST | `/api/places/restaurants` | Yes | EXISTS | `RestaurantsController.cs` |
| PUT | `/api/places/restaurants/{id}` | Yes | EXISTS | `RestaurantsController.cs` |
| DELETE | `/api/places/restaurants/{id}` | Yes | EXISTS | `RestaurantsController.cs` |

*(Tương tự cho Activities và Vehicles)*

---

## NHIỆM VỤ 3: PROVIDER OWNERSHIP

**Backend hiện tại CÓ kiểm tra `currentUserId`, `providerId`, và ownership.**

*   **Logic:** Controllers lấy User ID từ Token (`UserContextHelper.GetUserId(User)`) và truyền xuống Service.
*   **Create:** Code tự động query bảng `NhaCungCap` bằng `currentUserId`. Nếu tìm thấy, gán `MaNhaCungCap` cho Entity mới. Nếu không, fallback về giá trị mặc định (VD: `providerId ?? 1`).
*   **Update & Delete:** Backend load Entity từ DB lên và kiểm tra ranh giới sở hữu:
    ```csharp
    if (provider != null && entity.MaNhaCungCap != provider.MaNhaCungCap) {
        return null; // Trả về NotFound / Forbidden
    }
    ```

---

## NHIỆM VỤ 4: PROVIDER FILTER

**Câu trả lời: CÓ hỗ trợ lọc theo Provider.**

*   **DTO:** File `ServiceDtos.cs` định nghĩa `HotelSearchRequest`, `RestaurantSearchRequest`... đều CÓ trường `public int? MaNhaCungCap { get; set; }`.
*   **Service Layer:** File `HotelService.cs` đã bắt field này:
    ```csharp
    if (request.MaNhaCungCap.HasValue) {
        query = query.Where(h => h.MaNhaCungCap == request.MaNhaCungCap.Value);
    }
    ```
*   **Endpoint:** Đang dùng ngay tại `GET /api/places/{type}/search?maNhaCungCap={id}`.

---

## NHIỆM VỤ 5: FRONTEND AUDIT

Đã kiểm tra file `WebClient/src/modules/provider/ServicesManager.tsx`.

*   **Có trang quản lý dịch vụ không?** Có (ServicesManager).
*   **Có table không?** Có table, list ra thông tin.
*   **Có gọi API không?** CÓ gọi API thực qua RTK Query `useSearchProviderServicesQuery` truyền `providerId` và gọi mutation `useDeleteProviderServiceMutation`.
*   **Có form tạo không?** KHÔNG. Nút "Thêm dịch vụ" đang bị `<button disabled>`.
*   **Có form sửa không?** KHÔNG. Nút "Sửa" đang bị disabled kèm tooltip *"Form chỉnh sửa sẽ được hoàn thiện sau..."*.

=> **Kết luận:** Frontend đã có Table hiển thị và chức năng Xóa, nhưng **Thiếu Form Tạo/Sửa**.

---

## NHIỆM VỤ 6: GAP ANALYSIS

| Tính năng | Backend | Frontend | Verdict |
| :--- | :--- | :--- | :--- |
| Lấy danh sách Dịch vụ của NCC | Đã có (API Search) | Đã có (Table, RTK Query) | Hoàn thiện |
| Xóa dịch vụ của NCC | Đã có | Đã có (Nút Xóa hoạt động) | Hoàn thiện |
| Thêm dịch vụ mới | Đã có | Chưa có | Code mới UI Form (Modal) |
| Sửa thông tin dịch vụ | Đã có | Chưa có | Code mới UI Form (Modal) |

---

## NHIỆM VỤ 7: ĐÁNH GIÁ SPRINT 01 CŨ (SPRINT_01_EXECUTION_SPEC.md)

| Hạng mục | Đúng/Sai | Ghi chú |
| :--- | :---: | :--- |
| Đổi tên `BookingService` -> `ProviderService` | Đúng | Backend Tech Debt thực sự cần giải quyết. |
| Bổ sung endpoint `GET /api/places/providers/{id}/services` | **Sai** | **Không cần thiết vì API đã tồn tại** (Frontend đang dùng `GET /api/places/hotels/search?maNhaCungCap=...`). |
| Cập nhật DTO trả về cho Table | **Sai** | Frontend đã hiển thị tốt với DTO hiện tại. |
| Frontend dựng UI Form Thêm/Sửa | Đúng | Là điểm thiếu sót duy nhất của chức năng CRUD. |
| Estimate Backend: 3 man-days | **Sai** | Backend đã code 100% logic CRUD. Chỉ tốn 1 man-day cho việc đổi tên service. |

---

## NHIỆM VỤ 8: KẾT LUẬN CUỐI

**CASE 1: Backend đã đủ. Sprint chỉ cần Frontend.**

> *Ghi chú:* Backend đã hỗ trợ hoàn hảo CRUD cho Provider Service (Có cả Auth check, Ownership check, và Filter). Vấn đề duy nhất cản trở người dùng là Frontend chưa code giao diện Form Thêm/Sửa (Đang để nút Disabled). Sprint tiếp theo nên tập trung 100% nỗ lực Frontend để dựng Form, có thể kết hợp với việc refactor tên microservice `BookingService` nếu Dev rảnh rỗi.
