# DOCUMENT CLEANUP RECOMMENDATION

Danh sách đề xuất xử lý cho 42 tài liệu `.md` hiện có tại thư mục gốc.

## 1. KEEP & MOVE (Giữ lại và Di chuyển vào `docs/`)
Tất cả các tài liệu có giá trị dài hạn và phản ánh đúng thực trạng hệ thống:
- `RULES.md` -> `docs/governance/`
- `TECH_DEBT_BACKLOG.md` -> `docs/governance/`
- `DOCUMENT_CLEANUP_PLAN.md` -> `docs/governance/`
- `NOTIFICATION_STRATEGY.md` -> `docs/governance/`
- Các file phân tích V2 (`BACKEND_ANALYSIS_V2.md`, `DATABASE_ANALYSIS_V2.md`, `FRONTEND_ANALYSIS_V2.md`) -> `docs/architecture/`
- `SYSTEM_INVENTORY_REPORT.md`, `SYSTEM_REDESIGN_PROPOSAL.md`, `ROADMAP_V2.md` -> `docs/architecture/`
- Các Audit Reports độc lập (`ESLINT_DEBT_REPORT.md`, `DESIGN_SYSTEM_AUDIT.md`, v.v.) -> `docs/audits/`
- Toàn bộ tài liệu thuộc Sprint 01 -> `docs/sprints/sprint-01/`
- Toàn bộ tài liệu thuộc Sprint 02 -> `docs/sprints/sprint-02/`

## 2. MERGE (Gộp chung)
Để giảm rác tài liệu, đề xuất gộp các file nhỏ lẻ cùng chủ đề:
- **Merge 1:** `JSX_MIGRATION_AUDIT.md` + `POST_JSX_MIGRATION_AUDIT.md` + `JSX_UI_MIGRATION_REPORT.md` -> Thành `docs/migrations/JSX_MIGRATION_MASTER.md`
- **Merge 2:** `SPRINT_01_EXECUTION_SPEC.md` + `SPRINT01_IMPLEMENTATION_PLAN.md` -> Thành `docs/sprints/sprint-01/SPRINT_01_MASTER_PLAN.md`

## 3. ARCHIVE (Đưa vào Lưu trữ)
Các tài liệu đã hết giá trị thực thi, nhưng cần giữ lại làm lịch sử:
- `POST_JSX_FILE_INVENTORY.md` (Đã có ý nghĩa lịch sử sau Migration, không còn áp dụng lúc này) -> `docs/archive/`
- `DEPENDENCY_AUDIT.md` (Đợt audit của riêng đợt cài đặt SweetAlert2) -> `docs/archive/`

## 4. DELETE (Xóa bỏ)
Hiện tại chưa phát hiện tài liệu nào hoàn toàn sai lệch hoặc hỏng để phải XÓA. Hệ thống file Markdown rất nhẹ, nên giải pháp ưu tiên là `ARCHIVE` hoặc `MERGE` thay vì `DELETE` vĩnh viễn.
