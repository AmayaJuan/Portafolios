/**
 * ============================================
 * Main JavaScript - Portafolio Web Personal
 * Carga datos dinamicamente desde portfolio.json
 * ============================================
 */

// Configuracion global
const CONFIG = {
    dataFile: 'portfolio.json',
    animationDelay: 100
};

// Estado de la aplicacion
const state = {
    data: null,
    currentFilter: 'all',
    isLoading: true
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
        if (!response.ok) throw new Error('Error al cargar datos');
        
        state.data = await response.json();
        state.isLoading = false;
        
        console.log('Datos cargados:', state.data);
        return state.data;
    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar los datos del portafolio');
        return null;
    }
}

// ============================================
// Renderizado de Secciones
// ============================================

function renderProfile(data) {
    const { profile } = data;
    
    $('#profileName').textContent = profile.name;
    $('#profileTagline').textContent = profile.tagline;
    $('#profileBio').textContent = profile.bio;
    $('#profileFullBio').textContent = profile.bio;
    
    const avatarImg = $('#profileAvatar');
    avatarImg.src = profile.avatar;
    avatarImg.alt = profile.name;
    
    $('#footerName').textContent = profile.name;
    $('#currentYear').textContent = new Date().getFullYear();
    
    const socialContainer = $('#socialLinks');
    if (profile.social) {
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
        const card = createElement('div', { class: 'project-card' });
        
        let imageContent;
        if (project.thumbnail) {
            imageContent = createElement('img', {
                src: project.thumbnail,
                alt: project.name,
                class: 'card-image',
                onerror: "this.style.display='none'; this.nextElementSibling.style.display='flex'"
            });
        }
        
        const placeholder = createElement('div', {
            class: 'card-image-placeholder',
            style: 'display: ' + (project.thumbnail ? 'none' : 'flex')
        }, [getCategoryIcon(project.category)]);
        
        const tagsContainer = createElement('div', { class: 'card-tags' });
        project.technologies.forEach(tech => {
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
        
        card.append(imageContent, placeholder, playButton, content);
        
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
// Funcionalidad de Proyectos
// ============================================

function filterProjects(category) {
    state.currentFilter = category;
    
    $$('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
    
    $$('.project-card').forEach(card => {
        const projectCategory = card.querySelector('.tag').classList.contains('tag-unity') ? 'unity' :
                                card.querySelector('.tag').classList.contains('tag-android') ? 'android' : 'software';
        
        const shouldShow = category === 'all' || projectCategory === category;
        card.classList.toggle('hidden', !shouldShow);
    });
}

function openGameModal(gameUrl) {
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
    
    window.addEventListener('scroll', () => {
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
// Formulario de Contacto con EmailJS
// ============================================

function setupContactForm() {
    const submitBtn = document.getElementById('submit-btn');
    const form = document.getElementById('contact-form');
    
    if (!submitBtn || !form) return;
    
    // Credenciales de EmailJS
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
    
    // Inicializar sistema de internacionalizacion (i18n)
    if (typeof window.i18n !== 'undefined') {
        await window.i18n.init();
        // Crear selector de idioma en el navbar
        window.i18n.createLanguageSelector();
    }
    
    const data = await loadPortfolioData();
    
    if (data) {
        renderProfile(data);
        renderProjects(data.projects);
        renderSkills(data.skills);
        renderContact(data);
        
        setupNavigation();
        setupContactForm();
        
        // Configurar filtros de proyectos
        $$('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => filterProjects(btn.dataset.filter));
        });
        
        // Configurar modal de juegos
        $('#modalClose').addEventListener('click', closeGameModal);
        $('#gameModal').addEventListener('click', (e) => {
            if (e.target.id === 'gameModal') closeGameModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeGameModal();
        });
        
        console.log('Portafolio cargado correctamente');
    }
}

// Iniciar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', init);
