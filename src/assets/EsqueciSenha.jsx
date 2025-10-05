import React, { useState } from 'react';
import { Box, Typography, Button, Input, Alert } from '@mui/joy';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { usuarioService } from '../services/api';
import './EsqueciSenha.css';

const EsqueciSenha = () => {
  const [cpf, setCpf] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCpf(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    setSucesso('');

    if (!cpf.trim()) {
      setErro('Por favor, digite seu CPF.');
      setLoading(false);
      return;
    }

    try {
      const result = await usuarioService.recuperarSenha(cpf);
      
      if (result.success) {
        setSucesso('Nova senha enviada para seu email cadastrado!');
        
        Swal.fire({
          title: 'Email Enviado!',
          text: 'Verifique sua caixa de entrada. Uma nova senha foi enviada para seu email.',
          icon: 'success',
          confirmButtonText: 'Ir para Login',
          confirmButtonColor: '#ff69b4'
        }).then(() => {
          navigate('/login');
        });
      } else {
        setErro(result.message);
        Swal.fire({
          title: 'Erro',
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
    <div className="esqueci-senha-container">
      <Box className="esqueci-senha-wrapper">
        <Box className="esqueci-senha-header">
          <Typography level="h1" className="esqueci-senha-title">
            Recuperar<span className="title-highlight">Senha</span>
          </Typography>
          <Typography level="body-lg" className="esqueci-senha-subtitle">
            Digite seu CPF para receber uma nova senha por email
          </Typography>
        </Box>

        <Box className="esqueci-senha-form-container">
          <form onSubmit={handleSubmit} className="esqueci-senha-form">
            <Box className="form-group">
              <Typography level="body-sm" className="form-label">
                CPF
              </Typography>
              <Input
                type="text"
                name="cpf"
                value={cpf}
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

            {sucesso && (
              <Alert color="success" className="success-alert">
                {sucesso}
              </Alert>
            )}

            {erro && (
              <Alert color="danger" className="error-alert">
                {erro}
              </Alert>
            )}

            <Button
              type="submit"
              loading={loading}
              className="esqueci-senha-button"
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
              {loading ? 'Enviando...' : 'Enviar Nova Senha'}
            </Button>
          </form>

          <Box className="esqueci-senha-links">
            <Link to="/login" className="back-login-link">
              ← Voltar ao Login
            </Link>
            
            <Typography level="body-sm" className="signup-text">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="signup-link">
                Cadastre-se aqui
              </Link>
            </Typography>
          </Box>
        </Box>

        <Box className="esqueci-senha-footer">
          <Link to="/" className="back-home-link">
            ← Voltar para a página inicial
          </Link>
        </Box>
      </Box>
    </div>
  );
};

export default EsqueciSenha;

