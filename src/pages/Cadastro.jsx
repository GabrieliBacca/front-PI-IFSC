import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/api';
import '../index.css';

const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    confirmSenha: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.nome || !formData.cpf || !formData.email || !formData.senha) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    if (formData.senha !== formData.confirmSenha) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    const result = await usuarioService.cadastro({
      nome: formData.nome,
      cpf: formData.cpf,
      email: formData.email,
      senha: formData.senha
    });

    if (result.success) {
      navigate('/login');
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
      backgroundColor: '#f9f9f9',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🍬</div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Criar Conta</h1>
          <p className="page-subtitle">Cadastre-se no DoceDondocas</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              name="nome"
              className="form-input"
              placeholder="Digite seu nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">CPF</label>
            <input
              type="text"
              name="cpf"
              className="form-input"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              name="senha"
              className="form-input"
              placeholder="Digite uma senha forte"
              value={formData.senha}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Senha</label>
            <input
              type="password"
              name="confirmSenha"
              className="form-input"
              placeholder="Confirme sua senha"
              value={formData.confirmSenha}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '15px' }}
            disabled={loading}
          >
            {loading ? '⏳ Criando conta...' : '✅ Criar Conta'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#757575', marginBottom: '10px' }}>
            Já tem uma conta?
          </p>
          <a
            href="/login"
            className="btn btn-outline"
            style={{ width: '100%' }}
          >
            🔓 Fazer Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
