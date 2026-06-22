# Trip Planner Module Specifications

## 1. My Trips Page
* **Route**: `/trips`
* **Actor**: Traveler
* **CRD Mapping**: 3.2.1
* **SRS Mapping**: UC 009
* **Database Mapping**: `LICH_TRINH`

### Validation Rules
* None for viewing list.

### Desktop Layout
* 3-column masonry grid for trip cards. Filters/Tabs across the top (Upcoming, Past, Drafts).

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View My Trips | ❌ (Redirect) | ✅ | ❌ (Redirect) | ❌ (Redirect) |

### Embedded Component Inventory

#### `TripsListManager`
* **Purpose**: Displays and manages all trips owned or collaborated by the user.
* **Inputs**: `userId` (number).
* **Outputs**: List of trips, navigation triggers.
* **Required Data**: Paginated `LICH_TRINH` records linked to the user.
* **Required APIs**: `GET /api/trips`, `DELETE /api/trips/:id`
* **Events**: `onCreateNewClick`, `onTripSelect`, `onDeleteTrip`.
* **Permissions**: `TRAVELER`.
* **Business Requirements**: Accurately fetch user's trips, support deleting trips with confirmation.
* **UI Recommendations**: Tabbed view (Upcoming, Past, Drafts), empty states, thumbnail images for trips (derived from first destination).

---

## 2. Trip Overview Page (Read-Only)
* **Route**: `/trips/:id`
* **Actor**: Traveler (Owner/Collaborator), Guest (if Public)
* **CRD Mapping**: 3.2, 3.4.2
* **SRS Mapping**: UC 009, UC 014, UC 015
* **Database Mapping**: `LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH`

### Validation Rules
* **Trip ID**: Must be valid existing integer ID.

### Desktop Layout
* 2-column layout. Left column (40%) sticky sidebar with `TripSummaryHeader`. Right column (60%) scrolling `TripTimelineView`.

### Component Permission Matrix
| Action | Guest | Traveler (Owner) | Traveler (Viewer) | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Public Trip | ✅ | ✅ | ✅ | ✅ |
| View Private Trip| ❌ | ✅ | ❌ | ✅ (Support) |
| Edit Request | ❌ | ✅ | ❌ | ❌ |
| Clone Trip | ❌ (Auth) | ❌ | ✅ | ❌ |

### Embedded Component Inventory

#### `TripSummaryHeader`
* **Purpose**: Displays high-level trip metadata.
* **Inputs**: `tripId` (number).
* **Outputs**: None.
* **Required Data**: `LICH_TRINH` basic data.
* **Required APIs**: `GET /api/trips/:id/summary`
* **Events**: `onEditClick` (if owner), `onShareClick`, `onCloneClick` (if not owner).
* **Permissions**: Viewable based on trip visibility settings.
* **Business Requirements**: Accurate calculation of total cost and total days. Hide edit buttons if unauthorized.
* **UI Recommendations**: Interactive map showing all high-level nodes of the trip.

#### `TripTimelineView`
* **Purpose**: Read-only sequential display of the itinerary.
* **Inputs**: `tripId` (number).
* **Outputs**: None.
* **Required Data**: `NGAY_LICH_TRINH` joined with `DIA_DIEM_LICH_TRINH`.
* **Required APIs**: `GET /api/trips/:id/timeline`
* **Events**: `onExpandDay`, `onClickLocation`.
* **Permissions**: Inherits from page.
* **Business Requirements**: Strict chronological sorting.
* **UI Recommendations**: Nested services under locations, cost breakdowns per day, collapsible days.

---

## 3. Trip Planner Core (Interactive)
* **Route**: `/trips/:id/planner`
* **Actor**: Traveler (Owner/Collaborator)
* **CRD Mapping**: 3.2.2, 3.2.3, 3.5.2, 3.5.3
* **SRS Mapping**: UC 006, UC 007, UC 008, UC 017
* **Database Mapping**: `LICH_TRINH`, `NGAY_LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH`, `CHI_PHI_DICH_VU_LICH_TRINH`, `LICH_SU_AI`

### Validation Rules
* **Timeline Edits**: Cannot overlap start/end times within the same day.
* **Locations**: Must be valid `DIA_DIEM` records.

