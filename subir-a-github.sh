#!/usr/bin/env bash
# Ejecutar en Git Bash: bash subir-a-github.sh
set -e
cd "$(dirname "$0")"

echo "============================================"
echo " AFRIDATA - Subir cambios a GitHub"
echo " Repositorio: https://github.com/razavarce/Afridata"
echo "============================================"
echo

if ! command -v git &>/dev/null; then
  echo "ERROR: Git no esta instalado."
  exit 1
fi

echo "[1/5] Estado actual..."
git status
echo

echo "[2/5] Agregando archivos..."
git add "pagina afridataV10.5.5.html"
[[ -f "logo MPPRE.jpeg" ]] && git add "logo MPPRE.jpeg"
git add "subir-a-github.sh" 2>/dev/null || true

echo
echo "[3/5] Archivos en staging:"
git diff --cached --stat
echo

if git diff --cached --quiet; then
  echo "No hay cambios nuevos para subir."
  git status
  exit 0
fi

echo "[4/5] Creando commit..."
git commit -m "Actualiza AFRIDATA v10.5.5 con panel admin manual, documentos, auditoria IP y logo MPPRE."

echo
echo "[5/5] Subiendo a GitHub (rama main)..."
git push -u origin main

echo
echo "============================================"
echo " LISTO - https://github.com/razavarce/Afridata"
echo "============================================"
