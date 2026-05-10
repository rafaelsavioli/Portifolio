const contact = {
    init: () => {
        const btn = document.getElementById('copy-email');
        if (btn) {
            btn.addEventListener('click', () => {
                navigator.clipboard.writeText('rafinha.savioli@gmail.com').then(() => {
                    const icon = document.getElementById('email-icon');
                    const text = document.getElementById('email-text');
                    icon.className = 'fas fa-check text-green-400';
                    text.textContent = 'Copiado!';
                    text.className = 'text-green-400';
                    setTimeout(() => {
                        icon.className = 'fas fa-envelope';
                        text.textContent = 'rafinha.savioli@gmail.com';
                        text.className = '';
                    }, 2000);
                });
            });
        }
        
        const textarea = document.getElementById('message');
        if (textarea) {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    },
    initParticles: () => {
        const container = document.getElementById('particles');
        if (!container) return;
        for (let i = 0; i < 10; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(34, 211, 238, 0.5);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            container.appendChild(p);
        }
    },
    initTypewriter: () => {
        const el = document.getElementById('typewriter-text');
        if (!el) return;
        const texts = ['Desenvolvedor PHP', 'JavaScript ES6+', 'Full Stack', 'Rafael Savioli'];
        let i = 0, j = 0, deleting = false;
        const type = () => {
            if (!deleting) {
                el.textContent = texts[i].substring(0, j + 1);
                j++;
                if (j < texts[i].length) setTimeout(type, 50);
                else { deleting = true; setTimeout(type, 1500); }
            } else {
                el.textContent = texts[i].substring(0, j - 1);
                j--;
                if (j > 0) setTimeout(type, 30);
                else { i = (i + 1) % texts.length; deleting = false; setTimeout(type, 300); }
            }
        };
        type();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    contact.init();
    contact.initParticles();
    contact.initTypewriter();
    
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});