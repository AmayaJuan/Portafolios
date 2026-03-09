/**
 * ============================================
 * Módulo de Internacionalización (i18n)
 * Maneja traducciones español/inglés
 * ============================================
 */

// Configuración de idiomas soportados
const SUPPORTED_LANGUAGES = ['es', 'en'];
const DEFAULT_LANGUAGE = 'es';

// Estado del sistema de traducciones
const i18nState = {
    currentLanguage: DEFAULT_LANGUAGE,
    translations: {},
    isInitialized: false
};

/**
 * Carga el archivo de traducciones para el idioma especificado
 * @param {string} lang - Código del idioma (es/en)
 * @returns {Promise<Object>} - Objeto con las traducciones
 */
async function loadTranslations(lang) {
    try {
        const response = await fetch(`assets/i18n/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Error al cargar traducciones: ${lang}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error cargando traducciones ${lang}:`, error);
        // Si falla, cargar español como respaldo
        if (lang !== DEFAULT_LANGUAGE) {
            return await loadTranslations(DEFAULT_LANGUAGE);
        }
        return {};
    }
}

/**
 * Detecta el idioma del navegador del usuario
 * @returns {string} - Código del idioma detectado
 */
function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
        return langCode;
    }
    return DEFAULT_LANGUAGE;
}

/**
 * Obtiene el idioma guardado en localStorage o detecta automáticamente
 * @returns {string} - Código del idioma a usar
 */
function getInitialLanguage() {
    // 1. Verificar preferencia guardada en localStorage
    const savedLang = localStorage.getItem('portfolio-language');
    if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
        return savedLang;
    }
    
    // 2. Detectar idioma del navegador
    return detectBrowserLanguage();
}

/**
 * Inicializa el sistema de internacionalización
 */
async function initI18n() {
    const lang = getInitialLanguage();
    i18nState.currentLanguage = lang;
    i18nState.translations = await loadTranslations(lang);
    i18nState.isInitialized = true;
    
    // Aplicar traducciones iniciales
    applyTranslations();
    
    // Guardar preferencia
    localStorage.setItem('portfolio-language', lang);
    
    console.log(`Idioma inicial: ${lang}`);
    return lang;
}

/**
 * Obtiene una traducción usando notación de puntos
 * @param {string} key - Clave de traducción (ej: 'nav.home')
 * @param {string} fallback - Texto por defecto si no existe
 * @returns {string} - Texto traducido
 */
function t(key, fallback = '') {
    const keys = key.split('.');
    let value = i18nState.translations;
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return fallback || key;
        }
    }
    
    return typeof value === 'string' ? value : fallback || key;
}

/**
 * Cambia el idioma de la aplicación
 * @param {string} lang - Código del nuevo idioma
 */
async function changeLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
        console.error(`Idioma no soportado: ${lang}`);
        return;
    }
    
    if (lang === i18nState.currentLanguage) {
        return;
    }
    
    // Cargar nuevas traducciones
    i18nState.translations = await loadTranslations(lang);
    i18nState.currentLanguage = lang;
    
    // Aplicar traducciones
    applyTranslations();
    
    // Guardar preferencia
    localStorage.setItem('portfolio-language', lang);
    
    console.log(`Idioma cambiado a: ${lang}`);
}

/**
 * Aplica las traducciones a todos los elementos del DOM
 */
