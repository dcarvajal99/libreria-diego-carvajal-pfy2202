// Rutas de la API REST de la librería. Las páginas las pasan a useConsulta(), que decide si
// hace falta pedirlas al servidor. La ruta también es la clave de la caché.
export const API = {
    categorias: () => 'categorias',
    librosDeCategoria: (id) => 'categorias/' + encodeURIComponent(id) + '/libros',
    libro: (id) => 'libros/' + encodeURIComponent(id),
};
