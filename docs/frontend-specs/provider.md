# Provider Platform Module Specifications

## 1. Provider Registration & Onboarding
* **Route**: `/provider/registration`, `/provider/pending`
* **Actor**: Traveler, Provider Pending
* **CRD Mapping**: 3.6.1
* **SRS Mapping**: UC SP001
* **Database Mapping**: `NHA_CUNG_CAP`

### Validation Rules
* **Business Name**: Required, max 200 characters.
* **Tax ID**: Required, standard Vietnamese Tax ID format.
* **Documents**: Must be PDF, JPG, or PNG under 5MB.

### Desktop Layout
* Single-column centered form for registration (max-width: 600px). 
* For Pending Status, a simple centered message card.

### Component Permission Matrix
| Action | Traveler | Provider (Pending) | Provider (Approved) | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Registration | ✅ | ❌ (Redirect) | ❌ (Redirect) | ❌ |
| Submit Registration | ✅ | ❌ | ❌ | ❌ |
| View Pending Status | ❌ | ✅ | ❌ (Redirect) | ❌ |

### Embedded Component Inventory

#### `BusinessRegistrationForm`
* **Purpose**: Collects verified business information from users wishing to become Providers.
* **Inputs**: `businessName`, `taxId`, `contactEmail`, `contactPhone`, `address`, `businessDocs` (Files).
* **Outputs**: Provider Registration API payload.
* **Required Data**: Current user ID.
* **Required APIs**: `POST /api/provider/register`, `POST /api/provider/upload-docs`
* **Events**: `onSubmitRegistration`, `onFileDrop`.
* **Permissions**: `TRAVELER`.
* **Business Requirements**: Enforce strict file upload validations to prevent malicious files.
* **UI Recommendations**: Multi-step wizard UI, save draft functionality.

#### `PendingStatusView`
* **Purpose**: Blocks access to the dashboard while the admin reviews the application.
* **Inputs**: `status` (enum: PENDING, REJECTED).
* **Outputs**: None.
* **Required Data**: Current user's `NHA_CUNG_CAP` record status.
* **Required APIs**: `GET /api/provider/status`
* **Events**: None.
* **Permissions**: `PROVIDER_PENDING`.
* **Business Requirements**: Periodically poll or refresh status on page load.
* **UI Recommendations**: Clear messaging, visual indicators (e.g., hourglass icon), support contact link.

---

## 2. Provider Dashboard
* **Route**: `/provider/dashboard`
* **Actor**: Provider Approved
* **CRD Mapping**: 3.6.2
* **SRS Mapping**: UC SP009, SP012
* **Database Mapping**: `NHA_CUNG_CAP`, `DANG_KY_GOI_NCC`

### Validation Rules
* None for read-only metrics.

### Desktop Layout
* Sidebar navigation specifically for Provider tools. Main content area contains `ProviderKPIWidget` at the top, followed by `ActivePromotionsWidget`.

### Component Permission Matrix
| Action | Traveler | Provider (Approved) | Admin |
| :--- | :--- | :--- | :--- |
| View Dashboard | ❌ | ✅ | ❌ |

### Embedded Component Inventory

#### `ProviderKPIWidget`
* **Purpose**: High-level metrics for the provider's business performance on the platform.
* **Inputs**: None.
* **Outputs**: None.
* **Required Data**: Total views, total reviews, average rating, active services count.
* **Required APIs**: `GET /api/provider/stats`
* **Events**: None.
* **Permissions**: `PROVIDER_APPROVED`.
* **Business Requirements**: Accurately aggregate metrics tied to the provider's `NHA_CUNG_CAP` ID.
* **UI Recommendations**: Clean card layout, skeleton loaders, sparkline charts showing 30-day trends.

#### `ActivePromotionsWidget`
* **Purpose**: Shows current active marketing packages the provider has purchased.
* **Inputs**: None.
* **Outputs**: Navigation to `/provider/packages`.
* **Required Data**: `DANG_KY_GOI_NCC` active records.
* **Required APIs**: `GET /api/provider/packages/active`
* **Events**: `onRenewClick`.
* **Permissions**: `PROVIDER_APPROVED`.
* **Business Requirements**: Accurately calculate and display expiry dates based on database records.
* **UI Recommendations**: Visual warning for expiring packages (e.g., turning orange when < 3 days left), quick renew action.

---

## 3. Service Management
* **Route**: `/provider/services`, `/provider/services/create`, `/provider/services/:id/edit`
* **Actor**: Provider Approved
* **CRD Mapping**: 3.6.3
* **SRS Mapping**: UC SP003, SP004, SP005
* **Database Mapping**: `DICH_VU`, `ANH_DICH_VU`

### Validation Rules
* **Service Name**: Required, max 200 chars.
* **Price**: Must be a positive integer.
* **Address**: Required string.

### Desktop Layout
* Table view for `/services` with top action bar for "Create New". 
* Create/Edit pages use a 2-column layout: Form fields on the left (60%), Image Manager and Publish controls on the right (40%).

