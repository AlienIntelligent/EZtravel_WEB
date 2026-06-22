import os

entities = [
    "AnhBaiViet", "AnhDanhGia", "AnhDiaDiem", "AnhDichVu", "BaiViet", "BaoCaoNoiDung",
    "BinhLuanBaiViet", "ChiPhiDichVuLichTrinh", "ChiaSeLichTrinh", "DangKyGoi", "DanhGia",
    "DiaDiem", "DiaDiemLichTrinh", "DichVu", "DichVuLichTrinh", "DuyetNoiDung", "GoiDichVu",
    "LichSuAi", "LichSuClone", "LichTrinh", "LuuLichTrinh", "NgayLichTrinh", "NguoiDung",
    "NhaCungCap", "OtpXacThuc", "PhanHoiDanhGia", "RefreshToken", "Tag", "TheoDoiNguoiDung",
    "ThichBaiViet", "ThichLichTrinh", "ThongBao", "TinhThanh", "DiaDiemTag"
]
entities.sort()

# Remove duplicates just in case
entities = list(dict.fromkeys(entities))

# IUnitOfWork.cs
iunit_content = "using ezTravel.Entities;\n\nnamespace ezTravel.Repository.Interfaces;\n\npublic interface IUnitOfWork : IDisposable\n{\n"
for e in entities:
    # pluralize naively (add s)
    prop_name = e + "s"
    iunit_content += f"    IGenericRepository<{e}> {prop_name} {{ get; }}\n"
iunit_content += "\n    Task<int> SaveChangesAsync();\n    Task BeginTransactionAsync();\n    Task CommitAsync();\n    Task RollbackAsync();\n}\n"

with open(r'd:\eztravel\DataAccess\ezTravel.Repository\Interfaces\IUnitOfWork.cs', 'w') as f:
    f.write(iunit_content)

# UnitOfWork.cs
uow_content = """using ezTravel.Entities;
using ezTravel.Libs;
using ezTravel.Repository.Interfaces;

namespace ezTravel.Repository.Implementations;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

"""

# backing fields
for e in entities:
    uow_content += f"    private IGenericRepository<{e}>? _{e.lower()}Repository;\n"

uow_content += "\n    public UnitOfWork(AppDbContext context)\n    {\n        _context = context;\n    }\n\n"

# properties
for e in entities:
    prop_name = e + "s"
    uow_content += f"    public IGenericRepository<{e}> {prop_name} => _{e.lower()}Repository ??= new GenericRepository<{e}>(_context);\n"

uow_content += """
    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitAsync()
    {
        await _context.Database.CommitTransactionAsync();
    }

    public async Task RollbackAsync()
    {
        await _context.Database.RollbackTransactionAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
"""

with open(r'd:\eztravel\DataAccess\ezTravel.Repository\Implementations\UnitOfWork.cs', 'w') as f:
    f.write(uow_content)
