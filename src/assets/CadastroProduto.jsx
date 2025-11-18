import React, { useState } from 'react';
import { Box, Typography, Button, Input, Alert } from '@mui/joy';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './CadastroProduto.css';
import { produtoService } from '../services/api';

const CadastroProduto = () => {
    const [formData, setFormData] = useState({
        titulo: '',
        valor: '',
        categoria: '', // Agora é string simples
        marca: '' // Agora é string simples
    });
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.titulo || !formData.valor || !formData.categoria || !formData.marca) {
            setErro('Todos os campos são obrigatórios.');
            return false;
        }

        // Validação de valor
        const valorNumerico = parseFloat(formData.valor.replace(',', '.').replace('R$', '').trim());
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            setErro('Por favor, insira um valor válido maior que zero.');
            return false;
        }

        if (formData.titulo.trim().length < 2) {
            setErro('O título deve ter pelo menos 2 caracteres.');
            return false;
        }

        if (formData.categoria.trim().length < 2) {
            setErro('A categoria deve ter pelo menos 2 caracteres.');
            return false;
        }

        if (formData.marca.trim().length < 2) {
            setErro('A marca deve ter pelo menos 2 caracteres.');
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
            // Preparar dados para enviar ao backend
            const produtoData = {
                titulo: formData.titulo.trim(),
                valor: parseFloat(formData.valor.replace(',', '.').replace('R$', '').trim()),
                categoria: formData.categoria.trim(), // String simples
                marca: formData.marca.trim() // String simples
            };

            console.log('Enviando dados do produto:', produtoData);

            // Primeiro, cadastrar a categoria se não existir
            const responseCategoria = await produtoService.cadastrarCategoria(produtoData.categoria);
            if (!responseCategoria.success) {
                setErro('Erro ao cadastrar categoria: ' + responseCategoria.message);
                return;
            }

            // Depois, cadastrar a marca se não existir
            const responseMarca = await produtoService.cadastrarMarca(produtoData.marca);
            if (!responseMarca.success) {
                setErro('Erro ao cadastrar marca: ' + responseMarca.message);
                return;
            }

            // Agora cadastrar o produto com os IDs das entidades criadas
            const produtoCompleto = {
                titulo: produtoData.titulo,
                valor: produtoData.valor,
                categoria: { id: responseCategoria.data.id },
                marca: { id: responseMarca.data.id }
            };

            const response = await produtoService.cadastrar(produtoCompleto);

            if (response.success) {
                Swal.fire({
                    title: 'Produto cadastrado!',
                    text: 'Produto cadastrado com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ff69b4'
                }).then(() => {
                    // Limpar formulário
                    setFormData({
                        titulo: '',
                        valor: '',
                        categoria: '',
                        marca: ''
                    });
                });
            } else {
                setErro(response.message);
                Swal.fire({
                    title: 'Erro no Cadastro',
                    text: response.message,
                    icon: 'error',
                    confirmButtonText: 'Tentar novamente',
                    confirmButtonColor: '#ff69b4'
                });
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro de conexão com o servidor.';
            setErro(errorMessage);
            Swal.fire({
                title: 'Erro de Conexão',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Tentar novamente',
                confirmButtonColor: '#ff69b4'
            });
        } finally {
            setLoading(false);
        }
    };

    // Função para formatar o valor em real
    const formatarValor = (valor) => {
        // Remove caracteres não numéricos
        const apenasNumeros = valor.replace(/\D/g, '');

        // Converte para número e formata como moeda
        if (apenasNumeros) {
            const numero = parseInt(apenasNumeros) / 100;
            return numero.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        return '';
    };

    const handleValorChange = (e) => {
        const { value } = e.target;
        const valorSemPrefix = value.replace('R$ ', '');
        const valorFormatado = formatarValor(valorSemPrefix);
        setFormData(prev => ({
            ...prev,
            valor: valorFormatado
        }));
    };

    return (
        <div className="cadastro-produto-container">
            <Box className="cadastro-produto-wrapper">
                <Box className="cadastro-produto-header">
                    <Typography level="h1" className="cadastro-produto-title">
                        Cadastro de <span className="title-highlight">Produto</span>
                    </Typography>
                    <Typography level="body-lg" className="cadastro-produto-subtitle">
                        Preencha os dados do produto
                    </Typography>
                </Box>

                <Box className="cadastro-produto-form-container">
                    <form onSubmit={handleSubmit} className="cadastro-produto-form">

                        {/* Título */}
                        <Box className="form-group">
                            <Typography level="body-sm" className="form-label">
                                Título do Produto *
                            </Typography>
                            <Input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleInputChange}
                                placeholder="Digite o título do produto"
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

                        {/* Valor */}
                        <Box className="form-group">
                            <Typography level="body-sm" className="form-label">
                                Valor *
                            </Typography>
                            <Input
                                type="text"
                                name="valor"
                                value={formData.valor ? `R$ ${formData.valor}` : ''}
                                onChange={handleValorChange}
                                placeholder="Ex: 99,90"
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

                        {/* Categoria como input livre */}
                        <Box className="form-group">
                            <Typography level="body-sm" className="form-label">
                                Categoria *
                            </Typography>
                            <Input
                                type="text"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleInputChange}
                                placeholder="Digite a categoria (ex: Vestidos, Blusas, Calças)"
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

                        {/* Marca como input livre */}
                        <Box className="form-group">
                            <Typography level="body-sm" className="form-label">
                                Marca *
                            </Typography>
                            <Input
                                type="text"
                                name="marca"
                                value={formData.marca}
                                onChange={handleInputChange}
                                placeholder="Digite a marca do produto"
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
                            className="cadastro-produto-button"
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
                            {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
                        </Button>
                    </form>
                </Box>

                <Box className="cadastro-produto-footer">
                    <Link to="/" className="back-home-link">
                        ← Voltar para a página inicial
                    </Link>
                </Box>
            </Box>
        </div>
    );
};

export default CadastroProduto;