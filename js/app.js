// Configuración de la aplicación
const APP_CONFIG = {
  channelsDataUrl: "data/channels-complete.json",
  defaultLogo: "assets/logos/default.png",
};

// Estado global de la aplicación
const AppState = {
  channels: [],
  filteredChannels: [],
  currentFilter: "all",
  isLoading: false,
};

// Clase principal de la aplicación
class FutbolLibreApp {
  constructor() {
    this.init();
  }

  async init() {
    try {
      await this.loadChannels();
      this.setupEventListeners();
      this.renderChannels();
      this.updateDateBanner();
    } catch (error) {
      console.error("Error inicializando la aplicación:", error);
      this.showError("Error cargando los canales");
    }
  }

  // Cargar datos de canales
  async loadChannels() {
    try {
      AppState.isLoading = true;
      this.showLoading();

      // Simular datos si no existe el archivo JSON
      const channelsData = await this.getChannelsData();
      AppState.channels = channelsData.channels || channelsData;
      AppState.filteredChannels = [...AppState.channels];

      AppState.isLoading = false;
      this.hideLoading();
    } catch (error) {
      AppState.isLoading = false;
      this.hideLoading();
      throw error;
    }
  }

  // Obtener datos de canales (con fallback)
  async getChannelsData() {
    try {
      const response = await fetch(APP_CONFIG.channelsDataUrl);
      if (!response.ok)
        throw new Error("No se pudo cargar el archivo de canales");
      return await response.json();
    } catch (error) {
      console.warn("Usando datos de canales por defecto");
      return this.getDefaultChannelsData();
    }
  }

  // Datos de canales por defecto
  getDefaultChannelsData() {
    const urls = [
      "https://la14hd.com/vivo/canales.php?stream=espn",
      "https://la14hd.com/vivo/canales.php?stream=espn2",
      "https://la14hd.com/vivo/canales.php?stream=espn3",
      "https://la14hd.com/vivo/canales.php?stream=foxsports",
      "https://la14hd.com/vivo/canales.php?stream=foxsports2",
      "https://la14hd.com/vivo/canales.php?stream=foxsports3",
      "https://la14hd.com/vivo/canales.php?stream=dsports",
      "https://la14hd.com/vivo/canales.php?stream=dsports2",
      "https://la14hd.com/vivo/canales.php?stream=golperu",
      "https://la14hd.com/vivo/canales.php?stream=goltv",
      "https://la14hd.com/vivo/canales.php?stream=tycsports",
      "https://la14hd.com/vivo/canales.php?stream=tntsports",
    ];

    return urls.map((url, index) => {
      const streamParam = new URL(url).searchParams.get("stream");
      return {
        id: streamParam,
        name: this.formatChannelName(streamParam),
        url: url,
        category: this.getChannelCategory(streamParam),
        country: "Internacional",
        logo: `assets/logos/${streamParam}.png`,
      };
    });
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
      golperu: "GolPerú",
      goltv: "GolTV",
      tycsports: "TyC Sports",
      tntsports: "TNT Sports",
    };
    return nameMap[streamParam] || streamParam.toUpperCase();
  }

  // Obtener categoría del canal
  getChannelCategory(streamParam) {
    if (streamParam.includes("espn")) return "ESPN";
    if (streamParam.includes("fox")) return "Fox Sports";
    if (streamParam.includes("dsports")) return "DSports";
    if (streamParam.includes("gol")) return "Sudamérica";
    return "Premium";
  }

  // Configurar event listeners
  setupEventListeners() {
    // Filtros de categoría
    const filterTabs = document.querySelectorAll(".filter-tab");
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const filter = e.target.dataset.filter;
        this.setActiveFilter(filter);
        this.filterChannels(filter);
      });
    });

    // Event listeners adicionales pueden ir aquí
  }

  // Renderizar canales
  renderChannels() {
    const grid = document.getElementById("channelsGrid");
    if (!grid) return;

    if (AppState.filteredChannels.length === 0) {
      grid.innerHTML = this.getEmptyStateHTML();
      return;
    }

    const channelsHTML = AppState.filteredChannels
      .map((channel) => this.createChannelCardHTML(channel))
      .join("");

    grid.innerHTML = channelsHTML;

    // Agregar event listeners a los botones
    this.attachChannelEventListeners();
  }

  // Crear HTML de tarjeta de canal
  createChannelCardHTML(channel) {
    const logoInitials = channel.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2);

    const hasLogo = channel.logo && channel.logo.startsWith("http");

    return `
            <div class="channel-card" data-channel-id="${channel.id}">
                <div class="status-indicator"></div>
                <div class="channel-header">
                    <div class="channel-logo">
                        ${
                          hasLogo
                            ? `<img src="${channel.logo}" alt="${channel.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                             <div class="channel-logo-placeholder" style="display:none;">${logoInitials}</div>`
                            : `<div class="channel-logo-placeholder">${logoInitials}</div>`
                        }
                    </div>
                    <div class="channel-name">${channel.name}</div>
                    <div class="channel-category">${channel.category}</div>
                </div>
                <div class="channel-body">
                    <p class="channel-description">
                        Ver ${channel.name} online en vivo y en directo.
                    </p>
                    <button class="channel-button" data-url="${
                      channel.url
                    }" data-name="${channel.name}">
                        Ver Canal
                    </button>
                </div>
            </div>
        `;
  }

  // Agregar event listeners a los canales
  attachChannelEventListeners() {
    const channelButtons = document.querySelectorAll(".channel-button");
    channelButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const url = e.target.dataset.url;
        const name = e.target.dataset.name;
        this.openChannel(url, name);
      });
    });
  }

  // Abrir canal en modal
  openChannel(url, name) {
    // Extraer parámetro stream de la URL
    try {
      const urlObj = new URL(url);
      const streamParam = urlObj.searchParams.get("stream");

      if (streamParam) {
        // Redirigir a la página del canal
        window.location.href = `canal.html?stream=${streamParam}`;
      } else {
        // Fallback: abrir en nueva ventana
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Error procesando URL del canal:", error);
      window.open(url, "_blank");
    }
  }

  // Filtrar canales
  filterChannels(filter) {
    if (filter === "all") {
      AppState.filteredChannels = [...AppState.channels];
    } else {
      AppState.filteredChannels = AppState.channels.filter(
        (channel) => channel.category === filter
      );
    }
    this.renderChannels();
  }

  // Establecer filtro activo
  setActiveFilter(filter) {
    AppState.currentFilter = filter;

    const filterTabs = document.querySelectorAll(".filter-tab");
    filterTabs.forEach((tab) => {
      tab.classList.remove("active");
      if (tab.dataset.filter === filter) {
        tab.classList.add("active");
      }
    });
  }

  // Mostrar loading
  showLoading() {
    const grid = document.getElementById("channelsGrid");
    if (grid) {
      grid.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>Cargando canales...</p>
                </div>
            `;
    }
  }

  // Ocultar loading
  hideLoading() {
    // El loading se oculta automáticamente al renderizar los canales
  }

  // Mostrar error
  showError(message) {
    const grid = document.getElementById("channelsGrid");
    if (grid) {
      grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <h3>Error</h3>
                    <p>${message}</p>
                </div>
            `;
    }
  }

  // HTML para estado vacío
  getEmptyStateHTML() {
    return `
            <div class="empty-state">
                <div class="empty-state-icon">📺</div>
                <h3>No hay canales disponibles</h3>
                <p>No se encontraron canales para el filtro seleccionado.</p>
            </div>
        `;
  }

  // Actualizar banner de fecha
  updateDateBanner() {
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
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new FutbolLibreApp();
});
