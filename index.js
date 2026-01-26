const CONFIG = {
    TRACK: {
        START_PERCENT: -8,
        END_PERCENT: -92,
        VERTICAL_OFFSET: -50,
        SMALL_SCREEN_BREAKPOINT: 768,
        SMALL_SCREEN_OFFSET: 10,
        TOUCH_ZONE: 200 // pixels above/below image to allow drag on mobile
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

    let horizontalPos = 100 + percent;

    // Adjust for smaller screens
    if (window.innerWidth <= CONFIG.TRACK.SMALL_SCREEN_BREAKPOINT) {
        horizontalPos = horizontalPos - CONFIG.TRACK.SMALL_SCREEN_OFFSET;
    }

    const pos = `${horizontalPos}% center`;
    for (const img of images) {
        img.style.objectPosition = pos;
    }
}

applyTransform(CONFIG.TRACK.START_PERCENT);
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
// Touch Drag (Mobile Restriction)
// =====================================================
let touchActive = false;

window.addEventListener("touchstart", e => {
    const touchY = e.touches[0].clientY;
    touchActive = false;

    for (const img of images) {
        const rect = img.getBoundingClientRect();
        if (touchY >= rect.top - CONFIG.TRACK.TOUCH_ZONE && touchY <= rect.bottom + CONFIG.TRACK.TOUCH_ZONE) {
            touchActive = true;
            break;
        }
    }

    if (touchActive) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartPercent = currentPercent;
    }
}, { passive: true });

window.addEventListener("touchmove", e => {
    if (!isDragging || !touchActive) return;

    const deltaX = dragStartX - e.touches[0].clientX;
    const maxDelta = window.innerWidth / CONFIG.DRAG.TOUCH_DIVISOR;
    const deltaPercent = (deltaX / maxDelta) * CONFIG.DRAG.PERCENT_MULTIPLIER;

    applyTransform(clamp(dragStartPercent + deltaPercent, CONFIG.TRACK.END_PERCENT, CONFIG.TRACK.START_PERCENT));
}, { passive: true });

window.addEventListener("touchend", () => {
    isDragging = false;
    touchActive = false;
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
// Select elements
const containers = document.querySelectorAll('.image-container');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-image');
const lbTitle = document.getElementById('lb-title');

let currentIndex = 0;
let clickAllowed = true;

// Prevent click immediately after dragging
window.addEventListener('mousedown', () => clickAllowed = true);
window.addEventListener('mousemove', () => clickAllowed = false);

// Open lightbox when clicking an image
containers.forEach((container, index) => {
  container.addEventListener('click', () => {
    if (!clickAllowed) return;

    currentIndex = index;
    openLightbox();
  });
});

function openLightbox() {
  const container = containers[currentIndex];

  // Image
  lbImg.src = container.dataset.full;
  lbTitle.textContent = container.dataset.title;

  // LINK LOGIC (THIS IS THE IMPORTANT PART)
  if (container.dataset.link) {
    // Dedicated page
    lbTitle.href = container.dataset.link;
  } else if (container.dataset.gallery) {
    // Shared gallery page
    lbTitle.href = `/pages/gallery/gallery.html?gallery=${container.dataset.gallery}`;
  } else {
    // Safety fallback (no navigation)
    lbTitle.removeAttribute('href');
  }

  lightbox.classList.add('active');
  freezeVerticalScroll();
}


function closeLightbox() {
  lightbox.classList.remove('active');
  unfreezeVerticalScroll();
}

// Navigate images
function nextImage() {
  currentIndex = (currentIndex + 1) % containers.length;
  openLightbox();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + containers.length) % containers.length;
  openLightbox();
}

// Button events
document.getElementById('lb-close').onclick = closeLightbox;
document.getElementById('lb-next').onclick = nextImage;
document.getElementById('lb-prev').onclick = prevImage;

// Keyboard navigation
window.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
});
