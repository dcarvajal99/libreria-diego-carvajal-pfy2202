# Librería Página Austral — Semana 4

> **Sitio publicado:** https://dcarvajal99.github.io/libreria-diego-carvajal-pfy2202/
> **Repositorio:** https://github.com/dcarvajal99/libreria-diego-carvajal-pfy2202

Actividad formativa «Utilizando tecnologías de integración entre frontend y backend» de la
asignatura **Desarrollo Frontend II (PFY2202)**, Duoc UC. Exp 2 — Semana 4.

Tienda de libros ficticia construida con **React 19**, **React Router 7**, **Tailwind CSS 4** y
**Vite**. Las personas exploran las **categorías de libros**, ven los libros de cada una y abren el
detalle de un libro. Todos los datos llegan desde una **API REST simulada** con
**Mock Service Worker (MSW)**: el sitio hace peticiones `fetch` reales y un Service Worker las
responde como lo haría un backend, con demoras, errores 404 y 500.

> **Nombre del repositorio.** Las instrucciones indican `hospital-nombre-apellido-siglaCurso`, un
> nombre que no corresponde a una tienda de libros. Se usó `libreria-diego-carvajal-pfy2202`, con el
> mismo patrón de nombre y apellido más la sigla del curso.

---

## Rutas del sitio

| Ruta | Página | Qué muestra | Consulta a la API |
|---|---|---|---|
| `/` | Categorías | Las 8 categorías, con la cantidad de libros de cada una | `GET /api/categorias` |
| `/categorias/:id` | Libros de una categoría | Ruta dinámica: nombre, descripción y libros de la categoría | `GET /api/categorias` (desde la caché) y `GET /api/categorias/:id/libros` |
| `/libros/:id` | Detalle del libro | Ruta dinámica: sinopsis, autor, año, páginas, categoría y precio | `GET /api/libros/:id` |
| cualquier otra | Página no encontrada | Aviso con la dirección pedida y enlace a las categorías | — |

## La API REST simulada

`src/mocks/handlers.js` declara los tres recursos con los handlers de MSW (`http.get` y
`HttpResponse`), a partir de los datos de `src/mocks/datos.js`:

| Petición | Respuesta |
|---|---|
| `GET /api/categorias` | 200 con la lista de categorías y `cantidadLibros` de cada una |
| `GET /api/categorias/:id/libros` | 200 con los libros de la categoría (solo lo que muestra la tarjeta: título, autor, año y precio). Lista vacía si la categoría no tiene libros. 404 con `{ mensaje }` si la categoría no existe |
| `GET /api/libros/:id` | 200 con el detalle completo y su categoría. 404 con `{ mensaje }` si el libro no existe |

- **Mismo código en el navegador y en las pruebas.** `src/mocks/browser.js` registra los handlers en
  un Service Worker (`setupWorker`); las pruebas levantan los mismos handlers en Node (`setupServer`).
- **Activo también en GitHub Pages.** El sitio no tiene un backend real, así que `main.jsx` inicia el
  mock en la versión publicada. El Service Worker (`public/mockServiceWorker.js`) vive dentro de la
  subcarpeta del sitio.
- **La página no espera al mock.** `main.jsx` dibuja la aplicación y, al mismo tiempo, inicia MSW:
  solo las consultas esperan a que esté listo (`esperarServidor` en `api/cliente.js`). Con un backend
  real bastaría con no iniciar el mock.
- **Panel «Probar el servidor simulado».** En el pie de cada página se elige cómo responde el
  servidor, para ver la reacción del sitio a cada caso:

| Modo | Qué hace el servidor |
|---|---|
| Normal | Responde en unos 400 ms |
| Red lenta | Responde en 3 segundos |
| Error del servidor | Responde 500 a todas las peticiones |
| Sin conexión | La petición falla antes de llegar al servidor |
| Sin respuesta | No contesta nunca; el cliente se rinde a los 8 segundos |

El modo elegido se guarda en `sessionStorage` y se mantiene al recargar. «Vaciar caché» olvida las
respuestas guardadas y la página abierta vuelve a consultar.

