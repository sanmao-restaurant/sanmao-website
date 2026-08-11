document.addEventListener("DOMContentLoaded", () => {
  
  // 1. CHANGEMENT AUTOMATIQUE DU FOND DE PAGE (Mur + Calendrier du jour)
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  const bgBody = document.getElementById('bg-day');
  // Applique la photo du jour ex: photos/08-11.jpg
  bgBody.style.backgroundImage = `url('photos/${month}-${day}.jpg')`;

  // 2. CHARGEMENT DYNAMIQUE DU MENU
  fetch('menu.json')
    .then(response => response.json())
    .then(data => {
      const menuContainer = document.getElementById('menu-content');
      menuContainer.innerHTML = '';

      data.categories.forEach(category => {
        let sectionHtml = `<div class="menu-section"><h3>${category.name}</h3>`;
        category.items.forEach(item => {
          sectionHtml += `
            <div class="menu-item">
              <span>${item.title}</span>
              <span>${item.price}</span>
            </div>
          `;
        });
        sectionHtml += `</div>`;
        menuContainer.innerHTML += sectionHtml;
      });
    })
    .catch(error => console.error("Erreur de chargement du menu :", error));

  // 3. GESTION DU MENU EN OVERLAY (MOBILE)
  const menuOverlay = document.getElementById('menu-overlay');
  const openBtn = document.getElementById('open-menu-btn');
  const closeBtn = document.getElementById('close-menu-btn');

  if (openBtn) {
    openBtn.addEventListener('click', () => menuOverlay.classList.add('active'));
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => menuOverlay.classList.remove('active'));
  }
});