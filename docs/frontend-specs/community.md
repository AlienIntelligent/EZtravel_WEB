# Community Module Specifications

## 1. Community Trips Feed
* **Route**: `/community`
* **Actor**: Guest, Traveler
* **CRD Mapping**: 3.4.1, 3.4.2
* **SRS Mapping**: UC 014, UC 015
* **Database Mapping**: `LICH_TRINH`, `THICH_LICH_TRINH`, `LICH_SU_CLONE`

### Validation Rules
* **Filters**: Maximum 30 days for duration filter, valid enums for sorting.

### Desktop Layout
* 2-column layout. Left column (25%) sticky sidebar for `CommunityFeedFilter`. Right column (75%) masonry grid of `SocialTripCard`s.

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Feed | ✅ | ✅ | ✅ | ✅ |
| Like Trip | ❌ (Redirect) | ✅ | ✅ | ✅ |
| Clone Trip| ❌ (Redirect) | ✅ | ✅ | ✅ |

### Embedded Component Inventory

#### `CommunityFeedFilter`
* **Purpose**: Allows filtering of the public trips feed.
* **Inputs**: `sortBy` (enum: NEWEST, POPULAR), `duration` (number).
* **Outputs**: Updated feed parameters.
* **Required Data**: None.
* **Required APIs**: (No specific API, just updates query params for the feed request).
* **Events**: `onFilterChange`.
* **Permissions**: Public.
* **Business Requirements**: Retain filter state in URL query parameters for shareability.
* **UI Recommendations**: Simple UI for quick sorting, tag-based filtering pills.

#### `SocialTripCard`
* **Purpose**: A visually rich card displaying a public trip in the feed.
* **Inputs**: `trip` (LICH_TRINH object), `isLiked` (boolean).
* **Outputs**: Navigation, Like API trigger.
* **Required Data**: Interaction stats (likes, clones), Author info.
* **Required APIs**: `POST /api/trips/:id/like`, `POST /api/trips/:id/clone`
* **Events**: `onCardClick`, `onLikeToggle`, `onCloneClick`.
* **Permissions**: View (Public), Interact (Auth).
* **Business Requirements**: Clone must deep-copy the trip to the user's account.
* **UI Recommendations**: Heart icon with like count, clone icon with clone count, prominent cover image, hover state showing day-by-day summary snippet.

---

## 2. Blog Feed
* **Route**: `/community/blogs`
* **Actor**: Guest, Traveler
* **CRD Mapping**: 3.4.3
* **SRS Mapping**: Missing SRS
* **Database Mapping**: `BAI_VIET`, `THICH_BAI_VIET`

### Validation Rules
* None for viewing list.

### Desktop Layout
* 3-column masonry grid for `BlogFeedGrid`. Right sidebar for `TopBloggersSidebar`.

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Feed | ✅ | ✅ | ✅ | ✅ |
| Follow Blogger | ❌ (Redirect) | ✅ | ✅ | ✅ |

### Embedded Component Inventory

#### `BlogFeedGrid`
* **Purpose**: Displays a masonry or grid layout of travel blog posts.
* **Inputs**: `posts` (Array of BAI_VIET).
* **Outputs**: Navigation to detail page.
* **Required Data**: Paginated blog post list.
* **Required APIs**: `GET /api/blogs`
* **Events**: `onPostClick`.
* **Permissions**: Public.
* **Business Requirements**: Infinite scroll pagination.
* **UI Recommendations**: Clean typography, robust lazy-loading of cover images, author avatar embedded in card.

#### `TopBloggersSidebar`
* **Purpose**: Highlights active content creators in the community.
* **Inputs**: None.
* **Outputs**: Navigation to user profiles.
* **Required Data**: Top users based on `THEO_DOI_NGUOI_DUNG` counts.
* **Required APIs**: `GET /api/community/top-bloggers`, `POST /api/users/:id/follow`
* **Events**: `onFollowClick`.
* **Permissions**: View (Public), Follow (Auth).
* **Business Requirements**: Verify follow state accurately.
* **UI Recommendations**: "Follow" button state management, small badge indicating verified/expert status.

