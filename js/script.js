// ==========================================
// STARS ANIMATION
// ==========================================
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 200;

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
    
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
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
// AURELITO GUIDE SYSTEM
// ==========================================
const aurelitoMessages = {
    home: [
        "Bem-vindo ao Stellar Stories! 🌟 Vamos explorar o clima espacial juntos!",
        "Você sabia? O Sol está a 150 milhões de km de distância! 🌞",
        "Pronto para começar sua aventura? Clique em 'Começar Aventura'! 🚀"
    ],
    stories: [
        "Uau! Escolha uma história para descobrir como o clima espacial afeta nossas vidas! 📚",
        "Cada personagem tem uma perspectiva única sobre o clima espacial! 👨‍🚀",
        "Qual aventura você quer viver primeiro? 🎭"
    ],
    about: [
        "O clima espacial é fascinante! Vamos aprender mais sobre ele! 🔬",
        "Tempestades solares podem afetar satélites, GPS e até redes elétricas! ⚡",
        "O Sol é nosso vizinho mais influente no espaço! ☀️"
    ],
    weather: [
        "Aqui você pode ver dados reais do clima espacial! 📡",
        "Os cientistas monitoram o Sol 24 horas por dia! 🔭",
        "Essas informações ajudam a proteger nossa tecnologia! 🛰️"
    ]
};

const aurelitoImages = {
    normal: './Images/GuideCharacter/Aurelito-2HandsExplanation.png',
    doubt: './Images/GuideCharacter/Aurelito-DoubtFace.png',
    left: './Images/GuideCharacter/Aurelito-left-png.png',
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
        if (section === 'about' || section === 'weather') {
            imageElement.src = aurelitoImages.normal;
        } else if (section === 'stories') {
            imageElement.src = Math.random() > 0.5 ? aurelitoImages.left : aurelitoImages.right;
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
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
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
    console.log('🚀 Stellar Stories: Space Weather initialized!');
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
