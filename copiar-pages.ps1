# Sincroniza index.html y html desde el archivo maestro v10.5.5
$ErrorActionPreference = 'Stop'
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $dir 'pagina afridataV10.5.5.html'
if (-not (Test-Path -LiteralPath $src)) {
    Write-Error "No se encuentra: $src"
}
Copy-Item -LiteralPath $src -Destination (Join-Path $dir 'index.html') -Force
Copy-Item -LiteralPath $src -Destination (Join-Path $dir 'html') -Force
Write-Host 'OK: index.html y html actualizados desde pagina afridataV10.5.5.html'
