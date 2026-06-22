# Home Module Specifications

## 1. Landing Page
* **Route**: `/`
* **Actor**: Guest
* **CRD Mapping**: 3.3 (Khám phá)
* **SRS Mapping**: UC 011
* **Database Mapping**: `LICH_TRINH`, `DIA_DIEM`

### Validation Rules
* **Search Query**: Optional, max 100 characters.
* **Date Range**: If selected, end date must be after or equal to start date.

### Desktop Layout
* Full-width hero banner at the top with a large centered search box.
* Content bands stacking below: Trending Destinations, then Public Trips Grid. 
* Footer at the bottom.

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Homepage | ✅ | ❌ (Redirect) | ❌ (Redirect) | ❌ (Redirect) |
| Search | ✅ | ❌ | ❌ | ❌ |

### Embedded Component Inventory

#### `HeroSearchBox`
* **Purpose**: Primary entry point for users to search destinations and start their journey.
* **Inputs**: `searchQuery` (string), `dateRange` (date tuple).
* **Outputs**: Navigation trigger to `/explore` with query params.
* **Required Data**: Popular locations array for auto-complete.
* **Required APIs**: `GET /api/locations/autocomplete`
* **Events**: `onChange`, `onSubmitSearch`.
* **Permissions**: Public.
* **Business Requirements**: Keyboard navigation support (Enter to search), redirect to `/explore` with params upon submit.
* **UI Recommendations**: Prominent placement, auto-complete dropdown, dynamic background hero image that cycles through top destinations.

#### `TrendingDestinationsCarousel`
* **Purpose**: Showcases highly-rated or frequently visited regions.
* **Inputs**: `destinationsList` (Array of DIA_DIEM).
* **Outputs**: Navigation to `/explore/destinations/:id`.
* **Required Data**: Top 10 locations from `DIA_DIEM` based on view counts.
* **Required APIs**: `GET /api/home/trending-destinations`
* **Events**: `onCardClick`, `onScrollNext`.
* **Permissions**: Public.
* **Business Requirements**: Ensure lazy loading of images for performance.
* **UI Recommendations**: Responsive horizontal scrolling, hover zoom effect on destination cards, location name overlay.

#### `PublicTripsGrid`
* **Purpose**: Displays inspiring community itineraries.
* **Inputs**: `tripsList` (Array of LICH_TRINH).
* **Outputs**: Navigation to `/community/trips/:id`.
* **Required Data**: Publicly shared trips with high `THICH_LICH_TRINH` counts.
* **Required APIs**: `GET /api/home/trending-trips`
* **Events**: `onTripClick`.
* **Permissions**: Public.
* **Business Requirements**: Display trip duration and cost estimate.
* **UI Recommendations**: Card layout showing author snippet, "Clone Trip" quick action button right on the card (triggers auth modal if guest).

---

## 2. Traveler Dashboard
* **Route**: `/dashboard`
* **Actor**: Traveler
* **CRD Mapping**: 3.2.1
* **SRS Mapping**: UC 005
* **Database Mapping**: `LICH_TRINH`, `THONG_BAO`

### Validation Rules
* None specific to the dashboard read-only view.

### Desktop Layout
* 3-column masonry or grid. Left sidebar for navigation. Center column for Recent Trips and Upcoming Schedule. Right column for Dashboard Stats and Notifications snippet.

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Dashboard | ❌ | ✅ | ✅ | ✅ |

### Embedded Component Inventory

#### `DashboardStats`
* **Purpose**: Provides a quick overview of the user's activity on the platform.
* **Inputs**: None.
* **Outputs**: Rendered metrics.
* **Required Data**: Count of user's `LICH_TRINH`, `LUU_LICH_TRINH`, unread `THONG_BAO`.
* **Required APIs**: `GET /api/traveler/stats`
* **Events**: None.
* **Permissions**: `TRAVELER`.
* **Business Requirements**: Accurately aggregate total items owned by user.
* **UI Recommendations**: Skeleton loader during data fetch, clean typography, interactive tooltips explaining the metrics.

#### `RecentTripsWidget`
* **Purpose**: Allows users to quickly resume planning their most recently edited trips.
* **Inputs**: `recentTrips` (Array of LICH_TRINH).
* **Outputs**: Navigation to `/trips/:id/planner`.
* **Required Data**: Top 3 most recently modified trips owned by user.
* **Required APIs**: `GET /api/trips?sort=updated_at&limit=3`
* **Events**: `onClickTrip`, `onClickCreateNew`.
* **Permissions**: `TRAVELER`.
* **Business Requirements**: Empty state prompting user to "Create First Trip".
* **UI Recommendations**: Edit/Delete quick action menu on hover, progress indicator (e.g., "3/5 Days Planned").

#### `UpcomingScheduleWidget`
* **Purpose**: Highlights the itinerary for the chronologically next trip.
* **Inputs**: `upcomingTrip` (LICH_TRINH).
* **Outputs**: Rendered timeline.
* **Required Data**: The nearest upcoming trip with `NGAY_LICH_TRINH`.
* **Required APIs**: `GET /api/trips/upcoming`
* **Events**: `onClickViewDetails`.
* **Permissions**: `TRAVELER`.
* **Business Requirements**: Calculate countdown accurately in local timezone.
* **UI Recommendations**: Countdown timer (e.g., "In 5 days"), brief summary of Day 1.

---

## 3. Notification Center
* **Route**: `/notifications`
* **Actor**: Traveler, Provider, Admin
* **CRD Mapping**: Implied
* **SRS Mapping**: Missing SRS
* **Database Mapping**: `THONG_BAO`

### Validation Rules
* None.

### Desktop Layout
* Single column centered layout (max-width: 600px). List format flowing top-down.

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Notifications | ❌ | ✅ | ✅ | ✅ |
| Mark as Read | ❌ | ✅ | ✅ | ✅ |

### Embedded Component Inventory

#### `NotificationList`
* **Purpose**: Lists all system alerts, social interactions, and collaboration invites.
* **Inputs**: `filterType` (enum: 'ALL', 'UNREAD').
* **Outputs**: Rendered list items, Mark as Read API trigger.
* **Required Data**: Array of `THONG_BAO` mapped to current user.
* **Required APIs**: `GET /api/notifications`, `PUT /api/notifications/read`
* **Events**: `onNotificationClick`, `onMarkAllRead`.
* **Permissions**: Authenticated Users.
* **Business Requirements**: Correctly trigger "Read" state update on DB when clicked.
* **UI Recommendations**: Distinction between read/unread states (bold text, blue dot), "Mark all as read" bulk action button.
