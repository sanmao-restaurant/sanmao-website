document.addEventListener("DOMContentLoaded", () => {
  const heroBg = document.getElementById("hero-bg");
  const menuContent = document.getElementById("menu-content");

  // 1. Gestion dynamique de l'image de fond selon la date du jour
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayFilename = `${month}-${day}.jpg`; // ex: 10-30.jpg
  const todayImagePath = `photos/${todayFilename}`;

  const todayImage = new Image();

  todayImage.onload = () => {
    // Si la photo de la date existe (photos/10-30.jpg)
    heroBg.style.backgroundImage = `url('${todayImagePath}')`;
  };

  todayImage.onerror = () => {
    // En cas d'absence, fallback sur paper-bg.png (et non .jpg)
    heroBg.style.backgroundImage = `url('paper-bg.png')`;
  };

  todayImage.src = todayImagePath;

  // 2. Chargement du menu JSON
  fetch("menu.json")
    .then((response) => response.json())
    .then((data) => {
      renderMenu(data);
    })
    .catch((error) => {
      console.error("Erreur lors du chargement du menu :", error);
      if (menuContent) {
        menuContent.innerHTML = "<p>Menu indisponible pour le moment.</p>";
      }
    });

  function renderMenu(data) {
    if (!data.categories || !menuContent) return;

    let html = "";
    data.categories.forEach((cat) => {
      html += `<div class="menu-category">`;
      html += `<h2>${cat.name}</h2>`;
      html += `<ul class="menu-items">`;
      cat.items.forEach((item) => {
        html += `
          <li class="menu-item">
            <span class="item-title">${item.title}</span>
            <span class="item-dots"></span>
            <span class="item-price">${item.price}€</span>
          </li>
        `;
      });
      html += `</ul></div>`;
    });

    menuContent.innerHTML = html;
  }
});
