# Authentication & Profile Module Specifications

## 1. Login Page
* **Route**: `/auth/login`
* **Actor**: Guest
* **CRD Mapping**: 3.1.2
* **SRS Mapping**: UC 002
* **Database Mapping**: `NGUOI_DUNG`

### Validation Rules
* **Email**: Required, valid email format regex (`^[^\s@]+@[^\s@]+\.[^\s@]+$`).
* **Password**: Required, minimum 6 characters.

### Desktop Layout
* Centered auth card (max-width: 400px) against a dynamic hero background image.
* Split screen option: Left 50% image/branding, Right 50% login form.

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Form | ✅ | ❌ (Redirect) | ❌ (Redirect) | ❌ (Redirect) |
| Submit Login | ✅ | ❌ | ❌ | ❌ |

### Embedded Component Inventory

#### `LoginForm`
* **Purpose**: Captures user credentials and authenticates with the backend.
* **Inputs**: `email` (string), `password` (string).
* **Outputs**: JWT Token (`accessToken`, `refreshToken`), User Session Object.
* **Required Data**: Local state for form fields.
* **Required APIs**: `POST /api/auth/login`
* **Events**: `onSubmit`, `onForgotPasswordClick`, `onRegisterClick`.
* **Permissions**: Public.
* **Business Requirements**: Secure JWT storage triggering context update, explicit inline error messages (e.g., "Sai mật khẩu").
* **UI Recommendations**: Password masking toggle (eye icon), "Remember Me" checkbox, future OAuth2 Social Login Buttons.

---

## 2. Register Page
* **Route**: `/auth/register`
* **Actor**: Guest
* **CRD Mapping**: 3.1.1
* **SRS Mapping**: UC 001
* **Database Mapping**: `NGUOI_DUNG`, `OTP_XAC_THUC`

### Validation Rules
* **FullName**: Required, max 100 characters.
* **Email**: Required, valid email format, must be unique in DB.
* **Password**: Required, min 8 characters, 1 uppercase, 1 number, 1 special character.
* **Confirm Password**: Must match Password exactly.

### Desktop Layout
* Split screen layout matching Login page, but with a longer scrolling form area if necessary. Modal popup for OTP Verification.

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Form | ✅ | ❌ (Redirect) | ❌ (Redirect) | ❌ (Redirect) |
| Submit Form | ✅ | ❌ | ❌ | ❌ |
| Verify OTP | ✅ | ❌ | ❌ | ❌ |

### Embedded Component Inventory

#### `RegisterForm`
* **Purpose**: Collects new user information to create an account.
* **Inputs**: `fullName`, `email`, `password`, `confirmPassword`.
* **Outputs**: Registration Request payload.
* **Required Data**: Local state for validation.
* **Required APIs**: `POST /api/auth/register`
* **Events**: `onSubmit`, `onLoginClick`.
* **Permissions**: Public.
* **Business Requirements**: Transition to OTP Verification upon successful API submission, enforce password strength rules.
* **UI Recommendations**: Password strength indicator bar, inline field validation ticks, Terms of Service acceptance checkbox.

#### `OTPVerificationModal`
* **Purpose**: Verifies the user's email via a 6-digit code.
* **Inputs**: `otpCode`, `email`.
* **Outputs**: Verification Success token.
* **Required Data**: Email address of the pending registration.
* **Required APIs**: `POST /api/auth/verify-otp`, `POST /api/auth/resend-otp`
* **Events**: `onSubmitCode`, `onResendCode`, `onTimerExpire`.
* **Permissions**: Public (Temporary Session).
* **Business Requirements**: 6-digit formatted input, auto-submit on 6th digit, 60-second cooldown for resend.
* **UI Recommendations**: Focus auto-advance between digit input boxes.

---

## 3. Forgot Password Page
* **Route**: `/auth/forgot-password`
* **Actor**: Guest
* **CRD Mapping**: 3.1.3
* **SRS Mapping**: UC 003
* **Database Mapping**: `NGUOI_DUNG`, `OTP_XAC_THUC`