### Component Permission Matrix
| Action | Traveler | Provider (Owner) | Provider (Other) | Admin |
| :--- | :--- | :--- | :--- | :--- |
| List Services | ❌ | ✅ | ❌ | ✅ (Via Admin UI) |
| Create Service | ❌ | ✅ | ❌ | ❌ |
| Edit Service | ❌ | ✅ | ❌ | ❌ |

### Embedded Component Inventory

#### `ServicesDataTable`
* **Purpose**: Central hub for managing all listed services.
* **Inputs**: `servicesList` (Array of DICH_VU).
* **Outputs**: List of services with actions.
* **Required Data**: Filterable/Paginated list of the provider's services.
* **Required APIs**: `GET /api/provider/services`
* **Events**: `onEditRow`, `onDeleteRow`, `onToggleStatus`.
* **Permissions**: `PROVIDER_APPROVED`.
* **Business Requirements**: Enforce soft-delete or status toggling to preserve trip history for travelers.
* **UI Recommendations**: Search, sort by status (Active/Inactive), clear status badges.

#### `ServiceEditorForm`
* **Purpose**: Interface for creating or updating a service listing.
* **Inputs**: `name`, `description`, `price`, `address`, `tags`, `images`.
* **Outputs**: Create/Update API payloads.
* **Required Data**: `TINH_THANH` and `TAG` master data for dropdowns.
* **Required APIs**: `POST /api/provider/services`, `PUT /api/provider/services/:id`, `POST /api/provider/services/images`
* **Events**: `onSave`, `onCancel`, `onImageUpload`.
* **Permissions**: `PROVIDER_APPROVED` (Owner).
* **Business Requirements**: Validate that coordinates or addresses exist.
* **UI Recommendations**: Image gallery manager with drag-to-reorder, rich text description editor.

---

## 4. Review Management
* **Route**: `/provider/reviews`
* **Actor**: Provider Approved
* **CRD Mapping**: 3.6.4
* **SRS Mapping**: UC SP008
* **Database Mapping**: `DANH_GIA`, `PHAN_HOI_DANH_GIA`

### Validation Rules
* **Reply Content**: Required, max 1000 characters.

### Desktop Layout
* Inbox-style layout. Left column lists reviews. Center/Right area shows selected review details and the reply form.

### Component Permission Matrix
| Action | Traveler | Provider (Owner) | Admin |
| :--- | :--- | :--- | :--- |
| Read Reviews | ❌ | ✅ | ✅ (Via Admin UI) |
| Reply | ❌ | ✅ | ❌ |
| Report Review | ❌ | ✅ | ❌ |

### Embedded Component Inventory

#### `ReviewInbox`
* **Purpose**: Interface for reading and replying to traveler reviews.
* **Inputs**: `reviews` (Array of DANH_GIA).
* **Outputs**: Reply payload.
* **Required Data**: List of reviews tied to the provider's services.
* **Required APIs**: `GET /api/provider/reviews`, `POST /api/provider/reviews/:id/reply`
* **Events**: `onSubmitReply`, `onReportReview`.
* **Permissions**: `PROVIDER_APPROVED`.
* **Business Requirements**: Prevent multiple replies to the same review (1:1 mapping in `PHAN_HOI_DANH_GIA`).
* **UI Recommendations**: Filter by star rating, unreplied filter, inline reply textbox.

---

## 5. Promotion Packages
* **Route**: `/provider/packages`
* **Actor**: Provider Approved
* **CRD Mapping**: 3.6.5
* **SRS Mapping**: UC SP010, SP011
* **Database Mapping**: `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC`

### Validation Rules
* **Package Selection**: Must select a valid `GOI_DICH_VU_NCC`.

### Desktop Layout
* Pricing table format. 3 columns for 3 tiers, centered on the page.

### Component Permission Matrix
| Action | Provider (Approved) | Admin |
| :--- | :--- | :--- |
| View Packages | ✅ | ✅ (Via Admin UI) |
| Subscribe / Pay | ✅ | ❌ |

### Embedded Component Inventory

#### `PackagePricingTable`
* **Purpose**: Compares available promotional packages.
* **Inputs**: `packages` (Array of GOI_DICH_VU_NCC).
* **Outputs**: Selection payload.
* **Required Data**: Master list of provider packages.
* **Required APIs**: `GET /api/packages/provider`
* **Events**: `onSelectPackage`.
* **Permissions**: `PROVIDER_APPROVED`.
* **Business Requirements**: Accurately display features and limits defined in the database.
* **UI Recommendations**: Clear feature checklists, highlighting the "Recommended" tier.

#### `SimulatedCheckoutForm`
* **Purpose**: Mock payment interface as per CRD 7.2 requirements (No real gateway).
* **Inputs**: `packageId` (number).
* **Outputs**: Payment Success Trigger.
* **Required Data**: Selected package details.
* **Required APIs**: `POST /api/provider/packages/subscribe-simulated`
* **Events**: `onSimulateSuccess`, `onSimulateFailure`.
* **Permissions**: `PROVIDER_APPROVED`.
* **Business Requirements**: Generate a mock `THANH_TOAN_NCC` record upon success, update `DANG_KY_GOI_NCC`.
* **UI Recommendations**: Clear UI indicating this is a simulated environment.
