# DATABASE ANALYSIS V2

Đánh giá cấu trúc Database hiện tại dựa trên DbContext và Entity Framework Models.

## 1. Các bảng chưa được sử dụng hoặc dùng ít

*   **GOI_DICH_VU & DANG_KY_GOI**: Hệ thống Freemium cho end-user chưa được phát triển. Tạm thời là Dead Code.
*   **THONG_BAO**: Có entity nhưng notification system chưa hoạt động, thiếu in-app polling/SignalR.
*   **BAO_CAO_NOI_DUNG**: Chưa có luồng report từ UI, bảng này hiện đang rỗng.
*   **LICH_SU_CLONE**: Đang ghi nhận việc clone nhưng chưa tận dụng dữ liệu này để tăng độ phổ biến (Trending) cho lịch trình gốc.

## 2. Các bảng thiếu API / Thiếu UI

*   **PHAN_HOI_DANH_GIA**: NCC chưa có cách để reply lại review của khách hàng (Thiếu cả API và UI).
*   **DUYET_NOI_DUNG**: Admin chưa có bảng điều khiển để duyệt Review, Blog, Dịch vụ (Mới chỉ có duyệt NCC).
*   **CHIA_SE_LICH_TRINH**: Cơ chế quyền (Viewer, Editor) chưa có giao diện gán quyền và chưa có luồng API xử lý bảo mật cho cộng tác viên.

## 3. Thiết kế có vấn đề & Cần mở rộng

*   **Thiếu bảng thống kê (Analytics):** Dashboard của Provider đang tính toán dựa trên `LUOT_XEM` đơn giản trong bảng `DICH_VU`. Để vẽ biểu đồ, cần một bảng Time-series (ví dụ `LOG_TRUY_CAP_DICH_VU`) lưu theo ngày.
*   **Thiếu Tracking Thanh toán thật:** Bảng `THANH_TOAN_NCC` khá đơn giản. Nếu sau này tích hợp VNPay/MoMo, cần lưu Transaction ID, Payment Gateway Response Raw.
*   **Quá tải bảng LICH_TRINH:** Hiện tại tất cả config lịch trình nằm ở bảng này. Cần tách metadata và setting chia sẻ nếu sau này phức tạp lên.
*   **Hardcode Phân quyền (Role):** Hiện tại NGUOI_DUNG không có bảng Role riêng biệt (Sử dụng Enum/String trong logic). Điều này giới hạn việc tạo thêm các role đặc thù (VD: Sub-Admin, Content Moderator).

## 4. Bảng không còn giá trị (Có thể loại bỏ)

*   Hiện tại DB được thiết kế khá tinh gọn bám sát CRD. Không có bảng nào thực sự "rác". Chỉ có `GOI_DICH_VU` (End-user packages) có thể cân nhắc ẩn đi nếu business quyết định free 100% cho Traveler.
