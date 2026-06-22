import re
import os

filepath = r'd:\eztravel\DataAccess\ezTravel.Libs\AppDbContext.cs'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add EmailDaXacThuc and Slug
new_mappings = '''            entity.Property(e => e.EmailDaXacThuc)
                .HasDefaultValue(false)
                .HasColumnName("email_da_xac_thuc");
            entity.Property(e => e.Slug)
                .HasMaxLength(200)
                .HasColumnName("slug");

            '''
target1 = 'entity.ToTable(t => t.HasCheckConstraint("CHK_NGUOI_DUNG_VaiTro"'
content = content.replace(target1, new_mappings + target1)

# 2. Add LichSuClone and TheoDoiNguoiDung
new_entities = '''        modelBuilder.Entity<LichSuClone>(entity =>
        {
            entity.HasKey(e => e.MaClone);
            entity.ToTable("LICH_SU_CLONE");
            
            entity.Property(e => e.MaClone).HasColumnName("ma_clone");
            entity.Property(e => e.MaLichTrinhGoc).HasColumnName("ma_lich_trinh_goc");
            entity.Property(e => e.MaLichTrinhMoi).HasColumnName("ma_lich_trinh_moi");
            entity.Property(e => e.MaNguoiDung).HasColumnName("ma_nguoi_dung");
            entity.Property(e => e.NgayClone).HasColumnName("ngay_clone");

            entity.HasOne(d => d.MaLichTrinhGocNavigation)
                .WithMany(p => p.LichSuCloneGocs)
                .HasForeignKey(d => d.MaLichTrinhGoc)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.MaLichTrinhMoiNavigation)
                .WithMany(p => p.LichSuCloneMois)
                .HasForeignKey(d => d.MaLichTrinhMoi)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.MaNguoiDungNavigation)
                .WithMany(p => p.LichSuClones)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<TheoDoiNguoiDung>(entity =>
        {
            entity.HasKey(e => new { e.MaNguoiTheoDoi, e.MaNguoiDuocTheoDoi });
            entity.ToTable("THEO_DOI_NGUOI_DUNG");

            entity.Property(e => e.MaNguoiTheoDoi).HasColumnName("ma_nguoi_theo_doi");
            entity.Property(e => e.MaNguoiDuocTheoDoi).HasColumnName("ma_nguoi_duoc_theo_doi");
            entity.Property(e => e.NgayTheoDoi).HasColumnName("ngay_theo_doi");

            entity.HasOne(d => d.MaNguoiTheoDoiNavigation)
                .WithMany(p => p.TheoDois_Follower)
                .HasForeignKey(d => d.MaNguoiTheoDoi)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.MaNguoiDuocTheoDoiNavigation)
                .WithMany(p => p.TheoDois_Following)
                .HasForeignKey(d => d.MaNguoiDuocTheoDoi)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        '''
target2 = 'OnModelCreatingPartial(modelBuilder);\n    }'
content = content.replace(target2, new_entities + target2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
