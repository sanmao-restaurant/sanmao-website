document.addEventListener("DOMContentLoaded", () => {
  const heroBg = document.getElementById("hero-bg");
  const menuContent = document.getElementById("menu-content");
  const menuModal = document.getElementById("menu-modal");
  const btnOpenMenu = document.getElementById("btn-open-menu");
  const btnCloseMenu = document.getElementById("btn-close-menu");

  // 1. Photo dynamique par date
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayFilename = `${month}-${day}.jpg`;
  const todayImagePath = `photos/${todayFilename}`;

  heroBg.style.backgroundImage = `url('${todayImagePath}')`;

  const todayImage = new Image();
  todayImage.onerror = () => {
    heroBg.style.backgroundImage = `url('paper-bg.png')`;
  };
  todayImage.src = todayImagePath;

  // 2. Gestion ouverture/fermeture Modal Menu
  if (btnOpenMenu && menuModal) {
    btnOpenMenu.addEventListener("click", () => {
      menuModal.classList.add("active");
    });
  }

  if (btnCloseMenu && menuModal) {
    btnCloseMenu.addEventListener("click", () => {
      menuModal.classList.remove("active");
    });
  }

  if (menuModal) {
    menuModal.addEventListener("click", (e) => {
      if (e.target === menuModal) {
        menuModal.classList.remove("active");
      }
    });
  }

  // 3. Chargement et affichage du menu JSON
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

    // Phrase indicative en bas de menu
    html += `
      <p class="menu-note">
        La carte évolue régulièrement au fil des arrivages et des saisons.
      </p>
    `;

    menuContent.innerHTML = html;
  }
});
