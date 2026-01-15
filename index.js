const CONFIG = {
    TRACK: {
        START_PERCENT: -8,
        END_PERCENT: -92,
        VERTICAL_OFFSET: -50
    },
    SCROLL: {
        SPEED: 0.05,
        HERO_BOTTOM_OFFSET: 0,
        SECTION_TOP_OFFSET: -50,
        LOCK_RELEASE_DELAY_MS: 400
    },
    DRAG: {
        MOUSE_DIVISOR: 2,
        TOUCH_DIVISOR: 1,
        PERCENT_MULTIPLIER: -100
    },
    ANIMATION: {
        HORIZONTAL_SPEED: 6,
        SCROLL_OFFSET: 80
    },
    HERO: {
        INTERVAL: 6000
    }
};

// =====================================================
// Helper Functions for Vertical Lock
// =====================================================
function freezeVerticalScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
}

function unfreezeVerticalScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}

// =====================================================
// Hero Slider
// =====================================================
let currentSlide = 0;
const heroImages = document.querySelectorAll('.hero img');
const heroSection = document.querySelector('.hero');

heroImages[0].classList.add('active');

const dotsContainer = document.createElement('div');
dotsContainer.className = 'hero-dots';

heroImages.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'hero-dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

heroSection.appendChild(dotsContainer);

function goToSlide(n) {
    heroImages[currentSlide].classList.remove('active');
    document.querySelectorAll('.hero-dot')[currentSlide].classList.remove('active');

    currentSlide = n;

    heroImages[currentSlide].classList.add('active');
    document.querySelectorAll('.hero-dot')[currentSlide].classList.add('active');
}

function nextSlide() {
    const next = (currentSlide + 1) % heroImages.length;
    goToSlide(next);
}

setInterval(nextSlide, CONFIG.HERO.INTERVAL);

// =====================================================
// Horizontal Track
// =====================================================
const track = document.getElementById("imageTrack");
const images = track.getElementsByClassName("image");

let currentPercent = CONFIG.TRACK.START_PERCENT;
let isDragging = false;
let dragStartX = 0;
let dragStartPercent = 0;
let isHorizontalActive = false; // Track if horizontal scroll is currently active
let scrollLockTimeout = null;

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function applyTransform(percent) {
    currentPercent = percent;

    track.style.transform =
        `translate(${percent}%, ${CONFIG.TRACK.VERTICAL_OFFSET}%)`;

    const pos = `${100 + percent}% center`;
    for (const img of images) {
        img.style.objectPosition = pos;
    }
}

applyTransform(CONFIG.TRACK.START_PERCENT);

// =====================================================
// Direction-Aware Wheel Scroll with Vertical Lock
// =====================================================
window.addEventListener("wheel", e => {
    const heroRect = heroSection.getBoundingClientRect();
    const horizontalSection = document.querySelector('.horizontal-scroll');
    const horizontalRect = horizontalSection.getBoundingClientRect();

    let shouldActivate = false;

    if (e.deltaY > 0) {
        const heroPastThreshold = heroRect.bottom <= CONFIG.SCROLL.HERO_BOTTOM_OFFSET;
        const horizontalVisible = horizontalRect.top < window.innerHeight && horizontalRect.bottom > 0;
        shouldActivate = heroPastThreshold && horizontalVisible;
    } else {
        const heroPastThreshold = heroRect.bottom <= CONFIG.SCROLL.HERO_BOTTOM_OFFSET;
        const sectionFarEnoughDown = horizontalRect.top >= CONFIG.SCROLL.SECTION_TOP_OFFSET;
        const horizontalVisible = horizontalRect.top < window.innerHeight && horizontalRect.bottom > 0;
        shouldActivate = heroPastThreshold && sectionFarEnoughDown && horizontalVisible;
    }

    if (isHorizontalActive) shouldActivate = true;

    if (!shouldActivate) {
        isHorizontalActive = false;
        unfreezeVerticalScroll(); // Make sure vertical scroll unlocks
        return;
    }

    const next = currentPercent + -e.deltaY * CONFIG.SCROLL.SPEED;

    // Lock horizontal scroll & freeze vertical scroll when inside track
    if (
        (e.deltaY > 0 && currentPercent > CONFIG.TRACK.END_PERCENT) ||
        (e.deltaY < 0 && currentPercent < CONFIG.TRACK.START_PERCENT)
    ) {
        e.preventDefault();
        isHorizontalActive = true;
        freezeVerticalScroll();

        if (scrollLockTimeout) clearTimeout(scrollLockTimeout);

        scrollLockTimeout = setTimeout(() => {
            isHorizontalActive = false;
            unfreezeVerticalScroll();
        }, CONFIG.SCROLL.LOCK_RELEASE_DELAY_MS);

        applyTransform(clamp(next, CONFIG.TRACK.END_PERCENT, CONFIG.TRACK.START_PERCENT));
    } else {
        isHorizontalActive = false;
        unfreezeVerticalScroll();
    }
}, { passive: false });

// =====================================================
// Mouse Drag
// =====================================================
window.addEventListener("mousedown", e => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartPercent = currentPercent;
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});

window.addEventListener("mousemove", e => {
    if (!isDragging) return;

    const deltaX = dragStartX - e.clientX;
    const maxDelta = window.innerWidth / CONFIG.DRAG.MOUSE_DIVISOR;
    const deltaPercent = (deltaX / maxDelta) * CONFIG.DRAG.PERCENT_MULTIPLIER;

    applyTransform(clamp(dragStartPercent + deltaPercent, CONFIG.TRACK.END_PERCENT, CONFIG.TRACK.START_PERCENT));
});

// =====================================================
// Touch Drag
// =====================================================
window.addEventListener("touchstart", e => {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartPercent = currentPercent;
}, { passive: true });

window.addEventListener("touchmove", e => {
    if (!isDragging) return;

    const deltaX = dragStartX - e.touches[0].clientX;
    const maxDelta = window.innerWidth / CONFIG.DRAG.TOUCH_DIVISOR;
    const deltaPercent = (deltaX / maxDelta) * CONFIG.DRAG.PERCENT_MULTIPLIER;

    applyTransform(clamp(dragStartPercent + deltaPercent, CONFIG.TRACK.END_PERCENT, CONFIG.TRACK.START_PERCENT));
}, { passive: true });

window.addEventListener("touchend", () => {
    isDragging = false;
});

// =====================================================
// SVG Click Scroll to Prints
// =====================================================
document.querySelector('.mySVG').addEventListener('click', () => {
    const prints = document.getElementById('prints');

    function animateHorizontal() {
        if (currentPercent > CONFIG.TRACK.END_PERCENT) {
            applyTransform(clamp(currentPercent - CONFIG.ANIMATION.HORIZONTAL_SPEED, CONFIG.TRACK.END_PERCENT, CONFIG.TRACK.START_PERCENT));
            requestAnimationFrame(animateHorizontal);
        } else {
            const offset = prints.getBoundingClientRect().top + window.scrollY - CONFIG.ANIMATION.SCROLL_OFFSET;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    }

    animateHorizontal();
});

// =====================================================
// Navigation Active State
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.toLowerCase();
    const currentFile = currentPath.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('nav a');

    links.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href').toLowerCase();
        const linkFile = linkHref.split('/').pop();

        if (
            linkFile === currentFile ||
            (currentFile === '' && linkFile === 'index.html') ||
            (currentFile === 'index.html' && linkFile === '') ||
            linkFile.includes(currentFile)
        ) {
            link.classList.add('active');
        }
    });
});
