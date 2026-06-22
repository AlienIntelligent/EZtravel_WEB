# FRONTEND POST-MIGRATION GAP ANALYSIS

Tài liệu so sánh sự thật hiện tại của Frontend sau quá trình Migration với Backend, Database và CRD.

## 1. Ready For Sprint
- **Table Liệt Kê Dịch Vụ Của NCC**: Đã hoàn thiện, tích hợp đúng API search (`GET /api/places/{type}/search?maNhaCungCap={id}`).
- **Xóa Dịch Vụ Của NCC**: Đã hoàn thiện, nút xóa hoạt động ổn định với Mutation của RTK Query.

## 2. Blocked
- Hiện tại KHÔNG CÓ tính năng nào bị block bởi Database hay Backend. Hệ thống API đã hỗ trợ 100% CRUD, validation, và kiểm tra phân quyền sở hữu (Provider Ownership).

## 3. Missing
- **Form Tạo Dịch Vụ Mới**: Hiện tại giao diện thiếu Form (Modal/Page). Nút "Thêm dịch vụ" đang bị `<button disabled>`.
- **Form Sửa Dịch Vụ**: Nút "Sửa" đang bị disabled kèm tooltip.

## 4. Technical Debt
- Đổi tên `BookingService` thành `ProviderService` trên Backend (Tech Debt cần refactor nội bộ).
- Các `eslint-disable` directive được đặt tạm thời trong migration (như cascade render `set-state-in-effect`) cần được tối ưu lại logic React Hooks.

**Kết luận**: Frontend đã sẵn sàng để phát triển tiếp tục UI Form Thêm/Sửa Dịch vụ mà không cần chờ đợi Backend/DB.
