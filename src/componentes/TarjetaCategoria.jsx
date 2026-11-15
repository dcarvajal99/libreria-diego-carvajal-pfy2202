// Tarjeta de una categoría: lleva a su ruta dinámica /categorias/:id.
import { Link } from 'react-router';
import { contarLibros } from '../utilidades/formato.js';

function TarjetaCategoria({ categoria }) {
    return (
        <Link
            to={'/categorias/' + categoria.id}
            className="flex h-full flex-col rounded-lg border border-borde bg-blanco p-5 text-tinta hover:border-suave"
        >
            <span className="font-semibold text-acento">{categoria.nombre}</span>
            <span className="mt-1 grow text-sm text-suave">{categoria.descripcion}</span>
            <span className="mt-3 text-sm font-medium">
                {categoria.cantidadLibros === 0 ? 'Sin libros por ahora' : contarLibros(categoria.cantidadLibros)}
            </span>
        </Link>
    );
}

export default TarjetaCategoria;
