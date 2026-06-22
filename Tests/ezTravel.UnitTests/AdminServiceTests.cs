using System.Linq.Expressions;
using ezTravel.Entities;
using ezTravel.DTO.Requests;
using ezTravel.Repository.Interfaces;
using ezTravel.Services.Admin;
using FluentAssertions;
using Moq;
using Xunit;

namespace ezTravel.UnitTests;

public class AdminServiceTests
{
    [Fact]
    public async Task UpdateProviderStatusAsync_Approve_ActivatesProviderAndProviderRole()
    {
        var admin = CreateUser(1, "ADMIN");
        var applicant = CreateUser(2, "TRAVELER");
        var provider = CreateProvider(applicant);
        var (service, unitOfWork) = CreateService(admin, applicant, provider);

        var result = await service.UpdateProviderStatusAsync(provider.MaNhaCungCap, "APPROVED", admin.MaNguoiDung);

        result.Should().NotBeOfType<AdminServiceError>();
        provider.TrangThai.Should().Be("APPROVED");
        provider.MaAdminDuyet.Should().Be(admin.MaNguoiDung);
        provider.NgayPheDuyet.Should().NotBeNull();
        applicant.VaiTro.Should().Be("PROVIDER");
        provider.HoSoXacMinhNcc.Single().TrangThai.Should().Be("APPROVED");
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateProviderStatusAsync_Reject_RevertsProviderRoleToTraveler()
    {
        var admin = CreateUser(1, "ADMIN");
        var applicant = CreateUser(2, "PROVIDER");
        var provider = CreateProvider(applicant);
        var (service, unitOfWork) = CreateService(admin, applicant, provider);

        var result = await service.UpdateProviderStatusAsync(provider.MaNhaCungCap, "REJECTED", admin.MaNguoiDung);

        result.Should().NotBeOfType<AdminServiceError>();
        provider.TrangThai.Should().Be("REJECTED");
        applicant.VaiTro.Should().Be("TRAVELER");
        provider.HoSoXacMinhNcc.Single().TrangThai.Should().Be("REJECTED");
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task UpdateProviderStatusAsync_ApproveWithoutDocuments_ReturnsConflict()
    {
        var admin = CreateUser(1, "ADMIN");
        var applicant = CreateUser(2, "TRAVELER");
        var provider = CreateProvider(applicant);
        provider.HoSoXacMinhNcc.Clear();
        var (service, unitOfWork) = CreateService(admin, applicant, provider);

        var result = await service.UpdateProviderStatusAsync(
            provider.MaNhaCungCap,
            "APPROVED",
            admin.MaNguoiDung);

        result.Should().BeOfType<AdminServiceError>()
            .Which.StatusCode.Should().Be(409);
        provider.TrangThai.Should().Be("PENDING");
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task CreateProviderPackageAsync_ValidRequest_PersistsActivePackage()
    {
        var packages = new List<GoiDichVuNcc>();
        var applicant = CreateUser(2, "TRAVELER");
        var (service, unitOfWork) = CreateService(
            CreateUser(1, "ADMIN"),
            applicant,
            CreateProvider(applicant),
            packages);

        var result = await service.CreateProviderPackageAsync(CreatePackageRequest("Growth"));

        result.Should().NotBeOfType<AdminServiceError>();
        packages.Should().ContainSingle();
        packages[0].TenGoi.Should().Be("Growth");
        packages[0].TrangThai.Should().BeTrue();
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateProviderPackageAsync_DuplicateName_ReturnsConflict()
    {
        var packages = new List<GoiDichVuNcc>
        {
            CreatePackage(1, "Growth")
        };
        var applicant = CreateUser(2, "TRAVELER");
        var (service, unitOfWork) = CreateService(
            CreateUser(1, "ADMIN"),
            applicant,
            CreateProvider(applicant),
            packages);

        var result = await service.CreateProviderPackageAsync(CreatePackageRequest(" growth "));

        result.Should().BeOfType<AdminServiceError>()
            .Which.StatusCode.Should().Be(409);
        packages.Should().ContainSingle();
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task UpdateProviderPackageAsync_MissingPackage_ReturnsNotFound()
    {
        var applicant = CreateUser(2, "TRAVELER");
        var (service, unitOfWork) = CreateService(
            CreateUser(1, "ADMIN"),
            applicant,
            CreateProvider(applicant),
            new List<GoiDichVuNcc>());

        var result = await service.UpdateProviderPackageAsync(999, CreatePackageRequest("Missing"));

        result.Should().BeOfType<AdminServiceError>()
            .Which.StatusCode.Should().Be(404);
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task UpdateProviderPackageStatusAsync_Deactivate_PersistsStatus()
    {
        var package = CreatePackage(1, "Growth");
        var applicant = CreateUser(2, "TRAVELER");
        var (service, unitOfWork) = CreateService(
            CreateUser(1, "ADMIN"),
            applicant,
            CreateProvider(applicant),
            new List<GoiDichVuNcc> { package });

        var result = await service.UpdateProviderPackageStatusAsync(package.MaGoiNcc, false);

        result.Should().NotBeOfType<AdminServiceError>();
        package.TrangThai.Should().BeFalse();
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Once);
    }

    private static (AdminService Service, Mock<IUnitOfWork> UnitOfWork) CreateService(
        NguoiDung admin,
        NguoiDung applicant,
        NhaCungCap provider,
        List<GoiDichVuNcc>? packages = null)
    {
        packages ??= new List<GoiDichVuNcc>();
        var unitOfWork = new Mock<IUnitOfWork>();
        var providerRepository = new Mock<IGenericRepository<NhaCungCap>>();
        var userRepository = new Mock<IGenericRepository<NguoiDung>>();
        var documentRepository = new Mock<IGenericRepository<HoSoXacMinhNcc>>();
        var packageRepository = new Mock<IGoiDichVuNccRepository>();

        providerRepository
            .Setup(item => item.GetByIdAsync(provider.MaNhaCungCap))
            .ReturnsAsync(provider);
        userRepository
            .Setup(item => item.AnyAsync(It.IsAny<Expression<Func<NguoiDung, bool>>>()))
            .ReturnsAsync((Expression<Func<NguoiDung, bool>> predicate) =>
                new[] { admin, applicant }.AsQueryable().Any(predicate));
        userRepository
            .Setup(item => item.GetByIdAsync(applicant.MaNguoiDung))
            .ReturnsAsync(applicant);
        documentRepository
            .Setup(item => item.FindAsync(It.IsAny<Expression<Func<HoSoXacMinhNcc, bool>>>() ))
            .ReturnsAsync((Expression<Func<HoSoXacMinhNcc, bool>> predicate) =>
                provider.HoSoXacMinhNcc.AsQueryable().Where(predicate).ToList());
        packageRepository
            .Setup(item => item.GetAllAsync())
            .ReturnsAsync(packages);
        packageRepository
            .Setup(item => item.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((int id) => packages.SingleOrDefault(package => package.MaGoiNcc == id));
        packageRepository
            .Setup(item => item.AddAsync(It.IsAny<GoiDichVuNcc>()))
            .Callback<GoiDichVuNcc>(packages.Add)
            .Returns(Task.CompletedTask);
        unitOfWork.SetupGet(item => item.NhaCungCaps).Returns(providerRepository.Object);
        unitOfWork.SetupGet(item => item.NguoiDungs).Returns(userRepository.Object);
        unitOfWork.SetupGet(item => item.HoSoXacMinhNccs).Returns(documentRepository.Object);
        unitOfWork.Setup(item => item.SaveChangesAsync()).ReturnsAsync(1);

        var service = new AdminService(
            unitOfWork.Object,
            new Mock<IDangKyGoiNccRepository>().Object,
            new Mock<IThanhToanNccRepository>().Object,
            packageRepository.Object);

        return (service, unitOfWork);
    }

    private static UpsertProviderPackageRequest CreatePackageRequest(string name)
        => new()
        {
            Name = name,
            Description = "Package for provider growth.",
            MonthlyPrice = 199000m,
            AnnualPrice = 1990000m,
            PriorityCoefficient = 1.5m,
            SearchPriority = true,
            AiPriority = true,
            HomePriority = false,
            PartnerBadge = true
        };

    private static GoiDichVuNcc CreatePackage(int id, string name)
        => new()
        {
            MaGoiNcc = id,
            TenGoi = name,
            GiaThang = 199000m,
            GiaNam = 1990000m,
            HeSoUuTien = 1.5m,
            TrangThai = true,
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow
        };

    private static NguoiDung CreateUser(int id, string role)
        => new()
        {
            MaNguoiDung = id,
            HoTen = $"User {id}",
            Email = $"user{id}@example.com",
            MatKhauHash = "hash",
            Slug = $"user-{id}",
            VaiTro = role,
            TrangThai = "ACTIVE",
            EmailDaXacThuc = true,
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow
        };

    private static NhaCungCap CreateProvider(NguoiDung applicant)
    {
        var provider = new NhaCungCap
        {
            MaNhaCungCap = 10,
            MaNguoiDung = applicant.MaNguoiDung,
            MaNguoiDungNavigation = applicant,
            TenDoanhNghiep = "Provider Test",
            Slug = "provider-test",
            LoaiNhaCungCap = "MULTI_SERVICE",
            EmailLienHe = applicant.Email,
            SoDienThoai = string.Empty,
            TrangThai = "PENDING",
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow
        };

        provider.HoSoXacMinhNcc.Add(new HoSoXacMinhNcc
        {
            MaHoSo = 100,
            MaNhaCungCap = provider.MaNhaCungCap,
            MaNhaCungCapNavigation = provider,
            LoaiGiayTo = "BUSINESS_LICENSE",
            TenTepGoc = "license.pdf",
            TenTepLuu = "stored-license.pdf",
            LoaiNoiDung = "application/pdf",
            KichThuoc = 1024,
            TrangThai = "SUBMITTED",
            NgayNop = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow
        });

        return provider;
    }
}
