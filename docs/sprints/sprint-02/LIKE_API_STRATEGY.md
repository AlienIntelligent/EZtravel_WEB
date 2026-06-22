# LIKE API STRATEGY

## 1. Kết quả Xác minh Backend
Thông qua việc kiểm tra file `ICommunityService.cs` và `FeedsController.cs`, xác nhận method xử lý API Like trả về kiểu Boolean:
```csharp
Task<bool> LikeTripAsync(int userId, int tripId);
```
Tức là, API `/api/feeds/{tripId}/like` chỉ trả về `true` (thành công) hoặc `false` (thất bại), KHÔNG trả về một đối tượng FeedDto đã cập nhật số lượng Like mới.

## 2. Quyết định Chiến lược: Optimistic Update
Vì API không trả về Entity mới, nếu dùng **Refetch Strategy** (gọi lại toàn bộ danh sách Feed sau mỗi lần Like), ứng dụng sẽ lãng phí tài nguyên mạng và tạo ra độ trễ (delay) lớn ở UI, làm giảm trải nghiệm người dùng đối với một thao tác cần phản hồi tức thì như "Like".

Do đó, **Optimistic Update** là bắt buộc:
1. Khi User bấm Like, Frontend ngay lập tức thay đổi UI (đổi màu icon Like và `likeCount + 1` hoặc `likeCount - 1` dựa trên state hiện tại của UI).
2. Phát lệnh gọi API ngầm (`mutate()`).
3. Nếu API trả về `true`: Hoàn tất mượt mà.
4. Nếu API thất bại (trả về lỗi hoặc `false`): Tự động Rollback UI về trạng thái cũ và hiện thông báo lỗi.
