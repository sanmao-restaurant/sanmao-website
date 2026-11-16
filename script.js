document.addEventListener("DOMContentLoaded", () => {
  const heroBg = document.getElementById("hero-bg");
  
  // Éléments À MANGER
  const menuContent = document.getElementById("menu-content");
  const menuModal = document.getElementById("menu-modal");
  const btnOpenMenu = document.getElementById("btn-open-menu");
  const btnCloseMenu = document.getElementById("btn-close-menu");

  // Éléments À BOIRE
  const menuContentCn = document.getElementById("menu-content-cn");
  const menuModalCn = document.getElementById("menu-modal-cn");
  const btnOpenMenuCn = document.getElementById("btn-open-menu-cn");
  const btnCloseMenuCn = document.getElementById("btn-close-menu-cn");

  // 1. Photo du jour
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

  // 2. Modale À MANGER
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

  // 3. Modale À BOIRE
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

  const cacheBuster = new Date().getTime();

  // 4. Chargement À MANGER (sans en-têtes de catégories : false)
  fetch(`menu.json?v=${cacheBuster}`)
    .then((res) => {
      if (!res.ok) throw new Error("Fichier menu.json introuvable");
      return res.json();
    })
    .then((data) => renderMenu(
      data, 
      menuContent, 
      "La carte évolue régulièrement au fil des arrivages et des saisons.<br>菜品将根据当日新鲜食材与时令调整。",
      false
    ))
    .catch((err) => {
      console.error("Erreur À MANGER:", err);
      if (menuContent) menuContent.innerHTML = "<p style='text-align:center;'>Carte indisponible.</p>";
    });

  // 5. Chargement À BOIRE (avec en-têtes de catégories : true)
  fetch(`menu_cn.json?v=${cacheBuster}`)
    .then((res) => {
      if (!res.ok) throw new Error("Fichier menu_cn.json introuvable");
      return res.json();
    })
    .then((data) => renderMenu(
      data, 
      menuContentCn, 
      "L'abus d'alcool est dangereux pour la santé, à consommer avec modération.",
      true
    ))
    .catch((err) => {
      console.error("Erreur À BOIRE:", err);
      if (menuContentCn) menuContentCn.innerHTML = "<p style='text-align:center;'>Carte des boissons indisponible.</p>";
    });

  // Fonction générique de rendu
  function renderMenu(data, targetContainer, noteText, showHeaders) {
    if (!data || !data.categories || !targetContainer) return;

    let html = "";
    data.categories.forEach((cat) => {
      html += `<div class="menu-category">`;
      if (showHeaders && cat.name) {
        html += `<h2>${cat.name}</h2>`;
      }
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
