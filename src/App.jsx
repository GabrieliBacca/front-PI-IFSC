import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuthToken, removeAuthToken } from './services/api';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Clientes from './pages/Clientes';
import Vendas from './pages/Vendas';
import Relatorios from './pages/Relatorios';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      // Aqui você pode fazer uma requisição para obter os dados do usuário
      // Por enquanto, vamos usar dados padrão
      setUserName('Dona da Loja');
      setUserEmail('dona@docedondocas.com');
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (token) => {
    setIsAuthenticated(true);
    setUserName('Dona da Loja');
    setUserEmail('dona@docedondocas.com');
  };

  const handleLogout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
    setUserName('');
    setUserEmail('');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: '15px' }}>🍬</p>
          <p style={{ color: '#757575' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/cadastro"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Cadastro />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Dashboard
                userName={userName}
                userEmail={userEmail}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/produtos"
          element={
            isAuthenticated ? (
              <Produtos
                userName={userName}
                userEmail={userEmail}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/clientes"
          element={
            isAuthenticated ? (
              <Clientes
                userName={userName}
                userEmail={userEmail}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/vendas"
          element={
            isAuthenticated ? (
              <Vendas
                userName={userName}
                userEmail={userEmail}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/relatorios"
          element={
            isAuthenticated ? (
              <Relatorios
                userName={userName}
                userEmail={userEmail}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
