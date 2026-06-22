# DTO VALIDATION AUDIT

Đối chiếu cấu trúc `ServiceFormModal.jsx` và Backend DTOs (`ServiceDtos.cs`).

## 1. Hotel DTO (HotelCreateRequest / HotelUpdateRequest)
- **Required**: `MaDiaDiem` (số), `TenKhachSan` (string, max 150) -> Đã map đúng validation.
- **Optional**: `MoTa`, `DiaChi` (max 255), `SoSao` (1-5), `GiaTu`, `GiaDen`, `AnhDaiDien`.
- **Match Status**: Khớp hoàn toàn. Form đã validate `SoSao` min 1 max 5.

## 2. Restaurant DTO (RestaurantCreateRequest / RestaurantUpdateRequest)
- **Required**: `MaDiaDiem` (số), `TenNhaHang` (string, max 150) -> Đã map đúng validation.
- **Optional**: `MoTa`, `MaLoaiAmThuc`, `GiaTrungBinh`, `AnhDaiDien`.
- **Match Status**: Khớp 100% field. Lưu ý Frontend đang render dư trường `DiaChi` cho loại này (dưới dạng Common Field), tuy nhiên Backend DTO không khai báo nên sẽ tự động Ignore. An toàn.

## 3. Activity DTO (ActivityCreateRequest / ActivityUpdateRequest)
- **Required**: `MaDiaDiem` (số), `TenHoatDong` (string, max 150) -> Đã map đúng validation.
- **Optional**: `MoTa`, `Gia`, `ThoiLuong`, `AnhDaiDien`.
- **Match Status**: Khớp hoàn toàn.

## 4. Vehicle DTO (VehicleCreateRequest / VehicleUpdateRequest)
- **Required**: `MaDiaDiem` (số), `TenPhuongTien` (string, max 150), `LoaiPhuongTien` (string, max 50) -> Đã map đúng.
- **Optional**: `MoTa`, `HangXe`, `SoChoNgoi`, `DiemKhoiHanh`, `DiemDen`, `GiaTrungBinh`, `AnhDaiDien`.
- **Match Status**: Khớp hoàn toàn.

## Kết luận chung
- Validation Rules trên form hiện tại (MaxLength, Min/Max) đã phản chiếu chính xác Data Annotations (`[Required]`, `[StringLength]`, `[Range]`) trên Backend.
- Parse rules: Parse sang Number đã được apply cho các trường số, trả về null nếu rỗng (không gán bừa thành 0), đảm bảo DTO an toàn.
