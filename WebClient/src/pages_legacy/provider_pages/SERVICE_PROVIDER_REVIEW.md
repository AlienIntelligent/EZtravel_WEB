# SERVICE PROVIDER LOGIC REVIEW
## ezTravel - Website hỗ trợ du lịch tự túc

**Review Date:** 2026-05-26
**Reviewer:** Senior Business Analyst / Solution Architect / Backend Architect
**System Stack:** ASP.NET Core Web API, Clean Architecture, SQL Server, ReactJS
**Goal:** Production-lite system (demo-ready, maintainable, moderately extensible)

---

## A. VẤN ĐỀ LOGIC HIỆN TẠI

### A.1 Ownership Issues

**Current State:**
- `NhaCungCap` table exists with `MaNguoiDung` FK (good)
- `KhachSan`, `NhaHang`, `HoatDong`, `PhuongTien` have `MaNhaCungCap` FK (nullable)
- `BookingItem` has `MaNhaCungCap` FK

**Issues Identified:**

1. **Nullable Provider FK in Service Tables**
   - `MaNhaCungCap` is nullable in all service tables
   - **Business Impact:** Services can exist without a provider owner
   - **Permission Risk:** Anyone could potentially access unowned services
   - **Data Integrity:** No guarantee service belongs to a verified provider

2. **No Ownership Validation in Booking Flow**
   - `BookingItem.MaNhaCungCap` is set but no validation that this provider owns the service
   - **Risk:** Booking could be assigned to wrong provider
   - **Dashboard Issue:** Provider dashboard might show bookings for services they don't own

3. **No Provider-Service Relationship Enforcement**
   - `NhaCungCap` has navigation properties to services but no explicit ownership validation
   - **Risk:** Provider A could potentially see/edit Provider B's services if permissions aren't checked

### A.2 Booking Logic Issues

**Current State:**
- `DonDat` (Booking Order) with status: `TrangThai` (string)
- `BookingItem` with status: `BookingStatus` (string)
- `BookingStatusLog` for tracking changes
- Separate booking tables: `DatKhachSan`, `DatNhaHang`, `DatHoatDong`, `DatPhuongTien`

**Issues Identified:**

1. **String-Based Status (No Type Safety)**
   - `TrangThai` and `BookingStatus` are strings, not enums
   - **Risk:** Typos, invalid states, no compile-time checking
   - **Maintenance:** Hard to track all valid status values

2. **Status Duplication**
   - `DonDat.TrangThai` vs `BookingItem.BookingStatus`
   - **Confusion:** Which status is the source of truth?
   - **Issue:** Order-level status vs item-level status not clearly defined

3. **No Conflict Detection**
   - No `LichKhaDung` (Availability) table usage in booking flow
   - **Risk:** Double booking possible
   - **Business Impact:** Provider could accept overlapping bookings

4. **No Provider Confirmation Workflow**
   - `BookingItem.ProviderConfirmedAt` exists but no clear workflow
   - **Issue:** When can provider confirm? Is it required?
   - **Missing:** Auto-confirmation vs manual confirmation logic

5. **Booking Item Structure**
   - `BookingItem` uses `LoaiDichVu` (string) and `MaDichVu` (int) polymorphic pattern
   - **Complexity:** Requires joining to different service tables based on type
   - **Alternative:** Could use separate tables or proper inheritance

### A.3 Review Logic Issues

**Current State:**
- `DanhGia` table with `MaBookingItem` FK (nullable)
- `PhanHoiDanhGia` for provider responses
- `LoaiDoiTuong` and `MaDoiTuongId` polymorphic pattern

**Issues Identified:**

1. **No Booking Verification**
   - `MaBookingItem` is nullable
   - **Spam Risk:** Users can review without actually booking
   - **Business Impact:** Fake reviews possible

2. **No One-Review-Per-Booking Constraint**
   - No unique constraint on `(MaNguoiDung, MaBookingItem)`
   - **Spam Risk:** User can review same booking multiple times
   - **Data Quality:** Duplicate reviews possible

3. **Polymorphic Review Pattern**
   - `LoaiDoiTuong` + `MaDoiTuongId` pattern
   - **Complexity:** Hard to enforce FK constraints
   - **Maintenance:** Need to check multiple tables for review targets

4. **No Rating Validation**
   - `SoSao` is int, no range validation in schema
   - **Risk:** Invalid ratings (negative, >5)
   - **Fix:** Should use check constraint or domain validation

