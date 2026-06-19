using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace ezTravel.Libs.Migrations
{
    /// <inheritdoc />
    public partial class AddBusinessCoverageEntitiesV3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DANH_MUC_DICH_VU",
                columns: table => new
                {
                    ma_danh_muc = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ten_danh_muc = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    hien_thi = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DANH_MUC_DICH_VU", x => x.ma_danh_muc);
                });

            migrationBuilder.CreateTable(
                name: "LOAI_DIA_DIEM",
                columns: table => new
                {
                    ma_loai = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ten_loai = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    bieu_tuong = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LOAI_DIA_DIEM", x => x.ma_loai);
                });

            migrationBuilder.CreateTable(
                name: "MA_GIAM_GIA",
                columns: table => new
                {
                    ma_giam_gia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    phan_tram_giam = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    so_tien_giam = table.Column<decimal>(type: "decimal(15,2)", nullable: true),
                    so_luong_toi_da = table.Column<int>(type: "int", nullable: true),
                    so_luong_da_dung = table.Column<int>(type: "int", nullable: false),
                    ngay_bat_dau = table.Column<DateOnly>(type: "date", nullable: false),
                    ngay_het_han = table.Column<DateOnly>(type: "date", nullable: false),
                    da_xoa = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MA_GIAM_GIA", x => x.ma_giam_gia);
                });

            migrationBuilder.CreateTable(
                name: "NGUOI_DUNG",
                columns: table => new
                {
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ho_ten = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    mat_khau = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    so_dien_thoai = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: true),
                    ngay_sinh = table.Column<DateOnly>(type: "date", nullable: true),
                    avatar = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    vai_tro = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Traveler"),
                    trang_thai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "HoatDong"),
                    ngay_tao = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "GETUTCDATE()"),
                    da_xoa = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NGUOI_DUNG", x => x.ma_nguoi_dung);
                });

            migrationBuilder.CreateTable(
                name: "DIA_DIEM",
                columns: table => new
                {
                    ma_dia_diem = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ten_dia_diem = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    mo_ta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    dia_chi = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    tinh_thanh = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    quoc_gia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ma_loai_dia_diem = table.Column<int>(type: "int", nullable: true),
                    toa_do = table.Column<Geometry>(type: "geography", nullable: true),
                    ngay_tao = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    da_xoa = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DIA_DIEM", x => x.ma_dia_diem);
                    table.ForeignKey(
                        name: "FK_DIA_DIEM_LOAI_DIA_DIEM_ma_loai_dia_diem",
                        column: x => x.ma_loai_dia_diem,
                        principalTable: "LOAI_DIA_DIEM",
                        principalColumn: "ma_loai");
                });

            migrationBuilder.CreateTable(
                name: "DON_DAT",
                columns: table => new
                {
                    ma_don = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: false),
                    ma_giam_gia = table.Column<int>(type: "int", nullable: true),
                    tong_tien = table.Column<decimal>(type: "decimal(15,2)", nullable: true),
                    trang_thai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "ChoDuyet"),
                    ngay_dat = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DON_DAT", x => x.ma_don);
                    table.ForeignKey(
                        name: "FK_DON_DAT_MA_GIAM_GIA_ma_giam_gia",
                        column: x => x.ma_giam_gia,
                        principalTable: "MA_GIAM_GIA",
                        principalColumn: "ma_giam_gia",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DON_DAT_NGUOI_DUNG_ma_nguoi_dung",
                        column: x => x.ma_nguoi_dung,
                        principalTable: "NGUOI_DUNG",
                        principalColumn: "ma_nguoi_dung",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LICH_TRINH",
                columns: table => new
                {
                    ma_lich_trinh = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: false),
                    ten_lich_trinh = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    diem_den = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ngay_bat_dau = table.Column<DateOnly>(type: "date", nullable: false),
                    ngay_ket_thuc = table.Column<DateOnly>(type: "date", nullable: false),
                    so_nguoi = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    ngan_sach = table.Column<decimal>(type: "decimal(15,2)", nullable: true),
                    mo_ta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    trang_thai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Nhap"),
                    trang_thai_chia_se = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "RiengTu"),
                    ngay_tao = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    da_xoa = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LICH_TRINH", x => x.ma_lich_trinh);
                    table.ForeignKey(
                        name: "FK_LICH_TRINH_NGUOI_DUNG_ma_nguoi_dung",
                        column: x => x.ma_nguoi_dung,
                        principalTable: "NGUOI_DUNG",
                        principalColumn: "ma_nguoi_dung",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "THONG_BAO",
                columns: table => new
                {
                    ma_thong_bao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: false),
                    tieu_de = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    noi_dung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    loai_thong_bao = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    da_doc = table.Column<bool>(type: "bit", nullable: false),
                    ngay_tao = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_THONG_BAO", x => x.ma_thong_bao);
                    table.ForeignKey(
                        name: "FK_THONG_BAO_NGUOI_DUNG_ma_nguoi_dung",
                        column: x => x.ma_nguoi_dung,
                        principalTable: "NGUOI_DUNG",
                        principalColumn: "ma_nguoi_dung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DICH_VU",
                columns: table => new
                {
                    ma_dich_vu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_danh_muc = table.Column<int>(type: "int", nullable: false),
                    ma_dia_diem = table.Column<int>(type: "int", nullable: false),
                    ten_dich_vu = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    mo_ta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    gia_tien = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    so_luong_toi_da = table.Column<int>(type: "int", nullable: true),
                    ngay_tao = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    da_xoa = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DICH_VU", x => x.ma_dich_vu);
                    table.ForeignKey(
                        name: "FK_DICH_VU_DANH_MUC_DICH_VU_ma_danh_muc",
                        column: x => x.ma_danh_muc,
                        principalTable: "DANH_MUC_DICH_VU",
                        principalColumn: "ma_danh_muc",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DICH_VU_DIA_DIEM_ma_dia_diem",
                        column: x => x.ma_dia_diem,
                        principalTable: "DIA_DIEM",
                        principalColumn: "ma_dia_diem",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "THANH_TOAN",
                columns: table => new
                {
                    ma_thanh_toan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_don = table.Column<int>(type: "int", nullable: false),
                    phuong_thuc_thanh_toan = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    so_tien = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    trang_thai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "ChoDuyet"),
                    ma_giao_dich = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ngay_thanh_toan = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_THANH_TOAN", x => x.ma_thanh_toan);
                    table.ForeignKey(
                        name: "FK_THANH_TOAN_DON_DAT_ma_don",
                        column: x => x.ma_don,
                        principalTable: "DON_DAT",
                        principalColumn: "ma_don",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BINH_LUAN",
                columns: table => new
                {
                    ma_binh_luan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: false),
                    ma_lich_trinh = table.Column<int>(type: "int", nullable: false),
                    noi_dung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ngay_tao = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BINH_LUAN", x => x.ma_binh_luan);
                    table.ForeignKey(
                        name: "FK_BINH_LUAN_LICH_TRINH_ma_lich_trinh",
                        column: x => x.ma_lich_trinh,
                        principalTable: "LICH_TRINH",
                        principalColumn: "ma_lich_trinh",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BINH_LUAN_NGUOI_DUNG_ma_nguoi_dung",
                        column: x => x.ma_nguoi_dung,
                        principalTable: "NGUOI_DUNG",
                        principalColumn: "ma_nguoi_dung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LUOT_THICH",
                columns: table => new
                {
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: false),
                    ma_lich_trinh = table.Column<int>(type: "int", nullable: false),
                    ngay_tao = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LUOT_THICH", x => new { x.ma_nguoi_dung, x.ma_lich_trinh });
                    table.ForeignKey(
                        name: "FK_LUOT_THICH_LICH_TRINH_ma_lich_trinh",
                        column: x => x.ma_lich_trinh,
                        principalTable: "LICH_TRINH",
                        principalColumn: "ma_lich_trinh",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LUOT_THICH_NGUOI_DUNG_ma_nguoi_dung",
                        column: x => x.ma_nguoi_dung,
                        principalTable: "NGUOI_DUNG",
                        principalColumn: "ma_nguoi_dung",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CHI_TIET_DON_DAT",
                columns: table => new
                {
                    ma_chi_tiet = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_don = table.Column<int>(type: "int", nullable: false),
                    ma_dich_vu = table.Column<int>(type: "int", nullable: false),
                    so_luong = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    don_gia = table.Column<decimal>(type: "decimal(15,2)", nullable: false),
                    ngay_bat_dau = table.Column<DateOnly>(type: "date", nullable: true),
                    ngay_ket_thuc = table.Column<DateOnly>(type: "date", nullable: true),
                    thanh_tien = table.Column<decimal>(type: "decimal(15,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHI_TIET_DON_DAT", x => x.ma_chi_tiet);
                    table.ForeignKey(
                        name: "FK_CHI_TIET_DON_DAT_DICH_VU_ma_dich_vu",
                        column: x => x.ma_dich_vu,
                        principalTable: "DICH_VU",
                        principalColumn: "ma_dich_vu",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CHI_TIET_DON_DAT_DON_DAT_ma_don",
                        column: x => x.ma_don,
                        principalTable: "DON_DAT",
                        principalColumn: "ma_don",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CHI_TIET_LICH_TRINH",
                columns: table => new
                {
                    ma_chi_tiet = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_lich_trinh = table.Column<int>(type: "int", nullable: false),
                    ma_dia_diem = table.Column<int>(type: "int", nullable: false),
                    ma_dich_vu = table.Column<int>(type: "int", nullable: true),
                    ngay_trong_lich_trinh = table.Column<DateOnly>(type: "date", nullable: true),
                    gio_bat_dau = table.Column<TimeOnly>(type: "time", nullable: true),
                    thu_tu = table.Column<int>(type: "int", nullable: false),
                    ghi_chu = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CHI_TIET_LICH_TRINH", x => x.ma_chi_tiet);
                    table.ForeignKey(
                        name: "FK_CHI_TIET_LICH_TRINH_DIA_DIEM_ma_dia_diem",
                        column: x => x.ma_dia_diem,
                        principalTable: "DIA_DIEM",
                        principalColumn: "ma_dia_diem",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CHI_TIET_LICH_TRINH_DICH_VU_ma_dich_vu",
                        column: x => x.ma_dich_vu,
                        principalTable: "DICH_VU",
                        principalColumn: "ma_dich_vu",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_CHI_TIET_LICH_TRINH_LICH_TRINH_ma_lich_trinh",
                        column: x => x.ma_lich_trinh,
                        principalTable: "LICH_TRINH",
                        principalColumn: "ma_lich_trinh",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DANH_GIA",
                columns: table => new
                {
                    ma_danh_gia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: false),
                    ma_dich_vu = table.Column<int>(type: "int", nullable: true),
                    ma_dia_diem = table.Column<int>(type: "int", nullable: true),
                    so_sao = table.Column<byte>(type: "tinyint", nullable: true),
                    binh_luan = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ngay_danh_gia = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DANH_GIA", x => x.ma_danh_gia);
                    table.ForeignKey(
                        name: "FK_DANH_GIA_DIA_DIEM_ma_dia_diem",
                        column: x => x.ma_dia_diem,
                        principalTable: "DIA_DIEM",
                        principalColumn: "ma_dia_diem",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DANH_GIA_DICH_VU_ma_dich_vu",
                        column: x => x.ma_dich_vu,
                        principalTable: "DICH_VU",
                        principalColumn: "ma_dich_vu",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DANH_GIA_NGUOI_DUNG_ma_nguoi_dung",
                        column: x => x.ma_nguoi_dung,
                        principalTable: "NGUOI_DUNG",
                        principalColumn: "ma_nguoi_dung",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "HINH_ANH",
                columns: table => new
                {
                    ma_hinh_anh = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_dich_vu = table.Column<int>(type: "int", nullable: true),
                    ma_dia_diem = table.Column<int>(type: "int", nullable: true),
                    duong_dan = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HINH_ANH", x => x.ma_hinh_anh);
                    table.ForeignKey(
                        name: "FK_HINH_ANH_DIA_DIEM_ma_dia_diem",
                        column: x => x.ma_dia_diem,
                        principalTable: "DIA_DIEM",
                        principalColumn: "ma_dia_diem",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_HINH_ANH_DICH_VU_ma_dich_vu",
                        column: x => x.ma_dich_vu,
                        principalTable: "DICH_VU",
                        principalColumn: "ma_dich_vu",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BINH_LUAN_ma_lich_trinh",
                table: "BINH_LUAN",
                column: "ma_lich_trinh");

            migrationBuilder.CreateIndex(
                name: "IX_BINH_LUAN_ma_nguoi_dung",
                table: "BINH_LUAN",
                column: "ma_nguoi_dung");

            migrationBuilder.CreateIndex(
                name: "IX_CHI_TIET_DON_DAT_ma_dich_vu",
                table: "CHI_TIET_DON_DAT",
                column: "ma_dich_vu");

            migrationBuilder.CreateIndex(
                name: "IX_CHI_TIET_DON_DAT_ma_don",
                table: "CHI_TIET_DON_DAT",
                column: "ma_don");

            migrationBuilder.CreateIndex(
                name: "IX_CHI_TIET_LICH_TRINH_ma_dia_diem",
                table: "CHI_TIET_LICH_TRINH",
                column: "ma_dia_diem");

            migrationBuilder.CreateIndex(
                name: "IX_CHI_TIET_LICH_TRINH_ma_dich_vu",
                table: "CHI_TIET_LICH_TRINH",
                column: "ma_dich_vu");

            migrationBuilder.CreateIndex(
                name: "IX_CHI_TIET_LICH_TRINH_ma_lich_trinh",
                table: "CHI_TIET_LICH_TRINH",
                column: "ma_lich_trinh");

            migrationBuilder.CreateIndex(
                name: "IX_DANH_GIA_ma_dia_diem",
                table: "DANH_GIA",
                column: "ma_dia_diem");

            migrationBuilder.CreateIndex(
                name: "IX_DANH_GIA_ma_dich_vu",
                table: "DANH_GIA",
                column: "ma_dich_vu");

            migrationBuilder.CreateIndex(
                name: "IX_DANH_GIA_ma_nguoi_dung",
                table: "DANH_GIA",
                column: "ma_nguoi_dung");

            migrationBuilder.CreateIndex(
                name: "IX_DIA_DIEM_ma_loai_dia_diem",
                table: "DIA_DIEM",
                column: "ma_loai_dia_diem");

            migrationBuilder.CreateIndex(
                name: "IX_DICH_VU_ma_danh_muc",
                table: "DICH_VU",
                column: "ma_danh_muc");

            migrationBuilder.CreateIndex(
                name: "IX_DICH_VU_ma_dia_diem",
                table: "DICH_VU",
                column: "ma_dia_diem");

            migrationBuilder.CreateIndex(
                name: "IX_DON_DAT_ma_giam_gia",
                table: "DON_DAT",
                column: "ma_giam_gia");

            migrationBuilder.CreateIndex(
                name: "IX_DON_DAT_ma_nguoi_dung",
                table: "DON_DAT",
                column: "ma_nguoi_dung");

            migrationBuilder.CreateIndex(
                name: "IX_HINH_ANH_ma_dia_diem",
                table: "HINH_ANH",
                column: "ma_dia_diem");

            migrationBuilder.CreateIndex(
                name: "IX_HINH_ANH_ma_dich_vu",
                table: "HINH_ANH",
                column: "ma_dich_vu");

            migrationBuilder.CreateIndex(
                name: "IX_LICH_TRINH_ma_nguoi_dung",
                table: "LICH_TRINH",
                column: "ma_nguoi_dung");

            migrationBuilder.CreateIndex(
                name: "IX_LUOT_THICH_ma_lich_trinh",
                table: "LUOT_THICH",
                column: "ma_lich_trinh");

            migrationBuilder.CreateIndex(
                name: "IX_MA_GIAM_GIA_ma_code",
                table: "MA_GIAM_GIA",
                column: "ma_code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NGUOI_DUNG_email",
                table: "NGUOI_DUNG",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_THANH_TOAN_ma_don",
                table: "THANH_TOAN",
                column: "ma_don");

            migrationBuilder.CreateIndex(
                name: "IX_THANH_TOAN_ma_giao_dich",
                table: "THANH_TOAN",
                column: "ma_giao_dich",
                unique: true,
                filter: "[ma_giao_dich] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_THONG_BAO_ma_nguoi_dung",
                table: "THONG_BAO",
                column: "ma_nguoi_dung");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BINH_LUAN");

            migrationBuilder.DropTable(
                name: "CHI_TIET_DON_DAT");

            migrationBuilder.DropTable(
                name: "CHI_TIET_LICH_TRINH");

            migrationBuilder.DropTable(
                name: "DANH_GIA");

            migrationBuilder.DropTable(
                name: "HINH_ANH");

            migrationBuilder.DropTable(
                name: "LUOT_THICH");

            migrationBuilder.DropTable(
                name: "THANH_TOAN");

            migrationBuilder.DropTable(
                name: "THONG_BAO");

            migrationBuilder.DropTable(
                name: "DICH_VU");

            migrationBuilder.DropTable(
                name: "LICH_TRINH");

            migrationBuilder.DropTable(
                name: "DON_DAT");

            migrationBuilder.DropTable(
                name: "DANH_MUC_DICH_VU");

            migrationBuilder.DropTable(
                name: "DIA_DIEM");

            migrationBuilder.DropTable(
                name: "MA_GIAM_GIA");

            migrationBuilder.DropTable(
                name: "NGUOI_DUNG");

            migrationBuilder.DropTable(
                name: "LOAI_DIA_DIEM");
        }
    }
}
