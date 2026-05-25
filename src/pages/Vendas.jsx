import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { vendaService, clienteService, produtoService } from '../services/api';
import '../index.css';

const Vendas = ({ userName, userEmail, onLogout }) => {

  const [vendas, setVendas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [resumo, setResumo] = useState({
    total: 0,
    quantidade: 0
  });

  const [formData, setFormData] = useState({
    cliente: '',
    produto: '',
    quantidade: '',
    valorUnitario: '',
    observacoes: ''
  });

  useEffect(() => {
    loadVendas();
    loadResumo();
    loadClientes();
    loadProdutos();
  }, []);

  const loadVendas = async () => {

    try {

      const data = await vendaService.listar();

      setVendas(data || []);

    } catch (error) {

      console.error('Erro ao carregar vendas:', error);

    } finally {

      setLoading(false);
    }
  };

  const loadResumo = async () => {

    try {

      const data = await vendaService.resumo();

      setResumo(data);

    } catch (error) {

      console.error('Erro ao carregar resumo:', error);
    }
  };

  const loadClientes = async () => {

    try {

      const result = await clienteService.listar();

      if (result.success) {
        setClientes(result.data || []);
      }

    } catch (error) {

      console.error('Erro ao carregar clientes:', error);
    }
  };

  const loadProdutos = async () => {

    try {

      const result = await produtoService.listar();

      if (result.success) {
        setProdutos(result.data || []);
      }

    } catch (error) {

      console.error('Erro ao carregar produtos:', error);
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

    if (
      !formData.cliente ||
      !formData.produto ||
      !formData.quantidade ||
      !formData.valorUnitario
    ) {

      alert('Preencha todos os campos obrigatórios');

      return;
    }

    const clienteSelecionado = clientes.find(
      cliente => cliente.id === Number(formData.cliente)
    );

    const produtoSelecionado = produtos.find(
      produto => produto.id === Number(formData.produto)
    );

const payload = {

  data: new Date().toISOString(),

  cliente: {
    id: Number(formData.cliente)
  },

  produto: {
    id: Number(formData.produto)
  },

  quantidade: Number(formData.quantidade),

  valorUnitario: Number(formData.valorUnitario),

  observacoes: formData.observacoes
};

    try {

      const result = await vendaService.cadastrar(payload);

      if (result) {

        alert('Venda cadastrada com sucesso!');

        setFormData({
          cliente: '',
          produto: '',
          quantidade: '',
          valorUnitario: '',
          observacoes: ''
        });

        setShowForm(false);

        loadVendas();
        loadResumo();

      }

    } catch (error) {

      console.error('Erro ao salvar venda:', error);

      alert(
        error.response?.data?.message ||
        'Erro ao salvar venda'
      );
    }
  };

  const handleDelete = async (id) => {

    if (window.confirm('Deseja deletar esta venda?')) {

      try {

        await vendaService.deletar(id);

        loadVendas();
        loadResumo();

      } catch (error) {

        console.error('Erro ao deletar venda:', error);
      }
    }
  };

  const handleCancel = () => {

    setFormData({
      cliente: '',
      produto: '',
      quantidade: '',
      valorUnitario: '',
      observacoes: ''
    });

    setShowForm(false);
  };

  return (
    <Layout
      userName={userName}
      userEmail={userEmail}
      onLogout={onLogout}
      pageTitle="Vendas"
      pageSubtitle="Gerencie as vendas da Doces Dondocas"
    >

      {/* RESUMO */}
      <div className="grid grid-2" style={{ marginBottom: '30px' }}>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">💰 Total Vendido</h2>
          </div>

          <p
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#e91e63'
            }}
          >
            R$ {Number(resumo.total || 0).toFixed(2)}
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🛒 Quantidade de Vendas</h2>
          </div>

          <p
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#9c27b0'
            }}
          >
            {resumo.quantidade || 0}
          </p>
        </div>

      </div>

      {/* BOTÃO */}
      <div style={{ marginBottom: '30px' }}>

        {!showForm && (

          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            ➕ Nova Venda
          </button>

        )}

      </div>

      {/* FORMULÁRIO */}
      {showForm && (

        <div className="card" style={{ marginBottom: '30px' }}>

          <div className="card-header">
            <h2 className="card-title">
              ➕ Nova Venda
            </h2>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-2">

              <div className="form-group">

                <label className="form-label">
                  Cliente *
                </label>

                <select
                  name="cliente"
                  className="form-input"
                  value={formData.cliente}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Selecione um cliente
                  </option>

                  {clientes.map(cliente => (

                    <option
                      key={cliente.id}
                      value={cliente.id}
                    >
                      {cliente.nome}
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label className="form-label">
                  Produto *
                </label>

                <select
                  name="produto"
                  className="form-input"
                  value={formData.produto}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Selecione um produto
                  </option>

                  {produtos.map(produto => (

                    <option
                      key={produto.id}
                      value={produto.id}
                    >
                      {produto.titulo}
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label className="form-label">
                  Quantidade *
                </label>

                <input
                  type="number"
                  name="quantidade"
                  className="form-input"
                  value={formData.quantidade}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label className="form-label">
                  Valor Unitário *
                </label>

                <input
                  type="number"
                  step="0.01"
                  name="valorUnitario"
                  className="form-input"
                  value={formData.valorUnitario}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            <div className="form-group">

              <label className="form-label">
                Observações
              </label>

              <textarea
                name="observacoes"
                className="form-input"
                rows="3"
                value={formData.observacoes}
                onChange={handleChange}
              />

            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '20px'
              }}
            >

              <button
                type="submit"
                className="btn btn-primary"
              >
                ✅ Salvar Venda
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

      {/* TABELA */}
      {loading ? (

        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>⏳ Carregando vendas...</p>
        </div>

      ) : vendas.length === 0 ? (

        <div className="card">

          <div
            style={{
              textAlign: 'center',
              padding: '40px'
            }}
          >

            <p
              style={{
                fontSize: '48px',
                marginBottom: '15px'
              }}
            >
              🛒
            </p>

            <p style={{ color: '#757575' }}>
              Nenhuma venda cadastrada
            </p>

          </div>

        </div>

      ) : (

        <div className="card">

          <div className="card-header">
            <h2 className="card-title">
              Lista de Vendas ({vendas.length})
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>

            <table className="table">

              <thead>

                <tr>
                  <th>Cliente</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Valor Unitário</th>
                  <th>Total</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>

              </thead>

              <tbody>

                {vendas.map(venda => (

                  <tr key={venda.id}>

                    <td>{venda.cliente?.nome}</td>

                    <td>{venda.produto?.titulo}</td>

                    <td>{venda.quantidade}</td>

                    <td>
                      R$ {Number(venda.valorUnitario).toFixed(2)}
                    </td>

                    <td>
                      R$ {Number(venda.valor).toFixed(2)}
                    </td>

                    <td>
                      {new Date(venda.data).toLocaleDateString()}
                    </td>

                    <td>

                      <button
                        onClick={() => handleDelete(venda.id)}
                        className="btn btn-danger btn-sm"
                      >
                        🗑️ Deletar
                      </button>

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

export default Vendas;