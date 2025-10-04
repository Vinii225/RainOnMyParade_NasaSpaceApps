        const canvas = document.getElementById('stars-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = document.body.scrollHeight;

        const stars = [];
        const meteors = [];
        const numStars = 300;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2.5,
                velocity: Math.random() * 0.8,
                opacity: Math.random(),
                twinkleSpeed: Math.random() * 0.03 + 0.01
            });
        }

        function createMeteor() {
            meteors.push({
                x: Math.random() * canvas.width,
                y: -10,
                speed: Math.random() * 3 + 2,
                length: Math.random() * 80 + 20,
                opacity: 1
            });
        }

        setInterval(createMeteor, 3000);

        function animateStars() {
            if (canvas.height !== document.body.scrollHeight) {
                canvas.height = document.body.scrollHeight;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.fill();
                
                star.opacity += (Math.random() - 0.5) * star.twinkleSpeed;
                star.opacity = Math.max(0.1, Math.min(1, star.opacity));
            });

            meteors.forEach((meteor, index) => {
                ctx.beginPath();
                ctx.moveTo(meteor.x, meteor.y);
                ctx.lineTo(meteor.x - meteor.length, meteor.y - meteor.length);
                ctx.strokeStyle = `rgba(255, 215, 0, ${meteor.opacity})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                meteor.y += meteor.speed;
                meteor.x += meteor.speed * 0.5;
                meteor.opacity -= 0.01;

                if (meteor.opacity <= 0 || meteor.y > canvas.height) {
                    meteors.splice(index, 1);
                }
            });
            
            requestAnimationFrame(animateStars);
        }

        animateStars();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = document.body.scrollHeight;
        });

        // ==========================================
        // SCROLL-TRIGGERED ANIMATIONS SYSTEM
        // ==========================================
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const elements = entry.target.querySelectorAll('.dialogue, .chapter-title, .hologram-container, .quiz-container');
                    elements.forEach((element, index) => {
                        setTimeout(() => {
                            element.classList.add('appear');
                        }, index * 350); // 350ms delay between elements as specified
                    });
                } else {
                    const elements = entry.target.querySelectorAll('.dialogue, .chapter-title, .hologram-container, .quiz-container');
                    elements.forEach(element => {
                        element.classList.remove('appear');
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.chapter').forEach(chapter => {
            observer.observe(chapter);
        });

        // ==========================================
        // PROGRESS BAR SYSTEM
        // ==========================================
        function updateProgressBar() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            document.getElementById('progressBar').style.width = scrollPercent + '%';
        }

        window.addEventListener('scroll', updateProgressBar);

        // ==========================================
        // NAVIGATION SYSTEM (Funções Globais)
        // ==========================================
        function goToChapter(chapter) {
            document.getElementById(`chapter-${chapter}`).scrollIntoView({
                behavior: 'smooth'
            });
            updateActiveNav(chapter - 1);
        }

        function goToQuiz() {
            document.getElementById('quiz-section').scrollIntoView({
                behavior: 'smooth'
            });
            updateActiveNav(5);
        }

        function updateActiveNav(activeIndex) {
            const navButtons = document.querySelectorAll('.nav-btn');
            navButtons.forEach((btn, index) => {
                btn.classList.toggle('active', index === activeIndex);
            });
        }

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (sectionId.startsWith('chapter-')) {
                        const chapterNum = parseInt(sectionId.split('-')[1]) - 1;
                        updateActiveNav(chapterNum);
                    } else if (sectionId === 'quiz-section') {
                        updateActiveNav(5);
                    }
                }
            });
        }, { threshold: 0.6 });

        document.querySelectorAll('.chapter').forEach(chapter => {
            navObserver.observe(chapter);
        });

        // ==========================================
        // INTERACTIVE QUIZ SYSTEM
        // ==========================================
        let currentQuestion = 1;
        let score = 0;
        let selectedAnswers = {};

        const questions = document.querySelectorAll('.question');
        const nextBtn = document.getElementById('nextQuestion');
        const finishBtn = document.getElementById('finishQuiz');
        const skipBtn = document.getElementById('skipQuiz');
        const scoreElement = document.getElementById('score');

        // Adiciona handlers de clique a todas as opções do quiz
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                const questionElement = this.closest('.question');
                const questionId = questionElement.id;
                
                questionElement.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                this.classList.add('selected');
                selectedAnswers[questionId] = this.dataset.answer === 'true';
                
                nextBtn.disabled = false;
            });
        });

        // Handler para Próxima Pergunta/Revelar Resposta
        nextBtn.addEventListener('click', () => {
            const currentQuestionElement = document.getElementById(`question-${currentQuestion}`);
            const options = currentQuestionElement.querySelectorAll('.option');
            const explanation = currentQuestionElement.querySelector('.explanation');
            
            // 1. Revela a resposta e desabilita opções
            options.forEach(option => {
                if (option.dataset.answer === 'true') {
                    option.classList.add('correct');
                } else if (option.classList.contains('selected')) {
                    option.classList.add('incorrect');
                }
                option.style.pointerEvents = 'none'; // Impede alteração da resposta
            });
            
            explanation.style.display = 'block';
            
            // 2. Atualiza score
            if (selectedAnswers[`question-${currentQuestion}`]) {
                score++;
                scoreElement.textContent = score;
                // Animação de celebração
                scoreElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    scoreElement.style.transform = 'scale(1)';
                }, 300);
            }

            // 3. Prepara a transição para a próxima pergunta após o delay de revisão
            setTimeout(() => {
                currentQuestionElement.classList.remove('active'); // Esconde a pergunta atual
                currentQuestion++;
                
                if (currentQuestion <= 4) {
                    // Próxima Pergunta
                    document.getElementById(`question-${currentQuestion}`).classList.add('active');
                    nextBtn.disabled = true;
                    document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Fim do Quiz - Troca o botão
                    nextBtn.style.display = 'none';
                    finishBtn.style.display = 'inline-block';
                    finishBtn.disabled = false; 
                    document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });
                }
            }, 2500); // Tempo para o usuário ler a explicação
        });

        // Handler para Finalizar Quiz/Mostrar Resultado
        finishBtn.addEventListener('click', () => {
            if (score === 4) {
                createSpectacularConfetti();
                setTimeout(() => {
                    alert('🎉🌟 PERFEITO! INCRÍVEL! 🌟🎉\n\nVocê acertou todas as 4 perguntas!\nAurelito está super orgulhoso de você!\nVocê é um verdadeiro especialista em clima espacial! 🚀✨');
                }, 500);
            } else if (score >= 2) {
                createConfetti();
                setTimeout(() => {
                    alert(`🌟 PARABÉNS! 🌟\n\nVocê acertou ${score} de 4 perguntas!\nUm excelente resultado!\nContinue explorando o universo com Aurelito! 🚀`);
                }, 500);
            } else {
                setTimeout(() => {
                    alert(`🌟 BOM TRABALHO! 🌟\n\nVocê acertou ${score} de 4 perguntas!\nCada pergunta é uma nova descoberta!\nQue tal tentar novamente? Aurelito acredita em você! 🚀💪`);
                }, 500);
            }
            finishBtn.disabled = true;
            skipBtn.disabled = true;
        });

        // Skip quiz button handler
        skipBtn.addEventListener('click', () => {
            if (confirm('🤔 Tem certeza que deseja pular o quiz?\n\nVocê pode aprender muito sobre o clima espacial com essas perguntas divertidas!')) {
                goToChapter(5);
                alert('🚀 Tudo bem! Você pode voltar ao quiz quando quiser.\n\nContinue explorando as aventuras cósmicas do Aurelito! ✨');
            }
        });

        // ==========================================
        // CONFETTI ANIMATION SYSTEM
        // ==========================================
        function createConfetti() {
            const colors = ['#fbbf24', '#f97316', '#ef4444', '#8b5cf6', '#06d6a0', '#ec4899'];
            
            for (let i = 0; i < 80; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDelay = Math.random() * 2 + 's';
                    confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => {
                        confetti.remove();
                    }, 4000);
                }, i * 40);
            }
        }

        function createSpectacularConfetti() {
            const colors = ['#fbbf24', '#f97316', '#ef4444', '#8b5cf6', '#06d6a0', '#ec4899', '#22c55e', '#3b82f6'];
            
            for (let i = 0; i < 150; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDelay = Math.random() * 3 + 's';
                    confetti.style.animationDuration = (Math.random() * 3 + 4) + 's';
                    confetti.style.width = (Math.random() * 8 + 8) + 'px';
                    confetti.style.height = (Math.random() * 8 + 8) + 'px';
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => {
                        confetti.remove();
                    }, 6000);
                }, i * 25);
            }
        }

        // ==========================================
        // AUTO-START ANIMATIONS
        // ==========================================
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const firstChapter = document.getElementById('chapter-1');
                const elements = firstChapter.querySelectorAll('.dialogue, .chapter-title');
                elements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('appear');
                    }, index * 350); 
                });
            }, 800);
        });

        // ==========================================
        // KEYBOARD NAVIGATION
        // ==========================================
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                window.scrollBy(0, window.innerHeight * 0.8);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                window.scrollBy(0, -window.innerHeight * 0.8);
            }
        });