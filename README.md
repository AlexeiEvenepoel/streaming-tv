# Fútbol Libre TV

Una aplicación web moderna para ver canales de fútbol en vivo, inspirada en el diseño de la14hd.com.

## 🚀 Características

- **Interfaz moderna y responsiva** - Diseño limpio inspirado en servicios de streaming
- **Grid de canales** - Visualización organizada de todos los canales disponibles
- **Filtros por categoría** - ESPN, Fox Sports, DSports, Sudamérica, Premium
- **Modal de reproductor** - Experiencia de visualización inmersiva
- **Búsqueda de canales** - Encuentra rápidamente el canal que buscas
- **Responsive design** - Funciona perfectamente en móviles, tablets y desktop

## 📁 Estructura del Proyecto

```
futbol-libre-tv/
├── index.html              # Página principal
├── css/
│   ├── styles.css          # Estilos principales
│   └── components.css      # Estilos de componentes
├── js/
│   ├── app.js             # Lógica principal de la aplicación
│   └── components.js      # Componentes y utilidades
├── data/
│   └── channels.json      # Datos de canales
├── assets/
│   └── logos/             # Logos de canales
└── README.md
```

## 🛠️ Instalación y Uso

1. **Clonar o descargar** el proyecto
2. **Abrir** `index.html` en tu navegador
3. **¡Listo!** - No requiere instalación adicional

### Para desarrollo local:

```bash
# Servir con un servidor local (opcional)
python -m http.server 8000
# o
npx serve .
```

## 📺 Canales Incluidos

La aplicación incluye más de 100 canales organizados por categorías:

- **ESPN** - ESPN, ESPN 2, ESPN 3, ESPN 4, etc.
- **Fox Sports** - Fox Sports, Fox Sports 2, Fox Sports 3
- **DSports** - DSports, DSports 2, DSports+
- **Sudamérica** - GolTV, GolPerú, TyC Sports, etc.
- **Premium** - TNT Sports, Liga de Campeones, etc.

## 🎨 Personalización

### Agregar nuevos canales:

Edita el archivo `data/channels.json`:

```json
{
  "channels": [
    {
      "id": "nuevo-canal",
      "name": "Nuevo Canal",
      "logo": "assets/logos/nuevo-canal.png",
      "url": "https://ejemplo.com/canal",
      "category": "Categoría",
      "country": "País"
    }
  ]
}
```

### Cambiar estilos:

- **Colores principales**: Edita las variables CSS en `css/styles.css`
- **Componentes**: Modifica `css/components.css`
- **Responsive**: Los breakpoints están en ambos archivos CSS

## 🔧 Funcionalidades Técnicas

- **Carga dinámica** de canales desde JSON
- **Filtrado en tiempo real** por categorías
- **Modal responsive** para reproductor
- **Manejo de errores** y estados de carga
- **LocalStorage** para preferencias (futuro)
- **Animaciones CSS** suaves
- **Optimizado para SEO**

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge
- ✅ iOS Safari, Chrome Mobile
- ✅ Responsive design (320px - 1920px+)
- ✅ Touch-friendly en móviles

## 🚀 Despliegue

### Netlify (Recomendado):

- **Branch to deploy:** `master`
- **Build command:** (vacío)
- **Publish directory:** `.`

### Otros servicios:

- GitHub Pages
- Vercel
- Firebase Hosting

## 📄 Licencia

Este proyecto es de código abierto. Puedes usarlo, modificarlo y distribuirlo libremente.

## 🤝 Contribuciones

Las contribuciones son bienvenidas:

1. Fork del proyecto
2. Crear rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor crea un issue en el repositorio.

---

**Desarrollado con ❤️ para la comunidad del fútbol libre**
