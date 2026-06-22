# Admin API Contracts

## 1. Get Users
**Endpoint**: `GET /api/admin/users`  
**Permission**: `ADMIN`  
**Frontend Consumers**: `/admin/users`, `UserDirectoryTable`

### Request DTO
- Query params: `page` (int), `pageSize` (int), `search` (string), `role` (string), `status` (string)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "TRAVELER",
      "status": "ACTIVE",
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "totalCount": 100,
  "page": 1,
  "pageSize": 20
}
```

### Validation
- `page`, `pageSize`: > 0

### Error Responses
- `401 Unauthorized`: Not logged in.
- `403 Forbidden`: Insufficient role.

---

## 2. Update User Status
**Endpoint**: `PUT /api/admin/users/{id}/status`  
**Permission**: `ADMIN`  
**Frontend Consumers**: `/admin/users`, `UserDirectoryTable`

### Request DTO
```json
{
  "status": "SUSPENDED",
  "reason": "Violating terms"
}
```

### Response DTO
```json
{
  "message": "User status updated successfully."
}
```

### Validation
- `status`: Valid enum value (`ACTIVE`, `SUSPENDED`, `BANNED`).
- `reason`: Optional string.

### Error Responses
- `400 Bad Request`: Invalid status.
- `404 Not Found`: User ID not found.

---

## 3. Update User Role
**Endpoint**: `PUT /api/admin/users/{id}/role`  
**Permission**: `ADMIN`  
**Frontend Consumers**: `/admin/users`, `UserDirectoryTable`

### Request DTO
```json
{
  "role": "MODERATOR"
}
```

### Response DTO
```json
{
  "message": "User role updated successfully."
}
```

### Validation
- `role`: Valid enum value (`TRAVELER`, `PROVIDER`, `MODERATOR`, `ADMIN`).

### Error Responses
- `400 Bad Request`: Invalid role.
- `404 Not Found`: User ID not found.

---

## 4. Get System Stats
**Endpoint**: `GET /api/admin/stats`  
**Permission**: `ADMIN`  
**Frontend Consumers**: `/admin/dashboard`, `SystemAnalyticsGrid`

### Request DTO
- Query params: `startDate` (ISO8601), `endDate` (ISO8601)

### Response DTO
```json
{
  "totalUsers": 5000,
  "totalTrips": 12000,
  "activeSubscriptions": 450,
  "aiGenerations": 8900
}
```

### Validation
- `startDate` <= `endDate`

### Error Responses
- `400 Bad Request`: Invalid dates.

---

## 5. Get Alerts
**Endpoint**: `GET /api/admin/alerts`  
**Permission**: `ADMIN`  
**Frontend Consumers**: `/admin/dashboard`, `PendingActionAlerts`

### Request DTO
*(None)*

### Response DTO
```json
{
  "pendingReports": 24,
  "pendingProviders": 12,
  "systemAlerts": [
    {
      "id": 1,
      "message": "High AI API usage detected",
      "severity": "WARNING"
    }
  ]
}
```

### Validation
*(None)*

### Error Responses
- `403 Forbidden`: Insufficient role.

---

## 6. Get Moderation Queue
**Endpoint**: `GET /api/admin/moderation`  
**Permission**: `ADMIN`  
**Frontend Consumers**: `/admin/moderation`, `ModerationWorkspace`

### Request DTO
- Query params: `type` (REPORT, PROVIDER), `page` (int), `pageSize` (int)

### Response DTO
```json
{
  "items": [
    {
      "id": 101,
      "type": "REPORT",
      "targetId": 55,
      "description": "Inappropriate content",
      "submittedBy": 12,
      "createdAt": "2026-06-10T12:00:00Z"
    }
  ],
  "totalCount": 36
}
```

### Validation
- `type`: Optional filter.

### Error Responses
- `403 Forbidden`: Insufficient role.

---

## 7. Resolve Moderation Action
**Endpoint**: `POST /api/admin/moderation/{id}/resolve`  
**Permission**: `ADMIN`  
**Frontend Consumers**: `/admin/moderation`, `ModerationWorkspace`

### Request DTO
```json
{
  "action": "APPROVE",
  "notes": "Looks fine after review."
}
```

### Response DTO
```json
{
  "message": "Moderation item resolved."
}
```

### Validation
- `action`: Valid enum (`APPROVE`, `REJECT`, `DISMISS`).

### Error Responses
- `400 Bad Request`: Invalid action.
- `404 Not Found`: Moderation ID not found.

---

## 8. Get Categories
**Endpoint**: `GET /api/admin/categories`  
**Permission**: `ADMIN`  
**Frontend Consumers**: `/admin/categories`, `MasterDataManager`

### Request DTO
- Query params: `type` (REGION, TAG)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "name": "Mountain",
      "type": "TAG",
      "isActive": true
    }
  ]
}
```

### Validation
- `type`: Optional enum.

### Error Responses
- `403 Forbidden`: Insufficient role.

---

## 9. Create/Update Category
**Endpoint**: `POST /api/admin/categories`  
**Permission**: `ADMIN`  
**Frontend Consumers**: `/admin/categories`, `MasterDataManager`

### Request DTO
```json
{
  "id": null,
  "name": "Beach",
  "type": "TAG",
  "isActive": true
}
```

### Response DTO
```json
{
  "id": 2,
  "name": "Beach",
  "type": "TAG",
  "isActive": true
}
```

### Validation
- `name`: Required, max 50 chars.
- `type`: Required enum.

### Error Responses
- `400 Bad Request`: Validation failure.

---

## 10. Delete Category
**Endpoint**: `DELETE /api/admin/categories/{id}`  
**Permission**: `ADMIN`  
**Frontend Consumers**: `/admin/categories`, `MasterDataManager`

### Request DTO
*(None)*

### Response DTO
```json
{
  "message": "Category deleted."
}
```

### Validation
*(None)*

### Error Responses
- `404 Not Found`: Category ID not found.
- `409 Conflict`: Category is currently in use.
