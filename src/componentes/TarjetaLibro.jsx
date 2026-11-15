// Tarjeta de un libro en el listado de una categoría: lleva a su detalle, /libros/:id.
import { Link } from 'react-router';
import { formatearPesos } from '../utilidades/formato.js';

function TarjetaLibro({ libro }) {
    return (
        <Link
            to={'/libros/' + libro.id}
            className="flex h-full flex-col rounded-lg border border-borde bg-blanco p-5 text-tinta hover:border-suave"
        >
            <span className="font-semibold text-acento">{libro.titulo}</span>
            <span className="mt-1 grow text-sm text-suave">{libro.autor} · {libro.anio}</span>
            <span className="mt-3 font-semibold tabular-nums">{formatearPesos(libro.precio)}</span>
        </Link>
    );
}

export default TarjetaLibro;
