import { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { usuarioService } from './services/api';

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');

            if (token) {
                const result = await usuarioService.validarToken(token);

                if (!result.valid) {
                    localStorage.removeItem('authToken');
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return <AppRoutes />;
}

export default App;