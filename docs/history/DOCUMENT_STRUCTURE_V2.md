# EZTRAVEL DOCUMENT STRUCTURE V2

Kiến trúc cây thư mục tài liệu chính thức:

```text
d:\eztravel\
├── README.md                 (Thông tin dự án chung)
├── DOCUMENT_INDEX.md         (Mục lục toàn thư)
├── READING_ORDER.md          (Thứ tự đọc bắt buộc)
├── TEAM_HANDOVER_PACKAGE.md  (Gói chuyển giao)
├── REPOSITORY_CLEANUP_REPORT.md (Báo cáo dọn dẹp)
└── docs/
    ├── project/              (Quy chuẩn, nguyên tắc, hiến pháp dự án)
    ├── governance/           (Luật lõi và chiến lược quản trị)
    ├── architecture/         (Review cấu trúc kỹ thuật)
    ├── analysis/             (Phân tích Domain, Gap Analysis)
    ├── audits/               (Báo cáo Audit độc lập)
    ├── migrations/           (Lịch sử Migration React TSX -> JSX)
    ├── sprints/
    │   ├── sprint-01/        (Toàn bộ tài liệu Sprint 01)
    │   └── sprint-02/        (Toàn bộ tài liệu Sprint 02)
    └── history/              (Các báo cáo trung gian đã hết giá trị)
```

**Nguyên tắc Tương lai:**
1. Tất cả Sprint Report mới (Sprint 03 trở đi) phải được lưu vào `docs/sprints/sprint-XX/`.
2. Bất kỳ phân tích chung nào mới phải cho vào `docs/analysis/` hoặc `docs/architecture/`.
3. Tuyệt đối KHÔNG tạo file Markdown rác ngoài Root repository (trừ trường hợp Index File bắt buộc).
