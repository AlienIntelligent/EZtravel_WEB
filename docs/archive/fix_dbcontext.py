import re

with open(r'd:\eztravel\DataAccess\ezTravel.Libs\AppDbContext.cs', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove missing DbSets completely
missing_types = ['PhuongTien', 'ThanhToan', 'BookingItem', 'BookingStatusLog', 'DoiSoatThanhToan', 'DatHoatDong', 'DatKhachSan', 'DatNhaHang', 'DatPhuongTien', 'DonDat', 'HoatDong', 'KhachSan', 'NhaHang']
for mt in missing_types:
    content = re.sub(r'^\s*public virtual DbSet<'+mt+r'>.*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'modelBuilder\.Entity<'+mt+r'>\([^;]+;\s*}\);', '', content, flags=re.DOTALL)

# 2. Remove property mappings for missing properties.
missing_props = [
    'ApprovedBy', 'CreatedAt', 'IsDeleted', 'UpdatedAt', 'VerifiedAt',
    'IsRead', 'NotificationType',
    'NhaCungCapDichVus', 'ViDienTuNccs', 'YeuCauRutTiens',
    'DuyetDichVus', 'AuditLogs',
    'YeuThichDiaDiems', 'YeuThichLichTrinhs'
]

# We need to remove entity.Property(e => e.PropName) chain
for p in missing_props:
    # Match entity.Property(e => e.PropName) and any chained methods up to the semicolon
    content = re.sub(r'\bentity\.Property\(\w+\s*=>\s*\w+\.' + p + r'\)[^;]+;', '', content, flags=re.DOTALL)

# We need to remove .WithMany(p => p.PropName) chains. We can just change them to .WithMany()
for p in missing_props:
    content = re.sub(r'\.WithMany\(\w+\s*=>\s*\w+\.' + p + r'\)', '.WithMany()', content)

# 3. Add EmailDaXacThuc and Slug back if missing
if 'EmailDaXacThuc' not in content:
    new_mappings = '''            entity.Property(e => e.EmailDaXacThuc)
                .HasDefaultValue(false)
                .HasColumnName("email_da_xac_thuc");
            entity.Property(e => e.Slug)
                .HasMaxLength(200)
                .HasColumnName("slug");

'''
    target = 'entity.ToTable(t => t.HasCheckConstraint("CHK_NGUOI_DUNG_VaiTro"'
    content = content.replace(target, new_mappings + target)

with open(r'd:\eztravel\DataAccess\ezTravel.Libs\AppDbContext.cs', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done!')
