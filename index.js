const CONFIG = {
    TRACK: {
        START_PERCENT: -8,
        END_PERCENT: -92,
        VERTICAL_OFFSET: -50
    },
    SCROLL: {
        SPEED: 0.05
    },
    DRAG: {
        MOUSE_DIVISOR: 2,
        TOUCH_DIVISOR: 1,
        PERCENT_MULTIPLIER: -100
    },
    ANIMATION: {
        HORIZONTAL_SPEED: 6,
        SCROLL_OFFSET: 80
    }
};

const track = document.getElementById("imageTrack");
const images = track.getElementsByClassName("image");

let currentPercent = CONFIG.TRACK.START_PERCENT;
let dragDivisor = CONFIG.DRAG.MOUSE_DIVISOR;
let isDragging = false;
let dragStartX = 0;
let dragStartPercent = 0;


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

window.addEventListener("wheel", e => {
    if (window.scrollY !== 0) return;

    const next =
        currentPercent + -e.deltaY * CONFIG.SCROLL.SPEED;

    if (
        (e.deltaY > 0 && currentPercent > CONFIG.TRACK.END_PERCENT) ||
        (e.deltaY < 0 && currentPercent < CONFIG.TRACK.START_PERCENT)
    ) {
        e.preventDefault();
        applyTransform(
            clamp(
                next,
                CONFIG.TRACK.END_PERCENT,
                CONFIG.TRACK.START_PERCENT
            )
        );
    }
}, { passive: false });

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
    const maxDelta =
        window.innerWidth / CONFIG.DRAG.MOUSE_DIVISOR;

    const deltaPercent =
        (deltaX / maxDelta) * CONFIG.DRAG.PERCENT_MULTIPLIER;

    applyTransform(
        clamp(
            dragStartPercent + deltaPercent,
            CONFIG.TRACK.END_PERCENT,
            CONFIG.TRACK.START_PERCENT
        )
    );
});

document.querySelector('.mySVG').addEventListener('click', () => {
    const prints = document.getElementById('prints');

    function animateHorizontal() {
        if (currentPercent > CONFIG.TRACK.END_PERCENT) {
            applyTransform(
                clamp(
                    currentPercent - CONFIG.ANIMATION.HORIZONTAL_SPEED,
                    CONFIG.TRACK.END_PERCENT,
                    CONFIG.TRACK.START_PERCENT
                )
            );
            requestAnimationFrame(animateHorizontal);
        } else {
            const offset =
                prints.getBoundingClientRect().top +
                window.scrollY -
                CONFIG.ANIMATION.SCROLL_OFFSET;

            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    }

    animateHorizontal();
});


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
document.querySelector('.mySVG').addEventListener('click', () => {
    const prints = document.getElementById('prints');
    const speed = CONFIG.ANIMATION.HORIZONTAL_SPEED;

    function animateHorizontal() {
        if (currentPercent > END_PERCENT) {
            currentPercent -= speed;
            currentPercent = clamp(currentPercent, END_PERCENT, START_PERCENT);
            applyTransform(currentPercent);
            requestAnimationFrame(animateHorizontal);
        } else {
            const offset = prints.getBoundingClientRect().top + window.scrollY - CONFIG; 
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    }

    animateHorizontal();
});
window.addEventListener("touchstart", e => {
  isDragging = true;
  dragStartX = e.touches[0].clientX;
  dragStartPercent = currentPercent;
}, { passive: true });

window.addEventListener("touchmove", e => {
  if (!isDragging) return;

  const deltaX = dragStartX - e.touches[0].clientX;
  const maxDelta = window.innerWidth / CONFIG.DRAG.TOUCH_DIVISOR;

  const deltaPercent =
    (deltaX / maxDelta) * CONFIG.DRAG.PERCENT_MULTIPLIER;

  applyTransform(
    clamp(
      dragStartPercent + deltaPercent,
      CONFIG.TRACK.END_PERCENT,
      CONFIG.TRACK.START_PERCENT
    )
  );
}, { passive: true });

window.addEventListener("touchend", () => {
  isDragging = false;
});
