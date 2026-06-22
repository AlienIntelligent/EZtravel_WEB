SET XACT_ABORT ON;
GO

IF OBJECT_ID(N'dbo.BINH_LUAN_LICH_TRINH', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.BINH_LUAN_LICH_TRINH
    (
        ma_binh_luan INT IDENTITY(1, 1) NOT NULL,
        ma_lich_trinh INT NOT NULL,
        ma_nguoi_dung INT NOT NULL,
        noi_dung NVARCHAR(1000) NOT NULL,
        trang_thai NVARCHAR(20) NOT NULL
            CONSTRAINT DF_BLLT_TRANG_THAI DEFAULT N'ACTIVE',
        ngay_tao DATETIME2(7) NOT NULL
            CONSTRAINT DF_BLLT_NGAY_TAO DEFAULT SYSUTCDATETIME(),
        ngay_cap_nhat DATETIME2(7) NOT NULL
            CONSTRAINT DF_BLLT_NGAY_CAP_NHAT DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_BINH_LUAN_LICH_TRINH PRIMARY KEY CLUSTERED (ma_binh_luan),
        CONSTRAINT FK_BLLT_LICH_TRINH FOREIGN KEY (ma_lich_trinh)
            REFERENCES dbo.LICH_TRINH(ma_lich_trinh),
        CONSTRAINT FK_BLLT_NGUOI_DUNG FOREIGN KEY (ma_nguoi_dung)
            REFERENCES dbo.NGUOI_DUNG(ma_nguoi_dung),
        CONSTRAINT CK_BLLT_NOI_DUNG CHECK
            (LEN(LTRIM(RTRIM(noi_dung))) BETWEEN 1 AND 1000),
        CONSTRAINT CK_BLLT_TRANG_THAI CHECK
            (trang_thai IN (N'ACTIVE', N'DELETED'))
    );
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.BINH_LUAN_LICH_TRINH')
      AND name = N'IX_BLLT_LICH_TRINH_NGAY_TAO'
)
BEGIN
    CREATE INDEX IX_BLLT_LICH_TRINH_NGAY_TAO
        ON dbo.BINH_LUAN_LICH_TRINH(ma_lich_trinh, ngay_tao, ma_binh_luan)
        INCLUDE (ma_nguoi_dung, trang_thai);
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'dbo.BINH_LUAN_LICH_TRINH')
      AND name = N'IX_BLLT_NGUOI_DUNG'
)
BEGIN
    CREATE INDEX IX_BLLT_NGUOI_DUNG
        ON dbo.BINH_LUAN_LICH_TRINH(ma_nguoi_dung);
END;
GO
