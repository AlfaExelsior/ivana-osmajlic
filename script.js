// This is the final version for GitHub Pages deployment.
document.addEventListener('DOMContentLoaded', () => {

    // --- SECURE CONTACT FORM LOGIC (Base64 Obfuscation) ---
    // IMPORTANT: Replace with your own Base64 encoded key
    const encodedKey = "OTBiNmVhMjctYjUxOS00MTRjLTgxOTQtNTMxNDNmMzI5NDY3";

    const form = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formResult.style.display = 'block';
        formResult.innerText = 'Transmission in progress...';
        formResult.className = '';
        
        const formData = new FormData(form);
        const object = {};
        formData.forEach((value, key) => { object[key] = value; });
        
        // Add the decoded access key to the form data
        object.access_key = atob(encodedKey);
        
        const json = JSON.stringify(object);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            });
            const result = await response.json();
            if (result.success) {
                formResult.classList.add('success');
                formResult.innerText = '>> Transmission successful! Confirmation sent.';
                form.reset();
            } else {
                formResult.classList.add('error');
                formResult.innerText = `>> Error: ${result.message}`;
            }
        } catch (error) {
            formResult.classList.add('error');
            formResult.innerText = '>> Critical Error: Connection to server failed.';
        }
    });

    // --- INTERACTIVE AVATAR CURSOR ---
    const cursor = document.getElementById('avatar-cursor');
    const outline = document.getElementById('avatar-cursor-outline');
    const avatars = document.querySelectorAll('.cursor-avatar');
    const sections = document.querySelectorAll('section[id]');

    // 1. Cursor Movement & Trail
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursor.style.left = `${posX}px`;
        cursor.style.top = `${posY}px`;
        outline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 800, fill: 'forwards' });
        createTrailParticle(posX, posY);
    });
    
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        document.body.appendChild(particle);
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        setTimeout(() => { particle.remove(); }, 500);
    }

    // 2. Hover Effect
    const interactiveElements = document.querySelectorAll('a, button, .grid-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => cursor.classList.add('hover-effect'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover-effect'));
    });

    // 3. Contextual Avatar Switching
    const avatarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSectionId = entry.target.id;
                avatars.forEach(avatar => avatar.classList.remove('is-active'));
                const activeAvatar = document.getElementById(`avatar-for-${currentSectionId}`);
                if (activeAvatar) {
                    activeAvatar.classList.add('is-active');
                } else {
                    document.getElementById('avatar-for-about').classList.add('is-active');
                }
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach(section => avatarObserver.observe(section));

    // --- SCROLL-IN ANIMATION ---
    const animatedCards = document.querySelectorAll('.grid-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedCards.forEach(card => cardObserver.observe(card));
});