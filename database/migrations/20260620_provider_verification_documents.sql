SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;

IF OBJECT_ID(N'[dbo].[HO_SO_XAC_MINH_NCC]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[HO_SO_XAC_MINH_NCC]
    (
        [ma_ho_so] INT IDENTITY(1,1) NOT NULL,
        [ma_nha_cung_cap] INT NOT NULL,
        [loai_giay_to] NVARCHAR(50) NOT NULL,
        [ten_tep_goc] NVARCHAR(255) NOT NULL,
        [ten_tep_luu] VARCHAR(255) NOT NULL,
        [loai_noi_dung] VARCHAR(100) NOT NULL,
        [kich_thuoc] BIGINT NOT NULL,
        [trang_thai] NVARCHAR(30) NOT NULL
            CONSTRAINT [DF_HSXMNCC_TRANG_THAI] DEFAULT N'SUBMITTED',
        [ngay_nop] DATETIME2 NOT NULL
            CONSTRAINT [DF_HSXMNCC_NGAY_NOP] DEFAULT SYSUTCDATETIME(),
        [ngay_cap_nhat] DATETIME2 NOT NULL
            CONSTRAINT [DF_HSXMNCC_NGAY_CAP_NHAT] DEFAULT SYSUTCDATETIME(),
        CONSTRAINT [PK_HO_SO_XAC_MINH_NCC] PRIMARY KEY ([ma_ho_so]),
        CONSTRAINT [FK_HSXMNCC_NHA_CUNG_CAP]
            FOREIGN KEY ([ma_nha_cung_cap])
            REFERENCES [dbo].[NHA_CUNG_CAP] ([ma_nha_cung_cap])
            ON DELETE CASCADE,
        CONSTRAINT [CK_HSXMNCC_LOAI]
            CHECK ([loai_giay_to] IN (N'BUSINESS_LICENSE', N'TAX_REGISTRATION', N'IDENTITY')),
        CONSTRAINT [CK_HSXMNCC_TRANG_THAI]
            CHECK ([trang_thai] IN (N'SUBMITTED', N'APPROVED', N'REJECTED', N'REPLACED')),
        CONSTRAINT [CK_HSXMNCC_KICH_THUOC]
            CHECK ([kich_thuoc] > 0 AND [kich_thuoc] <= 5242880)
    );

    CREATE INDEX [IX_HSXMNCC_PROVIDER_TYPE_STATUS]
        ON [dbo].[HO_SO_XAC_MINH_NCC] ([ma_nha_cung_cap], [loai_giay_to], [trang_thai]);
END;

COMMIT TRANSACTION;
GO
