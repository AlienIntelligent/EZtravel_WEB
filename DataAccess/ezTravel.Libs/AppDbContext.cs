using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ezTravel.Entities;

namespace ezTravel.Libs;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AnhBaiViet> AnhBaiViet { get; set; }

    public virtual DbSet<AnhDanhGia> AnhDanhGia { get; set; }

    public virtual DbSet<AnhDiaDiem> AnhDiaDiem { get; set; }

    public virtual DbSet<AnhDichVu> AnhDichVu { get; set; }

    public virtual DbSet<BaiViet> BaiViet { get; set; }

    public virtual DbSet<BaoCaoNoiDung> BaoCaoNoiDung { get; set; }

    public virtual DbSet<BinhLuanBaiViet> BinhLuanBaiViet { get; set; }

    public virtual DbSet<BinhLuanLichTrinh> BinhLuanLichTrinh { get; set; }

    public virtual DbSet<ChiPhiDichVuLichTrinh> ChiPhiDichVuLichTrinh { get; set; }

    public virtual DbSet<ChiaSeLichTrinh> ChiaSeLichTrinh { get; set; }

    public virtual DbSet<DangKyGoi> DangKyGoi { get; set; }

    public virtual DbSet<DangKyGoiNcc> DangKyGoiNcc { get; set; }

    public virtual DbSet<DanhGia> DanhGia { get; set; }

    public virtual DbSet<DiaDiem> DiaDiem { get; set; }

    public virtual DbSet<DiaDiemLichTrinh> DiaDiemLichTrinh { get; set; }

    public virtual DbSet<DichVu> DichVu { get; set; }

    public virtual DbSet<DichVuLichTrinh> DichVuLichTrinh { get; set; }

    public virtual DbSet<DuyetNoiDung> DuyetNoiDung { get; set; }

    public virtual DbSet<GoiDichVu> GoiDichVu { get; set; }

    public virtual DbSet<GoiDichVuNcc> GoiDichVuNcc { get; set; }

    public virtual DbSet<HoSoXacMinhNcc> HoSoXacMinhNcc { get; set; }

    public virtual DbSet<LichSuAi> LichSuAi { get; set; }

    public virtual DbSet<LichSuClone> LichSuClone { get; set; }

    public virtual DbSet<LichTrinh> LichTrinh { get; set; }

    public virtual DbSet<LuuLichTrinh> LuuLichTrinh { get; set; }

    public virtual DbSet<NgayLichTrinh> NgayLichTrinh { get; set; }

    public virtual DbSet<NguoiDung> NguoiDung { get; set; }

    public virtual DbSet<NhaCungCap> NhaCungCap { get; set; }

    public virtual DbSet<OtpXacThuc> OtpXacThuc { get; set; }

    public virtual DbSet<PhanHoiDanhGia> PhanHoiDanhGia { get; set; }

    public virtual DbSet<RefreshToken> RefreshToken { get; set; }

    public virtual DbSet<Tag> Tag { get; set; }

    public virtual DbSet<ThanhToanNcc> ThanhToanNcc { get; set; }

    public virtual DbSet<TheoDoiNguoiDung> TheoDoiNguoiDung { get; set; }

    public virtual DbSet<ThichBaiViet> ThichBaiViet { get; set; }

    public virtual DbSet<ThichLichTrinh> ThichLichTrinh { get; set; }

    public virtual DbSet<ThongBao> ThongBao { get; set; }

    public virtual DbSet<TinhThanh> TinhThanh { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (optionsBuilder.IsConfigured) return;

        var connectionString = Environment.GetEnvironmentVariable("EZTRAVEL_DEFAULT_CONNECTION");
        if (!string.IsNullOrWhiteSpace(connectionString))
        {
            optionsBuilder.UseSqlServer(connectionString, x => x.UseNetTopologySuite());
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AnhBaiViet>(entity =>
        {
            entity.HasKey(e => e.MaAnh).HasName("PK__ANH_BAI___06C6A46384D725F4");

            entity.ToTable("ANH_BAI_VIET");

            entity.Property(e => e.MaAnh).HasColumnName("ma_anh");
            entity.Property(e => e.MaBaiViet).HasColumnName("ma_bai_viet");
            entity.Property(e => e.ThuTu)
                .HasDefaultValue(1)
                .HasColumnName("thu_tu");
            entity.Property(e => e.UrlAnh)
                .HasMaxLength(1000)
                .HasColumnName("url_anh");

            entity.HasOne(d => d.MaBaiVietNavigation).WithMany(p => p.AnhBaiViet)
                .HasForeignKey(d => d.MaBaiViet)
                .HasConstraintName("FK_ANH_BAI_VIET");
        });

        modelBuilder.Entity<AnhDanhGia>(entity =>
        {
            entity.HasKey(e => e.MaAnh).HasName("PK__ANH_DANH__06C6A463AC607E0E");

            entity.ToTable("ANH_DANH_GIA");

            entity.Property(e => e.MaAnh).HasColumnName("ma_anh");
            entity.Property(e => e.MaDanhGia).HasColumnName("ma_danh_gia");
            entity.Property(e => e.UrlAnh)
                .HasMaxLength(1000)
                .HasColumnName("url_anh");

            entity.HasOne(d => d.MaDanhGiaNavigation).WithMany(p => p.AnhDanhGia)
                .HasForeignKey(d => d.MaDanhGia)
                .HasConstraintName("FK_ANH_DANH_GIA");
        });

        modelBuilder.Entity<AnhDiaDiem>(entity =>
        {
            entity.HasKey(e => e.MaAnh).HasName("PK__ANH_DIA___06C6A4633BA33D72");

            entity.ToTable("ANH_DIA_DIEM");

            entity.Property(e => e.MaAnh).HasColumnName("ma_anh");
            entity.Property(e => e.MaDiaDiem).HasColumnName("ma_dia_diem");
            entity.Property(e => e.ThuTu)
                .HasDefaultValue(1)
                .HasColumnName("thu_tu");
            entity.Property(e => e.UrlAnh)
                .HasMaxLength(1000)
                .HasColumnName("url_anh");

            entity.HasOne(d => d.MaDiaDiemNavigation).WithMany(p => p.AnhDiaDiem)
                .HasForeignKey(d => d.MaDiaDiem)
                .HasConstraintName("FK_ANH_DIA_DIEM");
        });

        modelBuilder.Entity<AnhDichVu>(entity =>
        {
            entity.HasKey(e => e.MaAnh).HasName("PK__ANH_DICH__06C6A46304C359F3");

            entity.ToTable("ANH_DICH_VU");

            entity.Property(e => e.MaAnh).HasColumnName("ma_anh");
            entity.Property(e => e.MaDichVu).HasColumnName("ma_dich_vu");
            entity.Property(e => e.ThuTu)
                .HasDefaultValue(1)
                .HasColumnName("thu_tu");
            entity.Property(e => e.UrlAnh)
                .HasMaxLength(1000)
                .HasColumnName("url_anh");

            entity.HasOne(d => d.MaDichVuNavigation).WithMany(p => p.AnhDichVu)
                .HasForeignKey(d => d.MaDichVu)
                .HasConstraintName("FK_ANH_DICH_VU");
        });

        modelBuilder.Entity<BaiViet>(entity =>
        {
            entity.HasKey(e => e.MaBaiViet).HasName("PK__BAI_VIET__E94955570CBE97B3");

            entity.ToTable("BAI_VIET", tb => tb.HasTrigger("TRG_BAI_VIET_UPDATED"));

            entity.HasIndex(e => e.MaDiaDiem, "IX_BAI_VIET_DIA_DIEM");

            entity.HasIndex(e => e.MaNguoiDung, "IX_BAI_VIET_NGUOI_DUNG");

            entity.HasIndex(e => e.TrangThai, "IX_BAI_VIET_TRANG_THAI");

            entity.HasIndex(e => e.Slug, "UQ_BAI_VIET_SLUG").IsUnique();

            entity.Property(e => e.MaBaiViet).HasColumnName("ma_bai_viet");
            entity.Property(e => e.LuotXem).HasColumnName("luot_xem");
            entity.Property(e => e.MaDiaDiem).HasColumnName("ma_dia_diem");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_cap_nhat");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.NoiDung).HasColumnName("noi_dung");
            entity.Property(e => e.Slug)
                .HasMaxLength(300)
                .HasColumnName("slug");
            entity.Property(e => e.Thumbnail)
                .HasMaxLength(1000)
                .HasColumnName("thumbnail");
            entity.Property(e => e.TieuDe)
                .HasMaxLength(500)
                .HasColumnName("tieu_de");
            entity.Property(e => e.TomTat)
                .HasMaxLength(1000)
                .HasColumnName("tom_tat");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasDefaultValue("DRAFT")
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.MaDiaDiemNavigation).WithMany(p => p.BaiViet)
                .HasForeignKey(d => d.MaDiaDiem)
                .HasConstraintName("FK_BAI_VIET_DIA_DIEM");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.BaiViet)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BAI_VIET_NGUOI_DUNG");
        });

        modelBuilder.Entity<BaoCaoNoiDung>(entity =>
        {
            entity.HasKey(e => e.MaBaoCao).HasName("PK__BAO_CAO___E007904C886FB7BF");

            entity.ToTable("BAO_CAO_NOI_DUNG");

            entity.HasIndex(e => e.MaNguoiBaoCao, "IX_BAO_CAO_NGUOI_DUNG");

            entity.Property(e => e.MaBaoCao).HasColumnName("ma_bao_cao");
            entity.Property(e => e.LyDo)
                .HasMaxLength(2000)
                .HasColumnName("ly_do");
            entity.Property(e => e.MaBaiViet).HasColumnName("ma_bai_viet");
            entity.Property(e => e.MaDanhGia).HasColumnName("ma_danh_gia");
            entity.Property(e => e.MaLichTrinh).HasColumnName("ma_lich_trinh");
            entity.Property(e => e.MaNguoiBaoCao).HasColumnName("ma_nguoi_bao_cao");
            entity.Property(e => e.NgayBaoCao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_bao_cao");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasDefaultValue("PENDING")
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.MaBaiVietNavigation).WithMany(p => p.BaoCaoNoiDung)
                .HasForeignKey(d => d.MaBaiViet)
                .HasConstraintName("FK_BAO_CAO_BAI_VIET");

            entity.HasOne(d => d.MaDanhGiaNavigation).WithMany(p => p.BaoCaoNoiDung)
                .HasForeignKey(d => d.MaDanhGia)
                .HasConstraintName("FK_BAO_CAO_DANH_GIA");

            entity.HasOne(d => d.MaLichTrinhNavigation).WithMany(p => p.BaoCaoNoiDung)
                .HasForeignKey(d => d.MaLichTrinh)
                .HasConstraintName("FK_BAO_CAO_LICH_TRINH");

            entity.HasOne(d => d.MaNguoiBaoCaoNavigation).WithMany(p => p.BaoCaoNoiDung)
                .HasForeignKey(d => d.MaNguoiBaoCao)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BAO_CAO_NGUOI_DUNG");
        });

        modelBuilder.Entity<BinhLuanBaiViet>(entity =>
        {
            entity.HasKey(e => e.MaBinhLuan).HasName("PK__BINH_LUA__300DD2D8B846326E");

            entity.ToTable("BINH_LUAN_BAI_VIET");

            entity.Property(e => e.MaBinhLuan).HasColumnName("ma_binh_luan");
            entity.Property(e => e.MaBaiViet).HasColumnName("ma_bai_viet");
            entity.Property(e => e.MaBinhLuanCha).HasColumnName("ma_binh_luan_cha");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.NoiDung)
                .HasMaxLength(2000)
                .HasColumnName("noi_dung");

            entity.HasOne(d => d.MaBaiVietNavigation).WithMany(p => p.BinhLuanBaiViet)
                .HasForeignKey(d => d.MaBaiViet)
                .HasConstraintName("FK_BLBV_BAI_VIET");

            entity.HasOne(d => d.MaBinhLuanChaNavigation).WithMany(p => p.InverseMaBinhLuanChaNavigation)
                .HasForeignKey(d => d.MaBinhLuanCha)
                .HasConstraintName("FK_BLBV_CHA");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.BinhLuanBaiViet)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLBV_NGUOI_DUNG");
        });

        modelBuilder.Entity<BinhLuanLichTrinh>(entity =>
        {
            entity.HasKey(e => e.MaBinhLuan).HasName("PK_BINH_LUAN_LICH_TRINH");

            entity.ToTable("BINH_LUAN_LICH_TRINH");

            entity.HasIndex(e => new { e.MaLichTrinh, e.NgayTao }, "IX_BLLT_LICH_TRINH_NGAY_TAO");
            entity.HasIndex(e => e.MaNguoiDung, "IX_BLLT_NGUOI_DUNG");

            entity.Property(e => e.MaBinhLuan).HasColumnName("ma_binh_luan");
            entity.Property(e => e.MaLichTrinh).HasColumnName("ma_lich_trinh");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NoiDung)
                .HasMaxLength(1000)
                .HasColumnName("noi_dung");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("ACTIVE")
                .HasColumnName("trang_thai");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_cap_nhat");

            entity.HasOne(d => d.MaLichTrinhNavigation).WithMany(p => p.BinhLuanLichTrinh)
                .HasForeignKey(d => d.MaLichTrinh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLLT_LICH_TRINH");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.BinhLuanLichTrinh)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_BLLT_NGUOI_DUNG");
        });

        modelBuilder.Entity<ChiPhiDichVuLichTrinh>(entity =>
        {
            entity.HasKey(e => e.MaChiPhi).HasName("PK__CHI_PHI___6FA160B084607E66");

            entity.ToTable("CHI_PHI_DICH_VU_LICH_TRINH");

            entity.Property(e => e.MaChiPhi).HasColumnName("ma_chi_phi");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(1000)
                .HasColumnName("ghi_chu");
            entity.Property(e => e.LoaiChiPhi)
                .HasMaxLength(50)
                .HasColumnName("loai_chi_phi");
            entity.Property(e => e.MaDichVuLichTrinh).HasColumnName("ma_dich_vu_lich_trinh");
            entity.Property(e => e.SoTien)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("so_tien");

            entity.HasOne(d => d.MaDichVuLichTrinhNavigation).WithMany(p => p.ChiPhiDichVuLichTrinh)
                .HasForeignKey(d => d.MaDichVuLichTrinh)
                .HasConstraintName("FK_CHI_PHI_DVLT");
        });

        modelBuilder.Entity<ChiaSeLichTrinh>(entity =>
        {
            entity.HasKey(e => e.MaChiaSe).HasName("PK__CHIA_SE___2964402897303E2B");

            entity.ToTable("CHIA_SE_LICH_TRINH");

            entity.HasIndex(e => new { e.MaLichTrinh, e.MaNguoiDung }, "UQ_CHIA_SE").IsUnique();

            entity.Property(e => e.MaChiaSe).HasColumnName("ma_chia_se");
            entity.Property(e => e.MaLichTrinh).HasColumnName("ma_lich_trinh");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayChiaSe)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_chia_se");
            entity.Property(e => e.Quyen)
                .HasMaxLength(30)
                .HasColumnName("quyen");

            entity.HasOne(d => d.MaLichTrinhNavigation).WithMany(p => p.ChiaSeLichTrinh)
                .HasForeignKey(d => d.MaLichTrinh)
                .HasConstraintName("FK_CHIA_SE_LT");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.ChiaSeLichTrinh)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CHIA_SE_ND");
        });

        modelBuilder.Entity<DangKyGoi>(entity =>
        {
            entity.HasKey(e => e.MaDangKy).HasName("PK__DANG_KY___BC05F6F12BD40FED");

            entity.ToTable("DANG_KY_GOI");

            entity.Property(e => e.MaDangKy).HasColumnName("ma_dang_ky");
            entity.Property(e => e.MaGoi).HasColumnName("ma_goi");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayBatDau).HasColumnName("ngay_bat_dau");
            entity.Property(e => e.NgayKetThuc).HasColumnName("ngay_ket_thuc");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.MaGoiNavigation).WithMany(p => p.DangKyGoi)
                .HasForeignKey(d => d.MaGoi)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DANG_KY_GOI_GOI_DICH_VU");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.DangKyGoi)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DANG_KY_GOI_NGUOI_DUNG");
        });

        modelBuilder.Entity<DangKyGoiNcc>(entity =>
        {
            entity.HasKey(e => e.MaDangKyGoiNcc);

            entity.ToTable("DANG_KY_GOI_NCC");

            entity.Property(e => e.MaDangKyGoiNcc).HasColumnName("ma_dang_ky_goi_ncc");
            entity.Property(e => e.MaGoiNcc).HasColumnName("ma_goi_ncc");
            entity.Property(e => e.MaNhaCungCap).HasColumnName("ma_nha_cung_cap");
            entity.Property(e => e.NgayBatDau).HasColumnName("ngay_bat_dau");
            entity.Property(e => e.NgayKetThuc).HasColumnName("ngay_ket_thuc");
            entity.Property(e => e.NgayTao).HasColumnName("ngay_tao");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.MaGoiNccNavigation).WithMany(p => p.DangKyGoiNcc)
                .HasForeignKey(d => d.MaGoiNcc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DKGOI_NCC_GOI");

            entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.DangKyGoiNcc)
                .HasForeignKey(d => d.MaNhaCungCap)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DKGOI_NCC_NCC");
        });

        modelBuilder.Entity<DanhGia>(entity =>
        {
            entity.HasKey(e => e.MaDanhGia).HasName("PK__DANH_GIA__75DAD6550FF5EF21");

            entity.ToTable("DANH_GIA");

            entity.HasIndex(e => e.MaDiaDiem, "IX_DANH_GIA_DIA_DIEM");

            entity.HasIndex(e => e.MaDichVu, "IX_DANH_GIA_DICH_VU");

            entity.HasIndex(e => e.MaLichTrinh, "IX_DANH_GIA_LICH_TRINH");

            entity.Property(e => e.MaDanhGia).HasColumnName("ma_danh_gia");
            entity.Property(e => e.DiemChatLuong)
                .HasColumnType("decimal(3, 2)")
                .HasColumnName("diem_chat_luong");
            entity.Property(e => e.DiemDichVu)
                .HasColumnType("decimal(3, 2)")
                .HasColumnName("diem_dich_vu");
            entity.Property(e => e.DiemGiaTri)
                .HasColumnType("decimal(3, 2)")
                .HasColumnName("diem_gia_tri");
            entity.Property(e => e.DiemViTri)
                .HasColumnType("decimal(3, 2)")
                .HasColumnName("diem_vi_tri");
            entity.Property(e => e.MaDiaDiem).HasColumnName("ma_dia_diem");
            entity.Property(e => e.MaDichVu).HasColumnName("ma_dich_vu");
            entity.Property(e => e.MaLichTrinh).HasColumnName("ma_lich_trinh");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.NoiDung)
                .HasMaxLength(4000)
                .HasColumnName("noi_dung");
            entity.Property(e => e.SoSao).HasColumnName("so_sao");
            entity.Property(e => e.TrangThaiDuyet)
                .HasMaxLength(30)
                .HasDefaultValue("PENDING")
                .HasColumnName("trang_thai_duyet");

            entity.HasOne(d => d.MaDiaDiemNavigation).WithMany(p => p.DanhGia)
                .HasForeignKey(d => d.MaDiaDiem)
                .HasConstraintName("FK_DG_DIA_DIEM");

            entity.HasOne(d => d.MaDichVuNavigation).WithMany(p => p.DanhGia)
                .HasForeignKey(d => d.MaDichVu)
                .HasConstraintName("FK_DG_DICH_VU");

            entity.HasOne(d => d.MaLichTrinhNavigation).WithMany(p => p.DanhGia)
                .HasForeignKey(d => d.MaLichTrinh)
                .HasConstraintName("FK_DG_LICH_TRINH");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.DanhGia)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DG_NGUOI_DUNG");
        });

        modelBuilder.Entity<DiaDiem>(entity =>
        {
            entity.HasKey(e => e.MaDiaDiem).HasName("PK__DIA_DIEM__0EF918F16953E3C2");

            entity.ToTable("DIA_DIEM", tb => tb.HasTrigger("TRG_DIA_DIEM_UPDATED"));

            entity.HasIndex(e => e.DanhGiaTrungBinh, "IX_DIA_DIEM_DANH_GIA");

            entity.HasIndex(e => e.LuotXem, "IX_DIA_DIEM_LUOT_XEM");

            entity.HasIndex(e => e.TenDiaDiem, "IX_DIA_DIEM_TEN");

            entity.HasIndex(e => e.MaTinhThanh, "IX_DIA_DIEM_TINH_THANH");

            entity.HasIndex(e => e.TrangThai, "IX_DIA_DIEM_TRANG_THAI");

            entity.HasIndex(e => e.Slug, "UQ_DIA_DIEM_SLUG").IsUnique();

            entity.Property(e => e.MaDiaDiem).HasColumnName("ma_dia_diem");
            entity.Property(e => e.DanhGiaTrungBinh)
                .HasColumnType("decimal(3, 2)")
                .HasColumnName("danh_gia_trung_binh");
            entity.Property(e => e.DiaChi)
                .HasMaxLength(500)
                .HasColumnName("dia_chi");
            entity.Property(e => e.Latitude)
                .HasColumnType("decimal(10, 8)")
                .HasColumnName("latitude");
            entity.Property(e => e.LoaiDiaDiem)
                .HasMaxLength(50)
                .HasColumnName("loai_dia_diem");
            entity.Property(e => e.Longitude)
                .HasColumnType("decimal(11, 8)")
                .HasColumnName("longitude");
            entity.Property(e => e.LuotXem).HasColumnName("luot_xem");
            entity.Property(e => e.MaTinhThanh).HasColumnName("ma_tinh_thanh");
            entity.Property(e => e.MoTa).HasColumnName("mo_ta");
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_cap_nhat");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.Slug)
                .HasMaxLength(250)
                .HasColumnName("slug");
            entity.Property(e => e.TenDiaDiem)
                .HasMaxLength(200)
                .HasColumnName("ten_dia_diem");
            entity.Property(e => e.Thumbnail)
                .HasMaxLength(1000)
                .HasColumnName("thumbnail");
            entity.Property(e => e.TongDanhGia).HasColumnName("tong_danh_gia");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasDefaultValue("ACTIVE")
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.MaTinhThanhNavigation).WithMany(p => p.DiaDiem)
                .HasForeignKey(d => d.MaTinhThanh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DIA_DIEM_TINH_THANH");

            entity.HasMany(d => d.MaTag).WithMany(p => p.MaDiaDiem)
                .UsingEntity<Dictionary<string, object>>(
                    "DiaDiemTag",
                    r => r.HasOne<Tag>().WithMany()
                        .HasForeignKey("MaTag")
                        .HasConstraintName("FK_DIA_DIEM_TAG_TAG"),
                    l => l.HasOne<DiaDiem>().WithMany()
                        .HasForeignKey("MaDiaDiem")
                        .HasConstraintName("FK_DIA_DIEM_TAG_DIA_DIEM"),
                    j =>
                    {
                        j.HasKey("MaDiaDiem", "MaTag").HasName("PK__DIA_DIEM__6E60BED0F5772662");
                        j.ToTable("DIA_DIEM_TAG");
                        j.IndexerProperty<int>("MaDiaDiem").HasColumnName("ma_dia_diem");
                        j.IndexerProperty<int>("MaTag").HasColumnName("ma_tag");
                    });
        });

        modelBuilder.Entity<DiaDiemLichTrinh>(entity =>
        {
            entity.HasKey(e => e.MaDiaDiemLichTrinh).HasName("PK__DIA_DIEM__3C9CB7F0192F83EA");

            entity.ToTable("DIA_DIEM_LICH_TRINH");

            entity.HasIndex(e => e.MaDiaDiem, "IX_DDLT_DIA_DIEM");

            entity.HasIndex(e => e.MaNgay, "IX_DDLT_NGAY");

            entity.Property(e => e.MaDiaDiemLichTrinh).HasColumnName("ma_dia_diem_lich_trinh");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(2000)
                .HasColumnName("ghi_chu");
            entity.Property(e => e.GioBatDau).HasColumnName("gio_bat_dau");
            entity.Property(e => e.GioKetThuc).HasColumnName("gio_ket_thuc");
            entity.Property(e => e.MaDiaDiem).HasColumnName("ma_dia_diem");
            entity.Property(e => e.MaNgay).HasColumnName("ma_ngay");
            entity.Property(e => e.ThuTu).HasColumnName("thu_tu");
            entity.Property(e => e.TieuDe)
                .HasMaxLength(255)
                .HasColumnName("tieu_de");

            entity.HasOne(d => d.MaDiaDiemNavigation).WithMany(p => p.DiaDiemLichTrinh)
                .HasForeignKey(d => d.MaDiaDiem)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DDLT_DIA_DIEM");

            entity.HasOne(d => d.MaNgayNavigation).WithMany(p => p.DiaDiemLichTrinh)
                .HasForeignKey(d => d.MaNgay)
                .HasConstraintName("FK_DDLT_NGAY");
        });

        modelBuilder.Entity<DichVu>(entity =>
        {
            entity.HasKey(e => e.MaDichVu).HasName("PK__DICH_VU__5ADDD34584EF439E");

            entity.ToTable("DICH_VU", tb => tb.HasTrigger("TRG_DICH_VU_UPDATED"));

            entity.HasIndex(e => e.DanhGiaTrungBinh, "IX_DICH_VU_DANH_GIA");

            entity.HasIndex(e => e.MaDiaDiem, "IX_DICH_VU_DIA_DIEM");

            entity.HasIndex(e => e.Latitude, "IX_DICH_VU_LATITUDE");

            entity.HasIndex(e => e.LoaiDichVu, "IX_DICH_VU_LOAI");

            entity.HasIndex(e => e.Longitude, "IX_DICH_VU_LONGITUDE");

            entity.HasIndex(e => e.MaNhaCungCap, "IX_DICH_VU_NCC");

            entity.HasIndex(e => e.TrangThai, "IX_DICH_VU_TRANG_THAI");

            entity.HasIndex(e => e.Slug, "UQ_DICH_VU_SLUG").IsUnique();

            entity.Property(e => e.MaDichVu).HasColumnName("ma_dich_vu");
            entity.Property(e => e.DanhGiaTrungBinh)
                .HasColumnType("decimal(3, 2)")
                .HasColumnName("danh_gia_trung_binh");
            entity.Property(e => e.DiaChi)
                .HasMaxLength(500)
                .HasColumnName("dia_chi");
            entity.Property(e => e.GiaDen)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("gia_den");
            entity.Property(e => e.GiaTu)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("gia_tu");
            entity.Property(e => e.Latitude)
                .HasColumnType("decimal(10, 8)")
                .HasColumnName("latitude");
            entity.Property(e => e.LoaiDichVu)
                .HasMaxLength(50)
                .HasColumnName("loai_dich_vu");
            entity.Property(e => e.Longitude)
                .HasColumnType("decimal(11, 8)")
                .HasColumnName("longitude");
            entity.Property(e => e.LuotXem).HasColumnName("luot_xem");
            entity.Property(e => e.MaDiaDiem).HasColumnName("ma_dia_diem");
            entity.Property(e => e.MaNhaCungCap).HasColumnName("ma_nha_cung_cap");
            entity.Property(e => e.MoTa).HasColumnName("mo_ta");
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_cap_nhat");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.Slug)
                .HasMaxLength(250)
                .HasColumnName("slug");
            entity.Property(e => e.TenDichVu)
                .HasMaxLength(250)
                .HasColumnName("ten_dich_vu");
            entity.Property(e => e.ThongTinLienHe)
                .HasMaxLength(1000)
                .HasColumnName("thong_tin_lien_he");
            entity.Property(e => e.Thumbnail)
                .HasMaxLength(1000)
                .HasColumnName("thumbnail");
            entity.Property(e => e.TongDanhGia).HasColumnName("tong_danh_gia");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasDefaultValue("ACTIVE")
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.MaDiaDiemNavigation).WithMany(p => p.DichVu)
                .HasForeignKey(d => d.MaDiaDiem)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DICH_VU_DIA_DIEM");

            entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.DichVu)
                .HasForeignKey(d => d.MaNhaCungCap)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DICH_VU_NCC");
        });

        modelBuilder.Entity<DichVuLichTrinh>(entity =>
        {
            entity.HasKey(e => e.MaDichVuLichTrinh).HasName("PK__DICH_VU___F458E6E515F734E6");

            entity.ToTable("DICH_VU_LICH_TRINH");

            entity.HasIndex(e => e.MaDiaDiemLichTrinh, "IX_DVLT_DIA_DIEM_LICH_TRINH");

            entity.HasIndex(e => e.MaDichVu, "IX_DVLT_DICH_VU");

            entity.HasIndex(e => new { e.MaDiaDiemLichTrinh, e.ThuTu }, "UX_DVLT_THU_TU").IsUnique();

            entity.Property(e => e.MaDichVuLichTrinh).HasColumnName("ma_dich_vu_lich_trinh");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(1000)
                .HasColumnName("ghi_chu");
            entity.Property(e => e.GioBatDau).HasColumnName("gio_bat_dau");
            entity.Property(e => e.GioKetThuc).HasColumnName("gio_ket_thuc");
            entity.Property(e => e.MaDiaDiemLichTrinh).HasColumnName("ma_dia_diem_lich_trinh");
            entity.Property(e => e.MaDichVu).HasColumnName("ma_dich_vu");
            entity.Property(e => e.ThuTu).HasColumnName("thu_tu");

            entity.HasOne(d => d.MaDiaDiemLichTrinhNavigation).WithMany(p => p.DichVuLichTrinh)
                .HasForeignKey(d => d.MaDiaDiemLichTrinh)
                .HasConstraintName("FK_DVLT_DDLT");

            entity.HasOne(d => d.MaDichVuNavigation).WithMany(p => p.DichVuLichTrinh)
                .HasForeignKey(d => d.MaDichVu)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DVLT_DICH_VU");
        });

        modelBuilder.Entity<DuyetNoiDung>(entity =>
        {
            entity.HasKey(e => e.MaDuyet).HasName("PK__DUYET_NO__E940BEA6842C0CD8");

            entity.ToTable("DUYET_NOI_DUNG");

            entity.HasIndex(e => e.MaAdmin, "IX_DUYET_ADMIN");

            entity.Property(e => e.MaDuyet).HasColumnName("ma_duyet");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(2000)
                .HasColumnName("ghi_chu");
            entity.Property(e => e.MaAdmin).HasColumnName("ma_admin");
            entity.Property(e => e.MaBaiViet).HasColumnName("ma_bai_viet");
            entity.Property(e => e.MaDanhGia).HasColumnName("ma_danh_gia");
            entity.Property(e => e.MaDichVu).HasColumnName("ma_dich_vu");
            entity.Property(e => e.MaLichTrinh).HasColumnName("ma_lich_trinh");
            entity.Property(e => e.MaNhaCungCap).HasColumnName("ma_nha_cung_cap");
            entity.Property(e => e.NgayDuyet)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_duyet");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.MaAdminNavigation).WithMany(p => p.DuyetNoiDung)
                .HasForeignKey(d => d.MaAdmin)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DUYET_ADMIN");

            entity.HasOne(d => d.MaBaiVietNavigation).WithMany(p => p.DuyetNoiDung)
                .HasForeignKey(d => d.MaBaiViet)
                .HasConstraintName("FK_DUYET_BAI_VIET");

            entity.HasOne(d => d.MaDanhGiaNavigation).WithMany(p => p.DuyetNoiDung)
                .HasForeignKey(d => d.MaDanhGia)
                .HasConstraintName("FK_DUYET_DANH_GIA");

            entity.HasOne(d => d.MaDichVuNavigation).WithMany(p => p.DuyetNoiDung)
                .HasForeignKey(d => d.MaDichVu)
                .HasConstraintName("FK_DUYET_DICH_VU");

            entity.HasOne(d => d.MaLichTrinhNavigation).WithMany(p => p.DuyetNoiDung)
                .HasForeignKey(d => d.MaLichTrinh)
                .HasConstraintName("FK_DUYET_LICH_TRINH");

            entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.DuyetNoiDung)
                .HasForeignKey(d => d.MaNhaCungCap)
                .HasConstraintName("FK_DUYET_NCC");
        });

        modelBuilder.Entity<GoiDichVu>(entity =>
        {
            entity.HasKey(e => e.MaGoi).HasName("PK__GOI_DICH__072AC717A6CCFB5F");

            entity.ToTable("GOI_DICH_VU");

            entity.Property(e => e.MaGoi).HasColumnName("ma_goi");
            entity.Property(e => e.GiaGoi)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("gia_goi");
            entity.Property(e => e.MoTa)
                .HasMaxLength(1000)
                .HasColumnName("mo_ta");
            entity.Property(e => e.SoNgay).HasColumnName("so_ngay");
            entity.Property(e => e.TenGoi)
                .HasMaxLength(100)
                .HasColumnName("ten_goi");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasDefaultValue("ACTIVE")
                .HasColumnName("trang_thai");
        });

        modelBuilder.Entity<GoiDichVuNcc>(entity =>
        {
            entity.HasKey(e => e.MaGoiNcc);

            entity.ToTable("GOI_DICH_VU_NCC");

            entity.Property(e => e.MaGoiNcc).HasColumnName("ma_goi_ncc");
            entity.Property(e => e.CoBadgeDoiTac).HasColumnName("co_badge_doi_tac");
            entity.Property(e => e.GiaNam)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("gia_nam");
            entity.Property(e => e.GiaThang)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("gia_thang");
            entity.Property(e => e.HeSoUuTien)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("he_so_uu_tien");
            entity.Property(e => e.MoTa)
                .HasMaxLength(1000)
                .HasColumnName("mo_ta");
            entity.Property(e => e.NgayCapNhat).HasColumnName("ngay_cap_nhat");
            entity.Property(e => e.NgayTao).HasColumnName("ngay_tao");
            entity.Property(e => e.TenGoi)
                .HasMaxLength(100)
                .HasColumnName("ten_goi");
            entity.Property(e => e.TrangThai).HasColumnName("trang_thai");
            entity.Property(e => e.UuTienAi).HasColumnName("uu_tien_ai");
            entity.Property(e => e.UuTienTimKiem).HasColumnName("uu_tien_tim_kiem");
            entity.Property(e => e.UuTienTrangChu).HasColumnName("uu_tien_trang_chu");
        });

        modelBuilder.Entity<LichSuAi>(entity =>
        {
            entity.HasKey(e => e.MaLichSuAi).HasName("PK__LICH_SU___3CC452A8DA48CDFB");

            entity.ToTable("LICH_SU_AI");

            entity.HasIndex(e => e.LoaiAi, "IX_AI_LOAI");

            entity.HasIndex(e => e.MaNguoiDung, "IX_AI_NGUOI_DUNG");

            entity.Property(e => e.MaLichSuAi).HasColumnName("ma_lich_su_ai");
            entity.Property(e => e.KetQuaTomTat).HasColumnName("ket_qua_tom_tat");
            entity.Property(e => e.LoaiAi)
                .HasMaxLength(50)
                .HasColumnName("loai_ai");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.Prompt).HasColumnName("prompt");
            entity.Property(e => e.SoToken).HasColumnName("so_token");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.LichSuAi)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LICH_SU_AI_NGUOI_DUNG");
        });

        modelBuilder.Entity<LichSuClone>(entity =>
        {
            entity.HasKey(e => e.MaClone).HasName("PK__LICH_SU___363B22D68D04A384");

            entity.ToTable("LICH_SU_CLONE");

            entity.Property(e => e.MaClone).HasColumnName("ma_clone");
            entity.Property(e => e.MaLichTrinhGoc).HasColumnName("ma_lich_trinh_goc");
            entity.Property(e => e.MaLichTrinhMoi).HasColumnName("ma_lich_trinh_moi");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayClone)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_clone");

            entity.HasOne(d => d.MaLichTrinhGocNavigation).WithMany(p => p.LichSuCloneMaLichTrinhGocNavigation)
                .HasForeignKey(d => d.MaLichTrinhGoc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CLONE_GOC");

            entity.HasOne(d => d.MaLichTrinhMoiNavigation).WithMany(p => p.LichSuCloneMaLichTrinhMoiNavigation)
                .HasForeignKey(d => d.MaLichTrinhMoi)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CLONE_MOI");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.LichSuClone)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CLONE_NGUOI_DUNG");
        });

        modelBuilder.Entity<LichTrinh>(entity =>
        {
            entity.HasKey(e => e.MaLichTrinh).HasName("PK__LICH_TRI__E4F756821DB7323F");

            entity.ToTable("LICH_TRINH", tb => tb.HasTrigger("TRG_LICH_TRINH_UPDATED"));

            entity.HasIndex(e => e.LaCongKhai, "IX_LICH_TRINH_CONG_KHAI");

            entity.HasIndex(e => e.LuotClone, "IX_LICH_TRINH_LUOT_CLONE");

            entity.HasIndex(e => e.LuotXem, "IX_LICH_TRINH_LUOT_XEM");

            entity.HasIndex(e => e.MaNguoiDung, "IX_LICH_TRINH_NGUOI_DUNG");

            entity.Property(e => e.MaLichTrinh).HasColumnName("ma_lich_trinh");
            entity.Property(e => e.LaCongKhai).HasColumnName("la_cong_khai");
            entity.Property(e => e.LuotClone).HasColumnName("luot_clone");
            entity.Property(e => e.LuotThich).HasColumnName("luot_thich");
            entity.Property(e => e.LuotXem).HasColumnName("luot_xem");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.MoTa).HasColumnName("mo_ta");
            entity.Property(e => e.NganSachToiDa)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("ngan_sach_toi_da");
            entity.Property(e => e.NgayBatDau).HasColumnName("ngay_bat_dau");
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_cap_nhat");
            entity.Property(e => e.NgayKetThuc).HasColumnName("ngay_ket_thuc");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.TenLichTrinh)
                .HasMaxLength(255)
                .HasColumnName("ten_lich_trinh");
            entity.Property(e => e.Thumbnail)
                .HasMaxLength(1000)
                .HasColumnName("thumbnail");
            entity.Property(e => e.TongChiPhiUocTinh)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("tong_chi_phi_uoc_tinh");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasDefaultValue("DRAFT")
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.LichTrinh)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LICH_TRINH_NGUOI_DUNG");
        });

        modelBuilder.Entity<LuuLichTrinh>(entity =>
        {
            entity.HasKey(e => new { e.MaLichTrinh, e.MaNguoiDung }).HasName("PK__LUU_LICH__856B644D303212B7");

            entity.ToTable("LUU_LICH_TRINH");

            entity.Property(e => e.MaLichTrinh).HasColumnName("ma_lich_trinh");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayLuu)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_luu");

            entity.HasOne(d => d.MaLichTrinhNavigation).WithMany(p => p.LuuLichTrinh)
                .HasForeignKey(d => d.MaLichTrinh)
                .HasConstraintName("FK_LLT_LICH_TRINH");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.LuuLichTrinh)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LLT_NGUOI_DUNG");
        });

        modelBuilder.Entity<NgayLichTrinh>(entity =>
        {
            entity.HasKey(e => e.MaNgay).HasName("PK__NGAY_LIC__9B544D1FD25A63AE");

            entity.ToTable("NGAY_LICH_TRINH");

            entity.HasIndex(e => e.MaLichTrinh, "IX_NGAY_LICH_TRINH");

            entity.HasIndex(e => new { e.MaLichTrinh, e.SoThuTu }, "UQ_NGAY_LICH_TRINH").IsUnique();

            entity.HasIndex(e => new { e.MaLichTrinh, e.Ngay }, "UX_NGAY_THUC_TE").IsUnique();

            entity.Property(e => e.MaNgay).HasColumnName("ma_ngay");
            entity.Property(e => e.GhiChu)
                .HasMaxLength(1000)
                .HasColumnName("ghi_chu");
            entity.Property(e => e.MaLichTrinh).HasColumnName("ma_lich_trinh");
            entity.Property(e => e.Ngay).HasColumnName("ngay");
            entity.Property(e => e.SoThuTu).HasColumnName("so_thu_tu");

            entity.HasOne(d => d.MaLichTrinhNavigation).WithMany(p => p.NgayLichTrinh)
                .HasForeignKey(d => d.MaLichTrinh)
                .HasConstraintName("FK_NGAY_LICH_TRINH");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNguoiDung).HasName("PK__NGUOI_DU__19C32CF77B526B11");

            entity.ToTable("NGUOI_DUNG", tb => tb.HasTrigger("TRG_NGUOI_DUNG_UPDATED"));

            entity.HasIndex(e => e.Email, "IX_NGUOI_DUNG_EMAIL");

            entity.HasIndex(e => e.Slug, "IX_NGUOI_DUNG_SLUG");

            entity.HasIndex(e => e.Email, "UQ_NGUOI_DUNG_EMAIL").IsUnique();

            entity.HasIndex(e => e.Slug, "UQ_NGUOI_DUNG_SLUG").IsUnique();

            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(500)
                .HasColumnName("avatar_url");
            entity.Property(e => e.Bio)
                .HasMaxLength(1000)
                .HasColumnName("bio");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.EmailDaXacThuc).HasColumnName("email_da_xac_thuc");
            entity.Property(e => e.HoTen)
                .HasMaxLength(100)
                .HasColumnName("ho_ten");
            entity.Property(e => e.MatKhauHash)
                .HasMaxLength(500)
                .HasColumnName("mat_khau_hash");
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_cap_nhat");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.Slug)
                .HasMaxLength(150)
                .HasColumnName("slug");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .HasColumnName("so_dien_thoai");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasDefaultValue("ACTIVE")
                .HasColumnName("trang_thai");
            entity.Property(e => e.VaiTro)
                .HasMaxLength(30)
                .HasColumnName("vai_tro");
        });

        modelBuilder.Entity<HoSoXacMinhNcc>(entity =>
        {
            entity.HasKey(e => e.MaHoSo).HasName("PK_HO_SO_XAC_MINH_NCC");

            entity.ToTable("HO_SO_XAC_MINH_NCC");

            entity.HasIndex(
                e => new { e.MaNhaCungCap, e.LoaiGiayTo, e.TrangThai },
                "IX_HSXMNCC_PROVIDER_TYPE_STATUS");

            entity.Property(e => e.MaHoSo).HasColumnName("ma_ho_so");
            entity.Property(e => e.MaNhaCungCap).HasColumnName("ma_nha_cung_cap");
            entity.Property(e => e.LoaiGiayTo)
                .HasMaxLength(50)
                .HasColumnName("loai_giay_to");
            entity.Property(e => e.TenTepGoc)
                .HasMaxLength(255)
                .HasColumnName("ten_tep_goc");
            entity.Property(e => e.TenTepLuu)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("ten_tep_luu");
            entity.Property(e => e.LoaiNoiDung)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("loai_noi_dung");
            entity.Property(e => e.KichThuoc).HasColumnName("kich_thuoc");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasDefaultValue("SUBMITTED")
                .HasColumnName("trang_thai");
            entity.Property(e => e.NgayNop)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_nop");
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_cap_nhat");

            entity.HasOne(d => d.MaNhaCungCapNavigation)
                .WithMany(p => p.HoSoXacMinhNcc)
                .HasForeignKey(d => d.MaNhaCungCap)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_HSXMNCC_NHA_CUNG_CAP");
        });

        modelBuilder.Entity<NhaCungCap>(entity =>
        {
            entity.HasKey(e => e.MaNhaCungCap).HasName("PK__NHA_CUNG__9B34E6DBE4A767AE");

            entity.ToTable("NHA_CUNG_CAP", tb => tb.HasTrigger("TRG_NCC_UPDATED"));

            entity.HasIndex(e => e.TrangThai, "IX_NCC_TRANG_THAI");

            entity.HasIndex(e => e.Slug, "UQ_NCC_SLUG").IsUnique();

            entity.Property(e => e.MaNhaCungCap).HasColumnName("ma_nha_cung_cap");
            entity.Property(e => e.BannerUrl)
                .HasMaxLength(500)
                .HasColumnName("banner_url");
            entity.Property(e => e.DiaChi)
                .HasMaxLength(500)
                .HasColumnName("dia_chi");
            entity.Property(e => e.EmailLienHe)
                .HasMaxLength(255)
                .HasColumnName("email_lien_he");
            entity.Property(e => e.LoaiNhaCungCap)
                .HasMaxLength(50)
                .HasColumnName("loai_nha_cung_cap");
            entity.Property(e => e.LogoUrl)
                .HasMaxLength(500)
                .HasColumnName("logo_url");
            entity.Property(e => e.MaAdminDuyet).HasColumnName("ma_admin_duyet");
            entity.Property(e => e.MaGoiNccHienTai).HasColumnName("ma_goi_ncc_hien_tai");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.MaSoThue)
                .HasMaxLength(50)
                .HasColumnName("ma_so_thue");
            entity.Property(e => e.MoTa).HasColumnName("mo_ta");
            entity.Property(e => e.NgayCapNhat)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_cap_nhat");
            entity.Property(e => e.NgayPheDuyet).HasColumnName("ngay_phe_duyet");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.Slug)
                .HasMaxLength(255)
                .HasColumnName("slug");
            entity.Property(e => e.SoDienThoai)
                .HasMaxLength(20)
                .HasColumnName("so_dien_thoai");
            entity.Property(e => e.SoGiayPhep)
                .HasMaxLength(100)
                .HasColumnName("so_giay_phep");
            entity.Property(e => e.TenDoanhNghiep)
                .HasMaxLength(255)
                .HasColumnName("ten_doanh_nghiep");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasDefaultValue("PENDING")
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.MaAdminDuyetNavigation).WithMany(p => p.NhaCungCapMaAdminDuyetNavigation)
                .HasForeignKey(d => d.MaAdminDuyet)
                .HasConstraintName("FK_NCC_ADMIN_DUYET");

            entity.HasOne(d => d.MaGoiNccHienTaiNavigation).WithMany(p => p.NhaCungCap)
                .HasForeignKey(d => d.MaGoiNccHienTai)
                .HasConstraintName("FK_NCC_GOI_HIEN_TAI");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.NhaCungCapMaNguoiDungNavigation)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_NCC_NGUOI_DUNG");
        });

        modelBuilder.Entity<OtpXacThuc>(entity =>
        {
            entity.HasKey(e => e.MaOtp).HasName("PK__OTP_XAC___053D7EE8056EF345");

            entity.ToTable("OTP_XAC_THUC");

            entity.Property(e => e.MaOtp).HasColumnName("ma_otp");
            entity.Property(e => e.DaSuDung).HasColumnName("da_su_dung");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayHetHan).HasColumnName("ngay_het_han");
            entity.Property(e => e.Otp)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("otp");
            entity.Property(e => e.SoLanSai).HasColumnName("so_lan_sai");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.OtpXacThuc)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OTP_NGUOI_DUNG");
        });

        modelBuilder.Entity<PhanHoiDanhGia>(entity =>
        {
            entity.HasKey(e => e.MaPhanHoi).HasName("PK__PHAN_HOI__36D78DA99E72A0B2");

            entity.ToTable("PHAN_HOI_DANH_GIA");

            entity.Property(e => e.MaPhanHoi).HasColumnName("ma_phan_hoi");
            entity.Property(e => e.MaDanhGia).HasColumnName("ma_danh_gia");
            entity.Property(e => e.MaNhaCungCap).HasColumnName("ma_nha_cung_cap");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.NoiDung)
                .HasMaxLength(3000)
                .HasColumnName("noi_dung");

            entity.HasOne(d => d.MaDanhGiaNavigation).WithMany(p => p.PhanHoiDanhGia)
                .HasForeignKey(d => d.MaDanhGia)
                .HasConstraintName("FK_PHDG_DANH_GIA");

            entity.HasOne(d => d.MaNhaCungCapNavigation).WithMany(p => p.PhanHoiDanhGia)
                .HasForeignKey(d => d.MaNhaCungCap)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PHDG_NCC");
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.MaToken).HasName("PK__REFRESH___0018078DC92139A0");

            entity.ToTable("REFRESH_TOKEN");

            entity.Property(e => e.MaToken).HasColumnName("ma_token");
            entity.Property(e => e.DaThuHoi).HasColumnName("da_thu_hoi");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayHetHan).HasColumnName("ngay_het_han");
            entity.Property(e => e.RefreshToken1)
                .HasMaxLength(500)
                .HasColumnName("refresh_token");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.RefreshToken)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_REFRESH_TOKEN_NGUOI_DUNG");
        });

        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.MaTag).HasName("PK__TAG__099A62171B31B246");

            entity.ToTable("TAG");

            entity.Property(e => e.MaTag).HasColumnName("ma_tag");
            entity.Property(e => e.LoaiTag)
                .HasMaxLength(50)
                .HasColumnName("loai_tag");
            entity.Property(e => e.TenTag)
                .HasMaxLength(100)
                .HasColumnName("ten_tag");
        });

        modelBuilder.Entity<ThanhToanNcc>(entity =>
        {
            entity.HasKey(e => e.MaThanhToanNcc);

            entity.ToTable("THANH_TOAN_NCC");

            entity.Property(e => e.MaThanhToanNcc).HasColumnName("ma_thanh_toan_ncc");
            entity.Property(e => e.MaDangKyGoiNcc).HasColumnName("ma_dang_ky_goi_ncc");
            entity.Property(e => e.MaGiaoDich)
                .HasMaxLength(255)
                .HasColumnName("ma_giao_dich");
            entity.Property(e => e.NgayTao).HasColumnName("ngay_tao");
            entity.Property(e => e.NgayThanhToan).HasColumnName("ngay_thanh_toan");
            entity.Property(e => e.PhuongThucThanhToan)
                .HasMaxLength(50)
                .HasColumnName("phuong_thuc_thanh_toan");
            entity.Property(e => e.SoTien)
                .HasColumnType("decimal(18, 2)")
                .HasColumnName("so_tien");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(30)
                .HasColumnName("trang_thai");

            entity.HasOne(d => d.MaDangKyGoiNccNavigation).WithMany(p => p.ThanhToanNcc)
                .HasForeignKey(d => d.MaDangKyGoiNcc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_THANH_TOAN_NCC_DANG_KY");
        });

        modelBuilder.Entity<TheoDoiNguoiDung>(entity =>
        {
            entity.HasKey(e => new { e.MaNguoiTheoDoi, e.MaNguoiDuocTheoDoi }).HasName("PK__THEO_DOI__E8A6156EFE38359E");

            entity.ToTable("THEO_DOI_NGUOI_DUNG");

            entity.Property(e => e.MaNguoiTheoDoi).HasColumnName("ma_nguoi_theo_doi");
            entity.Property(e => e.MaNguoiDuocTheoDoi).HasColumnName("ma_nguoi_duoc_theo_doi");
            entity.Property(e => e.NgayTheoDoi)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_theo_doi");

            entity.HasOne(d => d.MaNguoiDuocTheoDoiNavigation).WithMany(p => p.TheoDoiNguoiDungMaNguoiDuocTheoDoiNavigation)
                .HasForeignKey(d => d.MaNguoiDuocTheoDoi)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TDND_DUOC_THEO_DOI");

            entity.HasOne(d => d.MaNguoiTheoDoiNavigation).WithMany(p => p.TheoDoiNguoiDungMaNguoiTheoDoiNavigation)
                .HasForeignKey(d => d.MaNguoiTheoDoi)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TDND_THEO_DOI");
        });

        modelBuilder.Entity<ThichBaiViet>(entity =>
        {
            entity.HasKey(e => new { e.MaBaiViet, e.MaNguoiDung }).HasName("PK__THICH_BA__88D56798B884E003");

            entity.ToTable("THICH_BAI_VIET");

            entity.Property(e => e.MaBaiViet).HasColumnName("ma_bai_viet");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayThich)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_thich");

            entity.HasOne(d => d.MaBaiVietNavigation).WithMany(p => p.ThichBaiViet)
                .HasForeignKey(d => d.MaBaiViet)
                .HasConstraintName("FK_TBV_BAI_VIET");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.ThichBaiViet)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TBV_NGUOI_DUNG");
        });

        modelBuilder.Entity<ThichLichTrinh>(entity =>
        {
            entity.HasKey(e => new { e.MaLichTrinh, e.MaNguoiDung }).HasName("PK__THICH_LI__856B644DC8FEF4CB");

            entity.ToTable("THICH_LICH_TRINH");

            entity.Property(e => e.MaLichTrinh).HasColumnName("ma_lich_trinh");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayThich)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_thich");

            entity.HasOne(d => d.MaLichTrinhNavigation).WithMany(p => p.ThichLichTrinh)
                .HasForeignKey(d => d.MaLichTrinh)
                .HasConstraintName("FK_TLT_LICH_TRINH");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.ThichLichTrinh)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_TLT_NGUOI_DUNG");
        });

        modelBuilder.Entity<ThongBao>(entity =>
        {
            entity.HasKey(e => e.MaThongBao).HasName("PK__THONG_BA__D3E5B0954075490C");

            entity.ToTable("THONG_BAO");

            entity.HasIndex(e => e.DaDoc, "IX_THONG_BAO_DA_DOC");

            entity.HasIndex(e => e.NgayTao, "IX_THONG_BAO_NGAY_TAO").IsDescending();

            entity.HasIndex(e => e.MaNguoiDung, "IX_THONG_BAO_NGUOI_DUNG");

            entity.Property(e => e.MaThongBao).HasColumnName("ma_thong_bao");
            entity.Property(e => e.DaDoc).HasColumnName("da_doc");
            entity.Property(e => e.DuongDan)
                .HasMaxLength(500)
                .HasColumnName("duong_dan");
            entity.Property(e => e.LoaiThongBao)
                .HasMaxLength(50)
                .HasColumnName("loai_thong_bao");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(sysutcdatetime())")
                .HasColumnName("ngay_tao");
            entity.Property(e => e.NoiDung)
                .HasMaxLength(2000)
                .HasColumnName("noi_dung");
            entity.Property(e => e.TieuDe)
                .HasMaxLength(300)
                .HasColumnName("tieu_de");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.ThongBao)
                .HasForeignKey(d => d.MaNguoiDung)
                .HasConstraintName("FK_THONG_BAO_NGUOI_DUNG");
        });

        modelBuilder.Entity<TinhThanh>(entity =>
        {
            entity.HasKey(e => e.MaTinhThanh).HasName("PK__TINH_THA__E40219ADC47A5439");

            entity.ToTable("TINH_THANH");

            entity.Property(e => e.MaTinhThanh).HasColumnName("ma_tinh_thanh");
            entity.Property(e => e.MaVung)
                .HasMaxLength(50)
                .HasColumnName("ma_vung");
            entity.Property(e => e.QuocGia)
                .HasMaxLength(100)
                .HasDefaultValue("Việt Nam")
                .HasColumnName("quoc_gia");
            entity.Property(e => e.TenTinhThanh)
                .HasMaxLength(100)
                .HasColumnName("ten_tinh_thanh");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
