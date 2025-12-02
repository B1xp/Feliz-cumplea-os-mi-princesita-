document.addEventListener('DOMContentLoaded', function ()  {
    createParticles();
    initializeAnimations();
    setupScrollAnimations();
    initAudioControls();
});

function createParticles()  {
    const particles = document.getElementById('particles');
    const particleEmojis = ['💛']

    for (let i = 0; i< 15; i++)  {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = particleEmojis[Math.floor(Math.random () * particleEmojis.length)];

        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random () * 100 + '%';

        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        particle.style.animationDelay = Math.random () * 2 + 's';

        particles.appendChild(particle);
    }
}

function initializeAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element,index) => {
        element.style.animationDelay = (index * 0.2) + 's';
    });
}

function setupScrollAnimations () {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting)  {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    const elementsToObserve = document.querySelectorAll('[data-aos], .section-title, .message-card');
    elementsToObserve.forEach(element => {
        observer.observe(element);

        const delay = element.getAttribute('data-delay');
        if (delay)  {
            element.style.transitionDelay = delay + 'ms';
        }
    });
}

function scrollToSection(sectionId)  {
    const section = document.getElementById(sectionId);
    if (section)  {
        const isMobile = window.innerWidth <= 768;
        section.scrollIntoView({
            behavior: 'smooth',
            block: isMobile ? 'start' : 'center'
        });
    }
}

// Función para deslizar a una sección y luego desaparecer el botón
function scrollAndDisappear(sectionId) {
    // Primero hacer scroll a la sección
    scrollToSection(sectionId);
    
    // Después de 1 segundo (mientras está haciendo scroll), ocultar el botón
    setTimeout(() => {
        const heroBtn = document.querySelector('.hero .cta-button');
        if (heroBtn) {
            // ocultar completamente y desactivar interacción
            heroBtn.style.visibility = 'hidden';
            heroBtn.style.pointerEvents = 'none';
            heroBtn.style.position = 'absolute';
            heroBtn.style.left = '-9999px';
        }
    }, 1000);
}

// Función que abre el modal de la segunda galería (sin desaparecer el botón)
function openGallery2Modal() {
    const modal = document.getElementById('gallery2Modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // evitar scroll en el fondo
    }
}

// Cerrar el modal de gallery2
function closeGallery2Modal() {
    const modal = document.getElementById('gallery2Modal');
    const openBtn = document.getElementById('openGallery2Btn');
    
    if (modal) {
        // Calcular la posición del botón para que el modal se contraiga hacia él
        if (openBtn) {
            const btnRect = openBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;
            const windowCenterX = window.innerWidth / 2;
            const windowCenterY = window.innerHeight / 2;
            
            // Calcular desplazamiento
            const offsetX = btnCenterX - windowCenterX;
            const offsetY = btnCenterY - windowCenterY;
            
            // Aplicar transformación al modal para que se contraiga hacia el botón
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transformOrigin = `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`;
            }
        }
        
        modal.classList.add('hide');
        modal.classList.remove('show');
        
        // Esperar a que termine la animación antes de remover la clase hide
        setTimeout(() => {
            modal.classList.remove('hide');
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transformOrigin = 'center';
            }
        }, 800);
        
        document.body.style.overflow = 'auto'; // restaurar scroll
    }
}

// Cerrar el modal al hacer click fuera del contenido
window.addEventListener('click', (e) => {
    const modal = document.getElementById('gallery2Modal');
    if (e.target === modal) {
        closeGallery2Modal();
    }
});

function toggleLike(button)  {
    const heartIcon = button.querySelector('.heart-icon');
    button.classList.toggle('liked');

    if (button.classList.contains('liked'))  {
        heartIcon.textContent = '💛'

        createFloatingHeart(button);
    } else {
        heartIcon.textContent = '🤍'
    }
}

function createFloatingHeart(button)  {
    const heart = document.createElement('div');
    heart.innerHTML = '💛';
    heart.style.position = 'absolute';
    heart.style.fontSize = '1.5rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';

    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + 'px';
    heart.style.top = rect.top + 'px';

    document.body.appendChild(heart);

    heart.animate([
        { transform: 'translateY(0px) scale(1)', opacity: 1},
        { transform: 'translateY(-60px) scale(1.5)', opacity: 1}
    ], {
        duration: 1500,
        easing: 'ease-out'
    }).onfinish = () => {
        document.body.removeChild(heart);
    };
}

