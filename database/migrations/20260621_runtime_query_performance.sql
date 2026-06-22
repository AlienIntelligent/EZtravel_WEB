SET XACT_ABORT ON;
GO

ALTER DATABASE [EZTravel] SET AUTO_CLOSE OFF;
GO

BEGIN TRANSACTION;

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'[dbo].[CHI_PHI_DICH_VU_LICH_TRINH]')
      AND name = N'IX_CPDVLT_DICH_VU_LICH_TRINH'
)
BEGIN
    CREATE INDEX [IX_CPDVLT_DICH_VU_LICH_TRINH]
        ON [dbo].[CHI_PHI_DICH_VU_LICH_TRINH] ([ma_dich_vu_lich_trinh]);
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'[dbo].[CHIA_SE_LICH_TRINH]')
      AND name = N'IX_CSLT_NGUOI_DUNG_LICH_TRINH'
)
BEGIN
    CREATE INDEX [IX_CSLT_NGUOI_DUNG_LICH_TRINH]
        ON [dbo].[CHIA_SE_LICH_TRINH] ([ma_nguoi_dung], [ma_lich_trinh]);
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE object_id = OBJECT_ID(N'[dbo].[LICH_TRINH]')
      AND name = N'IX_LICH_TRINH_USER_STATUS_UPDATED'
)
BEGIN
    CREATE INDEX [IX_LICH_TRINH_USER_STATUS_UPDATED]
        ON [dbo].[LICH_TRINH] ([ma_nguoi_dung], [trang_thai], [ngay_cap_nhat] DESC)
        INCLUDE ([ma_lich_trinh]);
END;

COMMIT TRANSACTION;
GO
