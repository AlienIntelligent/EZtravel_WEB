# Auth API Contracts

## 1. Login
**Endpoint**: `POST /api/auth/login`  
**Permission**: Public  
**Frontend Consumers**: `/auth/login`, `LoginForm`

### Request DTO
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Response DTO
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "def456...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "TRAVELER",
    "status": "ACTIVE"
  }
}
```

### Validation
- `email`: Required, valid email format.
- `password`: Required, min 8 characters.

### Error Responses
- `400 Bad Request`: Invalid input format.
- `401 Unauthorized`: Invalid email or password.
- `403 Forbidden`: Account suspended.

---

## 2. Register
**Endpoint**: `POST /api/auth/register`  
**Permission**: Public  
**Frontend Consumers**: `/auth/register`, `RegisterForm`

### Request DTO
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "fullName": "John Doe"
}
```

### Response DTO
```json
{
  "message": "OTP sent to email. Please verify to complete registration."
}
```

### Validation
- `email`: Required, valid email format, must be unique.
- `password`: Required, min 8 chars, 1 uppercase, 1 number, 1 special char.
- `fullName`: Required, max 100 chars.

### Error Responses
- `400 Bad Request`: Validation failed.
- `409 Conflict`: Email already exists.

---

## 3. Verify OTP
**Endpoint**: `POST /api/auth/verify-otp`  
**Permission**: Public  
**Frontend Consumers**: `/auth/register`, `OTPVerificationModal`

### Request DTO
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### Response DTO
```json
{
  "message": "Registration successful.",
  "accessToken": "eyJhbG...",
  "refreshToken": "def456..."
}
```

### Validation
- `email`: Required, valid email format.
- `otp`: Required, exactly 6 digits.

### Error Responses
- `400 Bad Request`: Invalid or expired OTP.

---

## 4. Resend OTP
**Endpoint**: `POST /api/auth/resend-otp`  
**Permission**: Public  
**Frontend Consumers**: `/auth/register`, `OTPVerificationModal`

### Request DTO
```json
{
  "email": "user@example.com"
}
```

### Response DTO
```json
{
  "message": "New OTP sent successfully."
}
```

### Validation
- `email`: Required, valid email format.

### Error Responses
- `400 Bad Request`: Too many requests / Cooldown active.
- `404 Not Found`: Email not found or already verified.

---

## 5. Forgot Password
**Endpoint**: `POST /api/auth/forgot-password`  
**Permission**: Public  
**Frontend Consumers**: `/auth/forgot-password`, `ForgotPasswordForm`

### Request DTO
```json
{
  "email": "user@example.com"
}
```

### Response DTO
```json
{
  "message": "Password reset OTP sent to email."
}
```

### Validation
- `email`: Required, valid email format.

### Error Responses
- `404 Not Found`: Email not registered.

---

## 6. Reset Password
**Endpoint**: `POST /api/auth/reset-password`  
**Permission**: Public  
**Frontend Consumers**: `/auth/forgot-password`, `ResetPasswordForm`

### Request DTO
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123!"
}
```

### Response DTO
```json
{
  "message": "Password has been reset successfully."
}
```

### Validation
- `email`: Required, valid email.
- `otp`: Required, 6 digits.
- `newPassword`: Required, strong password rules.

### Error Responses
- `400 Bad Request`: Invalid or expired OTP, or weak password.

---

## 7. Get Profile
**Endpoint**: `GET /api/profile`  
**Permission**: Traveler  
**Frontend Consumers**: `/profile`, `ProfileHeader`, `PersonalInfoForm`

### Request DTO
*(None)*

### Response DTO
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "phoneNumber": "0123456789",
  "avatarUrl": "https://storage.../avatar.jpg",
  "bio": "Travel enthusiast",
  "role": "TRAVELER",
  "status": "ACTIVE",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

### Validation
*(None)*

### Error Responses
- `401 Unauthorized`: Token missing or invalid.

---

## 8. Update Profile
**Endpoint**: `PUT /api/profile`  
**Permission**: Traveler  
**Frontend Consumers**: `/profile`, `PersonalInfoForm`

### Request DTO
```json
{
  "fullName": "John Doe Updated",
  "phoneNumber": "0987654321",
  "bio": "Updated bio"
}
```

### Response DTO
```json
{
  "id": 1,
  "fullName": "John Doe Updated",
  "phoneNumber": "0987654321",
  "bio": "Updated bio",
  "updatedAt": "2026-06-12T00:00:00Z"
}
```

### Validation
- `fullName`: Optional, max 100 chars.
- `phoneNumber`: Optional, valid phone format.
- `bio`: Optional, max 500 chars.

### Error Responses
- `400 Bad Request`: Validation errors.
- `401 Unauthorized`: Authentication required.

---

## 9. Change Password
**Endpoint**: `PUT /api/profile/password`  
**Permission**: Traveler  
**Frontend Consumers**: `/profile`, `PasswordChangeForm`

### Request DTO
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### Response DTO
```json
{
  "message": "Password updated successfully."
}
```

### Validation
- `currentPassword`: Required.
- `newPassword`: Required, strong password rules, different from current.

### Error Responses
- `400 Bad Request`: Invalid current password or new password format.
- `401 Unauthorized`: Authentication required.

---

## 10. Update Avatar
**Endpoint**: `POST /api/profile/avatar`  
**Permission**: Traveler  
**Frontend Consumers**: `/profile`, `ProfileHeader`

### Request DTO
*(Multipart form-data)*
- `file`: image/jpeg or image/png

### Response DTO
```json
{
  "avatarUrl": "https://storage.../new-avatar.jpg"
}
```

### Validation
- `file`: Max 5MB, valid image format (JPEG/PNG).

### Error Responses
- `400 Bad Request`: File too large or unsupported format.
- `401 Unauthorized`: Authentication required.
