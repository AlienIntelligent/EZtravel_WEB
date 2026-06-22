# Pending Database Migration Requirements

This document is the handoff for schema changes that are intentionally **not** applied by Codex. Current Auth refresh rotation and Planner persistence work against the existing schema.

## 1. Auth hardening - `OTP_XAC_THUC`

The current implementation uses the existing columns for a 60-second resend cooldown and a 15-minute lock. Add the following columns before production so registration and password-reset OTPs cannot share state and hourly throttling is auditable.

| Column | SQL Server type | Null | Default / constraint | Purpose |
|---|---|---:|---|---|
| `muc_dich` | `nvarchar(20)` | No | `CHECK (muc_dich IN ('REGISTER','RESET'))` | Isolate verification and recovery codes. |
| `otp_hash` | `char(64)` | Yes during backfill, then No | SHA-256 hex | Stop storing the OTP in plaintext; retire `otp` after rollout. |
| `ngay_tao` | `datetime2(7)` | No | `sysutcdatetime()` | Exact cooldown/rate-limit timestamp. |
| `khoa_den` | `datetime2(7)` | Yes | — | Explicit five-failure lock expiry. |
| `so_lan_gui` | `smallint` | No | `1`, `CHECK (so_lan_gui > 0)` | Count sends inside the active window. |
| `cua_so_gui_bat_dau` | `datetime2(7)` | No | `sysutcdatetime()` | Support an hourly send ceiling. |

Recommended indexes:

- `IX_OTP_XAC_THUC_USER_PURPOSE_ACTIVE (ma_nguoi_dung, muc_dich, da_su_dung, ngay_tao DESC)`.
- Filtered index on `(ma_nguoi_dung, khoa_den)` where `khoa_den IS NOT NULL`.

## 2. Refresh-token audit hardening - `REFRESH_TOKEN`

No new table is required for the implemented 14-day rotation. `refresh_token` currently stores a SHA-256 hash, never the raw cookie. Add these columns for token-family replay investigation and operational audit.

| Column | SQL Server type | Null | Default / constraint | Purpose |
|---|---|---:|---|---|
| `family_id` | `uniqueidentifier` | No | `newid()` | Group all rotations from one login. |
| `ngay_tao` | `datetime2(7)` | No | `sysutcdatetime()` | Issue timestamp. |
| `ngay_thu_hoi` | `datetime2(7)` | Yes | — | Precise revocation time. |
| `ma_token_thay_the` | `int` | Yes | FK to `REFRESH_TOKEN(ma_token)` | Link a rotated token to its replacement. |
| `ly_do_thu_hoi` | `nvarchar(100)` | Yes | — | `ROTATED`, `LOGOUT`, `REPLAY`, or `ADMIN_REVOKE`. |
| `created_ip` | `varbinary(16)` | Yes | — | Optional IPv4/IPv6 issue address. |

Recommended indexes:

- Unique index `UX_REFRESH_TOKEN_HASH (refresh_token)`.
- `IX_REFRESH_TOKEN_USER_ACTIVE (ma_nguoi_dung, da_thu_hoi, ngay_het_han)`.
- Foreign key `ma_token_thay_the -> REFRESH_TOKEN(ma_token)` with `NO ACTION`.

## 3. Planner concurrency hardening

The current Planner saves through the existing Trip tables and needs no new table. Before realtime collaboration, add:

| Table | Column | SQL Server type | Null | Purpose |
|---|---|---|---:|---|
| `LICH_TRINH` | `phien_ban` | `rowversion` | No | Optimistic concurrency for whole-timeline saves. |

For share links, create `LIEN_KET_CHIA_SE_LICH_TRINH`:

| Column | SQL Server type | Null | Notes |
|---|---|---:|---|
| `ma_lien_ket` | `bigint identity(1,1)` | No | Primary key. |
| `ma_lich_trinh` | `int` | No | FK to `LICH_TRINH(ma_lich_trinh)`. |
| `token_hash` | `char(64)` | No | Unique SHA-256 share-token hash. |
| `quyen` | `nvarchar(20)` | No | `VIEWER` or `EDITOR`. |
| `ngay_tao` | `datetime2(7)` | No | Default `sysutcdatetime()`. |
| `ngay_het_han` | `datetime2(7)` | Yes | Optional expiry. |
| `ngay_thu_hoi` | `datetime2(7)` | Yes | Revocation timestamp. |
| `ma_nguoi_tao` | `int` | No | FK to `NGUOI_DUNG(ma_nguoi_dung)`. |

Add unique index `UX_LKCSLT_TOKEN_HASH (token_hash)` and lookup index `IX_LKCSLT_TRIP_ACTIVE (ma_lich_trinh, ngay_thu_hoi, ngay_het_han)`.
