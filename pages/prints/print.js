const prints = {
  "left-2-sink": {
    title: "Left to Sink",
    image: "../../images/Sunken Boat-1.jpg",
    description: "Left 2 Sink includes two boats in which one is half way under the water. Which makes you wonder... Why was the boat just left like this?",
    sizes: {
        S:"16.5 x 11.8in",
        M:"23.4 x 16.7in",
        L:"27.6 x 19.7in",
    },
    prices: {
        S: 45,
        M: 65,
        L: 95,
    }

  },
  "titan-in-the-mist": {
    title: "Titan In The Mist",
    image: "../../images/airport-5.jpg",
    description: "Titan in the mist is a powerful photo which shows an emirates plane just taking off. Showing contrast in size compared to the worker positioned below.",
    sizes: {
        S:"16.5 x 11in",
        M:"23.4 x 15.6in",
        L:"27.6 x 18.4in",
    },
    prices: {
        S: 45,
        M: 65,
        L: 95,
    }

  },
  "passing-time": {
    title: "Passing Time",
    image: "../../images/Steam Train.jpg",
    description: "This image shows a passing steam train making its way through what looks like an abandoned station. The cool vlue tones help to create a really moody subject.",
    sizes: {
        S:"16.5 x 13.2in",
        M:"23.4 x 18.7in",
        L:"27.6 x 22.1in",
    },
    prices: {
        S: 45,
        M: 65,
        L: 95,
    }

  },
  "measured-silence": {
    title: "Measured Silence",
    image: "../../images/Cheetah.jpg",
    description: "This image shows a cheetah staring down the camera lens. A fin fact about this image is that no matter where i moved the cheetah wouldnt take its eyes off me, not matter how many other people there were. I dont know if I looked tasty or he's just very photogenic.",
    sizes: {
        S:"13.2 x 16.5in",
        M:"18.7 x 23.4in",
        L:"22.1 x 27.6in",
    },
    prices: {
        S: 45,
        M: 65,
        L: 95,
    }


  }
};
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!prints[id]) {
  document.body.innerHTML = "<h1>Print not found</h1>";
  throw new Error("Invalid print ID");
}

document.getElementById("page-title").textContent = prints[id].title;
document.getElementById("print-title").textContent = prints[id].title;
document.getElementById("print-image").src = prints[id].image;
document.getElementById("print-description").textContent = prints[id].description;

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
const sizeContainer = document.getElementById("sizes");
const priceValue = document.getElementById("price-value");

let selectedSize = null;

Object.entries(prints[id].sizes).forEach(([key, label]) => {
  const btn = document.createElement("button");
  btn.className = "btn size-btn";
  btn.textContent = `${key.toUpperCase()} – ${label}`;

  btn.onclick = () => {
    selectedSize = key;

    document.querySelectorAll(".size-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    priceValue.textContent = prints[id].prices[key];
  };

  sizeContainer.appendChild(btn);
});
const checkout = document.querySelector(".checkout");
checkout.disabled = true;

btn.onclick = () => {
  selectedSize = key;
  priceValue.textContent = prints[id].prices[key];
  checkout.disabled = false;
};
