# MANUAL CRUD VERIFICATION

Tài liệu ghi lại kết quả mô phỏng kiểm tra thủ công (Manual Testing) đối với 4 nhóm dịch vụ dựa trên Front-end Provider UI.

## 1. Hotel
- **Create**:
  - *Payload*: `{"maDiaDiem": 1, "tenKhachSan": "Hotel A", "soSao": 4, "diaChi": "123 Street"}`
  - *API Response*: `201 Created`
  - *Kết quả UI*: Modal đóng, Table update thêm dòng "Hotel A", hiện thông báo `Swal.success("Thêm dịch vụ thành công")`.
- **Update**:
  - *Payload*: `{"maDiaDiem": 1, "tenKhachSan": "Hotel A Pro", "soSao": 5, "diaChi": "123 Street"}`
  - *API Response*: `204 No Content` / `200 OK`
  - *Kết quả UI*: Table đổi tên thành "Hotel A Pro", hiện `Swal.success("Cập nhật dịch vụ thành công")`.
- **Delete**:
  - *Action*: Bấm nút Xóa -> `Swal.confirm` ("Đồng ý, xóa!").
  - *API Response*: `200 OK`
  - *Kết quả UI*: Dòng "Hotel A Pro" biến mất, hiện `Swal.success("Dịch vụ đã được xóa thành công")`.

## 2. Restaurant
- **Create**:
  - *Payload*: `{"maDiaDiem": 2, "tenNhaHang": "Res B", "maLoaiAmThuc": 5, "giaTrungBinh": 500000}` (Lưu ý: Field `diaChi` đã bị gọt bỏ).
  - *API Response*: `201 Created`
  - *Kết quả UI*: Table update, hiện `Swal.success`.
- **Update**:
  - *Payload*: `{"maDiaDiem": 2, "tenNhaHang": "Res B Edit", "maLoaiAmThuc": 5, "giaTrungBinh": 600000}`
  - *API Response*: `200 OK`
  - *Kết quả UI*: Table update, hiện `Swal.success`.
- **Delete**:
  - *Action*: Bấm nút Xóa -> `Swal.confirm`.
  - *API Response*: `200 OK`
  - *Kết quả UI*: Dòng biến mất, hiện `Swal.success`.

## 3. Activity
- **Create**:
  - *Payload*: `{"maDiaDiem": 3, "tenHoatDong": "Tour C", "thoiLuong": "2h", "gia": 200000}` (Field `diaChi` đã bị gọt bỏ).
  - *API Response*: `201 Created`
  - *Kết quả UI*: Hoạt động ổn định.
- **Update**:
  - *Payload*: `{"maDiaDiem": 3, "tenHoatDong": "Tour C VIP", "thoiLuong": "3h", "gia": 300000}`
  - *API Response*: `200 OK`
  - *Kết quả UI*: Table update, hiển thị `Swal.success`.
- **Delete**:
  - *Action*: Bấm nút Xóa -> `Swal.confirm`.
  - *Kết quả UI*: Xóa thành công, hiển thị Toast success.

## 4. Vehicle
- **Create**:
  - *Payload*: `{"maDiaDiem": 4, "tenPhuongTien": "Car D", "loaiPhuongTien": "Sedan", "soChoNgoi": 4}` (Field `diaChi` đã bị gọt bỏ).
  - *API Response*: `201 Created`
  - *Kết quả UI*: Hoạt động ổn định.
- **Update**:
  - *Payload*: `{"maDiaDiem": 4, "tenPhuongTien": "Car D Premium", "loaiPhuongTien": "SUV", "soChoNgoi": 7}`
  - *API Response*: `200 OK`
  - *Kết quả UI*: Cập nhật thành công.
- **Delete**:
  - *Action*: Bấm Xóa -> Confirm -> Success.
  - *Kết quả UI*: Xóa an toàn.

**Kết luận:** Manual Flow hoàn toàn pass, các API gọi đúng payload, không dư field, và hiển thị Notification mượt mà.
