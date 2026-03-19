window.openInvitation = async function () {

  const response = await fetch("views/countdown.html");
  const html = await response.text();

  document.getElementById("app").innerHTML = html;

  document.getElementById("music").play();

  initCountdown();

  // ✅ INIT AOS DULU
  AOS.init({
    duration: 1000,
    once: true,
    offset: 80
  });

  // ✅ WAJIB PAKAI AWAIT
  await loadSections();
};

// async function loadSections() {
//   const sections = ["couple", "event", "gift", "rsvp", "wishes", "closing"];

//   for (const section of sections) {
//     const res = await fetch(`views/${section}.html`);
//     const html = await res.text();
//     document.getElementById("invitation").innerHTML += html;
//   }

//   // ⏱ kasih waktu render DOM
//   setTimeout(() => {
//     AOS.refreshHard(); // 🔥 lebih kuat dari refresh biasa
//   }, 100);
// }

async function loadSections() {
  const sections = ["couple", "event", "gift", "rsvp", "wishes", "closing"];

  for (const section of sections) {
    const res = await fetch(`views/${section}.html`);
    const html = await res.text();
    document.getElementById("invitation").innerHTML += html;
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

