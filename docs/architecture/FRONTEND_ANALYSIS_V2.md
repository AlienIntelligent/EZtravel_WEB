# FRONTEND ANALYSIS V2

Đánh giá toàn diện kiến trúc Frontend React (Vite + TypeScript + Redux).

## 1. Routing & Layout Structure

*   **Điểm mạnh**: Cấu trúc thư mục theo tính năng (Feature-Sliced Design) rất gọn gàng (`src/modules/*`). Layout được chia theo vai trò: `MainLayout`, `AdminLayout`, `ProviderLayout`, `AuthLayout`.
*   **Routing**: Sử dụng `react-router-dom` v6 (`createBrowserRouter`) rất hiện đại. Đã tích hợp `RoleGuard` và `ProtectedRoute` tốt.
*   **Vấn đề**: Layout AI (`AILayout`) đang tách biệt hoàn toàn. Có thể gây đứt gãy UX khi User muốn gọi AI Assistant dạng pop-up khi đang ở màn hình Trip Planner.

## 2. State Management & API Layer

*   **RTK Query**: Rất mạnh mẽ để fetch, cache dữ liệu và handle loading/error states.
*   **Redux Slices**: Đang dùng để lưu UI state (Trip Builder, Modals).
*   **Vấn đề**: Việc lạm dụng RTK Query có thể khiến ứng dụng khó handle các tương tác Realtime (WebSocket). Khi tích hợp SignalR cho Trip Planner, cần kết hợp RTK Query với custom Socket middlewares cẩn thận.

## 3. UI/UX & Design System

*   **TailwindCSS**: Sử dụng tốt cho rapid UI. Tuy nhiên, một số chỗ hardcode màu sắc thay vì dùng Design Tokens (CSS Variables).
*   **Responsive**: Các trang dashboard (Admin, Provider) thường bị bể layout trên Mobile. Cần rà soát lại grid/flexbox.
*   **Điểm yếu UX lớn nhất**: Thiếu Micro-interactions (Skeleton loading, toast notification mượt mà, transition khi chuyển route). Các Form (đăng ký NCC, tạo dịch vụ) còn thô sơ, thiếu step-by-step wizard.

## 4. Components

*   Thư mục `src/components/common` cần được chuẩn hóa thành một Design System thực thụ (như Radix UI hoặc Shadcn/UI).
*   Nhiều UI hiện tại chỉ là "Stub" (Giao diện trống hoặc giả lập), đặc biệt là khu vực quản lý của Admin và Provider.

## 5. Technical Debt

*   **Component phình to**: Component `TripPlannerWorkspace.tsx` chắc chắn đang ôm đồm quá nhiều logic (DragDrop, Budget, Map, List). Cần refactor tách nhỏ hơn.
*   **Bundle Size**: Chưa thấy lazy loading route một cách triệt để (`React.lazy`). Khi build lên, `index.js` có thể rất nặng.

## 6. Đề xuất cải tiến

1.  **Chuyển đổi UI Components**: Áp dụng triệt để một UI Library chuẩn (như Tailwind + Shadcn) để tăng tính đồng bộ và thẩm mỹ.
2.  **Code Splitting**: Áp dụng Lazy Load cho toàn bộ route cấp 1 (Admin, Provider, AI).
3.  **Tích hợp Socket.io / SignalR client**: Chuẩn bị nền tảng cho Realtime Collaboration.
4.  **Floating AI Assistant**: Biến AI thành một widget nổi (Global widget) thay vì một trang rời rạc, giúp user có thể chat mọi lúc mọi nơi.
