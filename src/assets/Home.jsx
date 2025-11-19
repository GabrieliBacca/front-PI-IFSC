import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/joy';
import { Carousel, Badge } from 'antd';
import Swal from 'sweetalert2';
import './home.css';
import { Link } from 'react-router-dom';

// imports do carrossel
// import carouselImage1 from '../assets/carousel_images/clothing_store_carousel_1.png';
// import carouselImage2 from '../assets/carousel_images/clothing_store_carousel_2.png';
// import carouselImage3 from '../assets/carousel_images/clothing_store_carousel_3.png';


const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleContato = () => {
    Swal.fire({
      title: "Informações de Contato",
      html: `
      <div class="contato-popup">
        <strong>Empresa Desenvolvedora:</strong> IFSC - GLG<br />
        <strong>Ano:</strong> 2025<br />
        <strong>Telefone:</strong> (47) 99995-5555<br />
        <strong>Email:</strong> suporte@ifscglg.com<br />
        <strong>Versão do Sistema:</strong> 1.0.0<br />
      </div>
    `,
      confirmButtonText: "Fechar",
      width: 420,
      background: "rgba(255, 255, 255, 0.95)",
      backdrop: "rgba(255, 105, 180, 0.25)",
    });
  };

  const handlePromoClick = () => {
    Swal.fire({
      title: "Promoções",
      text: "Confira nossas ofertas especiais!",
      icon: "info"
    });
  };

  const handleCategoryClick = (category) => {
    Swal.fire({
      title: category,
      text: `Você clicou em ${category}`,
      icon: "info"
    });
  };

  const categories = [
    { name: 'Fornecedores', icon: '📦', color: '#e91e63' }, 
    { name: 'Clientes', icon: '👥', color: '#3f51b5' }, 
    { name: 'Devedores', icon: '💸', color: '#2196f3' } 
  ];

  const products = [
    {
      title: "Estoque",
      description: "Gerencie o inventário de produtos",
      color: "#ff69b4",
      icon: "📦"
    },
    {
      title: "Relatórios",
      description: "Visualize dados e métricas de gestão",
      color: "#9c27b0",
      icon: "📈"
    },
    {
      title: "Financeiro",
      description: "Controle de contas a pagar e receber",
      color: "#e91e63",
      icon: "💰"
    },
    {
      title: "Funcionários",
      description: "Controle sua equipe de trabalho",
      color: "#673ab7",
      icon: "👥"
    }
  ];

  // Novo componente de destaque para o Dashboard
  const DashboardHighlight = () => (
    <Box className="dashboard-highlight">
      <Box className="highlight-content">
        <Typography level="h2" className="highlight-title">
          Bem-vinda, Administradora!
        </Typography>
        <Typography level="h3" className="highlight-subtitle">
          Sistema de Gestão e Controle de Estoque DoceDondocas
        </Typography>
        <Typography className="highlight-description">
          Acesse rapidamente as principais seções do seu negócio. O controle total está em suas mãos.
        </Typography>
        <Link to="/cadastro-produto" style={{ textDecoration: 'none' }}>
          <Button 
            variant="solid" 
            className="highlight-btn"
          >
            Cadastrar Novo Produto
          </Button>
        </Link>
      </Box>
      <Box className="highlight-icon">
        <Typography level="h1" className="icon-emoji">
          📊
        </Typography>
      </Box>
    </Box>
  );

  return (
    <div className="home-container">
      {/* Header */}
      <Box className="header">
        <Typography level="h1" className="logo">
          Doce<span className="logo-bold">Dondocas</span>
        </Typography>
        <Box className="search-container">
          <div className="store-slogan">
            Sistema de Gestão e Controle de Estoque
          </div>
        </Box>

        <Box className="header-actions">
          <Button
            onClick={handleContato} 
            variant="solid" 
            className="cart-btn"
            title="Informações de contato"
          >
            📞 Contato
          </Button>
          
          {!isLoggedIn ? (
            <Link to="/login">
              <Button variant="outlined" className="menu-btn">
                🔐 Entrar
              </Button>
            </Link>
          ) : (
            <>
              <Button 
                variant="solid" 
                className="cart-btn"
                title="Acesse sua conta"
              >
                👤 Minha Conta
              </Button>
              <Button 
                variant="outlined" 
                className="menu-btn"
                onClick={() => setIsLoggedIn(false)}
              >
                🚪 Sair
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Navigation */}
      <Box className="navigation">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="solid" className="nav-btn">🏠 Dashboard</Button>
        </Link>
        <Link to="/cadastro-produto" style={{ textDecoration: 'none' }}>
          <Button variant="plain" className="nav-link">📦 Cadastro de Produtos</Button>
        </Link>
        <Button variant="plain" className="nav-link">👔 Cadastro Funcionários</Button>
        <Link to="/cadastro-cliente" style={{ textDecoration: 'none' }}>
          <Button variant="plain" className="nav-link">👥 Cadastro de Clientes</Button>
        </Link>
      </Box>

      {/* Dashboard Highlight (Substitui o Carrossel) */}
      <DashboardHighlight />

      {/* Categories Grid */}
      <Box className="categories-section">
        <Typography level="h2" className="section-title">
          Gestão de Entidades
        </Typography>
        <Grid container spacing={2} className="categories-grid">
          {categories.map((category, index) => (
            <Grid xs={12} sm={6} md={4} key={index}>
              <Card
                className="category-card"
                onClick={() => handleCategoryClick(category.name)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              >
                <CardContent className="category-content">
                  <Typography level="h2" className="category-icon">
                    {category.icon}
                  </Typography>
                  <Typography level="body-sm" className="category-name">
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Products Section (Renomeada para Seções de Gestão) */}
      <Box className="products-section">
        <Typography level="h2" className="section-title products-title">
          Acesso Rápido
        </Typography>
        <Grid container spacing={3} className="products-grid">
          {products.map((product, index) => (
            <Grid xs={12} sm={6} md={3} key={index}>
              <Card
                className="product-card"
                sx={{
                  background: `linear-gradient(135deg, ${product.color}, ${product.color}99)`,
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}
                onClick={() => handleCategoryClick(product.title)}
              >
                <CardContent className="product-content">
                  <Typography level="h2" className="product-icon">
                    {product.icon}
                  </Typography>
                  <Typography level="h3" className="product-title">
                    {product.title}
                  </Typography>
                  <Typography className="product-description">
                    {product.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer Info */}
      <Box className="footer-container">

        <Box className="footer-grid">

          <Box className="footer-col">
            <h3>DoceDondocas</h3>
            <p>Sistema de Gestão e Controle de Estoque. Ferramenta exclusiva para administração.</p>
            <div className="footer-social">
              <span title="Facebook">f</span>
              <span title="Instagram">📷</span>
              <span title="Twitter">𝕏</span>
            </div>
          </Box>

          <Box className="footer-col">
            <h4>Links Rápidos</h4>
            <ul>
              <li><Link to="/">🏠 Dashboard</Link></li>
              <li><Link to="/cadastro-produto">📦 Cadastro de Produtos</Link></li>
              <li><Link to="/cadastro-cliente">👥 Cadastro de Clientes</Link></li>
              <li><a onClick={handleContato} style={{ cursor: "pointer" }}>📞 Contato</a></li>
            </ul>
          </Box>

          <Box className="footer-col">
            <h4>Atendimento</h4>
            <p>📞 <strong>(47) 99995-5555</strong></p>
            <p>📧 <strong>suporte@ifscglg.com</strong></p>
            <p>⏰ <strong>Seg a Sex – 08h às 18h</strong></p>
          </Box>

          <Box className="footer-col">
            <h4>Sobre</h4>
            <p><strong>Empresa:</strong> IFSC - GLG</p>
            <p><strong>Versão:</strong> 1.0.0</p>
            <p><strong>Ano:</strong> 2025</p>
          </Box>

        </Box>

        <div className="footer-bottom">
          © {new Date().getFullYear()} DoceDondocas — Desenvolvido por IFSC-GLG. Todos os direitos reservados.
        </div>
      </Box>
    </div>
  );
};

export default Home;
