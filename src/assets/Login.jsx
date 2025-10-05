import React, { useState } from 'react';
import { Box, Typography, Button, Input, Alert } from '@mui/joy';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { usuarioService } from '../services/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    cpf: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const result = await usuarioService.login(formData.cpf, formData.senha);
      
      if (result.success) {
        Swal.fire({
          title: 'Login realizado!',
          text: 'Bem-vindo ao sistema!',
          icon: 'success',
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#ff69b4'
        }).then(() => {
          navigate('/');
        });
      } else {
        setErro(result.message);
        Swal.fire({
          title: 'Erro no Login',
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
    <div className="login-container">
      <Box className="login-wrapper">
        <Box className="login-header">
          <Typography level="h1" className="login-title">
            Doce<span className="title-highlight">Dondocas</span>
          </Typography>
          <Typography level="body-lg" className="login-subtitle">
            Faça login para acessar sua conta
          </Typography>
        </Box>

        <Box className="login-form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                CPF
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
                Senha
              </Typography>
              <Input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                placeholder="Digite sua senha"
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
              className="login-button"
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
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <Box className="login-links">
            <Link to="/esqueci-senha" className="forgot-password-link">
              Esqueci minha senha
            </Link>
            
            <Typography level="body-sm" className="signup-text">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="signup-link">
                Cadastre-se aqui
              </Link>
            </Typography>
          </Box>
        </Box>

        <Box className="login-footer">
          <Link to="/" className="back-home-link">
            ← Voltar para a página inicial
          </Link>
        </Box>
      </Box>
    </div>
  );
};

export default Login;

