# 05 – TIÊU CHUẨN CODE FRONTEND (Frontend Coding Standard)

**Phiên bản**: 1.0  
**Áp dụng cho**: Toàn bộ đội phát triển Frontend EZTravel  
**Bắt buộc tuân thủ**: Từ Sprint 4 trở đi

---

## I. CẤU TRÚC THƯ MỤC (Folder Structure)

```
WebClient/src/
├── api/                      # RTK Query API definitions (legacy — KHÔNG thêm mới)
│   ├── baseApi.ts            # Base API configuration
│   ├── authApi.ts
│   ├── tripApi.ts
│   ├── exploreApi.ts
│   └── aiApi.ts
├── store/                    # Redux store
│   ├── store.ts              # Store configuration
│   ├── authSlice.ts
│   ├── tripSlice.ts
│   ├── exploreSlice.ts
│   ├── providerSlice.ts
│   ├── adminSlice.ts
│   ├── aiSlice.ts
│   └── apis/                 # RTK Query API mới (Sprint 3+) — THÊM MỚI TẠI ĐÂY
│       ├── providerApi.ts
│       ├── adminApi.ts
│       └── exploreApi.ts
├── shared/
│   └── types/                # Shared TypeScript types
│       ├── index.ts
│       ├── user.ts
│       ├── provider.ts
│       ├── place.ts
│       ├── service.ts
│       ├── trip.ts
│       ├── review.ts
│       ├── blog.ts
│       ├── report.ts
│       └── ai.ts
├── types/                    # DTO types (mapping 1:1 với Backend DTO)
│   └── provider.ts           # PackageDto, ProviderPromotionDto, etc.
├── components/               # Shared components
│   ├── auth/                 # Auth guards
│   └── ui/                   # UI primitives
├── layouts/                  # Layout components
├── modules/                  # Feature modules (pages)
│   ├── home/
│   ├── auth/
│   ├── explore/
│   ├── trip/
│   ├── ai/
│   ├── provider/
│   ├── admin/
│   └── design-system/
├── routes/                   # Router configuration
│   └── index.tsx
├── styles/                   # Design tokens & global styles
│   └── tokens.css
├── hooks/                    # Custom hooks
├── utils/                    # Utility functions
└── App.tsx
```

### Quy tắc cấu trúc

1. **Mỗi module** nằm trong `modules/<tên-module>/`
2. **Component chỉ dùng trong 1 module** → đặt trong `modules/<module>/components/`
3. **Component dùng chung** → đặt trong `components/`
4. **Hook dùng chung** → đặt trong `hooks/`
5. **Không tạo thư mục mới** ngoài cấu trúc trên mà không có lý do rõ ràng

---

## II. QUY ƯỚC ĐẶT TÊN (Naming Convention)

### 2.1 Files

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Component | PascalCase | `ProviderDashboard.tsx` |
| Hook | camelCase, prefix `use` | `useProviderData.ts` |
| Utility | camelCase | `formatCurrency.ts` |
| Type | camelCase | `provider.ts` |
| API | camelCase, suffix `Api` | `providerApi.ts` |
| Slice | camelCase, suffix `Slice` | `providerSlice.ts` |
| Test | giống file gốc + `.test` | `ProviderDashboard.test.tsx` |

### 2.2 Biến và hàm

| Loại | Quy ước | Ví dụ |
|---|---|---|
| Component | PascalCase | `ProviderDashboard` |
| Function | camelCase | `handleSubmit`, `formatDate` |
| Constant | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRIES` |
| Interface/Type | PascalCase | `PackageDto`, `CreateProviderRequest` |
| Enum | PascalCase (members UPPER_SNAKE_CASE) | `ProviderStatus.ACTIVE` |
| Hook | camelCase, prefix `use` | `useGetPackagesQuery` |
| RTK Query endpoint | camelCase | `getProviderPackages` |

### 2.3 CSS

- Sử dụng TailwindCSS utility classes
- Class tùy chỉnh đặt trong `styles/tokens.css`
- Không sử dụng inline `style={{ }}` trừ khi dynamic

---

## III. QUY TẮC RTK QUERY

### 3.1 Vị trí đặt API

- API **mới** → `src/store/apis/<tên>Api.ts`
- API **cũ** (legacy) → `src/api/<tên>Api.ts` — KHÔNG thêm endpoint mới, chỉ sửa bug

### 3.2 Quy tắc bắt buộc

```typescript
// ✅ ĐÚNG — Dùng endpoint backend đã tồn tại
export const providerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProviderPackages: builder.query<PackageDto[], void>({
      query: () => ({ url: "/provider/packages", method: "GET" }),
      providesTags: ["ProviderPackage"],
    }),
  }),
  overrideExisting: false,
});

// ❌ SAI — Gọi endpoint không tồn tại
export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminServices: builder.query({
      query: () => ({ url: "/admin/services", method: "GET" }), // ENDPOINT NÀY KHÔNG TỒN TẠI
    }),
  }),
});
```

### 3.3 Checklist RTK Query

- [ ] Endpoint URL khớp với backend controller route
- [ ] HTTP method khớp (GET/POST/PUT/DELETE)
- [ ] Request type khớp với backend DTO
- [ ] Response type khớp với backend DTO
- [ ] Có `providesTags` / `invalidatesTags` cho cache
- [ ] Không duplicate endpoint đã tồn tại ở layer khác

---

## IV. QUY TẮC TYPESCRIPT

### 4.1 Cấm tuyệt đối

```typescript
// ❌ CẤM — Sử dụng any
const data: any = response;
function handle(item: any) {}

