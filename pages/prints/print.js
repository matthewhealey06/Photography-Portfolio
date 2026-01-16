const prints = {
  "left-2-sink": {
    title: "Left to Sink",
    image: "../../images/-home/Sunken Boat-1.jpg",
    description: "Left 2 Sink includes two boats in which one is half way under the water. Which makes you wonder... Why was the boat just left like this?",
    sizes: { S: "16.5 x 11.8in", M: "23.4 x 16.7in", L: "27.6 x 19.7in" },
    prices: { S: 45, M: 65, L: 95 }
  },
  "titan-in-the-mist": {
    title: "Titan In The Mist",
    image: "../../images/-home/airport-5.jpg",
    description: "Titan in the mist is a powerful photo which shows an emirates plane just taking off. Showing contrast in size compared to the worker positioned below.",
    sizes: { S: "16.5 x 11in", M: "23.4 x 15.6in", L: "27.6 x 18.4in" },
    prices: { S: 45, M: 65, L: 95 }
  },
  "passing-time": {
    title: "Passing Time",
    image: "../../images/-home/Steam Train.jpg",
    description: "This image shows a passing steam train making its way through what looks like an abandoned station. The cool blue tones help to create a really moody subject.",
    sizes: { S: "16.5 x 13.2in", M: "23.4 x 18.7in", L: "27.6 x 22.1in" },
    prices: { S: 45, M: 65, L: 95 }
  },
  "measured-silence": {
    title: "Measured Silence",
    image: "../../images/-home/Cheetah.jpg",
    description: "This image shows a cheetah staring down the camera lens. No matter where I moved the cheetah wouldn't take its eyes off me.",
    sizes: { S: "13.2 x 16.5in", M: "18.7 x 23.4in", L: "22.1 x 27.6in" },
    prices: { S: 45, M: 65, L: 95 }
  }
};

const printOrder = [
  "left-2-sink",
  "titan-in-the-mist",
  "passing-time",
  "measured-silence"
];

const params = new URLSearchParams(window.location.search);
const id = params.get("id") || printOrder[0];

if (!prints[id]) {
  document.body.innerHTML = "<h1>Print not found</h1>";
  throw new Error("Invalid print ID");
}

const pageTitle = document.getElementById("page-title");
const printTitle = document.getElementById("print-title");
const printImage = document.getElementById("print-image");
const printDescription = document.getElementById("print-description");
const sizeContainer = document.getElementById("sizes");
const priceValue = document.getElementById("price-value");
const checkout = document.querySelector(".checkout");
const prevBtn = document.getElementById("prev-print");
const nextBtn = document.getElementById("next-print");

function renderPrint(printId) {
  const print = prints[printId];

  pageTitle.textContent = print.title;
  printTitle.textContent = print.title;
  printImage.src = print.image;
  printDescription.textContent = print.description;

  sizeContainer.innerHTML = "";
  priceValue.textContent = "--";
  checkout.querySelector("button").textContent = "Out Of Stock";
  checkout.disabled = true;

  Object.entries(print.sizes).forEach(([key, label]) => {
    const btn = document.createElement("button");
    btn.className = "btn size-btn";
    btn.textContent = `${key.toUpperCase()} – ${label}`;

    btn.onclick = () => {
      document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      priceValue.textContent = print.prices[key];

      checkout.querySelector("button").textContent = "Checkout";
      checkout.disabled = false;
    };

    sizeContainer.appendChild(btn);
  });
}

renderPrint(id);

let currentIndex = printOrder.indexOf(id);

prevBtn.onclick = () => {
  const prevIndex = (currentIndex - 1 + printOrder.length) % printOrder.length;
  const prevId = printOrder[prevIndex];
  window.location.search = `?id=${prevId}`;
};

nextBtn.onclick = () => {
  const nextIndex = (currentIndex + 1) % printOrder.length;
  const nextId = printOrder[nextIndex];
  window.location.search = `?id=${nextId}`;
};
