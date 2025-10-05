import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssVarsProvider } from '@mui/joy/styles';
import { ConfigProvider } from 'antd';
import Home from './assets/Home';
import "antd/dist/reset.css"; // (v5+ usa reset.css)


// Configuracao do tema para Ant Design que criei no css
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
            {/* <Route path={"/effect"} element={<ComponentEffect />} /> */}
          </Routes>
        </BrowserRouter>
      </CssVarsProvider>
    </ConfigProvider>
  );
};
