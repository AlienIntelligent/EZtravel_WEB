# DOCUMENT REORGANIZATION PLAN

Đề xuất cấu trúc thư mục mới để di chuyển các file tài liệu từ Root `d:\eztravel\` vào `docs/` nhằm giữ cho repository gọn gàng.

## Đề xuất Cấu trúc Thư mục `docs/`

```text
docs/
├── governance/                 # Quy tắc, Chiến lược, Backlog
│   ├── RULES.md
│   ├── TECH_DEBT_BACKLOG.md
│   ├── NOTIFICATION_STRATEGY.md
│   └── DOCUMENT_CLEANUP_PLAN.md
│
├── architecture/               # Kiến trúc, Inventory, Roadmap
│   ├── SYSTEM_INVENTORY_REPORT.md
│   ├── SYSTEM_REDESIGN_PROPOSAL.md
│   ├── ROADMAP_V2.md
│   ├── BACKEND_ANALYSIS_V2.md
│   ├── DATABASE_ANALYSIS_V2.md
│   └── FRONTEND_ANALYSIS_V2.md
│
├── analysis/                   # Các báo cáo phân tích tổng thể
│   ├── CURRENT_STATE_ANALYSIS.md
│   ├── CORE_BUSINESS_ANALYSIS.md
│   ├── BUSINESS_IMPACT_MATRIX.md
│   ├── MULTI_AGENT_AUDIT.md
│   ├── DOMAIN_SCORECARD.md
│   └── CRD_GAP_ANALYSIS_V2.md
│
├── sprints/                    # Kế hoạch và Báo cáo theo từng Sprint
│   ├── sprint-01/
│   │   ├── SPRINT_01_EXECUTION_SPEC.md
│   │   ├── SPRINT01_IMPLEMENTATION_PLAN.md
│   │   ├── SPRINT01_GAP_ANALYSIS.md
│   │   ├── PROVIDER_SERVICE_AUDIT.md
│   │   ├── DTO_VALIDATION_AUDIT.md
│   │   ├── DTO_PAYLOAD_AUDIT.md
│   │   ├── MANUAL_CRUD_VERIFICATION.md
│   │   ├── SPRINT_01_COMPLETION_REPORT.md
│   │   └── SPRINT_01_FINAL_SIGNOFF.md
│   │
│   └── sprint-02/
│       ├── COMMUNITY_AUDIT_REPORT.md
│       ├── COMMUNITY_API_INVENTORY.md
│       ├── COMMUNITY_GAP_ANALYSIS.md
│       └── SPRINT_02_IMPLEMENTATION_PLAN.md
│
├── migrations/                 # Lịch sử chuyển đổi (JSX Migration)
│   ├── JSX_UI_MIGRATION_REPORT.md
│   ├── JSX_MIGRATION_AUDIT.md
│   ├── POST_JSX_FILE_INVENTORY.md
│   └── POST_JSX_MIGRATION_AUDIT.md
│
├── audits/                     # Báo cáo Audit Component/Thư viện
│   ├── DESIGN_SYSTEM_AUDIT.md
│   ├── IMPORT_AUDIT_REPORT.md
│   ├── ROUTING_AUDIT_REPORT.md
│   ├── REDUX_AUDIT_REPORT.md
│   ├── RTK_QUERY_AUDIT_REPORT.md
│   ├── ESLINT_DEBT_REPORT.md
│   ├── DEPENDENCY_AUDIT.md
│   └── FRONTEND_POST_MIGRATION_GAP_ANALYSIS.md
│
└── archive/                    # Tài liệu cũ, nháp
    └── (Các tài liệu lỗi thời hoặc Version cũ)
```

## Lưu ý
*Không áp dụng di chuyển (MOVE) ngay lập tức.* Cấu trúc trên chỉ là bản phác thảo chờ phê duyệt từ Team Lead.
