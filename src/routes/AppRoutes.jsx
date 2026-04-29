import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoute';
import { routes } from './RoutesConfig';

export default function AppRoutes() {
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
                            element={<Component />}
                        />
                    );
                })}
            </Route>

        </Routes>
    );
}