// Cabecera del sitio: el logotipo lleva al inicio y, mientras haya peticiones al servidor
// en curso, una barra fina bajo la cabecera y un aviso para el lector de pantalla indican
// que se están consultando datos.
import { Link, NavLink } from 'react-router';
import { usePeticionesEnCurso } from '../hooks/useExterno.js';
import { CONTENEDOR } from '../utilidades/estilos.js';

function Cabecera() {
    const enCurso = usePeticionesEnCurso();

    return (
        <header className="relative border-b border-borde bg-blanco">
            <div className={CONTENEDOR + ' flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3'}>
                <Link to="/" className="inline-flex items-center gap-2.5 text-lg font-semibold text-tinta">
                    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
                        <rect className="fill-acento" width="32" height="32" rx="8" />
                        <g className="fill-none stroke-blanco" strokeWidth="1.8" strokeLinejoin="round">
                            <path d="M16 10.5c-2.2-1.6-5-2-7.5-1.6v12.6c2.5-.4 5.3 0 7.5 1.6 2.2-1.6 5-2 7.5-1.6V8.9c-2.5-.4-5.3 0-7.5 1.6Z" />
                            <path d="M16 10.5v12.6" />
                        </g>
                    </svg>
                    <span>Librería Página Austral</span>
                </Link>
                <nav aria-label="Menú principal">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => 'block rounded-md px-3 py-2 text-sm font-medium ' + (isActive ? 'bg-lienzo font-semibold text-acento' : 'text-suave hover:text-tinta')}
                    >
                        Categorías
                    </NavLink>
                </nav>
            </div>
            {/* Indicador de actividad: aparece mientras haya al menos una petición en curso */}
            {enCurso > 0 && <div className="absolute inset-x-0 -bottom-px h-0.5 animate-pulse bg-acento" aria-hidden="true" />}
            <p className="sr-only" role="status">{enCurso > 0 ? 'Consultando el servidor…' : ''}</p>
        </header>
    );
}

export default Cabecera;
