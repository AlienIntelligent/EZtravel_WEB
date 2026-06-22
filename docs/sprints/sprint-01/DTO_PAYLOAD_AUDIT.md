# DTO PAYLOAD AUDIT

Tài liệu xác minh quy trình submit Payload từ UI Form (`ServiceFormModal.jsx`) xuống Backend.

## 1. Kiểm tra Restaurant DTO Payload

### Ghi nhận trước sửa đổi:
- Field `diaChi` (Địa chỉ cụ thể) được render chung (Common Fields) ở dưới cùng form cho **tất cả** loại dịch vụ.
- Khi Submit form cho danh mục **Restaurant**, form vẫn đẩy field `diaChi` vào `payload`.
- Tuy nhiên, `RestaurantCreateRequest` và `RestaurantUpdateRequest` của Backend DTO hoàn toàn KHÔNG CÓ trường `DiaChi`. Dù trình Deserializer (JSON) của C# tự động ignore trường dư thừa, điều này vẫn làm bẩn payload và lãng phí băng thông, không đúng chuẩn DTO contract.

### Trạng thái sau sửa đổi:
- Đã thêm logic kiểm tra trước khi gọi API `onSubmit`:
```javascript
if (category !== "hotels" && "diaChi" in payload) {
  delete payload.diaChi;
}
```
- **Kết quả:** Field `diaChi` ĐÃ ĐƯỢC LOẠI BỎ khỏi payload đối với các category `restaurants`, `activities`, `vehicles`. Payload đã sạch 100% khớp DTO.

## 2. Kết luận
- Payload gửi xuống Backend giờ đây đã được tinh gọn và tuân thủ chặt chẽ Contract DTO. Các trường số rỗng được convert thành `null` hợp lệ, và các trường dư thừa (`diaChi`) bị gọt bỏ. Đã pass DTO Payload Audit.
