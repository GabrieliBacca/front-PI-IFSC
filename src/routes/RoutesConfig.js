import Dashboard from '../pages/Dashboard';
import Produtos from '../pages/Produtos';
import Clientes from '../pages/Clientes';
import Vendas from '../pages/Vendas';
import Relatorios from '../pages/Relatorios';
import Cadastro from '../pages/Cadastro';

export const routes = [
    { path: '/', element: Dashboard },
    { path: '/produtos', element: Produtos },
    { path: '/clientes', element: Clientes },
    { path: '/vendas', element: Vendas },
    { path: '/relatorios', element: Relatorios },
    { path: '/cadastro', element: Cadastro },
];