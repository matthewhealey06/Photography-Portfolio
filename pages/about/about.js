const mainCol = document.getElementById('main-col');
const minimap = document.getElementById('minimap');
const minimapInner = document.getElementById('minimap-inner');
const viewport = document.getElementById('minimap-viewport');

// Desired minimap width
const MINIMAP_WIDTH = 200;

function buildMinimap() {
    const clone = mainCol.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.paddingLeft = '0';
    clone.style.paddingRight = '0';

    // Strip top margins from cloned sections so text starts at top
    const clonedSections = clone.querySelectorAll('.section');
    clonedSections.forEach((s, i) => {
        if (i === 0) s.style.marginTop = '0';
    });

    // Also kill the default p margin on the first paragraph
    // const firstP = clone.querySelector('p');
    // if (firstP) firstP.style.marginTop = '0';

    minimapInner.innerHTML = '';
    minimapInner.appendChild(clone);

    const mainStyle = getComputedStyle(mainCol);
    const textWidth = mainCol.offsetWidth
        - parseFloat(mainStyle.paddingLeft)
        - parseFloat(mainStyle.paddingRight);

    const scale = MINIMAP_WIDTH / textWidth;

    minimapInner.style.transform = `scale(${scale})`;
    minimapInner.style.width = textWidth + 'px';

    minimap.style.width = MINIMAP_WIDTH + 'px';
    minimap.style.height = (clone.scrollHeight * scale) + 'px';
}

function updateViewport() {
    const docHeight = document.documentElement.scrollHeight;
    const viewHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const minimapHeight = minimap.offsetHeight;

    // Scroll progress 0 to 1
    const scrollFraction = docHeight > viewHeight
        ? scrollY / (docHeight - viewHeight)
        : 0;

    // Slide the minimap up as we scroll so all content is revealed by the end
    const minimapOverflow = minimapHeight - (viewHeight * .4); // 0.55 accounts for the top: 30vh offset
    if (minimapOverflow > 0) {
        minimap.style.transform = `translateY(${-scrollFraction * minimapOverflow}px)`;
    }

    // Viewport box
    const minimapRect = minimap.getBoundingClientRect();
    const visibleFraction = viewHeight / docHeight;
    const vpHeight = visibleFraction * minimapHeight;
    const vpTop = scrollFraction * (minimapHeight - vpHeight + 50);

    viewport.style.top = (minimapRect.top + vpTop) + 'px';
    viewport.style.left = (minimapRect.left - 60) + 'px';
    viewport.style.width = (MINIMAP_WIDTH + 150) + 'px';
    viewport.style.height = vpHeight + 'px';
}

// Build on load and resize
buildMinimap();
updateViewport();

window.addEventListener('scroll', updateViewport);
window.addEventListener('resize', () => {
    buildMinimap();
    updateViewport();
});