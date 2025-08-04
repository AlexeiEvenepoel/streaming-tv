// Script para generar todos los canales con logos
// Ejecutar en Node.js: node generate-all-channels.js

const fs = require("fs");

// URLs de todos los canales
const channelUrls = [
  "https://la14hd.com/vivo/canales.php?stream=espn",
  "https://la14hd.com/vivo/canales.php?stream=espn2",
  "https://la14hd.com/vivo/canales.php?stream=espn3",
  "https://la14hd.com/vivo/canales.php?stream=espn4",
  "https://la14hd.com/vivo/canales.php?stream=espn5",
  "https://la14hd.com/vivo/canales.php?stream=espn6",
  "https://la14hd.com/vivo/canales.php?stream=espn7",
  "https://la14hd.com/vivo/canales.php?stream=dsports",
  "https://la14hd.com/vivo/canales.php?stream=dsports2",
  "https://la14hd.com/vivo/canales.php?stream=dsportsplus",
  "https://la14hd.com/vivo/canales.php?stream=goltv",
  "https://la14hd.com/vivo/canales.php?stream=vtvplus",
  "https://la14hd.com/vivo/canales.php?stream=ecdf_ligapro",
  "https://la14hd.com/vivo/canales.php?stream=foxsports",
  "https://la14hd.com/vivo/canales.php?stream=foxsports2",
  "https://la14hd.com/vivo/canales.php?stream=foxsports3",
  "https://la14hd.com/vivo/canales.php?stream=tntsports",
  "https://la14hd.com/vivo/canales.php?stream=espnpremium",
  "https://la14hd.com/vivo/canales.php?stream=tycsports",
  "https://la14hd.com/vivo/canales.php?stream=tycinternacional",
  "https://la14hd.com/vivo/canales.php?stream=telefe",
  "https://la14hd.com/vivo/canales.php?stream=tvpublica",
  "https://la14hd.com/vivo/canales.php?stream=golperu",
  "https://la14hd.com/vivo/canales.php?stream=liga1max",
  "https://la14hd.com/vivo/canales.php?stream=movistar",
  "https://la14hd.com/vivo/canales.php?stream=winsportsplus",
  "https://la14hd.com/vivo/canales.php?stream=winsports2",
  "https://la14hd.com/vivo/canales.php?stream=winsports",
  "https://la14hd.com/vivo/canales.php?stream=foxsportsmx",
  "https://la14hd.com/vivo/canales.php?stream=foxsports2mx",
  "https://la14hd.com/vivo/canales.php?stream=foxsports3mx",
  "https://la14hd.com/vivo/canales.php?stream=foxsportspremium",
  "https://la14hd.com/vivo/canales.php?stream=tudn_mx",
  "https://la14hd.com/vivo/canales.php?stream=espnmx",
  "https://la14hd.com/vivo/canales.php?stream=espn2mx",
  "https://la14hd.com/vivo/canales.php?stream=espn3mx",
  "https://la14hd.com/vivo/canales.php?stream=espn4mx",
];

// Mapeo de logos
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
  foxsports: "https://img.golazoplay.com/uploads/fox_sports_1_7dbc294272.webp",
  foxsports2: "https://img.golazoplay.com/uploads/fox_sports_2_64ae4cc2b7.webp",
  foxsports3: "https://img.golazoplay.com/uploads/fox_sports_3_3c801c9d4c.webp",
};

// Función para obtener logo por canal
function getLogo(streamParam) {
  // Buscar logo exacto
  if (logoMap[streamParam]) {
    return logoMap[streamParam];
  }

  // Buscar por similitud
  if (streamParam.includes("espn")) return logoMap.espn;
  if (streamParam.includes("fox")) return logoMap.foxsports;
  if (streamParam.includes("dsports")) return logoMap.dsports;
  if (streamParam.includes("gol")) return logoMap.golperu;

  // Logo por defecto
  return logoMap.espn;
}

