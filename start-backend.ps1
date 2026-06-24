# start-backend.ps1 - Start all ezTravel microservices
param([switch]$Stop, [switch]$Status)

$Root = "D:\eztravel"
$LogDir = "$Root\logs"
if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }

$Services = @(
    @{ Name="AuthService";      Proj="Microservices\ezTravel.AuthService\ezTravel.AuthService.csproj";         Port=7001 }
    @{ Name="TripService";      Proj="Microservices\ezTravel.TripService\ezTravel.TripService.csproj";         Port=7002 }
    @{ Name="PlaceService";     Proj="Microservices\ezTravel.PlaceService\ezTravel.PlaceService.csproj";       Port=7003 }
    @{ Name="BookingService";   Proj="Microservices\ezTravel.BookingService\ezTravel.BookingService.csproj";   Port=7004 }
    @{ Name="CommunityService"; Proj="Microservices\ezTravel.CommunityService\ezTravel.CommunityService.csproj"; Port=7005 }
    @{ Name="AdminService";     Proj="Microservices\ezTravel.AdminService\ezTravel.AdminService.csproj";       Port=7006 }
    @{ Name="ApiGateway";       Proj="Microservices\ezTravel.ApiGateway\ezTravel.ApiGateway.csproj";           Port=7000 }
)

if ($Stop) {
    Write-Host "Stopping all ezTravel jobs..." -ForegroundColor Yellow
    Get-Job | Where-Object { $_.Name -like "ez-*" } | Stop-Job -PassThru | Remove-Job
    Write-Host "Done." -ForegroundColor Green
    exit 0
}

if ($Status) {
    Get-Job | Where-Object { $_.Name -like "ez-*" } | Format-Table Name, Id, State, PSBeginTime
    exit 0
}

# Stop existing jobs
Get-Job | Where-Object { $_.Name -like "ez-*" } | Stop-Job -PassThru | Remove-Job -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Starting ezTravel Backend ===" -ForegroundColor Cyan
Write-Host ""

foreach ($svc in $Services) {
    $fullProj = Join-Path $Root $svc.Proj
    $logFile  = Join-Path $LogDir "$($svc.Name).log"
    $jobName  = "ez-$($svc.Name)"
    
    $job = Start-Job -Name $jobName -ScriptBlock {
        param($proj, $log)
        dotnet run --project $proj 2>&1 | Tee-Object -FilePath $log
    } -ArgumentList $fullProj, $logFile
    
    Write-Host "  [Job $($job.Id)] $($svc.Name) -> https://localhost:$($svc.Port)" -ForegroundColor Green
}

Write-Host ""
Write-Host "All services starting... waiting 12s for boot..." -ForegroundColor DarkGray
Start-Sleep -Seconds 12

Write-Host ""
Write-Host "=== Health Check ===" -ForegroundColor Cyan
foreach ($svc in $Services) {
    try {
        $r = Invoke-WebRequest -Uri "https://localhost:$($svc.Port)/health" -SkipCertificateCheck -TimeoutSec 4 -ErrorAction Stop
        Write-Host "  OK  $($svc.Name) :$($svc.Port) -> $($r.StatusCode)" -ForegroundColor Green
    } catch {
        $msg = $_.Exception.Message
        if ($msg -like "*refused*" -or $msg -like "*actively refused*") {
            Write-Host "  ERR $($svc.Name) :$($svc.Port) -> not listening" -ForegroundColor Red
        } else {
            Write-Host "  OK? $($svc.Name) :$($svc.Port) -> $msg" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "Logs: $LogDir" -ForegroundColor Gray
Write-Host "Stop: .\start-backend.ps1 -Stop" -ForegroundColor Gray
Write-Host ""

Write-Host 'Press Ctrl+C to stop' -ForegroundColor Cyan
Wait-Job -Name ez-*
