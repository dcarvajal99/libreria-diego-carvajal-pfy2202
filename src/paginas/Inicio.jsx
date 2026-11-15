// Home: las categorías de libros, pedidas a la API REST (GET /api/categorias).
// Muestra un esqueleto mientras carga, un mensaje con salida si falla y, si ya había datos,
// los mantiene a la vista junto al aviso del error.
import BotonActualizar from '../componentes/BotonActualizar.jsx';
import Cargando from '../componentes/Cargando.jsx';
import EncabezadoPagina from '../componentes/EncabezadoPagina.jsx';
import MensajeError from '../componentes/MensajeError.jsx';
import TarjetaCategoria from '../componentes/TarjetaCategoria.jsx';
import { API } from '../api/libreria.js';
import { useConsulta } from '../hooks/useConsulta.js';
import { useTituloPagina } from '../hooks/useTituloPagina.js';
import { LINEA_ESTADO } from '../utilidades/estilos.js';
import { contarCategorias } from '../utilidades/formato.js';

function Inicio() {
    useTituloPagina('Categorías');
    const { datos: categorias, cargando, error, respaldo, recargar } = useConsulta(API.categorias());

    return (
        <>
            <EncabezadoPagina
                titulo="Explora nuestras categorías"
                texto="Elige una categoría para ver sus libros."
                accion={(categorias || cargando) && <BotonActualizar cargando={cargando} onActualizar={recargar} />}
            />

            {error && <MensajeError error={error} respaldo={respaldo} onReintentar={recargar} />}

            {/* Renderizado condicional según el estado de la petición */}
            {(categorias || cargando) && (
                <p className={LINEA_ESTADO} role="status">{categorias ? contarCategorias(categorias.length) : 'Cargando categorías…'}</p>
            )}
            {!categorias && cargando && <Cargando variante="categoria" cantidad={8} />}
            {categorias && (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4" aria-label="Categorías de libros">
                    {categorias.map((categoria) => (
                        <li key={categoria.id}>
                            <TarjetaCategoria categoria={categoria} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

export default Inicio;