## Qué pide la actividad y cómo se resolvió

| Pide la actividad | Cómo se resolvió |
|---|---|
| Tienda de libros con HTML, JavaScript, CSS y React | Librería Página Austral: React 19 con Vite y Tailwind CSS 4 |
| Explorar diferentes categorías de libros | Inicio con las categorías; cada una abre sus libros y cada libro, su detalle |
| API REST mock para listar las categorías | MSW responde `GET /api/categorias` y dos recursos más; el sitio los consume con `fetch` |
| Navegación con React Router | `BrowserRouter`, rutas centralizadas, dos rutas dinámicas con `useParams`, ruta de diseño con `Outlet`, `Link`, `NavLink` y ruta `*` |
| Manejo de errores 404 y 500 | Cada falla se clasifica (`ErrorApi`) y se explica con un mensaje propio, junto a una salida: reintentar, volver a las categorías o elegir otra categoría |
| Indicador de carga en cada petición | Esqueleto con la forma del contenido, «Actualizando…» en el botón y una barra bajo la cabecera mientras haya peticiones en curso |
| Consultas sin repeticiones y solo cuando hacen falta | Caché de 5 minutos, una sola petición por recurso aunque lo pidan varios componentes, cancelación de lo que ya nadie necesita y detalle de cada libro pedido recién al abrirlo |
| Repositorio en GitHub | Este repositorio, publicado en GitHub Pages |

## Cómo viaja una consulta

```
Página  →  useConsulta('categorias')  →  ¿respuesta vigente en la caché?  ── sí ──→  se dibuja sin pedir
                                               │ no
                                               ↓
            pedirCompartido (api/cache.js: una sola petición por recurso, cancelable)
               →  pedirJSON (api/cliente.js: espera al mock, fetch con tiempo máximo, errores con tipo)
               →  Service Worker de MSW  →  handlers.js
               →  la caché guarda la respuesta y avisa  →  la página se dibuja con los datos o el error
```

| Archivo | Responsabilidad |
|---|---|
| `api/libreria.js` | Las direcciones de la API en un solo lugar (`API.categorias()`, `API.libro(id)`...) |
| `api/cliente.js` | `pedirJSON`: la única función que llama a `fetch`. Corta a los 8 segundos y convierte cada falla en un `ErrorApi` con su tipo |
| `api/cache.js` | Respuestas guardadas con su hora, peticiones compartidas y cancelables, y aviso a los suscriptores de cada cambio |
| `hooks/useConsulta.js` | Une todo para un componente: `{ datos, cargando, error, respaldo, recargar }` |

### Errores

| Tipo | Cuándo ocurre | Mensaje | Salida que se ofrece |
|---|---|---|---|
| `no-encontrado` | 404: la categoría o el libro no existe | «No encontramos lo que buscas», con lo que se pidió | Volver a las categorías; en una categoría inexistente, además, las categorías que sí existen |
| `servidor` | 500 o superior | «El servidor tuvo un problema» | Reintentar |
| `red` | Sin conexión | «Sin conexión con el servidor» | Reintentar |
| `tiempo` | Sin respuesta en 8 segundos | «El servidor tarda demasiado» | Reintentar |
| `respuesta` | Llegó algo que no es JSON | «No pudimos leer la respuesta» | Reintentar |

Si la página ya tenía datos y una actualización falla, los datos **siguen a la vista** junto al
aviso, que indica que son los últimos que se recibieron (respaldo). Una categoría sin libros no es un
error: muestra «Todavía no tenemos libros de…» con un enlace a las demás.

### Carga

- **Esqueleto** con la forma del contenido que viene: cada tarjeta gris repite las líneas de la real
  (título, texto y dato final) con su misma altura, para que la página no salte al llegar los datos. En
  una categoría tiene tantas tarjetas como libros, un dato que ya se conoce por la consulta de
  categorías; en el detalle imita la ficha del libro.
- **Línea de estado** sobre cada listado: dice «Cargando categorías…» mientras llega y «8 categorías»
  después, siempre con el mismo alto. El lector de pantalla la anuncia (`role="status"`).