### A.4 Permission Logic Issues

**Current State:**
- `NguoiDung.VaiTro` is string
- No explicit permission system
- No ownership-based authorization middleware

**Issues Identified:**

1. **String-Based Role (No Type Safety)**
   - `VaiTro` is string, not enum
   - **Risk:** Typos, invalid roles
   - **Maintenance:** Hard to track all valid roles

2. **No Explicit Permission Matrix**
   - No table defining what each role can do
   - **Risk:** Inconsistent permission checks across codebase
   - **Maintenance:** Hard to audit permissions

3. **No Ownership Validation**
   - No middleware to check if user owns the resource
   - **Security Risk:** Provider A could access Provider B's data
   - **Fix Needed:** Ownership check on every provider API endpoint

4. **Role Separation Not Enforced**
   - `NguoiDung` table doesn't prevent role conflicts
   - **Risk:** User could be both Traveler and Provider simultaneously
   - **Business Impact:** Confusion in permission logic

---

## B. LOGIC NGHIỆP VỤ ĐỀ XUẤT

### B.1 Service Provider Domain Model

**Simplified Domain:**

```
Provider (NhaCungCap)
├── Profile Management
│   ├── Business info (name, contact, address)
│   ├── Verification status (pending, approved, rejected)
│   └── Wallet (balance, transactions)
├── Service Management
│   ├── Create/Update Services
│   ├── Service Status (draft, published, hidden)
│   └── Service Images
├── Booking Management
│   ├── View incoming bookings
│   ├── Confirm/Reject bookings
│   ├── Mark as completed
│   └── View booking history
└── Review Management
    ├── View reviews
    ├── Reply to reviews
    └── View overall rating
```

**Key Principles:**
- One user = One provider (simplified)
- Provider must be approved before publishing services
- Services must belong to verified provider
- Bookings are provider-specific
- Reviews are tied to actual bookings

### B.2 Booking Workflow (Simplified)

**States:**
```
PENDING → CONFIRMED → COMPLETED
    ↓         ↓
  REJECTED  CANCELLED
```

**Flow:**
1. **Traveler creates booking** → Status: PENDING
2. **Provider confirms** → Status: CONFIRMED
3. **Service completed** → Status: COMPLETED
4. **Provider rejects** → Status: REJECTED
5. **Traveler cancels** → Status: CANCELLED

**Rules:**
- Auto-confirm if provider setting enabled (optional feature)
- Provider can only confirm/reject PENDING bookings
- Traveler can only cancel PENDING or CONFIRMED bookings
- COMPLETED bookings cannot be changed

### B.3 Moderation Workflow

**Provider Moderation:**
```
PENDING → APPROVED / REJECTED
```

**Service Moderation:**
```
DRAFT → PUBLISHED / HIDDEN
```

**Rules:**
- New providers start as PENDING
- Admin approves/rejects providers
- Only APPROVED providers can publish services
- Services start as DRAFT
- Provider can publish/hide their services
- Admin can hide any service (violation)

### B.4 Review Workflow

**Rules:**
- Only users with COMPLETED booking can review
- One review per booking
- Provider can reply once per review
- Rating must be 1-5 stars
- Reviews are public immediately (no moderation needed for MVP)

---

## C. DATABASE UPDATE ĐỀ XUẤT

### C.1 Bảng Cần Thêm

**None needed** - Current schema has necessary tables:
- `NhaCungCap` (Provider) ✓
- `BookingItem` ✓
- `BookingStatusLog` ✓
- `DanhGia` ✓
- `PhanHoiDanhGia` ✓

### C.2 Cột Cần Thêm

**1. NhaCungCap (Provider)**
```sql
ALTER TABLE NhaCungCap
ADD CONSTRAINT CHK_TrangThai 
CHECK (TrangThai IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'));

ALTER TABLE NhaCungCap
ADD COLUMN CanAutoConfirm BIT DEFAULT 0; -- Optional feature
```

