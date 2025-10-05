import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/joy';
import { Carousel, Badge } from 'antd';
import Swal from 'sweetalert2';
import './Home.css';
import carouselImage1 from '../assets/carousel_images/clothing_store_carousel_1.png';
import carouselImage2 from '../assets/carousel_images/clothing_store_carousel_2.png';
import carouselImage3 from '../assets/carousel_images/clothing_store_carousel_3.png';


const Home = () => {
  const handlePromoClick = () => {
    Swal.fire({
      
    });
  };

  const handleCategoryClick = (category) => {
    Swal.fire({
      
    });
  };

//   const carouselItems = [
//   {
//     id: 1,
//     title: "Elegância em Rosa",
//     subtitle: "Descubra a delicadeza da nossa coleção",
//     description: "Moda que abraça sua feminilidade",
//     image: carouselImage1
//   },
//   {
//     id: 2,
//     title: "Viva a Tendência Rosa",
//     subtitle: "Peças que realçam sua beleza natural",
//     description: "Conforto e estilo para todos os momentos",
//     image: carouselImage2
//   },
//   {
//     id: 3,
//     title: "Detalhes que Encantam",
//     subtitle: "A qualidade que você merece em tons de rosa",
//     description: "Toque suave e acabamento impecável",
//     image: carouselImage3
//   }
// ];


  const categories = [
    { name: 'Cupons', icon: '🎫', color: '#ff69b4' },
    { name: 'Futuras Promoções', icon: '🏷️', color: '#9c27b0' },
    { name: 'Fornecedores', icon: '🧳', color: '#e91e63' },
    { name: 'Acessórios', icon: '💎', color: '#673ab7' },
    { name: 'Clientes', icon: '⭐', color: '#3f51b5' },
    { name: 'Devedores', icon: '❓', color: '#2196f3' }
  ];

  const products = [
    {
      title: "Imagem!",
      description: "Vendas",
      color: "#ff69b4"
    },
    {
      title: "Imagem!",
      description: "Lucros",
      color: "#9c27b0"
    },
    {
      title: "Imagem!",
      description: "Clientes VIP  ",
      color: "#e91e63"
    },
    {
      title: "Imagem!",
      description: "Funcionarios",
      color: "#673ab7"
    }
  ];

  return (
    <div className="home-container">
      {/* Header */}
      <Box className="header">
        <Typography level="h1" className="logo">
          Doce<span className="logo-bold">Dondoca</span>
        </Typography>
        <Box className="search-container">
          <input 
            type="text" 
            placeholder="O que você está buscando?" 
            className="search-input"
          />
        </Box>
        <Box className="header-actions">
          <Button variant="outlined" className="track-order-btn">
            Filtro
          </Button>
          <Button variant="solid" className="cart-btn">
            Inicio
          </Button>
          <Button variant="outlined" className="track-order-btn">
            Contato
          </Button>
          <Button variant="solid" className="cart-btn">
            Minha Conta
          </Button>
              <Button variant="outlined" className="track-order-btn">
            Sair
          </Button>
        </Box>
      </Box>

      {/* Navigation */}
      <Box className="navigation">
        <Button variant="outlined" className="nav-btn">Página Principal</Button>
        <Button variant="plain" className="nav-link">Cadastro de Produtos</Button>
        <Button variant="plain" className="nav-link">Lista Produtos</Button>
        <Button variant="plain" className="nav-link">Cadastro Funcionarios</Button>
        <Button variant="plain" className="nav-link">Lista Funcionarios</Button>
        <Button variant="plain" className="nav-link">Lista Clientes</Button>
        <Button variant="plain" className="nav-link">Hist´rico de Compras</Button>
        <Button variant="plain" className="nav-link">Carrinho</Button>
        <Button variant="plain" className="nav-link">Lista Favoritos</Button>
        <Badge count="Novo" className="offers-badge">
          <Button variant="solid" className="offers-btn">Ofertas do Dia</Button>
        </Badge>
      </Box>


      {/* Main Carousel 
      <Box className="main-carousel">
        <Carousel autoplay dots={{ className: 'custom-dots' }}>
          {carouselItems.map((item) => (
            <div key={item.id} className="carousel-slide">
              <Box className="slide-content">
                <Box className="slide-text">
                  <Typography level="h2" className="slide-title">
                    {item.title}
                  </Typography>
                  <Typography level="h3" className="slide-subtitle">
                    {item.subtitle}
                  </Typography>
                  <Typography className="slide-description">
                    {item.description}
                  </Typography>
                  <Button 
                    variant="solid" 
                    className="slide-btn"
                    onClick={handlePromoClick}
                  >
                    Ver Ofertas
                  </Button>
                </Box>
               <Box className="slide-image">
  <img src={item.image} alt={item.title} className="carousel-image" /> 
</Box>
              </Box>
            </div>
          ))}
        </Carousel>
      </Box> */}

      {/* Categories Grid */}
      <Box className="categories-section">
        <Grid container spacing={2} className="categories-grid">
          {categories.map((category, index) => (
            <Grid xs={12} sm={6} md={2} key={index}>
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

      {/* Products Section */}
      <Box className="products-section">
        <Typography level="h2" className="section-title">
          OUTRA SESSÃO
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
      <Box className="footer-info">
        <Typography level="h3" className="brand-tagline">
          Footer da doce dondoca
        </Typography>
      </Box>
    </div>
  );
};

export default Home;

