// Smooth scroll para navegação
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll para links de navegação
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Menu mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // CTA Button scroll para produtos
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        const productsSection = document.getElementById('produtos');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = productsSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
    
    // Animação dos cards de produtos ao scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.product-card, .stat, .partner-logo');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Header background change on scroll
    /*window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });*/
    
    // Contador animado para estatísticas
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target === 90 ? '+' : target === 22 ? '' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (target === 90 ? '+' : target === 22 ? '' : '+');
            }
        }, 20);
    }
    
    // Observar seção de estatísticas
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((stat, index) => {
                    const targets = [90, 22, 100];
                    animateCounter(stat, targets[index]);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Hover effects para cards de produtos
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Click handlers para botões de produtos
    const productBtns = document.querySelectorAll('.product-btn');
    productBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.parentElement.querySelector('h3').textContent;
            alert(`Você clicou em "${productName}". Aqui você pode implementar a navegação para a página específica do produto.`);
        });
    });
    
    // Parallax effect no hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
});

// Adicionar CSS para menu mobile ativo
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav.active {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            padding: 1rem 0;
        }
        
        .nav.active .nav-list {
            flex-direction: column;
            gap: 1rem;
            padding: 0 2rem;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(style);
