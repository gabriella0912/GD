// Sistema de Carrinho e Filtros de Produtos
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    inicializarFiltros();
    atualizarContadorProdutos();
});

// Sistema de Filtros
function inicializarFiltros() {
    const filtroButtons = document.querySelectorAll('.filtro-btn');
    
    filtroButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active de todos os botões
            filtroButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona active ao botão clicado
            this.classList.add('active');
            
            // Aplica o filtro
            const tamanho = this.getAttribute('data-size');
            filtrarProdutos(tamanho);
        });
    });
}

function filtrarProdutos(tamanho) {
    const produtos = document.querySelectorAll('.produto-card');
    let produtosVisiveis = 0;
    
    produtos.forEach(produto => {
        if (tamanho === 'todos' || produto.getAttribute('data-size') === tamanho) {
            produto.style.display = 'block';
            
            // Animação de entrada
            produto.style.opacity = '0';
            produto.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                produto.style.transition = 'all 0.3s ease';
                produto.style.opacity = '1';
                produto.style.transform = 'translateY(0)';
            }, produtosVisiveis * 100);
            
            produtosVisiveis++;
        } else {
            produto.style.display = 'none';
        }
    });
    
    // Atualiza contador
    document.getElementById('produtos-count').textContent = produtosVisiveis;
}

function atualizarContadorProdutos() {
    const produtosVisiveis = document.querySelectorAll('.produto-card[style*="block"], .produto-card:not([style])').length;
    document.getElementById('produtos-count').textContent = produtosVisiveis || 4;
}

// Sistema de Carrinho
function adicionarAoCarrinho(tamanho, nome, preco) {
    const produto = {
        id: tamanho,
        nome: nome,
        preco: preco,
        tamanho: tamanho,
        quantidade: 1,
        timestamp: Date.now()
    };
    
    // Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item => item.id === produto.id);
    
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push(produto);
    }
    
    // Salva no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Mostra modal de confirmação
    mostrarModalConfirmacao(produto);
    
    // Adiciona animação ao botão
    const botaoClicado = event.target.closest('.btn-comprar');
    animarBotaoCompra(botaoClicado);
}

function animarBotaoCompra(botao) {
    botao.style.transform = 'scale(0.95)';
    botao.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    
    setTimeout(() => {
        botao.style.transform = 'scale(1)';
        botao.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Adicionado!
        `;
    }, 150);
    
    setTimeout(() => {
        botao.style.background = 'linear-gradient(135deg, #16e4b9, #66BB6A)';
        botao.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" fill="currentColor"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" fill="currentColor"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>
            Comprar
        `;
    }, 2000);
}

// Sistema de Modal
function mostrarModalConfirmacao(produto) {
    const modal = document.getElementById('modal-carrinho');
    const produtoInfo = document.getElementById('produto-info');
    
    produtoInfo.innerHTML = `
        <h4 style="color: #2c3e50; margin-bottom: 10px;">${produto.nome}</h4>
        <p style="color: #6c757d; margin-bottom: 8px;">Tamanho: ${produto.tamanho}</p>
        <p style="color: #16e4b9; font-weight: 700; font-size: 1.2rem;">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
    `;
    
    modal.classList.add('show');
    
    // Fecha modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            fecharModal();
        }
    });
}

function fecharModal() {
    const modal = document.getElementById('modal-carrinho');
    modal.classList.remove('show');
}

function irParaCarrinho() {
    // Aqui você pode implementar a navegação para a página do carrinho
    // Por exemplo: window.location.href = '/carrinho';
    
    // Para demonstração, vamos apenas mostrar um alert
    alert('Redirecionando para o carrinho...');
    console.log('Produtos no carrinho:', carrinho);
    
    fecharModal();
    
    // Exemplo de redirecionamento (descomente quando tiver a página do carrinho)
    // window.location.href = '/carrinho.html';
}

// Funções auxiliares
function obterCarrinho() {
    return carrinho;
}

function limparCarrinho() {
    carrinho = [];
    localStorage.removeItem('carrinho');
}

function removerDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarQuantidade(produtoId, novaQuantidade) {
    const produto = carrinho.find(item => item.id === produtoId);
    if (produto && novaQuantidade > 0) {
        produto.quantidade = novaQuantidade;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }
}

function calcularTotalCarrinho() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

// Event listeners para teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharModal();
    }
});

// Animações de scroll
function adicionarAnimacoesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observa todos os cards de produtos
    document.querySelectorAll('.produto-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// Inicializa animações após carregamento
window.addEventListener('load', function() {
    setTimeout(adicionarAnimacoesScroll, 300);
});

// Função para debug (pode remover em produção)
function debugCarrinho() {
    console.log('Carrinho atual:', carrinho);
    console.log('Total de itens:', carrinho.length);
    console.log('Valor total:', calcularTotalCarrinho().toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }));
}

document.getElementById('link-inicio').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'site.html#inicio';
});
document.getElementById('link-produtos').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'site.html#produtos';
});

document.getElementById('link-sobre').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'site.html#sobre';
});

document.getElementById('link-contato').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'site.html#contato';
});