**2. Service Tables (KhachSan, NhaHang, HoatDong, PhuongTien)**
```sql
-- Make MaNhaCungCap NOT NULL
ALTER TABLE KhachSan
ALTER COLUMN MaNhaCungCap INT NOT NULL;

ALTER TABLE NhaHang
ALTER COLUMN MaNhaCungCap INT NOT NULL;

ALTER TABLE HoatDong
ALTER COLUMN MaNhaCungCap INT NOT NULL;

ALTER TABLE PhuongTien
ALTER COLUMN MaNhaCungCap INT NOT NULL;

-- Add service status
ALTER TABLE KhachSan
ADD COLUMN ServiceStatus NVARCHAR(20) DEFAULT 'DRAFT';

ALTER TABLE NhaHang
ADD COLUMN ServiceStatus NVARCHAR(20) DEFAULT 'DRAFT';

ALTER TABLE HoatDong
ADD COLUMN ServiceStatus NVARCHAR(20) DEFAULT 'DRAFT';

ALTER TABLE PhuongTien
ADD COLUMN ServiceStatus NVARCHAR(20) DEFAULT 'DRAFT';

-- Add constraints
ALTER TABLE KhachSan
ADD CONSTRAINT CHK_ServiceStatus
CHECK (ServiceStatus IN ('DRAFT', 'PUBLISHED', 'HIDDEN'));

ALTER TABLE KhachSan
ADD CONSTRAINT CHK_TrangThai
CHECK (TrangThai IN ('ACTIVE', 'INACTIVE', 'SUSPENDED'));
```

**3. BookingItem**
```sql
-- Add status constraint
ALTER TABLE BookingItem
ADD CONSTRAINT CHK_BookingStatus
CHECK (BookingStatus IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED'));

-- Make MaBookingItem NOT NULL in DanhGia
ALTER TABLE DanhGia
ALTER COLUMN MaBookingItem BIGINT NOT NULL;

-- Add unique constraint for one-review-per-booking
ALTER TABLE DanhGia
ADD CONSTRAINT UQ_Review_Per_Booking UNIQUE (MaNguoiDung, MaBookingItem);

-- Add rating constraint
ALTER TABLE DanhGia
ADD CONSTRAINT CHK_Rating
CHECK (SoSao BETWEEN 1 AND 5);
```

**4. DonDat**
```sql
-- Add status constraint
ALTER TABLE DonDat
ADD CONSTRAINT CHK_TrangThai
CHECK (TrangThai IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'));

ALTER TABLE DonDat
ADD CONSTRAINT CHK_TrangThaiThanhToan
CHECK (TrangThaiThanhToan IN ('PENDING', 'PAID', 'REFUNDED', 'FAILED'));
```

**5. NguoiDung**
```sql
-- Add role constraint
ALTER TABLE NguoiDung
ADD CONSTRAINT CHK_VaiTro
CHECK (VaiTro IN ('TRAVELER', 'PROVIDER', 'ADMIN', 'BLOGGER'));

-- Add constraint CHK_TrangThai
ALTER TABLE NguoiDung
ADD CONSTRAINT CHK_TrangThai
CHECK (TrangThai IN ('ACTIVE', 'INACTIVE', 'BANNED', 'PENDING_VERIFICATION'));
```

### C.3 FK Cần Thêm

**Current FKs are adequate.** No new FKs needed if we enforce existing ones properly.

### C.4 Trạng Thái Cần Chuẩn Hóa

**Use ENUMs in C# code instead of strings:**

```csharp
public enum ProviderStatus
{
    Pending,
    Approved,
    Rejected,
    Suspended
}

public enum ServiceStatus
{
    Draft,
    Published,
    Hidden
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed,
    Rejected
}

public enum PaymentStatus
{
    Pending,
    Paid,
    Refunded,
    Failed
}

public enum UserRole
{
    Traveler,
    Provider,
    Admin,
    Blogger
}

public enum UserStatus
{
    Active,
    Inactive,
    Banned,
    PendingVerification
}
```

---

## D. WORKFLOW CHUẨN

### D.1 Booking Flow

```
┌─────────────┐
│  Traveler   │
└──────┬──────┘
       │
       │ 1. Create Booking
       ↓
┌─────────────┐
│   DonDat    │ Status: PENDING
│  BookingItem│ Status: PENDING
└──────┬──────┘
       │
       │ 2. Notification to Provider
       ↓
┌─────────────┐
│  Provider   │
└──────┬──────┘
       │
       │ 3a. Confirm
       ↓
┌─────────────┐
│ BookingItem │ Status: CONFIRMED
└──────┬──────┘
       │
       │ 4. Service Delivered
       ↓
┌─────────────┐
│ BookingItem │ Status: COMPLETED
└──────┬──────┘
       │
       │ 5. Traveler can Review
       ↓
┌─────────────┐
│   DanhGia   │
└─────────────┘

       │ 3b. Reject
       ↓
┌─────────────┐
│ BookingItem │ Status: REJECTED
└─────────────┘
```

