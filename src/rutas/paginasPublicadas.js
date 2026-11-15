// Páginas que GitHub Pages debe servir con estado 200 al abrirlas directo o recargarlas.
// vite.config.js copia index.html con cada uno de estos nombres. Es una lista propia de la
// construcción: no importa los datos del servidor simulado. Las pruebas de
// pruebas/rutas.test.jsx avisan si deja de coincidir con las categorías y libros del mock.

export const CATEGORIAS_PUBLICADAS = [
    'ficcion', 'ciencia-ficcion', 'fantasia', 'misterio', 'historia', 'poesia', 'infantil', 'drama',
];

export const LIBROS_PUBLICADOS = [
    'cien-anos-de-soledad', 'la-casa-de-los-espiritus', 'pedro-paramo', 'rayuela',
    'fundacion', 'dune', 'fahrenheit-451', 'la-mano-izquierda-de-la-oscuridad',
    'el-hobbit', 'un-mago-de-terramar', 'la-historia-interminable',
    'asesinato-en-el-orient-express', 'el-perro-de-los-baskerville', 'la-sombra-del-viento', 'el-nombre-de-la-rosa',
    'sapiens', 'las-venas-abiertas-de-america-latina', 'el-diario-de-ana-frank',
    'veinte-poemas-de-amor', 'desolacion', 'poemas-y-antipoemas',
    'el-principito', 'papelucho', 'matilda',
];

export const PAGINAS_PUBLICADAS = [
    ...CATEGORIAS_PUBLICADAS.map((id) => 'categorias/' + id),
    ...LIBROS_PUBLICADOS.map((id) => 'libros/' + id),
];
