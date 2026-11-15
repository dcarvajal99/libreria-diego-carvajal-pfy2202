// Casos O: optimización de las consultas (src/api/cache.js). Ver pruebas/matriz-de-casos.md.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    VIGENCIA, leerUltimo, leerVigente, pedirCompartido, peticionesEnCurso, suscribir, vaciar, vencer,
} from '../src/api/cache.js';

// Una carga controlable desde la prueba: resolver(datos) entrega la respuesta.
function cargaManual() {
    const control = {};
    control.cargar = vi.fn((signal) => {
        control.signal = signal;
        return new Promise((resolver, rechazar) => {
            control.resolver = resolver;
            signal.addEventListener('abort', () => rechazar(new DOMException('Cancelada', 'AbortError')));
        });
    });
    return control;
}

// Cada prueba pide por medio de pedir(): al terminar se sueltan todas sus peticiones, para que
// una petición pendiente no se cuele en la prueba siguiente.
let pendientes = [];
function pedir(clave, cargar) {
    const pedido = pedirCompartido(clave, cargar);
    pedido.promesa.catch(() => {}); // Las canceladas a propósito no cuentan como error sin atender
    pendientes.push(pedido.soltar);
    return pedido;
}

// La cancelación espera un instante (setTimeout 0) por si la misma clave se vuelve a pedir.
const instante = () => new Promise((resolver) => setTimeout(resolver, 0));

beforeEach(() => vaciar());
afterEach(async () => {
    pendientes.forEach((soltar) => soltar());
    pendientes = [];
    await instante();
});

describe('Caché de consultas', () => {
    it('O1 una respuesta se usa sin volver a pedirla mientras está vigente', async () => {
        const carga = cargaManual();
        const { promesa } = pedir('categorias', carga.cargar);
        carga.resolver(['ficcion']);
        await promesa;
        const ahora = Date.now();
        expect(leerVigente('categorias', VIGENCIA, ahora)).toEqual(['ficcion']);
        expect(leerVigente('categorias', VIGENCIA, ahora + VIGENCIA + 1)).toBeUndefined();
    });

    it('O2 dos componentes que piden lo mismo a la vez comparten una sola petición', async () => {
        const carga = cargaManual();
        const primero = pedir('libros/dune', carga.cargar);
        const segundo = pedir('libros/dune', carga.cargar);
        expect(carga.cargar).toHaveBeenCalledTimes(1);
        carga.resolver({ titulo: 'Dune' });
        expect(await primero.promesa).toEqual(await segundo.promesa);
    });

    it('O3 si todos dejan de necesitar la respuesta, la petición se cancela', async () => {
        const carga = cargaManual();
        const { promesa, soltar } = pedir('categorias', carga.cargar);
        soltar();
        await instante();
        expect(carga.signal.aborted).toBe(true);
        await expect(promesa).rejects.toMatchObject({ name: 'AbortError' });
        // Una consulta nueva después de cancelar hace una petición nueva.
        const otra = cargaManual();
        pedir('categorias', otra.cargar);
        expect(otra.cargar).toHaveBeenCalledTimes(1);
    });

    it('O4 si queda un interesado, la petición sigue', async () => {
        const carga = cargaManual();
        const primero = pedir('categorias', carga.cargar);
        pedir('categorias', carga.cargar);
        primero.soltar();
        await instante();
        expect(carga.signal.aborted).toBe(false);
    });

    it('O5 vencer obliga a consultar de nuevo, pero conserva el respaldo', async () => {
        const carga = cargaManual();
        const { promesa } = pedir('categorias', carga.cargar);
        carga.resolver(['ficcion']);
        await promesa;
        vencer('categorias');
        expect(leerVigente('categorias')).toBeUndefined();
        expect(leerUltimo('categorias')).toEqual(['ficcion']);
    });

    it('O6 el contador de peticiones en curso avisa al empezar y al terminar', async () => {
        const avisos = vi.fn();
        const dejar = suscribir(avisos);
        const carga = cargaManual();
        const { promesa } = pedir('categorias', carga.cargar);
        expect(peticionesEnCurso()).toBe(1);
        carga.resolver([]);
        await promesa;
        expect(peticionesEnCurso()).toBe(0);
        expect(avisos).toHaveBeenCalledTimes(2);
        dejar();
    });

    it('O7 soltar y volver a pedir enseguida reutiliza la petición (modo estricto de React)', async () => {
        const carga = cargaManual();
        pedir('categorias', carga.cargar).soltar(); // React monta y desmonta...
        pedir('categorias', carga.cargar); // ...y vuelve a montar en el mismo instante
        await instante();
        expect(carga.cargar).toHaveBeenCalledTimes(1);
        expect(carga.signal.aborted).toBe(false);
    });
});
