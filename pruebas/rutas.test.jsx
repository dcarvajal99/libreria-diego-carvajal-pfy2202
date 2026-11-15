// Casos N: navegación. Comprueba qué ruta atiende cada dirección usando el mismo árbol de
// rutas de la aplicación (sin dibujar páginas), y que las páginas publicadas coincidan con
// las categorías y libros del servidor simulado. Ver pruebas/matriz-de-casos.md.
import { createRoutesFromElements, matchRoutes } from 'react-router';
import { describe, expect, it } from 'vitest';
import AppRoutes from '../src/rutas/AppRoutes.jsx';
import { CATEGORIAS_PUBLICADAS, LIBROS_PUBLICADOS } from '../src/rutas/paginasPublicadas.js';
import { CATEGORIAS, LIBROS } from '../src/mocks/datos.js';

// AppRoutes devuelve <Routes> con el árbol como hijo; no usa hooks, así que se puede llamar directo.
const RUTAS = createRoutesFromElements(AppRoutes().props.children);

function resolver(direccion) {
    const ultima = matchRoutes(RUTAS, direccion).at(-1);
    return { ruta: ultima.route.index ? '(índice)' : ultima.route.path, parametros: ultima.params };
}

describe('Navegación', () => {
    it('N1 el inicio muestra las categorías', () => {
        expect(resolver('/').ruta).toBe('(índice)');
    });

    it('N2 las rutas dinámicas entregan el id de la categoría y del libro', () => {
        expect(resolver('/categorias/ficcion')).toEqual({ ruta: 'categorias/:id', parametros: { id: 'ficcion' } });
        expect(resolver('/libros/dune')).toEqual({ ruta: 'libros/:id', parametros: { id: 'dune' } });
    });

    it('N3 las direcciones que no existen caen en la página no encontrada', () => {
        expect(resolver('/ofertas').ruta).toBe('*');
        expect(resolver('/categorias').ruta).toBe('*');
        expect(resolver('/libros/dune/extra').ruta).toBe('*');
    });

    it('N4 se publica una página por cada categoría y cada libro del servidor simulado', () => {
        expect([...CATEGORIAS_PUBLICADAS].sort()).toEqual(CATEGORIAS.map((categoria) => categoria.id).sort());
        expect([...LIBROS_PUBLICADOS].sort()).toEqual(LIBROS.map((libro) => libro.id).sort());
    });
});
