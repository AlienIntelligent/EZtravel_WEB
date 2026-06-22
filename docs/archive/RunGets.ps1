$ErrorActionPreference = "Continue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzgwNDczMTEwLCJleHAiOjE3ODA1NTk1MTAsImlhdCI6MTc4MDQ3MzExMCwiaXNzIjoiZXpUcmF2ZWwuQXV0aFNlcnZpY2UiLCJhdWQiOiJlelRyYXZlbC5DbGllbnQifQ.3dcCyIoaopmKurTRzwDbiuK7YxC60DSulSQvMy8SUpg"
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

function Test-Get {
    param([string]$url)
    Write-Host "GET $url"
    try {
        $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        Write-Host "Status: 200 OK"
        $json = $res | ConvertTo-Json -Depth 5
        Write-Host "Response: $json"
    } catch {
        if ($_.Exception.Response) {
            Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $body = $reader.ReadToEnd()
            Write-Host "Response: $body"
        } else {
            Write-Host "Status: Error"
            Write-Host "Response: $($_.Exception.Message)"
        }
    }
    Write-Host "--------------------------------"
}

Test-Get "https://localhost:7003/api/places/search?Keyword=a"
Test-Get "https://localhost:7005/api/reviews/place/31"
Test-Get "https://localhost:7002/api/trips"
