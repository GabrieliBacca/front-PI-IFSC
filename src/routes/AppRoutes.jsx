import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoute';
import { routes } from './RoutesConfig';
import { usuarioService } from '../services/api';

export default function AppRoutes({userName, userEmail}) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await usuarioService.logout();
        navigate('/login');
    };

    return (
        <Routes>

            {/* PUBLICA */}
            <Route path="/login" element={<Login />} />

            {/* PRIVADA */}
            <Route element={<PrivateRoute />}>
                {routes.map((route, index) => {
                    const Component = route.element;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={<Component userName={userName} userEmail={userEmail} onLogout={handleLogout} /> }
                        />
                    );
                })}
            </Route>

        </Routes>
    );
}