// Datos del servidor simulado: solo los conocen los handlers de MSW (mocks/handlers.js).
// La aplicación nunca importa este archivo: recibe los datos por la API REST, como lo haría
// con un backend real. Los títulos y autores son reales; precios y páginas son de ejemplo.

// «drama» no tiene libros a propósito: muestra cómo se ve una categoría vacía.
export const CATEGORIAS = [
    { id: 'ficcion', nombre: 'Ficción', descripcion: 'Novelas latinoamericanas y clásicos contemporáneos.' },
    { id: 'ciencia-ficcion', nombre: 'Ciencia ficción', descripcion: 'Futuros posibles, otros planetas y preguntas sobre la tecnología.' },
    { id: 'fantasia', nombre: 'Fantasía', descripcion: 'Mundos imaginarios, magia y viajes de aventura.' },
    { id: 'misterio', nombre: 'Misterio y policial', descripcion: 'Detectives, crímenes y secretos bien guardados.' },
    { id: 'historia', nombre: 'Historia', descripcion: 'Ensayos y testimonios para entender el pasado.' },
    { id: 'poesia', nombre: 'Poesía', descripcion: 'Poetas chilenos que cambiaron la forma de escribir.' },
    { id: 'infantil', nombre: 'Infantil y juvenil', descripcion: 'Lecturas para empezar a leer y para seguir leyendo.' },
    { id: 'drama', nombre: 'Drama y teatro', descripcion: 'Obras para leer y llevar al escenario.' },
];

