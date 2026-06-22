using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace ezTravel.Common.Helpers;

public static class UserContextHelper
{
    public static int? GetUserId(ClaimsPrincipal user)
    {
        var userIdClaim = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? user?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    public static string? GetUserRole(ClaimsPrincipal user)
    {
        return user?.FindFirst(ClaimTypes.Role)?.Value;
    }

    public static string? GetUserEmail(ClaimsPrincipal user)
    {
        return user?.FindFirst(ClaimTypes.Email)?.Value;
    }
}
