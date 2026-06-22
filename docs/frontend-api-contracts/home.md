# Home API Contracts

## 1. Get Trending Destinations
**Endpoint**: `GET /api/public/home/trending-destinations`  
**Permission**: Public  
**Frontend Consumers**: `/`, `TrendingDestinationsCarousel`

### Request DTO
- Query params: `limit` (int)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "name": "Da Nang",
      "thumbnailUrl": "https://...",
      "popularityScore": 98.5
    }
  ]
}
```

### Validation
- `limit`: > 0, default 10.

### Error Responses
*(None)*

---

## 2. Get Trending Trips
**Endpoint**: `GET /api/public/home/trending-trips`  
**Permission**: Public  
**Frontend Consumers**: `/`, `PublicTripsGrid`

### Request DTO
- Query params: `limit` (int)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "name": "Central Vietnam 5 Days",
      "author": {
        "id": 5,
        "fullName": "Jane Travel",
        "avatarUrl": "https://..."
      },
      "likesCount": 120,
      "coverImageUrl": "https://..."
    }
  ]
}
```

### Validation
- `limit`: > 0, default 10.

### Error Responses
*(None)*

---

## 3. Get Dashboard Stats
**Endpoint**: `GET /api/traveler/dashboard/stats`  
**Permission**: `TRAVELER`  
**Frontend Consumers**: `/dashboard`, `DashboardStats`

### Request DTO
*(None)*

### Response DTO
```json
{
  "totalTrips": 5,
  "upcomingTrips": 2,
  "savedPlaces": 15,
  "unreadNotifications": 3
}
```

### Validation
*(None)*

### Error Responses
- `401 Unauthorized`: Not logged in.

---

## 4. Get Upcoming Trips
**Endpoint**: `GET /api/trips/upcoming`  
**Permission**: `TRAVELER`  
**Frontend Consumers**: `/dashboard`, `UpcomingScheduleWidget`

### Request DTO
- Query params: `limit` (int)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "name": "Summer in Da Nang",
      "startDate": "2026-07-01",
      "daysUntil": 18
    }
  ]
}
```

### Validation
- `limit`: > 0.

### Error Responses
- `401 Unauthorized`: Not logged in.

---

## 5. Get Notifications
**Endpoint**: `GET /api/notifications`  
**Permission**: Traveler  
**Frontend Consumers**: `/notifications`, `NotificationList`

### Request DTO
- Query params: `page` (int), `pageSize` (int), `unreadOnly` (boolean)

### Response DTO
```json
{
  "items": [
    {
      "id": 1001,
      "type": "TRIP_INVITE",
      "message": "Jane invited you to a trip.",
      "isRead": false,
      "createdAt": "2026-06-12T08:00:00Z",
      "targetUrl": "/trips/1/planner"
    }
  ],
  "totalCount": 25,
  "page": 1,
  "pageSize": 20
}
```

### Validation
- `page`, `pageSize`: > 0.

### Error Responses
- `401 Unauthorized`: Not logged in.

---

## 6. Mark Notification as Read
**Endpoint**: `PUT /api/notifications/{id}/read`  
**Permission**: Auth  
**Frontend Consumers**: `/notifications`, `NotificationList`

### Request DTO
*(None)*

### Response DTO
```json
{
  "message": "Notification marked as read."
}
```

### Validation
*(None)*

### Error Responses
- `401 Unauthorized`: Not logged in.
- `404 Not Found`: Notification not found or not owned by user.
