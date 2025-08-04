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
    document.title = `${this.channelData.name} en vivo - Fútbol Libre TV`;
    document.getElementById(
      "pageTitle"
    ).textContent = `${this.channelData.name} - Fútbol Libre TV`;

    // Actualizar información del canal
    const canalLogo = document.getElementById("canalLogo");
    const canalName = document.getElementById("canalName");
    const canalDescription = document.getElementById("canalDescription");
    const canalNameText = document.getElementById("canalNameText");

    if (canalLogo && this.channelData.logo) {
      canalLogo.src = this.channelData.logo;
      canalLogo.alt = this.channelData.name;
    }

    if (canalName) {
      canalName.textContent = this.channelData.name;
    }

    if (canalDescription) {
      canalDescription.textContent = `Ver ${this.channelData.name} en vivo por internet`;
    }

    if (canalNameText) {
      canalNameText.textContent = this.channelData.name;
    }

    // Marcar enlace activo en el navbar
    this.setActiveNavLink();
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
