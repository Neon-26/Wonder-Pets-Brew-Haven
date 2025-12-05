document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function generateStains() {
    const bg = document.getElementById('coffee-stain-bg');
    bg.innerHTML = '';
    for (let i = 0; i < 20; i++) {
        const stain = document.createElement('div');
        stain.style.position = 'absolute';
        stain.style.width = Math.random() * 50 + 'px';
        stain.style.height = stain.style.width;
        stain.style.background = `rgba(139, 69, 19, ${Math.random() * 0.3})`;
        stain.style.borderRadius = '50%';
        stain.style.left = Math.random() * 100 + '%';
        stain.style.top = Math.random() * 100 + '%';
        stain.style.animation = `stain-shift ${Math.random() * 10 + 5}s infinite linear`;
        bg.appendChild(stain);
    }
}
generateStains();

document.querySelectorAll('.brew-sim').forEach(btn => {
    btn.addEventListener('click', function() {
        const item = this.parentElement;
        item.style.animation = 'none';
        setTimeout(() => {
            item.style.animation = 'brew 2s ease-in-out';
        }, 10);
    });
});

const fortunes = [
    "Your next sip will reveal hidden talents.",
    "A bold brew awaits, full of adventure.",
    "Sip slowly; wisdom brews in patience."
];
document.getElementById('oracle-btn').addEventListener('click', function() {
    const result = document.getElementById('oracle-result');
    result.textContent = fortunes[Math.floor(Math.random() * fortunes.length)];
    result.style.animation = 'fadeIn 1s';
});

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Your whisper has been sent into the coffee mist!');
});