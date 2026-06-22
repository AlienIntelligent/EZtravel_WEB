# COMMUNITY AUDIT REPORT

Báo cáo tổng kết đợt Kiểm toán (Audit) Domain Community trước thềm Sprint 02.

## 1. Mục Tiêu Audit
Xác minh khả năng thực thi các module của Hệ sinh thái Cộng đồng bao gồm: Feed, Like, Comment, Review, Notification, Blog, và Profile.

## 2. Phát Hiện (Findings)
Dựa trên nguyên tắc "Database & Backend là chân lý":
- Backend hoàn toàn hỗ trợ tính năng **Social Feed** (Lấy danh sách các chuyến đi/trip được chia sẻ, Like, và Comment).
- Backend hoàn toàn hỗ trợ **Review System** (Cho phép user gửi Đánh giá, và lấy đánh giá dựa trên `PlaceId` hoặc `ServiceId`).
- Backend hoàn toàn hỗ trợ **Notifications** (Lấy danh sách thông báo và đánh dấu đã đọc).
- Backend **KHÔNG** tồn tại bất kỳ API nào phục vụ cho **Blog** và **Public User Profile**.

## 3. Khuyến Nghị Phạm Vi (Scope Recommendation)
Loại bỏ hoàn toàn tính năng Blog và User Profile khỏi Sprint 02 để tránh vi phạm quy tắc hệ thống (Tạo mock data hoặc tự thiết kế API ngoài thẩm quyền). 
Sprint 02 sẽ dồn 100% tài nguyên Frontend để xây dựng giao diện hiển thị:
- Trang Cộng đồng (Feeds)
- Hệ thống Bình luận & Thích
- Modal Đánh giá Dịch vụ/Địa điểm
- Dropdown Thông báo (Notifications) trên thanh điều hướng.
