import React from 'react';
import Layout from '../components/Layout';
import '../index.css';

const Vendas = ({ userName, userEmail, onLogout }) => {
  return (
    <Layout
      userName={userName}
      userEmail={userEmail}
      onLogout={onLogout}
      pageTitle="Vendas"
      pageSubtitle="Registre e acompanhe suas vendas"
    >
      <div className="card">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</p>
          <h2 className="card-title" style={{ marginBottom: '10px' }}>Seção de Vendas</h2>
          <p style={{ color: '#757575', marginBottom: '20px' }}>
            Esta seção está em desenvolvimento
          </p>
          <p style={{ color: '#bdbdbd', fontSize: '14px' }}>
            Em breve você poderá registrar vendas, acompanhar pedidos e gerar recibos.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Vendas;
