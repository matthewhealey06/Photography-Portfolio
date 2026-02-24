const prints = {
  "left-2-sink": {
    title: "Left to Sink",
    image: "../../images/-home/Sunken Boat-1.jpg",
    description: "Left 2 Sink includes two boats in which one is half way under the water. Which makes you wonder... Why was the boat just left like this?",
    sizes: { S: "16.5 x 11.8in", M: "23.4 x 16.7in", L: "27.6 x 19.7in" },
    prices: { S: 45, M: 65, L: 95 },
    stripeLinks: {
      S: "https://buy.stripe.com/4gMbJ07qI7pueWD01s8Ra00",
      M: "https://buy.stripe.com/fZudR89yQ4di3dVeWm8Ra01",
      L: "https://buy.stripe.com/6oU5kC8uM4dicOvdSi8Ra02"
    }
  },
  "titan-in-the-mist": {
    title: "Titan In The Mist",
    image: "../../images/-home/airport-5.jpg",
    description: "Titan in the mist is a powerful photo which shows an emirates plane just taking off. Showing contrast in size compared to the worker positioned below.",
    sizes: { S: "16.5 x 11in", M: "23.4 x 15.6in", L: "27.6 x 18.4in" },
    prices: { S: 45, M: 65, L: 95 },
    stripeLinks: {
      S: "https://buy.stripe.com/5kQ00i6mEaBG9Cj9C28Ra03",
      M: "https://buy.stripe.com/7sYcN45iAbFK7ubcOe8Ra04",
      L: "https://buy.stripe.com/bJe9ASbGY8tyaGn3dE8Ra05"
    }
  },
  "red-panda": {
    title: "Red Panda",
    image: "../../images/-home/Animal-24.jpg",
    description: "Description Coming Soon",
    sizes: { S: "16.5 x 11in", M: "23.4 x 15.6in", L: "27.6 x 18.4in" },
    prices: { S: 45, M: 65, L: 95 },
    stripeLinks: {
      S: "https://buy.stripe.com/fZucN426o8tyeWD7tU8Ra06",
      M: "https://buy.stripe.com/5kQ14m4ew1169CjbKa8Ra07",
      L: "https://buy.stripe.com/bJeeVc12kh049Cj5lM8Ra08"
    }
  },
  "measured-silence": {
    title: "Measured Silence",
    image: "../../images/-home/Cheetah.jpg",
    description: "This image shows a cheetah staring down the camera lens. No matter where I moved the cheetah wouldn't take its eyes off me.",
    sizes: { S: "13.2 x 16.5in", M: "18.7 x 23.4in", L: "22.1 x 27.6in" },
    prices: { S: 45, M: 65, L: 95 },
    stripeLinks: {
      S: "https://buy.stripe.com/fZu7sKcL26lq01JcOe8Ra09",
      M: "https://buy.stripe.com/8x23cueTa9xC15NcOe8Ra0a",
      L: "https://buy.stripe.com/5kQ5kCbGY25aeWD5lM8Ra0b"
    }
  }
};

const printOrder = [
  "left-2-sink",
  "titan-in-the-mist",
  "red-panda",
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

let currentPrintId = id;

function renderPrint(printId) {
  currentPrintId = printId;
  const print = prints[printId];

  pageTitle.textContent = print.title;
  printTitle.textContent = print.title;
  printImage.src = print.image;
  printDescription.textContent = print.description;

  sizeContainer.innerHTML = "";
  priceValue.textContent = "--";
  checkout.querySelector("button").textContent = "Select A Size";
  checkout.style.pointerEvents = "none";
  checkout.style.opacity = "0.5";

  Object.entries(print.sizes).forEach(([key, label]) => {
    const btn = document.createElement("button");
    btn.className = "btn size-btn";
    btn.textContent = `${key.toUpperCase()} – ${label}`;

    btn.onclick = () => {
      document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      priceValue.textContent = print.prices[key];
      checkout.querySelector("button").textContent = "Checkout";
      checkout.style.pointerEvents = "auto";
      checkout.style.opacity = "1";

      checkout.querySelector("button").onclick = () => {
        const link = prints[currentPrintId]?.stripeLinks?.[key];
        if (link) window.open(link, "_blank");
      };
    };

    sizeContainer.appendChild(btn);
  });
}

renderPrint(id);

let currentIndex = printOrder.indexOf(id);

prevBtn.onclick = () => {
  currentIndex = (currentIndex - 1 + printOrder.length) % printOrder.length;
  currentPrintId = printOrder[currentIndex];
  window.location.search = `?id=${currentPrintId}`;
};

nextBtn.onclick = () => {
  currentIndex = (currentIndex + 1) % printOrder.length;
  currentPrintId = printOrder[currentIndex];
  window.location.search = `?id=${currentPrintId}`;
};