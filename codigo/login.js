// Sistema de Login Completo
class LoginSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkLoginStatus();
    }

    // Carrega usuários do localStorage
    loadUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Salva usuários no localStorage
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Carrega usuário atual do localStorage
    loadCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Salva usuário atual no localStorage
    saveCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    // Remove usuário atual do localStorage
    removeCurrentUser() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }

    // Vincula eventos aos elementos
    bindEvents() {
        // Elementos
        const loginBtn = document.getElementById('login-btn');
        const modal = document.getElementById('login-modal');
        const closeBtn = document.querySelector('.close-btn');
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const logoutBtn = document.getElementById('logout-btn');

        // Eventos
        loginBtn?.addEventListener('click', () => this.openModal());
        closeBtn?.addEventListener('click', () => this.closeModal());
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        showRegister?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        showLogin?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        registerForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        logoutBtn?.addEventListener('click', () => this.handleLogout());

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    // Verifica status do login ao carregar a página
    checkLoginStatus() {
        if (this.currentUser) {
            this.showLoggedArea();
        } else {
            this.showHomeSection();
        }
    }

    // Abre o modal
    openModal() {
        const modal = document.getElementById('login-modal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Fecha o modal
    closeModal() {
        const modal = document.getElementById('login-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetForms();
    }

    // Mostra formulário de registro
    showRegisterForm() {
        document.getElementById('login-form-container').classList.add('hidden');
        document.getElementById('register-form-container').classList.remove('hidden');
    }

    // Mostra formulário de login
    showLoginForm() {
        document.getElementById('register-form-container').classList.add('hidden');
        document.getElementById('login-form-container').classList.remove('hidden');
    }

    // Reset dos formulários
    resetForms() {
        document.getElementById('login-form').reset();
        document.getElementById('register-form').reset();
        this.showLoginForm();
    }

    // Manipula o login
    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validação básica
        if (!email || !password) {
            this.showAlert('Por favor, preencha todos os campos', 'error');
            return;
        }

        // Busca o usuário
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            this.showAlert('Usuário não encontrado', 'error');
            return;
        }

        if (user.password !== password) {
            this.showAlert('Senha incorreta', 'error');
            return;
        }

        // Login bem-sucedido
        this.saveCurrentUser(user);
        this.closeModal();
        this.showLoggedArea();
        this.showAlert(`Bem-vindo(a), ${user.name}!`, 'success');
    }

    // Manipula o registro
    handleRegister() {
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        // Validações
        if (!name || !email || !password || !confirmPassword) {
            this.showAlert('Por favor, preencha todos os campos', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showAlert('As senhas não coincidem', 'error');
            return;
        }

        if (password.length < 6) {
            this.showAlert('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        // Verifica se o email já existe
        if (this.users.find(u => u.email === email)) {
            this.showAlert('Este email já está cadastrado', 'error');
            return;
        }

        // Cria novo usuário
        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: email.trim(),
            password: password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        
        // Faz login automaticamente
        this.saveCurrentUser(newUser);
        this.closeModal();
        this.showLoggedArea();
        this.showAlert(`Cadastro realizado com sucesso! Bem-vindo(a), ${newUser.name}!`, 'success');
    }

    // Manipula o logout
    handleLogout() {
        this.removeCurrentUser();
        this.showHomeSection();
        this.showAlert('Logout realizado com sucesso', 'success');
    }

    // Mostra a seção inicial
    showHomeSection() {
        document.getElementById('home-section').classList.remove('hidden');
        document.getElementById('logged-area').classList.add('hidden');
    }

    // Mostra a área logada
    showLoggedArea() {
        document.getElementById('home-section').classList.add('hidden');
        document.getElementById('logged-area').classList.remove('hidden');
        
        // Atualiza nome do usuário
        const userNameSpan = document.getElementById('user-name');
        if (userNameSpan && this.currentUser) {
            userNameSpan.textContent = this.currentUser.name;
        }
    }

    // Mostra alertas
    showAlert(message, type = 'success') {
        const alert = document.getElementById('alert');
        const alertMessage = document.getElementById('alert-message');
        
        alertMessage.textContent = message;
        alert.className = `alert ${type}`;
        alert.classList.remove('hidden');

        // Remove o alerta após 4 segundos
        setTimeout(() => {
            alert.classList.add('hidden');
        }, 4000);
    }

    // Métodos utilitários para uso externo
    isLoggedIn() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getAllUsers() {
        return this.users;
    }

    // Limpa todos os dados (para desenvolvimento)
    clearAllData() {
        localStorage.removeItem('users');
        localStorage.removeItem('currentUser');
        this.users = [];
        this.currentUser = null;
        this.showHomeSection();
        this.showAlert('Todos os dados foram limpos', 'success');
    }
}

// Inicializa o sistema quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    window.loginSystem = new LoginSystem();
    
    // Adiciona alguns usuários de exemplo (apenas para desenvolvimento)
    if (window.loginSystem.getAllUsers().length === 0) {
        const exampleUsers = [
            {
                id: 1,
                name: 'João Silva',
                email: 'joao@email.com',
                password: '123456',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Maria Santos',
                email: 'maria@email.com',
                password: '123456',
                createdAt: new Date().toISOString()
            }
        ];
        
        window.loginSystem.users = exampleUsers;
        window.loginSystem.saveUsers();
    }
});

// Funções para os botões de compra
document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.buy-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            alert(`Produto: ${productName}\nPreço: ${productPrice}\n\nFuncionalidade de compra será implementada em breve!`);
        });
    });
});

// Função para debug (remover em produção)
window.debugLogin = {
    clearData: () => window.loginSystem.clearAllData(),
    showUsers: () => console.table(window.loginSystem.getAllUsers()),
    currentUser: () => console.log(window.loginSystem.getCurrentUser())
};

// Exibir modal automaticamente ao abrir a página
window.addEventListener('load', () => {
  const modal = document.getElementById('login-modal');
  modal.classList.add('show');
});

document.querySelector('.close-btn').addEventListener('click', () => {
  document.getElementById('login-modal').classList.remove('show');
});

//adição
// Abre o modal de login ao clicar em "Minha Conta"
document.getElementById('openLogin').addEventListener('click', () => {
  document.getElementById('login-modal').classList.add('show');
});
// Simula itens no carrinho (exemplo)
let cartCount = 0;

document.querySelectorAll('.product-btn').forEach(button => {
  button.addEventListener('click', () => {
    cartCount++;
    document.getElementById('cart-count').innerText = cartCount;
  });
});
