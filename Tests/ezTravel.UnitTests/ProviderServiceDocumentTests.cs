using System.Linq.Expressions;
using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using ezTravel.Services.Providers;
using FluentAssertions;
using Moq;
using Xunit;

namespace ezTravel.UnitTests;

public class ProviderServiceDocumentTests
{
    [Fact]
    public async Task SaveProviderDocumentAsync_ReplacesCurrentTypeAndReopensRejectedProvider()
    {
        var provider = CreateProvider("REJECTED");
        var previous = CreateDocument(provider, 1, "SUBMITTED");
        provider.HoSoXacMinhNcc.Add(previous);
        var (service, unitOfWork, documentRepository) = CreateService(provider);
        HoSoXacMinhNcc? created = null;
        documentRepository
            .Setup(item => item.AddAsync(It.IsAny<HoSoXacMinhNcc>()))
            .Callback<HoSoXacMinhNcc>(item =>
            {
                item.MaHoSo = 2;
                created = item;
            })
            .Returns(Task.CompletedTask);

        var result = await service.SaveProviderDocumentAsync(
            new SaveProviderDocumentRequest
            {
                DocumentType = "BUSINESS_LICENSE",
                OriginalFileName = "new-license.pdf",
                StoredFileName = "random.pdf",
                ContentType = "application/pdf",
                FileSize = 2048
            },
            provider.MaNguoiDung);

        result.Should().NotBeOfType<ProviderServiceError>();
        previous.TrangThai.Should().Be("REPLACED");
        created.Should().NotBeNull();
        created!.TrangThai.Should().Be("SUBMITTED");
        provider.TrangThai.Should().Be("PENDING");
        provider.MaAdminDuyet.Should().BeNull();
        provider.NgayPheDuyet.Should().BeNull();
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task SaveProviderDocumentAsync_ActiveProvider_ReturnsConflict()
    {
        var provider = CreateProvider("ACTIVE");
        var (service, unitOfWork, _) = CreateService(provider);

        var result = await service.SaveProviderDocumentAsync(
            new SaveProviderDocumentRequest
            {
                DocumentType = "BUSINESS_LICENSE",
                OriginalFileName = "license.pdf",
                StoredFileName = "random.pdf",
                ContentType = "application/pdf",
                FileSize = 1024
            },
            provider.MaNguoiDung);

        result.Should().BeOfType<ProviderServiceError>()
            .Which.StatusCode.Should().Be(409);
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Never);
    }

    private static (
        ProviderService Service,
        Mock<IUnitOfWork> UnitOfWork,
        Mock<IGenericRepository<HoSoXacMinhNcc>> DocumentRepository) CreateService(
        NhaCungCap provider)
    {
        var unitOfWork = new Mock<IUnitOfWork>();
        var providerRepository = new Mock<IGenericRepository<NhaCungCap>>();
        var documentRepository = new Mock<IGenericRepository<HoSoXacMinhNcc>>();
        providerRepository
            .Setup(item => item.FirstOrDefaultAsync(It.IsAny<Expression<Func<NhaCungCap, bool>>>() ))
            .ReturnsAsync((Expression<Func<NhaCungCap, bool>> predicate) =>
                new[] { provider }.AsQueryable().FirstOrDefault(predicate));
        documentRepository
            .Setup(item => item.FindAsync(It.IsAny<Expression<Func<HoSoXacMinhNcc, bool>>>() ))
            .ReturnsAsync((Expression<Func<HoSoXacMinhNcc, bool>> predicate) =>
                provider.HoSoXacMinhNcc.AsQueryable().Where(predicate).ToList());
        unitOfWork.SetupGet(item => item.NhaCungCaps).Returns(providerRepository.Object);
        unitOfWork.SetupGet(item => item.HoSoXacMinhNccs).Returns(documentRepository.Object);
        unitOfWork.Setup(item => item.SaveChangesAsync()).ReturnsAsync(1);

        return (new ProviderService(unitOfWork.Object), unitOfWork, documentRepository);
    }

    private static NhaCungCap CreateProvider(string status)
        => new()
        {
            MaNhaCungCap = 10,
            MaNguoiDung = 20,
            TenDoanhNghiep = "Provider Test",
            Slug = "provider-test",
            LoaiNhaCungCap = "MULTI_SERVICE",
            EmailLienHe = "provider@example.com",
            SoDienThoai = "0900000000",
            TrangThai = status,
            MaAdminDuyet = status == "REJECTED" ? 1 : null,
            NgayPheDuyet = status == "REJECTED" ? DateTime.UtcNow : null,
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow
        };

    private static HoSoXacMinhNcc CreateDocument(
        NhaCungCap provider,
        int id,
        string status)
        => new()
        {
            MaHoSo = id,
            MaNhaCungCap = provider.MaNhaCungCap,
            MaNhaCungCapNavigation = provider,
            LoaiGiayTo = "BUSINESS_LICENSE",
            TenTepGoc = "license.pdf",
            TenTepLuu = "stored.pdf",
            LoaiNoiDung = "application/pdf",
            KichThuoc = 1024,
            TrangThai = status,
            NgayNop = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow
        };
}
