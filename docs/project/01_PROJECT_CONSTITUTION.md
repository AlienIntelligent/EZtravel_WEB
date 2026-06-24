# 01 – HIẾN PHÁP DỰ ÁN EZTRAVEL

**Phiên bản**: 1.0  
**Ngày ban hành**: 2026-06-07  
**Hiệu lực**: Áp dụng bắt buộc cho toàn bộ thành viên dự án

---

## I. NGUỒN CHÂN LÝ VÀ THỨ TỰ ƯU TIÊN

### 1.1 Thứ tự ưu tiên bắt buộc

Khi có mâu thuẫn giữa các nguồn tài liệu, thứ tự ưu tiên như sau:

```
1. CRD_EZtravel_v3.docx          ← Chân lý nghiệp vụ duy nhất
2. SRS_ezTravel_v1_4.docx        ← Đặc tả yêu cầu chức năng
3. Database hiện hành             ← Chân lý dữ liệu
4. Backend hiện hành              ← Chân lý tích hợp
5. Frontend hiện hành             ← Tầng triển khai
```

### 1.2 Quy tắc giải quyết mâu thuẫn

- Nếu SRS mâu thuẫn CRD → **CRD thắng**.
- Nếu Database mâu thuẫn CRD → **CRD thắng**, nhưng Database **KHÔNG được sửa** (xem mục II).
- Nếu Backend mâu thuẫn CRD → **CRD thắng**, nhưng Backend **KHÔNG được sửa** (xem mục III).
- Frontend phải **thích ứng** với cả CRD lẫn Backend/Database hiện tại.

### 1.3 Tài liệu tham khảo (không có tính bắt buộc)

Các tài liệu sau chỉ mang tính tham khảo:

- Thư mục `docs/architecture/`
- Thư mục `docs/project/`
- Thư mục `docs/screenshot/` (Ảnh chụp toàn hệ thống)
- Mọi file `.md` khác còn lại trong `/docs/`
---

## II. CHÍNH SÁCH KHÓA DATABASE (Database Lock Policy)

### 2.1 Trạng thái

**Database đã KHÓA (LOCKED).**

### 2.2 Các hành động BỊ CẤM

Không thành viên nào được phép:

- [ ] Tạo bảng mới
- [ ] Xóa bảng
- [ ] Đổi tên bảng
- [ ] Đổi tên cột
- [ ] Thêm cột mới
- [ ] Xóa cột
- [ ] Đổi kiểu dữ liệu
- [ ] Thêm/xóa constraint
- [ ] Tạo migration mới
- [ ] Chạy script ALTER trên production

### 2.3 Ngoại lệ

Chỉ được thực hiện thay đổi Database khi có **quyết định chính thức bằng văn bản** từ Trưởng nhóm, kèm:

- Lý do cụ thể
- Bảng/cột bị ảnh hưởng
- Tác động đến Backend/Frontend
- Plan rollback

---

## III. CHÍNH SÁCH KHÓA BACKEND (Backend Lock Policy)

### 3.1 Trạng thái

**Backend đã KHÓA (LOCKED).**

### 3.2 Các hành động BỊ CẤM

Không thành viên nào được phép:

- [ ] Sửa API Contract (URL, method, request/response schema)
- [ ] Sửa DTO (thêm/xóa/đổi tên trường)
- [ ] Sửa Business Rule trong Service layer
- [ ] Thêm endpoint mới
- [ ] Xóa endpoint hiện tại
- [ ] Sửa Entity mapping
- [ ] Sửa Repository logic

### 3.3 Ngoại lệ

Chỉ được thực hiện thay đổi Backend khi có **quyết định chính thức bằng văn bản** từ Trưởng nhóm.

---

## IV. CHÍNH SÁCH PHÁT TRIỂN FRONTEND (Frontend Development Policy)

### 4.1 Trạng thái

**Frontend là tầng duy nhất còn được phát triển.**

### 4.2 Phạm vi phát triển cho phép

Frontend được phép:

- Tạo component mới
- Tạo page mới
- Tạo RTK Query hook mới (gọi đến API đã tồn tại)
- Sửa giao diện
- Sửa logic hiển thị
- Thêm route mới
- Sửa responsive
- Sửa error/loading/empty states

### 4.3 Frontend KHÔNG được phép

- Gọi API endpoint **chưa tồn tại** trong backend
- Tự tạo mock API
- Tính toán business logic trên frontend (VD: tính badge type, tính promotion score)
- Hardcode dữ liệu nghiệp vụ
- Sử dụng `any` trong TypeScript
- Duplicate DTO hoặc API client

### 4.4 Quy tắc source-of-truth cho Frontend

