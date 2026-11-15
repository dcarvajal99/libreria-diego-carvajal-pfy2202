// Componente raíz: BrowserRouter permite a cualquier componente leer la URL y navegar, y
// AppRoutes declara las rutas. En GitHub Pages el sitio vive en una subcarpeta: basename le
// indica a React Router que las rutas empiezan después de ella (la misma base de Vite).
import { BrowserRouter } from 'react-router';
import AppRoutes from './rutas/AppRoutes.jsx';

function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
