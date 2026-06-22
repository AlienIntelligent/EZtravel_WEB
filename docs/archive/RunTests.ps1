[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }

$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNzgwNDczMTEwLCJleHAiOjE3ODA1NTk1MTAsImlhdCI6MTc4MDQ3MzExMCwiaXNzIjoiZXpUcmF2ZWwuQXV0aFNlcnZpY2UiLCJhdWQiOiJlelRyYXZlbC5DbGllbnQifQ.3dcCyIoaopmKurTRzwDbiuK7YxC60DSulSQvMy8SUpg"
$headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

# A1 - Create Place
Write-Host "Creating Place..."
$placePayload = @{ tenDiaDiem = "CRUD Test Place"; moTa = "Test Place"; maTinhThanh = 1 } | ConvertTo-Json
$placeRes = Invoke-RestMethod -Uri "https://localhost:7003/api/places" -Method Post -Body $placePayload -Headers $headers
$placeId = $placeRes.data.id
if (-not $placeId) { $placeId = $placeRes.id }
Write-Host "Place created with ID: $placeId"

# A2 - Read Place
Write-Host "Reading Place..."
$placeRead = Invoke-RestMethod -Uri "https://localhost:7003/api/places/$placeId" -Method Get -Headers $headers

# A3 - Update Place
Write-Host "Updating Place..."
$placeUpdatePayload = @{ tenDiaDiem = "CRUD Test Place Updated"; moTa = "Test Place Updated"; maTinhThanh = 1 } | ConvertTo-Json
$placeUpdate = Invoke-RestMethod -Uri "https://localhost:7003/api/places/$placeId" -Method Put -Body $placeUpdatePayload -Headers $headers

# B1 - Create Place Review
Write-Host "Creating Review..."
$reviewPayload = @{ placeId = $placeId; rating = 5; comment = "Great place!" } | ConvertTo-Json
$reviewRes = Invoke-RestMethod -Uri "https://localhost:7005/api/reviews" -Method Post -Body $reviewPayload -Headers $headers
$reviewId = $reviewRes.id
if (-not $reviewId) { $reviewId = $reviewRes.data.id }
Write-Host "Review created with ID: $reviewId"

# B2 - Read Review
Write-Host "Reading Review..."
$reviewRead = Invoke-RestMethod -Uri "https://localhost:7005/api/reviews/place/$placeId" -Method Get -Headers $headers

# C1 - Create Trip
Write-Host "Creating Trip..."
$tripPayload = @{ tenLichTrinh = "CRUD Test Trip"; laCongKhai = $true } | ConvertTo-Json
$tripRes = Invoke-RestMethod -Uri "https://localhost:7002/api/trips" -Method Post -Body $tripPayload -Headers $headers
$tripId = $tripRes.id
if (-not $tripId) { $tripId = $tripRes.data.id }
Write-Host "Trip created with ID: $tripId"

# C2 - Read Trip
Write-Host "Reading Trip..."
$tripRead = Invoke-RestMethod -Uri "https://localhost:7002/api/trips/$tripId" -Method Get -Headers $headers

# C3 - Update Trip
Write-Host "Updating Trip..."
$tripUpdatePayload = @{ tenLichTrinh = "CRUD Test Trip Updated"; laCongKhai = $true } | ConvertTo-Json
$tripUpdate = Invoke-RestMethod -Uri "https://localhost:7002/api/trips/$tripId" -Method Put -Body $tripUpdatePayload -Headers $headers

Write-Host "Done."