window.addEventListener('scroll', () =>  {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const gallery = document.querySelector('.gallery-section');
    const floatingHearts = document.querySelector('.floating-hearts');
    const heroBtn = document.querySelector('.hero .cta-button');
    const parallaxSpeed = 0.5;

    if (hero)  {
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }

    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = 0.2 + (index % 3) * 0.1;
        particle.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });

    // Hacer transparentes los corazones cuando estamos en la galería
    if (gallery && floatingHearts) {
        const galleryRect = gallery.getBoundingClientRect();
        const heroRect = hero.getBoundingClientRect();
        
        // Si la galería está visible en el viewport, hacer transparentes los corazones
        if (galleryRect.top < window.innerHeight * 0.5) {
            floatingHearts.classList.add('transparent');
        } else {
            floatingHearts.classList.remove('transparent');
        }
    }

    // Controlar la visibilidad del botón según la posición de scroll
    if (gallery && heroBtn) {
        const galleryTop = gallery.offsetTop;
        
        // Si hemos llegado o pasado la galería, ocultar el botón
        if (scrolled >= galleryTop) {
            heroBtn.style.visibility = 'hidden';
            heroBtn.style.pointerEvents = 'none';
            heroBtn.style.position = 'absolute';
            heroBtn.style.left = '-9999px';
        } else {
            // Si estamos antes de la galería, mostrar el botón
            heroBtn.style.visibility = 'visible';
            heroBtn.style.pointerEvents = 'auto';
            heroBtn.style.position = 'relative';
            heroBtn.style.left = 'auto';
        }
    }
});

document.addEventListener('mousemove',  (e) => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const x = e.clientX / window.innerWidth;
    const y = e.clientX / window.innerHeight;

    const moveX = (x - 0.5) * 20;
    const moveY = (x - 0.5) * 20;

    const floatingHearts = document.querySelector('.floating-hearts');
    if (floatingHearts)  {
        floatingHearts.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;

document.head.appendChild(style);

const photoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target.querySelector('img');
            if (img) {
                img.style.animation = 'photoEnter 0.8s ease-out forwards';
            }
        }
    });
}, { threshold: 0.2});

document.querySelectorAll('.photo-card').forEach(card => {
    photoObserver.observe(card);
});

const photoStyle = document.createElement('style');
photoStyle.textContent = `
    @keyframes photoEnter {
        from {
            transform: scale(0.8) rotate(-5deg);
            opacity: 0;
        }
        to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
    }
`;
document.head.appendChild(photoStyle);

// --- Audio controls ---
function initAudioControls() {
    const audio = document.getElementById('bgAudio');
    const playPause = document.getElementById('audioPlayPause');
    const volIcon = document.querySelector('.volume-icon');
    const volume = document.getElementById('audioVolume');
    const control = document.getElementById('audioControl');

    if (!audio || !playPause || !volume || !control) return;

    // Load saved volume
    const savedVol = parseFloat(localStorage.getItem('bgAudioVolume'));
    if (!isNaN(savedVol)) {
        audio.volume = savedVol;
        volume.value = savedVol;
    } else {
        audio.volume = 0.6;
        volume.value = 0.6;
    }
    updateVolumeIcon();

    // Update button state on play/pause
    const updatePlayPauseButton = () => {
        if (audio.paused) {
            playPause.textContent = '▶️';
            playPause.setAttribute('aria-pressed', 'false');
        } else {
            playPause.textContent = '⏸️';
            playPause.setAttribute('aria-pressed', 'true');
        }
    };

    audio.addEventListener('play', updatePlayPauseButton);
    audio.addEventListener('pause', updatePlayPauseButton);

    // Function to attempt play
    const attemptPlay = () => {
        audio.muted = false;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                updatePlayPauseButton();
            }).catch((err) => {
                // Still blocked, will retry on interaction
            });
        }
    };

    // Try autoplay immediately
    attemptPlay();

    // Fallback: enable on first interaction (click or touch)
    const enableAudioOnInteraction = () => {
        attemptPlay();
        // Remove listeners after first successful interaction
        document.removeEventListener('click', enableAudioOnInteraction);
        document.removeEventListener('touchstart', enableAudioOnInteraction);
        document.removeEventListener('touchend', enableAudioOnInteraction);
    };

    document.addEventListener('click', enableAudioOnInteraction, { once: true });
    document.addEventListener('touchstart', enableAudioOnInteraction, { once: true });
    document.addEventListener('touchend', enableAudioOnInteraction, { once: true });

    // Play/pause button click
    playPause.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (audio.paused) {
            attemptPlay();
        } else {
            audio.pause();
        }
        updatePlayPauseButton();
    });

    // Volume control
    function updateVolumeIcon() {
        const v = parseFloat(volume.value);
        if (volIcon) {
            if (v === 0) volIcon.textContent = '🔇';
            else if (v < 0.5) volIcon.textContent = '🔈';
            else volIcon.textContent = '🔊';
        }
    }

    volume.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        audio.volume = v;
        localStorage.setItem('bgAudioVolume', v);
        updateVolumeIcon();
    });

    control.style.display = 'flex';
    updatePlayPauseButton();
}