# EZtravel Provider Dashboard - Service Provider (NCC) Pages

## Overview

This directory contains the Service Provider (NCC) dashboard pages for EZtravel, designed following the blueprint of modern merchant/extranet systems like Airbnb Host, Booking Extranet, and Agoda Partner Hub.

## Database Mapping

The pages are designed to work with the existing EZtravel database structure:

### Available Tables (Currently Used)
- **NGUOI_DUNG** - User management with role-based access (vai_tro field)
- **KHACH_SAN** - Hotel services
- **NHA_HANG** - Restaurant services
- **HOAT_DONG** - Activity services
- **PHUONG_TIEN** - Transportation services
- **DON_DAT** - Main booking/orders table
- **DAT_KHACH_SAN** - Hotel booking details
- **DAT_NHA_HANG** - Restaurant booking details
- **DAT_HOAT_DONG** - Activity booking details
- **DAT_PHUONG_TIEN** - Transportation booking details
- **THANH_TOAN** - Payment transactions
- **DANH_GIA** - Reviews (with loai_doi_tuong and ma_doi_tuong_id)
- **DIA_DIEM** - Location data
- **TINH_THANH** - Province data
- **HINH_ANH** - Image management
- **MA_GIAM_GIA** - Coupon/discount codes

### Missing Tables (Marked as COMING SOON)
The following features are marked as "COMING SOON" because the database doesn't currently support them:
- Provider profile/verification tables
- Team management tables
- Inventory/availability tables
- Pricing tables (rate plans, seasonal pricing)
- Promotion/campaign tables
- Payout tables
- Chat/messaging tables
- Calendar/blackout date tables
- Smart pricing tables
- Analytics aggregation tables

## Pages Created

### 1. Dashboard.jsx
**Purpose**: Central operation cockpit for daily provider activities

**Features**:
- KPI cards (revenue, bookings, services, rating, pending actions)
- Recent bookings list
- Top performing services
- Quick actions (confirm bookings, add service, reply reviews, view finance)
- COMING SOON features banner

**Data Sources**:
- DON_DAT, THANH_TOAN for revenue/booking stats
- KHACH_SAN, NHA_HANG, HOAT_DONG, PHUONG_TIEN for service stats
- DANH_GIA for rating stats

---

### 2. Services.jsx
**Purpose**: Manage all provider services (hotels, restaurants, activities, transportation)

**Features**:
- Service grid with images, ratings, pricing
- Filter by service type (KHACH_SAN, NHA_HANG, HOAT_DONG, PHUONG_TIEN)
- Filter by status (ACTIVE, PAUSED, DRAFT, PENDING)
- Search by name or location
- Service cards with booking counts and revenue
- Quick actions (view details, edit)

**Data Sources**:
- KHACH_SAN for hotels
- NHA_HANG for restaurants
- HOAT_DONG for activities
- PHUONG_TIEN for transportation
- DIA_DIEM for location info
- DANH_GIA for ratings

**COMING SOON**:
- Listing Quality Center
- Bulk editing
- Multi-location management
- Service SEO optimization

---

### 3. Bookings.jsx
**Purpose**: Manage all booking orders

**Features**:
- Stats cards (pending, confirmed, completed, cancelled)
- Booking table with all details
- Filter by status and service type
- Quick actions (confirm, cancel)
- Payment status tracking

**Data Sources**:
- DON_DAT for main booking data
- DAT_KHACH_SAN, DAT_NHA_HANG, DAT_HOAT_DONG, DAT_PHUONG_TIEN for service-specific details
- THANH_TOAN for payment status

**COMING SOON**:
- Booking Kanban view
- Check-in/Attendance with QR
- Calendar view
- Special requests management

---

### 4. BookingDetail.jsx
**Purpose**: View and manage individual booking details

**Features**:
- Complete booking information
- Customer details
- Service information
- Payment information
- Special requests
- Internal notes
- Action buttons (confirm, cancel, complete)
- Quick actions (add note, export invoice, report issue)

**Data Sources**:
- DON_DAT for booking data
- DAT_KHACH_SAN, DAT_NHA_HANG, DAT_HOAT_DONG, DAT_PHUONG_TIEN for service details
- THANH_TOAN for payment info
- NGUOI_DUNG for customer info

**COMING SOON**:
- Chat with customer
- Invoice export
- Issue reporting

---

### 5. Reviews.jsx
**Purpose**: Manage and respond to customer reviews

**Features**:
- Rating distribution chart
- Stats cards (average rating, total reviews, replied, pending)
- Filter by rating, reply status, service type
- Review cards with customer info
- Reply functionality
- Link to service details

**Data Sources**:
- DANH_GIA with loai_doi_tuong and ma_doi_tuong_id
- NGUOI_DUNG for customer info
- KHACH_SAN, NHA_HANG, HOAT_DONG, PHUONG_TIEN for service info

**COMING SOON**:
- Review Reply Templates
- Reputation Analytics
- Reported Reviews management
- Sentiment analysis

---

### 6. Finance.jsx
**Purpose**: Manage revenue and payouts

