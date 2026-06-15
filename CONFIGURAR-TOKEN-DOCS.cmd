@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================================
echo  AFRIDATA - Token documentos (SOLO LOCAL)
echo ============================================
echo.
echo IMPORTANTE: GitHub NO permite subir el token al repositorio.
echo Este archivo queda SOLO en su PC para usar la app localmente
echo o guardar el token en Panel Admin en cada navegador.
echo.
echo Cree un token en GitHub:
echo   Settings - Developer settings - Fine-grained tokens
echo   Repositorio: razavarce/Afridata
echo   Contents: Read and write
echo.

set /p TOKEN="Pegue el token GitHub aqui: "
if "%TOKEN%"=="" (
    echo ERROR: No ingreso token.
    pause
    exit /b 1
)

(
echo /**
echo  * Token LOCAL - NO se sube a GitHub
echo  */
echo window.AFRIDATA_DOCS_GITHUB_TOKEN = '%TOKEN%';
) > "afridata-sync-config.js"

echo.
echo OK: Token guardado en afridata-sync-config.js (solo en su PC).
echo.
echo Para la WEB (github.io): entre como admin, Panel Admin,
echo seccion Documentos compartidos, pegue el mismo token y Guardar.
echo.
echo Si GitHub le bloqueo un push antes, REVOQUE ese token y cree uno nuevo.
echo.
pause
