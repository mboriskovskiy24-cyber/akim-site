const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const toast = document.getElementById("toast");
const heroMessageButton = document.getElementById("heroMessageButton");
const showMoreButton = document.getElementById("showMoreButton");
const gallerySection = document.querySelector("#gallery");
const factsSection = document.querySelector("#facts");
const memeWallSection = document.querySelector("#meme-wall");
const memeGrid = document.getElementById("memeGrid");

let toastTimer = null;

function smoothScrollTo(targetSelector) {
  const target = document.querySelector(targetSelector);

  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("toast--visible");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 3200);
}

function buildMemeCards() {
  if (!memeGrid) {
    return;
  }

  const memeWords = [
    "67",
    "trollface",
    "brainrot",
    "52",
    "чиназес",
    "sigma",
    "лол",
    "ультра-мем",
    "кринж-мощь",
    "аким-core",
    "gigachad",
    "omega-lul"
  ];

  const actions = [
    "Аким делает лицо победителя",
    "Аким делает вид, что всё понял",
    "Аким делает мемный анализ",
    "Аким делает шаг в сторону хаоса",
    "Аким делает важный интернет-вывод",
    "Аким делает паузу ради эстетики",
    "Аким делает мощный кивок",
    "Аким делает невозможное выражение лица"
  ];

  const memeImageUrls = [
    "./akim-1.jpg",
    "./akim-2.jpg",
    "./akim-3.jpg",
    "./akim-4.jpg",
    "./akim-5.jpg",
    "./akim-6.jpg",
    "./akim-7.jpg",
    "./akim-8.jpg",
    "./akim-9.jpg",
    "./akim-10.jpg"
  ];

  const fragment = document.createDocumentFragment();
  const totalCards = 520;

  for (let index = 0; index < totalCards; index += 1) {
    const word = memeWords[index % memeWords.length];
    const action = actions[index % actions.length];
    const title = `${word} #${index + 1}`;
    const subtitle = `${action}, пока мем ${word} набирает слишком много силы.`;

    const card = document.createElement("article");
    card.className = "meme-card reveal";

    const image = document.createElement("img");
    image.className = "meme-card__image";
    image.loading = "lazy";
    image.alt = `Мем ${title}`;
    image.src = memeImageUrls[index % memeImageUrls.length];

    const content = document.createElement("div");
    content.className = "meme-card__content";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const text = document.createElement("p");
    text.textContent = subtitle;

    content.append(heading, text);
    card.append(image, content);
    fragment.append(card);
  }

  memeGrid.innerHTML = "";
  memeGrid.append(fragment);
}

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetSelector = button.getAttribute("data-scroll-target");

    if (targetSelector) {
      smoothScrollTo(targetSelector);
    }
  });
});

if (heroMessageButton) {
  heroMessageButton.addEventListener("click", () => {
    showToast("Аким официально признан главным ценителем куриц, медведей и мемов. Это уже почти звание.");

    if (factsSection) {
      factsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}

if (showMoreButton) {
  showMoreButton.addEventListener("click", () => {
    showToast("Мем-стена уже разогрета: 67, trollface, brainrot, 52 и чиназес ждут Акима.");

    if (memeWallSection) {
      memeWallSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else if (gallerySection) {
      gallerySection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}

buildMemeCards();

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -6% 0px"
  }
);

function observeRevealElements() {
  const currentRevealElements = document.querySelectorAll(".reveal");

  currentRevealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 16, 180)}ms`;
    revealObserver.observe(element);
  });
}

observeRevealElements();

function updateParallax() {
  const scrollY = window.scrollY || window.pageYOffset;
  document.documentElement.style.setProperty("--scroll-shift", `${scrollY}px`);
}

updateParallax();
window.addEventListener("scroll", updateParallax, { passive: true });

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toast) {
    toast.classList.remove("toast--visible");
    window.clearTimeout(toastTimer);
  }
});
