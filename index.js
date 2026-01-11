const track = document.getElementById("imageTrack");
const images = track.getElementsByClassName("image");

/* =========================
   CONFIG
========================= */
const START_PERCENT = -11;
const END_PERCENT = -89;
const SCROLL_SPEED = 0.08;

/* =========================
   STATE
========================= */
let currentPercent = START_PERCENT;
let isDragging = false;
let dragStartX = 0;
let dragStartPercent = 0;

/* =========================
   UTILS
========================= */
function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function applyTransform(percent) {
    currentPercent = percent;

    track.style.transform = `translate(${percent}%, -50%)`;

    const pos = `${100 + percent}% center`;
    for (const img of images) {
        img.style.objectPosition = pos;
    }
}

/* =========================
   INITIAL POSITION
========================= */
applyTransform(START_PERCENT);

/* =========================
   WHEEL — HORIZONTAL FIRST
========================= */
window.addEventListener(
    "wheel",
    e => {
        const atTop = window.scrollY === 0;
        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;

        // Only hijack scroll when we're at the very top
        if (!atTop) return;

        // Horizontal forward
        if (scrollingDown && currentPercent > END_PERCENT) {
            e.preventDefault();

            currentPercent += -e.deltaY * SCROLL_SPEED;
            currentPercent = clamp(currentPercent, END_PERCENT, START_PERCENT);
            applyTransform(currentPercent);
            return;
        }

        // Horizontal backward
        if (scrollingUp && currentPercent < START_PERCENT) {
            e.preventDefault();

            currentPercent += -e.deltaY * SCROLL_SPEED;
            currentPercent = clamp(currentPercent, END_PERCENT, START_PERCENT);
            applyTransform(currentPercent);
            return;
        }

        // Otherwise: allow normal vertical scroll
    },
    { passive: false }
);

/* =========================
   MOUSE DRAG
========================= */
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
    const maxDelta = window.innerWidth / 2;

    const deltaPercent = (deltaX / maxDelta) * -100;

    const next = clamp(
        dragStartPercent + deltaPercent,
        END_PERCENT,
        START_PERCENT
    );

    applyTransform(next);
});

/* =========================
   NAV ACTIVE STATE
========================= */
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