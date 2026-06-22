# DOCUMENT CLEANUP PLAN

Đây là danh sách phân loại toàn bộ các file `.md` hiện có trong thư mục `docs` để chuẩn bị cho Roadmap V2.

**LƯU Ý:** Không có file nào bị xóa hoặc di chuyển trong lần tạo báo cáo này. Chờ sự đồng ý của Admin.

## 1. KEEP (Giữ lại - Vẫn còn giá trị nguyên bản)

Các file mang tính nguyên tắc, hướng dẫn hoặc cơ sở cấu trúc:

*   `docs/project/01_PROJECT_CONSTITUTION.md`: Hiến pháp dự án.
*   `docs/project/05_FRONTEND_CODING_STANDARD.md`: Tiêu chuẩn code.
*   `docs/project/06_PR_REVIEW_CHECKLIST.md`: Checklist review code.
*   `docs/project/12_DEVELOPER_ONBOARDING_GUIDE.md`: Tài liệu hướng dẫn Onboard.

## 2. MERGE (Gộp vào tài liệu mới)

Các file này có nội dung tốt nhưng bị phân mảnh, nên gộp thành tài liệu V2 (những tài liệu ta vừa sinh ra):

*   `docs/project/02_SYSTEM_BASELINE.md` ➔ Gộp vào `SYSTEM_INVENTORY_REPORT.md`.
*   `docs/project/03_CURRENT_REALITY_REPORT.md` ➔ Gộp vào `SYSTEM_INVENTORY_REPORT.md`.
*   `docs/project/04_CRD_TRACEABILITY_MATRIX.md` ➔ Gộp vào `CRD_GAP_ANALYSIS_V2.md`.
*   `docs/project/09_FRONTEND_GAP_ANALYSIS.md` ➔ Gộp vào `FRONTEND_ANALYSIS_V2.md`.
*   `docs/project/10_BACKEND_API_CATALOG.md` ➔ Gộp vào `BACKEND_ANALYSIS_V2.md`.
*   `docs/project/11_DATABASE_BUSINESS_MAPPING.md` ➔ Gộp vào `DATABASE_ANALYSIS_V2.md`.
*   `docs/project/API_TRUTH_REPORT.md` ➔ Gộp vào `BACKEND_ANALYSIS_V2.md`.

## 3. ARCHIVE (Chuyển vào thư mục Archive)

Các file mang tính lịch sử của quá trình làm việc trước đây, không dùng nữa nhưng cần giữ làm kỷ niệm/đối chiếu:

*   `docs/archive/AI_RULES.md`: Chuyển hoàn toàn xuống deep archive.
*   `docs/archive/SYSTEM_ARCHITECTURE.md`: Đã lỗi thời so với V2.
*   `docs/project/SPRINT6_COMPLETION_REPORT.md`: Báo cáo Sprint cũ.
*   `docs/project/SPRINT6_VERIFICATION_REPORT.md`: Báo cáo test Sprint cũ.
*   `docs/project/08_FRONTEND_MASTER_PLAN.md`: Kế hoạch cũ.
*   `docs/project/13_TEAM_EXECUTION_PLAN.md`: Kế hoạch thực thi cũ.

## 4. DELETE (Xóa hoàn toàn)

Các file rác, file kế hoạch nháp, hoặc file bị thay thế hoàn toàn bởi cấu trúc V2:

*   `docs/project/07_SPRINT_BACKLOG.md`: Xóa, thay bằng Roadmap V2 và sẽ quản lý Backlog qua Jira/Linear thay vì Text.
*   `docs/project/SPRINT6_API_MAPPING.md`: Xóa, quá chi tiết và lỗi thời.
*   `docs/project/SPRINT6_DTO_AUDIT.md`: Xóa, không còn ý nghĩa.
*   `docs/project/SPRINT6_EXECUTION_PLAN.md`: Xóa, Sprint 6 đã bị hủy bỏ.
*   `docs/project/SPRINT6_UI_SPECIFICATION.md`: Xóa, UI sẽ được làm mới theo Design System.
