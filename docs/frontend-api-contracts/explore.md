# Explore API Contracts

## 1. Get Regions
**Endpoint**: `GET /api/categories/regions`  
**Permission**: Public  
**Frontend Consumers**: `/explore`, `SearchAndFilterBar`

### Request DTO
*(None)*

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "name": "Da Nang",
      "code": "DAD"
    }
  ]
}
```

### Validation
*(None)*

### Error Responses
*(None)*

---

## 2. Get Tags
**Endpoint**: `GET /api/categories/tags`  
**Permission**: Public  
**Frontend Consumers**: `/explore`, `SearchAndFilterBar`

### Request DTO
*(None)*

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "name": "Beach"
    }
  ]
}
```

### Validation
*(None)*

### Error Responses
*(None)*

---

## 3. Explore Destinations/Services
**Endpoint**: `GET /api/explore`  
**Permission**: Public  
**Frontend Consumers**: `/explore`, `DiscoveryGrid`

### Request DTO
- Query params: `query` (string), `regionId` (int), `tags` (int array), `type` (DESTINATION, SERVICE), `page` (int), `pageSize` (int)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "type": "DESTINATION",
      "name": "Ba Na Hills",
      "thumbnailUrl": "https://...",
      "rating": 4.8
    }
  ],
  "totalCount": 150,
  "page": 1,
  "pageSize": 20
}
```

### Validation
- `page`, `pageSize`: > 0.

### Error Responses
- `400 Bad Request`: Invalid filter parameters.

---

## 4. Get Destination Details
**Endpoint**: `GET /api/destinations/{id}`  
**Permission**: Public  
**Frontend Consumers**: `/explore/destinations/:id`, `DestinationHeader`

### Request DTO
*(None)*

### Response DTO
```json
{
  "id": 1,
  "name": "Ba Na Hills",
  "description": "A beautiful hill station...",
  "regionId": 1,
  "location": {
    "lat": 16.0,
    "lng": 108.0
  },
  "images": [
    "https://...",
    "https://..."
  ]
}
```

### Validation
*(None)*

### Error Responses
- `404 Not Found`: Destination not found.

---

## 5. Get Nearby Services
**Endpoint**: `GET /api/destinations/{id}/services`  
**Permission**: Public  
**Frontend Consumers**: `/explore/destinations/:id`, `NearbyServicesList`

### Request DTO
- Query params: `type` (HOTEL, RESTAURANT), `radiusKm` (float)

### Response DTO
```json
{
  "items": [
    {
      "id": 101,
      "name": "Mercure Ba Na Hills",
      "type": "HOTEL",
      "priceRange": "$$$",
      "rating": 4.5
    }
  ]
}
```

### Validation
- `radiusKm`: > 0.

### Error Responses
- `404 Not Found`: Destination not found.

---

## 6. Get Service Details
**Endpoint**: `GET /api/services/{id}`  
**Permission**: Public  
**Frontend Consumers**: `/explore/services/:id`, `ServiceInfoPanel`

### Request DTO
*(None)*

### Response DTO
```json
{
  "id": 101,
  "providerId": 50,
  "name": "Mercure Ba Na Hills",
  "description": "French village style hotel...",
  "type": "HOTEL",
  "price": 150.00,
  "location": {
    "lat": 16.0,
    "lng": 108.0
  },
  "images": [
    "https://..."
  ],
  "averageRating": 4.5,
  "totalReviews": 120
}
```

### Validation
*(None)*

### Error Responses
- `404 Not Found`: Service not found.

---

## 7. Get Service Reviews
**Endpoint**: `GET /api/services/{id}/reviews`  
**Permission**: Public  
**Frontend Consumers**: `/explore/services/:id`, `ReviewSection`

### Request DTO
- Query params: `page` (int), `pageSize` (int), `sort` (RECENT, HIGHEST, LOWEST)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "userId": 5,
      "userName": "Jane Doe",
      "rating": 5,
      "content": "Amazing stay!",
      "createdAt": "2026-06-01T10:00:00Z",
      "providerReply": {
        "content": "Thank you!",
        "createdAt": "2026-06-02T08:00:00Z"
      }
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
- `404 Not Found`: Service not found.

---

## 8. Post Service Review
**Endpoint**: `POST /api/services/{id}/reviews`  
**Permission**: `TRAVELER`  
**Frontend Consumers**: `/explore/services/:id`, `ReviewSection`

### Request DTO
```json
{
  "rating": 5,
  "content": "Amazing stay!",
  "images": [
    "https://..."
  ]
}
```

### Response DTO
```json
{
  "id": 2,
  "message": "Review submitted successfully."
}
```

### Validation
- `rating`: Integer between 1 and 5.
- `content`: Max 1000 chars.

### Error Responses
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`: Not logged in.
- `403 Forbidden`: User has already reviewed this service.
