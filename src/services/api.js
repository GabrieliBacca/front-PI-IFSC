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

// Variável para armazenar o token JWT
let authToken = null;

// Função para definir o token
export const setAuthToken = (token) => {
  authToken = token;
  // Opcional: Salvar o token no localStorage para persistência entre sessões
  localStorage.setItem('authToken', token);
};

// Função para obter o token
export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
};

// Função para remover o token
export const removeAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

// Interceptor para incluir o token JWT em todas as requisições (exceto login)
api.interceptors.request.use(
  (config) => {
    // Incluir cookies nas requisições
    config.withCredentials = true;

    const token = getAuthToken();
    if (token && config.url !== '/usuario/logar') { // Não enviar token para a rota de login
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    // Se for um erro de autenticação (401 ou 403), remover o token
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      removeAuthToken();
      // Opcional: Redirecionar para a página de login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de usuário
export const usuarioService = {
  // Login do usuário
  login: async (cpf, senha) => {
    try {
      const response = await api.post('/usuario/logar', { cpf, senha });
      const token = response.data; // O backend retorna o token diretamente
      setAuthToken(token);
      return {
        success: true,
        data: { token },
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
      const response = await api.post('/usuario/cadastro', dadosUsuario); // Envia JSON
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
      // O backend espera application/x-www-form-urlencoded para recuperar-senha
      const formData = new URLSearchParams();
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

  // Listar todos os usuários
  listarUsuarios: async () => {
    try {
      const response = await api.post('/usuario/usuarios'); // Backend usa POST para listar
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

  // Obter usuário por ID
  getUsuarioById: async (id) => {
    try {
      const response = await api.post(`/usuario/usuarios/${id}`); // Backend usa POST para buscar por ID
      return {
        success: true,
        data: response.data,
        message: 'Usuário carregado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar usuário. Faça login novamente.'
      };
    }
  },

  // Editar usuário
  editarUsuario: async (dadosUsuario) => {
    try {
      const response = await api.post('/usuario/editar', dadosUsuario); // Backend usa POST para editar
      return {
        success: true,
        data: response.data,
        message: 'Usuário atualizado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar usuário. Verifique os dados.'
      };
    }
  },

  // Deletar usuário
  deletarUsuario: async (id) => {
    try {
      const response = await api.post(`/usuario/delete/${id}`); // Backend usa POST para deletar
      return {
        success: true,
        data: response.data,
        message: 'Usuário deletado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao deletar usuário.'
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      removeAuthToken();  // Remove o token do frontend
      // como mo back não tem um endpoint de logout que invalide o token no servidor, apenas remove o cookie
      // Se houver um endpoint de logout no backend que invalide o token, ele vai ser chamado aqui
     // await api.post('/usuario/logout'); // Chama o endpoint de logout no backend
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

