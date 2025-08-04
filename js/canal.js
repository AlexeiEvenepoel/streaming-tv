// JavaScript para la página individual del canal

class CanalPage {
  constructor() {
    this.channelData = null;
    this.streamParam = null;
    this.init();
  }

  async init() {
    try {
      // Obtener parámetro de la URL
      this.streamParam = this.getUrlParameter("stream");

      if (!this.streamParam) {
        this.showError("No se especificó un canal válido");
        return;
      }

      // Cargar datos del canal
      await this.loadChannelData();

      // Configurar la página
      this.setupPage();
      this.setupEventListeners();
      this.loadChannel();
    } catch (error) {
      console.error("Error inicializando la página del canal:", error);
      this.showError("Error cargando el canal");
    }
  }

  // Obtener parámetro de URL
  getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Cargar datos del canal
  async loadChannelData() {
    try {
      const response = await fetch("data/channels-complete.json");
      if (!response.ok)
        throw new Error("No se pudo cargar los datos de canales");

      const data = await response.json();
      this.channelData = data.channels.find(
        (channel) => channel.id === this.streamParam
      );

      if (!this.channelData) {
        // Crear datos por defecto si no se encuentra el canal
        this.channelData = this.createDefaultChannelData();
      }
    } catch (error) {
      console.warn("Usando datos por defecto para el canal");
      this.channelData = this.createDefaultChannelData();
    }
  }

  // Crear datos por defecto del canal
  createDefaultChannelData() {
    const logoMap = {
      golperu: "https://img.golazoplay.com/uploads/gol_peru_7167cd54dd.webp",
      liga1max: "https://img.golazoplay.com/uploads/liga_1_max_8d490f8b2e.webp",
      movistar:
        "https://img.golazoplay.com/uploads/movistar_deportes_2ca3b42a10.webp",
      dsports: "https://img.golazoplay.com/uploads/dsports_bea74cb844.webp",
      dsports2: "https://img.golazoplay.com/uploads/dsports_2_3481b3d20c.webp",
      dsportsplus:
        "https://img.golazoplay.com/uploads/dsports_plus_e24f78b7c0.webp",
      espn: "https://img.golazoplay.com/uploads/espn_16110aaa3a.webp",
      espn2: "https://img.golazoplay.com/uploads/espn_2_82441267e9.webp",
      espn3: "https://img.golazoplay.com/uploads/espn_3_0f4a5444d4.webp",
      foxsports:
        "https://img.golazoplay.com/uploads/fox_sports_1_7dbc294272.webp",
      foxsports2:
        "https://img.golazoplay.com/uploads/fox_sports_2_64ae4cc2b7.webp",
      foxsports3:
        "https://img.golazoplay.com/uploads/fox_sports_3_3c801c9d4c.webp",
    };

    return {
      id: this.streamParam,
      name: this.formatChannelName(this.streamParam),
      logo: logoMap[this.streamParam] || logoMap.espn,
      url: `https://la14hd.com/vivo/canales.php?stream=${this.streamParam}`,
      category: this.getChannelCategory(this.streamParam),
      country: "Internacional",
    };
  }

  // Formatear nombre del canal
  formatChannelName(streamParam) {
    const nameMap = {
      espn: "ESPN",
      espn2: "ESPN 2",
      espn3: "ESPN 3",
      foxsports: "Fox Sports",
      foxsports2: "Fox Sports 2",
      foxsports3: "Fox Sports 3",
      dsports: "DSports",
      dsports2: "DSports 2",
      dsportsplus: "DSports+",
      golperu: "GolPerú",
      goltv: "GolTV",
      liga1max: "Liga1 MAX",
      movistar: "Movistar Deportes",
    };
    return nameMap[streamParam] || streamParam.toUpperCase();
  }

  // Obtener categoría del canal
  getChannelCategory(streamParam) {
    if (streamParam.includes("espn")) return "ESPN";
    if (streamParam.includes("fox")) return "Fox Sports";
    if (streamParam.includes("dsports")) return "DSports";
    return "Premium";
  }

  // Configurar elementos de la página
  setupPage() {
    // Actualizar título de la página
    document.title = `${this.channelData.name} en vivo - Fútbol Libre Vivo`;
    document.getElementById(
      "pageTitle"
    ).textContent = `${this.channelData.name} - Fútbol Libre Vivo`;

    // Configurar logos tanto para desktop como móvil
    const canalLogo = document.getElementById("canalLogo");
    const canalLogoMobile = document.getElementById("canalLogoMobile");
    const canalName = document.getElementById("canalName");
    const canalNameMobile = document.getElementById("canalNameMobile");
    const canalDescription = document.getElementById("canalDescription");
    const canalNameText = document.getElementById("canalNameText");

    if (this.channelData) {
      // Desktop logo
      if (canalLogo && this.channelData.logo) {
        canalLogo.style.display = "block";
        canalLogo.src = this.channelData.logo;
        canalLogo.alt = this.channelData.name;

        canalLogo.addEventListener("error", () => {
          console.log("Error cargando logo desktop, usando placeholder");
          this.showLogoPlaceholder(canalLogo);
        });
      }

      // Mobile logo
      if (canalLogoMobile && this.channelData.logo) {
        canalLogoMobile.src = this.channelData.logo;
        canalLogoMobile.alt = this.channelData.name;

        canalLogoMobile.addEventListener("error", () => {
          console.log("Error cargando logo móvil, usando placeholder");
          this.showLogoPlaceholder(canalLogoMobile);
        });
      }

      // Nombres
      if (canalName) canalName.textContent = this.channelData.name;
      if (canalNameMobile) canalNameMobile.textContent = this.channelData.name;

      if (canalDescription) {
        canalDescription.textContent = `Ver ${this.channelData.name} en vivo por internet`;
      }

      if (canalNameText) {
        canalNameText.textContent = this.channelData.name;
      }
    }

    // Marcar enlace activo en el navbar
    this.setActiveNavLink();

    // Configurar funcionalidad móvil
    this.setupMobileFunctionality();
  }

