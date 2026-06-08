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
  
  const [showMarcaModal, setShowMarcaModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [novaMarca, setNovaMarca] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');

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
      marca: marcaSelecionada,
      categoria: categoriaSelecionada
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

  const handleToggleStatus = async (produto) => {
    const novoStatus = !produto.ativo;

    if (window.confirm('Deseja alterar o status deste produto?')) {
      const result = await produtoService.ativarDesativar(produto.id, novoStatus);

      if (result.success) {
        loadProdutos();
      } else {
        alert(result.message);
      }
    }
  };

  // ✅ NOVAS FUNÇÕES PARA SALVAR MARCA E CATEGORIA
  const handleSalvarMarca = async () => {
    if (!novaMarca.trim()) {
      alert('Digite o nome da marca');
      return;
    }
    const result = await produtoService.cadastrarMarca(novaMarca);
    if (result.success) {
      setNovaMarca('');
      setShowMarcaModal(false);
      loadMarcasAndCategorias(); // Recarrega a lista
      alert('Marca cadastrada com sucesso!');
    } else {
      alert(result.message || 'Erro ao cadastrar marca');
    }
  };

  const handleSalvarCategoria = async () => {
    if (!novaCategoria.trim()) {
      alert('Digite o nome da categoria');
      return;
    }
    const result = await produtoService.cadastrarCategoria(novaCategoria);
    if (result.success) {
      setNovaCategoria('');
      setShowCategoriaModal(false);
      loadMarcasAndCategorias(); // Recarrega a lista
      alert('Categoria cadastrada com sucesso!');
    } else {
      alert(result.message || 'Erro ao cadastrar categoria');
    }
  };

  // ============ RETORNO JSX ============
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

              {/* ✅ CAMPO MARCA COM BOTÃO */}
              <div className="form-group">
                <label className="form-label">Marca</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    name="marca"
                    className="form-input"
                    value={formData.marca}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  >
                    <option value="">Selecione uma marca</option>
                    {marcas.map(marca => (
                      <option key={marca.id} value={marca.id}>
                        {marca.marca}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowMarcaModal(true)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}
                  >
                    ➕ Nova
                  </button>
                </div>
              </div>

              {/* ✅ CAMPO CATEGORIA COM BOTÃO */}
              <div className="form-group">
                <label className="form-label">Categoria</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    name="categoria"
                    className="form-input"
                    value={formData.categoria}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.categoria}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoriaModal(true)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}
                  >
                    ➕ Nova
                  </button>
                </div>
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
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr
                    key={produto.id}
                    style={{
                      opacity: produto.ativo ? 1 : 0.5,
                      backgroundColor: produto.ativo ? 'transparent' : '#f2f2f2'
                    }}
                  >
                    <td>{produto.titulo}</td>
                    <td>R$ {parseFloat(produto.valor).toFixed(2)}</td>
                    <td>{produto.marca?.marca || '-'}</td>
                    <td>{produto.categoria?.categoria || '-'}</td>
                    <td>{produto.ativo ? 'Ativo' : 'Inativo'}</td>

                    <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleToggleStatus(produto)}
                          className={`btn btn-sm ${produto.ativo ? 'btn-warning' : 'btn-success'}`}
                        >
                          {produto.ativo ? '🚫 Desativar' : '✅ Ativar'}
                        </button>
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

      {/* ✅ MODAIS NO FINAL, DENTRO DO LAYOUT */}

      {/* MODAL DE MARCA */}
      {showMarcaModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Nova Marca</h3>
            <input
              type="text"
              placeholder="Nome da marca"
              value={novaMarca}
              onChange={(e) => setNovaMarca(e.target.value)}
              className="form-input"
              style={{ marginBottom: '20px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSalvarMarca} className="btn btn-primary" style={{ flex: 1 }}>
                ✅ Salvar
              </button>
              <button onClick={() => setShowMarcaModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CATEGORIA */}
      {showCategoriaModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Nova Categoria</h3>
            <input
              type="text"
              placeholder="Nome da categoria"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              className="form-input"
              style={{ marginBottom: '20px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSalvarCategoria} className="btn btn-primary" style={{ flex: 1 }}>
                ✅ Salvar
              </button>
              <button onClick={() => setShowCategoriaModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Produtos;
