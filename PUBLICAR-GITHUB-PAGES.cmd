@echo off

chcp 65001 >nul

cd /d "%~dp0"



echo.

echo ============================================

echo  AFRIDATA - Publicar en GitHub Pages

echo  https://razavarce.github.io/Afridata/

echo ============================================

echo.

echo Ejecute con DOBLE CLIC en el Explorador (no en Git Bash).

echo.



where git >nul 2>&1

if errorlevel 1 (

    echo ERROR: Git no esta instalado.

    echo https://git-scm.com/download/win

    pause

    exit /b 1

)



if not exist ".git" (

    echo ERROR: No hay repositorio Git en esta carpeta.

    pause

    exit /b 1

)



if not exist "pagina afridataV10.5.5.html" (

    echo ERROR: Falta pagina afridataV10.5.5.html

    pause

    exit /b 1

)



echo [1/5] Preparando archivos para GitHub Pages...

copy /Y "pagina afridataV10.5.5.html" "index.html" >nul

if errorlevel 1 goto :copiar_ps

copy /Y "pagina afridataV10.5.5.html" "html" >nul

if errorlevel 1 goto :copiar_ps

goto :copiar_ok



:copiar_ps

echo copy fallo, intentando PowerShell...

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0copiar-pages.ps1"

if errorlevel 1 (

    echo ERROR al crear index.html y html

    pause

    exit /b 1

)



:copiar_ok

if not exist "index.html" (

    echo ERROR: index.html no se creo.

    pause

    exit /b 1

)

if not exist "html" (

    echo ERROR: html no se creo.

    pause

    exit /b 1

)

echo    OK: index.html y html sincronizados desde v10.5.5

echo.



git checkout main 2>nul

git fetch origin



echo [2/5] Estado actual:

git status -sb

echo.



echo [3/5] Agregando archivos del sitio...

git add "index.html" "html" "README.md" ".nojekyll" ".gitignore"

git add "pagina afridataV10.5.5.html"

git add "PUBLICAR-GITHUB-PAGES.cmd" "copiar-pages.ps1" "SUBIR-AHORA.cmd" "LEEME-GITHUB.txt" 2>nul

git add "subir-a-github.bat" "sincronizar-y-subir.bat" 2>nul

if exist "logo MPPRE.jpeg" git add "logo MPPRE.jpeg"
if exist "logo afridata2.png" git add "logo afridata2.png"



echo Archivos en staging:

git diff --cached --stat

echo.



git diff --cached --quiet

if not errorlevel 1 (

    echo No hay cambios nuevos en los archivos del sitio.

    echo Continuando con sincronizacion y subida...

) else (

    echo [4/5] Creando commit...

    git commit -m "Publica AFRIDATA v10.5.5 en GitHub Pages con index.html y README correcto."

    if errorlevel 1 (

        echo ERROR al crear commit.

        pause

        exit /b 1

    )

)



echo.

echo [5/5] Integrando con GitHub y subiendo...

git pull --rebase origin main 2>nul

if errorlevel 1 (

    echo Rebase no aplico. Intentando merge...

    git rebase --abort 2>nul

    git pull origin main --no-rebase --allow-unrelated-histories

    if errorlevel 1 (

        echo.

        echo ============================================

        echo  CONFLICTO - resolver una sola vez

        echo ============================================

        echo.

        echo 1. Abra los archivos con marcas ^<^<^<^<^<^<^<

        echo 2. En index.html y README.md deje SU version nueva

        echo 3. En CMD ejecute:

        echo       git add index.html html README.md

        echo       git commit -m "Integra cambios con GitHub"

        echo       git push -u origin main

        echo.

        echo O vuelva a ejecutar PUBLICAR-GITHUB-PAGES.cmd

        pause

        exit /b 1

    )

)



git push -u origin main

if errorlevel 1 (

    echo.

    echo ERROR al subir. Use un Token de GitHub si pide contrasena.

    pause

    exit /b 1

)



echo.

echo ============================================

echo  LISTO - Sitio publicado

echo  GitHub:  https://github.com/razavarce/Afridata

echo  Web:     https://razavarce.github.io/Afridata/

echo  Espere 1-2 minutos y recargue con Ctrl+F5

echo ============================================

pause

