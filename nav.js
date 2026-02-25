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
            (currentFile === 'index.html' && linkFile === '')
        ) {
            link.classList.add('active');
        }
    });
});