const params = new URLSearchParams(window.location.search);
const galleryName = params.get("gallery");

if (!galleryName) {
  document.body.innerHTML = "<h1>No gallery specified</h1>";
  throw new Error("Missing gallery param");
}

let images = [];
let currentIndex = 0;

// Elements
const grid = document.getElementById("gallery-grid");
const pageTitle = document.getElementById("page-title");
const galleryTitle = document.getElementById("gallery-title");

const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lb-image");
const lbTitle = document.getElementById("lb-title");

fetch(`../../data/galleries/${galleryName}.json`)
  .then(res => res.json())
  .then(data => {
    images = data.images;

    pageTitle.textContent = data.title;
    galleryTitle.textContent = data.title;

    renderGrid();
  });

function renderGrid() {
  images.forEach((img, index) => {
    const el = document.createElement("img");
    el.src = img.src;
    el.alt = img.title;

    el.onclick = () => {
      currentIndex = index;
      openLightbox();
    };

    grid.appendChild(el);
  });
}

function openLightbox() {
  const img = images[currentIndex];

  lbImage.src = img.src;
  lbTitle.textContent = img.title;
  lbTitle.href = `gallery.html?gallery=${galleryName}`;

  lightbox.classList.add("active");
}

function closeLightbox() {
  lightbox.classList.remove("active");
}

document.getElementById("lb-close").onclick = closeLightbox;

document.getElementById("lb-prev").onclick = () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  openLightbox();
};

document.getElementById("lb-next").onclick = () => {
  currentIndex = (currentIndex + 1) % images.length;
  openLightbox();
};
window.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "ArrowRight") {
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox();
  }

  if (e.key === "ArrowLeft") {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox();
  }

  if (e.key === "Escape") {
    closeLightbox();
  }
});
