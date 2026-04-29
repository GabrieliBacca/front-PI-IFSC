import { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { usuarioService } from './services/api';

function App() {
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');

            if (token) {
                const result = await usuarioService.validarToken(token);

                if (!result.valid) {
                    localStorage.removeItem('authToken');
                } else {
                    setUserName(result.user.nome);
                    setUserEmail(result.user.email);
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return <AppRoutes userName={userName} userEmail={userEmail} />;
}

export default App;