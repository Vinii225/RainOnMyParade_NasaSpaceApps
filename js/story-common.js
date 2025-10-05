// ==========================================
// STORY PAGES - COMMON FUNCTIONS
// Funções compartilhadas por todas as páginas de histórias
// ==========================================

// ==========================================
// CANVAS STARS ANIMATION
// ==========================================
function initStarsCanvas() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [];
    const numStars = 200;
    const meteors = [];

    // Detectar tema atual
    const isLightTheme = () => document.body.classList.contains('light-theme');

    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            velocity: Math.random() * 0.5,
            opacity: Math.random()
        });
    }

    // Create meteor
    function createMeteor() {
        meteors.push({
            x: Math.random() * canvas.width,
            y: 0,
            length: Math.random() * 80 + 20,
            speed: Math.random() * 5 + 5,
            opacity: 1
        });
    }

    // Create meteors periodically
    setInterval(createMeteor, 3000);

    // Animate stars and meteors
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Cor das estrelas baseada no tema
        const starColor = isLightTheme() ? '30, 58, 138' : '255, 255, 255';
        
        // Draw stars
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${starColor}, ${star.opacity})`;
            ctx.fill();
            
            // Twinkle effect
            star.opacity += (Math.random() - 0.5) * 0.02;
            star.opacity = Math.max(0.1, Math.min(1, star.opacity));
        });
        
        // Draw and update meteors
        meteors.forEach((meteor, index) => {
            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(meteor.x + meteor.length, meteor.y + meteor.length);
            const meteorColor = isLightTheme() ? '59, 130, 246' : '255, 255, 255';
            ctx.strokeStyle = `rgba(${meteorColor}, ${meteor.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            meteor.x += meteor.speed;
            meteor.y += meteor.speed;
            meteor.opacity -= 0.01;
            
            if (meteor.opacity <= 0) {
                meteors.splice(index, 1);
            }
        });
        
        requestAnimationFrame(animateStars);
    }

    animateStars();

    // Resize canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==========================================
// PROGRESS BAR
// ==========================================
function initProgressBar() {
    function updateProgressBar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    }

    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();
}

