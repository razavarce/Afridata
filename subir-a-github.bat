@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Redirigiendo a PUBLICAR-GITHUB-PAGES.cmd ...
call "%~dp0PUBLICAR-GITHUB-PAGES.cmd"
