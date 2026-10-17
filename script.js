// Year automation
document.getElementById('year').innerText = new Date().getFullYear();

// --- MATRIX & DUST BACKGROUND CANVAS ---
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 65;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.fillStyle = `rgba(14, 165, 233, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Slight network connection lines
    particles.forEach(p => p.update());
    
    // Draw Connections
    ctx.strokeStyle = 'rgba(14, 165, 233, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 110) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    particles.forEach(p => p.draw());
    requestAnimationFrame(animateParticles);
}
animateParticles();

// --- COUNTERS TRIGGER (INTERSECTION OBSERVER) ---
const countCards = document.querySelectorAll('.counter-num');
let startedCounters = false;

function startCounting() {
    countCards.forEach(card => {
        const val = parseInt(card.getAttribute('data-val') || "0");
        if(val === 0) return; // For critical bug check
        let count = 0;
        const duration = 2000;
        const step = val / (duration / 30);
        
        const timer = setInterval(() => {
            count += step;
            if (count >= val) {
                card.innerText = val;
                clearInterval(timer);
            } else {
                card.innerText = Math.floor(count);
            }
        }, 30);
    });
}

// --- INTERACTIVE QA SUITE SIMULATOR ("WAH" PIECE) ---
const consoleLogs = document.getElementById('console-logs');
const startQaBtn = document.getElementById('start-qa-btn');
const progressWrapper = document.querySelector('.test-progress-wrapper');
const progressFill = document.getElementById('test-progress-id');

const testCases = [
    { type: 'comment', text: '# Fetching core assemblies...' },
    { type: 'command', text: '$ load --profile="Rizky Erdiansyah"' },
    { type: 'prompt', text: 'Initializing testing pipeline target: ID [M. Rizky Erdiansyah]...' },
    { type: 'comment', text: '# SIT Integration Verification' },
    { type: 'command', text: '$ verify-vendors --sit' },
    { type: 'passed', text: '[PASS] Vendor Linkage SIT (CRIF & CLIK Checked successfully)' },
    { type: 'comment', text: '# Database Validation checks' },
    { type: 'command', text: '$ run-query-tests --engine="SQL, PostgreSQL & Oracle"' },
    { type: 'passed', text: '[PASS] Toad, MSSQL & PG database schema compliance: 100%' },
    { type: 'comment', text: '# Backend automation checks' },
    { type: 'command', text: '$ dot-net-build --config="Release" --framework="C#, VB.NET"' },
    { type: 'passed', text: '[PASS] Build completed. assemblies loaded & verified.' },
    { type: 'comment', text: '# Automation check suite (Postman / JMeter)' },
    { type: 'command', text: '$ execute-automated-assertions --api="Postman" --load="JMeter"' },
    { type: 'passed', text: '[PASS] API Verification. No service bottlenecks.' },
    { type: 'passed', text: '[PASS] JMeter stress test (DRC Server checks complete).' },
    { type: 'comment', text: '# Checking user alignment' },
    { type: 'command', text: '$ check --at="UAT"' },
    { type: 'passed', text: '[PASS] UAT sign-off criteria passed with extreme detail focus.' },
    { type: 'comment', text: '----------------------------------------' },
    { type: 'passed', text: 'TOTAL RUNTIME: 4.8 seconds | STATUS: SUCCESS' },
    { type: 'passed', text: 'ASSERTION REPORT: 12 Passed, 0 Failed, 0 Warnings.' }
];

let pipelineIndex = 0;
let isRunning = false;

startQaBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    startQaBtn.disabled = true;
    startQaBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> TESTING ACTIVE...';
    progressWrapper.style.display = 'flex';
    progressFill.style.width = '0%';
    
    // Clear prompt and run
    consoleLogs.innerHTML = '<div class="line comment"># Initializing automation test frameworks...</div>';
    pipelineIndex = 0;
    executeNextTest();
});

function executeNextTest() {
    if (pipelineIndex < testCases.length) {
        const test = testCases[pipelineIndex];
        const line = document.createElement('div');
        line.className = `line ${test.type}`;
        line.innerText = test.text;
        consoleLogs.appendChild(line);
        
        // Auto scroll console
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
        
        // Update progress bar
        const progressPercentage = ((pipelineIndex + 1) / testCases.length) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        pipelineIndex++;
        
        // Random timeout to simulate processing
        setTimeout(executeNextTest, Math.random() * 200 + 100);
    } else {
        // Complete state
        isRunning = false;
        startQaBtn.disabled = false;
        startQaBtn.innerHTML = '<i class="fas fa-check-double"></i> QA SUITE: PASSED!';
        startQaBtn.style.backgroundColor = 'var(--secondary-color)';
    }
}

// --- SKILL CARD INTERACTIVE FILTERING ---
const filterButtons = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-interactive-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        skillCards.forEach(card => {
            const cardCat = card.getAttribute('data-cat');
            if (filterValue === 'all' || cardCat === filterValue) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
});

// --- TYPEWRITER DYNAMIC ---
const words = ["testing automation.", "crafting backend logic.", "deploying robust specs.", "killing system bugs."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');

function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
        speed = 1800; // end of word pause
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400; // transition wait
    }

    setTimeout(type, speed);
}
setTimeout(type, 1000);

// --- THEME SWAP HANDLERS ---
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

const storedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', storedTheme);
updateMode(storedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
    updateMode(target);
});

function updateMode(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// --- FADE-IN OBSERVER ON SCROLL ---
const faders = document.querySelectorAll('.fade-in');
const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        
        // Trigger count when counters appear
        if (entry.target.classList.contains('counters-section') && !startedCounters) {
            startedCounters = true;
            startCounting();
        }
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(f => appearOnScroll.observe(f));
