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

  // 1. Alignement forcé des logos (sanmao centré avec le lapin)
  const logosHeader = document.querySelector(".menu-logos-header");
  const logoLapin = document.getElementById("logo-lapin");
  const logoSanmao = document.getElementById("logo-sanmao-stamp");

  if (logosHeader) {
    logosHeader.querySelectorAll("br").forEach((br) => br.remove());
    logosHeader.style.display = "flex";
    logosHeader.style.justifyContent = "space-between";
    logosHeader.style.alignItems = "center";
    logosHeader.style.marginTop = "2px";
    logosHeader.style.marginBottom = "14px";
  }

  function appliquerTaillesLogos() {
    const isMobile = window.innerWidth <= 768;
    if (logoLapin) {
      logoLapin.style.height = isMobile ? "50px" : "62px";
      logoLapin.style.width = "auto";
      logoLapin.style.margin = "0";
      logoLapin.style.display = "block";
    }
    if (logoSanmao) {
      logoSanmao.style.width = isMobile ? "110px" : "138px";
      logoSanmao.style.height = "auto";
      logoSanmao.style.margin = "0";
      logoSanmao.style.display = "block";
    }
  }

  appliquerTaillesLogos();
  window.addEventListener("resize", appliquerTaillesLogos);

  // 2. Détourage automatique du fond crème et recadrage des logos
  function detourerEtRecadrer(imgElement) {
    if (!imgElement) return;

    const processImage = () => {
      if (!imgElement.naturalWidth || imgElement.dataset.processed === "true") return;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const w = imgElement.naturalWidth;
      const h = imgElement.naturalHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(imgElement, 0, 0);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;

      const sampleOffset = (15 * w + 15) * 4;
      const bgR = data[sampleOffset] || data[0];
      const bgG = data[sampleOffset + 1] || data[1];
      const bgB = data[sampleOffset + 2] || data[2];

      let minX = w, minY = h, maxX = 0, maxY = 0;
      let hasInk = false;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;

          if (x < 14 || x >= w - 14 || y < 14 || y >= h - 14) {
            data[i + 3] = 0;
            continue;
          }

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const dist = Math.sqrt(
            (r - bgR) * (r - bgR) +
            (g - bgG) * (g - bgG) +
            (b - bgB) * (b - bgB)
          );

          if (dist < 34) {
            data[i + 3] = 0;
          } else if (dist < 66) {
            data[i + 3] = Math.round(((dist - 34) / 32) * 255);
          }

          if (data[i + 3] > 20) {
            hasInk = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      if (hasInk && maxX > minX && maxY > minY) {
        const cropW = maxX - minX + 1;
        const cropH = maxY - minY + 1;
        const cropCanvas = document.createElement("canvas");
        cropCanvas.width = cropW;
        cropCanvas.height = cropH;
        const cropCtx = cropCanvas.getContext("2d");
        cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

        imgElement.dataset.processed = "true";
        imgElement.src = cropCanvas.toDataURL("image/png");
      }
    };

    if (imgElement.complete) {
      processImage();
    } else {
      imgElement.addEventListener("load", processImage);
    }
  }

  detourerEtRecadrer(logoLapin);
  detourerEtRecadrer(logoSanmao);

  // 3. Photo du jour
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

  // 4. Modale À MANGER
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

  // 5. Modale À BOIRE
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

  function fetchSafeJson(filename) {
    return fetch(`${filename}?v=${cacheBuster}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Fichier "${filename}" introuvable (erreur ${res.status})`);
        return res.text();
      })
      .then((rawText) => {
        const cleaned = rawText.replace(/,\s*([\]}])/g, "$1");
        return JSON.parse(cleaned);
      });
  }

  // 6. Chargement À MANGER (sans en-têtes : false)
  fetchSafeJson("menu.json")
    .then((data) => renderMenu(
      data, 
      menuContent, 
      "Les plats évoluent selon les arrivages frais et les saisons<br>菜品将根据当日新鲜食材与时令调整",
      false
    ))
    .catch((err) => {
      console.error("Erreur À MANGER:", err);
      if (menuContent) menuContent.innerHTML = `<p style="text-align:center;">Carte indisponible.<br><small style="opacity:0.6;">${err.message}</small></p>`;
    });

  // 7. Chargement À BOIRE (avec en-têtes : true)
  fetchSafeJson("menu_cn.json")
    .then((data) => renderMenu(
      data, 
      menuContentCn, 
      "L'abus d'alcool est dangereux pour la santé, à consommer avec modération.",
      true
    ))
    .catch((err) => {
      console.error("Erreur À BOIRE:", err);
      if (menuContentCn) menuContentCn.innerHTML = `<p style="text-align:center;">Carte des boissons indisponible.<br><small style="opacity:0.6;">${err.message}</small></p>`;
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

    html += `<p class="menu-note" style="margin-top: 44px;">${noteText}</p>`;
    targetContainer.innerHTML = html;
  }
});
