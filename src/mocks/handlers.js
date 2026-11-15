// Handlers de MSW: la API REST simulada de la librería. Interceptan las peticiones GET a
// /api/... y responden con JSON, como lo haría un backend real.
//
//   GET /api/categorias               → 200 [{ id, nombre, descripcion, cantidadLibros }]
//   GET /api/categorias/:id/libros    → 200 [{ id, titulo, autor, anio, precio }] · 404 si la categoría no existe
//   GET /api/libros/:id               → 200 { id, titulo, autor, ..., categoria } · 404 si el libro no existe
//
// Las rutas empiezan con * porque el sitio puede vivir en una subcarpeta (GitHub Pages).
import { delay, http, HttpResponse } from 'msw';
import { CATEGORIAS, LIBROS } from './datos.js';
import { obtenerRetardo, obtenerSimulacion } from './simulacion.js';

const API = '*/api';

export const handlers = [
    http.get(`${API}/categorias`, async () => {
        const falla = await simularCondicion();
        if (falla) return falla;
        return HttpResponse.json(CATEGORIAS.map((categoria) => ({
            ...categoria,
            cantidadLibros: LIBROS.filter((libro) => libro.categoriaId === categoria.id).length,
        })));
    }),

    http.get(`${API}/categorias/:id/libros`, async ({ params }) => {
        const falla = await simularCondicion();
        if (falla) return falla;
        const categoria = CATEGORIAS.find((item) => item.id === params.id);
        if (!categoria) return noEncontrado('No existe la categoría «' + params.id + '».');
        // El listado lleva solo los datos de la tarjeta; el detalle completo está en /api/libros/:id.
        return HttpResponse.json(LIBROS
            .filter((libro) => libro.categoriaId === categoria.id)
            .map(({ id, titulo, autor, anio, precio }) => ({ id, titulo, autor, anio, precio })));
    }),

    http.get(`${API}/libros/:id`, async ({ params }) => {
        const falla = await simularCondicion();
        if (falla) return falla;
        const libro = LIBROS.find((item) => item.id === params.id);
        if (!libro) return noEncontrado('No existe el libro «' + params.id + '».');
        const categoria = CATEGORIAS.find((item) => item.id === libro.categoriaId);
        return HttpResponse.json({ ...libro, categoria: { id: categoria.id, nombre: categoria.nombre } });
    }),
];

function noEncontrado(mensaje) {
    return HttpResponse.json({ mensaje }, { status: 404 });
}

// Espera el tiempo de respuesta y aplica la condición elegida en el panel de pruebas.
// Devuelve la respuesta de falla, o null si la petición debe responderse normalmente.
async function simularCondicion() {
    const modo = obtenerSimulacion();
    if (modo === 'sin-respuesta') await delay('infinite');
    await delay(obtenerRetardo());
    if (modo === 'error') return HttpResponse.json({ mensaje: 'Error interno del servidor.' }, { status: 500 });
    if (modo === 'sin-conexion') return HttpResponse.error();
    return null;
}
