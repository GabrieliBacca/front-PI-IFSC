import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { produtoService } from '../services/api';
import '../index.css';

const Produtos = ({ userName, userEmail, onLogout }) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    valor: '',
    marca: '',
    categoria: ''
  });
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    loadProdutos();
    loadMarcasAndCategorias();
  }, []);

  const loadProdutos = async () => {
    try {
      const result = await produtoService.listar();
      if (result.success) {
        setProdutos(result.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarcasAndCategorias = async () => {
    try {
      const marcasResult = await produtoService.listarMarcas();
      const categoriasResult = await produtoService.listarCategorias();
      
      if (marcasResult.success) setMarcas(marcasResult.data || []);
      if (categoriasResult.success) setCategorias(categoriasResult.data || []);
    } catch (error) {
      console.error('Erro ao carregar marcas e categorias:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.titulo || !formData.valor) {
    alert('Por favor, preencha todos os campos obrigatórios');
    return;
  }

  // Encontrar a marca e categoria completas
  const marcaSelecionada = marcas.find(m => m.id === Number(formData.marca));
  const categoriaSelecionada = categorias.find(c => c.id === Number(formData.categoria));

  const payload = {
    titulo: formData.titulo,
    valor: parseFloat(formData.valor),
    marca: marcaSelecionada ? [marcaSelecionada] : [],
    categoria: categoriaSelecionada ? [categoriaSelecionada] : []
  };

  let result;
  if (editingId) {
    result = await produtoService.editar({
      id: editingId,
      ...payload
    });
  } else {
    result = await produtoService.cadastrar(payload);
  }

  if (result && result.success) {
    setFormData({ titulo: '', valor: '', marca: '', categoria: '' });
    setEditingId(null);
    setShowForm(false);
    loadProdutos();
  } else {
    alert(result?.message || "Erro ao cadastrar produto");
  }
};


  const handleEdit = (produto) => {
    setFormData({
      titulo: produto.titulo,
      valor: produto.valor,
      marca: produto.marca?.id || '',
      categoria: produto.categoria?.id || ''
    });
    setEditingId(produto.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      const result = await produtoService.deletar(id);
      if (result.success) {
        loadProdutos();
      } else {
        alert(result.message);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ titulo: '', valor: '', marca: '', categoria: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <Layout
      userName={userName}
      userEmail={userEmail}
      onLogout={onLogout}
      pageTitle="Produtos"
      pageSubtitle="Gerencie seu estoque de produtos"
    >
      <div style={{ marginBottom: '30px' }}>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            ➕ Novo Produto
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <div className="card-header">
            <h2 className="card-title">
              {editingId ? '✏️ Editar Produto' : '➕ Novo Produto'}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input
                  type="text"
                  name="titulo"
                  className="form-input"
                  placeholder="Nome do produto"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valor *</label>
                <input
                  type="number"
                  name="valor"
                  className="form-input"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.valor}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Marca</label>
                <select
                  name="marca"
                  className="form-input"
                  value={formData.marca}
                  onChange={handleChange}
                >
                  <option value="">Selecione uma marca</option>
                  {marcas.map(marca => (
                    <option key={marca.id} value={marca.id}>
                      {marca.marca}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Categoria</label>
                <select
                  name="categoria"
                  className="form-input"
                  value={formData.categoria}
                  onChange={handleChange}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.categoria}
                    </option>
                  ))}
                </select>
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
          <p>⏳ Carregando produtos...</p>
        </div>
      ) : produtos.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '48px', marginBottom: '15px' }}>📦</p>
            <p style={{ color: '#757575' }}>Nenhum produto cadastrado ainda</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Lista de Produtos ({produtos.length})</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Valor</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr key={produto.id}>
                    <td>{produto.titulo}</td>
                    <td>R$ {parseFloat(produto.valor).toFixed(2)}</td>
                    <td>{produto.marca?.marca || '-'}</td>
                    <td>{produto.categoria?.categoria || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleEdit(produto)}
                          className="btn btn-secondary btn-sm"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id)}
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

export default Produtos;
