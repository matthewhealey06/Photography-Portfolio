const track = document.getElementById('imageTrack')

window.onmousedown = e => {
    track.dataset.mouseDownAt = e.clientX
}
window.onmouseup = () => {
    track.dataset.mouseDownAt = '0'
    track.dataset.prevPercentage = track.dataset.percentage
}
window.onmousemove = e => {
    if (track.dataset.mouseDownAt === '0') return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
    const maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100;
    let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;

    nextPercentage = Math.max(Math.min(nextPercentage, -12), -88);

    if (nextPercentage === 0 || nextPercentage === -100) {
    track.dataset.mouseDownAt = e.clientX
    track.dataset.prevPercentage = nextPercentage
}
    track.dataset.percentage = nextPercentage;

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: 'forwards' });

    for (const image of track.getElementsByClassName('image')) {
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: 'forwards' });
    }
};

window.addEventListener('wheel', e => {
    e.preventDefault();

    const scrollSpeed = 0.07; 
    const delta = e.deltaY * scrollSpeed;

    let nextPercentage =
        parseFloat(track.dataset.prevPercentage || 0) + delta;

    nextPercentage = Math.max(Math.min(nextPercentage, -12), -88);

    track.dataset.percentage = nextPercentage;
    track.dataset.prevPercentage = nextPercentage;

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: 'forwards' });

    for (const image of track.getElementsByClassName('image')) {
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: 'forwards' });
    }
}, { passive: false });