- **Cada consulta tiene su propio estado.** En una categoría, el nombre aparece al instante (desde la
  caché) mientras los libros todavía cargan.
- **Actualizar sin parpadeo.** Con «Actualizar», los datos siguen a la vista y el botón dice
  «Actualizando…» (deshabilitado, para no repetir la petición). El botón está desde la primera carga
  y su ancho calza con los dos textos.
- **Indicador global.** Mientras haya al menos una petición en curso, una barra fina aparece bajo la
  cabecera y el lector de pantalla oye «Consultando el servidor…».

### Optimización de las consultas

- **Caché de 5 minutos.** Volver a una página ya visitada no repite la consulta.
- **Una sola petición por recurso.** Si dos componentes piden lo mismo a la vez, comparten la
  petición. También cubre el modo estricto de React en desarrollo, que monta cada componente dos veces.
- **Cancelación.** Si la persona sale de la página antes de la respuesta, la petición se cancela.
- **Solo lo necesario.** El listado de una categoría trae solo los datos de la tarjeta; el detalle
  completo de un libro se pide recién al abrirlo.
- **Código bajo demanda.** Cada página se descarga recién al visitarla (`lazy` y `Suspense`).
- **Primer dibujo sin esperas y sin saltos.** La aplicación se dibuja mientras MSW arranca. La fuente
  Inter se sirve desde el mismo sitio, con un respaldo de iguales medidas para que el texto no se mueva
  al cambiar de fuente. El espacio de la barra de desplazamiento queda reservado y el pie de página
  aparece junto con la página, ya en su lugar.

Al recorrer inicio → categoría → libro → categoría → inicio se hacen **3 peticiones** a la API para
5 vistas, y el documento se carga una sola vez.

## Cómo se usa React Router

- Todo se importa desde el paquete **`react-router`** (versión 7.18): `react-router-dom` ya no hace falta.
- **`BrowserRouter`** con `basename` igual a la base de Vite, porque GitHub Pages sirve el sitio dentro
  de `/libreria-diego-carvajal-pfy2202/`.
- **Rutas centralizadas** en `src/rutas/AppRoutes.jsx`: una ruta de diseño con la `Plantilla` y un
  **`<Outlet />`**, la ruta índice, las rutas dinámicas `categorias/:id` y `libros/:id` (leídas con
  **`useParams`**) y la ruta `*` al final.
- **`Link`** en tarjetas, rutas de navegación y botones; **`NavLink`** en el menú.
- **GitHub Pages y las rutas**: al construir, `vite.config.js` copia `index.html` por cada categoría y
  cada libro de `rutas/paginasPublicadas.js` (`categorias/ficcion.html`, `libros/dune.html`...), que
  Pages sirve con estado 200, y como `404.html` para el resto. Una prueba avisa si esa lista deja de
  coincidir con los datos del servidor simulado.

## Estructura del proyecto

```
libreria-diego-carvajal-pfy2202/
├── index.html                     Página que monta React
├── vite.config.js                 Tailwind, base de GitHub Pages, copias de index.html y pruebas
├── public/
│   └── mockServiceWorker.js       Service Worker de MSW
├── src/
│   ├── main.jsx                   Inicia el mock y dibuja <App /> al mismo tiempo
│   ├── App.jsx                    BrowserRouter
│   ├── estilos.css                Tema de Tailwind, fuente y reglas base
│   ├── rutas/
│   │   ├── AppRoutes.jsx          Todas las rutas, con carga diferida
│   │   └── paginasPublicadas.js   Páginas que se copian para GitHub Pages
│   ├── mocks/                     API REST simulada
│   │   ├── datos.js               Categorías y libros
│   │   ├── handlers.js            Los recursos REST y sus respuestas
│   │   ├── simulacion.js          Modo del servidor (normal, lento, error...)
│   │   └── browser.js             Registro en el Service Worker
│   ├── api/                       libreria.js, cliente.js y cache.js
│   ├── hooks/                     useConsulta, useExterno y useTituloPagina
│   ├── paginas/                   Inicio, Categoria, DetalleLibro y NoEncontrada
│   ├── componentes/               Plantilla, Cabecera, EncabezadoPagina, TarjetaCategoria,
│   │                              TarjetaLibro, Cargando, MensajeError, BotonActualizar,
│   │                              PanelPruebas, Boton y Aviso
│   └── utilidades/                formato y estilos (clases de Tailwind compartidas)
├── pruebas/                       Pruebas con Vitest y matriz-de-casos.md
└── capturas/                      Evidencias de la entrega
```

