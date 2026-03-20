import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../index.css';

const Layout = ({ children, onLogout, userName, userEmail, pageTitle, pageSubtitle }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-container">
      <Sidebar
        onLogout={onLogout}
        userName={userName}
        userEmail={userEmail}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <div>
              <h1 className="header-title">{pageTitle || 'DoceDondocas'}</h1>
              {pageSubtitle && <p className="header-subtitle">{pageSubtitle}</p>}
            </div>
          </div>
          <div className="header-right">
            <span style={{ fontSize: '14px', color: '#757575' }}>
              👤 {userName || 'Usuário'}
            </span>
          </div>
        </header>

        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
