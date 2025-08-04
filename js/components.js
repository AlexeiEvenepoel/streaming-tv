// Componentes reutilizables y utilidades

// Utilidades para manejo de URLs
const URLUtils = {
  // Extraer parámetro stream de URL
  getStreamParam(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("stream");
    } catch (error) {
      return null;
    }
  },

  // Validar URL
  isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },
};

// Utilidades para localStorage
const StorageUtils = {
  // Guardar datos
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
      return false;
    }
  },

  // Cargar datos
  load(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error cargando de localStorage:", error);
      return null;
    }
  },

  // Eliminar datos
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error eliminando de localStorage:", error);
      return false;
    }
  },
};

// Componente de notificaciones
class NotificationManager {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    const container = document.createElement("div");
    container.className = "notification-container";
    container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
    document.body.appendChild(container);
    return container;
  }

  show(message, type = "info", duration = 3000) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
            background: ${this.getBackgroundColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            font-size: 14px;
            max-width: 300px;
        `;
    notification.textContent = message;

    this.container.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 10);

    // Auto-eliminar
    setTimeout(() => {
      this.remove(notification);
    }, duration);

    return notification;
  }

  remove(notification) {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  getBackgroundColor(type) {
    const colors = {
      success: "#4caf50",
      error: "#f44336",
      warning: "#ff9800",
      info: "#2196f3",
    };
    return colors[type] || colors.info;
  }
}

// Instancia global de notificaciones
const notifications = new NotificationManager();

// Componente de búsqueda
class SearchComponent {
  constructor(channels, onResults) {
    this.channels = channels;
    this.onResults = onResults;
    this.searchInput = null;
    this.init();
  }

  init() {
    this.createSearchInput();
    this.setupEventListeners();
  }

  createSearchInput() {
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";
    searchContainer.style.cssText = `
            margin: 20px 0;
            text-align: center;
        `;

    this.searchInput = document.createElement("input");
    this.searchInput.type = "text";
    this.searchInput.placeholder = "Buscar canales...";
    this.searchInput.className = "search-input";
    this.searchInput.style.cssText = `
            padding: 12px 20px;
            border: 2px solid var(--border-color);
            border-radius: 25px;
            font-size: 16px;
            width: 100%;
            max-width: 400px;
            outline: none;
            transition: border-color 0.3s ease;
        `;

    searchContainer.appendChild(this.searchInput);

    // Insertar después del título de la sección
    const sectionTitle = document.querySelector(".section-title");
    if (sectionTitle) {
      sectionTitle.parentNode.insertBefore(
        searchContainer,
        sectionTitle.nextSibling
      );
    }
  }

  setupEventListeners() {
    let searchTimeout;

    this.searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });

    this.searchInput.addEventListener("focus", () => {
      this.searchInput.style.borderColor = "var(--primary-color)";
    });

    this.searchInput.addEventListener("blur", () => {
      this.searchInput.style.borderColor = "var(--border-color)";
    });
  }

  performSearch(query) {
    if (!query.trim()) {
      this.onResults(this.channels);
      return;
    }

    const results = this.channels.filter(
      (channel) =>
        channel.name.toLowerCase().includes(query.toLowerCase()) ||
        channel.category.toLowerCase().includes(query.toLowerCase()) ||
        channel.country.toLowerCase().includes(query.toLowerCase())
    );

    this.onResults(results);
  }
}

// Utilidades de animación
const AnimationUtils = {
  // Fade in
  fadeIn(element, duration = 300) {
    element.style.opacity = "0";
    element.style.display = "block";

    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);

      element.style.opacity = opacity;

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },

  // Fade out
  fadeOut(element, duration = 300) {
    let start = null;
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = initialOpacity * (1 - Math.min(progress / duration, 1));

      element.style.opacity = opacity;

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = "none";
      }
    };

    requestAnimationFrame(animate);
  },

  // Slide in from bottom
  slideInFromBottom(element, duration = 300) {
    element.style.transform = "translateY(100%)";
    element.style.opacity = "0";
    element.style.display = "block";

    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);

      const translateY = 100 * (1 - percent);
      element.style.transform = `translateY(${translateY}%)`;
      element.style.opacity = percent;

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },
};

// Utilidades de validación
const ValidationUtils = {
  // Validar email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validar que no esté vacío
  isNotEmpty(value) {
    return value && value.trim().length > 0;
  },

  // Validar longitud mínima
  hasMinLength(value, minLength) {
    return value && value.length >= minLength;
  },
};

// Utilidades de formato
const FormatUtils = {
  // Capitalizar primera letra
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Formatear fecha
  formatDate(date, locale = "es-ES") {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  },

  // Truncar texto
  truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + "...";
  },
};

// Detector de dispositivo
const DeviceUtils = {
  // Detectar si es móvil
  isMobile() {
    return window.innerWidth <= 768;
  },

  // Detectar si es tablet
  isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  },

  // Detectar si es desktop
  isDesktop() {
    return window.innerWidth > 1024;
  },

  // Obtener tipo de dispositivo
  getDeviceType() {
    if (this.isMobile()) return "mobile";
    if (this.isTablet()) return "tablet";
    return "desktop";
  },
};

// Exportar utilidades globalmente
window.URLUtils = URLUtils;
window.StorageUtils = StorageUtils;
window.notifications = notifications;
window.AnimationUtils = AnimationUtils;
window.ValidationUtils = ValidationUtils;
window.FormatUtils = FormatUtils;
window.DeviceUtils = DeviceUtils;
