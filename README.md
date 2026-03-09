# Portafolio Web Personal

Portafolio profesional para desarrollador de videojuegos y software construido con HTML, CSS y JavaScript vanilla.

## Características

- ✅ Diseño moderno y responsivo
- ✅ Carga dinámica de proyectos desde JSON
- ✅ Integración con juegos WebGL de Unity
- ✅ Filtrado de proyectos por categoría (Unity, Android, Software)
- ✅ Formulario de contacto con EmailJS
- ✅ Descarga de CV
- ✅ Tema oscuro con variables CSS
- ✅ Animaciones suaves
- ✅ Accesibilidad mejorada

## Estructura del Proyecto

```
portfolio/
├── index.html              # Página principal (SPA)
├── portfolio.json          # Datos del portafolio (perfil, proyectos, habilidades)
├── README.md               # Documentación del proyecto
├── POLITICAS_PROYECTO.md   # Políticas de desarrollo
├── ARQUITECTURA_PORTAFOLIO.md # Documentación de arquitectura
├── assets/                 # Recursos estáticos
│   ├── img/
│   │   ├── profile/        # Foto de perfil (avatar.jpg)
│   │   ├── projects/       # Imágenes de proyectos
│   │   │   ├── unity/
│   │   │   ├── android/
│   │   │   └── software/
│   │   └── skills/         # Iconos de tecnologías (SVG)
│   ├── cv/                 # Currículum Vitae (cv.pdf)
│   └── favicon.ico
├── builds/                 # Juegos WebGL de Unity
│   └── unity/
│       ├── nombre-juego-1/
│       └── nombre-juego-2/
├── css/                    # Estilos
│   ├── variables.css       # Variables CSS (colores, espaciado)
│   ├── base.css            # Estilos base y reset
│   ├── components.css      # Componentes reutilizables
│   ├── sections.css        # Estilos por sección
│   └── main.css            # Archivo principal (importa todos)
├── js/                     # JavaScript
│   └── main.js             # Lógica principal de la aplicación
└── Doc/                    # Documentación adicional
```

## Configuración

### 1. Datos del Portafolio

Edita el archivo `portfolio.json` con tu información personal:

```json
{
  "profile": {
    "name": "Tu Nombre",
    "title": "Desarrollador de Videojuegos",
    "tagline": "Tu eslogan personal",
    "bio": "Tu biografía breve",
    "avatar": "assets/img/profile/avatar.jpg",
    "location": "Tu ciudad, País",
    "email": "tu@email.com",
    "social": {
      "github": "https://github.com/tuusuario",
      "gitlab": "https://gitlab.com/tuusuario",
      "linkedin": "https://linkedin.com/in/tuusuario",
      "itchio": "https://tuusuario.itch.io"
    }
  },
  "skills": [
    {
      "name": "Unity",
      "category": "engine",
      "icon": "assets/img/skills/unity.svg",
      "level": 90
    }
  ],
  "projects": [
    {
      "id": "proyecto-01",
      "name": "Nombre del Proyecto",
      "category": "unity",
      "shortDescription": "Descripción breve",
      "description": "Descripción completa",
      "thumbnail": "assets/img/projects/unity/proyecto-thumb.jpg",
      "technologies": ["Unity", "C#"],
      "featured": true,
      "links": {
        "play": "builds/unity/proyecto/index.html",
        "github": "https://github.com/tuusuario/proyecto",
        "download": null
      },
      "year": "2024"
    }
  ]
}
```

### 2. Imágenes Requeridas

| Carpeta | Archivo | Descripción |
|---------|---------|-------------|
| `assets/img/profile/` | `avatar.jpg` | Foto de perfil |
| `assets/cv/` | `cv.pdf` | Currículum Vitae |

### 3. Proyectos

Para agregar proyectos:

1. Crea una carpeta en `assets/img/projects/[categoria]/`
2. Agrega las imágenes del proyecto
3. Añade la entrada en `portfolio.json`

Categorías disponibles: `unity`, `android`, `software`

### 4. Integrar Juegos Unity WebGL

1. Exporta tu juego desde Unity como WebGL
2. Copia la carpeta de exportación a `builds/unity/[nombre-del-juego]/`
3. Actualiza los enlaces en `portfolio.json`

## Ejecutar Localmente

El portafolio requiere un servidor web (debido a CORS con fetch):

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

## Personalización

### Colores

Edita las variables CSS en `css/variables.css`:

```css
:root {
    --color-accent: #6366f1;
    --color-bg-primary: #0a0a0f;
    --color-bg-secondary: #121218;
    --color-text-primary: #ffffff;
}
```

### Secciones

El orden de las secciones se controla en `index.html`. Reordena los elementos `<section>` según prefieras.

## Tecnologías Usadas

- **HTML5** - Estructura semántica
- **CSS3** - Variables CSS, Flexbox, Grid, Animaciones
- **JavaScript (ES6+)** - Vanilla JS sin frameworks
- **Font Awesome 6.4** - Iconos
- **EmailJS** - Formulario de contacto
- **Unity WebGL** - Juegos integrados

## Variables de Estado

El código JavaScript utiliza un objeto de estado:

```javascript
const state = {
    data: null,           // Datos del portafolio
    currentFilter: 'all',  // Filtro de proyectos activo
    isLoading: true       // Estado de carga
};
```

## Funciones Principales

| Función | Descripción |
|---------|-------------|
| `loadPortfolioData()` | Carga datos desde JSON |
| `renderProfile(data)` | Renderiza información del perfil |
| `renderProjects(projects)` | Renderiza tarjetas de proyectos |
| `renderSkills(skills)` | Renderiza habilidades técnicas |
| `filterProjects(category)` | Filtra proyectos por categoría |
| `setupContactForm()` | Configura formulario con EmailJS |

## Políticas del Proyecto

Este proyecto sigue políticas específicas de desarrollo. Ver `POLITICAS_PROYECTO.md` para más información.

### Reglas Principales

1. Si algo funciona: NO modificarlo
2. Si no fue solicitado: NO implementarlo
3. Si no estás seguro: PREGUNTAR primero
4. Toda modificación requiere confirmación previa

## Estructura de Datos JSON

```json
{
  "profile": { ... },      // Datos personales
  "skills": [ ... ],       // Array de habilidades
  "projects": [ ... ],     // Array de proyectos
  "experience": [ ... ],   // Experiencia laboral
  "contact": { ... },      // Configuración de contacto
  "cv": { ... },           // Configuración del CV
  "settings": { ... }      // Ajustes del sitio
}
```

## Licencia

MIT License - Libre para usar y modificar.

---

**Desarrollado por Juan Pablo Velez Amaya** - Desarrollador de Software y Videojuegos

