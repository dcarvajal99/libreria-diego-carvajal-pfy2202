// Funciones reutilizables de formato.

const FORMATO_NUMERO = new Intl.NumberFormat('es-CL');

// Convierte 19990 en "$19.990".
export function formatearPesos(valor) {
    return '$' + FORMATO_NUMERO.format(valor);
}

// "1 libro", "4 libros".
export function contarLibros(cantidad) {
    return cantidad + (cantidad === 1 ? ' libro' : ' libros');
}

// "1 categoría", "8 categorías".
export function contarCategorias(cantidad) {
    return cantidad + (cantidad === 1 ? ' categoría' : ' categorías');
}
