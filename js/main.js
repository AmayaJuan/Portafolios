/**
 * ============================================
 * Main JavaScript - Portafolio Web Personal
 * Carga datos dinamicamente desde portfolio.json
 * ============================================
 */

// Configuracion global
const CONFIG = {
    dataFile: './portfolio.json',
    animationDelay: 100
};

// Estado de la aplicacion
const state = {
    data: null,
    currentFilter: 'all',
    isLoading: true,
    // Slider de habilidades
    skillsSlider: {
        currentIndex: 0,
        itemsPerView: 3,
        totalItems: 0,
        isDragging: false,
        startX: 0,
        currentX: 0
    }
};

// ============================================
// Funciones de Utilidad
// ============================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Funcion para crear elementos HTML dinamicamente
function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'class') {
            el.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                el.dataset[dataKey] = dataValue;
            });
        } else if (key.startsWith('on')) {
            const eventName = key.slice(2).toLowerCase();
            if (typeof value === 'string') {
                el.setAttribute(key, value);
            } else if (typeof value === 'function') {
                el.addEventListener(eventName, value);
            }
        } else {
            el.setAttribute(key, value);
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            el.appendChild(child);
        }
    });
    
    return el;
}

// Funcion para obtener icono de categoria
function getCategoryIcon(category) {
    const icons = {
        unity: 'fa-gamepad',
        android: 'fa-android',
        software: 'fa-desktop'
    };
    const iconClass = icons[category] || 'fa-folder';
    return createElement('i', { class: `fas ${iconClass}` });
}

