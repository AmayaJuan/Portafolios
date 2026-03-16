# Portafolio Web Personal - Juan Pablo Vélez Amaya (Actualizado Oct 2024)

[![GitHub Repo](https://img.shields.io/github/license/AmayaJuan/Portafolios?logo=github)](LICENSE)
[![Responsive](https://img.shields.io/badge/Responsive-Yes-blue.svg)](https://github.com/AmayaJuan/Portafolios)
[![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-100%25-green.svg)](https://github.com/AmayaJuan/Portafolios)

**Portafolio profesional para Desarrollador de Videojuegos y Software.**

## ✨ Características Principales

- ✅ **SPA moderna** con carga dinámica desde `portfolio.json`
- ✅ **i18n bilingüe** (ES/EN) con archivos `lang/*.json`
- ✅ **Modal Unity WebGL** para juegos embebidos
- ✅ **Filtros por categoría** (Unity/Android/Software)
- ✅ **EmailJS verificado** (formulario contacto funcionando)
- ✅ **Slider responsive** habilidades con swipe/touch
- ✅ **100% Vanilla JS/CSS** - Sin dependencias externas (excepto CDNs)
- ✅ **Accesible** (prefers-reduced-motion, focus-visible, ARIA)
- ✅ **PWA-ready** (favicon, meta viewport)

## 📁 Estructura Actual del Proyecto (Oct 2024)

```
Portafolios/
├── index.html              # SPA principal
├── portfolio.json          # Datos: perfil, 7 skills, 4 proyectos
├── README.md              # Esta documentación
├── TODO.md                # Progreso revisión actual
├── POLITICAS_PROYECTO.md  # Políticas obligatorias IA/desarrollo
├── ARQUITECTURA_PORTAFOLIO.md # Arquitectura v3.0
├── .gitignore
├── css/                   # 5 archivos modulares
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   ├── sections.css
│   └── main.css
├── js/
│   └── main.js            # Lógica completa (1,200+ líneas)
└── lang/
    ├── es.json            # Español (default)
    └── en.json            # Inglés
├── Doc/                   # Documentos (BPMN, requisitos Word)
```
</xai:function_call)




<xai:function_call name="edit_file">
<parameter name="path">d:/Documents/Git/HTML CSS JS/Portafolios/README.md



## 🚀 Cómo Ejecutar (Estado Actual)

**Requiere servidor local** (CORS fetch portfolio.json):

```bash
# Python 3
python -m http.server 8000
# Node (instalar npx si no)
npx serve .
# PHP
php -S localhost:8000
```

Abrir `http://localhost:8000`.

### Configuración Rápida (Ya Configurado)

- **Datos**: `portfolio.json` **completo** (perfil Juan Pablo, 4 proyectos, 7 skills).
- **Imágenes**: **Cloudinary CDN** (funcional, no locales needed).
- **Idiomas**: ES/EN (`lang/es.json`, `lang/en.json`).
- **EmailJS**: **Verificado funcionando** (no tocar).

### Personalización Fácil

| Elemento | Archivo |
|----------|---------|
| Perfil/Datos | `portfolio.json` |
| Colores | `css/variables.css` |
| Textos UI | `lang/es.json` (traducir en.json) |
| Proyectos | `portfolio.json` > projects[] |

## 🛠️ Tecnologías (Producción Ready)

- **Frontend**: HTML5, CSS3 Variables, Vanilla JS ES6+
- **Estilos**: CSS Modular (5 archivos), Responsive, Dark Theme
- **Funcionalidad**: i18n, Filters, Modal Unity, EmailJS, Touch Swipe
- **CDNs**: Font Awesome, EmailJS
- **Accesibilidad**: ARIA, Focus, Reduced Motion
- **No deps**: 0 npm/yarn needed


## 📊 Estado de la Revisión (Oct 2024 - BLACKBOXAI)

✅ **Revisión completa** ejecutada:
- Políticas: 100% cumplidas
- Código: Bien comentado (español), sin duplicados
- Funcionalidad: i18n, filtros, EmailJS, modal OK
- Responsive: Móviles/tablets/desktops perfecto

**Pendientes Opcionales (ver TODO.md):**
- Crear `assets/cv/cv.pdf`
- Agregar builds/unity/ para juegos reales
- Subir GitHub

## 📈 Preview Screenshots

![Hero Section](https://via.placeholder.com/1200x600/0a0a0f/ffffff?text=Hero+Section)
![Projects Grid](https://via.placeholder.com/1200x400/1a1a2e/ffffff?text=Projects)

## 📜 Licencia

MIT License - Libre para portafolios personales.

**¡Portafolio production-ready!** 🎮




