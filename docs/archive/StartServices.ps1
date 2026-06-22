$projects = @(
    "Microservices\ezTravel.ApiGateway\ezTravel.ApiGateway.csproj",
    "Microservices\ezTravel.AuthService\ezTravel.AuthService.csproj",
    "Microservices\ezTravel.AdminService\ezTravel.AdminService.csproj",
    "Microservices\ezTravel.CommunityService\ezTravel.CommunityService.csproj",
    "Microservices\ezTravel.PlaceService\ezTravel.PlaceService.csproj",
    "Microservices\ezTravel.TripService\ezTravel.TripService.csproj",
    "Microservices\ezTravel.BookingService\ezTravel.BookingService.csproj"
)

$jobs = @()

foreach ($proj in $projects) {
    Write-Host "Starting $proj"
    $job = Start-Process -FilePath "dotnet" -ArgumentList "run --project `"$proj`"" -PassThru -NoNewWindow
    $jobs += $job
}

Write-Host "Services started. Waiting 10 seconds to let them initialize..."
Start-Sleep -Seconds 10
Write-Host "Done."
