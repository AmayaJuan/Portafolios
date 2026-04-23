    /**
     * ============================================
     * Main JavaScript - Personal Portfolio v1.0
     * Vanilla JS SPA: i18n, filters, Unity WebGL modal, EmailJS
     * ============================================
     */

    const config = { dataFile: './portfolio.json', animationDelay: 100 };

    const appState = {
        data: null, currentFilter: 'all', isLoading: true,
        skillsSlider: { currentIndex: 0, itemsPerView: 3, totalItems: 0, isDragging: false, startX: 0, currentX: 0 }
    };

    let currentLang = localStorage.getItem('lang') || 'es';
    let translations = {};
    let profileTexts = {};

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    function createElement(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'class') { el.className = value; }
            else if (key === 'dataset') { Object.entries(value).forEach(([dk, dv]) => el.dataset[dk] = dv); }
            else if (key.startsWith('on')) {
                const ev = key.slice(2).toLowerCase();
                if (typeof value === 'string') el.setAttribute(key, value);
                else if (typeof value === 'function') el.addEventListener(ev, value);
            } else { el.setAttribute(key, value); }
        });
        children.forEach(child => {
            if (typeof child === 'string') el.appendChild(document.createTextNode(child));
            else if (child instanceof Node) el.appendChild(child);
        });
        return el;
    }

    function getCategoryIcon(category) {
        const icons = { unity: 'fa-gamepad', android: 'fa-android', software: 'fa-desktop' };
        return createElement('i', { class: `fas ${icons[category] || 'fa-folder'}` });
    }

    /**
     * ============================================
     * Internationalization (i18n) System
     * Loads language JSON and applies translations to DOM elements
     * Must be initialized before renderProjects()
     * ============================================
     */

    function getTranslation(key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], translations) || key;
    }

    async function loadLanguage(lang, options = {}) {
        const skipApply = options.skipApply === true;
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) throw new Error(`Could not load lang/${lang}.json`);

            translations = await response.json();
            currentLang = lang;
            localStorage.setItem('lang', lang);
            document.documentElement.lang = lang;
            if (!skipApply) applyTranslation();
            updateButtonsLanguage(lang);
            
            // Actualizar CV al cambiar idioma
            if (appState.data && appState.data.cv) {
                setupCVButtons(appState.data.cv);
            }
        } catch (error) {
            console.error('Error loading language:', error);
        }
    }

    // Función para obtener URL CV por idioma
    function getCVUrl(cvData) {
        return (currentLang === 'en' && cvData.file_en) ? cvData.file_en : cvData.file;
    }

    // Modal CV (PDF iframe)
    function openCVModal(cvUrl) {
        const cvFrame = $('#cvFrame');
        const cvModalTitle = $('#cvModalTitle');
        if (cvFrame && cvUrl) {
            cvFrame.src = cvUrl + '#view=FitH&toolbar=1&navpanes=0';
            cvModalTitle.textContent = currentLang === 'en' ? 'Curriculum Vitae' : 'Currículum Vitae';
            $('#cvModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCVModal() {
        $('#cvFrame').src = '';
        $('#cvModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    // Actualiza botones CV (onclick en lugar de href)
    function setupCVButtons(cvData) {
        const cvViewBtn = $('#cvViewBtn');
        const cvUrl = getCVUrl(cvData);

        if (cvViewBtn) cvViewBtn.onclick = (e) => {
            e.preventDefault();
            openCVModal(cvUrl);
        };
        
        console.log(`CV configurado ${currentLang.toUpperCase()}: ${cvUrl}`);
    }

    function applyTranslation() {
        // 1. HTML elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const translation = getTranslation(key);
            const iconEl = el.querySelector('i');
            if (iconEl) {
                let textNode = null;
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) textNode = node;
                });
                if (textNode) { textNode.textContent = ' ' + translation; }
                else { 
                    // Remove all text nodes first
                    Array.from(el.childNodes).forEach(node => {

                        if(node.nodeType === Node.TEXT_NODE) node.remove();
                    });
                    el.appendChild(document.createTextNode(' ' + translation)); 
                }
            } else {
                el.textContent = translation;
            }
        });

        // 2. Project card buttons (generated by JS)
        document.querySelectorAll('.card-link[data-link-type]').forEach(link => {
            const type = link.getAttribute('data-link-type');
            const keyMap = { code: 'projects.code', view: 'projects.view', download: 'projects.download' };
            if (keyMap[type]) {
                let textNode = null;
                link.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) textNode = node;
                });
                if (textNode) {
                    textNode.textContent = ' ' + getTranslation(keyMap[type]);
                } else {
                    Array.from(link.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) node.remove();
                    });

                    link.appendChild(document.createTextNode('' + getTranslation(keyMap[type])));
                }
            }
        });

        // 3. Form Placeholders
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        if (nameInput) nameInput.placeholder = getTranslation('contact.name');
        if (emailInput) emailInput.placeholder = getTranslation('contact.email');
        if (messageInput) messageInput.placeholder = getTranslation('contact.message');

        // 4. Dynamic profile texts
        if (profileTexts.tagline_es) {
            const taglineEl = $('#profileTagline');
            const bioEl = $('#profileBio');
            const bioFullEl = $('#profileFullBio');
            if (taglineEl) taglineEl.textContent = profileTexts[`tagline_${currentLang}`] || profileTexts.tagline_es;
            if (bioEl) bioEl.textContent = profileTexts[`bio_${currentLang}`] || profileTexts.bio_es;
            if (bioFullEl) bioFullEl.textContent = profileTexts[`fullBio_${currentLang}`] || profileTexts.fullBio_es;
        }

        // 5. Translate project descriptions
        if (appState.data && appState.data.projects) {
            appState.data.projects.forEach(project => {
                const el = document.querySelector(`[data-project-id="${project.id}"]`);
                if (el) {
                    const desc = currentLang === 'en'
                        ? (project.shortDescription_en || project.shortDescription)
                        : project.shortDescription;
                    el.textContent = desc;
                }
            });
        }

        // 6. Education
        const allEducation = [
            ...(appState.data?.education?.technical || []),
            ...(appState.data?.education?.technologist || [])
        ];
        allEducation.forEach(item => {
            const degreeEl = document.querySelector(`[data-edu-id="${item.id}"]`);
            const statusEl = document.querySelector(`[data-edu-status="${item.id}"]`);
            const periodEl = document.querySelector(`[data-edu-period="${item.id}"]`);
            if (degreeEl) degreeEl.textContent = currentLang === 'en' ? item.degree_en : item.degree;
            if (statusEl) statusEl.textContent = currentLang === 'en' ? item.status_en : item.status;
            if (periodEl) periodEl.textContent = currentLang === 'en' ? (item.period_en || item.period) : item.period;
        });

        // 7. Courses
        appState.data?.education?.courses?.forEach(item => {
            const nameEl = document.querySelector(`[data-course-id="${item.id}"]`);
            const platformEl = document.querySelector(`[data-course-platform="${item.id}"]`);
            const periodEl = document.querySelector(`[data-course-period="${item.id}"]`);
            const hoursEl = document.querySelector(`[data-course-hours="${item.id}"]`);
            if (nameEl) nameEl.textContent = currentLang === 'en' ? item.name_en : item.name;
            if (platformEl) platformEl.textContent = currentLang === 'en' ? (item.platform_en || item.platform) : item.platform;
            if (periodEl) periodEl.textContent = currentLang === 'en' ? (item.period_en || item.period) : item.period;
            if (hoursEl) hoursEl.textContent = currentLang === 'en' ? (item.hours_en || item.hours) : item.hours;
        });

        // 8. Achievement cards
        if (appState.data?.projects) {
            appState.data.projects.forEach(proj => {
                const t = document.querySelector(`[data-ach-id="${proj.id}"]`);
                const d = document.querySelector(`[data-ach-desc="${proj.id}"]`);
                if (t) t.textContent = currentLang === 'en' ? (proj.name_en || proj.name) : proj.name;
                if (d) d.textContent = currentLang === 'en'
                ? (proj.shortDescription_en || proj.shortDescription)
                : (proj.shortDescription || '');
            });
        }

        // 9. Work experience (timeline)
        appState.data?.experience?.forEach(exp => {
            if (!exp.id) return;
            const item = document.querySelector(`[data-experience-id="${exp.id}"]`);
            if (!item) return;
            const dateEl = item.querySelector('.experience-date');
            const titleEl = item.querySelector('.experience-title');
            const compEl = item.querySelector('.experience-company');
            const descEl = item.querySelector('.experience-desc');
            const period = currentLang === 'en' ? (exp.period_en || exp.period) : exp.period;
            const company = currentLang === 'en' ? (exp.company_en || exp.company) : exp.company;
            const position = currentLang === 'en' ? (exp.position_en || exp.position) : exp.position;
            const descHtml = currentLang === 'en' ? (exp.description_en || exp.description) : exp.description;
            if (dateEl) dateEl.textContent = period || '';
            if (compEl) compEl.textContent = company || '';
            if (titleEl) titleEl.textContent = position || '';
            if (descEl && descHtml != null) descEl.innerHTML = descHtml;
        });
}
    function updateButtonsLanguage(lang) {
        document.querySelectorAll('.language-switch [data-lang]').forEach(btn => {
            const on = btn.dataset.lang === lang;
            btn.classList.toggle('active', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    function saveTextsBilingualProfile(data) {
        const p = data.profile;
        profileTexts.tagline_es = p.tagline || '';
        profileTexts.tagline_en = p.tagline_en || p.tagline || '';
        profileTexts.bio_es = p.bio || '';
        profileTexts.bio_en = p.bio_en || p.bio || '';
        profileTexts.fullBio_es = p.fullBio || p.bio || '';
        profileTexts.fullBio_en = p.fullBio_en || p.bio_en || '';
    }

    /**
     * ============================================
     * Data Loading
     * Fetches portfolio.json and initializes app state
     * ============================================
     */

    async function loadPortfolioData() {
        try {
            const response = await fetch(config.dataFile);
            if (!response.ok) throw new Error('Error loading portfolio.json');
            appState.data = await response.json();
            appState.isLoading = false;
            return appState.data;
        } catch (error) {
            console.error('Error loading data:', error);
            showError('Error loading portfolio');
            return { profile: {}, projects: [], skills: [] };
        }
    }

    // ============================================
    // Profile Render
    // ============================================

function renderExperience() {
    const experiences = appState.data.experience   || [];
    const projects    = appState.data.projects     || [];
    const achievements = appState.data.achievements || [];
    const section     = document.querySelector('#experience .container');
    const timeline    = $('.experience-timeline');
    if (!section || !timeline) return;

    // ── TABS PRINCIPALES ──────────────────────────────────────
    const tabsDiv = createElement('div', { class: 'exp-switch' });
    const btnExp  = createElement('button',
        { class: 'exp-tab-btn active', 'data-i18n': 'experience.tab_exp' },
        [getTranslation('experience.tab_exp') || 'Experiencia']);
    const btnAch  = createElement('button',
        { class: 'exp-tab-btn', 'data-i18n': 'experience.tab_ach' },
        [getTranslation('experience.tab_ach') || 'Logros']);
    tabsDiv.append(btnExp, btnAch);
    section.insertBefore(tabsDiv, timeline);

    // ── PANEL EXPERIENCIA ─────────────────────────────────────
    timeline.id        = 'exp-panel';
    timeline.innerHTML = '';

    if (experiences.length === 0) {
        timeline.innerHTML = '<div class="timeline-placeholder"><p>No hay experiencia registrada.</p></div>';
    }

    experiences.forEach(exp => {
        const dot = createElement('div', { class: 'experience-dot' });
        const periodText = currentLang === 'en' ? (exp.period_en || exp.period) : exp.period;
        const dateEl = createElement('div', { class: 'experience-date' }, [periodText]);
        const titleEl = createElement('h3', { class: 'experience-title' },
            [currentLang === 'en' ? (exp.position_en || exp.position) : exp.position]);
        const companyText = currentLang === 'en' ? (exp.company_en || exp.company) : exp.company;
        const compEl = createElement('div', { class: 'experience-company' }, [companyText]);

        const descEl = createElement('div', { class: 'experience-desc' });
        const descHtml = currentLang === 'en' ? (exp.description_en || exp.description) : exp.description;
        if (Array.isArray(exp.description) && !exp.description_en) {
            const ul = createElement('ul');
            exp.description.forEach(liText => ul.appendChild(createElement('li', {}, [liText])));
            descEl.appendChild(ul);
        } else {
            descEl.innerHTML = descHtml || '';
        }

        const content = createElement('div', { class: 'experience-content' }, [dateEl, titleEl, compEl, descEl]);
        const item = createElement('div', { class: 'experience-item', dataset: { experienceId: exp.id || '' } }, [dot, content]);
        timeline.appendChild(item);
    });

    // ── PANEL LOGROS ──────────────────────────────────────────
    const achPanel = createElement('div', { id: 'ach-panel' });
    achPanel.style.display = 'none'; // ✅ corregido

    // Sub-filtros
    const filterBar = createElement('div', { class: 'ach-filter-bar' });
    [
        { key: 'all',         i18n: 'ach.filter.all',  fallback: 'Todos'           },
        { key: 'achievement', i18n: 'ach.filter.ach',  fallback: 'Logros técnicos' },
        { key: 'project',     i18n: 'ach.filter.proj', fallback: 'Proyectos'       }
    ].forEach(f => {
        filterBar.appendChild(createElement('button', {
            class: `ach-filter-btn${f.key === 'all' ? ' active' : ''}`,
            'data-ach-filter': f.key,
            'data-i18n': f.i18n
        }, [getTranslation(f.i18n) || f.fallback]));
    });
    achPanel.appendChild(filterBar);

    // Grid unificado
    const achGrid = createElement('div', { class: 'achievements-grid', id: 'ach-grid' });

    // ── Tarjetas de logros técnicos (achievements array) ──────
    const categoryIconMap = {
        support:       '🛠️',
        certification: '🎓',
        technical:     '⚙️',
        default:       '⚡'
    };

    achievements.forEach(ach => {
        const name = currentLang === 'en' ? (ach.title_en       || ach.title)       : ach.title;
        const desc = currentLang === 'en' ? (ach.description_en || ach.description) : ach.description;

        const techTags = createElement('div', { class: 'ach-tags' });
        (ach.technologies || []).forEach(t =>
            techTags.appendChild(createElement('span', { class: 'ach-badge' }, [t])));

        const card = createElement('div', {
            class: 'achievement-card',
            'data-ach-type': 'achievement'
        }, [
            createElement('div', { class: 'ach-icon' },
                [categoryIconMap[ach.category] || categoryIconMap.default]),
            createElement('div', { class: 'ach-body' }, [
                createElement('span', { class: 'ach-year' },  [ach.year || '']),
                createElement('h3',   { class: 'ach-title', 'data-ach-id':   ach.id }, [name]),
                createElement('p',    { class: 'ach-desc',  'data-ach-desc': ach.id }, [desc || '']),
                techTags
            ])
        ]);
        achGrid.appendChild(card);
    });

    // ── Tarjetas de proyectos ─────────────────────────────────
    const projIconMap = { unity: '🎮', android: '📱', software: '💻' };

    projects.forEach(proj => {
        const name = currentLang === 'en' ? (proj.name_en            || proj.name)            : proj.name;
        const desc = currentLang === 'en' ? (proj.shortDescription_en || proj.shortDescription) : proj.shortDescription;

        const techTags = createElement('div', { class: 'ach-tags' });
        (proj.technologies || []).forEach(t =>
            techTags.appendChild(createElement('span', { class: 'ach-badge' }, [t])));

        const linksEl = createElement('div', { class: 'ach-links' });
        if (proj.links?.github) {
            const a = createElement('a', { href: proj.links.github, target: '_blank',
                class: 'ach-link', 'data-link-type': 'code' });
            a.appendChild(createElement('i', { class: 'fab fa-github' }));
            const text = getTranslation('projects.code');
            const span = createElement('span', { 'data-i18n': 'projects.code' }, [' ' + text]);
            a.appendChild(span);
            linksEl.appendChild(a);
        }
        if (proj.links?.play) {
            const a = createElement('a', { href: proj.links.play, target: '_blank',
                class: 'ach-link', 'data-link-type': 'view' });
            a.appendChild(createElement('i', { class: 'fas fa-external-link-alt' }));
            const text2 = getTranslation('projects.view');
            const span2 = createElement('span', { 'data-i18n': 'projects.view' }, [' ' + text2]);
            a.appendChild(span2);
            linksEl.appendChild(a);
        }
        if (proj.links?.download) {
            const a = createElement('a', { href: proj.links.download, download: '',
                class: 'ach-link', 'data-link-type': 'download' });
            a.appendChild(createElement('i', { class: 'fas fa-download' }));
            const text3 = getTranslation('projects.download');
            const span3 = createElement('span', { 'data-i18n': 'projects.download' }, [' ' + text3]);
            a.appendChild(span3);
            linksEl.appendChild(a);
        }

        const thumb = proj.thumbnail || (proj.gallery && proj.gallery[0]);
        const card  = createElement('div', { class: 'achievement-card', 'data-ach-type': 'project' });

        if (thumb) {
            card.appendChild(createElement('img', {
                src: thumb, alt: proj.name, class: 'ach-thumb', loading: 'lazy' }));
        } else {
            card.appendChild(createElement('div', { class: 'ach-icon' },
                [projIconMap[proj.category] || '⚡']));
        }

        card.appendChild(createElement('div', { class: 'ach-body' }, [
            createElement('span', { class: 'ach-year' },  [proj.year || '']),
            createElement('h3',   { class: 'ach-title', 'data-ach-id':   proj.id }, [name]),
            createElement('p',    { class: 'ach-desc',  'data-ach-desc': proj.id }, [desc || '']),
            techTags,
            linksEl
        ]));
        achGrid.appendChild(card);
    });

    achPanel.appendChild(achGrid);
    section.appendChild(achPanel);

    // ── Lógica sub-filtros ────────────────────────────────────
    filterBar.querySelectorAll('.ach-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterBar.querySelectorAll('.ach-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.achFilter;
            achGrid.querySelectorAll('.achievement-card').forEach(card => {
                const show = f === 'all'
                    || (f === 'achievement' && card.dataset.achType === 'achievement')
                    || (f === 'project'     && card.dataset.achType === 'project');
                card.style.display = show ? '' : 'none';
            });
        });
    });

    // ── Lógica tabs principales ───────────────────────────────
    function switchTab(active) {                             // ✅ nombre correcto
        tabsDiv.querySelectorAll('.exp-tab-btn').forEach(b => b.classList.remove('active'));
        active.classList.add('active');
        const isExp = active === btnExp;
        timeline.style.display  = isExp ? ''     : 'none';
        achPanel.style.display  = isExp ? 'none' : 'block';
    }
    btnExp.addEventListener('click', () => switchTab(btnExp)); // ✅ 'click'
    btnAch.addEventListener('click', () => switchTab(btnAch)); // ✅ 'click'
}


function renderProfile(data) {
        const { profile } = data;
        $('#profileName').textContent = profile.name || '';
        $('#profileTagline').textContent = profile.tagline || '';
        $('#profileBio').textContent = profile.bio || '';
        
        const fullBioEl = $('#profileFullBio');
        if (fullBioEl) fullBioEl.textContent = profile.fullBio || profile.bio || '';

        const avatarImg = $('#profileAvatar');
        const avatarDesktop = $('#profileAvatarDesktop')
        if (avatarImg && profile.avatar) { avatarImg.src = profile.avatar; }
        if (avatarDesktop && profile.avatar) {avatarDesktop.src = profile.avatar;}

        $('#footerName').textContent = profile.name;
        $('#currentYear').textContent = new Date().getFullYear();

        const socialContainer = $('#socialLinks');
        if (profile.social && socialContainer) {
            const socials = [
                { key: 'github',   icon: 'fab fa-github',  title: 'GitHub' },
                { key: 'gitlab',   icon: 'fab fa-gitlab',  title: 'GitLab' },
                { key: 'linkedin', icon: 'fab fa-linkedin', title: 'LinkedIn' },
                { key: 'twitter',  icon: 'fab fa-twitter',  title: 'Twitter' },
                { key: 'itchio',   icon: 'fab fa-itch-io',  title: 'Itch.io' }
            ];
            socials.forEach(({ key, icon, title }) => {
                if (profile.social[key]) {
                    const link = createElement('a', { href: profile.social[key], target: '_blank', rel: 'noopener noreferrer', title, class: 'social-link' });
                    link.appendChild(createElement('i', { class: icon }));
                    socialContainer.appendChild(link);
                }
            });
        }

        $('#contactEmail').textContent = profile.email;
        $('#contactLocation').textContent = profile.location || 'Disponible remotamente';
    }

    // ============================================
    // Render Projects
    // ============================================

    function renderProjects(projects) {
        const container = $('#projectsGrid');
        if (!projects || projects.length === 0) {
        container.innerHTML = '<p class="loading">No projects available</p>';
            return;
        }
        $('#projectCount').textContent = projects.length;

        const projectCards = projects.map(project => {
            const card = createElement('div', { class: 'project-card', dataset: { category: project.category } });
            const imageUrl = project.thumbnail || (project.gallery && project.gallery[0]) || null;

            const placeholderEl = createElement('div', {
                class: 'card-image-placeholder',
                style: 'display: ' + (imageUrl ? 'none' : 'flex')
            }, [getCategoryIcon(project.category)]);

            if (imageUrl) {
                const imgEl = createElement('img', {
                    src: imageUrl,
                    alt: project.name,
                    class: 'card-image',
                    loading: 'lazy',
                    decoding: 'async'
                });
                imgEl.addEventListener('error', function onImgFail() {
                    this.style.display = 'none';
                    const ph = this.closest('.project-card')?.querySelector('.card-image-placeholder');
                    if (ph) ph.style.display = 'flex';
                    this.removeEventListener('error', onImgFail);
                });
                card.appendChild(imgEl);
            }

            card.appendChild(placeholderEl);

            if (project.category === 'unity' && project.links?.play) {
                const pb = createElement('button', { class: 'play-btn', title: 'Game' });
                pb.onclick = () => openGameModal(project.links.play);
                pb.appendChild(createElement('i', { class: 'fas fa-play' }));
                card.appendChild(pb);
            }

            const tagsContainer = createElement('div', { class: 'card-tags' });
            (project.technologies || []).forEach(tech => {
                tagsContainer.appendChild(createElement('span', { class: `tag tag-${project.category}` }, [tech]));
            });

            const linksContainer = createElement('div', { class: 'card-links' });

            // data-link-type allows getTranslation() to re-translate on language change
            if (project.links?.github) {

                const a = createElement('a', { href: project.links.github, target: '_blank', rel: 'noopener noreferrer', class: 'card-link', 'data-link-type': 'code' });
                a.appendChild(createElement('i', { class: 'fab fa-github' }));
                a.appendChild(document.createTextNode(' ' + getTranslation('projects.code')));
                linksContainer.appendChild(a);
            }
            if (project.links?.play) {
                const a = createElement('a', { href: project.links.play, target: '_blank', class: 'card-link', 'data-link-type': 'view' });
                a.appendChild(createElement('i', { class: 'fas fa-external-link-alt' }));
                a.appendChild(document.createTextNode(' ' + getTranslation('projects.view')));
                linksContainer.appendChild(a);
            }
            if (project.links?.download) {
                const a = createElement('a', { href: project.links.download, download: '', class: 'card-link', 'data-link-type': 'download' });
                a.appendChild(createElement('i', { class: 'fas fa-download' }));
                a.appendChild(document.createTextNode(' ' + getTranslation('projects.download')));
                linksContainer.appendChild(a);
            }

            card.appendChild(createElement('div', { class: 'card-content' }, [
                createElement('h3', { class: 'card-title' }, [project.name]),
                createElement('p', { class: 'card-description', 'data-project-id': project.id }, [project.shortDescription || project.description]),
                tagsContainer,
                linksContainer
            ]));

            return card;
        });

        container.append(...projectCards);
    }

    // ==========================================
    // Render Education
    // ==========================================

    function isEducationCompleted(item) {
        const st = String(item.status || '').toLowerCase();
        const stEn = String(item.status_en || '').toLowerCase();
        if (st.includes('curso') || stEn.includes('progress')) return false;
        return true;
    }

        function renderEducation(items, containerId) {
        const container = $(`#${containerId}`);
        if (!container || !items || items.length === 0) return;

        container.append(...items.map(item => {
            const card = createElement('div', { class: 'education-card' });

            const header = createElement('div', { class: 'education-header' });
            header.append(
                createElement('h3', { class: 'education-institution' }, [item.institution]),
                createElement('span', {
                    class: 'education-period',
                    'data-edu-period': item.id
                }, [currentLang === 'en' ? (item.period_en || item.period) : item.period])
            );

            const degree = createElement('p', {
                class: 'education-degree',
                'data-edu-id': item.id
            }, [currentLang === 'en' ? item.degree_en : item.degree]);

            const status = createElement('span', {
                class: `education-status ${item.status.toLowerCase() === 'en curso' ? 'status-active' : 'status-done'}`,
                'data-edu-status': item.id
            }, [currentLang === 'en' ? item.status_en : item.status]);

            const showCert = item.certificate && isEducationCompleted(item);
            if (showCert) {
                const certLink = createElement('a', {
                     href: '#',
                     class: 'course-cert-link education-cert-link'
                });
                certLink.appendChild(createElement('i', { class: 'fas fa-certificate', 'aria-hidden': 'true' }));
                certLink.appendChild(createElement('span', { 'data-i18n': 'education.certificate' }, [getTranslation('education.certificate')]));
                certLink.addEventListener('click', (e) => {
                   e.preventDefault();
                   openDiplomaModal(item.certificate);
                });
                card.append(header, degree, status, certLink)
            } else card.append(header, degree, status);
            return card;
        }));
    }

    function renderCourses(courses) {
        const container = $('#coursesGrid');
        if (!container || !courses || courses.length === 0) return;

        container.append(...courses.map(item => {
            const card = createElement('div', { class: 'course-card' });

            const platform = createElement('span', {
                class: 'course-platform',
                'data-course-platform': item.id
            }, [currentLang === 'en' ? (item.platform_en || item.platform) : item.platform]);

            const name = createElement('h3', {
                class: 'course-name',
                'data-course-id': item.id
            }, [currentLang === 'en' ? item.name_en : item.name]);

            const footer = createElement('div', { class: 'course-footer' });
            footer.appendChild(createElement('span', {
                class: 'course-period',
                'data-course-period': item.id
            }, [currentLang === 'en' ? (item.period_en || item.period) : item.period]));

            if (item.hours) {
                footer.appendChild(createElement('span', {
                    class: 'course-hours',
                    'data-course-hours': item.id
                }, [currentLang === 'en' ? (item.hours_en || item.hours) : item.hours]));
            }

            if (item.certificate) {
                const link = createElement('a', {
                    href: '#',
                    class: 'course-cert-link'
                });
                link.appendChild(createElement('i', { class: 'fas fa-certificate', 'aria-hidden': 'true' }));
                link.appendChild(createElement('span', { 'data-i18n': 'education.certificate' }, [getTranslation('education.certificate')]));
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    openDiplomaModal(item.certificate);
                });

                footer.appendChild(link);
            }

            card.append(platform, name, footer);
            return card;
        }));
    }   
    // ============================================
    // Render Skills
    // ============================================

    function renderSkills(skills) {
        const container = $('#skillsGrid');
        if (!skills || skills.length === 0) { container.innerHTML = '<p class="loading">There are no skills.</p>'; return; }

        container.append(...skills.map(skill => {
            const item = createElement('div', { class: 'skill-item' });
            const iconEl = skill.icon
                ? createElement('img', { src: skill.icon, alt: skill.name, class: 'skill-icon-img', style: 'width:30px;height:30px;' })
                : document.createTextNode(skill.name.charAt(0));
            item.append(
                createElement('div', { class: 'skill-icon' }, [iconEl]),
                createElement('div', { class: 'skill-info' }, [
                    createElement('h4', { class: 'skill-name' }, [skill.name]),
                    createElement('div', { class: 'skill-level' }, [
                        createElement('div', { class: 'skill-progress', style: `width: ${skill.level || 0}%` })
                    ])
                ])
            );
            return item;
        }));
    }

    // ============================================
    // Contact Render
    // ============================================

