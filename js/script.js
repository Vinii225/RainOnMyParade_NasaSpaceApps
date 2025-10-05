// ==========================================
// THEME TOGGLE
// ==========================================
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    const logo = document.getElementById('space-apps-logo');
    
    body.classList.toggle('light-theme');
    
    // Atualizar ícone e logo
    if (body.classList.contains('light-theme')) {
        themeIcon.className = 'fa-solid fa-moon';
        if (logo) logo.src = './Images/EventLogo/11.png';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.className = 'fa-solid fa-sun';
        if (logo) logo.src = './Images/EventLogo/44.png';
        localStorage.setItem('theme', 'dark');
    }
}

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.mobile-menu-toggle i');
    
    navLinks.classList.toggle('active');
    
    // Trocar ícone entre hambúrguer e X
    if (navLinks.classList.contains('active')) {
        menuIcon.className = 'fa-solid fa-xmark';
    } else {
        menuIcon.className = 'fa-solid fa-bars';
    }
}

function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.mobile-menu-toggle i');
    
    navLinks.classList.remove('active');
    menuIcon.className = 'fa-solid fa-bars';
}

// Carregar tema salvo ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('#theme-toggle i');
    const logo = document.getElementById('space-apps-logo');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Se não há tema salvo, usar preferência do sistema
    if (!savedTheme) {
        if (!prefersDark) {
            document.body.classList.add('light-theme');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
            if (logo) logo.src = './Images/EventLogo/11.png';
        } else {
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
            if (logo) logo.src = './Images/EventLogo/44.png';
        }
    } else {
        // Usar tema salvo
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
            if (logo) logo.src = './Images/EventLogo/11.png';
        } else {
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
            if (logo) logo.src = './Images/EventLogo/44.png';
        }
    }
});

// ==========================================
// STARS ANIMATION
// ==========================================
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 200;

// Detectar tema atual
const isLightTheme = () => {
    return document.body.classList.contains('light-theme');
};

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

