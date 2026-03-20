// ===============================
// 🔥 CACHE HTML
// ===============================
let cachedViews = {};
let isMusicPlaying = false;
let isAutoPaused = false;

// ===============================
// 🔥 PRELOAD IMAGES
// ===============================
async function preloadImagesFromHTML(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;

  const images = temp.querySelectorAll("img");
  const promises = [];

  images.forEach((img) => {
    const src = img.getAttribute("src");
    if (!src) return;

    const image = new Image();
    image.src = src;

    promises.push(
      new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
      }),
    );
  });

  return Promise.all(promises);
}

// ===============================
// 🔥 PRELOAD SEMUA VIEW
// ===============================
async function preloadViews() {
  const views = [
    "cover",
    "countdown",
    "couple",
    "event",
    "gift",
    "rsvp",
    "wishes",
    "closing",
  ];

  for (const view of views) {
    const res = await fetch(`views/${view}.html`);
    const html = await res.text();

    cachedViews[view] = html;

    // 🔥 penting: preload cover & countdown dulu
    if (view === "cover" || view === "countdown") {
      await preloadImagesFromHTML(html);
    }
  }
}

// ===============================
// 🔥 LOAD COVER AWAL
// ===============================
window.addEventListener("load", async () => {
  await preloadViews();

  document.getElementById("app").innerHTML = cachedViews["cover"];

  renderGuestName();

  hideLoader();
});

// ===============================
// 🔥 OPEN INVITATION
// ===============================
window.openInvitation = async function () {
  document.getElementById("app").innerHTML = cachedViews["countdown"];

  const music = document.getElementById("music");

  if (music && !isMusicPlaying) {
    music
      .play()
      .then(() => {
        isMusicPlaying = true;
      })
      .catch(() => {});
  }

  initCountdown();

  AOS.init({
    duration: 1000,
    once: true,
    offset: 80,
  });

  loadSections(); // background
};

// ===============================
// 🔥 LOAD SECTION + PRELOAD IMAGE
// ===============================
async function loadSections() {
  const sections = ["couple", "event", "gift", "rsvp", "wishes", "closing"];

  for (const section of sections) {
    await preloadImagesFromHTML(cachedViews[section]);

    document.getElementById("invitation").innerHTML += cachedViews[section];
  }

  AOS.refresh();
}

// ===============================
// 🔥 LOADER
// ===============================
function hideLoader() {
  const loader = document.getElementById("loader");

  loader.classList.add("hide");

  setTimeout(() => {
    loader.style.display = "none";
  }, 600);
}

// ===============================
// 🎯 GET GUEST NAME
// ===============================
function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  let name = params.get("to");

  if (!name) return "Tamu Undangan";

  return decodeURIComponent(name.replace(/\+/g, " "));
}

// ===============================
// 🎯 RENDER NAME
// ===============================
function renderGuestName() {
  const guestElement = document.getElementById("guestName");

  if (guestElement) {
    guestElement.innerText = getGuestName();
  }
}

// ===============================
// 🎵 AUTO STOP MUSIC (TAB)
// ===============================
document.addEventListener("visibilitychange", () => {
  const music = document.getElementById("music");
  if (!music) return;

  if (document.hidden) {
    music.pause();
    isAutoPaused = true;
  } else {
    if (isAutoPaused) {
      music.play().catch(() => {});
      isAutoPaused = false;
    }
  }
});

// ===============================
// 🎵 STOP MUSIC MANUAL
// ===============================
function stopMusic() {
  const music = document.getElementById("music");
  if (music) {
    music.pause();
    isAutoPaused = false;
  }
}

// ===============================
// 🎵 STOP SAAT KLIK IFRAME
// ===============================
document.addEventListener("click", (e) => {
  if (e.target.tagName === "IFRAME") {
    stopMusic();
  }
});
