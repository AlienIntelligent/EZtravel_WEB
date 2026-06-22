# Administration Module Specifications

## 1. Admin Dashboard
* **Route**: `/admin/dashboard`
* **Actor**: Admin
* **CRD Mapping**: 3.7.1
* **SRS Mapping**: UC 021
* **Database Mapping**: `NGUOI_DUNG`, `LICH_TRINH`, `LICH_SU_AI`, `DANG_KY_GOI`, `THANH_TOAN_NCC`, `DANG_KY_GOI_NCC`

### Validation Rules
* None for read-only metrics.

### Desktop Layout
* Sidebar navigation for admin sections. Main content area contains `SystemAnalyticsGrid` at the top, followed by `PendingActionAlerts`.

### Component Permission Matrix
| Action | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- |
| View Dashboard | ❌ | ❌ | ✅ |

### Embedded Component Inventory

#### `SystemAnalyticsGrid`
* **Purpose**: High-level system health and metric reporting.
* **Inputs**: None.
* **Outputs**: None.
* **Required Data**: Aggregated metrics across all major tables.
* **Required APIs**: `GET /api/admin/stats`
* **Events**: `onDateRangeChange`.
* **Permissions**: `ADMIN`.
* **Business Requirements**: Ensure sensitive financial data is strictly gated to the Admin role only.
* **UI Recommendations**: Auto-refresh toggle, large numbers for KPIs, line charts for 30-day trends.

#### `PendingActionAlerts`
* **Purpose**: Highlights urgent items requiring admin intervention.
* **Inputs**: None.
* **Outputs**: Navigation to moderation or user queues.
* **Required Data**: Count of pending provider registrations and unresolved content reports.
* **Required APIs**: `GET /api/admin/alerts`
* **Events**: `onAlertClick`.
* **Permissions**: `ADMIN`.
* **Business Requirements**: Accurately fetch counts from `NHA_CUNG_CAP` (PENDING) and `BAO_CAO_NOI_DUNG` (UNRESOLVED).
* **UI Recommendations**: Red alert styling for high priority (e.g., > 50 pending reports).

---

## 2. User Management
* **Route**: `/admin/users`
* **Actor**: Admin
* **CRD Mapping**: 3.7.2
* **SRS Mapping**: UC 018
* **Database Mapping**: `NGUOI_DUNG`

### Validation Rules
* **Search**: Max 100 characters.

### Desktop Layout
* Full width data table with sticky header and pagination at the bottom. Filters and search bar at the top right.

### Component Permission Matrix
| Action | Admin |
| :--- | :--- |
| View Users | ✅ |
| Ban User | ✅ |
| Change Role| ✅ |

### Embedded Component Inventory

#### `UserDirectoryTable`
* **Purpose**: Search, filter, and manage all system accounts.
* **Inputs**: `usersList` (Array of NGUOI_DUNG).
* **Outputs**: User modification API payloads.
* **Required Data**: Paginated list of users.
* **Required APIs**: `GET /api/admin/users`, `PUT /api/admin/users/:id/status`, `PUT /api/admin/users/:id/role`
* **Events**: `onBanToggle`, `onRoleChange`, `onViewDetails`.
* **Permissions**: `ADMIN`.
* **Business Requirements**: Prevent admin from banning themselves or changing their own role.
* **UI Recommendations**: Advanced search (email, phone, name), role filters (Guest, Traveler, Provider, Admin), clear ban status indicators.

---

## 3. Moderation Queue
* **Route**: `/admin/moderation`
* **Actor**: Admin
* **CRD Mapping**: 3.7.3
* **SRS Mapping**: UC 019
* **Database Mapping**: `DUYET_NOI_DUNG`, `BAO_CAO_NOI_DUNG`

### Validation Rules
* **Rejection Reason**: Required if rejecting/banning content, max 500 characters.

### Desktop Layout
* Split-pane view. Left pane (30%) is an infinite scroll list of queue items. Right pane (70%) displays the full details of the selected item with action buttons anchored to the bottom.

### Component Permission Matrix
| Action | Admin |
| :--- | :--- |
| View Queue | ✅ |
| Approve | ✅ |
| Reject/Remove| ✅ |

### Embedded Component Inventory

#### `ModerationWorkspace`
* **Purpose**: Streamlined interface for reviewing flagged content or pending provider approvals.
* **Inputs**: `queueItems` (Array of pending items).
* **Outputs**: Approve/Reject API triggers.
* **Required Data**: Feed of `BAO_CAO_NOI_DUNG` and pending `NHA_CUNG_CAP` / `DICH_VU`.
* **Required APIs**: `GET /api/admin/moderation`, `POST /api/admin/moderation/:id/resolve`
* **Events**: `onApprove`, `onReject`, `onRequireChanges`.
* **Permissions**: `ADMIN`.
* **Business Requirements**: Insert log into `DUYET_NOI_DUNG` upon resolution.
* **UI Recommendations**: Quick keyboard shortcuts (e.g., 'A' for Approve, 'R' for Reject), pre-filled rejection reason dropdowns.

---

## 4. Category Management
* **Route**: `/admin/categories`
* **Actor**: Admin
* **CRD Mapping**: Implied core data
* **SRS Mapping**: UC 020
* **Database Mapping**: `TINH_THANH`, `TAG`

### Validation Rules
* **Name**: Required, max 100 characters. Must be unique.

### Desktop Layout
* Two-column layout. Left column for tags. Right column for Regions.

### Component Permission Matrix
| Action | Admin |
| :--- | :--- |
| View Categories | ✅ |
| Add Category | ✅ |
| Delete Category | ✅ |

### Embedded Component Inventory

#### `MasterDataManager`
* **Purpose**: Interface for editing system-wide taxonomies.
* **Inputs**: `regions` (Array), `tags` (Array).
* **Outputs**: Create/Update API payloads.
* **Required Data**: `TINH_THANH` and `TAG` tables.
* **Required APIs**: `GET /api/admin/categories`, `POST /api/admin/categories`, `DELETE /api/admin/categories/:id`
* **Events**: `onAddNode`, `onEditNode`, `onDeleteNode`.
* **Permissions**: `ADMIN`.
* **Business Requirements**: Prevent deletion of tags or regions that are actively linked to locations or services.
* **UI Recommendations**: Warning prompt before deleting tags (showing usage count), inline editing.
