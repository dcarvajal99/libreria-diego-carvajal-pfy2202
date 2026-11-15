// Libros de una categoría: la ruta dinámica /categorias/:id. Hace dos consultas:
//   - GET /api/categorias, para el nombre y la descripción. Si se llegó desde el inicio,
//     ya está en la caché y no se pide de nuevo.
//   - GET /api/categorias/:id/libros, para el listado. Responde 404 si la categoría no existe.
import { Link, useParams } from 'react-router';
import Boton from '../componentes/Boton.jsx';
import BotonActualizar from '../componentes/BotonActualizar.jsx';
import Cargando from '../componentes/Cargando.jsx';
import EncabezadoPagina from '../componentes/EncabezadoPagina.jsx';
import MensajeError from '../componentes/MensajeError.jsx';
import TarjetaLibro from '../componentes/TarjetaLibro.jsx';
import { API } from '../api/libreria.js';
import { useConsulta } from '../hooks/useConsulta.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { ENLACE_SIMPLE, LINEA_ESTADO } from '../utilidades/estilos.js';
import { contarLibros } from '../utilidades/formato.js';

function Categoria() {
    const { id } = useParams();
    const categorias = useConsulta(API.categorias());
    const libros = useConsulta(API.librosDeCategoria(id));

    const categoria = categorias.datos?.find((item) => item.id === id);
    const noExiste = libros.error?.tipo === 'no-encontrado';
    const nombre = categoria?.nombre ?? (noExiste ? 'Categoría no encontrada' : 'Categoría');
    useTituloPagina(nombre);

    // Alternativa cuando la categoría no existe: las que sí existen, si ya se conocen.
    const otras = noExiste && categorias.datos ? categorias.datos : [];

    return (
        <>
            <nav aria-label="Ruta de navegación">
                <ol className="mb-3 flex flex-wrap gap-x-2 text-sm text-suave">
                    <li><Link to="/" className={ENLACE_SIMPLE}>Categorías</Link></li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page">{nombre}</li>
                </ol>
            </nav>

            <EncabezadoPagina
                titulo={nombre}
                texto={categoria?.descripcion}
                reservarTexto={!noExiste}
                accion={(libros.datos || libros.cargando) && <BotonActualizar cargando={libros.cargando} onActualizar={libros.recargar} />}
            />

            {libros.error && (
                <MensajeError error={libros.error} respaldo={libros.respaldo} onReintentar={libros.recargar}>
                    <Boton ruta="/" variante={noExiste ? 'principal' : 'secundario'} tamano="chico">Ver todas las categorías</Boton>
                </MensajeError>
            )}
            {otras.length > 0 && (
                <div className="mb-4">
                    <p className="mb-2 text-sm text-suave">Estas son las categorías disponibles:</p>
                    <ul className="flex flex-wrap gap-2">
                        {otras.map((item) => (
                            <li key={item.id}><Boton ruta={'/categorias/' + item.id} tamano="chico">{item.nombre}</Boton></li>
                        ))}
                    </ul>
                </div>
            )}

            {(libros.datos?.length > 0 || (!libros.datos && libros.cargando)) && (
                <p className={LINEA_ESTADO} role="status">
                    {libros.datos ? contarLibros(libros.datos.length) : 'Cargando libros de ' + (categoria?.nombre ?? 'la categoría') + '…'}
                </p>
            )}
            {/* Si ya se sabe cuántos libros tiene la categoría, el esqueleto muestra esa cantidad de tarjetas */}
            {!libros.datos && libros.cargando && <Cargando variante="libro" cantidad={categoria?.cantidadLibros || undefined} />}

            {libros.datos?.length === 0 && (
                <div className="rounded-lg border border-dashed border-borde bg-blanco px-4 py-8 text-center text-suave">
                    <p className="mb-3">Todavía no tenemos libros de {nombre}.</p>
                    <Boton ruta="/" tamano="chico">Explorar otras categorías</Boton>
                </div>
            )}
            {libros.datos?.length > 0 && (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4" aria-label={'Libros de ' + nombre}>
                    {libros.datos.map((libro) => (
                        <li key={libro.id}>
                            <TarjetaLibro libro={libro} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default Categoria;
