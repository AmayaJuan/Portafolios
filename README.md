# Portafolio Web Personal

Portafolio profesional para desarrollador de videojuegos y software.

## Características

- ✅ Diseño moderno y responsivo
- ✅ Carga dinámica de proyectos desde JSON
- ✅ Integración con juegos WebGL de Unity
- ✅ Filtrado de proyectos por categoría
- ✅ Formulario de contacto
- ✅ Descarga de CV
- ✅ Tema oscuro con variables CSS

## Estructura del Proyecto

```
portfolio/
├── index.html              # Página principal (SPA)
├── portfolio.json          # Datos del portafolio
├── assets/                 # Recursos estáticos
│   ├── img/
│   │   ├── profile/        # Foto de perfil
│   │   ├── projects/       # Imágenes de proyectos
│   │   │   ├── unity/
│   │   │   ├── android/
│   │   │   └── software/
│   │   └── skills/         # Iconos de tecnologías
│   ├── cv/                 # Currículum Vitae
│   └── favicon.ico
├── builds/                 # Juegos WebGL de Unity
│   └── unity/
│       ├── nombre-juego-1/
│       └── nombre-juego-2/
├── css/                    # Estilos
│   ├── variables.css
│   ├── base.css
│   ├── components.css
│   ├── sections.css
│   └── main.css
└── js/                     # JavaScript
    └── main.js
```

## Cómo Usar

### 1. Configurar Datos

Edita el archivo `portfolio.json` con tu información personal:

```json
{
  "profile": {
    "name": "Tu Nombre",
    "title": "Desarrollador de Videojuegos",
    "email": "tu@email.com"
  },
  "projects": [...],
  "skills": [...]
}
```

### 2. Agregar Imágenes

- **Perfil**: Coloca tu foto en `assets/img/profile/avatar.jpg`
- **Proyectos**: Agrega capturas en `assets/img/projects/[categoria]/`
- **Skills**: Agrega iconos SVG en `assets/img/skills/`
- **CV**: Coloca tu CV en `assets/cv/cv.pdf`

### 3. Integrar Juegos Unity WebGL

1. Exporta tu juego desde Unity como WebGL
2. Copia la carpeta de exportación a `builds/unity/[nombre-del-juego]/`
3. Actualiza los enlaces en `portfolio.json`

### 4. Ejecutar Localmente

El portafolio requiere un servidor web para funcionar (debido a CORS con fetch):

```bash
# Python
python -m http.server 8000

# Node.js (con npx)
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
}
```

### Secciones

El orden de las secciones se controla en `index.html`. Puedes reordernar los elementos `<section>` según prefieras.

## Tecnologías Usadas

- HTML5 semántico
- CSS3 con Variables
- JavaScript Vanilla (ES6+)
- Font Awesome para iconos
- Unity WebGL (para juegos)

## Licencia

MIT License -自由 usar y modificar para tu propio portafolio.