function applyTranslations() {
    // Traducciones de navegación
    document.querySelectorAll('[data-i18n="nav.home"]').forEach(el => el.textContent = t('nav.home'));
    document.querySelectorAll('[data-i18n="nav.about"]').forEach(el => el.textContent = t('nav.about'));
    document.querySelectorAll('[data-i18n="nav.projects"]').forEach(el => el.textContent = t('nav.projects'));
    document.querySelectorAll('[data-i18n="nav.skills"]').forEach(el => el.textContent = t('nav.skills'));
    document.querySelectorAll('[data-i18n="nav.contact"]').forEach(el => el.textContent = t('nav.contact'));
    document.querySelectorAll('[data-i18n="nav.cv"]').forEach(el => el.textContent = t('nav.cv'));
    
    // Traducciones de hero
    document.querySelectorAll('[data-i18n="hero.badge"]').forEach(el => el.textContent = t('hero.badge'));
    document.querySelectorAll('[data-i18n="hero.greeting"]').forEach(el => el.textContent = t('hero.greeting'));
    document.querySelectorAll('[data-i18n="hero.tagline"]').forEach(el => el.textContent = t('hero.tagline'));
    document.querySelectorAll('[data-i18n="hero.viewProjects"]').forEach(el => el.textContent = t('hero.viewProjects'));
    document.querySelectorAll('[data-i18n="hero.contact"]').forEach(el => el.textContent = t('hero.contact'));
    
    // Traducciones de about
    document.querySelectorAll('[data-i18n="about.title"]').forEach(el => el.textContent = t('about.title'));
    document.querySelectorAll('[data-i18n="about.projects"]').forEach(el => el.textContent = t('about.projects'));
    document.querySelectorAll('[data-i18n="about.yearsExperience"]').forEach(el => el.textContent = t('about.yearsExperience'));
    document.querySelectorAll('[data-i18n="about.clients"]').forEach(el => el.textContent = t('about.clients'));
    
    // Traducciones de projects
    document.querySelectorAll('[data-i18n="projects.title"]').forEach(el => el.textContent = t('projects.title'));
    document.querySelectorAll('[data-i18n="projects.filters.all"]').forEach(el => el.textContent = t('projects.filters.all'));
    document.querySelectorAll('[data-i18n="projects.filters.unity"]').forEach(el => el.textContent = t('projects.filters.unity'));
    document.querySelectorAll('[data-i18n="projects.filters.android"]').forEach(el => el.textContent = t('projects.filters.android'));
    document.querySelectorAll('[data-i18n="projects.filters.software"]').forEach(el => el.textContent = t('projects.filters.software'));
    
    // Traducciones de skills
    document.querySelectorAll('[data-i18n="skills.title"]').forEach(el => el.textContent = t('skills.title'));
    
    // Traducciones de CV
    document.querySelectorAll('[data-i18n="cv.title"]').forEach(el => el.textContent = t('cv.title'));
    document.querySelectorAll('[data-i18n="cv.description"]').forEach(el => el.textContent = t('cv.description'));
    document.querySelectorAll('[data-i18n="cv.download"]').forEach(el => el.textContent = t('cv.download'));
    
    // Traducciones de contact
    document.querySelectorAll('[data-i18n="contact.title"]').forEach(el => el.textContent = t('contact.title'));
    document.querySelectorAll('[data-i18n="contact.subtitle"]').forEach(el => el.textContent = t('contact.subtitle'));
    document.querySelectorAll('[data-i18n="contact.description"]').forEach(el => el.textContent = t('contact.description'));
    
    // Traducciones de placeholders en formulario
    document.querySelectorAll('[data-i18n-placeholder="contact.form.name"]').forEach(el => el.placeholder = t('contact.form.name'));
    document.querySelectorAll('[data-i18n-placeholder="contact.form.email"]').forEach(el => el.placeholder = t('contact.form.email'));
    document.querySelectorAll('[data-i18n-placeholder="contact.form.message"]').forEach(el => el.placeholder = t('contact.form.message'));
    
    // Traducciones de labels en formulario
    document.querySelectorAll('[data-i18n="contact.form.name"]').forEach(el => {
        if (el.tagName === 'LABEL') el.textContent = t('contact.form.name');
    });
    document.querySelectorAll('[data-i18n="contact.form.email"]').forEach(el => {
        if (el.tagName === 'LABEL') el.textContent = t('contact.form.email');
    });
    document.querySelectorAll('[data-i18n="contact.form.message"]').forEach(el => {
        if (el.tagName === 'LABEL') el.textContent = t('contact.form.message');
    });
    
    // Traducciones de footer
    document.querySelectorAll('[data-i18n="footer.rights"]').forEach(el => el.textContent = t('footer.rights'));
    
    // Actualizar atributos lang del documento
    document.documentElement.lang = i18nState.currentLanguage;
}

/**
 * Crea el selector de idioma y lo añade al navbar
 * @param {string} containerSelector - Selector del contenedor donde añadir el selector
 */
function createLanguageSelector(containerSelector = '.nav-menu') {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error('Contenedor de idioma no encontrado');
        return;
    }
    
    // Verificar si ya existe el selector
    if (document.querySelector('.language-selector')) {
        return;
    }
    
    const selector = document.createElement('li');
    selector.className = 'language-selector';
    
    const button = document.createElement('button');
    button.className = 'lang-btn';
    button.setAttribute('aria-label', t('language.select'));
    button.innerHTML = `
        <i class="fas fa-globe"></i>
        <span class="lang-code">${i18nState.currentLanguage.toUpperCase()}</span>
    `;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown';
    
    SUPPORTED_LANGUAGES.forEach(lang => {
        const option = document.createElement('button');
        option.className = `lang-option ${lang === i18nState.currentLanguage ? 'active' : ''}`;
        option.setAttribute('data-lang', lang);
        option.textContent = t(`language.${lang}`);
        option.addEventListener('click', () => changeLanguage(lang));
        dropdown.appendChild(option);
    });
    
    // Toggle dropdown
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    
    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', () => {
        dropdown.classList.remove('show');
    });
    
    selector.appendChild(button);
    selector.appendChild(dropdown);
    container.appendChild(selector);
    
    // Actualizar selector al cambiar idioma
    const originalChangeLanguage = changeLanguage;
    window.changeLanguage = async function(lang) {
        await originalChangeLanguage(lang);
        updateLanguageSelector();
    };
}

/**
 * Actualiza el selector de idioma con el idioma actual
 */
function updateLanguageSelector() {
    const button = document.querySelector('.lang-btn .lang-code');
    const options = document.querySelectorAll('.lang-option');
    
    if (button) {
        button.textContent = i18nState.currentLanguage.toUpperCase();
    }
    
    options.forEach(option => {
        option.classList.toggle('active', option.dataset.lang === i18nState.currentLanguage);
    });
}

/**
 * Obtiene el idioma actual
 * @returns {string} - Código del idioma actual
 */
function getCurrentLanguage() {
    return i18nState.currentLanguage;
}

// Exportar funciones para uso global
window.i18n = {
    init: initI18n,
    t: t,
    changeLanguage: changeLanguage,
    getCurrentLanguage: getCurrentLanguage,
    createLanguageSelector: createLanguageSelector,
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE
};

