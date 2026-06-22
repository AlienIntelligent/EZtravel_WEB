# Rejected Assumptions & Excluded Features

As per the governance rules and the strict requirement that every frontend feature must be fully traceable across the Database Schema, Business Requirements (CRD), and Software Requirements (SRS), the following features and assumptions have been **rejected** and will **not** be included in the frontend specifications. 

*Note: Features supported by the Database and CRD but missing from SRS (like AI Assistant, Travel Blog, and Premium Traveler) are NOT rejected, and are instead marked as `MISSING_SRS` in the system audit.*

## 1. Missing Database Coverage

Features that exist in requirements but lack underlying database support and therefore cannot be implemented.

### Discount Codes / Coupons (`MA_GIAM_GIA`)
* **Source:** CRD 3.7.4 (Admin manages discount codes), SRS UC 022 (Quản lý mã giảm giá).
* **Reason for Rejection:** The `schema_EZtravel.sql` file completely lacks a `MA_GIAM_GIA` table or any relation to discount codes on payments. Since the database is the ultimate source of truth, the frontend cannot implement discount code flows.
* **Status:** `MISSING_DB`
* **Resolution:** Excluded from the Admin module and Provider Payment flows.

## 2. Explicitly Out of Scope (CRD 7.2)

Features that are common in travel applications but have been explicitly forbidden by the business requirements.

### OTA Booking Engines
* **Source:** CRD 7.2 (Out of Scope).
* **Reason for Rejection:** The system does not support direct booking of hotels or flights. Providers only list services for reference and contact.
* **Status:** `OUT_OF_SCOPE`
* **Resolution:** No booking forms, "Book Now" buttons, or reservation management dashboards will be designed.

### Provider Inventory Management
* **Source:** CRD 7.2 (Out of Scope).
* **Reason for Rejection:** The system does not track room availability or ticket counts for providers.
* **Status:** `OUT_OF_SCOPE`
* **Resolution:** No inventory inputs in the Provider service creation forms or availability calendars.

### Real Payment Gateways
* **Source:** CRD 7.2 (Out of Scope).
* **Reason for Rejection:** The system must use a simulation gateway instead of real VNPAY/Momo integration.
* **Status:** `OUT_OF_SCOPE`
* **Resolution:** Frontend payment flows for Provider Promotions will mock the payment success/failure state without requiring real API integrations.
