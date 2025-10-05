# Doce Dondocas - Frontend

Este é o projeto frontend para a aplicação Doce Dondocas, desenvolvido em React com Vite.

## 🚀 Tecnologias Utilizadas

-   **React:** Biblioteca JavaScript para construção de interfaces de usuário.
-   **Vite:** Ferramenta de build rápido para projetos web.
-   **MUI Joy:** Biblioteca de componentes React para um design elegante e acessível.
-   **Ant Design:** Biblioteca de componentes React para interfaces de usuário empresariais.
-   **Sweet Alert 2:** Biblioteca para alertas e pop-ups customizáveis.
-   **React Router DOM:** Para gerenciamento de rotas na aplicação.

## 📁 Estrutura do Projeto

```
front/
├── public/
├── src/
│   ├── assets/
│   │   └── carousel_images/  # Imagens para o carrossel
│   ├── components/
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Cadastro.jsx
│   │   ├── Cadastro.css
│   │   ├── EsqueciSenha.jsx
│   │   └── EsqueciSenha.css
│   ├── services/
│   │   └── api.js          # Serviço de integração com o backend
│   ├── App.jsx             # Componente principal e rotas
│   └── main.jsx            # Ponto de entrada da aplicação
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Como Configurar e Rodar o Projeto

### Pré-requisitos

-   Node.js (versão 14 ou superior)
-   npm 

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone 
    cd front
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

### Rodando o Frontend

Para iniciar o servidor de desenvolvimento do React:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173` (ou outra porta, se 5173 estiver em uso).

### Configuração do Backend (Necessário para integração)

Este frontend espera um backend rodando em `http://localhost:8080`. Certifique-se de que seu projeto Spring Boot esteja configurado para:

1.  **Rodar na porta 8080.**
2.  **Ter CORS (Cross-Origin Resource Sharing) habilitado** para permitir requisições do frontend (domínio `http://localhost:5173`). Um exemplo de configuração CORS no Spring Boot pode ser:

    ```java
    @Configuration
    public class CorsConfig implements WebMvcConfigurer {
        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173") // Ou o domínio do seu frontend
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        }
    }
    ```

## 🗺️ Rotas do Frontend

-   `/`: Página inicial (Home)
-   `/login`: Tela de Login
-   `/cadastro`: Tela de Cadastro de Usuário
-   `/esqueci-senha`: Tela de Recuperação de Senha

## 🔗 Endpoints do Backend Integrados

O serviço `src/services/api.js` está configurado para interagir com os seguintes endpoints do seu backend Spring Boot:

-   `POST /usuario/logar`: Para autenticação de usuário (Login).
-   `POST /usuario/cadastro`: Para registrar novos usuários (Cadastro).
-   `POST /usuario/recuperar-senha`: Para solicitar recuperação de senha.

## 🎨 Estilo e Customização


-   **Cores:** Predominância de tons de rosa (`#ff69b4`, `#fce4ec`, etc.).
-   **Componentes:** Utilização de MUI Joy e Ant Design com temas personalizados para se adequarem à paleta de cores.
-   **Sweet Alert:** Pop-ups customizados para seguir o tema rosa.
-   **Responsividade:** O layout se adapta a diferentes tamanhos de tela (desktop, tablet, mobile).

Para alterar o estilo, você pode modificar os arquivos `.css` correspondentes a cada componente (ex: `Home.css`, `Login.css`) ou ajustar as propriedades `sx` diretamente nos componentes MUI Joy. A configuração do tema Ant Design pode ser alterada em `App.jsx`.

---

**Doce Dondocas - Backend**

Este é o projeto backend para a aplicação Doce Dondocas, desenvolvido em Spring Boot. Ele fornece a API para gerenciar usuários, incluindo autenticação, cadastro e recuperação de senha.

## 🚀 Tecnologias Utilizadas

-   **Spring Boot:** Framework para construção de aplicações Java robustas.
-   **Spring Security:** Para autenticação e autorização.
-   **Spring Data JPA:** Para persistência de dados.
-   **Thymeleaf:** Motor de template (utilizado nos templates HTML originais, mas o frontend React consome a API diretamente).
-   **H2 Database:** Banco de dados em memória (pode ser configurado para outros bancos).
-   **JavaMailSender:** Para envio de e-mails (recuperação de senha).

## 📁 Estrutura do Projeto

```
gerenciamento-doce-dondocas/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── br/com/ifsc/docedondocas/gerenciamentodocedondocas/
│   │   │       ├── Config/             # Configurações de segurança e dados
│   │   │       ├── controller/         # Controladores REST (UsuarioController)
│   │   │       ├── model/              # Modelos de dados (Usuario, UsuarioRole)
│   │   │       ├── repository/         # Repositórios JPA
│   │   │       └── service/            # Serviços (EmailService, TokenService, etc.)
│   │   └── resources/
│   │       ├── application.properties  # Configurações da aplicação
│   │       └── templates/              # Templates HTML (agora substituídos pelo frontend React)
├── pom.xml                             # Dependências Maven
└── ...
```

## ⚙️ Como Configurar e Rodar o Projeto

### Pré-requisitos

-   Java Development Kit (JDK) 17 ou superior
-   Maven

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone 
    cd gerenciamento-doce-dondocas
    ```

2.  **Construa o projeto com Maven:**
    ```bash
    mvn clean install
    ```

### Rodando o Backend

Para iniciar a aplicação Spring Boot:

```bash
mvn spring-boot:run
```

O backend estará disponível em `http://localhost:8080`.

### Configuração de CORS

Conforme mencionado na seção do Frontend, é crucial que o backend tenha a configuração de CORS habilitada para permitir requisições do seu frontend. Verifique o arquivo `CorsConfig.java` (ou similar) no seu projeto para garantir que `http://localhost:5173` (ou o domínio do seu frontend) esteja permitido.

## 🔗 Endpoints da API

Os principais endpoints expostos pelo `UsuarioController` são:

-   `POST /usuario/logar`: Autentica um usuário com CPF e senha.
    -   **Parâmetros:** `cpf` (String), `senha` (String)
    -   **Formato:** `application/x-www-form-urlencoded`
-   `POST /usuario/cadastro`: Registra um novo usuário.
    -   **Parâmetros:** `id` (Long, opcional), `cpf` (String), `nome` (String), `email` (String), `senha` (String)
    -   **Formato:** `application/x-www-form-urlencoded`
-   `POST /usuario/recuperar-senha`: Envia uma nova senha para o e-mail cadastrado do usuário.
    -   **Parâmetros:** `cpf` (String)
    -   **Formato:** `application/x-www-form-urlencoded`
-   `GET /usuario/lista`: Lista todos os usuários (requer autenticação).

---
