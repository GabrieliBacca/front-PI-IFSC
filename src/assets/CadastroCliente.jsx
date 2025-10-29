import React, { useState } from 'react';
import { Box, Typography, Button, Input, Alert } from '@mui/joy';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { clienteService } from '../services/api';
import './CadastroCliente.css';

const CadastroCliente = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    cidade: '',
    bairro: '',
    rua: '',
    nCasa: ''
  });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nome || !formData.cpf || !formData.telefone || 
        !formData.cidade || !formData.bairro || !formData.rua || !formData.nCasa) {
      setErro('Todos os campos são obrigatórios.');
      return false;
    }

    // Validação básica de CPF (apenas verificar se tem 11 dígitos)
    const cpfNumeros = formData.cpf.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) {
      setErro('Por favor, insira um CPF válido com 11 dígitos.');
      return false;
    }

    // Validação básica de telefone
    const telefoneNumeros = formData.telefone.replace(/\D/g, '');
    if (telefoneNumeros.length < 10) {
      setErro('Por favor, insira um telefone válido.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
            const result = await clienteService.cadastro(formData);
      
      if (result.success) {
        Swal.fire({
          title: 'Cliente cadastrado!',
          text: result.message,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ff69b4'
        }).then(() => {
        // Limpar formulário ou navegar para outra página
        setFormData({
          nome: '',
          cpf: '',
          telefone: '',
          cidade: '',
          bairro: '',
          rua: '',
          nCasa: ''
        });
      });
      } else {
        setErro(result.message);
        Swal.fire({
          title: 'Erro no Cadastro',
          text: result.message,
          icon: 'error',
          confirmButtonText: 'Tentar novamente',
          confirmButtonColor: '#ff69b4'
        });
      }

    } catch (error) {
      setErro('Erro de conexão com o servidor.');
      Swal.fire({
        title: 'Erro de Conexão',
        text: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
        icon: 'error',
        confirmButtonText: 'Tentar novamente',
        confirmButtonColor: '#ff69b4'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-cliente-container">
      <Box className="cadastro-cliente-wrapper">
        <Box className="cadastro-cliente-header">
          <Typography level="h1" className="cadastro-cliente-title">
            Cadastro de<span className="title-highlight">Cliente</span>
          </Typography>
          <Typography level="body-lg" className="cadastro-cliente-subtitle">
            Preencha os dados do cliente
          </Typography>
        </Box>

        <Box className="cadastro-cliente-form-container">
          <form onSubmit={handleSubmit} className="cadastro-cliente-form">
            
            {/* Nome */}
            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                Nome Completo *
              </Typography>
              <Input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite o nome completo"
                required
                className="form-input"
                sx={{
                  '--Input-radius': '12px',
                  '--Input-gap': '12px',
                  '--Input-placeholderColor': '#ad7a99',
                  '--Input-focusedHighlight': '#ff69b4',
                  borderColor: '#f8bbd9',
                  '&.Mui-focused': {
                    borderColor: '#ff69b4',
                    boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.1)',
                  },
                }}
              />
            </Box>

            {/* CPF */}
            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                CPF *
              </Typography>
              <Input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
                required
                className="form-input"
                sx={{
                  '--Input-radius': '12px',
                  '--Input-gap': '12px',
                  '--Input-placeholderColor': '#ad7a99',
                  '--Input-focusedHighlight': '#ff69b4',
                  borderColor: '#f8bbd9',
                  '&.Mui-focused': {
                    borderColor: '#ff69b4',
                    boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.1)',
                  },
                }}
              />
            </Box>

            {/* Telefone */}
            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                Telefone *
              </Typography>
              <Input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
                required
                className="form-input"
                sx={{
                  '--Input-radius': '12px',
                  '--Input-gap': '12px',
                  '--Input-placeholderColor': '#ad7a99',
                  '--Input-focusedHighlight': '#ff69b4',
                  borderColor: '#f8bbd9',
                  '&.Mui-focused': {
                    borderColor: '#ff69b4',
                    boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.1)',
                  },
                }}
              />
            </Box>

            {/* Cidade */}
            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                Cidade *
              </Typography>
              <Input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                placeholder="Digite a cidade"
                required
                className="form-input"
                sx={{
                  '--Input-radius': '12px',
                  '--Input-gap': '12px',
                  '--Input-placeholderColor': '#ad7a99',
                  '--Input-focusedHighlight': '#ff69b4',
                  borderColor: '#f8bbd9',
                  '&.Mui-focused': {
                    borderColor: '#ff69b4',
                    boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.1)',
                  },
                }}
              />
            </Box>

            {/* Bairro */}
            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                Bairro *
              </Typography>
              <Input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                placeholder="Digite o bairro"
                required
                className="form-input"
                sx={{
                  '--Input-radius': '12px',
                  '--Input-gap': '12px',
                  '--Input-placeholderColor': '#ad7a99',
                  '--Input-focusedHighlight': '#ff69b4',
                  borderColor: '#f8bbd9',
                  '&.Mui-focused': {
                    borderColor: '#ff69b4',
                    boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.1)',
                  },
                }}
              />
            </Box>

            {/* Rua */}
            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                Rua *
              </Typography>
              <Input
                type="text"
                name="rua"
                value={formData.rua}
                onChange={handleInputChange}
                placeholder="Digite o nome da rua"
                required
                className="form-input"
                sx={{
                  '--Input-radius': '12px',
                  '--Input-gap': '12px',
                  '--Input-placeholderColor': '#ad7a99',
                  '--Input-focusedHighlight': '#ff69b4',
                  borderColor: '#f8bbd9',
                  '&.Mui-focused': {
                    borderColor: '#ff69b4',
                    boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.1)',
                  },
                }}
              />
            </Box>

            {/* Número da Casa */}
            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                Número da Casa *
              </Typography>
              <Input
                type="text"
                name="nCasa"
                value={formData.nCasa}
                onChange={handleInputChange}
                placeholder="Digite o número"
                required
                className="form-input"
                sx={{
                  '--Input-radius': '12px',
                  '--Input-gap': '12px',
                  '--Input-placeholderColor': '#ad7a99',
                  '--Input-focusedHighlight': '#ff69b4',
                  borderColor: '#f8bbd9',
                  '&.Mui-focused': {
                    borderColor: '#ff69b4',
                    boxShadow: '0 0 0 3px rgba(255, 105, 180, 0.1)',
                  },
                }}
              />
            </Box>

            {erro && (
              <Alert color="danger" className="error-alert">
                {erro}
              </Alert>
            )}

            <Button
              type="submit"
              loading={loading}
              className="cadastro-cliente-button"
              sx={{
                backgroundColor: '#ff69b4',
                '&:hover': {
                  backgroundColor: '#e91e63',
                },
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </Button>
          </form>

          <Box className="cadastro-cliente-links">
            <Typography level="body-sm" className="voltar-text">
              <Link to="/" className="voltar-link">
                ← Voltar
              </Link>
            </Typography>
          </Box>
        </Box>

        <Box className="cadastro-cliente-footer">
          <Link to="/" className="back-home-link">
            ← Voltar para a página inicial
          </Link>
        </Box>
      </Box>
    </div>
  );
};

export default CadastroCliente;
