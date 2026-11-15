# Matriz de casos esperados

Recorrido de cada consulta y resultado esperado para la API simulada, los errores, los estados
de una consulta, la carga, la optimización de las consultas y la navegación. Cada caso indica qué módulo es **responsable**
del resultado y **cómo se verifica**: con una prueba automática (`npm test`, el código del caso
aparece en el nombre de la prueba) o con un recorrido en el navegador, usando el panel «Probar
el servidor simulado» del pie de página.

## Recorrido de una consulta

```
Página  →  useConsulta('categorias')  →  ¿respuesta vigente en la caché?  ── sí ──→  se dibuja sin pedir
                                               │ no
                                               ↓
            pedirCompartido (api/cache.js: una sola petición por clave, cancelable)
               →  pedirJSON (api/cliente.js: espera al mock, fetch con tiempo máximo, errores con tipo)
               →  Service Worker de MSW  →  handlers.js (datos.js + condición del panel)
               →  la caché guarda la respuesta y avisa (useSyncExternalStore)
               →  la página se vuelve a dibujar con los datos, o con el error si falló
```

Las decisiones que se repiten viven en un solo lugar: las direcciones de la API en
`api/libreria.js` (`API`), la clasificación de los errores en `api/cliente.js` (`ErrorApi`) y
los textos que ve la persona en `componentes/MensajeError.jsx` (`TEXTOS`).

## API REST simulada — `mocks/handlers.js`, `mocks/datos.js`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| A1 | `GET /api/categorias` | 8 categorías, cada una con su cantidad de libros | `handlers` | `api.test.js` |
| A2 | `GET /api/categorias/ficcion/libros` | 4 libros con solo los datos de la tarjeta | `handlers` | `api.test.js` |
| A3 | `GET /api/categorias/drama/libros` | Lista vacía (200), no un error | `handlers` | `api.test.js` |
| A4 | `GET /api/libros/dune` | Detalle completo con su categoría | `handlers` | `api.test.js` |
| A5 | Consulta hecha antes de que el servidor simulado esté listo | Espera y luego responde | `esperarServidor` | `api.test.js` |
| A6 | El servidor simulado no arranca | Error de red, sin pedir a la red real | `esperarServidor` | `api.test.js` |
| A7 | Abrir el sitio publicado en GitHub Pages | El Service Worker responde `/api` dentro de la subcarpeta | `main.jsx` | Navegador |

## Errores — `api/cliente.js`, `componentes/MensajeError.jsx`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| E1 | Categoría que no existe (`terror`) | 404 → `no-encontrado`, con el nombre pedido en el mensaje | `pedirJSON` | `api.test.js` |
| E2 | Libro que no existe | 404 → `no-encontrado` | `pedirJSON` | `api.test.js` |
| E3 | Modo «Error del servidor» | 500 → `servidor` | `pedirJSON` | `api.test.js` |
| E4 | Modo «Sin conexión» | `red` | `pedirJSON` | `api.test.js` |
| E5 | Modo «Sin respuesta» | Se corta al tiempo máximo → `tiempo` | `pedirJSON` | `api.test.js` |
| E6 | Respuesta que no es JSON | `respuesta` | `pedirJSON` | `api.test.js` |
| E7 | La página cancela la petición | `AbortError`, no se muestra como falla del servidor | `pedirJSON` | `api.test.js` |
| E8 | Primera visita con el servidor en error | Aviso «El servidor tuvo un problema» y botón «Reintentar» | `MensajeError` | Navegador |
| E9 | Volver al modo normal y pulsar «Reintentar» | Esqueleto y luego las categorías | `useConsulta` | Navegador |
| E10 | Error al actualizar una página que ya tenía datos | Aviso del error y los datos anteriores a la vista | `useConsulta` (`respaldo`) | Navegador |
| E11 | Abrir `/categorias/terror` | Aviso sin «Reintentar», salida a las categorías y las categorías que sí existen | `Categoria` | Navegador |
| E12 | Abrir `/libros/no-existe` | Aviso sin «Reintentar» y salida a las categorías | `DetalleLibro` | Navegador |

