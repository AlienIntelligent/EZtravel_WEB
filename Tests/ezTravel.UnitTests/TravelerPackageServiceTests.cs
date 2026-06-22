using System.Linq.Expressions;
using ezTravel.DTO.Requests;
using ezTravel.Entities;
using ezTravel.Repository.Interfaces;
using ezTravel.Services.Subscriptions;
using FluentAssertions;
using Moq;
using Xunit;

namespace ezTravel.UnitTests;

public class TravelerPackageServiceTests
{
    [Fact]
    public async Task SubscribeSimulatedAsync_ExpiresOldPackageAndCreatesPremiumSubscription()
    {
        var user = CreateUser("TRAVELER");
        var package = CreatePackage();
        var oldRegistration = new DangKyGoi
        {
            MaDangKy = 1,
            MaNguoiDung = user.MaNguoiDung,
            MaGoi = 1,
            NgayBatDau = DateTime.UtcNow.AddDays(-5),
            NgayKetThuc = DateTime.UtcNow.AddDays(25),
            TrangThai = "ACTIVE"
        };
        var (service, unitOfWork, registrationRepository) =
            CreateService(user, package, new[] { oldRegistration });
        DangKyGoi? created = null;
        registrationRepository
            .Setup(item => item.AddAsync(It.IsAny<DangKyGoi>()))
            .Callback<DangKyGoi>(item =>
            {
                item.MaDangKy = 2;
                created = item;
            })
            .Returns(Task.CompletedTask);

        var result = await service.SubscribeSimulatedAsync(
            new SubscribePackageRequest { PackageId = package.MaGoi },
            user.MaNguoiDung);

        result.Should().NotBeOfType<TravelerPackageServiceError>();
        oldRegistration.TrangThai.Should().Be("EXPIRED");
        created.Should().NotBeNull();
        created!.TrangThai.Should().Be("ACTIVE");
        created.MaGoi.Should().Be(package.MaGoi);
        created.NgayKetThuc.Should().BeAfter(created.NgayBatDau);
        user.VaiTro.Should().Be("PREMIUM_TRAVELER");
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task SubscribeSimulatedAsync_ProviderAccount_ReturnsForbiddenError()
    {
        var user = CreateUser("PROVIDER");
        var package = CreatePackage();
        var (service, unitOfWork, _) = CreateService(user, package, Array.Empty<DangKyGoi>());

        var result = await service.SubscribeSimulatedAsync(
            new SubscribePackageRequest { PackageId = package.MaGoi },
            user.MaNguoiDung);

        result.Should().BeOfType<TravelerPackageServiceError>()
            .Which.StatusCode.Should().Be(403);
        unitOfWork.Verify(item => item.SaveChangesAsync(), Times.Never);
    }

    private static (
        TravelerPackageService Service,
        Mock<IUnitOfWork> UnitOfWork,
        Mock<IGenericRepository<DangKyGoi>> RegistrationRepository) CreateService(
        NguoiDung user,
        GoiDichVu package,
        IEnumerable<DangKyGoi> activeRegistrations)
    {
        var unitOfWork = new Mock<IUnitOfWork>();
        var userRepository = new Mock<IGenericRepository<NguoiDung>>();
        var packageRepository = new Mock<IGenericRepository<GoiDichVu>>();
        var registrationRepository = new Mock<IGenericRepository<DangKyGoi>>();

        userRepository.Setup(item => item.GetByIdAsync(user.MaNguoiDung)).ReturnsAsync(user);
        packageRepository.Setup(item => item.GetByIdAsync(package.MaGoi)).ReturnsAsync(package);
        registrationRepository
            .Setup(item => item.FindAsync(It.IsAny<Expression<Func<DangKyGoi, bool>>>() ))
            .ReturnsAsync((Expression<Func<DangKyGoi, bool>> predicate) =>
                activeRegistrations.AsQueryable().Where(predicate).ToList());

        unitOfWork.SetupGet(item => item.NguoiDungs).Returns(userRepository.Object);
        unitOfWork.SetupGet(item => item.GoiDichVus).Returns(packageRepository.Object);
        unitOfWork.SetupGet(item => item.DangKyGois).Returns(registrationRepository.Object);
        unitOfWork.Setup(item => item.SaveChangesAsync()).ReturnsAsync(1);

        return (new TravelerPackageService(unitOfWork.Object), unitOfWork, registrationRepository);
    }

    private static NguoiDung CreateUser(string role)
        => new()
        {
            MaNguoiDung = 20,
            HoTen = "Traveler Test",
            Email = "traveler@example.com",
            MatKhauHash = "hash",
            Slug = "traveler-test",
            VaiTro = role,
            TrangThai = "ACTIVE",
            EmailDaXacThuc = true,
            NgayTao = DateTime.UtcNow,
            NgayCapNhat = DateTime.UtcNow
        };

    private static GoiDichVu CreatePackage()
        => new()
        {
            MaGoi = 4,
            TenGoi = "PREMIUM",
            GiaGoi = 299000m,
            SoNgay = 30,
            MoTa = "Premium test",
            TrangThai = "ACTIVE"
        };
}
