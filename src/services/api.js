import axios from 'axios';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

// Interceptor para incluir o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;

    const token = getAuthToken();
    if (token && config.url !== '/usuario/logar') {
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
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      removeAuthToken();
    }
    return Promise.reject(error);
  }
);

// ============================================
// SERVIÇOS DE USUÁRIO
// ============================================
export const usuarioService = {
  login: async (cpf, senha) => {
    try {
      const response = await api.post('/usuario/logar', { cpf, senha });
      const token = response.data;
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

  cadastro: async (dadosUsuario) => {
    try {
    const response = await api.post('/usuario', dadosUsuario);
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

  logout: async () => {
    try {
<<<<<<< Updated upstream
      removeAuthToken();  // Remove o token do frontend
      // como mo back não tem um endpoint de logout que invalide o token no servidor, apenas remove o cookie
      // Se houver um endpoint de logout no backend que invalide o token, ele vai ser chamado aqui
     // await api.post('/usuario/logout'); // Chama o endpoint de logout no backend
=======
      removeAuthToken();
>>>>>>> Stashed changes
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

// ============================================
// SERVIÇOS DE CLIENTE
// ============================================
export const clienteService = {
  listar: async () => {
    try {
      const response = await api.get('/cliente');
      return {
        success: true,
        data: response.data,
        message: 'Clientes carregados com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar clientes.'
      };
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/cliente/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Cliente carregado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar cliente.'
      };
    }
  },

  cadastro: async (clienteData) => {
    try {
      const response = await api.post('/cliente', clienteData);
      return {
        success: true,
        data: response.data,
        message: 'Cliente cadastrado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao cadastrar cliente.'
      };
    }
  },

<<<<<<< Updated upstream
    // Simulação de sucesso (manter para teste)
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (clienteData.cpf === '11111111111') {
        return { success: false, message: 'CPF de cliente já cadastrado.' };
=======
  editar: async (clienteData) => {
    try {
      const response = await api.put('/cliente', clienteData);
      return {
        success: true,
        data: response.data,
        message: 'Cliente atualizado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar cliente.'
      };
    }
  },

  deletar: async (id) => {
    try {
      const response = await api.delete(`/cliente/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Cliente deletado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao deletar cliente.'
      };
>>>>>>> Stashed changes
    }
  }
<<<<<<< Updated upstream
};
=======
};

// ============================================
// SERVIÇOS DE PRODUTO
// ============================================
export const produtoService = {
  listar: async () => {
    try {
      const response = await api.get('/produto');
      return {
        success: true,
        data: response.data,
        message: 'Produtos carregados com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar produtos.'
      };
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/produto/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Produto carregado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar produto.'
      };
    }
  },

  cadastrar: async (produtoData) => {
    try {
      const response = await api.post('/produto', produtoData);
      return {
        success: true,
        data: response.data,
        message: 'Produto cadastrado com sucesso!'
      };
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao cadastrar produto.'
      };
    }
  },

  editar: async (produtoData) => {
    try {
      const response = await api.put('/produto', produtoData);
      return {
        success: true,
        data: response.data,
        message: 'Produto atualizado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar produto.'
      };
    }
  },

  deletar: async (id) => {
    try {
      const response = await api.delete(`/produto/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Produto deletado com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao deletar produto.'
      };
    }
  },

  listarCategorias: async () => {
    try {
      const response = await api.get('/produto/categoria');
      return {
        success: true,
        data: response.data,
        message: 'Categorias carregadas com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar categorias.'
      };
    }
  },

  cadastrarCategoria: async (nomeCategoria) => {
    try {
      const response = await api.post('/produto/categoria', {
        categoria: nomeCategoria
      });
      return {
        success: true,
        data: response.data,
        message: 'Categoria cadastrada com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao cadastrar categoria.'
      };
    }
  },

  listarMarcas: async () => {
    try {
      const response = await api.get('/produto/marca');
      return {
        success: true,
        data: response.data,
        message: 'Marcas carregadas com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar marcas.'
      };
    }
  },

  cadastrarMarca: async (nomeMarca) => {
    try {
      const response = await api.post('/produto/marca', {
        marca: nomeMarca
      });
      return {
        success: true,
        data: response.data,
        message: 'Marca cadastrada com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao cadastrar marca.'
      };
    }
  }
};

export default api;
>>>>>>> Stashed changes
