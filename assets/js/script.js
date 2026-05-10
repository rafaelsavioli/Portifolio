const contact = {
    init: () => {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        const textarea = document.getElementById('message');
        if (textarea) {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = form.querySelectorAll('.form-input');
            let valid = true;
            
            fields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (valid) {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const msg = document.getElementById('message').value;
                window.location.href = `mailto:rafinha.savioli@gmail.com?subject=Contato do Portfolio&body=Nome: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${msg}`;
                alert('Obrigado! Seu cliente de email será aberto.');
            }
        });
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