| Dữ liệu | Nguồn duy nhất |
|---|---|
| Badge type | `ProviderPromotionDto.badgeType` từ backend |
| Promotion score | Backend tính, frontend chỉ hiển thị |
| Package info | Backend DTO, frontend không derive |
| User role | JWT token từ backend |
| Service status | Backend trả về, frontend không tự set |

---

## V. CHÍNH SÁCH SPRINT (Sprint Policy)

### 5.1 Đánh số Sprint

Sprint hiện tại: Sprint 3 đã hoàn thành.  
Sprint tiếp theo: Sprint 4.  

### 5.2 Phạm vi Sprint

Mỗi Sprint chỉ được triển khai Frontend trên nền:

```
CRD → Database hiện tại → Backend hiện tại → Frontend
```

### 5.3 Yêu cầu bắt buộc của mỗi Sprint

Trước khi bắt đầu Sprint, phải có:

- [ ] Mục tiêu Sprint (rõ ràng, đo lường được)
- [ ] Phạm vi (IN scope)
- [ ] Loại trừ (OUT of scope)
- [ ] User Story
- [ ] API Mapping (endpoint nào frontend sẽ gọi)
- [ ] Acceptance Criteria
- [ ] Deliverables

### 5.4 Tiêu chí hoàn thành Sprint

- [ ] Tất cả User Story đạt Acceptance Criteria
- [ ] Không có lỗi TypeScript (`tsc --noEmit` pass)
- [ ] Responsive trên mobile (< 768px) và desktop
- [ ] Mọi page có Loading State, Empty State, Error State
- [ ] Code review đã pass (xem mục VI)
- [ ] Walkthrough artifact đã được tạo

---

## VI. CHÍNH SÁCH REVIEW (Review Policy)

### 6.1 Pull Request bắt buộc

Mọi thay đổi code phải qua Pull Request. Không merge trực tiếp vào `main`.

### 6.2 Yêu cầu review

- Tối thiểu 1 reviewer approve
- Phải pass checklist PR Review (xem `06_PR_REVIEW_CHECKLIST.md`)
- Không có conversation unresolved

### 6.3 Tiêu chí reject

PR sẽ bị reject nếu:

- Sử dụng `any` trong TypeScript
- Gọi API endpoint không tồn tại
- Hardcode dữ liệu nghiệp vụ
- Thiếu loading/error/empty state
- Vi phạm folder structure
- Duplicate DTO hoặc API client

---

## VII. CHÍNH SÁCH THAY ĐỔI (Change Request Policy)

### 7.1 Khi nào cần Change Request

Cần CR khi muốn:

- Sửa Database schema
- Sửa Backend API/DTO/Service
- Thêm tính năng ngoài CRD
- Thay đổi kiến trúc hệ thống

### 7.2 Quy trình

1. Người đề xuất tạo CR document gồm: lý do, phạm vi, tác động, plan thực hiện
2. Trưởng nhóm xem xét và phê duyệt
3. Nếu được duyệt: cập nhật tài liệu dự án, thêm vào Sprint Backlog
4. Nếu bị từ chối: ghi nhận lý do, không thực hiện

---

## VIII. MÔ HÌNH MONETIZATION CHÍNH THỨC

### 8.1 Hai hệ thống độc lập

EZTravel có 2 hệ thống monetization hoạt động độc lập:

#### A. Traveler Subscription (Gói người dùng)

- **Bảng DB**: `GOI_DICH_VU`, `DANG_KY_GOI`, `LICH_SU_AI`
- **Mục đích**: Khách du lịch đăng ký gói sử dụng AI (Free / Premium)
- **Trạng thái hiện tại**: DEFERRED IMPLEMENTATION
- **Lý do**: Chưa lựa chọn AI Provider phù hợp
- **Lưu ý**: AI KHÔNG bị loại khỏi hệ thống. Hệ thống vẫn giữ nguyên các bảng và sẽ triển khai khi có AI Provider.

#### B. Provider Promotion Platform (Gói NCC)

- **Bảng DB**: `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC`
- **Mục đích**: Nhà cung cấp đăng ký gói quảng bá tăng hiển thị
- **Trạng thái hiện tại**: ĐÃ TRIỂN KHAI (Backend + Frontend)

### 8.2 Hạng mục đã loại khỏi phạm vi (CRD §7.2)

Các hạng mục sau **KHÔNG được triển khai** dưới bất kỳ hình thức nào:

- Booking Engine
- Availability / Inventory Management
- Payment Gateway cho booking
- Ví điện tử NCC
- Rút tiền NCC
- Hoa hồng (Commission)
- Đối soát thanh toán
- Ứng dụng mobile native

---

*Tài liệu này có hiệu lực kể từ ngày ban hành. Mọi thay đổi phải được Trưởng nhóm phê duyệt.*
