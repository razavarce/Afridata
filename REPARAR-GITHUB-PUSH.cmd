@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================================
echo  REPARAR push bloqueado por token
echo ============================================
echo.

if not exist ".git" (
    echo ERROR: No hay repositorio Git aqui.
    pause
    exit /b 1
)

echo [1] Quitando token del archivo local...
(
echo /**
echo  * Token LOCAL - NO se sube a GitHub
echo  */
echo window.AFRIDATA_DOCS_GITHUB_TOKEN = 'PEGAR_TOKEN_AQUI';
) > "afridata-sync-config.js"

echo [2] Sacando afridata-sync-config.js del repositorio...
git rm --cached "afridata-sync-config.js" 2>nul

echo [3] Deshaciendo el ultimo commit local (el que tenia el token)...
git reset --soft HEAD~1 2>nul
if errorlevel 1 (
    echo No habia commit que deshacer o ya estaba limpio.
)

echo [4] Agregando archivos seguros...
git add ".gitignore" "PUBLICAR-GITHUB-PAGES.cmd" "CONFIGURAR-TOKEN-DOCS.cmd" "LEEME-GITHUB.txt" "afridata-sync-config.example.js" 2>nul
git add "pagina afridataV10.5.5.html" ".gitignore" 2>nul

git diff --cached --quiet
if not errorlevel 1 (
    echo No hay cambios pendientes para commit.
) else (
    git commit -m "Quita token del repositorio y corrige sincronizacion de documentos."
)

echo.
echo ============================================
echo  LISTO para volver a publicar
echo ============================================
echo.
echo 1. REVOQUE el token en GitHub (fue detectado en un commit local)
echo    Settings - Developer settings - Fine-grained tokens - Delete
echo.
echo 2. Cree un token NUEVO (Contents: Read and write en Afridata)
echo.
echo 3. Ejecute PUBLICAR-GITHUB-PAGES.cmd
echo.
echo 4. En la WEB: Panel Admin - pegue el token nuevo y Guardar
echo    (no lo ponga en archivos del proyecto)
echo.
pause
