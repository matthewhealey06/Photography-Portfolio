const docHeight = document.documentElement.scrollHeight;
const viewHeight = window.innerHeight;

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
let targetY = window.scrollY;
let currentY = window.scrollY;

function smoothScroll() {
  currentY += (targetY - currentY) * 0.1; // easing factor
  window.scrollTo(0, currentY);
  requestAnimationFrame(smoothScroll);
}

window.addEventListener("wheel", e => {
  targetY += e.deltaY;
  targetY = Math.max(0, Math.min(targetY, document.body.scrollHeight - window.innerHeight));
  e.preventDefault();
}, { passive: false });

smoothScroll();
