# Trip Planner API Contracts

## 1. Get My Trips
**Endpoint**: `GET /api/trips`  
**Permission**: `TRAVELER`  
**Frontend Consumers**: `/trips`, `TripsListManager`

### Request DTO
- Query params: `page` (int), `pageSize` (int), `status` (UPCOMING, PAST, DRAFT)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "name": "Summer in Da Nang",
      "startDate": "2026-07-01",
      "endDate": "2026-07-05",
      "status": "UPCOMING",
      "coverImageUrl": "https://...",
      "role": "OWNER"
    }
  ],
  "totalCount": 5,
  "page": 1,
  "pageSize": 10
}
```

### Validation
- `page`, `pageSize`: > 0.

### Error Responses
- `401 Unauthorized`: Not logged in.

---

## 2. Create Trip
**Endpoint**: `POST /api/trips`  
**Permission**: `TRAVELER`  
**Frontend Consumers**: `/trips/create`, `TripsListManager`

### Request DTO
```json
{
  "name": "Summer in Da Nang",
  "startDate": "2026-07-01",
  "endDate": "2026-07-05",
  "destinationIds": [1, 2]
}
```

### Response DTO
```json
{
  "id": 1,
  "message": "Trip created successfully."
}
```

### Validation
- `name`: Required, max 100 chars.
- `startDate` <= `endDate`.

### Error Responses
- `400 Bad Request`: Invalid dates or missing name.
- `401 Unauthorized`: Not logged in.

---

## 3. Delete Trip
**Endpoint**: `DELETE /api/trips/{id}`  
**Permission**: `TRAVELER`  
**Frontend Consumers**: `/trips`, `TripsListManager`

### Request DTO
*(None)*

### Response DTO
```json
{
  "message": "Trip deleted."
}
```

### Validation
*(None)*

### Error Responses
- `401 Unauthorized`: Not logged in.
- `403 Forbidden`: User is not the owner of the trip.
- `404 Not Found`: Trip not found.

---

## 4. Get Trip Summary
**Endpoint**: `GET /api/trips/{id}`  
**Permission**: Auth/Pub (Depends on trip visibility settings)  
**Frontend Consumers**: `/trips/:id`, `TripSummaryHeader`

### Request DTO
*(None)*

### Response DTO
```json
{
  "id": 1,
  "name": "Summer in Da Nang",
  "startDate": "2026-07-01",
  "endDate": "2026-07-05",
  "visibility": "PRIVATE",
  "destinations": [
    {
      "id": 1,
      "name": "Da Nang"
    }
  ]
}
```

### Validation
*(None)*

### Error Responses
- `401 Unauthorized`: Authentication required for private trip.
- `403 Forbidden`: User does not have access.
- `404 Not Found`: Trip not found.

---

## 5. Get Trip Timeline
**Endpoint**: `GET /api/trips/{id}/timeline`  
**Permission**: Auth/Pub  
**Frontend Consumers**: `/trips/:id`, `/trips/:id/planner`, `InteractiveTimelineManager`, `TripTimelineView`

### Request DTO
*(None)*

### Response DTO
```json
{
  "days": [
    {
      "date": "2026-07-01",
      "activities": [
        {
          "id": 10,
          "type": "DESTINATION",
          "targetId": 1,
          "name": "Ba Na Hills",
          "startTime": "08:00",
          "endTime": "12:00",
          "estimatedCost": 50.0
        }
      ]
    }
  ]
}
```

### Validation
*(None)*

### Error Responses
- `403 Forbidden`: Access denied.
- `404 Not Found`: Trip not found.

---

## 6. Update Trip Timeline
**Endpoint**: `PUT /api/trips/{id}/timeline`  
**Permission**: `TRAVELER` (Owner or Collaborator with write access)  
**Frontend Consumers**: `/trips/:id/planner`, `InteractiveTimelineManager`

### Request DTO
```json
{
  "days": [
    {
      "date": "2026-07-01",
      "activities": [
        {
          "type": "DESTINATION",
          "targetId": 1,
          "startTime": "08:00",
          "endTime": "12:00",
          "estimatedCost": 50.0
        }
      ]
    }
  ]
}
```

### Response DTO
```json
{
  "message": "Timeline updated successfully."
}
```

### Validation
- Valid activity objects.
- `startTime` < `endTime`.

### Error Responses
- `400 Bad Request`: Validation failure.
- `403 Forbidden`: Write access denied.

---

## 7. Get Trip Collaborators
**Endpoint**: `GET /api/trips/{id}/collaborators`  
**Permission**: `TRAVELER` (Owner)  
**Frontend Consumers**: `/trips/:id/planner`, `CollaboratorSettingsModal`

### Request DTO
*(None)*

### Response DTO
```json
{
  "items": [
    {
      "userId": 2,
      "email": "friend@example.com",
      "fullName": "Friend",
      "role": "EDITOR"
    }
  ]
}
```

### Validation
*(None)*

### Error Responses
- `403 Forbidden`: Not owner of the trip.
- `404 Not Found`: Trip not found.

---

## 8. Update Trip Collaborators
**Endpoint**: `POST /api/trips/{id}/collaborators`  
**Permission**: `TRAVELER` (Owner)  
**Frontend Consumers**: `/trips/:id/planner`, `CollaboratorSettingsModal`

### Request DTO
```json
{
  "email": "friend@example.com",
  "role": "EDITOR"
}
```

### Response DTO
```json
{
  "message": "Collaborator added successfully."
}
```

### Validation
- `email`: Valid email format.
- `role`: `EDITOR` or `VIEWER`.

### Error Responses
- `400 Bad Request`: User already a collaborator.
- `403 Forbidden`: Not owner of the trip.
- `404 Not Found`: User email not found.