### D.2 Moderation Flow

**Provider Registration:**
```
User registers as Provider
    ↓
NhaCungCap created: Status = PENDING
    ↓
Admin reviews
    ↓
    ├── APPROVED → Provider can publish services
    └── REJECTED → Provider cannot publish
```

**Service Publication:**
```
Provider creates service: Status = DRAFT
    ↓
Provider publishes: Status = PUBLISHED
    ↓
Service visible to travelers
    ↓
Admin can hide: Status = HIDDEN (violation)
```

### D.3 Review Flow

```
Booking completed (Status = COMPLETED)
    ↓
Traveler submits review
    ↓
System validates:
    - User owns the booking
    - Booking is COMPLETED
    - No existing review for this booking
    ↓
Review created
    ↓
Provider receives notification
    ↓
Provider can reply (once)
    ↓
Review + Reply visible to all
```

---

## E. PERMISSION MATRIX

| Action | Traveler | Provider | Admin |
|--------|----------|----------|-------|
| **User Management** |
| Register | ✓ | ✓ | - |
| View own profile | ✓ | ✓ | ✓ |
| Edit own profile | ✓ | ✓ | ✓ |
| **Provider Management** |
| Register as provider | ✓ | - | - |
| View own provider profile | - | ✓ | ✓ |
| Edit own provider profile | - | ✓ | ✓ |
| Approve provider | - | - | ✓ |
| Reject provider | - | - | ✓ |
| **Service Management** |
| Create service | - | ✓ | - |
| Edit own service | - | ✓ | - |
| Delete own service | - | ✓ | - |
| Publish own service | - | ✓ | - |
| Hide own service | - | ✓ | - |
| View any service | ✓ | ✓ | ✓ |
| Edit any service | - | - | ✓ |
| Delete any service | - | - | ✓ |
| **Booking Management** |
| Create booking | ✓ | - | - |
| View own bookings | ✓ | - | - |
| Cancel own booking | ✓ | - | - |
| View provider bookings | - | ✓ | ✓ |
| Confirm booking | - | ✓ | - |
| Reject booking | - | ✓ | - |
| Mark booking complete | - | ✓ | - |
| View all bookings | - | - | ✓ |
| **Review Management** |
| Create review (after booking) | ✓ | - | - |
| View reviews | ✓ | ✓ | ✓ |
| Reply to own service reviews | - | ✓ | - |
| Delete review (own) | ✓ | - | ✓ |
| Delete any review | - | - | ✓ |
| **Admin Actions** |
| View all users | - | - | ✓ |
| Ban user | - | - | ✓ |
| View all providers | - | - | ✓ |
| View all bookings | - | - | ✓ |
| View analytics | - | - | ✓ |

**Implementation Notes:**
- Use `[Authorize]` attribute with role checks
- Use ownership validation middleware for provider actions
- Example: Provider can only edit services where `service.MaNhaCungCap == currentUserId`

---

## F. NHỮNG PHẦN KHÔNG NÊN LÀM (OVER-ENGINEERING)

### F.1 KHÔNG Nên Làm (Scope Quá Lớn)

**1. Multi-Tenant Architecture**
- ❌ Complex tenant isolation
- ❌ Tenant-specific configurations
- ❌ Tenant billing
- ✅ Single-tenant is sufficient for demo

**2. Event Sourcing**
- ❌ Event store
- ❌ Event replay
- ❌ CQRS with separate read/write DBs
- ✅ Simple CRUD is enough

**3. Distributed Transactions**
- ❌ Saga pattern
- ❌ 2PC (Two-Phase Commit)
- ❌ Distributed transaction coordinator
- ✅ Local transactions with EF Core

**4. Real-time Inventory System**
- ❌ WebSocket inventory updates
- ❌ Redis caching for availability
- ❌ Complex conflict resolution
- ✅ Simple availability checks + booking status

**5. Complex Payout System**
- ❌ Escrow accounts
- ❌ Split payments
- ❌ Automatic settlement
- ❌ Accounting integration
- ✅ Simple wallet + manual withdrawal requests

**6. Enterprise Audit Logging**
- ❌ Comprehensive audit trail
- ❌ Audit log querying
- ❌ Compliance reporting
- ✅ Basic logging + `BookingStatusLog` is enough

