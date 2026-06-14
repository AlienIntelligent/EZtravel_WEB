using ezTravel.Entities;
using Microsoft.EntityFrameworkCore;

namespace ezTravel.Libs;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ── DbSets ──
    public DbSet<NguoiDung> NguoiDungs { get; set; }
    public DbSet<LichTrinh> LichTrinhs { get; set; }
    public DbSet<ChiTietLichTrinh> ChiTietLichTrinhs { get; set; }
    public DbSet<DiaDiem> DiaDiems { get; set; }
    public DbSet<DichVu> DichVus { get; set; }
    public DbSet<DanhMucDichVu> DanhMucDichVus { get; set; }
    public DbSet<DanhGia> DanhGias { get; set; }
    public DbSet<DonDat> DonDats { get; set; }
    public DbSet<ChiTietDonDat> ChiTietDonDats { get; set; }
    public DbSet<MaGiamGia> MaGiamGias { get; set; }
    public DbSet<ThanhToan> ThanhToans { get; set; }
    public DbSet<HinhAnh> HinhAnhs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── NguoiDung ──
        modelBuilder.Entity<NguoiDung>(e =>
        {
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.VaiTro).HasDefaultValue("Traveler");
            e.Property(x => x.TrangThai).HasDefaultValue("HoatDong");
            e.Property(x => x.NgayTao).HasDefaultValueSql("GETUTCDATE()");
            e.Property(x => x.DaXoa).HasDefaultValue(false);
        });

        // ── LichTrinh ──
        modelBuilder.Entity<LichTrinh>(e =>
        {
            e.Property(x => x.TrangThai).HasDefaultValue("Nhap");
            e.Property(x => x.TrangThaiChiaSe).HasDefaultValue("RiengTu");
            e.Property(x => x.SoNguoi).HasDefaultValue(1);
            e.Property(x => x.NgayTao).HasDefaultValueSql("GETUTCDATE()");
            e.Property(x => x.DaXoa).HasDefaultValue(false);

            e.HasOne(x => x.NguoiDung)
             .WithMany(x => x.LichTrinhs)
             .HasForeignKey(x => x.MaNguoiDung)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── ChiTietLichTrinh ──
        modelBuilder.Entity<ChiTietLichTrinh>(e =>
        {
            e.HasOne(x => x.LichTrinh)
             .WithMany(x => x.ChiTietLichTrinhs)
             .HasForeignKey(x => x.MaLichTrinh)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.DiaDiem)
             .WithMany(x => x.ChiTietLichTrinhs)
             .HasForeignKey(x => x.MaDiaDiem)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.DichVu)
             .WithMany(x => x.ChiTietLichTrinhs)
             .HasForeignKey(x => x.MaDichVu)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // ── DiaDiem ──
        modelBuilder.Entity<DiaDiem>(e =>
        {
            e.Property(x => x.NgayTao).HasDefaultValueSql("GETUTCDATE()");
            e.Property(x => x.DaXoa).HasDefaultValue(false);
        });

        // ── DichVu ──
        modelBuilder.Entity<DichVu>(e =>
        {
            e.Property(x => x.NgayTao).HasDefaultValueSql("GETUTCDATE()");
            e.Property(x => x.DaXoa).HasDefaultValue(false);

            e.HasOne(x => x.DanhMucDichVu)
             .WithMany(x => x.DichVus)
             .HasForeignKey(x => x.MaDanhMuc)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.DiaDiem)
             .WithMany(x => x.DichVus)
             .HasForeignKey(x => x.MaDiaDiem)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── DanhGia ──
        modelBuilder.Entity<DanhGia>(e =>
        {
            e.Property(x => x.NgayDanhGia).HasDefaultValueSql("GETUTCDATE()");

            e.HasOne(x => x.NguoiDung)
             .WithMany(x => x.DanhGias)
             .HasForeignKey(x => x.MaNguoiDung)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.DichVu)
             .WithMany(x => x.DanhGias)
             .HasForeignKey(x => x.MaDichVu)
             .OnDelete(DeleteBehavior.SetNull);

            e.HasOne(x => x.DiaDiem)
             .WithMany(x => x.DanhGias)
             .HasForeignKey(x => x.MaDiaDiem)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // ── DonDat ──
        modelBuilder.Entity<DonDat>(e =>
        {
            e.Property(x => x.TrangThai).HasDefaultValue("ChoDuyet");
            e.Property(x => x.NgayDat).HasDefaultValueSql("GETUTCDATE()");

            e.HasOne(x => x.NguoiDung)
             .WithMany(x => x.DonDats)
             .HasForeignKey(x => x.MaNguoiDung)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.MaGiamGia_Nav)
             .WithMany(x => x.DonDats)
             .HasForeignKey(x => x.MaGiamGia)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // ── ChiTietDonDat ──
        modelBuilder.Entity<ChiTietDonDat>(e =>
        {
            e.Property(x => x.SoLuong).HasDefaultValue(1);

            e.HasOne(x => x.DonDat)
             .WithMany(x => x.ChiTietDonDats)
             .HasForeignKey(x => x.MaDon)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.DichVu)
             .WithMany(x => x.ChiTietDonDats)
             .HasForeignKey(x => x.MaDichVu)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── MaGiamGia ──
        modelBuilder.Entity<MaGiamGia>(e =>
        {
            e.HasIndex(x => x.MaCode).IsUnique();
            e.Property(x => x.DaXoa).HasDefaultValue(false);
        });

        // ── ThanhToan ──
        modelBuilder.Entity<ThanhToan>(e =>
        {
            e.HasIndex(x => x.MaGiaoDich).IsUnique();
            e.Property(x => x.TrangThai).HasDefaultValue("ChoDuyet");

            e.HasOne(x => x.DonDat)
             .WithMany(x => x.ThanhToans)
             .HasForeignKey(x => x.MaDon)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // ── HinhAnh ──
        modelBuilder.Entity<HinhAnh>(e =>
        {
            e.HasOne(x => x.DiaDiem)
             .WithMany(x => x.HinhAnhs)
             .HasForeignKey(x => x.MaDiaDiem)
             .OnDelete(DeleteBehavior.SetNull);

            e.HasOne(x => x.DichVu)
             .WithMany(x => x.HinhAnhs)
             .HasForeignKey(x => x.MaDichVu)
             .OnDelete(DeleteBehavior.SetNull);
        });

        // ── Soft delete filter (tự động lọc bản ghi đã xóa) ──
        modelBuilder.Entity<NguoiDung>().HasQueryFilter(x => x.DaXoa != true);
        modelBuilder.Entity<LichTrinh>().HasQueryFilter(x => x.DaXoa != true);
        modelBuilder.Entity<DiaDiem>().HasQueryFilter(x => x.DaXoa != true);
        modelBuilder.Entity<DichVu>().HasQueryFilter(x => x.DaXoa != true);
        modelBuilder.Entity<MaGiamGia>().HasQueryFilter(x => x.DaXoa != true);
    }

    // ── Override SaveChanges để tự động set NgayTao ──
    public override int SaveChanges()
    {
        SetAuditFields();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        SetAuditFields();
        return base.SaveChangesAsync(ct);
    }

    private void SetAuditFields()
    {
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Added)
            {
                if (entry.Properties.Any(p => p.Metadata.Name == "NgayTao"))
                    entry.Property("NgayTao").CurrentValue = DateTime.UtcNow;

                if (entry.Properties.Any(p => p.Metadata.Name == "DaXoa"))
                    entry.Property("DaXoa").CurrentValue ??= false;
            }
        }
    }
}
