import React, { useState, useEffect } from 'react';
import { vendaService } from "../services/api";
import './relatorios.css';

export default function Relatorios() {
  const [vendas, setVendas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('diario');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [totalVendas, setTotalVendas] = useState(0);

  // Carregar vendas ao montar o componente
  useEffect(() => {
    carregarVendasPadrao();
  }, []);

  // Carregar vendas padrão (diárias)
  const carregarVendasPadrao = async () => {
    setLoading(true);
    setErro('');
    const hoje = new Date().toISOString().split('T')[0];
    const resultado = await vendaService.listarPorDia(hoje);
    
    if (resultado.success) {
      setVendas(resultado.data || []);
      calcularTotal(resultado.data || []);
    } else {
      setErro(resultado.message);
      setVendas([]);
    }
    setLoading(false);
  };

  // Calcular total de vendas
  const calcularTotal = (dados) => {
    const total = dados.reduce((acc, venda) => acc + (venda.valor || 0), 0);
    setTotalVendas(total);
  };

  // Aplicar filtro de relatório
  const aplicarFiltro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    let resultado;

    try {
      switch (filtroTipo) {
        case 'diario':
          resultado = await vendaService.listarPorDia(dataInicio || new Date().toISOString().split('T')[0]);
          break;
        case 'semanal':
          if (!dataInicio || !dataFim) {
            setErro('Por favor, selecione o período da semana');
            setLoading(false);
            return;
          }
          resultado = await vendaService.listarPorSemana(dataInicio, dataFim);
          break;
        case 'mensal':
          resultado = await vendaService.listarPorMes(mes, ano);
          break;
        case 'customizado':
          if (!dataInicio || !dataFim) {
            setErro('Por favor, selecione o período customizado');
            setLoading(false);
            return;
          }
          resultado = await vendaService.listarPorPeriodo(dataInicio, dataFim);
          break;
        default:
          resultado = await vendaService.listar();
      }

      if (resultado.success) {
        setVendas(resultado.data || []);
        calcularTotal(resultado.data || []);
        if (!resultado.data || resultado.data.length === 0) {
          setErro('Nenhuma venda encontrada para o período selecionado.');
        }
      } else {
        setErro(resultado.message);
        setVendas([]);
      }
    } catch (err) {
      setErro('Erro ao carregar relatório. Tente novamente.');
      console.error(err);
    }

    setLoading(false);
  };

  // Imprimir relatório
  const imprimirRelatorio = () => {
    if (vendas.length === 0) {
      alert('Nenhuma venda para imprimir.');
      return;
    }

    const janela = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório de Vendas</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 {
            text-align: center;
            color: #d946a6;
            margin-bottom: 30px;
          }
          .info {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f5f5f5;
            border-left: 4px solid #d946a6;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #d946a6;
            color: white;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .total {
            font-weight: bold;
            background-color: #f0f0f0;
            font-size: 16px;
          }
          .rodape {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <h1>Relatório de Vendas</h1>
        <div class="info">
          <p><strong>Período:</strong> ${obterPeriodoTexto()}</p>
          <p><strong>Data de Geração:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          <p><strong>Total de Vendas:</strong> ${vendas.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Valor Unitário</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${vendas.map(venda => `
              <tr>
                <td>${venda.id || '-'}</td>
                <td>${new Date(venda.data).toLocaleDateString('pt-BR') || '-'}</td>
                <td>${venda.cliente?.nome || '-'}</td>
                <td>${venda.produto?.titulo || '-'}</td>
                <td>${venda.quantidade || '-'}</td>
                <td>R$ ${(venda.valorUnitario || 0).toFixed(2)}</td>
                <td>R$ ${(venda.valor || 0).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total">
              <td colspan="6">TOTAL</td>
              <td>R$ ${totalVendas.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div class="rodape">
          <p>Relatório gerado automaticamente pelo Sistema StockFlow ERP</p>
        </div>
      </body>
      </html>
    `;
    janela.document.write(html);
    janela.document.close();
    setTimeout(() => janela.print(), 250);
  };

  // Obter texto do período
  const obterPeriodoTexto = () => {
    switch (filtroTipo) {
      case 'diario':
        return `Diário - ${new Date(dataInicio || new Date()).toLocaleDateString('pt-BR')}`;
      case 'semanal':
        return `Semanal - ${new Date(dataInicio).toLocaleDateString('pt-BR')} a ${new Date(dataFim).toLocaleDateString('pt-BR')}`;
      case 'mensal':
        return `Mensal - ${mes}/${ano}`;
      case 'customizado':
        return `Customizado - ${new Date(dataInicio).toLocaleDateString('pt-BR')} a ${new Date(dataFim).toLocaleDateString('pt-BR')}`;
      default:
        return 'Todas as vendas';
    }
  };

  // Exportar para CSV
  const exportarCSV = () => {
    if (vendas.length === 0) {
      alert('Nenhuma venda para exportar.');
      return;
    }

    let csv = 'ID,Data,Cliente,Produto,Quantidade,Valor Unitário,Total\n';
    vendas.forEach(venda => {
      csv += `${venda.id},"${new Date(venda.data).toLocaleDateString('pt-BR')}","${venda.cliente?.nome || ''}","${venda.produto?.titulo || ''}",${venda.quantidade},${(venda.valorUnitario || 0).toFixed(2)},${(venda.valor || 0).toFixed(2)}\n`;
    });
    csv += `\nTOTAL,,,,,R$ ${totalVendas.toFixed(2)}`;

    const elemento = document.createElement('a');
    elemento.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    elemento.setAttribute('download', `relatorio_vendas_${new Date().getTime()}.csv`);
    elemento.style.display = 'none';
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
  };

  return (
    <div className="relatorios-container">
      <div className="relatorios-header">
        <h1>📊 Relatório de Vendas</h1>
        <p>Gere e visualize relatórios de vendas por período</p>
      </div>

      {/* Formulário de Filtros */}
      <form onSubmit={aplicarFiltro} className="filtro-form">
        <div className="form-group">
          <label htmlFor="filtroTipo">Tipo de Relatório:</label>
          <select
            id="filtroTipo"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="form-input"
          >
            <option value="diario">Diário</option>
            <option value="semanal">Semanal</option>
            <option value="mensal">Mensal</option>
            <option value="customizado">Customizado</option>
          </select>
        </div>

        {/* Campos condicionais baseados no tipo de filtro */}
        {filtroTipo === 'diario' && (
          <div className="form-group">
            <label htmlFor="dataInicio">Data:</label>
            <input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="form-input"
            />
          </div>
        )}

        {filtroTipo === 'semanal' && (
          <>
            <div className="form-group">
              <label htmlFor="dataInicio">Data Início:</label>
              <input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dataFim">Data Fim:</label>
              <input
                id="dataFim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="form-input"
              />
            </div>
          </>
        )}

        {filtroTipo === 'mensal' && (
          <>
            <div className="form-group">
              <label htmlFor="mes">Mês:</label>
              <select
                id="mes"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className="form-input"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ano">Ano:</label>
              <input
                id="ano"
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className="form-input"
                min="2020"
                max={new Date().getFullYear()}
              />
            </div>
          </>
        )}

        {filtroTipo === 'customizado' && (
          <>
            <div className="form-group">
              <label htmlFor="dataInicio">Data Início:</label>
              <input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dataFim">Data Fim:</label>
              <input
                id="dataFim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="form-input"
              />
            </div>
          </>
        )}

        <button type="submit" className="btn-filtrar" disabled={loading}>
          {loading ? 'Carregando...' : 'Gerar Relatório'}
        </button>
      </form>

      {/* Mensagem de Erro */}
      {erro && <div className="erro-mensagem">{erro}</div>}

      {/* Resumo */}
      {vendas.length > 0 && (
        <div className="resumo-vendas">
          <div className="resumo-card">
            <h3>Total de Vendas</h3>
            <p className="valor">{vendas.length}</p>
          </div>
          <div className="resumo-card">
            <h3>Valor Total</h3>
            <p className="valor">R$ {totalVendas.toFixed(2)}</p>
          </div>
          <div className="resumo-card">
            <h3>Ticket Médio</h3>
            <p className="valor">R$ {(totalVendas / vendas.length).toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Tabela de Vendas */}
      {vendas.length > 0 ? (
        <div className="tabela-container">
          <table className="tabela-vendas">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Valor Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda) => (
                <tr key={venda.id}>
                  <td>{venda.id}</td>
                  <td>{new Date(venda.data).toLocaleDateString('pt-BR')}</td>
                  <td>{venda.cliente?.nome || '-'}</td>
                  <td>{venda.produto?.titulo || '-'}</td>
                  <td>{venda.quantidade || '-'}</td>
                  <td>R$ {(venda.valorUnitario || 0).toFixed(2)}</td>
                  <td className="total-venda">R$ {(venda.valor || 0).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="linha-total">
                <td colSpan="6" className="label-total">TOTAL</td>
                <td className="valor-total">R$ {totalVendas.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Botões de Ação */}
          <div className="botoes-acao">
            <button onClick={imprimirRelatorio} className="btn-imprimir">
              🖨️ Imprimir Relatório
            </button>
            <button onClick={exportarCSV} className="btn-exportar">
              📥 Exportar CSV
            </button>
          </div>
        </div>
      ) : (
        !loading && <div className="sem-dados">Nenhuma venda encontrada para o período selecionado.</div>
      )}
    </div>
  );
}