### Desktop Layout
* 3-pane workspace (full viewport width, no global footer).
  * Left Pane (25%): `PlannerSidebarLibrary`
  * Center Pane (50%): `InteractiveTimelineManager` (Scrollable)
  * Right Pane (25%): Map View / AI Tools Drawer

### Component Permission Matrix
| Action | Owner / Editor | Viewer Collaborator | Guest |
| :--- | :--- | :--- | :--- |
| View Planner | ✅ | ✅ | ❌ (Redirect) |
| Add/Remove Item| ✅ | ❌ | ❌ |
| Optimize Route | ✅ (Premium) | ❌ | ❌ |
| Manage Access | ✅ (Owner Only) | ❌ | ❌ |

### Embedded Component Inventory

#### `PlannerSidebarLibrary`
* **Purpose**: Search and select locations/services to drag or add into the timeline.
* **Inputs**: `searchQuery` (string).
* **Outputs**: Payload for selected item to add.
* **Required Data**: `DIA_DIEM`, `DICH_VU` databases (via search API).
* **Required APIs**: `GET /api/explore/search`
* **Events**: `onSearch`, `onDragStart`, `onAddClick`.
* **Permissions**: `TRAVELER` Editor.
* **Business Requirements**: Distinct data queries for Places vs Services.
* **UI Recommendations**: Quick add buttons, distinct visual styling, "Saved Items" tab pulling from `LUU_LICH_TRINH`.

#### `InteractiveTimelineManager`
* **Purpose**: The core drag-and-drop workspace for building the itinerary.
* **Inputs**: Full nested trip object.
* **Outputs**: Reorder payloads, update/delete mutations.
* **Required Data**: Real-time state of `NGAY_LICH_TRINH` and children.
* **Required APIs**: `GET /api/trips/:id/timeline`, `PUT /api/trips/:id/timeline`
* **Events**: `onDropDrop`, `onChangeTime`, `onRemoveItem`.
* **Permissions**: `TRAVELER` Editor.
* **Business Requirements**: Conflict warnings for overlapping times, strict parent-child day hierarchies.
* **UI Recommendations**: Robust drag-and-drop mechanics, inline time editing, optimistic UI updates, undo/redo stack.

#### `CollaboratorSettingsModal`
* **Purpose**: Manage who can view or edit the trip.
* **Inputs**: `tripId` (number).
* **Outputs**: Add/Remove collaborator API payload.
* **Required Data**: `CHIA_SE_LICH_TRINH` records.
* **Required APIs**: `GET /api/trips/:id/collaborators`, `POST /api/trips/:id/collaborators`
* **Events**: `onSearchUser`, `onUpdateRole`, `onGenerateShareLink`.
* **Permissions**: `TRAVELER` Owner Only.
* **Business Requirements**: Strict RBAC validation before committing collaborator additions.
* **UI Recommendations**: Role selection dropdowns (Viewer vs. Editor), copy to clipboard for share links.

#### `AIRouteOptimizerWidget` (Premium Embedded)
* **Purpose**: Analyzes the current day's timeline and suggests an optimal order based on distance.
* **Inputs**: Array of locations for a specific `NGAY_LICH_TRINH`.
* **Outputs**: Suggested reordered array.
* **Required Data**: Distance/routing estimations.
* **Required APIs**: `POST /api/ai/optimize-route`
* **Events**: `onOptimizeClick`, `onAcceptOptimization`.
* **Permissions**: `PREMIUM_TRAVELER` Editor.
* **Business Requirements**: Validate Premium subscription status before enabling.
* **UI Recommendations**: Premium gate (lock icon if not premium), clear before/after comparison, map animation showing the new route.

#### `AIBudgetAdvisorWidget` (Premium Embedded)
* **Purpose**: Analyzes the total trip cost and suggests optimizations or flags missing expenses.
* **Inputs**: Full trip nested costs.
* **Outputs**: Suggested budget adjustments.
* **Required Data**: `CHI_PHI_DICH_VU_LICH_TRINH` aggregates.
* **Required APIs**: `POST /api/ai/analyze-budget`
* **Events**: `onAnalyzeBudgetClick`.
* **Permissions**: `PREMIUM_TRAVELER` Editor.
* **Business Requirements**: Calculate total correctly.
* **UI Recommendations**: Premium gate, pie chart of expenses, actionable tips, categorized cost breakdown.
