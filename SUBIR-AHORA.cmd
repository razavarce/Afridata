@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ============================================
echo  AFRIDATA - Subir a GitHub
echo  Carpeta: %CD%
echo  https://github.com/razavarce/Afridata
echo ============================================
echo.
echo IMPORTANTE: Ejecute con DOBLE CLIC en el Explorador.
echo NO abra este archivo en Git Bash.
echo.

where git >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git no esta instalado.
    echo Descargue desde https://git-scm.com/download/win
    pause
    exit /b 1
)

if not exist ".git" (
    echo ERROR: No hay repositorio Git en esta carpeta.
    pause
    exit /b 1
)

git checkout main 2>nul
git fetch origin

echo Estado actual:
git status -sb
echo.

for /f %%i in ('git rev-list --count HEAD..origin/main 2^>nul') do set BEHIND=%%i
for /f %%i in ('git rev-list --count origin/main..HEAD 2^>nul') do set AHEAD=%%i
if not defined BEHIND set BEHIND=0
if not defined AHEAD set AHEAD=0
echo Local: %AHEAD% commit(s) adelante, %BEHIND% commit(s) atrasado respecto a GitHub.
echo.

echo [1/3] Integrando cambios de GitHub...
git pull --rebase origin main 2>nul
if errorlevel 1 (
    echo Rebase no aplico. Intentando merge con historiales distintos...
    git rebase --abort 2>nul
    git pull origin main --no-rebase --allow-unrelated-histories
    if errorlevel 1 (
        echo.
        echo ============================================
        echo  CONFLICTO - hay que resolverlo una vez
        echo ============================================
        echo.
        echo 1. Abra los archivos que Git marque en conflicto
        echo    Busque lineas: ^<^<^<^<^<^<^<  =======  ^>^>^>^>^>^>^>
        echo 2. Deje SU version de pagina afridataV10.5.5.html
        echo 3. Abra CMD en esta carpeta y ejecute:
        echo       git add .
        echo       git commit -m "Integra cambios locales con GitHub"
        echo       git push -u origin main
        echo.
        echo O vuelva a ejecutar SUBIR-AHORA.cmd despues del paso 3.
        pause
        exit /b 1
    )
)

echo.
echo [2/3] Verificando sincronizacion...
for /f %%i in ('git rev-list --count HEAD..origin/main 2^>nul') do set BEHIND2=%%i
if not defined BEHIND2 set BEHIND2=0
if %BEHIND2% GTR 0 (
    echo Aun atrasado. Intentando merge normal...
    git pull origin main --no-rebase
)

echo.
echo [3/3] Subiendo a GitHub...
git push -u origin main
if errorlevel 1 (
    echo.
    echo ERROR al subir. Copie TODO el texto de arriba y envielo para ayuda.
    echo Si pide usuario/contrasena use un Token de GitHub, no la clave de la cuenta.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  LISTO - Cambios en GitHub
echo  https://github.com/razavarce/Afridata
echo ============================================
pause
