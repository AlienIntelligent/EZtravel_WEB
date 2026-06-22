# Provider API Contracts

## 1. Register Business
**Endpoint**: `POST /api/provider/register`  
**Permission**: `TRAVELER`  
**Frontend Consumers**: `/provider/registration`, `BusinessRegistrationForm`

### Request DTO
```json
{
  "businessName": "ABC Tours",
  "businessType": "AGENCY",
  "contactEmail": "contact@abctours.com",
  "contactPhone": "123456789"
}
```

### Response DTO
```json
{
  "providerId": 10,
  "message": "Registration submitted. Awaiting document upload."
}
```

### Validation
- `businessName`: Required.
- `businessType`: Required enum.

### Error Responses
- `400 Bad Request`: Validation failure.
- `401 Unauthorized`: Not logged in.

---

## 2. Upload Business Documents
**Endpoint**: `POST /api/provider/upload-docs`  
**Permission**: `TRAVELER` (Applying to be Provider)  
**Frontend Consumers**: `/provider/registration`, `BusinessRegistrationForm`

### Request DTO
*(Multipart form-data)*
- `license`: PDF or Image file.
- `idCard`: PDF or Image file.

### Response DTO
```json
{
  "message": "Documents uploaded successfully. Application under review."
}
```

### Validation
- File size limit: 10MB per file.

### Error Responses
- `400 Bad Request`: Invalid file format or size.

---

## 3. Get Provider Application Status
**Endpoint**: `GET /api/provider/status`  
**Permission**: Provider Pending  
**Frontend Consumers**: `/provider/pending`, `PendingStatusView`

### Request DTO
*(None)*

### Response DTO
```json
{
  "status": "PENDING_REVIEW",
  "submittedAt": "2026-06-10T10:00:00Z",
  "notes": "Awaiting admin approval."
}
```

### Validation
*(None)*

### Error Responses
- `403 Forbidden`: Not applied yet.

---

## 4. Get Provider Stats
**Endpoint**: `GET /api/provider/stats`  
**Permission**: Provider Approved  
**Frontend Consumers**: `/provider/dashboard`, `ProviderKPIWidget`

### Request DTO
*(None)*

### Response DTO
```json
{
  "totalServices": 5,
  "activeBookings": 12,
  "averageRating": 4.8,
  "monthlyRevenue": 5000.0
}
```

### Validation
*(None)*

### Error Responses
- `403 Forbidden`: Account not approved.

---

## 5. Get Provider Services
**Endpoint**: `GET /api/provider/services`  
**Permission**: Provider Approved  
**Frontend Consumers**: `/provider/services`, `ServicesDataTable`

### Request DTO
- Query params: `page` (int), `pageSize` (int)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "name": "City Tour",
      "type": "TOUR",
      "price": 50.0,
      "isActive": true
    }
  ],
  "totalCount": 5
}
```

### Validation
- `page`, `pageSize`: > 0.

### Error Responses
- `403 Forbidden`: Account not approved.

---

## 6. Create Service
**Endpoint**: `POST /api/provider/services`  
**Permission**: Provider Approved  
**Frontend Consumers**: `/provider/services/create`, `ServiceEditorForm`

### Request DTO
```json
{
  "name": "City Tour",
  "type": "TOUR",
  "price": 50.0,
  "description": "A wonderful city tour..."
}
```

### Response DTO
```json
{
  "id": 2,
  "message": "Service created successfully."
}
```

### Validation
- `name`: Required.
- `price`: >= 0.

### Error Responses
- `400 Bad Request`: Validation errors.
- `403 Forbidden`: Account not approved.

---

## 7. Edit Service
**Endpoint**: `PUT /api/provider/services/{id}`  
**Permission**: Provider Approved  
**Frontend Consumers**: `/provider/services/:id/edit`, `ServiceEditorForm`

### Request DTO
```json
{
  "name": "Updated City Tour",
  "price": 60.0
}
```

### Response DTO
```json
{
  "message": "Service updated successfully."
}
```

### Validation
- `price`: >= 0.

### Error Responses
- `400 Bad Request`: Validation errors.
- `403 Forbidden`: Account not approved.
- `404 Not Found`: Service not found or does not belong to provider.

---

## 8. Get Provider Reviews
**Endpoint**: `GET /api/provider/reviews`  
**Permission**: `APPROVED`  
**Frontend Consumers**: `/provider/reviews`, `ReviewInbox`

### Request DTO
- Query params: `page` (int), `pageSize` (int)

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "serviceName": "City Tour",
      "rating": 5,
      "content": "Excellent!",
      "createdAt": "2026-06-01T10:00:00Z"
    }
  ]
}
```

### Validation
- `page`, `pageSize`: > 0.

### Error Responses
- `403 Forbidden`: Account not approved.

---

## 9. Reply to Review
**Endpoint**: `POST /api/provider/reviews/{id}/reply`  
**Permission**: `APPROVED`  
**Frontend Consumers**: `/provider/reviews`, `ReviewInbox`

### Request DTO
```json
{
  "content": "Thank you for joining our tour!"
}
```

### Response DTO
```json
{
  "message": "Reply posted."
}
```

### Validation
- `content`: Required, max 500 chars.

### Error Responses
- `400 Bad Request`: Validation failure.
- `403 Forbidden`: Not authorized.
- `404 Not Found`: Review not found.

---

## 10. Get Provider Packages
**Endpoint**: `GET /api/packages/provider`  
**Permission**: `APPROVED`  
**Frontend Consumers**: `/provider/packages`, `PackagePricingTable`

### Request DTO
*(None)*

### Response DTO
```json
{
  "items": [
    {
      "id": 1,
      "name": "Pro Plan",
      "price": 99.0,
      "features": ["Priority Support", "Featured Listing"]
    }
  ]
}
```

### Validation
*(None)*

### Error Responses
- `403 Forbidden`: Account not approved.

---

## 11. Subscribe to Package (Simulated)
**Endpoint**: `POST /api/provider/packages/subscribe-simulated`  
**Permission**: `APPROVED`  
**Frontend Consumers**: `/provider/packages`, `SimulatedCheckoutForm`

### Request DTO
```json
{
  "packageId": 1,
  "paymentMethod": "CREDIT_CARD"
}
```

### Response DTO
```json
{
  "transactionId": "txn_123456",
  "status": "SUCCESS",
  "message": "Subscription active."
}
```

### Validation
- `packageId`: Valid package ID.
- `paymentMethod`: Required enum.

### Error Responses
- `400 Bad Request`: Invalid payment info.
- `403 Forbidden`: Account not approved.