---

## 3. Blog Detail Page
* **Route**: `/community/blogs/:id`
* **Actor**: Guest, Traveler
* **CRD Mapping**: 3.4.3, 3.4.4
* **SRS Mapping**: Missing SRS
* **Database Mapping**: `BAI_VIET`, `BINH_LUAN_BAI_VIET`, `THICH_BAI_VIET`, `ANH_BAI_VIET`

### Validation Rules
* **Post ID**: Must be valid integer.
* **Comment**: Max 2000 characters, no malicious scripts.

### Desktop Layout
* Centered reading column (max-width: 800px) to optimize reading length. Left sticky column for sharing/likes. Right sticky column for Table of Contents.
* Comments section full width below the article.

### Component Permission Matrix
| Action | Guest | Traveler | Admin |
| :--- | :--- | :--- | :--- |
| Read Post | ✅ | ✅ | ✅ |
| Like Post | ❌ (Redirect)| ✅ | ✅ |
| Add Comment | ❌ (Redirect)| ✅ | ✅ |
| Delete Comment | ❌ | ✅ (If Author) | ✅ (Moderator) |

### Embedded Component Inventory

#### `BlogContentReader`
* **Purpose**: Primary reading interface for a blog post.
* **Inputs**: `post` (BAI_VIET object).
* **Outputs**: None.
* **Required Data**: Full HTML/Markdown content of the post, associated `ANH_BAI_VIET`.
* **Required APIs**: `GET /api/blogs/:id`
* **Events**: None.
* **Permissions**: Public.
* **Business Requirements**: Render sanitized HTML to prevent XSS.
* **UI Recommendations**: Distraction-free reading layout, typography optimized for long-form reading, responsive image galleries, table of contents.

#### `CommentSection`
* **Purpose**: Allows users to discuss the blog post.
* **Inputs**: `postId` (number).
* **Outputs**: Add Comment API payload.
* **Required Data**: Nested list of `BINH_LUAN_BAI_VIET`.
* **Required APIs**: `GET /api/blogs/:id/comments`, `POST /api/blogs/:id/comments`
* **Events**: `onSubmitComment`, `onReplyComment`.
* **Permissions**: View (Public), Write (Auth).
* **Business Requirements**: Truncate extremely long comment threads.
* **UI Recommendations**: Deeply nested or 1-level reply threading, timestamp formatting, mentions (@username) support.

---

## 4. Create Blog Post
* **Route**: `/community/blogs/create`
* **Actor**: Traveler
* **CRD Mapping**: 3.4.3
* **SRS Mapping**: Missing SRS
* **Database Mapping**: `BAI_VIET`, `ANH_BAI_VIET`

### Validation Rules
* **Title**: Required, max 200 characters.
* **Content**: Required, min 100 characters.
* **Cover Image**: Required, valid image format (JPG, PNG).

### Desktop Layout
* Full screen distraction-free editor. Minimal header with "Save Draft" and "Publish" buttons. 

### Component Permission Matrix
| Action | Guest | Traveler | Admin |
| :--- | :--- | :--- | :--- |
| Access Editor | ❌ (Redirect) | ✅ | ✅ |
| Publish Post | ❌ | ✅ | ✅ |

### Embedded Component Inventory

#### `RichTextBlogEditor`
* **Purpose**: Workspace for drafting and publishing travel stories.
* **Inputs**: Form data (Title, Content, Tags, CoverImage).
* **Outputs**: Create Blog API payload.
* **Required Data**: None.
* **Required APIs**: `POST /api/blogs`, `POST /api/blogs/upload-image`
* **Events**: `onSaveDraft`, `onPublish`, `onImageUpload`.
* **Permissions**: `TRAVELER`.
* **Business Requirements**: Auto-save drafts to prevent data loss.
* **UI Recommendations**: WYSIWYG editor (e.g., TipTap/Quill), inline image upload handling, cover image selection tool.
