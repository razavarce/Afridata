$path = 'd:\Proyecto Viceministerio de África en Vzla\pagina afridataV10.5.1.html'
$pattern = 'foto:"([^"]+)"'
$matches = Select-String -Path $path -Pattern $pattern -AllMatches | ForEach-Object { $_.Matches } | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
$results = @()
foreach ($url in $matches) {
  $fileName = ($url.Split('?')[0].Split('/') | Select-Object -Last 1)
  try {
    $resp = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 15 -MaximumRedirection 5
    $status = $resp.StatusCode
    $ctype = $resp.Headers['Content-Type']
    $cl = $resp.Headers['Content-Length']
  } catch {
    try {
      $resp2 = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 20 -MaximumRedirection 5
      $status = $resp2.StatusCode
      $ctype = $resp2.Headers['Content-Type']
      $cl = $resp2.Headers['Content-Length']
    } catch {
      $status = 'ERROR'
      $ctype = ''
      $cl = ''
    }
  }
  $results += [PSCustomObject]@{ Url=$url; FileName=$fileName; Status=$status; ContentType=$ctype; ContentLength=$cl }
}
$csvPath = 'd:\Proyecto Viceministerio de África en Vzla\image_report.csv'
$results | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
$results | Format-Table -AutoSize
Write-Host "CSV guardado en: $csvPath"