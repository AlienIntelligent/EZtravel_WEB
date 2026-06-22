# Explore & Discovery Module Specifications

## 1. Explore Page
* **Route**: `/explore`
* **Actor**: Guest, Traveler
* **CRD Mapping**: 3.3.1 (Khám phá theo danh mục)
* **SRS Mapping**: UC 011
* **Database Mapping**: `DIA_DIEM`, `DICH_VU`, `TINH_THANH`, `TAG`, `DIA_DIEM_TAG`

### Validation Rules
* **Search Query**: Max 100 characters, alphanumeric and standard Vietnamese accents.
* **Filters**: Selected regions or tags must exist in master data.

### Desktop Layout
* Two-pane layout. Left pane (25%) sticky sidebar for `SearchAndFilterBar`. Right pane (75%) scrolling grid for `DiscoveryGrid`.
* Top right toggle to switch Right pane from Grid to Interactive Map view.

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Explore | ✅ | ✅ | ✅ | ✅ |
| Search/Filter | ✅ | ✅ | ✅ | ✅ |

### Embedded Component Inventory

#### `SearchAndFilterBar`
* **Purpose**: Advanced filtering and searching for destinations and services.
* **Inputs**: `keyword` (string), `regionId` (number), `tagIds` (Array), `type` (enum: DESTINATION, SERVICE).
* **Outputs**: Filtered dataset query parameters.
* **Required Data**: Master list of `TINH_THANH` and `TAG`.
* **Required APIs**: `GET /api/categories/regions`, `GET /api/categories/tags`
* **Events**: `onFilterChange`, `onClearFilters`.
* **Permissions**: Public.
* **Business Requirements**: Debounced text search (min 300ms) to reduce API load.
* **UI Recommendations**: Multi-select dropdowns for tags, active filter pills, Map toggle view button.

#### `DiscoveryGrid`
* **Purpose**: Displays the results of the discovery search.
* **Inputs**: `results` (Array of DIA_DIEM or DICH_VU), `isLoading` (boolean).
* **Outputs**: Navigation to detail pages.
* **Required Data**: Paginated query results from Discovery API.
* **Required APIs**: `GET /api/explore`
* **Events**: `onCardClick`, `onLoadMore`.
* **Permissions**: Public.
* **Business Requirements**: Infinite scroll or pagination implementation.
* **UI Recommendations**: Skeleton loaders, empty state ("No results found"), "Add to Trip" quick action hover button on cards.

---

## 2. Destination Detail Page
* **Route**: `/explore/destinations/:id`
* **Actor**: Guest, Traveler
* **CRD Mapping**: 3.3.1
* **SRS Mapping**: UC 011
* **Database Mapping**: `DIA_DIEM`, `ANH_DIA_DIEM`

### Validation Rules
* **ID Param**: Must be a valid integer corresponding to a `DIA_DIEM` ID.

### Desktop Layout
* Full-width hero image at the top.
* Content section restricted to max-width (1200px), centered.
* Left column (70%) for Description. Right column (30%) for map snippet and quick stats.
* Bottom band for `NearbyServicesList`.

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Details | ✅ | ✅ | ✅ | ✅ |

### Embedded Component Inventory

#### `DestinationHeader`
* **Purpose**: Hero section providing a stunning visual and basic info of the location.
* **Inputs**: `destination` (DIA_DIEM object).
* **Outputs**: None.
* **Required Data**: Image URLs from `ANH_DIA_DIEM`, Name, Description, Address.
* **Required APIs**: `GET /api/destinations/:id`
* **Events**: `onGalleryClick`.
* **Permissions**: Public.
* **Business Requirements**: Display location metadata accurately.
* **UI Recommendations**: High-resolution image gallery modal, clear typography, breadcrumbs navigation (`Explore > Miền Bắc > Hà Nội`).

#### `NearbyServicesList`
* **Purpose**: Recommends services (hotels, restaurants) around this destination.
* **Inputs**: `destinationId` (number).
* **Outputs**: Navigation to Service Detail.
* **Required Data**: `DICH_VU` records linked to or geographically close to the `DIA_DIEM`.
* **Required APIs**: `GET /api/destinations/:id/services`
* **Events**: `onServiceClick`.
* **Permissions**: Public.
* **Business Requirements**: Sort by distance or rating.
* **UI Recommendations**: Horizontal scroll list of service cards, filter chips by service type (Dining, Accommodation, Transport).

---

## 3. Service Detail Page
* **Route**: `/explore/services/:id`
* **Actor**: Guest, Traveler
* **CRD Mapping**: 3.3.2, 3.4.1 (Reviews)
* **SRS Mapping**: UC 011, UC 013
* **Database Mapping**: `DICH_VU`, `ANH_DICH_VU`, `DANH_GIA`, `PHAN_HOI_DANH_GIA`

### Validation Rules
* **ID Param**: Must be a valid integer corresponding to a `DICH_VU` ID.
* **Review Submission**: Rating required (1-5), Comment max 1000 characters.

### Desktop Layout
* Similar to Destination Detail: Full-width hero or gallery block.
* 70/30 split. Left: Service details, Description, Reviews. Right: Sticky floating card with Pricing, Contact Info, and "Add to Trip" CTA.

### Component Permission Matrix
| Action | Guest | Traveler | Provider (Owner) | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Service | ✅ | ✅ | ✅ | ✅ |
| Add to Trip | ❌ (Redirect) | ✅ | ✅ | ✅ |
| Write Review | ❌ (Redirect) | ✅ | ❌ | ❌ |
| Reply Review | ❌ | ❌ | ✅ | ❌ |

### Embedded Component Inventory

#### `ServiceInfoPanel`
* **Purpose**: Displays comprehensive details about a provider's service.
* **Inputs**: `service` (DICH_VU object).
* **Outputs**: Trigger "Add to Trip" flow.
* **Required Data**: Service name, description, operating hours, estimated cost, contact info.
* **Required APIs**: `GET /api/services/:id`
* **Events**: `onAddToTripClick`, `onShareClick`.
* **Permissions**: Public (Viewing).
* **Business Requirements**: Clear pricing display, operating hours status (e.g., "Open Now").
* **UI Recommendations**: Direct link to the Provider's profile page, explicit Provider contact details.

#### `ReviewSection`
* **Purpose**: Shows community feedback and provider responses.
* **Inputs**: `serviceId` (number).
* **Outputs**: New review payload.
* **Required Data**: `DANH_GIA` and associated `PHAN_HOI_DANH_GIA`.
* **Required APIs**: `GET /api/services/:id/reviews`, `POST /api/services/:id/reviews`
* **Events**: `onSubmitReview`, `onSortChange`.
* **Permissions**: View (Public), Write Review (Traveler), Reply (Provider Owner).
* **Business Requirements**: Aggregate star rating display, paginated review list.
* **UI Recommendations**: Clear visual distinction for Provider replies, image attachment support for new reviews.
