import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { produtoService, clienteService } from '../services/api';
import '../index.css';

const Dashboard = ({ userName, userEmail, onLogout }) => {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalClientes: 0,
    vendiaHoje: 0,
    estoqueTotal: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const produtosResult = await produtoService.listar();
        const clientesResult = await clienteService.listar();

        setStats({
          totalProdutos: produtosResult.data?.length || 0,
          totalClientes: clientesResult.data?.length || 0,
          vendiaHoje: 0,
          estoqueTotal: produtosResult.data?.reduce((sum, p) => sum + (p.quantidade || 0), 0) || 0
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <Layout
      userName={userName}
      userEmail={userEmail}
      onLogout={onLogout}
      pageTitle="Dashboard"
      pageSubtitle="Bem-vindo ao seu painel de controle"
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>⏳ Carregando dados...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-4" style={{ marginBottom: '40px' }}>
            <div className="card">
              <div className="card-header">
                <div>
                  <p className="page-subtitle">Total de Produtos</p>
                  <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#d946a6', margin: '10px 0 0 0' }}>
                    {stats.totalProdutos}
                  </h2>
                </div>
                <span style={{ fontSize: '32px' }}>📦</span>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <p className="page-subtitle">Total de Clientes</p>
                  <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#d946a6', margin: '10px 0 0 0' }}>
                    {stats.totalClientes}
                  </h2>
                </div>
                <span style={{ fontSize: '32px' }}>👥</span>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <p className="page-subtitle">Vendas Hoje</p>
                  <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#d946a6', margin: '10px 0 0 0' }}>
                    R$ 0,00
                  </h2>
                </div>
                <span style={{ fontSize: '32px' }}>🛒</span>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <p className="page-subtitle">Estoque Total</p>
                  <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#d946a6', margin: '10px 0 0 0' }}>
                    {stats.estoqueTotal}
                  </h2>
                </div>
                <span style={{ fontSize: '32px' }}>📊</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Bem-vindo ao DoceDondocas!</h2>
            </div>
            <div className="card-content">
              <p style={{ color: '#757575', lineHeight: '1.6' }}>
                Use o menu lateral para acessar as diferentes seções do sistema:
              </p>
              <ul style={{ marginTop: '15px', paddingLeft: '20px', color: '#757575' }}>
                <li style={{ marginBottom: '10px' }}>📦 <strong>Produtos</strong> - Gerencie seu estoque de produtos</li>
                <li style={{ marginBottom: '10px' }}>👥 <strong>Clientes</strong> - Cadastre e gerencie seus clientes</li>
                <li style={{ marginBottom: '10px' }}>🛒 <strong>Vendas</strong> - Registre suas vendas e acompanhe pedidos</li>
                <li style={{ marginBottom: '10px' }}>📈 <strong>Relatórios</strong> - Visualize relatórios e análises</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
