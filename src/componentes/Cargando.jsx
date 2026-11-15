// Indicador de carga con la forma del contenido que viene (esqueleto). Cada variante repite
// las líneas de la tarjeta real con su misma altura (título, texto, dato final), así la página
// no se mueve cuando llegan los datos. Es solo visual (aria-hidden): el aviso para el lector
// de pantalla lo da la línea de estado de cada página.
import { PANEL } from '../utilidades/estilos.js';

// Líneas de cada tarjeta: [alto de la línea (y su margen), ancho de la barra gris]
const LINEAS = {
    categoria: [['h-6', 'w-1/2'], ['mt-1 h-5', 'w-full'], ['h-5', 'w-3/4'], ['mt-3 h-5', 'w-1/4']],
    libro: [['h-6', 'w-3/4'], ['mt-1 h-5', 'w-1/2'], ['mt-3 h-6', 'w-1/3']],
};

// Una línea de texto simulada: ocupa el alto de la línea real y dibuja una barra al medio.
function Linea({ alto, ancho, fuerte = false }) {
    return (
        <div className={'flex items-center ' + alto}>
            <div className={'h-3 rounded ' + ancho + (fuerte ? ' bg-borde' : ' bg-lienzo')} />
        </div>
    );
}

// Ficha de un libro: sinopsis, cinco datos y el botón final, como en DetalleLibro.
function FichaCargando() {
    return (
        <div className={PANEL + ' max-w-3xl animate-pulse'} aria-hidden="true">
            {/* La sinopsis ocupa unas tres líneas en el teléfono y dos en pantallas anchas */}
            <div className="mb-4">
                <Linea alto="h-6" ancho="w-full" />
                <Linea alto="h-6 sm:hidden" ancho="w-full" />
                <Linea alto="h-6" ancho="w-2/3" />
            </div>
            <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-4">
                {Array.from({ length: 5 }, (_, indice) => (
                    <div key={indice}>
                        <Linea alto="h-[1.21875rem]" ancho="w-1/2" />
                        <Linea alto="h-6" ancho="w-3/4" fuerte />
                    </div>
                ))}
            </div>
            <div className="h-[30px] w-56 rounded-md bg-lienzo" />
        </div>
    );
}

function Cargando({ variante = 'libro', cantidad = 6 }) {
    if (variante === 'ficha') return <FichaCargando />;
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4" aria-hidden="true">
            {Array.from({ length: cantidad }, (_, indice) => (
                <div key={indice} className="animate-pulse rounded-lg border border-borde bg-blanco p-5">
                    {LINEAS[variante].map(([alto, ancho], numero) => (
                        <Linea key={numero} alto={alto} ancho={ancho} fuerte={numero === 0} />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Cargando;
