// Configuración de canales
const channels = [
  {
    name: "Canal Principal",
    url: "https://miztv.top/total/stream-524.php",
  },
  {
    name: "Canal Deportes",
    url: "https://miztv.top/total/stream-525.php",
  },
  {
    name: "Canal Noticias",
    url: "https://miztv.top/total/stream-41.php",
  },
  {
    name: "Canal Entretenimiento",
    url: "https://miztv.top/total/stream-42.php",
  },
];

// Variables globales
let currentChannelIndex = 0;
const iframe = document.getElementById("video-iframe");
const loading = document.getElementById("loading");
const currentChannelSpan = document.getElementById("current-channel");
const channelCounter = document.getElementById("channel-counter");
const channelItems = document.querySelectorAll(".channel-item");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// Función para cambiar canal
function changeChannel(index) {
  if (index < 0 || index >= channels.length) return;

  // Mostrar loading
  showLoading();

  // Actualizar índice actual
  currentChannelIndex = index;

  // Actualizar interfaz
  updateChannelInfo();
  updateActiveChannel();

  // Cambiar src del iframe
  setTimeout(() => {
    iframe.src = channels[index].url;

    // Simular tiempo de carga
    setTimeout(() => {
      hideLoading();
    }, 1500);
  }, 300);
}

// Función para mostrar loading
function showLoading() {
  loading.classList.remove("hidden");
  iframe.classList.remove("loaded");
}

// Función para ocultar loading
function hideLoading() {
  loading.classList.add("hidden");
  iframe.classList.add("loaded");
}

// Función para actualizar información del canal
function updateChannelInfo() {
  currentChannelSpan.textContent = channels[currentChannelIndex].name;
  channelCounter.textContent = `${currentChannelIndex + 1} de ${
    channels.length
  }`;
}

// Función para actualizar canal activo en la lista
function updateActiveChannel() {
  channelItems.forEach((item, index) => {
    if (index === currentChannelIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Event listeners para los elementos de canal
channelItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    changeChannel(index);
  });
});

// Event listeners para botones de control
prevBtn.addEventListener("click", () => {
  const newIndex =
    currentChannelIndex > 0 ? currentChannelIndex - 1 : channels.length - 1;
  changeChannel(newIndex);
});

nextBtn.addEventListener("click", () => {
  const newIndex =
    currentChannelIndex < channels.length - 1 ? currentChannelIndex + 1 : 0;
  changeChannel(newIndex);
});

// Event listeners para teclado
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "ArrowLeft":
      e.preventDefault();
      prevBtn.click();
      break;
    case "ArrowDown":
    case "ArrowRight":
      e.preventDefault();
      nextBtn.click();
      break;
    case "1":
    case "2":
    case "3":
    case "4":
      e.preventDefault();
      const channelNum = parseInt(e.key) - 1;
      if (channelNum >= 0 && channelNum < channels.length) {
        changeChannel(channelNum);
      }
      break;
  }
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Configurar canal inicial
  updateChannelInfo();
  updateActiveChannel();

  // Simular carga inicial
  setTimeout(() => {
    hideLoading();
  }, 2000);

  // Agregar efecto de hover a los botones
  const buttons = document.querySelectorAll(".control-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-2px)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0)";
    });
  });
});

// Función para manejar errores de carga del iframe
iframe.addEventListener("error", () => {
  console.error("Error cargando el canal:", channels[currentChannelIndex].name);
  // Podrías mostrar un mensaje de error aquí
});

// Función para detectar cuando el iframe ha cargado
iframe.addEventListener("load", () => {
  console.log("Canal cargado:", channels[currentChannelIndex].name);
});
