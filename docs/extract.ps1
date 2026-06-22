Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("D:\eztravel\docs\CRD_EZtravel.docx")
$entry = $zip.GetEntry("word/document.xml")
$reader = New-Object System.IO.StreamReader($entry.Open())
$xmlString = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()
$xmlString = $xmlString -replace '<w:p(?:.*?)>', "`r`n" -replace '<[^>]+>', ''
Set-Content -Path 'D:\eztravel\docs\CRD_EZtravel.txt' -Value $xmlString -Encoding UTF8
