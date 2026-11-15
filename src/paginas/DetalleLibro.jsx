// Detalle de un libro: la ruta dinámica /libros/:id, con GET /api/libros/:id.
// El listado de la categoría solo trae los datos de la tarjeta; el detalle completo se pide
// recién cuando la persona abre el libro.
import { Link, useParams } from 'react-router';
import Boton from '../componentes/Boton.jsx';
import BotonActualizar from '../componentes/BotonActualizar.jsx';
import Cargando from '../componentes/Cargando.jsx';
import EncabezadoPagina from '../componentes/EncabezadoPagina.jsx';
import MensajeError from '../componentes/MensajeError.jsx';
import { API } from '../api/libreria.js';
import { useConsulta } from '../hooks/useConsulta.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { ENLACE_SIMPLE, PANEL } from '../utilidades/estilos.js';
import { formatearPesos } from '../utilidades/formato.js';

function DetalleLibro() {
    const { id } = useParams();
    const { datos: libro, cargando, error, respaldo, recargar } = useConsulta(API.libro(id));
    const noExiste = error?.tipo === 'no-encontrado';
    const titulo = libro?.titulo ?? (noExiste ? 'Libro no encontrado' : 'Libro');
    useTituloPagina(titulo);

    return (
        <>
            <nav aria-label="Ruta de navegación">
                <ol className="mb-3 flex flex-wrap gap-x-2 text-sm text-suave">
                    <li><Link to="/" className={ENLACE_SIMPLE}>Categorías</Link></li>
                    {libro && (
                        <>
                            <li aria-hidden="true">/</li>
                            <li><Link to={'/categorias/' + libro.categoria.id} className={ENLACE_SIMPLE}>{libro.categoria.nombre}</Link></li>
                        </>
                    )}
                    <li aria-hidden="true">/</li>
                    <li aria-current="page">{titulo}</li>
                </ol>
            </nav>

            {/* El encabezado está siempre, también mientras carga o si el libro no existe */}
            <EncabezadoPagina
                titulo={titulo}
                texto={libro && libro.autor + ' · ' + libro.anio}
                reservarTexto={!error}
                accion={(libro || cargando) && <BotonActualizar cargando={cargando} onActualizar={recargar} />}
            />

            {error && (
                <MensajeError error={error} respaldo={respaldo} onReintentar={recargar}>
                    <Boton ruta="/" variante={noExiste ? 'principal' : 'secundario'} tamano="chico">Ver las categorías</Boton>
                </MensajeError>
            )}

            <p className="sr-only" role="status">{!libro && cargando ? 'Cargando el libro…' : ''}</p>
            {!libro && cargando && <Cargando variante="ficha" />}

            {libro && (
                <div className={PANEL + ' max-w-3xl'}>
                    <p className="mb-4">{libro.sinopsis}</p>
                    <dl className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-4">
                        {[
                            ['Autor', libro.autor],
                            ['Año', libro.anio],
                            ['Páginas', libro.paginas],
                            ['Categoría', libro.categoria.nombre],
                            ['Precio', formatearPesos(libro.precio)],
                        ].map(([etiqueta, valor]) => (
                            <div key={etiqueta}>
                                <dt className="text-[0.8125rem] font-medium text-suave">{etiqueta}</dt>
                                <dd className="tabular-nums">{valor}</dd>
                            </div>
                        ))}
                    </dl>
                    <Boton ruta={'/categorias/' + libro.categoria.id} tamano="chico">
                        Ver más libros de {libro.categoria.nombre}
                    </Boton>
                </div>
            )}
        </>
    );
}

export default DetalleLibro;
