# API Contract Coverage

| Catalog Route | Contract File | Status |
| :--- | :--- | :--- |
| **POST** `/api/auth/login` | `frontend-api-contracts/auth.md` | COVERED |
| **POST** `/api/auth/register` | `frontend-api-contracts/auth.md` | COVERED |
| **POST** `/api/auth/verify-otp` | `frontend-api-contracts/auth.md` | COVERED |
| **POST** `/api/auth/resend-otp` | `frontend-api-contracts/auth.md` | COVERED |
| **POST** `/api/auth/forgot-password` | `frontend-api-contracts/auth.md` | COVERED |
| **POST** `/api/auth/reset-password` | `frontend-api-contracts/auth.md` | COVERED |
| **GET** `/api/profile` | `frontend-api-contracts/auth.md` | COVERED |
| **PUT** `/api/profile` | `frontend-api-contracts/auth.md` | COVERED |
| **PUT** `/api/profile/password` | `frontend-api-contracts/auth.md` | COVERED |
| **POST** `/api/profile/avatar` | `frontend-api-contracts/auth.md` | COVERED |
| **GET** `/api/admin/users` | `frontend-api-contracts/admin.md` | COVERED |
| **PUT** `/api/admin/users/{id}/status` | `frontend-api-contracts/admin.md` | COVERED |
| **PUT** `/api/admin/users/{id}/role` | `frontend-api-contracts/admin.md` | COVERED |
| **GET** `/api/admin/stats` | `frontend-api-contracts/admin.md` | COVERED |
| **GET** `/api/admin/alerts` | `frontend-api-contracts/admin.md` | COVERED |
| **GET** `/api/admin/moderation` | `frontend-api-contracts/admin.md` | COVERED |
| **POST** `/api/admin/moderation/{id}/resolve`| `frontend-api-contracts/admin.md` | COVERED |
| **GET** `/api/admin/categories` | `frontend-api-contracts/admin.md` | COVERED |
| **POST** `/api/admin/categories` | `frontend-api-contracts/admin.md` | COVERED |
| **DELETE** `/api/admin/categories/{id}` | `frontend-api-contracts/admin.md` | COVERED |
| **GET** `/api/categories/regions` | `frontend-api-contracts/explore.md` | COVERED |
| **GET** `/api/categories/tags` | `frontend-api-contracts/explore.md` | COVERED |
| **GET** `/api/explore` | `frontend-api-contracts/explore.md` | COVERED |
| **GET** `/api/destinations/{id}` | `frontend-api-contracts/explore.md` | COVERED |
| **GET** `/api/destinations/{id}/services` | `frontend-api-contracts/explore.md` | COVERED |
| **GET** `/api/services/{id}` | `frontend-api-contracts/explore.md` | COVERED |
| **GET** `/api/services/{id}/reviews` | `frontend-api-contracts/explore.md` | COVERED |
| **POST** `/api/services/{id}/reviews` | `frontend-api-contracts/explore.md` | COVERED |
| **GET** `/api/trips` | `frontend-api-contracts/trip-planner.md` | COVERED |
| **POST** `/api/trips` | `frontend-api-contracts/trip-planner.md` | COVERED |
| **DELETE** `/api/trips/{id}` | `frontend-api-contracts/trip-planner.md` | COVERED |
| **GET** `/api/trips/{id}` | `frontend-api-contracts/trip-planner.md` | COVERED |
| **GET** `/api/trips/{id}/timeline` | `frontend-api-contracts/trip-planner.md` | COVERED |
| **PUT** `/api/trips/{id}/timeline` | `frontend-api-contracts/trip-planner.md` | COVERED |
| **GET** `/api/trips/{id}/collaborators`| `frontend-api-contracts/trip-planner.md` | COVERED |
| **POST** `/api/trips/{id}/collaborators`| `frontend-api-contracts/trip-planner.md` | COVERED |
| **GET** `/api/public/home/trending-destinations`| `frontend-api-contracts/home.md` | COVERED |
| **GET** `/api/public/home/trending-trips` | `frontend-api-contracts/home.md` | COVERED |
| **GET** `/api/traveler/dashboard/stats` | `frontend-api-contracts/home.md` | COVERED |
| **GET** `/api/trips/upcoming` | `frontend-api-contracts/home.md` | COVERED |
| **GET** `/api/notifications` | `frontend-api-contracts/home.md` | COVERED |
| **PUT** `/api/notifications/{id}/read` | `frontend-api-contracts/home.md` | COVERED |
| **GET** `/api/community/feed` | `frontend-api-contracts/community.md` | COVERED |
| **POST** `/api/trips/{id}/like` | `frontend-api-contracts/community.md` | COVERED |
| **POST** `/api/trips/{id}/clone` | `frontend-api-contracts/community.md` | COVERED |
| **GET** `/api/blogs` | `frontend-api-contracts/community.md` | COVERED |
| **GET** `/api/blogs/{id}` | `frontend-api-contracts/community.md` | COVERED |
| **POST** `/api/blogs` | `frontend-api-contracts/community.md` | COVERED |
| **GET** `/api/blogs/{id}/comments` | `frontend-api-contracts/community.md` | COVERED |
| **POST** `/api/blogs/{id}/comments` | `frontend-api-contracts/community.md` | COVERED |
| **GET** `/api/community/top-bloggers`| `frontend-api-contracts/community.md` | COVERED |
| **POST** `/api/users/{id}/follow` | `frontend-api-contracts/community.md` | COVERED |
| **POST** `/api/ai/generate` | `frontend-api-contracts/ai-assistant.md` | COVERED |
| **POST** `/api/ai/chat` | `frontend-api-contracts/ai-assistant.md` | COVERED |
| **POST** `/api/ai/optimize-route` | `frontend-api-contracts/ai-assistant.md` | COVERED |
| **POST** `/api/ai/analyze-budget` | `frontend-api-contracts/ai-assistant.md` | COVERED |
| **POST** `/api/provider/register` | `frontend-api-contracts/provider.md` | COVERED |
| **POST** `/api/provider/upload-docs` | `frontend-api-contracts/provider.md` | COVERED |
| **GET** `/api/provider/status` | `frontend-api-contracts/provider.md` | COVERED |
| **GET** `/api/provider/stats` | `frontend-api-contracts/provider.md` | COVERED |
| **GET** `/api/provider/services` | `frontend-api-contracts/provider.md` | COVERED |
| **POST** `/api/provider/services` | `frontend-api-contracts/provider.md` | COVERED |
| **PUT** `/api/provider/services/{id}`| `frontend-api-contracts/provider.md` | COVERED |
| **GET** `/api/provider/reviews` | `frontend-api-contracts/provider.md` | COVERED |
| **POST** `/api/provider/reviews/{id}/reply`| `frontend-api-contracts/provider.md` | COVERED |
| **GET** `/api/packages/provider` | `frontend-api-contracts/provider.md` | COVERED |
| **POST** `/api/provider/packages/subscribe-simulated`| `frontend-api-contracts/provider.md` | COVERED |
