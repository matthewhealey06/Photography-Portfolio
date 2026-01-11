const track = document.getElementById('imageTrack');

let lastUpdate = 0;
const MIN_FRAME_TIME = 1000 / 40; 

window.onmousedown = e => {
    track.dataset.mouseDownAt = e.clientX;
};

window.onmouseup = () => {
    track.dataset.mouseDownAt = '0';
    track.dataset.prevPercentage = track.dataset.percentage;
};

window.onmousemove = e => {
    if (track.dataset.mouseDownAt === '0') return;

    const now = performance.now();
    if (now - lastUpdate < MIN_FRAME_TIME) return; 
    lastUpdate = now;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
    const maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100;
    let nextPercentage = parseFloat(track.dataset.prevPercentage || "0") + percentage;

    nextPercentage = Math.max(Math.min(nextPercentage, -11), -89);

    if (nextPercentage === 0 || nextPercentage === -100) {
        track.dataset.mouseDownAt = e.clientX;
        track.dataset.prevPercentage = nextPercentage;
    }

    track.dataset.percentage = nextPercentage;

    track.animate(
        { transform: `translate(${nextPercentage}%, -50%)` },
        { duration: 120, fill: 'forwards' }
    );

    const pos = `${100 + nextPercentage}% center`;
    for (const image of track.getElementsByClassName('image')) {
        image.animate(
            { objectPosition: pos },
            { duration: 120, fill: 'forwards' }
        );
    }
};

let lastWheel = 0;
window.addEventListener('wheel', e => {
    e.preventDefault();

    const now = performance.now();
    if (now - lastWheel < MIN_FRAME_TIME) return;
    lastWheel = now;

    const scrollSpeed = 0.07;
    const delta = -e.deltaY * scrollSpeed;

    let nextPercentage = parseFloat(track.dataset.prevPercentage || 0) + delta;
    nextPercentage = Math.max(Math.min(nextPercentage, -11), -89);

    track.dataset.percentage = nextPercentage;
    track.dataset.prevPercentage = nextPercentage;

    track.animate(
        { transform: `translate(${nextPercentage}%, -50%)` },
        { duration: 80, fill: 'forwards' }
    );

    const pos = `${100 + nextPercentage}% center`;
    for (const image of track.getElementsByClassName('image')) {
        image.animate(
            { objectPosition: pos },
            { duration: 80, fill: 'forwards' }
        );
    }
}, { passive: false });

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