function renderContact(data) {
        const { contact } = data;
        if (contact?.fields) {
            const n = $('#name'), e = $('#email'), m = $('#message');
            if (n && contact.fields.name) n.placeholder = contact.fields.name;
            if (e && contact.fields.email) e.placeholder = contact.fields.email;
            if (m && contact.fields.message) m.placeholder = contact.fields.message;
        }
        
        // Inicializar CV con modales
        if (data.cv) {
            setupCVButtons(data.cv);
        }
    }

    // ============================================
    // Slider
    // ============================================

    function initSkillsSlider(skills) {
        const sc = document.getElementById('skillsScroll');
        if (!sc) return;

        const prev = document.getElementById('skillsPrev');
        const next = document.getElementById('skillsNext');
        const countEl = document.getElementById('skillsCount');
        if (countEl) countEl.innerHTML = `${skills.length} <span data-i18n="skills.count"></span>`;

        const amt = 250;
        if (prev) prev.addEventListener('click', () => sc.scrollBy({ left: -amt, behavior: 'smooth' }));
        if (next) next.addEventListener('click', () => sc.scrollBy({ left: amt, behavior: 'smooth' }));

        const upd = () => {
            if (prev) prev.disabled = sc.scrollLeft <= 0;
            if (next) next.disabled = sc.scrollLeft >= sc.scrollWidth - sc.clientWidth - 1;
        };
        sc.addEventListener('scroll', upd);
        upd();

        let tx = 0;
        sc.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; }, { passive: true });
        sc.addEventListener('touchend', e => {
            const d = tx - e.changedTouches[0].screenX;
            if (Math.abs(d) > 50) sc.scrollBy({ left: d > 0 ? amt : -amt, behavior: 'smooth' });
        }, { passive: true });
    }

    // ============================================
    // Filters and Modal
    // ============================================

    function filterProjects(category) {
        appState.currentFilter = category;
        $$('.filter-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === category));
        $$('.project-card').forEach(card => card.classList.toggle('hidden', category !== 'all' && card.dataset.category !== category));
    }

    function isCertificatePdf(url) {
        if (!url || typeof url !== 'string') return false;
        return url.split('?')[0].toLowerCase().endsWith('.pdf');
    }

    function openDiplomaModal(mediaUrl) {
        const modal = $('#diplomaModal');
        const img = $('#diplomaImg');
        const frame = $('#diplomaPdfFrame');
        if (!modal || !img) return;

        if (isCertificatePdf(mediaUrl) && frame) {
            img.hidden = true;
            img.removeAttribute('src');
            frame.hidden = false;
            const base = mediaUrl.split('#')[0];
            frame.src = `${base}#view=FitH&toolbar=1&navpanes=0`;
        } else {
            if (frame) {
                frame.hidden = true;
                frame.removeAttribute('src');
            }
            img.hidden = false;
            img.src = mediaUrl;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function openGameModal(gameUrl) {
        if (!gameUrl) return;
        $('#gameFrame').src = gameUrl;
        $('#gameModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDiplomaModal() {
        const img = $('#diplomaImg');
        const frame = $('#diplomaPdfFrame');
        const modal = $('#diplomaModal');
        if (img) {
            img.removeAttribute('src');
            img.hidden = false;
        }
        if (frame) {
            frame.removeAttribute('src');
            frame.hidden = true;
        }
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function closeGameModal() {
        $('#gameFrame').src = '';
        $('#gameModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // Navigation
    // ============================================

    function setupNavigation() {
        const sidebar = $('#sidebar');
        const backdrop = $('#sidebarBackdrop');
        const sidebarToggle = $('#sidebarToggle');
        const isMobileNav = () => window.matchMedia('(max-width: 768px)').matches;

        function closeSidebar() {
            if (!sidebar || !backdrop || !sidebarToggle) return;
            sidebar.classList.remove('active');
            backdrop.classList.remove('active');
            backdrop.setAttribute('aria-hidden', 'true');
            sidebarToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        function openSidebar() {
            if (!sidebar || !backdrop || !sidebarToggle) return;
            sidebar.classList.add('active');
            backdrop.classList.add('active');
            backdrop.setAttribute('aria-hidden', 'false');
            sidebarToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function toggleSidebar() {
            if (sidebar?.classList.contains('active')) closeSidebar();
            else openSidebar();
        }

        if (sidebarToggle && sidebar && backdrop) {
            sidebarToggle.addEventListener('click', () => toggleSidebar());
            backdrop.addEventListener('click', () => closeSidebar());
        }

        window.addEventListener('resize', () => {
            if (!isMobileNav()) closeSidebar();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar?.classList.contains('active')) closeSidebar();
        });

        $$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#' || href.length < 2) return;
                const target = $(href);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                if (isMobileNav()) closeSidebar();
            });
        });

        document.querySelectorAll('.language-switch [data-lang]').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                if (lang && lang !== currentLang) loadLanguage(lang);
            });
        });

        const sections = $$('section[id]');
        const navLinks = $$('.sidebar .nav-link');
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
                let current = '';
                sections.forEach(s => { if (scrollY >= s.offsetTop - 200) current = s.getAttribute('id'); });
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
                });
            }, 100);
        });
    }

    // ============================================
    // EmailJS Form — DO NOT MODIFY
    // ============================================

    function setupContactForm() {
        const submitBtn = document.getElementById('submit-btn');
        const form = document.getElementById('contact-form');
        if (!submitBtn || !form) return;

        // CONFIGURATION EMAILJS - DO NOT TOUCH
        const emailjsConfig = { publicKey: '9bdYHELMIBud0OpOW', serviceId: 'service_gj0z1c7', templateId: 'template_likc0ei' };
        if (typeof emailjs !== 'undefined') emailjs.init(emailjsConfig.publicKey);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }

            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            try {
                const templateParams = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    message: document.getElementById('message').value
                };
                if (typeof emailjs !== 'undefined') {
                    await emailjs.send(emailjsConfig.serviceId, emailjsConfig.templateId, templateParams);
                    showNotification('Mensaje enviado correctamente! Te respondere pronto.', 'success');
                }
                form.reset();
            } catch (error) {
                showNotification('Error al enviar: ' + error.message, 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    function showNotification(message, type = 'info') {
        const n = createElement('div', {
            class: `alert alert-${type === 'success' ? 'success' : 'error'}`,
            style: `position:fixed;top:20px;right:20px;z-index:9999;background:${type === 'success' ? '#28a745' : '#dc3545'};color:white;padding:15px 20px;border-radius:5px;`
        }, [message]);
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 5000);
    }

    function showError(message) { showNotification(message, 'error'); }

    // ============================================
    // Inicializatión
    // ============================================

    let typingState = {
        currentLine: 0,
        currentChar: 0,
        currentSnippet: 0,
        isDeleting: false,
        snippetIndex: 0
    };

    const typingSnippets = [
        // JavaScript - Fetch API
        `// Dynamic Portfolio Loader
const loadPortfolio = async () => {
  try {
    const response = await fetch('portfolio.json');
    const data = await response.json();
    renderDynamicContent(data);
  } catch (error) {
    console.error('Portfolio load failed:', error);
  }
};

// i18n System
const i18n = new IntlSystem({
  languages: ['es', 'en'],
  default: 'es'
});`,

        // Python - ML Model
        `"""AI Game Agent Training
PyTorch Reinforcement Learning"""
import torch
import torch.nn as nn
import gym

class GameAgent(nn.Module):
    def __init__(self, state_size, action_size):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(state_size, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, action_size)
        )
    
    def forward(self, state):
        return self.network(state)

# Train agent
agent = GameAgent(8, 4)
optimizer = torch.optim.Adam(agent.parameters())`,

        // JSON - API Response
        `{
  "portfolio": {
    "profile": {
      "name": "Juan Pablo Velez Amaya",
      "role": "Game & Software Developer",
      "projects": 25,
      "experience": "3+ years",
      "skills": [
        "Unity/C#", "JavaScript", "Python", 
        "React", "Node.js", "ML/AI"
      ]
    },
    "technologies": {
      "gameDev": ["Unity", "Unreal", "Godot"],
      "web": ["React", "Vue", "Node.js"],
      "ai": ["PyTorch", "TensorFlow"]
    }
  }
}`
    ];

    function typeLine(element, line, callback) {
        let i = typingState.currentChar;
        const speed = typingState.isDeleting ? 30 : 80;
        
        function type() {
            if (typingState.isDeleting) {
                element.textContent = line.substring(0, i);
                i--;
                if (i < 0) {
                    typingState.currentChar = 0;
                    typingState.currentLine++;
                    callback();
                    return;
                }
            } else {
                element.textContent = line.substring(0, i) + '|';
                i++;
                if (i > line.length) {
                    typingState.currentChar = line.length;
                    setTimeout(() => {
                        typingState.isDeleting = true;
                        type();
                    }, 1500);
                    return;
                }
            }
            setTimeout(type, speed);
        }
        type();
    }

    function initTypingAnimation() {
        const codeElement = $('.typing-text');
        if (!codeElement) return;

        function cycleSnippets() {
            const snippet = typingSnippets[typingState.snippetIndex];
            const lines = snippet.split('\\n');
            
            typingState.isDeleting = false;
            typingState.currentLine = 0;
            typingState.currentChar = 0;
            
            let lineIndex = 0;
            function processNextLine() {
                if (lineIndex >= lines.length) {
                    // Next snippet
                    typingState.snippetIndex = (typingState.snippetIndex + 1) % typingSnippets.length;
                    setTimeout(cycleSnippets, 2000);
                    return;
                }
                typeLine(codeElement, lines[lineIndex], () => {
                    lineIndex++;
                    processNextLine();
                });
            }
            processNextLine();
        }
        cycleSnippets();
    }

async function init() {
        console.log('Initializing portfolio...');
        document.body.classList.add('content-loading');

        portfolioData = await loadPortfolioData();

        if (portfolioData) {
            renderProfile(portfolioData);
            saveTextsBilingualProfile(portfolioData);
            renderProjects(portfolioData.projects);
            renderExperience();
            renderSkills(portfolioData.skills);
            renderContact(portfolioData);

            if(portfolioData.education) {
                renderEducation(portfolioData.education.technical, 'technicalGrid');
                renderEducation(portfolioData.education.technologist, 'technologistGrid');
                renderCourses(portfolioData.education.courses);
            }

            $$('.edu-tab').forEach(tab =>{
               tab.addEventListener('click', () => {
                   $$('.edu-tab').forEach(t => t.classList.remove('active'));
                   $$('.edu-content').forEach(c => c.classList.remove('active'));
                   tab.classList.add('active');
                   $(`#tab-${tab.dataset.tab}`).classList.add('active');
               });
            });

            if (portfolioData.skills?.length > 0) initSkillsSlider(portfolioData.skills);

            setupNavigation();
            setupContactForm();
            initTypingAnimation();

            $$('.filter-btn').forEach(btn => btn.addEventListener('click', () => filterProjects(btn.dataset.filter)));

            const modalClose = $('#modalClose');
            if (modalClose) modalClose.addEventListener('click', closeGameModal);
            const gameModal = $('#gameModal');
            if (gameModal) gameModal.addEventListener('click', e => { if (e.target.id === 'gameModal') closeGameModal(); });
    document.addEventListener('keydown', e => { 
                if (e.key === 'Escape') {
                     closeGameModal(); 
                     closeDiplomaModal();
                     closeCVModal();
                }
            });

            const diplomaClose = $('#diplomaClose');
            if (diplomaClose) diplomaClose.addEventListener('click', closeDiplomaModal);

            const diplomaModal = $('#diplomaModal');
            if(diplomaModal) diplomaModal.addEventListener('click', e => {
               if(e.target.id === 'diplomaModal') closeDiplomaModal();
            });
            
            // Modal CV events
            const cvModal = $('#cvModal');
            const cvClose = $('#cvClose');
            if (cvClose) cvClose.addEventListener('click', closeCVModal);
            if (cvModal) cvModal.addEventListener('click', e => {
                if (e.target.id === 'cvModal') closeCVModal();
            });

            document.body.classList.remove('content-loading');
            const loader = document.getElementById('loader-overlay');
            if (loader) loader.classList.add('hidden');

            console.log('Portfolio loaded correctly');
        }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const lang = localStorage.getItem('lang') || 'es';
        await loadLanguage(lang, { skipApply: true });
        await init();
        applyTranslation();
    });