# Community API Contracts

## 1. Get Community Feed
**Endpoint**: `GET /api/community/feed`  
**Permission**: Public  
**Frontend Consumers**: `/community`, `CommunityFeedFilter`, `SocialTripCard`

### Request DTO
- Query params: `page` (int), `pageSize` (int), `filter` (TRENDING, RECENT, FOLLOWING)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "name": "Summer Trip",
      "author": {
        "id": 5,
        "fullName": "Jane Travel",
        "avatarUrl": "https://..."
      },
      "likesCount": 45,
      "clonesCount": 12,
      "createdAt": "2026-06-10T10:00:00Z"
    }
  ],
  "totalCount": 500,
  "page": 1,
  "pageSize": 10
}
```

### Validation
- `page`, `pageSize`: > 0.
- `filter`: VALID enum.

### Error Responses
*(None)*

---

## 2. Like a Trip
**Endpoint**: `POST /api/trips/{id}/like`  
**Permission**: `TRAVELER`  
**Frontend Consumers**: `/community`, `/trips/:id`, `SocialTripCard`

### Request DTO
*(None)*

### Response DTO
```json
{
  "liked": true,
  "likesCount": 46
}
```

### Validation
*(None)*

### Error Responses
- `401 Unauthorized`: Not logged in.
- `404 Not Found`: Trip not found.

---

## 3. Clone a Trip
**Endpoint**: `POST /api/trips/{id}/clone`  
**Permission**: `TRAVELER`  
**Frontend Consumers**: `/community`, `/trips/:id`, `SocialTripCard`

### Request DTO
```json
{
  "newStartDate": "2026-08-01"
}
```

### Response DTO
```json
{
  "newTripId": 102,
  "message": "Trip cloned successfully."
}
```

### Validation
- `newStartDate`: Required, future date.

### Error Responses
- `400 Bad Request`: Invalid dates.
- `401 Unauthorized`: Not logged in.
- `404 Not Found`: Original trip not found or private.

---

## 4. Get Blogs
**Endpoint**: `GET /api/blogs`  
**Permission**: Public  
**Frontend Consumers**: `/community/blogs`, `BlogFeedGrid`

### Request DTO
- Query params: `page` (int), `pageSize` (int), `search` (string)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "title": "Top 10 places in Hanoi",
      "summary": "Discover the best...",
      "author": {
        "id": 5,
        "fullName": "Jane Travel"
      },
      "thumbnailUrl": "https://...",
      "createdAt": "2026-06-01T10:00:00Z"
    }
  ],
  "totalCount": 120,
  "page": 1,
  "pageSize": 10
}
```

### Validation
- `page`, `pageSize`: > 0.

### Error Responses
*(None)*

---

## 5. Get Blog Details
**Endpoint**: `GET /api/blogs/{id}`  
**Permission**: Public  
**Frontend Consumers**: `/community/blogs/:id`, `BlogContentReader`

### Request DTO
*(None)*

### Response DTO
```json
{
  "id": 1,
  "title": "Top 10 places in Hanoi",
  "content": "<p>Discover the best...</p>",
  "author": {
    "id": 5,
    "fullName": "Jane Travel",
    "avatarUrl": "https://..."
  },
  "images": [],
  "likesCount": 50,
  "createdAt": "2026-06-01T10:00:00Z"
}
```

### Validation
*(None)*

### Error Responses
- `404 Not Found`: Blog not found.

---

## 6. Create Blog
**Endpoint**: `POST /api/blogs`  
**Permission**: `TRAVELER`  
**Frontend Consumers**: `/community/blogs/create`, `RichTextBlogEditor`

### Request DTO
```json
{
  "title": "My trip to Sapa",
  "content": "<p>It was cold but beautiful...</p>",
  "thumbnailUrl": "https://..."
}
```

### Response DTO
```json
{
  "id": 2,
  "message": "Blog created successfully."
}
```

### Validation
- `title`: Required, max 200 chars.
- `content`: Required.

### Error Responses
- `400 Bad Request`: Validation errors.
- `401 Unauthorized`: Not logged in.

---

## 7. Get Blog Comments
**Endpoint**: `GET /api/blogs/{id}/comments`  
**Permission**: Public  
**Frontend Consumers**: `/community/blogs/:id`, `CommentSection`

### Request DTO
- Query params: `page` (int), `pageSize` (int)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "userId": 10,
      "userName": "Bob",
      "content": "Great article!",
      "createdAt": "2026-06-02T10:00:00Z"
    }
  ],
  "totalCount": 15
}
```

### Validation
- `page`, `pageSize`: > 0.

### Error Responses
- `404 Not Found`: Blog not found.

---

## 8. Post Blog Comment
**Endpoint**: `POST /api/blogs/{id}/comments`  
**Permission**: `TRAVELER`  
**Frontend Consumers**: `/community/blogs/:id`, `CommentSection`

### Request DTO
```json
{
  "content": "Great article!"
}
```

### Response DTO
```json
{
  "id": 2,
  "message": "Comment added."
}
```

### Validation
- `content`: Required, max 500 chars.

### Error Responses
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`: Not logged in.
- `404 Not Found`: Blog not found.

---

## 9. Get Top Bloggers
**Endpoint**: `GET /api/community/top-bloggers`  
**Permission**: Public  
**Frontend Consumers**: `/community/blogs`, `TopBloggersSidebar`

### Request DTO
- Query params: `limit` (int)

### Response DTO
```json
{
  "items": [
    {
      "id": 5,
      "fullName": "Jane Travel",
      "avatarUrl": "https://...",
      "followersCount": 1200
    }
  ]
}
```

### Validation
- `limit`: > 0, default 5.

### Error Responses
*(None)*

---

## 10. Follow User
**Endpoint**: `POST /api/users/{id}/follow`  
**Permission**: Traveler  
**Frontend Consumers**: `/community/blogs`, `TopBloggersSidebar`

### Request DTO
*(None)*

### Response DTO
```json
{
  "following": true,
  "followersCount": 1201
}
```

### Validation
*(None)*

### Error Responses
- `400 Bad Request`: Cannot follow self.
- `401 Unauthorized`: Not logged in.
- `404 Not Found`: User to follow not found.
