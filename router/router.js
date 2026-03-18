const routes = {
  cover: "views/cover.html",
  invitation: "views/countdown.html",
};

async function loadView(view) {
  const response = await fetch(routes[view]);
  const html = await response.text();

  document.getElementById("app").innerHTML = html;

  // ✅ PENTING BANGET
  renderGuestName();
}


window.addEventListener("load", () => {
  loadView("cover");
}); 

