# Auth Route Matrix (Ma trận Tuyến đường và Điều hướng)

Tài liệu này đặc tả chi tiết ma trận bảo vệ tuyến đường (Route Protection Matrix) của hệ thống EZTravel, chỉ rõ bộ lọc Guard nào chịu trách nhiệm, vai trò nào được truy cập trực tiếp và cơ chế điều hướng ngược lại khi truy cập trái phép.

---

## 1. Bản đồ Tuyến đường và Quyền truy cập

| Tuyến đường (Route Path) | Bộ bảo vệ (Guard) | Guest | Traveler | Premium | Pending | Approved | Admin | Hành vi Điều hướng khi bị chặn (Redirect) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`/`** (Home)<br>**`/explore`**<br>**`/community`** | `PublicGuard` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Trải nghiệm công khai (Public Experience). Mọi đối tượng đều truy cập được mà không bị chuyển hướng. |
| **`/auth/login`**<br>**`/auth/register`** | `PublicGuard` / `GuestGuard` | ✅ | 🔄 | 🔄 | 🔄 | 🔄 | 🔄 | Trang phục vụ khách (Guest only). Người dùng đã đăng nhập tự động chuyển hướng về trang chủ `/` (với Traveler) hoặc Dashboard tương ứng (với Provider/Admin). |
| **`/dashboard`**<br>**`/trips`** | `AuthenticatedGuard` | 🔄 | ✅ | ✅ | ✅ | ✅ | ✅ | Yêu cầu đăng nhập. Guest truy cập bị chặn và chuyển hướng về `/auth/login`. |
| **`/upgrade`** | `AuthenticatedGuard` | 🔄 | ✅ | ✅ | ✅ | ✅ | ✅ | Yêu cầu đăng nhập. Guest bị chuyển hướng về `/auth/login`. |
| **`/ai/planner`**<br>**`/ai/chat`** | `PremiumGuard` | 🔄 | 🔄 | ✅ | 🔄 | 🔄 | ✅ | Chỉ Premium và Admin được phép vào. Traveler thường bị chặn và chuyển hướng về trang nâng cấp `/upgrade`. |
| **`/provider/registration`** | `AuthenticatedGuard` | 🔄 | ✅ | ✅ | 🔄 | 🔄 | 🔄 | Chỉ dành cho Traveler thường hoặc Premium đăng ký lên NCC. Người dùng đã là NCC (Pending/Approved) hoặc Admin sẽ bị chặn. |
| **`/provider/pending`** | `ProviderPendingGuard`| 🔄 | 🔄 | 🔄 | ✅ | 🔄 | 🔄 | Chỉ tài khoản có vai trò `PROVIDER_PENDING` được phép xem. Các vai trò khác sẽ bị chuyển hướng về trang đích phù hợp (Approved về `/provider/dashboard`, Traveler về `/provider/registration`). |
| **`/provider/dashboard`**<br>**`/provider/services`**<br>**`/provider/reviews`** | `ProviderGuard` | 🔄 | 🔄 | 🔄 | 🔄 | ✅ | 🔄 | Chỉ tài khoản NCC đã duyệt (`PROVIDER_APPROVED`) mới có quyền truy cập. Các vai trò khác bị điều hướng về `/dashboard` hoặc `/provider/pending`. |
| **`/admin/dashboard`**<br>**`/admin/users`**<br>**`/admin/moderation`** | `AdminGuard` | 🔄 | 🔄 | 🔄 | 🔄 | 🔄 | ✅ | Chỉ Admin mới được phép truy cập. Mọi vai trò khác đều bị chuyển hướng về trang `/dashboard` cá nhân. |

*Chú thích:*
- ✅: **Cho phép truy cập (Allow)**
- 🔄: **Bị chặn và chuyển hướng tự động (Redirect)**

---

## 2. Quy tắc Điều hướng ngược (Redirect Rule System)

Cơ chế điều hướng trong các Guard của EZTravel được xử lý thông qua React Router `<Navigate replace />`:

1. **Khi chưa đăng nhập (Status: unauthenticated)**:
   - Mọi nỗ lực truy cập vào các tuyến đường thuộc nhóm `AuthenticatedGuard` đều bị chuyển hướng về tuyến `/auth/login`.
2. **Khi đã đăng nhập (Status: authenticated)**:
   - Nỗ lực truy cập các trang Public (như `/auth/login`, `/auth/register`) sẽ bị chuyển hướng về:
     - Với `ADMIN` -> `/admin/dashboard`
     - Với `PROVIDER_APPROVED` -> `/provider/dashboard`
     - Với `PROVIDER_PENDING` -> `/provider/pending`
     - Với `TRAVELER` hoặc `PREMIUM_TRAVELER` -> `/` (Home / Trải nghiệm công khai)
3. **Khi truy cập sai tài nguyên (Role Mismatch)**:
   - Các tuyến `/ai/...` chuyển hướng về `/upgrade` nếu là Traveler Free.
   - Các tuyến `/admin/...` chuyển hướng về `/dashboard` nếu không phải Admin.
