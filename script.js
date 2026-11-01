document.addEventListener("DOMContentLoaded", () => {
  const heroBg = document.getElementById("hero-bg");
  
  // Éléments Menu FR
  const menuContent = document.getElementById("menu-content");
  const menuModal = document.getElementById("menu-modal");
  const btnOpenMenu = document.getElementById("btn-open-menu");
  const btnCloseMenu = document.getElementById("btn-close-menu");

  // Éléments Menu CN
  const menuContentCn = document.getElementById("menu-content-cn");
  const menuModalCn = document.getElementById("menu-modal-cn");
  const btnOpenMenuCn = document.getElementById("btn-open-menu-cn");
  const btnCloseMenuCn = document.getElementById("btn-close-menu-cn");

  // 1. Arrière-plan dynamique par date
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

  // 2. Gestion ouverture/fermeture Pop-up FR
  if (btnOpenMenu && menuModal) {
    btnOpenMenu.addEventListener("click", () => menuModal.classList.add("active"));
  }
  if (btnCloseMenu && menuModal) {
    btnCloseMenu.addEventListener("click", () => menuModal.classList.remove("active"));
  }
  if (menuModal) {
    menuModal.addEventListener("click", (e) => {
      if (e.target === menuModal) menuModal.classList.remove("active");
    });
  }

  // 3. Gestion ouverture/fermeture Pop-up CN
  if (btnOpenMenuCn && menuModalCn) {
    btnOpenMenuCn.addEventListener("click", () => menuModalCn.classList.add("active"));
  }
  if (btnCloseMenuCn && menuModalCn) {
    btnCloseMenuCn.addEventListener("click", () => menuModalCn.classList.remove("active"));
  }
  if (menuModalCn) {
    menuModalCn.addEventListener("click", (e) => {
      if (e.target === menuModalCn) menuModalCn.classList.remove("active");
    });
  }

  // 4. Chargement Menu FR
  fetch("menu.json")
    .then((res) => res.json())
    .then((data) => renderMenu(data, menuContent, "La carte évolue régulièrement au fil des arrivages et des saisons."))
    .catch((err) => console.error("Erreur chargement menu FR:", err));

  // 5. Chargement Menu CN
  fetch("menu_cn.json")
    .then((res) => res.json())
    .then((data) => renderMenu(data, menuContentCn, "菜品将根据当日新鲜食材与时令调整。"))
    .catch((err) => console.error("Erreur chargement menu CN:", err));

  // Fonction générique pour afficher le menu
  function renderMenu(data, targetContainer, noteText) {
    if (!data.categories || !targetContainer) return;

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

    html += `<p class="menu-note">${noteText}</p>`;
    targetContainer.innerHTML = html;
  }
});