// ==========================================
// CHAPTER NAVIGATION
// ==========================================
function goToChapter(chapter) {
    const chapterElement = document.querySelector(`.chapter-${chapter}`);
    if (chapterElement) {
        chapterElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function goToQuiz() {
    const quizSection = document.getElementById('quiz');
    if (quizSection) {
        quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateActiveNav(activeIndex) {
    const dots = document.querySelectorAll('.chapter-dot');
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// ==========================================
// QUIZ FUNCTIONALITY
// ==========================================
function initQuiz() {
    let score = 0;
    let currentQuestion = 0;

    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('answered')) return;

            const parent = this.closest('.quiz-question-wrapper');
            const allOptions = parent.querySelectorAll('.quiz-option');
            const feedbackElement = parent.querySelector('.quiz-feedback');
            const explanationElement = parent.querySelector('.quiz-explanation');
            const isCorrect = this.dataset.correct === 'true';

            allOptions.forEach(opt => opt.classList.add('answered'));

            if (isCorrect) {
                this.classList.add('correct');
                feedbackElement.innerHTML = '<p style="color: #10b981; font-size: 1.2rem; font-weight: 600; margin-bottom: 15px;">✅ Correto! Muito bem!</p>';
                score++;
            } else {
                this.classList.add('wrong');
                const correctOption = parent.querySelector('[data-correct="true"]');
                if (correctOption) {
                    correctOption.classList.add('correct');
                }
                feedbackElement.innerHTML = '<p style="color: #ef4444; font-size: 1.2rem; font-weight: 600; margin-bottom: 15px;">❌ Ops! Veja a resposta correta destacada em <strong style="color: #10b981;">VERDE</strong> acima.</p>';
            }

            feedbackElement.style.display = 'block';
            
            // SEMPRE exibir explicação para fixação do conteúdo
            if (explanationElement) {
                explanationElement.style.display = 'block';
                // Scroll suave para a explicação
                setTimeout(() => {
                    explanationElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
            
            currentQuestion++;

            // Show final score if last question
            const totalQuestions = document.querySelectorAll('.quiz-question-wrapper').length;
            if (currentQuestion === totalQuestions) {
                setTimeout(() => {
                    showFinalScore(score, totalQuestions);
                }, 2000);
            }
        });
    });
}

function showFinalScore(score, total) {
    const percentage = (score / total) * 100;
    const resultContainer = document.getElementById('quiz-result');
    
    if (!resultContainer) return;

    let message = '';
    let emoji = '';

    if (percentage === 100) {
        message = 'Perfeito! Você é um expert em clima espacial! 🏆';
        emoji = '🌟🎉';
        createSpectacularConfetti();
    } else if (percentage >= 70) {
        message = 'Muito bem! Você entendeu bastante sobre o assunto! 👏';
        emoji = '🎊';
        createConfetti();
    } else if (percentage >= 50) {
        message = 'Bom trabalho! Continue aprendendo! 📚';
        emoji = '👍';
    } else {
        message = 'Não desanime! Que tal reler a história? 💪';
        emoji = '🌱';
    }

    resultContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; background: var(--card-bg); border-radius: 20px; margin-top: 30px;">
            <div style="font-size: 4em; margin-bottom: 20px;">${emoji}</div>
            <h2 style="color: var(--solar-yellow); margin-bottom: 20px;">Resultado Final</h2>
            <p style="font-size: 2.5em; font-weight: bold; color: var(--primary-color);">${score}/${total}</p>
            <p style="font-size: 1.5em; margin: 20px 0;">${Math.round(percentage)}%</p>
            <p style="font-size: 1.2em; color: var(--text-gray); margin-bottom: 30px;">${message}</p>
            <button class="btn-primary" onclick="location.href='../../index.html'" style="padding: 15px 40px; font-size: 1.1em; background: var(--gradient-solar); border: none; border-radius: 12px; color: white; cursor: pointer; font-weight: 600;">
                🏠 Voltar ao Início
            </button>
        </div>
    `;

    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ==========================================
// CONFETTI EFFECTS
// ==========================================
function createConfetti() {
    const duration = 3000;
    const colors = ['#fbbf24', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.opacity = '1';
            confetti.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
            confetti.style.zIndex = '10000';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: duration + Math.random() * 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => confetti.remove();
        }, i * 30);
    }
}

function createSpectacularConfetti() {
    const duration = 4000;
    const colors = ['#fbbf24', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'];
    
    // Explosão central
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            const size = Math.random() * 15 + 5;
            confetti.style.position = 'fixed';
            confetti.style.left = '50%';
            confetti.style.top = '50%';
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.opacity = '1';
            confetti.style.zIndex = '10000';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            document.body.appendChild(confetti);
            
            const angle = (Math.PI * 2 * i) / 100;
            const velocity = Math.random() * 300 + 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            const animation = confetti.animate([
                { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${Math.random() * 720}deg) scale(0)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => confetti.remove();
        }, i * 10);
    }
    
    // Confetti caindo do topo
    setTimeout(() => createConfetti(), 500);
}

// ==========================================
// THEME TOGGLE
// ==========================================
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

// ==========================================
// MOBILE MENU
// ==========================================
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.mobile-menu-toggle i');
    
    if (!navLinks) return;
    
    navLinks.classList.toggle('active');
    
    if (menuIcon) {
        menuIcon.className = navLinks.classList.contains('active') 
            ? 'fa-solid fa-xmark' 
            : 'fa-solid fa-bars';
    }
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.mobile-menu-toggle i');
    
    if (navLinks) navLinks.classList.remove('active');
    if (menuIcon) menuIcon.className = 'fa-solid fa-bars';
}



// ==========================================
// KEYBOARD NAVIGATION
// ==========================================
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Navegação com setas
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
        }
        // Home/End
        else if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
}

// ==========================================
// INITIALIZE ALL
// ==========================================
function initStoryPage() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('#theme-toggle i');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (!savedTheme) {
        if (!prefersDark) {
            document.body.classList.add('light-theme');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        } else {
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        }
    } else {
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        } else {
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        }
    }

    // Initialize features
    initStarsCanvas();
    initProgressBar();
    initQuiz();
    initKeyboardNavigation();
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initStoryPage);
