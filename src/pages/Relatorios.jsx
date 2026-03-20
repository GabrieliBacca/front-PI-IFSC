import React from 'react';
import Layout from '../components/Layout';
import '../index.css';

const Relatorios = ({ userName, userEmail, onLogout }) => {
  return (
    <Layout
      userName={userName}
      userEmail={userEmail}
      onLogout={onLogout}
      pageTitle="Relatórios"
      pageSubtitle="Visualize análises e relatórios do seu negócio"
    >
      <div className="card">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '64px', marginBottom: '20px' }}>📈</p>
          <h2 className="card-title" style={{ marginBottom: '10px' }}>Seção de Relatórios</h2>
          <p style={{ color: '#757575', marginBottom: '20px' }}>
            Esta seção está em desenvolvimento
          </p>
          <p style={{ color: '#bdbdbd', fontSize: '14px' }}>
            Em breve você poderá visualizar relatórios de vendas, estoque e análises detalhadas.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Relatorios;