// ❌ CẤM — Type assertion không an toàn
const user = response as User;

// ❌ CẤM — Non-null assertion không cần thiết
const name = user!.name;

// ❌ CẤM — @ts-ignore
// @ts-ignore
someFunction();
```

### 4.2 Bắt buộc

```typescript
// ✅ BẮT BUỘC — Type rõ ràng cho props
interface ProviderCardProps {
  provider: ProviderPromotionDto;
  onSelect?: (id: number) => void;
}

// ✅ BẮT BUỘC — Type guard khi cần
if (typeof response === 'object' && response !== null && 'badgeType' in response) {
  // Safe to use response.badgeType
}

// ✅ BẮT BUỘC — Null check
const name = user?.hoTen ?? 'Không rõ';
```

### 4.3 Quy tắc Type

- DTO types đặt trong `types/` — mapping 1:1 với Backend DTO
- Domain types đặt trong `shared/types/`
- KHÔNG duplicate type definitions
- KHÔNG tự suy diễn type từ response — phải đối chiếu Backend DTO

---

## V. QUY TẮC COMPONENT

### 5.1 Cấu trúc component

```tsx
// 1. Imports
import React from 'react';
import { useGetPackagesQuery } from '../../store/apis/providerApi';
import type { PackageDto } from '../../types/provider';

// 2. Types
interface PackageCardProps {
  package: PackageDto;
  onSelect: (id: number) => void;
}

// 3. Component
export default function PackageCard({ package: pkg, onSelect }: PackageCardProps) {
  // 3a. Hooks
  // 3b. Derived state
  // 3c. Event handlers
  // 3d. Render

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 5.2 Quy tắc trạng thái UI

Mỗi page hoặc component có data fetching **PHẢI** xử lý 3 trạng thái:

```tsx
function ProviderPackages() {
  const { data, isLoading, error } = useGetPackagesQuery();

  // ✅ Loading State
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // ✅ Error State
  if (error) {
    return <ErrorMessage message="Không thể tải dữ liệu. Vui lòng thử lại." />;
  }

  // ✅ Empty State
  if (!data || data.length === 0) {
    return <EmptyState message="Chưa có gói dịch vụ nào." />;
  }

  // ✅ Data State
  return <PackageList packages={data} />;
}
```

### 5.3 Cấm trong component

- [ ] KHÔNG hardcode dữ liệu nghiệp vụ (giá, tên gói, badge type)
- [ ] KHÔNG tự tính toán business logic (badge, promotion score, search score)
- [ ] KHÔNG mock API response
- [ ] KHÔNG import trực tiếp từ `src/api/` cho Admin pages (dùng `src/store/apis/`)

---

## VI. QUY TẮC RESPONSIVE

### 6.1 Breakpoints

| Breakpoint | Width | Thiết bị |
|---|---|---|
| `sm` | ≥ 640px | Mobile lớn |
| `md` | ≥ 768px | Tablet |
| `lg` | ≥ 1024px | Desktop nhỏ |
| `xl` | ≥ 1280px | Desktop |
| `2xl` | ≥ 1536px | Desktop lớn |

### 6.2 Quy tắc

- Mobile-first: viết CSS cho mobile trước, dùng breakpoint lên
- Mọi page phải test ở 375px (iPhone SE) và 1920px (Desktop)
- Bảng dữ liệu: dùng horizontal scroll trên mobile, không ẩn cột
- Sidebar: collapse thành hamburger menu trên mobile
- Form: full-width trên mobile, max-width trên desktop

---

## VII. QUY TẮC XỬ LÝ LỖI (Error Handling)

### 7.1 API Error

```typescript
// ✅ ĐÚNG — Xử lý lỗi từ RTK Query
const { error } = useGetPackagesQuery();

if (error) {
  if ('status' in error) {
    // FetchBaseQueryError
    if (error.status === 401) {
      // Redirect to login
    } else if (error.status === 403) {
      // Show forbidden
    } else if (error.status === 404) {
      // Show not found
    } else {
      // Show generic error
    }
  }
}
```

### 7.2 Form Validation

- Validate trước khi submit (client-side)
- Hiển thị lỗi inline dưới field
- KHÔNG dùng `alert()` hoặc `console.log()` cho error

### 7.3 Network Error

- Hiển thị thông báo "Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại."
- Cung cấp nút "Thử lại" (retry)
- KHÔNG để trang trắng khi mất mạng

---

## VIII. DANH SÁCH CẤM (Blacklist)

| Hành vi | Lý do |
|---|---|
| `any` | Mất type safety |
| Mock API responses | Không phản ánh backend thật |
| Hardcode business data | Dữ liệu thay đổi sẽ gây lỗi |
| Duplicate DTO | Gây drift giữa backend và frontend |
| Duplicate API client | Gây endpoint shadowing |
| `console.log()` trong production code | Noise trong console |
| `localStorage` cho sensitive data | Rủi ro XSS |
| CSS `!important` | Khó maintain |
| Inline `style={{ }}` không cần thiết | Không responsive |
| Import từ `src/api/adminApi.ts` cho admin pages mới | Endpoint sai — dùng `src/store/apis/adminApi.ts` |