// Funcion para formatear URLs
function formatUrl(url) {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

// ============================================
// Carga de Datos
// ============================================

async function loadPortfolioData() {
    try {
        const response = await fetch(CONFIG.dataFile);
        // Verificación segura
        if (!response.ok) throw new Error('Error al cargar portfolio.json');
        
        state.data = await response.json();
        state.isLoading = false;
        
        console.log('Datos cargados:', state.data);
        return state.data;
    } catch (error) {
        console.error('Error cargando datos:', error);
        showError('Error al cargar el portafolio');

        //Evitar que la pagina se rompa
        return {
            profile: {},
            projects: [],
            skills: []
        };
    }
}

// ============================================
// RENDER PERFIL
// ============================================

function renderProfile(data) {
    const { profile } = data;
    
    $('#profileName').textContent = profile.name || '';
    $('#profileTagline').textContent = profile.tagline || '';
    $('#profileBio').textContent = profile.bio || '';
    //$('#profileFullBio').textContent = profile.bio;
    
    const avatarImg = $('#profileAvatar');

    if(avatarImg && profile.avatar) {
        avatarImg.src = profile.avatar;
        avatarImg.alt = profile.name;
    }

    $('#footerName').textContent = profile.name;
    $('#currentYear').textContent = new Date().getFullYear();
    
    const socialContainer = $('#socialLinks');
    if (profile.social && socialContainer) {
        const socialLinks = [];
        
        if (profile.social.github) {
            const link = createElement('a', {
                href: profile.social.github,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: 'GitHub',
                class: 'social-link'
            });
            link.appendChild(createElement('i', { class: 'fab fa-github' }));
            socialLinks.push(link);
        }
        
        if (profile.social.gitlab) {
            const link = createElement('a', {
                href: profile.social.gitlab,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: 'GitLab',
                class: 'social-link'
            });
            link.appendChild(createElement('i', { class: 'fab fa-gitlab' }));
            socialLinks.push(link);
        }
        
        if (profile.social.linkedin) {
            const link = createElement('a', {
                href: profile.social.linkedin,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: 'LinkedIn',
                class: 'social-link'
            });
            link.appendChild(createElement('i', { class: 'fab fa-linkedin' }));
            socialLinks.push(link);
        }
        
        if (profile.social.twitter) {
            const link = createElement('a', {
                href: profile.social.twitter,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: 'Twitter',
                class: 'social-link'
            });
            link.appendChild(createElement('i', { class: 'fab fa-twitter' }));
            socialLinks.push(link);
        }
        
        if (profile.social.itchio) {
            const link = createElement('a', {
                href: profile.social.itchio,
                target: '_blank',
                rel: 'noopener noreferrer',
                title: 'Itch.io',
                class: 'social-link'
            });
            link.appendChild(createElement('i', { class: 'fab fa-itch-io' }));
            socialLinks.push(link);
        }
        
        socialContainer.append(...socialLinks);
    }
    
    $('#contactEmail').textContent = profile.email;
    $('#contactLocation').textContent = profile.location || 'Disponible remotamente';
}

function renderProjects(projects) {
    const container = $('#projectsGrid');
    
    if (!projects || projects.length === 0) {
        container.innerHTML = '<p class="loading">No hay proyectos disponibles</p>';
        return;
    }
    
    $('#projectCount').textContent = projects.length;
    
    const projectCards = projects.map(project => {
        const card = createElement('div', { 
            class: 'project-card', 
            dataset: {category: project.category} 
        });
        
        let imageContent;
        if (project.thumbnail) {
            imageContent = createElement('img', {
                src: project.thumbnail,
                alt: project.name,
                class: 'card-image',
                loading: 'lazy',
                onerror: "this.style.display='none'; this.nextElementSibling.style.display='flex'"
            });
        }
        
        const placeholder = createElement('div', {
            class: 'card-image-placeholder',
            style: 'display: ' + (project.thumbnail ? 'none' : 'flex')
        }, [getCategoryIcon(project.category)]);
        
        const tagsContainer = createElement('div', { class: 'card-tags' });
        (project.technologies || []).forEach(tech => {
            const tag = createElement('span', {
                class: `tag tag-${project.category}`
            }, [tech]);
            tagsContainer.appendChild(tag);
        });
        
        // Crear boton de jugar para proyectos Unity
        let playButton;
        if (project.category === 'unity' && project.links && project.links.play) {
            playButton = createElement('button', {
                class: 'play-btn',
                onclick: function() { openGameModal(project.links.play); },
                title: 'Jugar'
            });
            playButton.appendChild(createElement('i', { class: 'fas fa-play' }));
        }
        
        const linksContainer = createElement('div', { class: 'card-links' });
        
        if (project.links && project.links.github) {
            const githubLink = createElement('a', {
                href: project.links.github,
                target: '_blank',
                rel: 'noopener noreferrer',
                class: 'card-link'
            });
            githubLink.appendChild(createElement('i', { class: 'fab fa-github' }));
            githubLink.appendChild(document.createTextNode(' Codigo'));
            linksContainer.appendChild(githubLink);
        }
        
        if (project.links && project.links.play) {
            const playLink = createElement('a', {
                href: project.links.play,
                target: '_blank',
                class: 'card-link'
            });
            playLink.appendChild(createElement('i', { class: 'fas fa-external-link-alt' }));
            playLink.appendChild(document.createTextNode(' Ver'));
            linksContainer.appendChild(playLink);
        }
        
        if (project.links && project.links.download) {
            const downloadLink = createElement('a', {
                href: project.links.download,
                download: '',
                class: 'card-link'
            });
            downloadLink.appendChild(createElement('i', { class: 'fas fa-download' }));
            downloadLink.appendChild(document.createTextNode(' Descargar'));
            linksContainer.appendChild(downloadLink);
        }
        
        const content = createElement('div', { class: 'card-content' }, [
            createElement('h3', { class: 'card-title' }, [project.name]),
            createElement('p', { class: 'card-description' }, [project.shortDescription || project.description]),
            tagsContainer,
            linksContainer
        ]);
        
        //FIX: evitar append de elementos undefined
        if(imageContent) card.appendChild(imageContent);
        card.appendChild(placeholder);

        if(playButton) card.appendChild(playButton);
        card.appendChild(content);
        
        return card;
    });
    
    container.append(...projectCards);
}

function renderSkills(skills) {
    const container = $('#skillsGrid');
    
    if (!skills || skills.length === 0) {
        container.innerHTML = '<p class="loading">No hay habilidades configuradas</p>';
        return;
    }
    
    const skillItems = skills.map(skill => {
        const item = createElement('div', { class: 'skill-item' });
        
        let iconElement;
        if (skill.icon) {
            iconElement = createElement('img', {
                src: skill.icon,
                alt: skill.name,
                class: 'skill-icon-img',
                style: 'width: 30px; height: 30px;'
            });
        } else {
            iconElement = document.createTextNode(skill.name.charAt(0));
        }
        
        const iconContainer = createElement('div', { class: 'skill-icon' }, [iconElement]);
        
        const info = createElement('div', { class: 'skill-info' }, [
            createElement('h4', { class: 'skill-name' }, [skill.name]),
            createElement('div', { class: 'skill-level' }, [
                createElement('div', {
                    class: 'skill-progress',
                    style: `width: ${skill.level || 0}%`
                })
            ])
        ]);
        
        item.append(iconContainer, info);
        
        return item;
    });
    
    container.append(...skillItems);
}

function renderContact(data) {
    const { contact } = data;
    
    if (contact && contact.fields) {
        const nameInput = $('#name');
        const emailInput = $('#email');
        const messageInput = $('#message');
        
        if (contact.fields.name) nameInput.placeholder = contact.fields.name;
        if (contact.fields.email) emailInput.placeholder = contact.fields.email;
        if (contact.fields.message) messageInput.placeholder = contact.fields.message;
    }
    
    if (data.cv && data.cv.file) {
        const cvBtn = $('#cvDownloadBtn');
        const downloadCV = $('#downloadCV');
        
        cvBtn.href = data.cv.file;
        if (data.cv.downloadName) {
            cvBtn.download = data.cv.downloadName;
        }
        
        downloadCV.href = data.cv.file;
        if (data.cv.downloadName) {
            downloadCV.download = data.cv.downloadName;
        }
    }
}

// ============================================
// Funcionalidad del Slider de Habilidades (Simplificado)
// ============================================

function initSkillsSlider(skills) {
    const scrollContainer = document.getElementById('skillsScroll');
    const prevBtn = document.getElementById('skillsPrev');
    const nextBtn = document.getElementById('skillsNext');
    const countEl = document.getElementById('skillsCount');
    
    if (!scrollContainer) return;
    
    // Mostrar total de habilidades
    if (countEl) {
countEl.innerHTML = `${skills.length} <span data-i18n="skills.count"></span>`;
    }
    
    // Función para desplazar
    const scrollAmount = 250;
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
    
    // Actualizar estado de los botones
    const updateButtons = () => {
        if (prevBtn) {
            prevBtn.disabled = scrollContainer.scrollLeft <= 0;
        }
        if (nextBtn) {
            nextBtn.disabled = scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth - 1;
        }
    };
    
    // Event listeners para scroll
    scrollContainer.addEventListener('scroll', updateButtons);
    updateButtons();
    
    // Support for touch swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    scrollContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - scroll right
                scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            } else {
                // Swipe right - scroll left
                scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        }
    };
}

