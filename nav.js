document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname.toLowerCase();
    const currentFile = currentPath.split('/').pop().replace(".html", "") || 'index' 
    const links = document.querySelectorAll('nav a');

    links.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href').toLowerCase();
        const linkFile = linkHref.split('/').pop().replace(".html", "");

        if (
            linkFile === currentFile ||
            (currentFile === '' && linkFile === 'index') ||
            (currentFile === 'index' && linkFile === '')
        ) {
            link.classList.add('active');
        }
    });
});