// Animate stars
function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Cor das estrelas baseada no tema
    const starColor = isLightTheme() ? '30, 58, 138' : '255, 255, 255';
    
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starColor}, ${star.opacity})`;
        ctx.fill();
        
        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * 0.02;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
    });
    
    requestAnimationFrame(animateStars);
}

animateStars();

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==========================================
// WORLD POPULATION API
// ==========================================
// Function to format number with dots as thousand separator
function formatPopulation(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

async function fetchWorldPopulation() {
    try {
        const response = await fetch('https://worldpopulationapi.com/api/v1/population');
        const data = await response.json();
        
        if (data && data.population) {
            const population = data.population;
            const populationElement = document.getElementById('world-population');
            
            if (populationElement) {
                // Store the raw number for animation
                populationElement.setAttribute('data-target', population);
                
                // Animate counter with formatted display
                animateCounterFormatted(populationElement, population);
            }
        }
    } catch (error) {
        console.log('Usando valor estimado de população mundial');
        // Fallback: Use current estimated world population
        const populationElement = document.getElementById('world-population');
        if (populationElement) {
            const fallbackPopulation = 8120293392;
            populationElement.setAttribute('data-target', fallbackPopulation);
            animateCounterFormatted(populationElement, fallbackPopulation);
        }
    }
}

// Animate counter with formatted display
function animateCounterFormatted(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatPopulation(Math.floor(target));
            clearInterval(timer);
        } else {
            element.textContent = formatPopulation(Math.floor(current));
        }
    }, 16);
}

// Call the function when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchWorldPopulation();
    
    // Format sun distance with dots
    const sunDistanceElement = document.getElementById('sun-distance');
    if (sunDistanceElement) {
        const distance = parseInt(sunDistanceElement.getAttribute('data-target'));
        animateCounterFormatted(sunDistanceElement, distance);
    }
});

// ==========================================
// AURELITO GUIDE SYSTEM
// ==========================================
const aurelitoMessages = {
    home: [
        "Bem-vindo ao Cosmic Tales! 🌟 Vamos explorar o clima espacial juntos!",
        "Você sabia? O Sol está a 150 milhões de km de distância! 🌞",
        "Pronto para começar sua aventura? Clique em 'Começar Aventura'! 🚀"
    ],
    'space-weather': [
        "Aqui você pode ver dados reais do clima espacial! 📡",
        "Os cientistas monitoram o Sol 24 horas por dia! 🔭",
        "Essas informações ajudam a proteger nossa tecnologia! 🛰️"
    ],
    stories: [
        "Uau! Escolha uma história para descobrir como o clima espacial afeta nossas vidas! 📚",
        "Cada personagem tem uma perspectiva única sobre o clima espacial! 👨‍🚀",
        "Qual aventura você quer viver primeiro? 🎭"
    ],
    about: [
        "Sabia que este projeto foi criado para o NASA Space Apps Challenge? 🏆",
        "O clima espacial é fascinante! Vamos aprender mais sobre ele! 🔬",
        "Tempestades solares podem afetar satélites, GPS e até redes elétricas! ⚡"
    ]
};

const aurelitoImages = {
    normal: './Images/GuideCharacter/Aurelito-2HandsExplanation.png',
    doubt: './Images/GuideCharacter/Aurelito-DoubtFace.png',
    right: './Images/GuideCharacter/Aurelito-right.png'
};

let currentSection = 'home';
let isAurelitoMinimized = false;
let messageIndex = 0;

// Função para mudar a mensagem do Aurelito
function updateAurelitoMessage(section) {
    const messages = aurelitoMessages[section] || aurelitoMessages.home;
    const textElement = document.getElementById('aurelito-text');
    const imageElement = document.getElementById('aurelito-image');
    
    if (!textElement || isAurelitoMinimized) return;
    
    // Rotaciona entre as mensagens da seção
    messageIndex = (messageIndex + 1) % messages.length;
    const message = messages[messageIndex];
    
    // Animação de fade
    textElement.style.opacity = '0';
    
    setTimeout(() => {
        textElement.textContent = message;
        textElement.style.opacity = '1';
        
        // Muda a expressão baseado na seção
        if (section === 'about') {
            imageElement.src = aurelitoImages.doubt;
        } else if (section === 'space-weather') {
            imageElement.src = aurelitoImages.normal;
        } else if (section === 'stories') {
            imageElement.src = aurelitoImages.right;
        } else {
            imageElement.src = aurelitoImages.normal;
        }
    }, 300);
}

// Função para alternar minimizar/maximizar Aurelito
function toggleAurelito() {
    const container = document.getElementById('aurelito-guide');
    const toggleIcon = document.getElementById('toggle-icon');
    
    isAurelitoMinimized = !isAurelitoMinimized;
    
    if (isAurelitoMinimized) {
        container.classList.add('minimized');
        toggleIcon.textContent = '🌟';
    } else {
        container.classList.remove('minimized');
        toggleIcon.textContent = '💬';
        updateAurelitoMessage(currentSection);
    }
}

// Detectar mudança de seção com Intersection Observer
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId && sectionId !== currentSection) {
                currentSection = sectionId;
                updateAurelitoMessage(sectionId);
            }
        }
    });
}, { threshold: 0.3 });

// Observar todas as seções
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Mensagem inicial após 2 segundos
    setTimeout(() => {
        updateAurelitoMessage('home');
    }, 2000);
    
    // Mudar mensagem periodicamente (a cada 15 segundos)
    setInterval(() => {
        if (!isAurelitoMinimized) {
            updateAurelitoMessage(currentSection);
        }
    }, 15000);
});

// Clique no Aurelito para mudar expressão
document.addEventListener('DOMContentLoaded', () => {
    const aurelitoChar = document.getElementById('aurelito-character');
    if (aurelitoChar) {
        aurelitoChar.addEventListener('click', () => {
            const imageElement = document.getElementById('aurelito-image');
            const expressions = Object.values(aurelitoImages);
            const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
            imageElement.src = randomExpression;
        });
    }
});

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const isDecimal = target % 1 !== 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            if (isDecimal) {
                element.textContent = target.toFixed(2);
            } else {
                element.textContent = Math.floor(target);
            }
            clearInterval(timer);
        } else {
            if (isDecimal) {
                element.textContent = current.toFixed(2);
            } else {
                element.textContent = Math.floor(current);
            }
        }
    }, 16);
}

// Intersection Observer for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number, .stat-number-small');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const statId = stat.getAttribute('id');
                
                // Use formatted counter for sun-distance and world-population
                if (statId === 'sun-distance' || statId === 'world-population') {
                    animateCounterFormatted(stat, target);
                } else {
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Observer for compact stats in hero section
const statsCompact = document.querySelector('.stats-compact');
if (statsCompact) {
    statsObserver.observe(statsCompact);
}

// ==========================================
// SMOOTH SCROLL FUNCTIONS
// ==========================================
function scrollToStories() {
    document.getElementById('stories').scrollIntoView({ behavior: 'smooth' });
}

function scrollToWeather() {
    document.getElementById('space-weather').scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// STORY NAVIGATION
// ==========================================
function openStory(storyType) {

     function openStory(storyType) {
    
    // VERIFIQUE SE O VALOR É EXATAMENTE O QUE VEM DO HTML!
    // Se o HTML passa 'tempestade-solar.html', o IF deve usar 'tempestade-solar.html'
    if (storyType === 'tempestade-solar.html') { 
        // CAMINHO CORRETO (sem '../')
        window.location.href = './pages/TempestadeSolar/tempestade-solar.html'; 
        return; // <--- O 'return' é essencial para parar a função aqui!
    }
    
    // ... restante dos seus blocos 'if'
    
    // O CÓDIGO SÓ CHEGA A PARTIR DAQUI SE NENHUM 'if' COM 'return' FOI ENCONTRADO
    const stories = { /* ... */ }; 
    const story = stories[storyType]; 
    // Redirecionar para página de redes elétricas
    if (storyType === 'power') {
        // CAMINHO CORRIGIDO: comece em 'pages'
        window.location.href = './pages/RedesEletricas/redes-eletricas.html';
        return;
    }
    
    // ... restante do código
}
    
    const stories = {
        flare: {
            title: 'A Jornada de Flarinha',
            description: 'Prepare-se para uma aventura épica através do espaço!'
        },
        astronaut: {
            title: 'Luna: Astronauta Corajosa',
            description: 'Uma tempestade solar está chegando à Estação Espacial Internacional!'
        },
        farmer: {
            title: 'GPS do Agricultor José',
            description: 'Como o clima espacial pode afetar a agricultura moderna?'
        },
        pilot: {
            title: 'Piloto nas Nuvens',
            description: 'Voe através de zonas de radiação aumentada!'
        },
        photographer: {
            title: 'Caçador de Auroras',
            description: 'Persiga as mais belas auroras boreais!'
        },
        power: {
            title: 'Guardiões da Rede Elétrica',
            description: 'Proteja a cidade de uma tempestade solar!'
        }
    };
    
    const story = stories[storyType];
    alert(`🚀 ${story.title}\n\n${story.description}\n\n✨ Esta história interativa está em desenvolvimento!\n\nEm breve você poderá:\n• Ler e interagir com a história\n• Ver ilustrações animadas\n• Aprender sobre clima espacial\n• Tomar decisões que afetam a narrativa`);
}

// ==========================================
// FETCH SPACE WEATHER DATA
// ==========================================
async function fetchSpaceWeather() {
    try {
        // NASA DONKI API - Solar Flares
        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];
        
        const apiKey = 'DEMO_KEY'; // Replace with your NASA API key
        const flareUrl = `https://api.nasa.gov/DONKI/FLR?startDate=${thirtyDaysAgo}&endDate=${today}&api_key=${apiKey}`;
        
        const response = await fetch(flareUrl);
        const flares = await response.json();
        
        updateWeatherDashboard(flares);
    } catch (error) {
        console.error('Error fetching space weather:', error);
        displayFallbackData();
    }
}

