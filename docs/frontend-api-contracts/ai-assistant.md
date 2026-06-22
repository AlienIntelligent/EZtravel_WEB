# AI Assistant API Contracts

## 1. Generate Trip
**Endpoint**: `POST /api/ai/generate`  
**Permission**: Premium Traveler  
**Frontend Consumers**: `/ai/planner`, `AIPromptWizard`, `AIGenerationResults`

### Request DTO
```json
{
  "prompt": "I want a 3-day relaxing trip to Da Nang for a family of 4, budget friendly.",
  "preferences": {
    "pace": "RELAXED",
    "budget": "BUDGET"
  }
}
```

### Response DTO
```json
{
  "tripPlan": {
    "name": "Relaxing Family Trip to Da Nang",
    "days": [
      {
        "dateOffset": 1,
        "activities": [
          {
            "name": "My Khe Beach",
            "timeSlot": "MORNING"
          }
        ]
      }
    ]
  }
}
```

### Validation
- `prompt`: Required, min 10 chars.
- `preferences`: Optional.

### Error Responses
- `400 Bad Request`: Prompt too short.
- `401 Unauthorized`: Not logged in.
- `403 Forbidden`: User does not have a premium subscription.
- `429 Too Many Requests`: Rate limit exceeded for AI generation.

---

## 2. Chat with AI
**Endpoint**: `POST /api/ai/chat`  
**Permission**: Premium Traveler  
**Frontend Consumers**: `/ai/chat`, `ChatConversationBox`

### Request DTO
```json
{
  "message": "What is the best time to visit Sapa?",
  "historyContext": []
}
```

### Response DTO
```json
{
  "reply": "The best time to visit Sapa is from September to November...",
  "suggestedActions": ["View Sapa destinations", "Create Sapa trip"]
}
```

### Validation
- `message`: Required, max 500 chars.

### Error Responses
- `400 Bad Request`: Empty message.
- `401 Unauthorized`: Not logged in.
- `403 Forbidden`: Premium required.

---

## 3. Optimize Route
**Endpoint**: `POST /api/ai/optimize-route`  
**Permission**: Premium Traveler  
**Frontend Consumers**: `/trips/:id/planner`, `AIRouteOptimizerWidget`

### Request DTO
```json
{
  "tripId": 1,
  "destinationsList": [
    {"id": 1, "lat": 16.0, "lng": 108.0},
    {"id": 2, "lat": 16.1, "lng": 108.1}
  ]
}
```

### Response DTO
```json
{
  "optimizedOrder": [1, 2],
  "estimatedTravelTimeMinutes": 45,
  "savingsEstimation": "15 mins"
}
```

### Validation
- `tripId`: Required.
- `destinationsList`: Array of min 2 items.

### Error Responses
- `400 Bad Request`: Less than 2 destinations provided.
- `401 Unauthorized`: Not logged in.
- `403 Forbidden`: Premium required.

---

## 4. Analyze Budget
**Endpoint**: `POST /api/ai/analyze-budget`  
**Permission**: Premium Traveler  
**Frontend Consumers**: `/trips/:id/planner`, `AIBudgetAdvisorWidget`

### Request DTO
```json
{
  "tripId": 1,
  "budgetLimit": 500.0,
  "items": [
    {"name": "Hotel", "cost": 300.0},
    {"name": "Food", "cost": 150.0}
  ]
}
```

### Response DTO
```json
{
  "status": "ON_TRACK",
  "totalEstimated": 450.0,
  "recommendations": [
    "You have $50 left for emergencies."
  ]
}
```

### Validation
- `budgetLimit`: > 0.
- `items`: Valid array of cost items.

### Error Responses
- `400 Bad Request`: Invalid inputs.
- `401 Unauthorized`: Not logged in.
- `403 Forbidden`: Premium required.
