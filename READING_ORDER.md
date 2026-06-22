# EZTRAVEL READING ORDER

Để bắt đầu làm việc với dự án EZTravel, hãy đọc các tài liệu theo đúng thứ tự dưới đây để tránh hiểu sai kiến trúc và luật lệ.

## 1. Nền tảng bắt buộc (Tất cả mọi người phải đọc)
1. `docs/governance/RULES.md`: Chân lý nghiệp vụ, luật ưu tiên dữ liệu tối thượng (DB > CRD > Backend > Frontend). Không ai được vi phạm.
2. `docs/project/01_PROJECT_CONSTITUTION.md`: Tầm nhìn cốt lõi và kiến trúc vĩ mô.
3. `docs/project/12_DEVELOPER_ONBOARDING_GUIDE.md`: Cẩm nang Onboarding chung.
4. `docs/project/05_FRONTEND_CODING_STANDARD.md`: Chuẩn viết code Frontend thống nhất.
5. `docs/project/06_PR_REVIEW_CHECKLIST.md`: Checklist tự kiểm tra trước khi tạo Pull Request.

## 2. Kiến trúc & Phân tích Hiện trạng (Cho Lead / Architect)
1. `docs/architecture/SYSTEM_INVENTORY_REPORT.md`: Toàn cảnh các Microservices và Frontend đang có.
2. `docs/project/02_SYSTEM_BASELINE.md` & `03_CURRENT_REALITY_REPORT.md`: Giới hạn Baseline của hệ thống.
3. `docs/project/10_BACKEND_API_CATALOG.md`: Mapping Backend API hiện có.
4. `docs/project/04_CRD_TRACEABILITY_MATRIX.md` & `11_DATABASE_BUSINESS_MAPPING.md`: Ánh xạ dữ liệu Database vào nghiệp vụ.
5. `docs/architecture/ARCHITECTURE_REVIEW.md`: Báo cáo đánh giá cấu trúc chi tiết.

## 3. Nhật ký thi công các Sprint (Cho Developer tham khảo code)
**Sprint 01: Provider Service UI**
- Đọc `docs/sprints/sprint-01/SPRINT01_IMPLEMENTATION_PLAN.md` và `SPRINT_01_FINAL_SIGNOFF.md` để hiểu quy trình Audit và Implement tuân thủ luật.

**Sprint 02: Community & Review Core**
- Đọc `docs/sprints/sprint-02/SPRINT_02_IMPLEMENTATION_PLAN.md` và `COMMUNITY_IMPLEMENTATION_REPORT.md`.
- Đặc biệt xem `LIKE_API_STRATEGY.md` để học mẫu thiết kế Optimistic Update trên RTK Query.

## 4. Quản lý Tài liệu
- `DOCUMENT_INDEX.md`: Mục lục toàn bộ dự án. Khi cần tìm file nào hãy tra cứu tại đây.
- `TEAM_HANDOVER_PACKAGE.md`: Hướng dẫn chuyển giao cho các thành viên.
