document.body.classList.add("loading");

const percentEl = document.getElementById("loader-percent");
const loader = document.getElementById("loader");
const content = document.getElementById("content");

let progress = 0;

if (sessionStorage.getItem("loaderShown")) {
  loader.remove();
  content.style.visibility = "visible";
  document.body.classList.remove("loading");
} else {
  sessionStorage.setItem("loaderShown", "true");

  // Fake progress loop
  const fakeInterval = setInterval(() => {
    if (progress < 90) {
      progress += Math.random() * 3;
      progress = Math.floor(progress);
      percentEl.textContent = `${progress}%`;
    }
  }, 60);

  // Finish loader when page fully loads
  window.addEventListener("load", () => {
    clearInterval(fakeInterval);

    const finishInterval = setInterval(() => {
      progress += 2;

      if (progress >= 100) {
        progress = 100;
        percentEl.textContent = "100%";
        clearInterval(finishInterval);

        loader.style.opacity = "0";
        loader.style.transition = "opacity 0.4s ease";

        setTimeout(() => {
          loader.remove();
          content.style.visibility = "visible";
          document.body.classList.remove("loading");
        }, 400);
      } else {
        percentEl.textContent = `${progress}%`;
      }
    }, 20);
  });
}
