# Aguacate · Oleolab
PWA para recepción de materia prima vegetal.

**Google Sheet de producción:** https://docs.google.com/spreadsheets/d/1fo07NTi9sL8255aDec-CQ9RBfBEJT0nnWn8YhvRp_X8/edit

## Regla
Peso báscula = bruto - tara. Si ABS(peso báscula - peso proveedor) / peso proveedor <= 1%, se conserva el peso proveedor. Si supera 1%, se usa báscula Oleolab.

## Activación del endpoint (único paso manual)
Google Apps Script exige autorizar e implementar desde la cuenta propietaria:
1. En el Sheet: Extensiones > Apps Script.
2. Copiar `gas/Code.gs`.
3. Implementar > Nueva implementación > Aplicación web.
4. Ejecutar como: usted. Acceso: cualquier usuario con el enlace (o la política autorizada por Oleolab).
5. Copiar la URL terminada en `/exec`.
6. Abrir la app de GitHub Pages y en consola ejecutar:
   `localStorage.setItem('aguacate_api_url','URL_EXEC'); location.reload();`

La app conserva capturas offline y sincroniza al recuperar conexión. Cada registro usa UUID para evitar duplicados.