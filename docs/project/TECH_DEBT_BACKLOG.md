# TECHNICAL DEBT BACKLOG

Tài liệu ghi nhận nợ kỹ thuật (Technical Debt) phát sinh trong quá trình chuyển đổi và phát triển Sprint 01, cần được đưa vào Backlog để giải quyết trong các Sprint Tối ưu hóa (Optimization Sprints).

## Danh sách Nợ kỹ thuật

### 1. Bundle Size > 500kb (Vite Warning)
- **Mô tả:** Vite cảnh báo `index.js` sau khi build có kích thước > 500kb. Nguyên nhân chính là do gom chung các thư viện lớn vào main chunk (ví dụ `@reduxjs/toolkit`, `react-router-dom`).
- **Phân loại:** **P2** (Medium Priority).
- **Đề xuất giải quyết:** Áp dụng Dynamic Import (`React.lazy`) cho các trang (Routes) để Code-Splitting, cấu hình lại `rollupOptions.output.manualChunks`.

### 2. SweetAlert2 Chunk Size
- **Mô tả:** Import `sweetalert2` trực tiếp tại `ServicesManager.jsx` khiến thư viện này được bundle vào chunk hiện tại dù người dùng chưa thao tác CRUD.
- **Phân loại:** **P3** (Low Priority).
- **Đề xuất giải quyết:** Lazy load SweetAlert2 (`const Swal = (await import('sweetalert2')).default;`) ngay trước khi gọi `Swal.fire`.

### 3. Lucide React / React Icons Chunk Size
- **Mô tả:** Bundle có thể đang chứa nhiều icon chưa dùng tới từ `lucide-react` hoặc `feather-icons` nếu dùng import dạng `import { Icon } from 'lucide-react'`.
- **Phân loại:** **P3** (Low Priority).
- **Đề xuất giải quyết:** Import cụ thể từng icon (vd: `lucide-react/dist/esm/icons/user`) hoặc cấu hình tree-shaking chặt chẽ hơn.

### 4. React-Hooks Warnings (`set-state-in-effect` & `exhaustive-deps`)
- **Mô tả:** Còn sót lại các `eslint-disable` đối với rules `react-hooks/set-state-in-effect` và `react-hooks/exhaustive-deps` tại một số Component, Modal do thiết kế flow khởi tạo dữ liệu cũ.
- **Phân loại:** **P1** (High Priority).
- **Đề xuất giải quyết:** Refactor lại vòng đời component. Loại bỏ việc lạm dụng `useEffect` để set state, thay vào đó tính toán trực tiếp giá trị khởi tạo trong khi render hoặc dùng `useMemo`.
