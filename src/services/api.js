import axios from 'axios';

// Configuração base da API
const API_BASE_URL = 'http://localhost:8080'; // Ajuste para a porta do seu backend Spring Boot

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir cookies automaticamente
api.interceptors.request.use(
  (config) => {
    // Incluir cookies nas requisições
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Erro na API:', error);
    return Promise.reject(error);
  }
);

// Serviços de usuário
export const usuarioService = {
  // Login do usuário
  login: async (cpf, senha) => {
    try {
      const formData = new FormData();
      formData.append('cpf', cpf);
      formData.append('senha', senha);

      const response = await api.post('/usuario/logar', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return {
        success: true,
        data: response.data,
        message: 'Login realizado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'CPF ou senha incorretos.'
      };
    }
  },

  // Cadastro de usuário
  cadastro: async (dadosUsuario) => {
    try {
      const formData = new FormData();
      formData.append('id', dadosUsuario.id || 0);
      formData.append('cpf', dadosUsuario.cpf);
      formData.append('nome', dadosUsuario.nome);
      formData.append('email', dadosUsuario.email);
      formData.append('senha', dadosUsuario.senha);

      const response = await api.post('/usuario/cadastro', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return {
        success: true,
        data: response.data,
        message: 'Cadastro realizado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.'
      };
    }
  },

  // Recuperação de senha
  recuperarSenha: async (cpf) => {
    try {
      const formData = new FormData();
      formData.append('cpf', cpf);

      const response = await api.post('/usuario/recuperar-senha', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return {
        success: true,
        data: response.data,
        message: 'Nova senha enviada para seu email!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'CPF não encontrado ou erro no servidor.'
      };
    }
  },

  // Listar usuários (protegida)
  listarUsuarios: async () => {
    try {
      const response = await api.get('/usuario/lista');
      return {
        success: true,
        data: response.data,
        message: 'Usuários carregados com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar usuários. Faça login novamente.'
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/usuario/sair');
      return {
        success: true,
        message: 'Logout realizado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao fazer logout.'
      };
    }
  }
};

export default api;

