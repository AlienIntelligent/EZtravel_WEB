# DOCUMENT REFERENCE RISK REPORT

Báo cáo phân tích rủi ro khi di chuyển tài liệu dựa trên các liên kết (Reference) hiện tại trong dự án.

## 1. Phân tích Tham chiếu (Reference Analysis)
Trong quá trình các Agent AI vận hành và con người làm việc, một số file gốc (Root Files) có thể đang được cấu hình cứng (Hardcoded) làm điểm neo đọc dữ liệu.

### 1.1 Các file bị Prompt/Agent tham chiếu thường xuyên (High Risk)
- `RULES.md`: Đây là Single Source of Truth của dự án. Nếu bị chuyển đi mà Prompt Context không cập nhật, Agent có thể vi phạm các Rule cấm (như tự tiện sửa Backend).
- `ROADMAP_V2.md`: Dùng để tra cứu lịch trình Sprint. Nếu chuyển mất, Agent có thể hiểu lầm dự án không có lộ trình.
- `TECH_DEBT_BACKLOG.md`: Là nơi lưu giữ nợ kỹ thuật để xử lý. Di chuyển đột ngột có thể làm mất dấu theo dõi của QA.

### 1.2 Các file bị Tài liệu khác tham chiếu (Medium Risk)
- Các file Sign-off hoặc Execution Spec trong từng Sprint thường liên kết với nhau bằng URL dạng `file:///d:/eztravel/Tên_File.md`. Khi Move vào `docs/`, các link này sẽ bị gãy (Broken Links). Ví dụ: `SPRINT_01_COMPLETION_REPORT.md` trích xuất link từ `DTO_VALIDATION_AUDIT.md`.

## 2. Các file có thể di dời (MOVE) ngay lập tức
- Hầu hết các file `_AUDIT_REPORT.md` cũ thuộc chiến dịch JSX Migration (như `POST_JSX_MIGRATION_AUDIT.md`, `IMPORT_AUDIT_REPORT.md`).
- Các file phân tích V2 hiện tại (`DATABASE_ANALYSIS_V2.md`, v.v.) vì chúng chủ yếu dùng để con người đọc 1 lần thay vì làm input liên tục.
- Các file báo cáo tĩnh như `DEPENDENCY_AUDIT.md` hay `DOCUMENT_DUPLICATION_REPORT.md`.

## 3. Các file CẦN GIỮ LẠI (Tại Root) cho đến khi cập nhật System Prompt
- `RULES.md`: Bắt buộc phải giữ lại 1 bản copy tại Root (hoặc làm symlink) trừ khi Prompt của AI Agent được cập nhật để trỏ vào `docs/governance/RULES.md`.
- `ROADMAP_V2.md`: Nên giữ lại 1 bản copy tại Root để điều hướng tổng thể.

## 4. Kết luận rủi ro
Quyết định áp dụng **SAFE MODE** (Chỉ COPY, Không MOVE, Không Xóa file gốc) của đợt dọn dẹp này là cực kỳ chính xác. Nó đảm bảo mọi broken link và hardcoded prompt reference vẫn hoạt động bình thường trên Root, trong khi tạo ra một không gian `docs/` sạch sẽ để làm "New Single Source of Truth" trong tương lai.
