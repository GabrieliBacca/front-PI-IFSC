import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/api';
import '../index.css';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!cpf || !senha) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    const result = await usuarioService.login(cpf, senha);
    
    if (result.success) {
      onLoginSuccess(result.data.token);
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f9f9f9'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '15px'
          }}>
            🍬
          </div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>DoceDondocas</h1>
          <p className="page-subtitle">Sistema de Controle de Estoque</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">CPF</label>
            <input
              type="text"
              className="form-input"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '15px' }}
            disabled={loading}
          >
            {loading ? '⏳ Entrando...' : '🔓 Entrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#757575', marginBottom: '10px' }}>
            Não tem uma conta?
          </p>
          <a
            href="/cadastro"
            className="btn btn-outline"
            style={{ width: '100%' }}
          >
            📝 Criar Conta
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
