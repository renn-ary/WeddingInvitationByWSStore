// window.openInvitation = async function () {

//   const response = await fetch("views/countdown.html");
//   const html = await response.text();

//   document.getElementById("app").innerHTML = html;

//   document.getElementById("music").play();

//   initCountdown();

//   // ✅ INIT AOS DULU
//   AOS.init({
//     duration: 1000,
//     once: true,
//     offset: 80
//   });

//   // ✅ WAJIB PAKAI AWAIT
//   await loadSections();
// };

let cachedViews = {};

async function preloadViews() {
  const views = ["countdown", "couple", "event", "gift", "rsvp", "wishes", "closing"];

  for (const view of views) {
    const res = await fetch(`views/${view}.html`);
    cachedViews[view] = await res.text();
  }
}

// jalanin saat pertama buka web
preloadViews();



window.openInvitation = async function () {

  // ⚡ langsung render TANPA fetch lagi
  document.getElementById("app").innerHTML = cachedViews["countdown"];

  // 🎵 play setelah UI muncul
  document.getElementById("music").play();

  initCountdown();

  // ✅ init AOS SETELAH HTML ADA
  AOS.init({
    duration: 1000,
    once: true,
    offset: 80
  });

  // ⚡ load section lain di background
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

