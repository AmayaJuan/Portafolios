# Arquitectura Optimizada - Portafolio Web Personal v3.0

---

## 1. Resumen de Cambios Realizados

### Problemas Detectados en la Arquitectura Original

| Problema | Solución |
|----------|----------|
| Múltiples archivos JSON separados | Unificado en un solo `portfolio.json` |
| Múltiples páginas HTML | SPA con navegación dinámica |
| Componentes JS excesivamente fragmentados | Unificado en un solo `main.js` |
| Estructura de CSS innecesariamente compleja | Consolidado en 5 archivos lógicos |
| Documentación extensa en carpeta docs/ | Eliminada (mantener solo README) |

### Principios Aplicados

- **KISS**: Simplicidad extrema para un portafolio personal
- **DRY**: No repetir código HTML, todo es dinámico
- **YAGNI**: Solo crear lo que realmente se usará
- **Separation of Concerns**: Datos → Lógica → Presentación

---

## 2. Arquitectura Final del Proyecto

```
portfolio/                          # Raíz del proyecto
│
├── index.html                      # Página única (SPA)
├── portfolio.json                  # Datos centralizados
├── README.md                       # Documentación
├── .gitignore                      # Ignorar archivos
│
├── assets/                         # Recursos estáticos
│   ├── img/
│   │   ├── profile/
│   │   │   └── avatar.jpg          # Tu foto de perfil
│   │   ├── projects/
│   │   │   ├── unity/
│   │   │   │   ├── game-01-thumb.jpg
│   │   │   │   └── game-01-screen.jpg
│   │   │   ├── android/
│   │   │   │   └── app-01-thumb.jpg
│   │   │   └── software/
│   │   │       └── app-01-thumb.jpg
│   │   └── skills/
│   │       ├── unity.svg
│   │       ├── csharp.svg
│   │       └── android.svg
│   │
│   ├── cv/
│   │   └── cv.pdf                  # Tu Currículum
│   │
│   └── favicon.ico                  # Favicon
│
├── builds/                         # Juegos WebGL de Unity
│   └── unity/
│       ├── space-shooter/           # Juego 1
│       │   ├── index.html           # Entry point
│       │   ├── Build/
│       │   ├── TemplateData/
│       │   └── thumbnail.jpg
│       │
│       └── puzzle-game/             # Juego 2
│           ├── index.html
│           ├── Build/
│           ├── TemplateData/
│           └── thumbnail.jpg
│
├── css/                            # Estilos CSS
│   ├── variables.css               # Variables CSS (colores, fuentes)
│   ├── base.css                    # Reset y estilos base
│   ├── components.css              # Componentes reutilizables
│   ├── sections.css                # Estilos por sección
│   └── main.css                    # Archivo principal (importa todo)
│
└── js/                             # JavaScript
    └── main.js                     # Lógica completa (unificado)
```

---

## 3. Ejemplo del Archivo `portfolio.json`

```json
{
  "profile": {
    "name": "Tu Nombre",
    "title": "Desarrollador de Software y Videojuegos",
    "tagline": "Creando experiencias interactivas",
    "bio": "Descripción breve sobre ti...",
    "avatar": "assets/img/profile/avatar.jpg",
    "location": "Ciudad, País",
    "email": "tuemail@ejemplo.com",
    "social": {
      "github": "https://github.com/tuusuario",
      "linkedin": "https://linkedin.com/in/tuusuario",
      "itchio": "https://tuusuario.itch.io"
    }
  },
  "skills": [
    {
      "name": "Unity",
      "icon": "assets/img/skills/unity.svg",
      "level": 90
    },
    {
      "name": "C#",
      "icon": "assets/img/skills/csharp.svg",
      "level": 85
    }
  ],
  "projects": [
    {
      "id": "unity-01",
      "name": "Space Shooter",
      "category": "unity",
      "description": "Descripción del proyecto...",
      "thumbnail": "assets/img/projects/unity/game-01-thumb.jpg",
      "technologies": ["Unity", "C#"],
      "links": {
        "play": "builds/unity/space-shooter/index.html",
        "github": "https://github.com/..."
      }
    }
  ],
  "cv": {
    "file": "assets/cv/cv.pdf"
  },
  "contact": {
    "email": "tuemail@ejemplo.com"
  }
}
```

---

## 4. Cómo Integrar un Juego WebGL de Unity

### Paso 1: Exportar desde Unity

1. Abre tu proyecto en Unity
2. Ve a **File > Build Settings**
3. Selecciona **WebGL** como plataforma
4. Click en **Switch Platform** (si no está seleccionado)
5. Click en **Build** y elige una carpeta

### Paso 2: Copiar al Portafolio

```
# Copia la carpeta generada a:
builds/unity/[nombre-del-juego]/
```

### Paso 3: Actualizar portfolio.json

```json
{
  "projects": [
    {
      "name": "Mi Juego",
      "category": "unity",
      "links": {
        "play": "builds/unity/mi-juego/index.html"
      }
    }
  ]
}
```

### Paso 4: El juego se mostrará automáticamente

El portafolio detectará que es un juego Unity y mostrará:
- Miniatura del proyecto
- Botón de "Jugar" que abre el juego en un modal
- El juego se ejecuta en un iframe dentro del modal

---

## 5. Recomendaciones para Comenzar

### Nivel de Dificultad: Beginner-Friendly

1. **Primero**: Edita `portfolio.json` con tus datos
2. **Segundo**: Agrega tu foto en `assets/img/profile/avatar.jpg`
3. **Tercero**: Agrega el CV en `assets/cv/cv.pdf`
4. **Cuarto**: Agrega proyectos y sus imágenes
5. **Quinto**: (Opcional) Integra un juego Unity

### Para Ejecutar Localmente

```bash
# Requiere servidor web (por CORS)
python -m http.server 8000
# затем откройте http://localhost:8000
```

### Personalización Rápida

| Qué cambiar | Dónde editar |
|-------------|---------------|
| Colores | `css/variables.css` |
| Datos personales | `portfolio.json` |
| Imágenes | `assets/img/` |
| Texto del sitio | `index.html` |

---

## 6. Diferencias vs Arquitectura Original

| Aspecto | Antes | Ahora |
|----------|-------|-------|
| Archivos JSON | 3-5 separados | 1 único |
| Páginas HTML | Múltiples | 1 (SPA) |
| Archivos JS | 5+ fragmentados | 1 unificado |
| CSS | 5 archivos | 5 archivos (mejorados) |
| Docs | En proyecto | Eliminados |
| Mantenimiento | Difícil | Fácil (un punto de cambio) |

---

## 7. Tecnologías y Dependencias

### Requeridas (CDN)
- Font Awesome 6.4.0 (iconos)

### Opcionales
- EmailJS (para formulario de contacto)
- Google Analytics (analítica)

### No requeridas (puro vanilla)
- No jQuery
- No frameworks
- No build tools

---

*Arquitectura optimizada para portafolio personal - v3.0*
*Enfoque: Simple, Mantenible, Profesional*

