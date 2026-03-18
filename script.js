document.addEventListener("click", function (e) {
  const anchor = e.target.closest(".floating-navbar a, .floating-gift");
  if (!anchor) return;

  e.preventDefault();

  const targetId = anchor.getAttribute("href");
  const target = document.querySelector(targetId);

  if (!target) return;

  const navbarHeight = 80;
  const targetPosition =
    target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 800;

  let start = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animation(currentTime) {
    if (!start) start = currentTime;

    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
});

function copyRek() {
  const rek = document.getElementById("noRek").innerText;
  navigator.clipboard.writeText(rek);

  alert("Nomor rekening disalin!");
}

function kirimTransfer() {
  const nama = document.getElementById("nama").value.trim();
  const bank = document.getElementById("bank").value.trim();
  const nominal = document.getElementById("nominal").value.trim();

  // VALIDASI
  if (!nama || !bank || !nominal) {
    alert("Harap isi semua data terlebih dahulu!");
    return;
  }

  // VALIDASI NOMINAL ANGKA
  if (isNaN(nominal) || nominal <= 0) {
    alert("Nominal harus berupa angka yang valid!");
    return;
  }

  // LOADING
  document.getElementById("loading").classList.remove("hidden");

  setTimeout(() => {
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("popup").classList.remove("hidden");

    // reset form setelah sukses
    document.getElementById("nama").value = "";
    document.getElementById("bank").value = "";
    document.getElementById("nominal").value = "";
  }, 2000);
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("JS jalan 🚀");
});

// ================= RSVP =================
function kirimRSVP() {
  const params = new URLSearchParams();
  params.append("nama", document.getElementById("rsvpNama").value);
  params.append("jumlah", document.getElementById("rsvpJumlah").value);
  params.append("status", document.getElementById("rsvpStatus").value);
  params.append("pesan", document.getElementById("rsvpPesan").value);

  fetch("https://script.google.com/macros/s/AKfycbxJ4cUJGMvXl0b6eXJs9RJy_jotx-P8APfaQLdz0obn61Mn-01z0x5WGcTuD7_D9QguLQ/exec", {
    method: "POST",
    mode: "no-cors",
    body: params,
  })
    .then(() => {
      alert("RSVP berhasil dikirim");
    })
    .catch(() => {
      alert("Gagal kirim");
    });
}



// ================= UCAPAN =================

function kirimUcapan() {
  const nama = document.getElementById("ucNama").value;
  const hubungan = document.getElementById("ucHubungan").value;
  const status = document.getElementById("ucStatus").value;
  const pesan = document.getElementById("ucPesan").value;

  if (!nama || !hubungan || !status || !pesan) {
    alert("Lengkapi data!");
    return;
  }

  const params = new URLSearchParams();
  params.append("nama", nama);
  params.append("hubungan", hubungan);
  params.append("status", status);
  params.append("pesan", pesan);

  fetch("https://script.google.com/macros/s/AKfycbw0stSrkTlcQ6Axij7z-wgXsFYLA8ULxRK3NZfPFCD2O5GY3YKJ-lfUYAMHxJBPddSa/exec", {
    method: "POST",
    mode: "no-cors",
    body: params,
  })
    .then(() => {
      alert("Ucapan terkirim");

      document.getElementById("ucNama").value = "";
      document.getElementById("ucHubungan").value = "";
      document.getElementById("ucStatus").value = "";
      document.getElementById("ucPesan").value = "";

      loadUcapan();
    });
}

function loadUcapan() {
  fetch("https://script.google.com/macros/s/AKfycbw0stSrkTlcQ6Axij7z-wgXsFYLA8ULxRK3NZfPFCD2O5GY3YKJ-lfUYAMHxJBPddSa/exec")
    .then(res => res.json())
    .then(data => {
      console.log("DATA:", data); // 🔥 cek ini
      renderChats(data);
    })
    .catch(err => console.log("Error:", err));
}


function renderChats(chats) {
  const container = document.getElementById("chatContainer");
  container.innerHTML = "";

  chats.forEach((chat) => {
    const div = document.createElement("div");
    div.className = "chat-bubble";

    div.innerHTML = `
      <strong>${chat.nama}</strong> (${chat.hubungan})<br>
      <small>${chat.status}</small>
      <p>${chat.pesan}</p>
    `;

    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadUcapan();
  setInterval(loadUcapan, 5000);
});