// Función para formatear nombre
function formatChannelName(streamParam) {
  const nameMap = {
    espn: "ESPN",
    espn2: "ESPN 2",
    espn3: "ESPN 3",
    espn4: "ESPN 4",
    espn5: "ESPN 5",
    espn6: "ESPN 6",
    espn7: "ESPN 7",
    espnmx: "ESPN México",
    espn2mx: "ESPN 2 México",
    espn3mx: "ESPN 3 México",
    espn4mx: "ESPN 4 México",
    espnpremium: "ESPN Premium",
    foxsports: "Fox Sports",
    foxsports2: "Fox Sports 2",
    foxsports3: "Fox Sports 3",
    foxsportsmx: "Fox Sports México",
    foxsports2mx: "Fox Sports 2 México",
    foxsports3mx: "Fox Sports 3 México",
    foxsportspremium: "Fox Sports Premium",
    dsports: "DSports",
    dsports2: "DSports 2",
    dsportsplus: "DSports+",
    golperu: "GolPerú",
    goltv: "GolTV",
    liga1max: "Liga1 MAX",
    movistar: "Movistar Deportes",
    tntsports: "TNT Sports",
    tycsports: "TyC Sports",
    tycinternacional: "TyC Internacional",
    winsports: "Win Sports",
    winsports2: "Win Sports 2",
    winsportsplus: "Win Sports+",
    tudn_mx: "TUDN México",
    vtvplus: "VTV+",
    ecdf_ligapro: "ECDF Liga Pro",
    telefe: "Telefe",
    tvpublica: "TV Pública",
  };

  return nameMap[streamParam] || streamParam.toUpperCase();
}

// Función para obtener categoría
function getCategory(streamParam) {
  if (streamParam.includes("espn")) return "ESPN";
  if (streamParam.includes("fox")) return "Fox Sports";
  if (streamParam.includes("dsports")) return "DSports";
  if (streamParam.includes("win")) return "Colombia";
  if (
    streamParam.includes("tyc") ||
    streamParam.includes("telefe") ||
    streamParam.includes("tvpublica")
  )
    return "Argentina";
  if (streamParam.includes("mx") || streamParam.includes("tudn"))
    return "México";
  if (
    streamParam.includes("gol") ||
    streamParam.includes("liga1") ||
    streamParam.includes("movistar")
  )
    return "Sudamérica";
  return "Premium";
}

// Función para obtener país
function getCountry(streamParam) {
  if (streamParam.includes("mx") || streamParam.includes("tudn"))
    return "México";
  if (
    streamParam.includes("tyc") ||
    streamParam.includes("telefe") ||
    streamParam.includes("tvpublica")
  )
    return "Argentina";
  if (streamParam.includes("win")) return "Colombia";
  if (
    streamParam.includes("golperu") ||
    streamParam.includes("liga1") ||
    streamParam.includes("movistar")
  )
    return "Perú";
  if (streamParam.includes("goltv") || streamParam.includes("ecdf"))
    return "Ecuador";
  if (streamParam.includes("vtv")) return "Venezuela";
  return "Internacional";
}

// Generar todos los canales
const channels = channelUrls.map((url) => {
  const urlObj = new URL(url);
  const streamParam = urlObj.searchParams.get("stream");

  return {
    id: streamParam,
    name: formatChannelName(streamParam),
    logo: getLogo(streamParam),
    url: url,
    category: getCategory(streamParam),
    country: getCountry(streamParam),
  };
});

// Crear objeto final
const channelsData = {
  channels: channels,
};

// Guardar archivo
fs.writeFileSync(
  "data/all-channels.json",
  JSON.stringify(channelsData, null, 2)
);

console.log(
  `✅ Generados ${channels.length} canales en data/all-channels.json`
);

// Mostrar resumen por categoría
const categories = {};
channels.forEach((channel) => {
  if (!categories[channel.category]) {
    categories[channel.category] = 0;
  }
  categories[channel.category]++;
});

console.log("\n📊 Resumen por categoría:");
Object.entries(categories).forEach(([category, count]) => {
  console.log(`  ${category}: ${count} canales`);
});

console.log(
  '\n🎯 Para usar este archivo, actualiza APP_CONFIG.channelsDataUrl a "data/all-channels.json"'
);