**Features**:
- KPI cards (total revenue, platform fee, net payout, pending payout)
- Additional stats (paid amount, refunds, average order value)
- Transaction table with detailed breakdown
- Filter by period and status
- Payout schedule
- Platform fee calculation (10%)

**Data Sources**:
- THANH_TOAN for payment transactions
- DON_DAT for booking references
- Platform fee calculation (10% of revenue)

**COMING SOON**:
- Detailed Payouts page
- Invoices/Statements
- Refunds & Adjustments management
- Bank Account Settings
- Tax Information
- Revenue Forecast

---

### 7. Settings.jsx
**Purpose**: Manage provider profile and preferences

**Features**:
- Business profile (name, contact, email, phone, address, tax code, description, logo)
- Notification settings (booking alerts, review alerts, payment alerts, marketing emails)
- Tab-based navigation
- Form validation
- Save functionality

**Data Sources**:
- NGUOI_DUNG for profile data

**COMING SOON**:
- Security settings (password, 2FA, login history)
- Bank account settings for payouts
- Team management
- Roles & Permissions
- Activity Log

---

## Integration Guide

### 1. Add Routes

Add the following routes to your React Router configuration:

```jsx
import ProviderDashboard from './pages/provider_pages/Dashboard';
import ServicesList from './pages/provider_pages/Services';
import BookingsList from './pages/provider_pages/Bookings';
import BookingDetail from './pages/provider_pages/BookingDetail';
import ReviewsList from './pages/provider_pages/Reviews';
import FinanceOverview from './pages/provider_pages/Finance';
import ProviderSettings from './pages/provider_pages/Settings';

// In your router configuration:
<Route path="/provider" element={<ProviderDashboard />} />
<Route path="/provider/services" element={<ServicesList />} />
<Route path="/provider/services/:id" element={<ServiceDetail />} />
<Route path="/provider/services/:id/edit" element={<ServiceEdit />} />
<Route path="/provider/bookings" element={<BookingsList />} />
<Route path="/provider/bookings/:id" element={<BookingDetail />} />
<Route path="/provider/reviews" element={<ReviewsList />} />
<Route path="/provider/finance" element={<FinanceOverview />} />
<Route path="/provider/settings" element={<ProviderSettings />} />
```

### 2. API Integration

Each page has TODO comments indicating where to add API calls. Replace the mock data with actual API calls to your ASP.NET Core backend.

Example for Dashboard.jsx:
```jsx
useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/provider/dashboard');
            const data = await response.json();
            setStats(data.stats);
            setRecentBookings(data.recentBookings);
            setTopServices(data.topServices);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchDashboardData();
}, []);
```

### 3. Backend API Endpoints Needed

Create the following API endpoints in your ASP.NET Core backend:

```
GET /api/provider/dashboard - Dashboard stats and data
GET /api/provider/services - List all provider services
GET /api/provider/services/:id - Get service details
POST /api/provider/services - Create new service
PUT /api/provider/services/:id - Update service
GET /api/provider/bookings - List all bookings
GET /api/provider/bookings/:id - Get booking details
PUT /api/provider/bookings/:id/confirm - Confirm booking
PUT /api/provider/bookings/:id/cancel - Cancel booking
PUT /api/provider/bookings/:id/complete - Complete booking
GET /api/provider/reviews - List all reviews
POST /api/provider/reviews/:id/reply - Reply to review
GET /api/provider/finance - Finance overview
GET /api/provider/transactions - Transaction history
GET /api/provider/profile - Get provider profile
PUT /api/provider/profile - Update provider profile
PUT /api/provider/settings/notifications - Update notification settings
```

### 4. Role-Based Access Control

Add a check to ensure only users with `vai_tro = 'PROVIDER'` can access these pages. You can implement this using a route guard or middleware.

### 5. Navigation

Add a navigation menu item for the Provider Dashboard in your main navigation:

```jsx
<Link to="/provider" className="nav-item">
    Provider Dashboard
</Link>
```

## Design System

The pages use Tailwind CSS for styling with a modern, clean design:

- **Colors**: Blue primary, gray neutrals, semantic colors for status
- **Typography**: System fonts with clear hierarchy
- **Components**: Cards, tables, badges, buttons, forms
- **Responsive**: Mobile-first design with breakpoints
- **States**: Loading, empty, error states handled

## Future Enhancements

Based on the blueprint, the following pages/features should be added when database support is available:

### High Priority
- Service Detail/Preview page
- Service Edit/Create page
- Availability Calendar
- Inventory Management
- Pricing Management
- Promotions/Coupons

### Medium Priority
- Inbox/Chat with customers
- Analytics Dashboard
- Media Library
- Location Management

### Low Priority
- Team Management
- Onboarding Flow
- Help Center
- Policy Center

## Notes

- All pages use mock data currently - replace with actual API calls
- ESLint warnings about setState in effects can be resolved by wrapping in async functions or using React Query
- Unused imports should be removed in production
- The design follows modern SaaS dashboard patterns
- All COMING SOON features are clearly marked in the UI

## Support

For questions or issues, refer to the main EZtravel documentation or contact the development team.
