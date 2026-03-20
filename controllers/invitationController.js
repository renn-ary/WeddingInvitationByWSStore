

let cachedViews = {};

async function preloadViews() {
  const views = [
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
    cachedViews[view] = await res.text();
  }
}

// jalanin saat pertama buka web
preloadViews();

let isMusicPlaying = false;
let isAutoPaused = false; // kontrol sistem

window.openInvitation = async function () {
  document.getElementById("app").innerHTML = cachedViews["countdown"];

  const music = document.getElementById("music");

  if (music && !isMusicPlaying) {
    music.play().then(() => {
      isMusicPlaying = true;
    }).catch(() => {});
  }

  initCountdown();

  AOS.init({
    duration: 1000,
    once: true,
    offset: 80
  });

  loadSections();
};


async function loadSections() {
  const sections = ["couple", "event", "gift", "rsvp", "wishes", "closing"];

  for (const section of sections) {
    document.getElementById("invitation").innerHTML += cachedViews[section];
  }

  AOS.refresh();

  // ✅ HIDE LOADER SETELAH SEMUA SELESAI
  hideLoader();
}

function hideLoader() {
  const loader = document.getElementById("loader");

  loader.classList.add("hide");

  setTimeout(() => {
    loader.style.display = "none";
  }, 600);
}

// ===============================
// 🎯 GET GUEST NAME FROM URL
// ===============================
function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  let name = params.get("to");

  if (!name) return "Tamu Undangan";

  return decodeURIComponent(name.replace(/\+/g, " "));
}

// ===============================
// 🎯 RENDER KE HTML
// ===============================
function renderGuestName() {
  const guestElement = document.getElementById("guestName");

  if (guestElement) {
    guestElement.innerText = getGuestName();
  }
}

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.classList.add("hide");

    setTimeout(() => {
      loader.style.display = "none";
    }, 600);
  }, 800); // delay biar smooth
});

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


function stopMusic() {
  const music = document.getElementById("music");
  if (music) {
    music.pause();
    isAutoPaused = false;
  }
}


document.addEventListener("click", (e) => {
  if (e.target.tagName === "IFRAME") {
    stopMusic();
  }
});
