import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- Hero Title Continuous Typing Animation ---
(function() {
    const heroTyped = document.getElementById('hero-typed-text');
    if (!heroTyped) return;

    const text = "Powerful Digital Solutions..";
    let isTyping = true;
    let index = 0;
    
    let isVisible = true;
    ScrollTrigger.create({
        trigger: "#home",
        start: "top bottom",
        end: "bottom top",
        onEnter: () => isVisible = true,
        onLeave: () => isVisible = false,
        onEnterBack: () => isVisible = true,
        onLeaveBack: () => isVisible = false
    });

    // Add cursor
    const heroCursor = document.createElement('span');
    heroCursor.className = 'typing-cursor';
    heroTyped.appendChild(heroCursor);

    function heroLoop() {
        if (!isVisible) {
            setTimeout(heroLoop, 500);
            return;
        }
        if (isTyping) {
            if (index < text.length) {
                const ch = document.createTextNode(text.charAt(index));
                heroTyped.insertBefore(ch, heroCursor);
                index++;
                setTimeout(heroLoop, 60 + Math.random() * 40);
            } else {
                isTyping = false;
                setTimeout(heroLoop, 3000); // pause before deleting
            }
        } else {
            const prev = heroCursor.previousSibling;
            if (prev) {
                if (prev.nodeType === Node.TEXT_NODE) {
                    if (prev.length > 1) {
                        prev.textContent = prev.textContent.slice(0, -1);
                    } else {
                        heroTyped.removeChild(prev);
                    }
                } else {
                    heroTyped.removeChild(prev);
                }
                setTimeout(heroLoop, 35);
            } else {
                isTyping = true;
                index = 0;
                setTimeout(heroLoop, 500); // pause before re-typing
            }
        }
    }

    heroLoop();
})();

// --- 3D Tilt Effect on Cards ---
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;
    
    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;
    
    const rotateX = -mouseY / 15;
    const rotateY = mouseX / 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

// --- UI Elements Fade In ---
const sections = document.querySelectorAll('.section');
sections.forEach(sec => {
    gsap.from(sec.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: sec,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
});

// ==========================================
// --- Portfolio: Hover Glow Effect ---
// ==========================================
const portfolioCards = document.querySelectorAll('.portfolio-item');
portfolioCards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
// --- Contact Form ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        const formData = new FormData(contactForm);
        // Web3Forms Access Key
        formData.append("access_key", "71fea4e5-9acd-4c8a-97c8-d81c0117a244");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                btn.textContent = 'Message Sent!';
                btn.style.background = '#25D366'; // Green success color
                contactForm.reset();
            } else {
                btn.textContent = 'Error Sending!';
                btn.style.background = '#FF3D71'; // Red error color
                console.error("Web3Forms Error:", data.message);
            }
        } catch (error) {
            btn.textContent = 'Error Sending!';
            btn.style.background = '#FF3D71';
            console.error("Submission Error:", error);
        } finally {
            // Revert back after 3 seconds
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = ''; // Revert to original
                btn.disabled = false;
            }, 3000);
        }
    });
}

// ==========================================
// --- Golden Cursor Sprinkles ---
// ==========================================
(function() {
    let lastX = 0;
    let lastY = 0;
    let throttleTimer = false;

    window.addEventListener('mousemove', (e) => {
        if (throttleTimer) return;

        throttleTimer = true;
        setTimeout(() => throttleTimer = false, 25); // ~40 FPS emission

        // Only emit if moving
        if (Math.abs(e.clientX - lastX) < 2 && Math.abs(e.clientY - lastY) < 2) return;

        createSprinkle(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
    });

    function createSprinkle(x, y) {
        const sprinkle = document.createElement('div');
        sprinkle.className = 'cursor-sprinkle';
        sprinkle.style.left = `${x}px`;
        sprinkle.style.top = `${y}px`;

        // Randomly drift away from mouse
        const driftX = (Math.random() - 0.5) * 80;
        const driftY = (Math.random() - 0.5) * 80 - 20; // Slight upward bias
        
        sprinkle.style.setProperty('--drift-x', `${driftX}px`);
        sprinkle.style.setProperty('--drift-y', `${driftY}px`);

        document.body.appendChild(sprinkle);

        // Remove from DOM after animation
        setTimeout(() => {
            sprinkle.remove();
        }, 700);
    }
})();



// ==========================================
// --- About Us: Typing Animation ---
// ==========================================
(function() {
    const aboutTyped = document.getElementById('about-typed-text');
    if (!aboutTyped) return;

    const texts = ["digital solution.", "growth strategy.", "future-ready platform."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isVisible = false;

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    aboutTyped.appendChild(cursor);

    ScrollTrigger.create({
        trigger: "#about-us",
        start: "top 80%",
        onEnter: () => isVisible = true,
        onLeaveBack: () => isVisible = false
    });

    function typeLoop() {
        if (!isVisible) {
            setTimeout(typeLoop, 500);
            return;
        }

        const currentWord = texts[wordIndex];
        
        if (isDeleting) {
            // Deleting
            const prev = cursor.previousSibling;
            if (prev) {
                if (prev.length > 1) {
                    prev.textContent = prev.textContent.slice(0, -1);
                } else {
                    aboutTyped.removeChild(prev);
                }
            } else {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % texts.length;
                charIndex = 0; // Reset for the new word
                setTimeout(typeLoop, 500); 
                return;
            }
        } else {
            // Typing
            if (charIndex < currentWord.length) {
                const charNode = document.createTextNode(currentWord.charAt(charIndex));
                aboutTyped.insertBefore(charNode, cursor);
                charIndex++;
            } else {
                isDeleting = true;
                setTimeout(typeLoop, 2000); // Wait 2s before starting deletion
                return;
            }
        }

        const speed = isDeleting ? 35 : 75;
        setTimeout(typeLoop, speed + Math.random() * 40);
    }

    typeLoop();
})();
