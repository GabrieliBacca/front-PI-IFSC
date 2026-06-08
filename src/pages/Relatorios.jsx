import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { vendaService } from "../services/api";
import './relatorios.css';

export default function Relatorios() {
  const navigate = useNavigate();

  const hoje = new Date().toISOString().split('T')[0];

  const [vendas, setVendas] = useState([]);
  const [vendasFiltradas, setVendasFiltradas] = useState([]);

  const [dataInicio, setDataInicio] = useState(hoje);
  const [dataFim, setDataFim] = useState(hoje);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [totalVendas, setTotalVendas] = useState(0);

  useEffect(() => {
    carregarVendas();
  }, []);

  const carregarVendas = async () => {
    setLoading(true);
    setErro('');

    try {
      const resultado = await vendaService.listar();

      const lista = Array.isArray(resultado)
          ? resultado
          : resultado.data || [];

      setVendas(lista);
      filtrarVendas(lista);

    } catch (err) {
      console.error(err);
      setErro('Erro ao carregar vendas.');
    }

    setLoading(false);
  };

  const filtrarVendas = (lista = vendas) => {

    const inicio = new Date(`${dataInicio}T00:00:00`);
    const fim = new Date(`${dataFim}T23:59:59`);

    const filtradas = lista.filter((venda) => {
      const dataVenda = new Date(venda.data);
      return dataVenda >= inicio && dataVenda <= fim;
    });

    setVendasFiltradas(filtradas);
    calcularTotal(filtradas);

    if (filtradas.length === 0) {
      setErro('Nenhuma venda encontrada para o período.');
    } else {
      setErro('');
    }
  };

  const calcularTotal = (dados) => {
    const total = dados.reduce((acc, v) => acc + (v.valor || 0), 0);
    setTotalVendas(total);
  };

  const aplicarFiltro = (e) => {
    e.preventDefault();
    filtrarVendas();
  };

  const obterPeriodoTexto = () => {
    return `${new Date(dataInicio).toLocaleDateString('pt-BR')} até ${new Date(dataFim).toLocaleDateString('pt-BR')}`;
  };

  const imprimirRelatorio = () => {

    if (vendasFiltradas.length === 0) {
      alert('Nenhuma venda para imprimir.');
      return;
    }

    const janela = window.open('', '_blank');

    const html = `
      <html>
      <head>
        <title>Relatório</title>
        <style>
          body { font-family: Arial; margin: 20px; }
          h1 { text-align:center; color:#d946a6; }
          table { width:100%; border-collapse:collapse; margin-top:20px; }
          th, td { border:1px solid #ddd; padding:8px; }
          th { background:#d946a6; color:white; }
          .total { font-weight:bold; background:#f2f2f2; }
        </style>
      </head>
      <body>

        <h1>Relatório de Vendas</h1>

        <p><strong>Período:</strong> ${obterPeriodoTexto()}</p>
        <p><strong>Total:</strong> ${vendasFiltradas.length}</p>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Unitário</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            ${vendasFiltradas.map(v => `
              <tr>
                <td>${v.id}</td>
                <td>${new Date(v.data).toLocaleDateString('pt-BR')}</td>
                <td>${v.cliente?.nome || '-'}</td>
                <td>${v.produto?.titulo || '-'}</td>
                <td>${v.quantidade}</td>
                <td>R$ ${(v.valorUnitario || 0).toFixed(2)}</td>
                <td>R$ ${(v.valor || 0).toFixed(2)}</td>
              </tr>
            `).join('')}

            <tr class="total">
              <td colspan="6">TOTAL</td>
              <td>R$ ${totalVendas.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

      </body>
      </html>
    `;

    janela.document.write(html);
    janela.document.close();
    setTimeout(() => janela.print(), 300);
  };

  const exportarCSV = () => {

    if (vendasFiltradas.length === 0) {
      alert('Nenhuma venda para exportar.');
      return;
    }

    let csv = 'ID,Data,Cliente,Produto,Quantidade,Valor Unitário,Total\n';

    vendasFiltradas.forEach(v => {
      csv += `${v.id},"${new Date(v.data).toLocaleDateString('pt-BR')}","${v.cliente?.nome || ''}","${v.produto?.titulo || ''}",${v.quantidade},${(v.valorUnitario || 0).toFixed(2)},${(v.valor || 0).toFixed(2)}\n`;
    });

    csv += `\nTOTAL,,,,,R$ ${totalVendas.toFixed(2)}`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_${Date.now()}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
      <div className="relatorios-container">
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
          Voltar
          </button>
        </div>

        <div className="relatorios-header">
          <h1>📊 Relatório de Vendas</h1>
          <p>Relatório por período</p>
        </div>

        {/* FILTROS */}
        <form onSubmit={aplicarFiltro} className="filtro-form">

          <div className="form-group">
            <label>Data Início</label>
            <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Data Fim</label>
            <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="form-input"
            />
          </div>

          <button className="btn-filtrar" disabled={loading}>
            {loading ? 'Carregando...' : 'Gerar Relatório'}
          </button>

        </form>

        {/* ERRO */}
        {erro && <div className="erro-mensagem">{erro}</div>}

        {/* RESUMO */}
        {vendasFiltradas.length > 0 && (
            <div className="resumo-vendas">

              <div className="resumo-card">
                <h3>Vendas</h3>
                <p>{vendasFiltradas.length}</p>
              </div>

              <div className="resumo-card">
                <h3>Total</h3>
                <p>R$ {totalVendas.toFixed(2)}</p>
              </div>

              <div className="resumo-card">
                <h3>Ticket Médio</h3>
                <p>R$ {(totalVendas / vendasFiltradas.length).toFixed(2)}</p>
              </div>

            </div>
        )}

        {/* TABELA */}
        {vendasFiltradas.length > 0 ? (
            <div className="tabela-container">

              <table className="tabela-vendas">

                <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Produto</th>
                  <th>Qtd</th>
                  <th>Unitário</th>
                  <th>Total</th>
                </tr>
                </thead>

                <tbody>
                {vendasFiltradas.map(v => (
                    <tr key={v.id}>
                      <td>{v.id}</td>
                      <td>{new Date(v.data).toLocaleDateString('pt-BR')}</td>
                      <td>{v.cliente?.nome || '-'}</td>
                      <td>{v.produto?.titulo || '-'}</td>
                      <td>{v.quantidade}</td>
                      <td>R$ {(v.valorUnitario || 0).toFixed(2)}</td>
                      <td>R$ {(v.valor || 0).toFixed(2)}</td>
                    </tr>
                ))}

                <tr className="linha-total">
                  <td colSpan="6">TOTAL</td>
                  <td>R$ {totalVendas.toFixed(2)}</td>
                </tr>
                </tbody>

              </table>

            </div>
        ) : (
            !loading && <div className="sem-dados">Nenhuma venda encontrada.</div>
        )}

      </div>
  );
}
