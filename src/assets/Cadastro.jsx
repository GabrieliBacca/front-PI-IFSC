import React, { useState } from 'react';
import { Box, Typography, Button, Input, Alert } from '@mui/joy';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { usuarioService } from '../services/api';
import './Cadastro.css';

const Cadastro = () => {
  const [formData, setFormData] = useState({
    id: 0,
    cpf: '',
    nome: '',
    email: '',
    senha: ''
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
    if (!formData.cpf || !formData.nome || !formData.email || !formData.senha) {
      setErro('Todos os campos são obrigatórios.');
      return false;
    }

    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErro('Por favor, insira um email válido.');
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
      const result = await usuarioService.cadastro(formData);
      
      if (result.success) {
        Swal.fire({
          title: 'Cadastro realizado!',
          text: 'Sua conta foi criada com sucesso!',
          icon: 'success',
          confirmButtonText: 'Fazer Login',
          confirmButtonColor: '#ff69b4'
        }).then(() => {
          navigate('/login');
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
    <div className="cadastro-container">
      <Box className="cadastro-wrapper">
        <Box className="cadastro-header">
          <Typography level="h1" className="cadastro-title">
            Criar<span className="title-highlight">Conta</span>
          </Typography>
          <Typography level="body-lg" className="cadastro-subtitle">
            Junte-se à família Doce Dondocas
          </Typography>
        </Box>

        <Box className="cadastro-form-container">
          <form onSubmit={handleSubmit} className="cadastro-form">
            <input type="hidden" name="id" value={formData.id} />
            
            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                CPF *
              </Typography>
              <Input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="Digite seu CPF"
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

            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                Nome Completo *
              </Typography>
              <Input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Digite seu nome completo"
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

            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                Email *
              </Typography>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Digite seu email"
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

            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                Senha *
              </Typography>
              <Input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                placeholder="Digite sua senha (mín. 6 caracteres)"
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
              className="cadastro-button"
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
              {loading ? 'Criando conta...' : 'Finalizar Cadastro'}
            </Button>
          </form>

          <Box className="cadastro-links">
            <Typography level="body-sm" className="login-text">
              Já tem uma conta?{' '}
              <Link to="/login" className="login-link">
                Faça login aqui
              </Link>
            </Typography>
          </Box>
        </Box>

        <Box className="cadastro-footer">
          <Link to="/" className="back-home-link">
            ← Voltar para a página inicial
          </Link>
        </Box>
      </Box>
    </div>
  );
};

export default Cadastro;

