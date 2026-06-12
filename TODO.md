# TODO - Carpeta de información por país + edición admin

## Objetivo
Agregar en cada ficha de país una pestaña **“Carpeta de información”** para subir/visualizar/importar/exportar documentos por `countryId`, y permitir edición manual desde **Admin**.

## Pasos
1. [ ] Implementar UI en `countryModal`:
   - Agregar tab “Carpeta de información”
   - Agregar contenedor `tab-carpetainfo`
2. [ ] Crear modelo de datos en `localStorage`:
   - Definir clave `afridata_country_files_v1`
   - Estructura por `countryId`
3. [ ] Implementar lógica de subida y render:
   - `uploadCountryDocuments()`
   - `renderCountryFolder(countryId)`
   - Vista previa (imágenes) + enlaces/embebidos (pdf)
4. [ ] Implementar eliminar documentos por `countryId`:
   - `deleteCountryDocument(countryId, itemId)`
5. [ ] Implementar export/import carpeta por país:
   - `exportCountryFolderToClipboard()`
   - `exportCountryFolderToJSONDownload()` (si se requiere)
   - `importCountryFolderFromTextarea()` y/o desde input file .json
6. [ ] Respetar aislamiento por país:
   - Asegurar que el render/operaciones usen siempre `modal.dataset.countryId`
7. [ ] Admin: asegurar edición manual de fichas:
   - País (ya existe panel; confirmar wiring)
   - Autoridades, hitos y embajadas: mover a persistencia editable vía overrides/overlays
8. [ ] Integrar editor manual de “Carpeta de información” en Admin (opcional según alcance):
   - Abrir país seleccionado
   - Acciones de import/export/borrar
9. [ ] QA rápido:
   - Abrir fichas distintos países y verificar aislamiento
   - Probar subir varios tipos de archivo (pdf/imagen) 
   - Probar export/import JSON

## Notas
- Este proyecto es un único HTML/JS; no hay backend. Por lo tanto “visualizados desde cualquier sitio” se logrará mientras el navegador conserve el storage (localStorage) o mediante export/import.