### Validation Rules
* **Email**: Required, valid email format.
* **OTP**: Required, 6 numeric digits.
* **New Password**: Required, min 8 chars, 1 uppercase, 1 number.

### Desktop Layout
* Centered card (max-width: 400px). Standard multi-step wizard (Step 1: Email, Step 2: OTP, Step 3: New Password).

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Form | ✅ | ❌ | ❌ | ❌ |
| Request Reset | ✅ | ❌ | ❌ | ❌ |
| Submit New Pwd | ✅ | ❌ | ❌ | ❌ |

### Embedded Component Inventory

#### `ForgotPasswordForm`
* **Purpose**: Initiates the password recovery flow.
* **Inputs**: `email`.
* **Outputs**: Recovery Request trigger.
* **Required Data**: None.
* **Required APIs**: `POST /api/auth/forgot-password`
* **Events**: `onSubmitEmail`.
* **Permissions**: Public.
* **Business Requirements**: Transition to OTP/Reset step upon email submission.
* **UI Recommendations**: Clear feedback ("Check your inbox"), "Back to Login" navigation.

#### `ResetPasswordForm`
* **Purpose**: Allows user to input a new password after verifying recovery OTP.
* **Inputs**: `otpCode`, `newPassword`.
* **Outputs**: Password Reset payload.
* **Required Data**: Pending recovery session.
* **Required APIs**: `POST /api/auth/reset-password`
* **Events**: `onSubmitNewPassword`.
* **Permissions**: Public.
* **Business Requirements**: Validate new password complexity, success redirect to login.
* **UI Recommendations**: Matching confirmation checks inline.

---

## 4. Profile Settings Page
* **Route**: `/profile`
* **Actor**: Traveler, Provider, Admin
* **CRD Mapping**: 3.1.4
* **SRS Mapping**: UC 004
* **Database Mapping**: `NGUOI_DUNG`

### Validation Rules
* **Phone**: Valid Vietnamese phone format (10-11 digits).
* **Current Password**: Required if attempting to change password.

### Desktop Layout
* Left sidebar for navigation (Personal Info, Security, Saved Items, Preferences). Main content area on the right taking up remaining width (max-width: 800px).

### Component Permission Matrix
| Action | Guest | Traveler | Provider | Admin |
| :--- | :--- | :--- | :--- | :--- |
| View Profile | ❌ | ✅ | ✅ | ✅ |
| Edit Own Info | ❌ | ✅ | ✅ | ✅ |
| Edit Others | ❌ | ❌ | ❌ | ✅ (Via Admin UI) |

### Embedded Component Inventory

#### `ProfileHeader`
* **Purpose**: Displays the user's avatar, name, role, and premium status.
* **Inputs**: `userContext` (User Object).
* **Outputs**: None.
* **Required Data**: Global Auth Context (`NGUOI_DUNG` data).
* **Required APIs**: `POST /api/profile/avatar`
* **Events**: `onAvatarUpload`.
* **Permissions**: Authenticated.
* **Business Requirements**: Fallback avatar if image is null, display current role badge.
* **UI Recommendations**: Skeleton loader during data fetch, hover state for image upload button.

#### `PersonalInfoForm`
* **Purpose**: Edits the user's basic information.
* **Inputs**: `fullName`, `phoneNumber`, `address`, `gender`, `birthDate`.
* **Outputs**: Update Profile API Payload.
* **Required Data**: Current `NGUOI_DUNG` record.
* **Required APIs**: `PUT /api/profile`
* **Events**: `onSave`, `onChange`.
* **Permissions**: Authenticated.
* **Business Requirements**: Disabled save button unless changes detected.
* **UI Recommendations**: Inline toast notification on success, pre-filled data.

#### `PasswordChangeForm`
* **Purpose**: Allows authenticated users to change their password securely.
* **Inputs**: `oldPassword`, `newPassword`, `confirmNewPassword`.
* **Outputs**: Change Password API Payload.
* **Required Data**: None.
* **Required APIs**: `PUT /api/profile/password`
* **Events**: `onSubmit`.
* **Permissions**: Authenticated.
* **Business Requirements**: Old password verification, new password complexity rules.
* **UI Recommendations**: Clear form fields on success.
