import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssVarsProvider } from '@mui/joy';
import { ConfigProvider } from 'antd';
import Home from './assets/Home.jsx';
import Login from './assets/Login.jsx';
import Cadastro from './assets/Cadastro.jsx';
import EsqueciSenha from './assets/EsqueciSenha.jsx';

// Configuração do tema para Ant Design
const antdTheme = {
  token: {
    colorPrimary: '#ff69b4',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    borderRadius: 8,
  },
};

export const App = () => {
  return (
    <ConfigProvider theme={antdTheme}>
      <CssVarsProvider>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/cadastro"} element={<Cadastro />} />
            <Route path={"/esqueci-senha"} element={<EsqueciSenha />} />
            {/* <Route path={"/effect"} element={<ComponentEffect />} /> */}
          </Routes>
        </BrowserRouter>
      </CssVarsProvider>
    </ConfigProvider>
  );
};