  // Mostrar placeholder del logo
  showLogoPlaceholder(logoElement = null) {
    const targetLogo = logoElement || document.getElementById("canalLogo");
    const logoContainer = targetLogo?.parentElement;

    if (logoContainer) {
      // Ocultar imagen
      targetLogo.style.display = "none";

      // Crear placeholder si no existe
      let placeholder = logoContainer.querySelector(".logo-placeholder");
      if (!placeholder) {
        placeholder = document.createElement("div");
        placeholder.className = "logo-placeholder";

        const initials = this.channelData.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .substring(0, 2);

        placeholder.textContent = initials;

        // Ajustar tamaño según el contenedor
        const isSmall = logoContainer.classList.contains("canal-logo-small");
        const size = isSmall ? "40px" : "60px";
        const fontSize = isSmall ? "14px" : "18px";

        placeholder.style.cssText = `
          width: ${size};
          height: ${size};
          background: linear-gradient(135deg, #2e7d32, #4caf50);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: ${fontSize};
        `;

        logoContainer.appendChild(placeholder);
      }

      placeholder.style.display = "flex";
    }
  }

  // Marcar enlace activo en navbar
  setActiveNavLink() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      const linkUrl = new URL(link.href);
      const linkStream = linkUrl.searchParams.get("stream");

      if (linkStream === this.streamParam) {
        link.classList.add("active");
        link.style.backgroundColor = "rgba(46, 125, 50, 0.1)";
        link.style.color = "var(--primary-color)";
      }
    });
  }

  // Configurar event listeners
  setupEventListeners() {
    // Botón de pantalla completa
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());
    }

    // Detectar cuando el iframe carga
    const iframe = document.getElementById("canalIframe");
    if (iframe) {
      iframe.addEventListener("load", () => this.hideLoading());
    }

    // Tecla Escape para salir de pantalla completa
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
      }
    });
  }

  // Funcionalidades adicionales para móvil
  setupMobileFunctionality() {
    // Botón de volver móvil
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.history.back();
      });
    }

    // Botón de pantalla completa móvil
    const fullscreenBtnMobile = document.getElementById("fullscreenBtnMobile");
    if (fullscreenBtnMobile) {
      fullscreenBtnMobile.addEventListener("click", () => {
        this.toggleFullscreen();
      });
    }

    // Botón de compartir
    const shareBtn = document.getElementById("shareBtn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        this.shareChannel();
      });
    }

    // Detectar orientación en móvil
    this.handleOrientationChange();
    window.addEventListener("orientationchange", () => {
      setTimeout(() => this.handleOrientationChange(), 100);
    });
  }

  // Manejar cambio de orientación
  handleOrientationChange() {
    const isMobile = window.innerWidth <= 768;
    const isLandscape = window.innerHeight < window.innerWidth;

    if (isMobile && isLandscape) {
      // En landscape móvil, hacer el header más compacto
      document.body.classList.add("mobile-landscape");
    } else {
      document.body.classList.remove("mobile-landscape");
    }
  }

  // Compartir canal
  shareChannel() {
    const channelName = this.channelData?.name || "Canal";
    const channelUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: `Ver ${channelName} en vivo`,
          text: `Mira ${channelName} en vivo en Fútbol Libre Vivo`,
          url: channelUrl,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard
        .writeText(channelUrl)
        .then(() => {
          this.showToast("Enlace copiado al portapapeles", "success");
        })
        .catch(() => {
          this.showToast("Error al copiar enlace", "error");
        });
    }
  }

  // Sistema de toast simple
  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${
        type === "success"
          ? "#4caf50"
          : type === "error"
          ? "#f44336"
          : "#2196f3"
      };
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Cargar canal en iframe
  loadChannel() {
    const iframe = document.getElementById("canalIframe");
    const loadingOverlay = document.getElementById("loadingOverlay");

    if (!iframe) return;

    // Mostrar loading
    if (loadingOverlay) {
      loadingOverlay.classList.remove("hidden");
    }

    // Cargar canal
    iframe.src = this.channelData.url;

    // Ocultar loading después de un tiempo
    setTimeout(() => {
      this.hideLoading();
    }, 3000);
  }

  // Ocultar loading
  hideLoading() {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
      loadingOverlay.classList.add("hidden");
    }
  }

  // Toggle pantalla completa
  toggleFullscreen() {
    const playerContainer = document.querySelector(".player-container");

    if (!document.fullscreenElement) {
      if (playerContainer.requestFullscreen) {
        playerContainer.requestFullscreen();
      } else if (playerContainer.webkitRequestFullscreen) {
        playerContainer.webkitRequestFullscreen();
      } else if (playerContainer.msRequestFullscreen) {
        playerContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  // Mostrar error
  showError(message) {
    const main = document.querySelector(".main .container");
    if (main) {
      main.innerHTML = `
        <div class="error-state">
          <div class="error-icon">⚠️</div>
          <h2>Error</h2>
          <p>${message}</p>
          <a href="index.html" class="btn-primary">Volver al Inicio</a>
        </div>
      `;
    }
  }
}

// Función para actualizar fecha automáticamente
function updateDateBanner() {
  const dateBanner = document.querySelector(".date-banner span");
  if (dateBanner) {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateString = now.toLocaleDateString("es-ES", options);
    dateBanner.textContent = `Agenda - ${dateString}`;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new CanalPage();
  updateDateBanner();
});
