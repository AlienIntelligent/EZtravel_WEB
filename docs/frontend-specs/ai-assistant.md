# AI Assistant Module Specifications

## AI Feature Relationship Matrix

This matrix clarifies the architectural relationship between AI features, distinguishing standalone applications from tools embedded into other host pages.

| Feature | Category | Host Page | Related DB Tables | Required Permission |
| :--- | :--- | :--- | :--- | :--- |
| **AI Trip Generator** | Standalone Page | `/ai/planner` | `LICH_SU_AI`, `LICH_TRINH` | `PREMIUM_TRAVELER` |
| **AI Chat Assistant** | Standalone Component | Persistent Drawer / `/ai/chat` | `LICH_SU_AI` | `PREMIUM_TRAVELER` |
| **AI Route Optimizer** | Embedded Tool | `/trips/:id/planner` | `LICH_SU_AI`, `DIA_DIEM_LICH_TRINH` | `PREMIUM_TRAVELER` (Editor) |
| **AI Budget Advisor** | Embedded Tool | `/trips/:id/planner` | `LICH_SU_AI`, `CHI_PHI_DICH_VU_LICH_TRINH`| `PREMIUM_TRAVELER` (Editor) |

---

## 1. AI Trip Generator Page
* **Route**: `/ai/planner`
* **Actor**: Premium Traveler
* **CRD Mapping**: 3.5.1
* **SRS Mapping**: Missing SRS
* **Database Mapping**: `LICH_SU_AI`, `LICH_TRINH`

### Validation Rules
* **Destination**: Required string.
* **Duration**: Required integer (1 to 30 days).
* **Budget Level**: Required enum (e.g., BUDGET, MODERATE, LUXURY).

### Desktop Layout
* Centered card layout (max-width: 600px) providing a focused, wizard-like experience. 
* Background features abstract, futuristic or travel-inspired subtle animations.

### Component Permission Matrix
| Action | Guest | Traveler (Free) | Premium Traveler |
| :--- | :--- | :--- | :--- |
| Access Generator | ❌ (Redirect) | ❌ (Redirect to Upgrade) | ✅ |
| Save Resulting Trip| ❌ | ❌ | ✅ |

### Embedded Component Inventory

#### `AIPromptWizard`
* **Purpose**: Collects natural language constraints and preferences to generate a trip.
* **Inputs**: `destination`, `durationDays`, `groupType`, `budgetLevel`, `interests`.
* **Outputs**: Generation API payload.
* **Required Data**: Pre-defined tag lists for interests.
* **Required APIs**: `GET /api/categories/tags`
* **Events**: `onSubmitPrompt`, `onWizardStepChange`.
* **Permissions**: `PREMIUM_TRAVELER`.
* **Business Requirements**: Log prompt token usage to `LICH_SU_AI` for tracking. Implement error handling for vague prompts.
* **UI Recommendations**: Multi-step wizard UI, clear "Generating..." loading state with engaging animations, "Surprise Me" template buttons.

#### `AIGenerationResults`
* **Purpose**: Presents the newly generated trip before saving it to the user's account.
* **Inputs**: `generatedTrip` (LICH_TRINH object from API).
* **Outputs**: Save trigger, Discard trigger.
* **Required Data**: Full output from the AI backend.
* **Required APIs**: `POST /api/ai/generate`, `POST /api/trips` (to save)
* **Events**: `onSaveToMyTrips`, `onDiscard`.
* **Permissions**: `PREMIUM_TRAVELER`.
* **Business Requirements**: Do not persist the trip to `LICH_TRINH` until the user explicitly saves it.
* **UI Recommendations**: High-level summary of the generated route, immediate transition into `/trips/:id/planner` upon save.

---

## 2. AI Chatbot Interface
* **Route**: `/ai/chat` (Persistent Drawer / Modal)
* **Actor**: Premium Traveler
* **CRD Mapping**: 3.5.4
* **SRS Mapping**: Missing SRS
* **Database Mapping**: `LICH_SU_AI`

### Validation Rules
* **Message**: Required, max 1000 characters.

### Desktop Layout
* Fixed positioning overlay (e.g., bottom-right floating button expanding into a 400px wide drawer). Allows users to browse other pages while chatting.

### Component Permission Matrix
| Action | Guest | Traveler (Free) | Premium Traveler |
| :--- | :--- | :--- | :--- |
| Open Chat Drawer | ❌ (Hidden) | ❌ (Shows Upgrade CTA) | ✅ |
| Send Message | ❌ | ❌ | ✅ |

### Embedded Component Inventory

#### `ChatConversationBox`
* **Purpose**: Primary conversational interface with the AI travel assistant.
* **Inputs**: `messageHistory` (Array).
* **Outputs**: User message strings.
* **Required Data**: Real-time websocket or polling data for AI responses.
* **Required APIs**: `POST /api/ai/chat`
* **Events**: `onSendMessage`, `onClearHistory`.
* **Permissions**: `PREMIUM_TRAVELER`.
* **Business Requirements**: Securely bind the chat context to the user's current session. Store history in local storage or backend for session continuity.
* **UI Recommendations**: Typing indicators, markdown rendering for AI responses, clear distinction between user and AI bubbles, sticky date/time headers.

#### `ContextActionPills`
* **Purpose**: Suggests quick actions or contextual prompts based on the user's current page (e.g., "Tell me more about this place").
* **Inputs**: `currentRoute` (string).
* **Outputs**: Selected prompt string.
* **Required Data**: Current application routing state.
* **Required APIs**: None.
* **Events**: `onPillClick`.
* **Permissions**: `PREMIUM_TRAVELER`.
* **Business Requirements**: Map specific app routes to relevant AI prompt templates.
* **UI Recommendations**: Horizontal scrolling list of pills above the chat input box, dynamic updates when the route changes.