export const LIBROS = [
    { id: 'cien-anos-de-soledad', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anio: 1967, paginas: 496, precio: 19990, categoriaId: 'ficcion', sinopsis: 'La historia de la familia Buendía a lo largo de siete generaciones en el pueblo de Macondo.' },
    { id: 'la-casa-de-los-espiritus', titulo: 'La casa de los espíritus', autor: 'Isabel Allende', anio: 1982, paginas: 448, precio: 17990, categoriaId: 'ficcion', sinopsis: 'Cuatro generaciones de la familia Trueba atraviesan la historia de un país muy parecido a Chile.' },
    { id: 'pedro-paramo', titulo: 'Pedro Páramo', autor: 'Juan Rulfo', anio: 1955, paginas: 128, precio: 11990, categoriaId: 'ficcion', sinopsis: 'Juan Preciado llega a Comala buscando a su padre y encuentra un pueblo habitado por voces.' },
    { id: 'rayuela', titulo: 'Rayuela', autor: 'Julio Cortázar', anio: 1963, paginas: 600, precio: 18990, categoriaId: 'ficcion', sinopsis: 'Una novela que se puede leer en más de un orden, entre París y Buenos Aires.' },
    { id: 'fundacion', titulo: 'Fundación', autor: 'Isaac Asimov', anio: 1951, paginas: 256, precio: 15990, categoriaId: 'ciencia-ficcion', sinopsis: 'Un matemático predice la caída del Imperio Galáctico y planea acortar la época oscura que vendrá después.' },
    { id: 'dune', titulo: 'Dune', autor: 'Frank Herbert', anio: 1965, paginas: 704, precio: 22990, categoriaId: 'ciencia-ficcion', sinopsis: 'En el planeta desértico Arrakis, la lucha por una especia muy valiosa decide el destino de un imperio.' },
    { id: 'fahrenheit-451', titulo: 'Fahrenheit 451', autor: 'Ray Bradbury', anio: 1953, paginas: 192, precio: 12990, categoriaId: 'ciencia-ficcion', sinopsis: 'Un bombero cuyo trabajo es quemar libros empieza a preguntarse qué contienen.' },
    { id: 'la-mano-izquierda-de-la-oscuridad', titulo: 'La mano izquierda de la oscuridad', autor: 'Ursula K. Le Guin', anio: 1969, paginas: 320, precio: 16990, categoriaId: 'ciencia-ficcion', sinopsis: 'Un enviado llega a un planeta helado cuyos habitantes no tienen un sexo fijo.' },
    { id: 'el-hobbit', titulo: 'El hobbit', autor: 'J. R. R. Tolkien', anio: 1937, paginas: 320, precio: 16990, categoriaId: 'fantasia', sinopsis: 'Bilbo Bolsón deja la comodidad de su casa para acompañar a trece enanos en busca de un tesoro.' },
    { id: 'un-mago-de-terramar', titulo: 'Un mago de Terramar', autor: 'Ursula K. Le Guin', anio: 1968, paginas: 224, precio: 13990, categoriaId: 'fantasia', sinopsis: 'Un joven con talento para la magia libera una sombra a la que tendrá que enfrentar.' },
    { id: 'la-historia-interminable', titulo: 'La historia interminable', autor: 'Michael Ende', anio: 1979, paginas: 496, precio: 18990, categoriaId: 'fantasia', sinopsis: 'Bastián lee un libro que lo lleva a Fantasía, un reino que está desapareciendo.' },
    { id: 'asesinato-en-el-orient-express', titulo: 'Asesinato en el Orient Express', autor: 'Agatha Christie', anio: 1934, paginas: 256, precio: 12990, categoriaId: 'misterio', sinopsis: 'Un tren detenido por la nieve, un pasajero asesinado y Hércules Poirot a bordo.' },
    { id: 'el-perro-de-los-baskerville', titulo: 'El perro de los Baskerville', autor: 'Arthur Conan Doyle', anio: 1902, paginas: 224, precio: 9990, categoriaId: 'misterio', sinopsis: 'Sherlock Holmes investiga la leyenda de un sabueso que persigue a una familia.' },
    { id: 'la-sombra-del-viento', titulo: 'La sombra del viento', autor: 'Carlos Ruiz Zafón', anio: 2001, paginas: 576, precio: 19990, categoriaId: 'misterio', sinopsis: 'En la Barcelona de posguerra, un joven busca al autor de un libro que alguien quiere hacer desaparecer.' },
    { id: 'el-nombre-de-la-rosa', titulo: 'El nombre de la rosa', autor: 'Umberto Eco', anio: 1980, paginas: 672, precio: 21990, categoriaId: 'misterio', sinopsis: 'Un fraile investiga una serie de muertes en una abadía medieval con una biblioteca prohibida.' },
    { id: 'sapiens', titulo: 'Sapiens. De animales a dioses', autor: 'Yuval Noah Harari', anio: 2011, paginas: 496, precio: 21990, categoriaId: 'historia', sinopsis: 'Un recorrido por la historia de la humanidad, desde los primeros cazadores hasta hoy.' },
    { id: 'las-venas-abiertas-de-america-latina', titulo: 'Las venas abiertas de América Latina', autor: 'Eduardo Galeano', anio: 1971, paginas: 400, precio: 15990, categoriaId: 'historia', sinopsis: 'Un ensayo sobre cinco siglos de explotación de los recursos de América Latina.' },
    { id: 'el-diario-de-ana-frank', titulo: 'El diario de Ana Frank', autor: 'Ana Frank', anio: 1947, paginas: 352, precio: 11990, categoriaId: 'historia', sinopsis: 'El diario de una adolescente judía que vivió escondida en Ámsterdam durante la ocupación nazi.' },
    { id: 'veinte-poemas-de-amor', titulo: 'Veinte poemas de amor y una canción desesperada', autor: 'Pablo Neruda', anio: 1924, paginas: 96, precio: 9990, categoriaId: 'poesia', sinopsis: 'El libro de poemas más leído de Neruda, escrito antes de cumplir veinte años.' },
    { id: 'desolacion', titulo: 'Desolación', autor: 'Gabriela Mistral', anio: 1922, paginas: 240, precio: 10990, categoriaId: 'poesia', sinopsis: 'El primer libro de Gabriela Mistral, publicado en Nueva York.' },
    { id: 'poemas-y-antipoemas', titulo: 'Poemas y antipoemas', autor: 'Nicanor Parra', anio: 1954, paginas: 160, precio: 10990, categoriaId: 'poesia', sinopsis: 'Parra rompe con la poesía solemne usando el habla de todos los días y el humor.' },
    { id: 'el-principito', titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', anio: 1943, paginas: 112, precio: 8990, categoriaId: 'infantil', sinopsis: 'Un aviador perdido en el desierto conoce a un niño que viene de un asteroide.' },
    { id: 'papelucho', titulo: 'Papelucho', autor: 'Marcela Paz', anio: 1947, paginas: 112, precio: 7990, categoriaId: 'infantil', sinopsis: 'El diario de un niño chileno que mira el mundo de los adultos con humor.' },
    { id: 'matilda', titulo: 'Matilda', autor: 'Roald Dahl', anio: 1988, paginas: 256, precio: 10990, categoriaId: 'infantil', sinopsis: 'Una niña con un talento enorme para la lectura enfrenta a una directora temible.' },
];
