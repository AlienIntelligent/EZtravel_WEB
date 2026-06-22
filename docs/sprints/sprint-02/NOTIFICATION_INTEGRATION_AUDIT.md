# NOTIFICATION INTEGRATION AUDIT

## 1. Xác minh Backend Endpoints
Dựa trên mã nguồn `NotificationsController.cs` thuộc `ezTravel.AuthService`:
- `GET /api/notifications` (Method `GetMyNotifications()`)
- `POST /api/notifications/{id}/read` (Method `MarkAsRead(int id)`)

**Kết quả:** Endpoints **TỒN TẠI** và được bọc bởi `[Authorize]` attribute (Yêu cầu đăng nhập).

## 2. Xác minh Gateway
Tất cả các requests bắt đầu bằng `/api/notifications` đi vào API Gateway sẽ được định tuyến (route) chính xác tới `AuthService` nhờ cấu hình Ocelot hiện tại của hệ thống.
**Kết quả:** Endpoint **ĐI QUA GATEWAY** bình thường.

## 3. Xác minh Frontend Call
Dựa trên quá trình triển khai Frontend tại `communityApi.ts`:
```typescript
    getNotifications: builder.query({
      query: () => ({ url: "/api/notifications" }),
      providesTags: ["Notification"],
    }),
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/api/notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
```
Các endpoints này đã được đăng ký trên RTK Query và được Component `NotificationDropdown.jsx` gọi (Dispatch) thành công.
**Kết quả:** Frontend **THỰC SỰ GỌI ĐƯỢC** API.

## 4. Response DTO
- `GET` trả về `IEnumerable<NotificationDto>` (Mảng đối tượng thông báo). Component Frontend map thành công biến `notif.message`, `notif.createdAt`, `notif.isRead`.
- `POST .../read` trả về kiểu `bool` (`true`/`false`). Frontend xử lý `.unwrap()` và invalidate cache.

**TỔNG KẾT:** Phân hệ Notification hoàn thành kết nối 100%. Đạt chuẩn.