## Pruebas

La [matriz de casos](pruebas/matriz-de-casos.md) recorre la API simulada, los errores, los estados de
una consulta, la carga, la optimización y la navegación, con el módulo responsable de cada resultado.
`npm test` corre 31 pruebas con Vitest:

| Archivo | Qué prueba |
|---|---|
| `api.test.js` | `pedirJSON` contra los mismos handlers de MSW, en Node: respuestas, 404, 500, sin conexión, sin respuesta, respuesta ilegible, cancelación y espera al mock |
| `cache.test.js` | Vigencia, petición compartida, cancelación, respaldo, avisos y modo estricto |
| `useConsulta.test.jsx` | El hook dentro de un componente de React: carga, error, reintento, actualizar, respaldo y caché vaciada |
| `rutas.test.jsx` | Qué ruta atiende cada dirección y que las páginas publicadas coincidan con los datos |

Al recorrer la matriz en el navegador aparecieron dos errores reales. Primero: con una categoría
abierta, «Vaciar caché» y luego «Actualizar» dejaban el nombre de la categoría cargando para
siempre. Segundo: el primer arreglo hacía que, si dos respuestas llegaban casi juntas, los libros
quedaran en «Cargando». Los dos venían de que el hook guardaba los datos por su cuenta además de la
caché. Se rehízo para que la caché sea la única fuente de los datos (un store externo al que el
componente se suscribe con `useSyncExternalStore`). La prueba C6 falla con las dos versiones
anteriores del hook.

## Cómo ejecutarlo

Requiere Node.js 20.19 o superior.

```bash
npm install
npm run dev        # abre http://localhost:5173/libreria-diego-carvajal-pfy2202/
```

Otros comandos:

```bash
npm run build      # deja la versión publicable en dist/ (con una página por ruta y 404.html)
npm run preview    # sirve dist/ en http://localhost:4173/libreria-diego-carvajal-pfy2202/
npm run lint       # revisa el código con oxlint
npm test           # corre las 31 pruebas de pruebas/ con Vitest
npm run deploy     # construye y publica dist/ en la rama gh-pages
```

## Verificación

- W3C Nu HTML Checker: 0 errores y 0 advertencias en el DOM publicado en 9 estados: categorías,
  libros de una categoría, categoría vacía, categoría y libro inexistentes, detalle, página no
  encontrada, error 500 y carga en modo lento.
- Lighthouse sobre el sitio publicado: 100 en accesibilidad, buenas prácticas y SEO en el inicio y en
  una categoría, en escritorio y teléfono.
- Primera carga sin saltos: desplazamiento acumulado de 0 en inicio y categoría, y bajo 0,001 en el
  detalle, en escritorio y teléfono.
- `npm test`: 31 pruebas de Vitest pasan; ver la matriz de casos. `oxlint` sin avisos y `npm audit`
  sin vulnerabilidades.
- GitHub Pages responde 200 en las 33 páginas publicadas (inicio, 8 categorías y 24 libros) y 404 con
  la aplicación en cualquier otra dirección. MSW funciona en Pages incluso entrando directo a una ruta
  profunda en la primera visita.
- Recorrido en el navegador de todos los modos del panel: carga, actualizar, error 500 con y sin datos
  anteriores, sin conexión, sin respuesta (8 s), 404 y categoría vacía; sin desborde a 375 px.

## Autor

Diego Carvajal — Desarrollo Frontend II (PFY2202), Duoc UC.