// ============================================
// Funcionalidad de Proyectos
// ============================================

function filterProjects(category) {
    state.currentFilter = category;
    
    $$('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
    
    $$('.project-card').forEach(card => {
        const projectCategory = card.dataset.category;
        
        const shouldShow = category === 'all' || projectCategory === category;
        card.classList.toggle('hidden', !shouldShow);
    });
}

function openGameModal(gameUrl) {
    if(!gameUrl) return;

    const modal = $('#gameModal');
    const frame = $('#gameFrame');
    
    frame.src = gameUrl;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGameModal() {
    const modal = $('#gameModal');
    const frame = $('#gameFrame');
    
    frame.src = '';
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// Navegacion
// ============================================

function setupNavigation() {
    // Links de navegacion suave
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = $(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Resaltar seccion actual en el menu
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    
    // MEJORAR: limitar ejecucion del scroll
    let scrollTimeout;

    window.addEventListener('scroll', () => {

        if(scrollTimeout) return;

        scrollTimeout = setTimeout(() => {

            scrollTimeout = null;

            let current = '';
        
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
            
                if (scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
        
            navLinks.forEach(link => {
               link.classList.remove('active');

               if (link.getAttribute('href') === `#${current}`) {
                   link.classList.add('active');
               }
            });
        }, 100);
    });
    
    // Menu movil
    const navToggle = $('#navToggle');
    const navMenu = $('#navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// ============================================
// ============================================
// Formulario de Contacto con EmailJS
// ============================================
//
// *** POLITICA: NO MODIFICAR ESTA SECCION ***
// Esta configuracion de EmailJS esta verificada y funcionando.
// No realizar cambios hasta recibir autorizacion explicita.
// Para modificaciones, contactar al administrador.
// ============================================

function setupContactForm() {
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('contact-form');
    
    if (!submitBtn || !form) return;
    
    // ============================================
    // CONFIGURACION EMAILJS - NO TOCAR
    // Esta configuracion esta verificada y funcionando correctamente.
    // Cambios no autorizados pueden romper el formulario de contacto.
    // ============================================
    const emailjsConfig = {
        publicKey: '9bdYHELMIBud0OpOW',
        serviceId: 'service_gj0z1c7',
        templateId: 'template_likc0ei'
    };
    
    // Inicializar EmailJS con la public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init(emailjsConfig.publicKey);
    }
    
    // Configurar evento submit del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar que los campos requeridos esten llenos
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Obtener valores del formulario
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            const templateParams = {
                name: name,
                email: email,
                message: message
            };
            
            console.log('Enviando email:', templateParams);
            
            // Enviar usando EmailJS
            if (typeof emailjs !== 'undefined') {
                const response = await emailjs.send(
                    emailjsConfig.serviceId,
                    emailjsConfig.templateId,
                    templateParams
                );
                
                console.log('Email enviado:', response);
                showNotification('Mensaje enviado correctamente! Te respondere pronto.', 'success');
            } else {
                console.log('EmailJS no cargado. Datos:', templateParams);
                showNotification('EmailJS no esta cargado. Datos: ' + JSON.stringify(templateParams), 'error');
            }
            
            // Limpiar formulario
            form.reset();
            
        } catch (error) {
            console.error('Error al enviar:', error);
            showNotification('Error al enviar: ' + error.message, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Funcion para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = createElement('div', {
        class: `alert alert-${type === 'success' ? 'success' : 'error'}`,
        style: 'position: fixed; top: 20px; right: 20px; z-index: 9999; background: ' + (type === 'success' ? '#28a745' : '#dc3545') + '; color: white; padding: 15px 20px; border-radius: 5px;'
    }, [message]);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Funcion para mostrar errores
function showError(message) {
    showNotification(message, 'error');
}

// ============================================
// Inicializacion
// ============================================

async function init() {
    console.log('Inicializando portafolio...');
    
    // Activar loader
    document.body.classList.add('content-loading');
    
    const data = await loadPortfolioData();
    
    if (data) {
        renderProfile(data);
        guardarTextosPerfilBilingue(data);
        renderProjects(data.projects);
        renderSkills(data.skills);
        renderContact(data);
        
        // Inicializar slider de habilidades
        if (data.skills && data.skills.length > 0) {
            initSkillsSlider(data.skills);
        }
        
        setupNavigation();
        setupContactForm();
        
        // Configurar filtros de proyectos
        $$('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => filterProjects(btn.dataset.filter));
        });
        
        // Configurar modal de juegos
        // FIX: Evitar error si el elemento no existe
        const modalClose = $('#modalClose');
        if(modalClose)
            modalClose.addEventListener('click', closeGameModal);
        
        const gameModal = $('#gameModal');
        if(gameModal)
           gameModal.addEventListener('click', (e) => {
            if (e.target.id === 'gameModal') closeGameModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeGameModal();
        });
        
        // Ocultar loader y mostrar contenido
        document.body.classList.remove('content-loading');
        const loader = document.getElementById('loader-overlay');
        if (loader) {
            loader.classList.add('hidden');
        }
        
        console.log('Portafolio cargado correctamente');
    }
}

// Funciones i18n - Sistema de cambio de idioma
let translations = {};

// Cargar idioma desde archivo JSON
async function cargarIdioma(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) throw new Error(`No se pudo cargar ${lang}.json`);
        translations = await response.json();
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        aplicarTraduccion();
        actualizarBotonesIdioma(lang);
    } catch (error) {
        console.error('Error cargando idioma:', error);
    }
}

// Obtener traducción para clave con notación punto (nav.inicio)
function obtenerTraduccion(key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], translations) || key;
}

// Aplicar traducciones a elementos con data-i18n
function aplicarTraduccion() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const translation = obtenerTraduccion(key);
        if (el.children.length === 0 || (el.children.length === 1 && el.children[0].tagName === 'I')) {
            el.textContent = translation;
        } else {
            // Si hay icono <i>, reemplazar solo el nodo de texto
            const textNode = Array.from(el.childNodes).find(node => node.nodeType === 3);
            if (textNode) {
                textNode.textContent = translation;
            } else {
                el.textContent = translation;
            }
        }
    });
}

