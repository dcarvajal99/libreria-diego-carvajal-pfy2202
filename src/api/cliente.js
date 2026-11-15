// Cliente HTTP de la aplicación: la única función que llama a fetch. Arma la URL de la API,
// corta la petición si tarda demasiado y convierte cada falla en un ErrorApi con un tipo,
// para que la interfaz pueda explicar qué pasó y ofrecer la salida adecuada.

export const TIEMPO_MAXIMO = 8000;

// Tipos de error que distingue la interfaz.
export class ErrorApi extends Error {
    constructor(tipo, mensaje, estado = null) {
        super(mensaje);
        this.name = 'ErrorApi';
        this.tipo = tipo; // 'red' | 'tiempo' | 'no-encontrado' | 'servidor' | 'respuesta'
        this.estado = estado; // Código HTTP, si hubo respuesta
    }
}

// Las consultas esperan a que el servidor simulado esté listo (main.jsx lo inicia en paralelo,
// así la página se dibuja sin esperarlo). Con un backend real no se llama y no hay espera.
let servidorListo = Promise.resolve();
export function esperarServidor(promesa) {
    servidorListo = promesa;
}

// La API vive junto al sitio: /libreria-diego-carvajal-pfy2202/api/... en GitHub Pages.
export function urlApi(ruta) {
    const base = globalThis.location?.href ?? 'http://localhost/';
    return new URL(import.meta.env.BASE_URL + 'api/' + ruta, base).href;
}

// Pide un recurso y devuelve el JSON. `signal` permite cancelarla desde afuera (por ejemplo,
// si nadie la necesita ya); esa cancelación se propaga tal cual (AbortError).
export async function pedirJSON(ruta, { signal, tiempoMaximo = TIEMPO_MAXIMO } = {}) {
    try {
        await servidorListo;
    } catch {
        throw new ErrorApi('red', 'No se pudo iniciar el servidor simulado.');
    }

    const limite = AbortSignal.timeout(tiempoMaximo);
    const senal = signal ? AbortSignal.any([signal, limite]) : limite;

    let respuesta;
    try {
        respuesta = await fetch(urlApi(ruta), { signal: senal, headers: { Accept: 'application/json' } });
    } catch (error) {
        if (signal?.aborted) throw error;
        if (limite.aborted) throw new ErrorApi('tiempo', 'El servidor no respondió en ' + tiempoMaximo / 1000 + ' segundos.');
        throw new ErrorApi('red', 'No se pudo conectar con el servidor.');
    }

    if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => ({}));
        if (respuesta.status === 404) throw new ErrorApi('no-encontrado', cuerpo.mensaje ?? 'El recurso no existe.', 404);
        if (respuesta.status >= 500) throw new ErrorApi('servidor', 'El servidor respondió con un error (' + respuesta.status + ').', respuesta.status);
        throw new ErrorApi('respuesta', 'El servidor rechazó la petición (' + respuesta.status + ').', respuesta.status);
    }

    try {
        return await respuesta.json();
    } catch {
        throw new ErrorApi('respuesta', 'El servidor envió datos que no se pueden leer.', respuesta.status);
    }
}