### F.2 KHÔNG Nên Làm (Over-Abstraction)

**1. Generic Repository Pattern**
- ❌ `Repository<T>` with generic CRUD
- ❌ Specification pattern
- ❌ Complex query builders
- ✅ Specific repository methods per entity

**2. Domain Events Everywhere**
- ❌ Event-driven architecture
- ❌ Event handlers for every action
- ❌ Event sourcing
- ✅ Direct service calls are simpler

**3. Complex Validation Framework**
- ❌ FluentValidation with complex rules
- ❌ Custom validation attributes
- ❌ Validation pipeline
- ✅ Data annotations + simple validation logic

### F.3 KHÔNG Nên Làm (Future Features)

**1. Advanced Analytics**
- ❌ BI dashboard
- ❌ Complex reporting
- ❌ Data warehouse
- ✅ Simple statistics in provider dashboard

**2. AI Features**
- ❌ Recommendation engine
- ❌ Sentiment analysis on reviews
- ❌ Auto-pricing
- ✅ Manual management is fine

**3. Social Features**
- ❌ Provider social networking
- ❌ Advanced community features
- ❌ Gamification
- ✅ Basic reviews + replies are enough

**4. Mobile App**
- ❌ Native mobile apps
- ❌ Push notifications
- ❌ Offline mode
- ✅ Responsive web is sufficient

### F.4 KHÔNG Nên Làm (Complex Workflows)

**1. Complex Booking Rules**
- ❌ Dynamic pricing
- ❌ Package deals
- ❌ Multi-service bundles
- ✅ Simple per-service booking

**2. Advanced Cancellation Policy**
- ❌ Time-based cancellation fees
- ❌ Refund calculation engine
- ❌ Insurance integration
- ✅ Simple cancel with reason

**3. Provider Staff Management**
- ❌ Multi-level staff hierarchy
- ❌ Role-based permissions within provider
- ❌ Staff performance tracking
- ✅ Single provider account is enough

---

## G. TỔNG KẾT ĐỀ XUẤT

### G.1 Ưu Tiên Thực Hiện

**Phase 1 (Critical - Must Do):**
1. Add CHECK constraints for all status columns
2. Make `MaNhaCungCap` NOT NULL in service tables
3. Add `ServiceStatus` column to service tables
4. Add unique constraint for reviews per booking
5. Add rating range constraint (1-5)
6. Implement ownership validation in API layer

**Phase 2 (Important - Should Do):**
7. Convert string statuses to C# enums
8. Implement provider approval workflow
9. Implement service publish/hide workflow
10. Add booking confirmation/rejection workflow
11. Add provider reply to reviews
12. Create provider permission middleware

**Phase 3 (Nice to Have - Can Do Later):**
13. Provider auto-confirmation setting
14. Basic provider dashboard statistics
15. Service images management
16. Provider wallet basic functionality

### G.2 Nguyên Tắc Thiết Kế

**Keep It Simple:**
- Single responsibility per entity
- Clear ownership model
- Simple state machines
- Minimal abstraction

**Production-Ready:**
- Type-safe enums
- Database constraints
- Ownership validation
- Clear permission matrix

**Maintainable:**
- Consistent naming
- Clear workflows
- Well-documented APIs
- Simple code structure

**Extensible:**
- Easy to add new service types
- Easy to add new statuses
- Easy to add new roles
- Easy to add new permissions

---

## H. KẾT LUẬN

Hệ thống hiện tại đã có cơ sở tốt với các bảng cần thiết. Vấn đề chính là:

1. **Thiếu constraints** - Status columns là string, không có validation
2. **Ownership không rõ ràng** - Provider FK nullable, không enforced
3. **Permission không được validate** - Không có middleware kiểm tra ownership
4. **Workflow không rõ ràng** - Không có quy trình xác nhận booking, duyệt provider

**Đề xuất trên tập trung vào:**
- Thêm database constraints để đảm bảo data integrity
- Enforce ownership ở database level (NOT NULL FKs)
- Implement permission validation ở API layer
- Định nghĩa rõ workflows với enum states
- Giữ thiết kế đơn giản, không over-engineering

**Kết quả mong đợi:**
- Hệ thống đủ chuẩn để demo thực tế
- Logic rõ ràng, dễ maintain
- Có tính mở rộng vừa phải
- Không biến thành enterprise OTA system
- Phù hợp scope đồ án tốt nghiệp
