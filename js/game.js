// ==========================================
// SPACE GAME - Cosmic Runner
// ==========================================

class SpaceGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('gameOverlay');
        this.coinsDisplay = document.getElementById('coinsDisplay');
        this.distanceDisplay = document.getElementById('distanceDisplay');
        
        // Game state
        this.isPlaying = false;
        this.score = 0;
        this.coinsCollected = 0;
        this.highScore = parseInt(localStorage.getItem('spaceGameHighScore')) || 0;
        
        // Ship properties (MUST be before resizeCanvas)
        this.ship = {
            x: 100,
            y: 250,
            width: 40,
            height: 30,
            velocity: 0,
            gravity: 0.1,  // Reduzido para 0.1
            jumpStrength: -5,  // Reduzido para -5
            rotation: 0
        };
        
        // Set canvas size (after ship is created)
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Obstacles and coins
        this.obstacles = [];
        this.coins = [];
        this.particles = [];
        this.frameCount = 0;
        this.obstacleSpawnRate = 90;
        this.coinSpawnRate = 60;
        
        // Colors
        this.colors = {
            ship: '#6366f1',
            shipGlow: 'rgba(99, 102, 241, 0.5)',
            radiation: '#ef4444',
            radiationGlow: 'rgba(239, 68, 68, 0.5)',
            coin: '#fbbf24',
            coinGlow: 'rgba(251, 191, 36, 0.5)',
            star: '#ffffff'
        };
        
        // Controls
        this.setupControls();
        
        // Initialize stars background
        this.stars = this.createStars(100);
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.offsetWidth;
        this.canvas.height = 500;
        this.ship.y = this.canvas.height / 2;
    }
    
    createStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.2
            });
        }
        return stars;
    }
    
    setupControls() {
        this.canvas.addEventListener('click', () => {
            if (this.isPlaying) {
                this.jump();
            }
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isPlaying) {
                this.jump();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (this.isPlaying && (e.code === 'Space' || e.code === 'ArrowUp')) {
                e.preventDefault();
                this.jump();
            }
        });
    }
    
    jump() {
        this.ship.velocity = this.ship.jumpStrength;
        this.createParticles(this.ship.x, this.ship.y + this.ship.height / 2, 5, this.colors.ship);
    }
    
    start() {
        this.isPlaying = true;
        this.score = 0;
        this.coinsCollected = 0;
        this.ship.y = this.canvas.height / 2;
        this.ship.velocity = 0;
        this.obstacles = [];
        this.coins = [];
        this.particles = [];
        this.frameCount = 0;
        this.overlay.classList.add('hidden');
        this.updateStatsDisplay();
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.isPlaying) return;
        
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.frameCount++;
        
        // Update ship
        this.ship.velocity += this.ship.gravity;
        this.ship.y += this.ship.velocity;
        this.ship.rotation = this.ship.velocity * 2;
        
        // Check boundaries
        if (this.ship.y < 0) {
            this.ship.y = 0;
            this.ship.velocity = 0;
        }
        if (this.ship.y + this.ship.height > this.canvas.height) {
            this.gameOver();
            return;
        }
        
        // Spawn obstacles
        if (this.frameCount % this.obstacleSpawnRate === 0) {
            this.spawnObstacle();
        }
        
        // Spawn coins
        if (this.frameCount % this.coinSpawnRate === 0) {
            this.spawnCoin();
        }
        
        // Update obstacles
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.x -= obstacle.speed;
            
            // Check collision
            if (this.checkCollision(this.ship, obstacle)) {
                this.gameOver();
                return true;
            }
            
            return obstacle.x + obstacle.width > 0;
        });
        
        // Update coins
        this.coins = this.coins.filter(coin => {
            coin.x -= coin.speed;
            coin.rotation += 0.1;
            
            // Check collection
            if (this.checkCollision(this.ship, coin)) {
                this.collectCoin(coin);
                return false;
            }
            
            return coin.x + coin.size > 0;
        });
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
        
        // Update stars
        this.stars.forEach(star => {
            star.x -= star.speed;
            if (star.x < 0) {
                star.x = this.canvas.width;
                star.y = Math.random() * this.canvas.height;
            }
        });
        
        // Update stats display every frame for real-time feedback
        this.updateStatsDisplay();
    }
    
    draw() {
        // Clear canvas (alpha mais alto = menos rastro)
        this.ctx.fillStyle = 'rgba(10, 14, 26, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.ctx.fillStyle = this.colors.star;
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Draw coins
        this.coins.forEach(coin => {
            this.ctx.save();
            this.ctx.translate(coin.x + coin.size / 2, coin.y + coin.size / 2);
            this.ctx.rotate(coin.rotation);
            
            // Glow effect
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = this.colors.coinGlow;
            
            // Draw star shape
            this.drawStar(0, 0, 5, coin.size / 2, coin.size / 4, this.colors.coin);
            this.ctx.restore();
        });
        
        // Draw obstacles (radiation)
        this.obstacles.forEach(obstacle => {
            this.ctx.save();
            
            // Glow effect
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = this.colors.radiationGlow;
            
            // Draw radiation symbol
            this.ctx.fillStyle = this.colors.radiation;
            this.ctx.font = `${obstacle.width}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('☢️', obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2);
            
            this.ctx.restore();
        });
        
        // Draw ship
        this.ctx.save();
        this.ctx.translate(this.ship.x + this.ship.width / 2, this.ship.y + this.ship.height / 2);
        this.ctx.rotate(this.ship.rotation * Math.PI / 180);
        
        // Glow effect
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = this.colors.shipGlow;
        
        // Ship body
        this.ctx.fillStyle = this.colors.ship;
        this.ctx.beginPath();
        this.ctx.moveTo(this.ship.width / 2, 0);
        this.ctx.lineTo(-this.ship.width / 2, -this.ship.height / 2);
        this.ctx.lineTo(-this.ship.width / 4, 0);
        this.ctx.lineTo(-this.ship.width / 2, this.ship.height / 2);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Ship window
        this.ctx.fillStyle = '#4facfe';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.ship.width / 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    
    spawnObstacle() {
        const minHeight = 40;
        const maxHeight = 80;
        const height = Math.random() * (maxHeight - minHeight) + minHeight;
        const y = Math.random() * (this.canvas.height - height);
        
        this.obstacles.push({
            x: this.canvas.width,
            y: y,
            width: height,
            height: height,
            speed: 3
        });
    }
    
    spawnCoin() {
        const size = 30;
        const y = Math.random() * (this.canvas.height - size - 40) + 20;
        
        this.coins.push({
            x: this.canvas.width,
            y: y,
            size: size,
            speed: 3,
            rotation: 0,
            value: 10
        });
    }
    
    collectCoin(coin) {
        this.score += coin.value;
        this.coinsCollected++;
        this.updateStatsDisplay();
        this.createParticles(coin.x, coin.y, 10, this.colors.coin);
        
        // Play collection sound (optional)
        // You can add sound effect here
    }
    
    createParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 3 + 1,
                color: color,
                life: 30,
                maxLife: 30,
                alpha: 1
            });
        }
    }
    
    checkCollision(rect1, rect2) {
        // Handle objects with 'size' property (like coins)
        const r1Width = rect1.width || rect1.size || 0;
        const r1Height = rect1.height || rect1.size || 0;
        const r2Width = rect2.width || rect2.size || 0;
        const r2Height = rect2.height || rect2.size || 0;
        
        return rect1.x < rect2.x + r2Width &&
               rect1.x + r1Width > rect2.x &&
               rect1.y < rect2.y + r2Height &&
               rect1.y + r1Height > rect2.y;
    }
    
    updateStatsDisplay() {
        // Update coins display
        if (this.coinsDisplay) {
            this.coinsDisplay.textContent = this.coinsCollected;
        }
        
        // Calculate distance in meters (increased rate for better visibility)
        const distance = Math.floor(this.frameCount * 1);
        if (this.distanceDisplay) {
            this.distanceDisplay.textContent = distance + 'm';
        }
    }
    
    updateHighScoreDisplay() {
        // No longer used during gameplay
    }

    
    gameOver() {
        this.isPlaying = false;
        
        // Calculate current distance
        const currentDistance = Math.floor(this.frameCount * 1);
        
        // Update high score based on distance
        if (currentDistance > this.highScore) {
            this.highScore = currentDistance;
            localStorage.setItem('spaceGameHighScore', this.highScore);
        }
        
        // Show game over screen
        this.showGameOver();
    }
    
    showGameOver() {
        const distance = Math.floor(this.frameCount * 1);
        
        this.overlay.innerHTML = `
            <div class="game-over">
                <h3>🎮 Fim de Jogo!</h3>
                <div class="game-stats">
                    <div class="stat-item">
                        <span class="label">⭐ Moedas</span>
                        <span class="value">${this.coinsCollected}</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">📏 Distância</span>
                        <span class="value">${distance}m</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">🏆 Recorde</span>
                        <span class="value">${this.highScore}m</span>
                    </div>
                </div>
                ${distance === this.highScore && distance > 0 ? '<p style="color: var(--solar-yellow); font-size: 1.2rem;">🏆 Novo Recorde!</p>' : ''}
                <button class="btn btn-primary" onclick="game.start()">
                    <i class="fa-solid fa-rotate-right"></i> Jogar Novamente
                </button>
            </div>
        `;
        this.overlay.classList.remove('hidden');
    }
    
    hideOverlay() {
        this.overlay.classList.add('hidden');
    }
}

// Initialize game when DOM is loaded
let game;

function startGame() {
    console.log('Starting game...');
    if (!game) {
        console.log('Creating new game instance...');
        game = new SpaceGame();
    }
    if (game && game.canvas) {
        console.log('Game starting!');
        game.start();
    } else {
        console.error('Game initialization failed!');
    }
}

// Initialize game object on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing game...');
    // Delay initialization to ensure all elements are loaded
    setTimeout(() => {
        game = new SpaceGame();
        console.log('Game initialized:', game ? 'Success' : 'Failed');
    }, 100);
});
