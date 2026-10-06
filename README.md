# Aguacate · Oleolab
Interfaz móvil para capturar la bitácora de recepción de materia prima vegetal y enviar los registros a Google Sheets.

## Regla de peso
- Peso báscula = peso bruto - tara.
- Diferencia % = ABS(peso báscula - peso proveedor) / peso proveedor.
- Si la diferencia es <= 1%, el peso oficial es el del proveedor.
- Si supera 1%, el peso oficial es el obtenido en báscula Oleolab.

## Google Sheets + Apps Script
1. Use el archivo **BD_Recepcion_Aguacate_Oleolab.xlsx** y ábralo/impórtelo como Google Sheets.
2. En Sheets: Extensiones > Apps Script.
3. Copie el contenido de `gas/Code.gs`.
4. Implementar > Nueva implementación > Aplicación web. Ejecutar como usted y acceso según su política interna.
5. Copie la URL terminada en `/exec` y péguela en `API_URL` al inicio de `app.js`.
6. Confirme que la pestaña se llame exactamente `BD_Recepciones`.

## GitHub Pages
En Settings > Pages seleccione **Deploy from a branch**, rama `main`, carpeta `/(root)`.
La app funciona como PWA básica y conserva capturas pendientes en el dispositivo para enviarlas al recuperar conexión. Cada registro usa UUID para evitar duplicados en la hoja.