## Estados de una consulta — `hooks/useConsulta.js`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| C1 | Primera consulta (en modo estricto) | `cargando` sin datos, luego los datos; una sola petición | `useConsulta` | `useConsulta.test.jsx` |
| C2 | Falla sin datos anteriores y se reintenta | Error sin respaldo; al reintentar, `cargando` y luego datos | `useConsulta` | `useConsulta.test.jsx` |
| C3 | Actualizar | Los datos siguen a la vista con `cargando`, luego los nuevos | `useConsulta.recargar` | `useConsulta.test.jsx` |
| C4 | Falla al actualizar | Error con `respaldo` y los datos anteriores | `useConsulta` | `useConsulta.test.jsx` |
| C5 | Otro componente con la misma consulta | Usa la respuesta guardada, sin petición nueva | `useConsulta` + caché | `useConsulta.test.jsx` |
| C6 | Vaciar la caché con la página abierta | Vuelve a pedir y no queda cargando | `useConsulta` (suscripción) | `useConsulta.test.jsx` |
| C7 | Dos consultas en una página; vaciar y actualizar una | Ambas terminan con sus datos | `useConsulta` | `useConsulta.test.jsx` |

## Carga — `componentes/Cargando.jsx`, `componentes/Cabecera.jsx`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| L1 | Primera visita | Esqueleto con las líneas de las tarjetas reales, «Cargando categorías…» (luego «8 categorías») y barra de actividad en la cabecera | `Cargando`, `Inicio`, `Cabecera` | Navegador |
| L2 | Modo «Lento» | El esqueleto se mantiene los 3 segundos, sin saltos al llegar los datos | `Cargando` | Navegador |
| L3 | Pulsar «Actualizar» | Los datos siguen a la vista y el botón dice «Actualizando…» | `useConsulta.recargar` | Navegador |
| L4 | Abrir una categoría | El nombre aparece al tiro (caché) y el esqueleto tiene tantas tarjetas como libros | `Categoria` | Navegador |
| L5 | Categoría sin libros (`drama`) | Mensaje «Todavía no tenemos libros…» con salida, no un error | `Categoria` | Navegador |
| L6 | Primera carga de inicio, categoría y detalle, en escritorio y teléfono | La página no se mueve al llegar el código, la fuente y los datos (desplazamiento acumulado bajo 0,001) | `Cargando`, `Plantilla`, `estilos.css` | Navegador |

## Optimización — `api/cache.js`, `hooks/useConsulta.js`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| O1 | Repetir una consulta antes de 5 minutos | Se usa la respuesta guardada | `leerVigente` | `cache.test.js` |
| O2 | Dos componentes piden lo mismo a la vez | Una sola petición | `pedirCompartido` | `cache.test.js` |
| O3 | Todos dejan de necesitar la respuesta | La petición se cancela | `pedirCompartido` | `cache.test.js` |
| O4 | Uno se va y otro sigue esperando | La petición continúa | `pedirCompartido` | `cache.test.js` |
| O5 | «Actualizar» | Se consulta de nuevo y se conserva el respaldo | `vencer` | `cache.test.js` |
| O6 | Empieza o termina una petición | El indicador de la cabecera se entera | `suscribir` | `cache.test.js` |
| O7 | React en modo estricto monta, desmonta y vuelve a montar | Una sola petición, no dos | `pedirCompartido` | `cache.test.js` |
| O8 | Volver al inicio desde una categoría | Sin petición nueva a `/api/categorias` | `useConsulta` | Navegador |
| O9 | «Vaciar caché» con una categoría abierta y luego «Actualizar» | Ambas consultas vuelven a pedir, ninguna queda cargando | `useConsulta` | Navegador |
| O10 | Ver una categoría | El detalle completo de cada libro se pide recién al abrirlo | `handlers`, `DetalleLibro` | Navegador |
| O11 | Abrir el sitio | El código de cada página se descarga recién al visitarla | `lazy` en `AppRoutes` | Navegador |

## Navegación — `rutas/AppRoutes.jsx`, `rutas/paginasPublicadas.js`

| N° | Caso | Resultado esperado | Responsable | Verificación |
|---|---|---|---|---|
| N1 | Abrir `/` | Página de categorías (ruta índice) | `AppRoutes` | `rutas.test.jsx` |
| N2 | Abrir `/categorias/ficcion` y `/libros/dune` | Rutas dinámicas con su `id` | `AppRoutes` | `rutas.test.jsx` |
| N3 | Abrir `/ofertas`, `/categorias` o `/libros/dune/extra` | Página no encontrada (`*`) | `AppRoutes` | `rutas.test.jsx` |
| N4 | Cambiar las categorías o libros del servidor simulado | Se publica una página por cada uno, ni más ni menos | `paginasPublicadas.js` | `rutas.test.jsx` |
| N5 | Navegar con las tarjetas, la ruta de navegación y el menú | La página cambia sin recargar el documento | `Link`, `NavLink` | Navegador |
| N6 | Recargar una ruta publicada en GitHub Pages | Estado 200 y la misma página | `vite.config.js` + `paginasPublicadas.js` | Navegador |
