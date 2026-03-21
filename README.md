# Juan Pablo Vélez Amaya - Game & Software Developer Portfolio 🎮💻

[![GitHub](https://img.shields.io/badge/GitHub-AmayaJuan-black?logo=github)](https://github.com/AmayaJuan/Portafolios)
[![Responsive](https://img.shields.io/badge/Responsive-✓-blue)](https://github.com/AmayaJuan/Portafolios)
[![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-100%25-4CAF50)](https://github.com/AmayaJuan/Portafolios)
[![EmailJS](https://img.shields.io/badge/EmailJS-Working-00D4AA)](https://github.com/AmayaJuan/Portafolios)
[![Multilingual](https://img.shields.io/badge/ES%2Fen-✓-purple)](https://github.com/AmayaJuan/Portafolios)

**Modern responsive SPA portfolio with Unity WebGL support, bilingual i18n (ES/EN), dynamic Experience timeline, hero code animation, and production-ready EmailJS contact form.**

## ✨ Features Implemented

| Feature | Status | Tech |
|---------|--------|------|
| **Experience Timeline** | ✅ **NEW** | Dynamic from `portfolio.json`, horizontal layout |
| **Hero 3-Column Layout** | ✅ **FIXED** | Code \| Text \| Profile photo **RIGHT side** |
| **Dynamic Code Animation** | ✅ | JS/Python/JSON snippets rotate infinitely |
| **Bilingual i18n** | ✅ | ES/EN switcher, all strings translated |
| **Unity WebGL Modal** | ✅ | Fullscreen game demos |
| **EmailJS Contact** | ✅ | Production keys, working form |
| **Skills Horizontal Slider** | ✅ | Touch/swipe support |
| **Project Filters** | ✅ | Unity/Android/Software categories |
| **Fully Responsive** | ✅ | Mobile-first 360px → desktop |

## 🚀 Quick Start

```bash
cd \"d:/Documents/Git/HTML CSS JS/Portafolios\"
# Python (recommended)
python -m http.server 8000
# Open http://localhost:8000
```

## 📁 Structure

```
├── index.html                 # SPA entry
├── portfolio.json             # Profile + Experience + Projects + Skills
├── css/sections.css           # Hero grid, timeline, code block styles
├── js/main.js                 # renderExperience(), typing animation
├── lang/es.json, en.json      # i18n translations
└── README.md                  # Updated ✓
```

## 🎮 Live Sections

1. **Hero**: Code animation LEFT, Profile photo **RIGHT** ✓
2. **Experience**: Shows 2 real items from JSON timeline
3. **Projects**: 4 demos + filters + WebGL play
4. **Contact**: Working EmailJS form

## 🔧 Recent Fixes (BLACKBOXAI)

| Fix | Date |
|-----|------|
| Hero photo → **RIGHT column** (`grid-area: visual`) | 2024 |
| Duplicate `.profile-image` CSS removed | 2024 |
| Experience timeline → **Dynamic from JSON** | 2024 |
| `portfolioData` global for `renderExperience()` | 2024 |

## 📊 Validation

```
✅ Experience shows real data (no placeholder)
✅ Photo RIGHT side desktop, centered mobile
✅ Hero balanced 3-column grid
✅ Responsive all devices
✅ Animation loops infinitely
✅ Navigation scrolls to Experience section
✅ EmailJS untouched & working
✅ Spanish comments preserved (POLICIES)
```

## 🎯 Next Steps (Optional)

1. Add more experience items to `portfolio.json`
2. Upload new Unity builds to `builds/`
3. Deploy to GitHub Pages/Netlify

**Production ready** - All objectives completed! 🚀

---
*Updated Mar 2024 | BLACKBOXAI Implementation*