// Actualizar botones activos de idioma
function actualizarBotonesIdioma(lang) {
    document.querySelectorAll('.language-switch button').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === lang);
    });
}

// Traducir elementos dinámicos después de renderizar (llamar desde init)
function traducirDinamicos() {
    aplicarTraduccion(); // Re-aplica a todo
}

// Variables y funciones para textos dinámicos del perfil
let profileTexts = {};
let currentLang = 'es';

function guardarTextosPerfilBilingue(data) {
    const profile = data.profile;
    profileTexts.tagline_es = profile.tagline;
    profileTexts.tagline_en = profile.tagline_en || profile.tagline;
    profileTexts.bio_es = profile.bio;
    profileTexts.bio_en = profile.bio_en || profile.bio;
}

// Modificar aplicarTraduccion para textos dinámicos
const originalAplicarTraduccion = aplicarTraduccion;
aplicarTraduccion = function() {
    originalAplicarTraduccion();
    
    if (profileTexts.tagline_es) {
        const taglineKey = `tagline_${currentLang}`;
        const bioKey = `bio_${currentLang}`;
        $('#profileTagline').textContent = profileTexts[taglineKey];
        $('#profileBio').textContent = profileTexts[bioKey];
    }
};

// Modificar cargarIdioma para actualizar currentLang
const originalCargarIdioma = cargarIdioma;
cargarIdioma = async function(lang) {
    currentLang = lang;
    await originalCargarIdioma(lang);
};

// Modificar init para usar traducirDinamicos al final
const originalInit = init;
init = async function() {
    await originalInit();
    traducirDinamicos();
};


// Iniciar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', async() => {
    const lang = localStorage.getItem('lang') || 'es';

    //Esperar a que cargue el idioma
    await cargarIdioma(lang)

    // iniciar app después de cargar traduciones
    await init();
});

