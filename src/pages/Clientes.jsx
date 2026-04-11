import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { clienteService } from '../services/api';
import '../index.css';

const Clientes = ({ userName, userEmail, onLogout }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    cidade: '',
    bairro: '',
    rua: '',
    numeroCasa: ''
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const result = await clienteService.listar();
      if (result.success) {
        setClientes(result.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

     let newValue = value;

      if (name === 'cpf') {
        newValue = value.replace(/\D/g, '');
        newValue = newValue.slice(0, 11);
      }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.cpf) {
      alert('Por favor, preencha os campos obrigatórios');
      return;
    }

    let result;
    if (editingId) {
      result = await clienteService.editar({
        id: editingId,
        ...formData
      });
    } else {
      result = await clienteService.cadastro(formData);
    }

    if (result.success) {
      setFormData({
        nome: '',
        cpf: '',
        telefone: '',
        cidade: '',
        bairro: '',
        rua: '',
        numeroCasa: ''
      });
      setEditingId(null);
      setShowForm(false);
      loadClientes();
    } else {
      alert(result.message);
    }
  };

  const handleEdit = (cliente) => {
    setFormData({
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone || '',
      cidade: cliente.cidade || '',
      bairro: cliente.bairro || '',
      rua: cliente.rua || '',
      numeroCasa: cliente.numeroCasa || ''
    });
    setEditingId(cliente.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      const result = await clienteService.deletar(id);
      if (result.success) {
        loadClientes();
      } else {
        alert(result.message);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: '',
      cpf: '',
      telefone: '',
      cidade: '',
      bairro: '',
      rua: '',
      numeroCasa: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <Layout
      userName={userName}
      userEmail={userEmail}
      onLogout={onLogout}
      pageTitle="Clientes"
      pageSubtitle="Gerencie seus clientes"
    >
      <div style={{ marginBottom: '30px' }}>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            ➕ Novo Cliente
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <div className="card-header">
            <h2 className="card-title">
              {editingId ? '✏️ Editar Cliente' : '➕ Novo Cliente'}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input
                  type="text"
                  name="nome"
                  className="form-input"
                  placeholder="Nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">CPF *</label>
                <input
                  type="text"
                  name="cpf"
                  className="form-input"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  className="form-input"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cidade</label>
                <input
                  type="text"
                  name="cidade"
                  className="form-input"
                  placeholder="Cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  className="form-input"
                  placeholder="Bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rua</label>
                <input
                  type="text"
                  name="rua"
                  className="form-input"
                  placeholder="Rua"
                  value={formData.rua}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Número</label>
                <input
                  type="text"
                  name="numeroCasa"
                  className="form-input"
                  placeholder="Número"
                  value={formData.numeroCasa}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary">
                {editingId ? '💾 Atualizar' : '✅ Cadastrar'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>⏳ Carregando clientes...</p>
        </div>
      ) : clientes.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>👥</p>
            <p style={{ color: '#757575' }}>Nenhum cliente cadastrado ainda</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Lista de Clientes ({clientes.length})</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>Cidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(cliente => (
                  <tr key={cliente.id}>
                    <td>{cliente.nome}</td>
                    <td>{cliente.cpf}</td>
                    <td>{cliente.telefone || '-'}</td>
                    <td>{cliente.cidade || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="btn btn-secondary btn-sm"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className="btn btn-danger btn-sm"
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Clientes;
