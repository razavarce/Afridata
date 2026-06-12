@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo  AFRIDATA - Subir cambios a GitHub
echo  Repositorio: https://github.com/razavarce/Afridata
echo ============================================
echo.

where git >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git no esta instalado o no esta en el PATH.
    echo Instale Git desde https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/5] Estado actual...
git status
echo.

echo [2/5] Agregando archivos...
git add "pagina afridataV10.5.5.html"
if exist "logo MPPRE.jpeg" git add "logo MPPRE.jpeg"
git add "subir-a-github.bat" 2>nul

echo.
echo [3/5] Archivos en staging:
git diff --cached --stat
echo.

git diff --cached --quiet
if not errorlevel 1 (
    echo No hay cambios nuevos para subir.
    git status
    pause
    exit /b 0
)

echo [4/5] Creando commit...
git commit -m "Actualiza AFRIDATA v10.5.5 con panel admin manual, documentos, auditoria IP y logo MPPRE."

if errorlevel 1 (
    echo.
    echo ERROR al crear el commit. Revise los mensajes arriba.
    pause
    exit /b 1
)

echo.
echo [5/5] Subiendo a GitHub (rama main)...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR al subir. Si pide usuario/contrasena:
    echo   - Use un Token de acceso personal de GitHub
    echo   - O ejecute: gh auth login
    echo   - O configure SSH con su cuenta
    pause
    exit /b 1
)

echo.
echo ============================================
echo  LISTO - Cambios subidos a GitHub
echo  https://github.com/razavarce/Afridata
echo ============================================
pause
