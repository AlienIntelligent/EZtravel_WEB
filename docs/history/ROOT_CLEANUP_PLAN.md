# ROOT CLEANUP PLAN

## Mục tiêu
Root Directory (`d:\eztravel\`) chỉ còn lại các file cấu hình, build, và các file Index quan trọng nhất để Onboarding. Mọi báo cáo, phân tích và lịch sử đều phải được lưu trữ đúng nơi quy định trong `docs/`.

## Danh sách Hành động Cụ thể (Execution Plan)

### 1. DELETE (Xóa vì đã có bản sao an toàn trong `docs/`)
- `ARCHITECTURE_REVIEW.md`
- `COMMUNITY_API_INVENTORY.md`
- `COMMUNITY_AUDIT_REPORT.md`
- `COMMUNITY_GAP_ANALYSIS.md`
- `CURRENT_STATE_ANALYSIS.md`
- `DEPENDENCY_AUDIT.md`
- `DESIGN_SYSTEM_AUDIT.md`
- `DTO_PAYLOAD_AUDIT.md`
- `DTO_VALIDATION_AUDIT.md`
- `ESLINT_DEBT_REPORT.md`
- `IMPORT_AUDIT_REPORT.md`
- `JSX_MIGRATION_AUDIT.md`
- `JSX_UI_MIGRATION_REPORT.md`
- `MANUAL_CRUD_VERIFICATION.md`
- `MULTI_AGENT_AUDIT.md`
- `NOTIFICATION_STRATEGY.md`
- `POST_JSX_FILE_INVENTORY.md`
- `POST_JSX_MIGRATION_AUDIT.md`
- `PROVIDER_SERVICE_AUDIT.md`
- `REDUX_AUDIT_REPORT.md`
- `ROADMAP_V2.md`
- `ROUTING_AUDIT_REPORT.md`
- `RTK_QUERY_AUDIT_REPORT.md`
- `RULES.md`
- `SPRINT01_GAP_ANALYSIS.md`
- `SPRINT01_IMPLEMENTATION_PLAN.md`
- `SPRINT_01_COMPLETION_REPORT.md`
- `SPRINT_01_EXECUTION_SPEC.md`
- `SPRINT_01_FINAL_SIGNOFF.md`
- `SPRINT_02_IMPLEMENTATION_PLAN.md`
- `SYSTEM_INVENTORY_REPORT.md`
- `SYSTEM_REDESIGN_PROPOSAL.md`
- `TECH_DEBT_BACKLOG.md`

### 2. MOVE (Di chuyển file mới sinh ra vào `docs/`)
- `COMMUNITY_IMPLEMENTATION_REPORT.md` -> `docs/sprints/sprint-02/`
- `FEED_DETAIL_AUDIT.md` -> `docs/sprints/sprint-02/`
- `LIKE_API_STRATEGY.md` -> `docs/sprints/sprint-02/`
- `NOTIFICATION_INTEGRATION_AUDIT.md` -> `docs/sprints/sprint-02/`
- `REVIEW_FLOW_AUDIT.md` -> `docs/sprints/sprint-02/`
- `SPRINT_02_FINAL_SIGNOFF.md` -> `docs/sprints/sprint-02/`

### 3. ARCHIVE (Đưa vào lịch sử)
- `DOCUMENT_MOVE_PLAN_FINAL.md` -> `docs/history/`
- `DOCUMENT_REFERENCE_RISK_REPORT.md` -> `docs/history/`
- `FINAL_DOCUMENT_INVENTORY.md` -> `docs/history/`
- `FINAL_DUPLICATE_ANALYSIS.md` -> `docs/history/`

### 4. RETAIN (Giữ lại Root)
- `DOCUMENT_INDEX.md` (Được cập nhật)
- `DOCUMENT_STRUCTURE_V2.md` (Được cập nhật)
- `READING_ORDER.md` (Được cập nhật)
- `TEAM_HANDOVER_PACKAGE.md` (Tạo mới)
- `REPOSITORY_CLEANUP_REPORT.md` (Tạo mới)
- `.gitignore`, `package.json`, `docker-compose.yml`, `README.md`...

## Trạng thái thực thi:
Sau khi duyệt Plan này, Agent sẽ thực thi lệnh di chuyển và xóa thực sự trong File System.
