import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../index.css';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: '📊' },
  { id: 'produtos', label: 'Produtos', path: '/produtos', icon: '📦' },
  { id: 'clientes', label: 'Clientes', path: '/clientes', icon: '👥' },
  { id: 'vendas', label: 'Vendas', path: '/vendas', icon: '🛒' },
  { id: 'relatorios', label: 'Relatórios', path: '/relatorios', icon: '📈' },
];

const Sidebar = ({ onLogout, userName, userEmail, collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo" style={{ fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          🍬
        </div>
        <div className="sidebar-title">DoceDondocas</div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map(item => (
          <a
            key={item.id}
            href={item.path}
            className={`sidebar-menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-menu-icon">{item.icon}</span>
            <span className="sidebar-menu-label">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={onToggle}>
          <div className="sidebar-user-avatar">
            {userName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userName || 'Usuário'}</div>
            <div className="sidebar-user-email">{userEmail || 'email@example.com'}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', marginTop: '10px' }}
        >
          🚪 Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