function updateWeatherDashboard(flares) {
    // Solar Activity
    const solarActivity = document.getElementById('solar-activity');
    const flareCount = flares.length;
    
    let activityLevel, emoji, color;
    if (flareCount > 10) {
        activityLevel = 'ALTA ⚠️';
        emoji = '🔴';
        color = '#ef4444';
    } else if (flareCount > 5) {
        activityLevel = 'MODERADA ⚡';
        emoji = '🟡';
        color = '#f59e0b';
    } else {
        activityLevel = 'BAIXA 😊';
        emoji = '🟢';
        color = '#10b981';
    }
    
    solarActivity.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">${emoji}</div>
        <div style="color: ${color}; font-size: 1.5rem;">${activityLevel}</div>
        <div style="font-size: 0.9rem; color: var(--text-gray); margin-top: 0.5rem;">
            ${flareCount} erupções nos últimos 30 dias
        </div>
    `;
    
    // Last Flare
    const lastFlare = document.getElementById('last-flare');
    if (flares.length > 0) {
        const latest = flares[0];
        const flareDate = new Date(latest.beginTime).toLocaleDateString('pt-BR');
        const flareClass = latest.classType || 'N/A';
        
        lastFlare.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">☄️</div>
            <div style="font-size: 1.2rem; font-weight: 600;">Classe ${flareClass}</div>
            <div style="font-size: 0.9rem; color: var(--text-gray); margin-top: 0.5rem;">
                ${flareDate}
            </div>
        `;
    } else {
        lastFlare.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">☄️</div>
            <div style="font-size: 1.2rem;">Nenhuma recente</div>
        `;
    }
    
    // Storm Risk
    const stormRisk = document.getElementById('storm-risk');
    const riskLevel = flareCount > 10 ? 'ALTO' : flareCount > 5 ? 'MÉDIO' : 'BAIXO';
    const riskEmoji = flareCount > 10 ? '⚠️' : flareCount > 5 ? '⚡' : '✅';
    
    stormRisk.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${riskEmoji}</div>
        <div style="font-size: 1.5rem; font-weight: 600;">${riskLevel}</div>
    `;
    
    // Aurora Forecast
    const auroraForecast = document.getElementById('aurora-forecast');
    const auroraChance = flareCount > 10 ? 'ALTA' : flareCount > 5 ? 'MÉDIA' : 'BAIXA';
    const auroraEmoji = flareCount > 10 ? '🌈' : flareCount > 5 ? '🌠' : '🌙';
    
    auroraForecast.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${auroraEmoji}</div>
        <div style="font-size: 1.5rem; font-weight: 600;">${auroraChance}</div>
        <div style="font-size: 0.9rem; color: var(--text-gray); margin-top: 0.5rem;">
            Próximos 3 dias
        </div>
    `;
}

function displayFallbackData() {
    // Display static data if API fails
    const solarActivity = document.getElementById('solar-activity');
    solarActivity.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🟢</div>
        <div style="color: #10b981; font-size: 1.5rem;">BAIXA 😊</div>
        <div style="font-size: 0.9rem; color: var(--text-gray); margin-top: 0.5rem;">
            Atividade solar normal
        </div>
    `;
    
    const lastFlare = document.getElementById('last-flare');
    lastFlare.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">☄️</div>
        <div style="font-size: 1.2rem; font-weight: 600;">Classe C</div>
        <div style="font-size: 0.9rem; color: var(--text-gray); margin-top: 0.5rem;">
            Dados simulados
        </div>
    `;
    
    const stormRisk = document.getElementById('storm-risk');
    stormRisk.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
        <div style="font-size: 1.5rem; font-weight: 600;">BAIXO</div>
    `;
    
    const auroraForecast = document.getElementById('aurora-forecast');
    auroraForecast.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">🌙</div>
        <div style="font-size: 1.5rem; font-weight: 600;">BAIXA</div>
        <div style="font-size: 0.9rem; color: var(--text-gray); margin-top: 0.5rem;">
            Próximos 3 dias
        </div>
    `;
}

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Cosmic Tales: Space Weather initialized!');
    console.log('✨ Fetching real-time space weather data from NASA...');
    
    // Fetch space weather data
    fetchSpaceWeather();
    
    // Refresh data every 5 minutes
    setInterval(fetchSpaceWeather, 5 * 60 * 1000);
    
    // Add scroll reveal animations
    const revealElements = document.querySelectorAll('.story-card, .stat-card, .weather-card');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        revealObserver.observe(el);
    });
});

// ==========================================
// EASTER EGGS
// ==========================================
let clickCount = 0;
document.querySelector('.sun-icon').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        alert('🌟 Você descobriu um segredo! O Sol produz energia através da fusão nuclear, convertendo 600 milhões de toneladas de hidrogênio em hélio a cada segundo!');
        clickCount = 0;
    }
});
