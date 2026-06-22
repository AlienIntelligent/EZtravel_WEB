# 06 – CHECKLIST REVIEW PULL REQUEST

**Mục đích**: Đảm bảo chất lượng code trước khi merge vào nhánh chính.  
**Áp dụng**: Mọi Pull Request trong dự án EZTravel.  
**Người review**: Tối thiểu 1 thành viên phải approve.

---

## 1. KIẾN TRÚC

- [ ] Component đặt đúng thư mục theo folder structure (`modules/<module>/`)
- [ ] Không tạo file ngoài cấu trúc đã quy định
- [ ] API hook đặt trong `store/apis/` (không thêm mới vào `src/api/`)
- [ ] Type đặt trong `types/` hoặc `shared/types/`
- [ ] Không duplicate type hoặc API client đã tồn tại
- [ ] Không import từ `src/api/adminApi.ts` cho các admin page mới

## 2. TYPESCRIPT

- [ ] Không sử dụng `any`
- [ ] Không sử dụng `@ts-ignore` hoặc `@ts-expect-error`
- [ ] Không sử dụng type assertion không an toàn (`as Type`)
- [ ] Props có interface/type rõ ràng
- [ ] Null/undefined được xử lý an toàn (`?.`, `??`)
- [ ] Enum hoặc union type cho các giá trị cố định (status, role)
- [ ] `tsc --noEmit` pass không lỗi

## 3. API & DỮ LIỆU

- [ ] Endpoint URL khớp chính xác với backend controller route
- [ ] HTTP method đúng (GET/POST/PUT/DELETE)
- [ ] Request/Response type khớp với Backend DTO
- [ ] Có `providesTags` / `invalidatesTags` cho RTK Query cache
- [ ] Không gọi API endpoint chưa tồn tại trong backend
- [ ] Không mock API response
- [ ] Không hardcode dữ liệu nghiệp vụ (tên gói, giá, badge type)
- [ ] Không tự tính business logic (badge type, promotion score)

## 4. GIAO DIỆN (UI)

- [ ] Tuân thủ design system (`tokens.css`)
- [ ] Sử dụng Lucide React icons (hoặc icon library dự án đang dùng)
- [ ] Không dùng inline `style={{ }}` trừ khi giá trị dynamic
- [ ] Không dùng CSS `!important`
- [ ] Font, màu, spacing lấy từ design token

## 5. RESPONSIVE

- [ ] Test trên mobile (375px / iPhone SE)
- [ ] Test trên tablet (768px)
- [ ] Test trên desktop (1920px)
- [ ] Bảng dữ liệu: horizontal scroll trên mobile
- [ ] Sidebar: collapse trên mobile
- [ ] Form: full-width trên mobile

## 6. LOADING STATE

- [ ] Hiển thị skeleton loader hoặc spinner khi đang tải dữ liệu
- [ ] Không để trang trắng khi chờ API
- [ ] Nút submit có trạng thái disabled khi đang xử lý
- [ ] Skeleton/spinner có animation

## 7. EMPTY STATE

- [ ] Hiển thị thông báo khi danh sách rỗng
- [ ] Có icon hoặc illustration minh họa
- [ ] Có hướng dẫn hành động tiếp theo (VD: "Thêm dịch vụ đầu tiên")
- [ ] Không hiển thị bảng rỗng không có thông tin

## 8. ERROR STATE

- [ ] Xử lý lỗi 401 (chuyển đến trang đăng nhập)
- [ ] Xử lý lỗi 403 (hiển thị Forbidden)
- [ ] Xử lý lỗi 404 (hiển thị Not Found)
- [ ] Xử lý lỗi mạng (thông báo lỗi kết nối)
- [ ] Có nút "Thử lại" khi lỗi
- [ ] Không dùng `alert()` cho thông báo lỗi
- [ ] Không hiển thị stack trace hoặc technical error cho người dùng

## 9. ACCESSIBILITY (Trợ năng)

- [ ] Các phần tử tương tác có `aria-label` hoặc text rõ ràng
- [ ] Bảng có `<thead>` và `<th>`
- [ ] Form field có `<label>` liên kết
- [ ] Nút có text hoặc `aria-label` (không có nút icon trống)
- [ ] Contrast ratio đủ (text đọc được trên background)
- [ ] Keyboard navigation hoạt động cho modal, dropdown

## 10. PERFORMANCE

- [ ] Không import toàn bộ thư viện khi chỉ dùng 1 hàm
- [ ] Component lớn dùng `React.lazy()` nếu phù hợp
- [ ] Hình ảnh có `loading="lazy"` khi dưới fold
- [ ] Không re-render không cần thiết (kiểm tra dependency array)

## 11. BẢO MẬT

- [ ] Không lưu token trong `localStorage`
- [ ] Không log thông tin nhạy cảm ra console
- [ ] Input được sanitize trước khi hiển thị (chống XSS)
- [ ] URL parameter được validate

## 12. GHI CHÚ VÀ TÀI LIỆU

- [ ] Comment cho logic phức tạp
- [ ] Giữ nguyên comment/docstring không liên quan đến thay đổi
- [ ] PR description mô tả rõ thay đổi và lý do

---

## QUY TRÌNH REVIEW

1. **Tác giả** tạo PR với description đầy đủ
2. **Reviewer** kiểm tra theo checklist trên
3. Nếu có vi phạm → comment chỉ rõ mục nào, yêu cầu sửa
4. Tác giả sửa và push lại
5. Reviewer approve khi tất cả checklist pass
6. Merge vào nhánh chính

## TIÊU CHÍ REJECT TỰ ĐỘNG

PR sẽ bị reject ngay nếu:

- ❌ Sử dụng `any`
- ❌ Gọi API endpoint không tồn tại
- ❌ Hardcode dữ liệu nghiệp vụ
- ❌ Thiếu Loading/Error/Empty state
- ❌ Mock API response
- ❌ `tsc --noEmit` fail
