# TEAM HANDOVER PACKAGE

Tài liệu này đóng vai trò như một bộ giao việc (Handover) để phân luồng người đọc. Thay vì bị ngộp trong hàng chục tài liệu, mỗi vai trò trong Team chỉ cần bắt đầu đọc từ các tài liệu được chỉ định dưới đây.

## 1. Dành cho Team Lead / Architect
Bạn là người chịu trách nhiệm giữ gìn toàn vẹn kiến trúc, hãy đọc:
1. `docs/governance/RULES.md`
2. `docs/project/01_PROJECT_CONSTITUTION.md`
3. `docs/project/13_TEAM_EXECUTION_PLAN.md`
4. `docs/project/ROADMAP_V2.md`
5. `docs/architecture/SYSTEM_REDESIGN_PROPOSAL.md`

## 2. Dành cho Frontend Developer (Nói chung)
Trước khi nhận ticket, hãy nắm vững chuẩn mực:
1. `docs/governance/RULES.md` (Tuyệt đối không được làm Frontend đi lệch Backend).
2. `docs/project/12_DEVELOPER_ONBOARDING_GUIDE.md`
3. `docs/project/05_FRONTEND_CODING_STANDARD.md`
4. `docs/project/06_PR_REVIEW_CHECKLIST.md`

## 3. Dành cho Developer bảo trì Sprint cũ
Nếu bạn cần debug hoặc mở rộng các tính năng đã làm:
- **Sprint 01 (Provider/Service):** Đọc `docs/sprints/sprint-01/SPRINT01_IMPLEMENTATION_PLAN.md` và `docs/sprints/sprint-01/PROVIDER_SERVICE_AUDIT.md`.
- **Sprint 02 (Community/Review):** Đọc `docs/sprints/sprint-02/COMMUNITY_AUDIT_REPORT.md` và `docs/sprints/sprint-02/LIKE_API_STRATEGY.md`.

## 4. Dành cho QA / Tester
Để test và verify đúng chuẩn, hãy dùng:
1. `docs/project/11_DATABASE_BUSINESS_MAPPING.md` (Để đối chiếu Database xem ghi nhận đúng không).
2. `docs/project/04_CRD_TRACEABILITY_MATRIX.md` (Để soi chiếu giao diện với đặc tả ban đầu).
3. Các báo cáo Signoff: `docs/sprints/sprint-01/SPRINT_01_FINAL_SIGNOFF.md` và `docs/sprints/sprint-02/SPRINT_02_FINAL_SIGNOFF.md`.

**CHÚ Ý:**
Nếu trong quá trình làm việc cần tìm file cụ thể nào đó, hãy tham khảo `DOCUMENT_INDEX.md` ở ngoài Root directory.
