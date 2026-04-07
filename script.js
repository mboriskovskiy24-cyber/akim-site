const scrollButtons = document.querySelectorAll("[data-scroll-target]");
const toast = document.getElementById("toast");
const heroMessageButton = document.getElementById("heroMessageButton");
const showMoreButton = document.getElementById("showMoreButton");
const gallerySection = document.querySelector("#gallery");
const factsSection = document.querySelector("#facts");
const memeWallSection = document.querySelector("#meme-wall");
const memeGrid = document.getElementById("memeGrid");
const faceitEloCounter = document.getElementById("faceitEloCounter");

const siteAudio = document.getElementById("siteAudio");
const currentTrackTitle = document.getElementById("currentTrackTitle");
const currentTrackMeta = document.getElementById("currentTrackMeta");
const playPauseButton = document.getElementById("playPauseButton");
const prevTrackButton = document.getElementById("prevTrackButton");
const nextTrackButton = document.getElementById("nextTrackButton");
const volumeControl = document.getElementById("volumeControl");
const trackList = document.getElementById("trackList");

let toastTimer = null;
let currentTrackIndex = 0;
let isAudioReady = false;
let faceitCounterStarted = false;

const playlist = [
  { title: "щит толк", file: "./щит толк.mp3" },
  { title: "любить!", file: "./любить!.mp3" },
  { title: "музыка freestyle", file: "./музыка freestyle.mp3" },
  { title: "mute", file: "./mute.mp3" },
  { title: "TI ROMPO LE DITA", file: "./TI ROMPO LE DITA.mp3" },
  { title: "гранде амо", file: "./гранде амо.mp3" },
  { title: "достойный", file: "./достойный.mp3" },
  { title: "2_5453936904833634677", file: "./2_5453936904833634677.mp3" },
  { title: "danger", file: "./danger.mp3" },
  { title: "для тебя", file: "./для тебя.mp3" },
  { title: "обезвожен фит", file: "./обезвожен фит.mp3" },
  { title: "один", file: "./один.mp3" },
  { title: "ферари", file: "./ферари.mp3" }
];

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

function animateFaceitCounter() {
  if (!faceitEloCounter || faceitCounterStarted) {
    return;
  }

  faceitCounterStarted = true;

  const target = Number(faceitEloCounter.dataset.target || "0");
  const duration = 1400;
  const startTime = performance.now();

  function formatNumber(value) {
    return value.toLocaleString("ru-RU");
  }

  function tick(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(target * eased);

    faceitEloCounter.textContent = formatNumber(currentValue);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
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

function updateTrackUI() {
  if (!playlist.length || !currentTrackTitle || !currentTrackMeta || !trackList) {
    return;
  }

  currentTrackTitle.textContent = playlist[currentTrackIndex].title;
  currentTrackMeta.textContent = `Трек ${currentTrackIndex + 1} из ${playlist.length}. Нажми play и включай атмосферу.`;

  const trackItems = trackList.querySelectorAll(".track-item");
  trackItems.forEach((item, index) => {
    item.classList.toggle("is-active", index === currentTrackIndex);
  });
}

function loadTrack(index) {
  if (!siteAudio || !playlist.length) {
    return;
  }

  currentTrackIndex = (index + playlist.length) % playlist.length;
  siteAudio.src = encodeURI(playlist[currentTrackIndex].file);
  isAudioReady = true;
  updateTrackUI();
}

async function playCurrentTrack() {
  if (!siteAudio || !playlist.length) {
    return;
  }

  if (!isAudioReady) {
    loadTrack(currentTrackIndex);
  }

  try {
    await siteAudio.play();
    if (playPauseButton) {
      playPauseButton.textContent = "Пауза";
    }
  } catch (error) {
    showToast("Браузер пока не дал включить музыку. Нажми кнопку ещё раз.");
  }
}

function pauseCurrentTrack() {
  if (!siteAudio) {
    return;
  }

  siteAudio.pause();
  if (playPauseButton) {
    playPauseButton.textContent = "Включить";
  }
}

function buildTrackList() {
  if (!trackList) {
    return;
  }

  const fragment = document.createDocumentFragment();

  playlist.forEach((track, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "track-item";

    const textWrap = document.createElement("span");
    textWrap.className = "track-item__text";

    const title = document.createElement("strong");
    title.textContent = track.title;

    const meta = document.createElement("span");
    meta.textContent = `Трек #${index + 1}`;

    const action = document.createElement("span");
    action.className = "track-item__button";
    action.textContent = "Играть";

    textWrap.append(title, meta);
    item.append(textWrap, action);

    item.addEventListener("click", async () => {
      loadTrack(index);
      await playCurrentTrack();
    });

    fragment.append(item);
  });

  trackList.innerHTML = "";
  trackList.append(fragment);
  updateTrackUI();
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

if (playPauseButton) {
  playPauseButton.addEventListener("click", async () => {
    if (siteAudio && !siteAudio.paused) {
      pauseCurrentTrack();
    } else {
      await playCurrentTrack();
    }
  });
}

if (prevTrackButton) {
  prevTrackButton.addEventListener("click", async () => {
    loadTrack(currentTrackIndex - 1);
    await playCurrentTrack();
  });
}

if (nextTrackButton) {
  nextTrackButton.addEventListener("click", async () => {
    loadTrack(currentTrackIndex + 1);
    await playCurrentTrack();
  });
}

if (volumeControl && siteAudio) {
  siteAudio.volume = Number(volumeControl.value);
  volumeControl.addEventListener("input", () => {
    siteAudio.volume = Number(volumeControl.value);
  });
}

if (siteAudio) {
  siteAudio.addEventListener("ended", async () => {
    loadTrack(currentTrackIndex + 1);
    await playCurrentTrack();
  });

  siteAudio.addEventListener("pause", () => {
    if (playPauseButton) {
      playPauseButton.textContent = "Включить";
    }
  });

  siteAudio.addEventListener("play", () => {
    if (playPauseButton) {
      playPauseButton.textContent = "Пауза";
    }
  });
}

buildMemeCards();
buildTrackList();
loadTrack(0);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        if (faceitEloCounter && entry.target.contains(faceitEloCounter)) {
          animateFaceitCounter();
        }

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
