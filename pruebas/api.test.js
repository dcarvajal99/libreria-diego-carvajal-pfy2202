// Casos A (API REST simulada) y E (errores): el cliente pedirJSON contra los mismos handlers
// de MSW que usa el navegador, levantados en Node con setupServer. Ver pruebas/matriz-de-casos.md.
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { ErrorApi, esperarServidor, pedirJSON } from '../src/api/cliente.js';
import { handlers } from '../src/mocks/handlers.js';
import { cambiarRetardoBase, cambiarSimulacion } from '../src/mocks/simulacion.js';

const servidor = setupServer(...handlers);

beforeAll(() => {
    cambiarRetardoBase(0); // Las pruebas no esperan los 400 ms de una respuesta normal
    servidor.listen({ onUnhandledRequest: 'error' });
});
afterEach(() => {
    cambiarSimulacion('normal');
    esperarServidor(Promise.resolve());
    servidor.resetHandlers();
});
afterAll(() => servidor.close());

// Ejecuta la petición y devuelve el error que lanza (o falla si no lanza ninguno).
async function errorDe(promesa) {
    try {
        await promesa;
    } catch (error) {
        return error;
    }
    throw new Error('La petición no falló');
}

describe('API REST simulada', () => {
    it('A1 GET /api/categorias devuelve las 8 categorías con su cantidad de libros', async () => {
        const categorias = await pedirJSON('categorias');
        expect(categorias).toHaveLength(8);
        expect(categorias.find((categoria) => categoria.id === 'ficcion').cantidadLibros).toBe(4);
        expect(categorias.find((categoria) => categoria.id === 'drama').cantidadLibros).toBe(0);
    });

    it('A2 GET /api/categorias/:id/libros devuelve solo los datos de la tarjeta', async () => {
        const libros = await pedirJSON('categorias/ficcion/libros');
        expect(libros).toHaveLength(4);
        expect(Object.keys(libros[0]).sort()).toEqual(['anio', 'autor', 'id', 'precio', 'titulo']);
    });

    it('A3 una categoría sin libros devuelve una lista vacía, no un error', async () => {
        expect(await pedirJSON('categorias/drama/libros')).toEqual([]);
    });

    it('A4 GET /api/libros/:id devuelve el detalle con su categoría', async () => {
        const libro = await pedirJSON('libros/dune');
        expect(libro).toMatchObject({ titulo: 'Dune', autor: 'Frank Herbert', categoria: { id: 'ciencia-ficcion', nombre: 'Ciencia ficción' } });
    });

    it('A5 las consultas esperan a que el servidor simulado esté listo', async () => {
        let marcarListo;
        esperarServidor(new Promise((resolver) => (marcarListo = resolver)));
        let respondio = false;
        const consulta = pedirJSON('categorias').then((datos) => {
            respondio = true;
            return datos;
        });
        await new Promise((resolver) => setTimeout(resolver, 20));
        expect(respondio).toBe(false);
        marcarListo();
        expect(await consulta).toHaveLength(8);
    });

    it('A6 si el servidor simulado no arranca, la consulta falla como error de red', async () => {
        const fallido = Promise.reject(new Error('Sin Service Worker'));
        fallido.catch(() => {});
        esperarServidor(fallido);
        expect(await errorDe(pedirJSON('categorias'))).toMatchObject({ tipo: 'red' });
    });
});

describe('Errores de las peticiones', () => {
    it('E1 una categoría inexistente responde 404 con un mensaje', async () => {
        const error = await errorDe(pedirJSON('categorias/terror/libros'));
        expect(error).toBeInstanceOf(ErrorApi);
        expect(error).toMatchObject({ tipo: 'no-encontrado', estado: 404 });
        expect(error.message).toMatch(/terror/);
    });

    it('E2 un libro inexistente responde 404', async () => {
        expect(await errorDe(pedirJSON('libros/no-existe'))).toMatchObject({ tipo: 'no-encontrado', estado: 404 });
    });

    it('E3 con el servidor en error, la petición termina en un error 500', async () => {
        cambiarSimulacion('error');
        expect(await errorDe(pedirJSON('categorias'))).toMatchObject({ tipo: 'servidor', estado: 500 });
    });

    it('E4 sin conexión, el error es de red', async () => {
        cambiarSimulacion('sin-conexion');
        expect(await errorDe(pedirJSON('categorias'))).toMatchObject({ tipo: 'red' });
    });

    it('E5 si el servidor no responde, el cliente se rinde al tiempo máximo', async () => {
        cambiarSimulacion('sin-respuesta');
        const error = await errorDe(pedirJSON('categorias', { tiempoMaximo: 50 }));
        expect(error).toMatchObject({ tipo: 'tiempo' });
    });

    it('E6 una respuesta que no es JSON es un error de respuesta', async () => {
        servidor.use(http.get('*/api/categorias', () => new HttpResponse('<html>caído</html>', { headers: { 'Content-Type': 'text/html' } })));
        expect(await errorDe(pedirJSON('categorias'))).toMatchObject({ tipo: 'respuesta' });
    });

    it('E7 cancelar desde afuera no se confunde con un error del servidor', async () => {
        cambiarSimulacion('lento');
        const controlador = new AbortController();
        const promesa = pedirJSON('categorias', { signal: controlador.signal });
        controlador.abort();
        const error = await errorDe(promesa);
        expect(error).not.toBeInstanceOf(ErrorApi);
        expect(error.name).toBe('AbortError');
    });
});
