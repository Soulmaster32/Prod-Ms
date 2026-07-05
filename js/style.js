/**
 * ============================================================================
 * QUALITY GROUP | MS SECTION - DYNAMIC THEME & APPEARANCE ENGINE (style.js)
 * ============================================================================
 * Features:
 * - Tri-Mode Display: Dark (Default), OLED True Black, and Crisp Light Mode
 * - 6 High-Contrast Accent Palettes (Royal Sky, Emerald Mint, Cyber Violet, etc.)
 * - Hardware-Accelerated Smooth CSS Transition Engine
 * - Interactive Floating Theme Studio Widget with Backdrop Blur
 * - Zero-HTML Modification: Dynamically maps over existing Tailwind utility classes
 * - LocalStorage Persistence & Alt+T Keyboard Shortcut
 * ============================================================================
 */

(function () {
    'use strict';

    // Default Configuration State
    const CONFIG = {
        storageKey: 'QA_MS_Theme_Settings_v1',
        defaultMode: 'dark', // 'dark' | 'oled' | 'light'
        defaultPalette: 'royal', // 'royal' | 'emerald' | 'violet' | 'amber' | 'crimson' | 'teal'
        defaultTransitions: true,
        defaultMeshBg: true,
        defaultGlass: true
    };

    // Color Palette Mappings (Overrides Tailwind primary/secondary utilities)
    const PALETTES = {
        royal: {
            name: 'Royal Sky (Default)',
            primary: '#2563eb',     // royalblue-600
            primaryHover: '#1d4ed8', // royalblue-700
            accent: '#38bdf8',      // sky-400
            accentHover: '#0ea5e9',  // sky-500
            gradientFrom: '#2563eb',
            gradientTo: '#0ea5e9',
            glow: 'rgba(37, 99, 235, 0.4)',
            preview: 'from-blue-600 to-sky-400'
        },
        emerald: {
            name: 'Emerald Mint',
            primary: '#059669',     // emerald-600
            primaryHover: '#047857', // emerald-700
            accent: '#34d399',      // emerald-400
            accentHover: '#10b981',  // emerald-500
            gradientFrom: '#059669',
            gradientTo: '#10b981',
            glow: 'rgba(5, 150, 105, 0.4)',
            preview: 'from-emerald-600 to-teal-400'
        },
        violet: {
            name: 'Cyber Violet',
            primary: '#7c3aed',     // violet-600
            primaryHover: '#6d28d9', // violet-700
            accent: '#c084fc',      // purple-400
            accentHover: '#a855f7',  // purple-500
            gradientFrom: '#7c3aed',
            gradientTo: '#d946ef',
            glow: 'rgba(124, 58, 237, 0.4)',
            preview: 'from-purple-600 to-pink-500'
        },
        amber: {
            name: 'Sunset Amber',
            primary: '#d97706',     // amber-600
            primaryHover: '#b45309', // amber-700
            accent: '#fbbf24',      // amber-400
            accentHover: '#f59e0b',  // amber-500
            gradientFrom: '#d97706',
            gradientTo: '#f59e0b',
            glow: 'rgba(217, 119, 6, 0.4)',
            preview: 'from-amber-600 to-yellow-400'
        },
        crimson: {
            name: 'Crimson Ruby',
            primary: '#e11d48',     // rose-600
            primaryHover: '#be123c', // rose-700
            accent: '#fb7185',      // rose-400
            accentHover: '#f43f5e',  // rose-500
            gradientFrom: '#e11d48',
            gradientTo: '#fb7185',
            glow: 'rgba(225, 29, 72, 0.4)',
            preview: 'from-rose-600 to-red-400'
        },
        teal: {
            name: 'Teal Cyan',
            primary: '#0d9488',     // teal-600
            primaryHover: '#0f766e', // teal-700
            accent: '#22d3ee',      // cyan-400
            accentHover: '#06b6d4',  // cyan-500
            gradientFrom: '#0d9488',
            gradientTo: '#06b6d4',
            glow: 'rgba(13, 148, 136, 0.4)',
            preview: 'from-teal-600 to-cyan-400'
        }
    };

    // State Management
    let state = { ...CONFIG };

    /**
     * Initialize Theme Engine
     */
    function init() {
        loadState();
        injectStyleSheet();
        injectThemeStudioUI();
        applyAllSettings();
        setupEventListeners();
        console.log('%c🎨 QA MS Section Theme Engine Initialized', 'background: #2563eb; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
    }

    /**
     * Load state from LocalStorage
     */
    function loadState() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (saved) {
                state = { ...CONFIG, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Could not load theme settings from storage:', e);
        }
    }

    /**
     * Save current state to LocalStorage
     */
    function saveState() {
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save theme settings:', e);
        }
    }

    /**
     * Inject Master Dynamic CSS Rules into the DOM
     */
    function injectStyleSheet() {
        let styleEl = document.getElementById('qa-theme-engine-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'qa-theme-engine-styles';
            document.head.appendChild(styleEl);
        }
    }

    /**
     * Generate and apply dynamic CSS stylesheet rules
     */
    function applyAllSettings() {
        const styleEl = document.getElementById('qa-theme-engine-styles');
        if (!styleEl) return;

        const pal = PALETTES[state.palette] || PALETTES.royal;
        const isLight = state.mode === 'light';
        const isOled = state.mode === 'oled';

        // 1. Update HTML Root Class for Dark/Light Mode
        const htmlEl = document.documentElement;
        if (isLight) {
            htmlEl.classList.remove('dark');
            htmlEl.classList.add('light');
        } else {
            htmlEl.classList.remove('light');
            htmlEl.classList.add('dark');
        }

        // 2. Build Dynamic Override Rules
        let css = '';

        // -- TRANSITIONS ENGINE --
        if (state.transitions) {
            css += `
                *, *::before, *::after {
                    transition: background-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                                border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                                box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                                color 0.25s ease !important;
                }
                /* Disable transitions on animations and specific interactive elements for performance */
                .animate-pulse, .animate-ping, .animate-spin, .no-transition, input, select, textarea {
                    transition: none !important;
                }
            `;
        }

        // -- COLOR PALETTE OVERRIDES --
        if (state.palette !== 'royal') {
            css += `
                /* Primary Backgrounds */
                .bg-royalblue-600, .bg-royalblue-500 { background-color: ${pal.primary} !important; }
                .hover\\:bg-royalblue-500:hover, .hover\\:bg-royalblue-600:hover { background-color: ${pal.primaryHover} !important; }
                
                /* Accent Texts & Icons */
                .text-sky-400, .text-cyan-400 { color: ${pal.accent} !important; }
                .hover\\:text-sky-400:hover, .hover\\:text-cyan-300:hover { color: ${pal.accentHover} !important; }
                .text-sky-300, .text-sky-200 { color: ${pal.accent} !important; opacity: 0.9; }
                
                /* Borders & Glows */
                .border-sky-400\\/40, .border-sky-500\\/30, .border-cyan-500\\/30, .border-cyan-500\\/40 { 
                    border-color: ${pal.accent}40 !important; 
                }
                .hover\\:border-sky-400\\/50:hover { border-color: ${pal.accent}80 !important; }
                
                /* Gradients */
                .from-royalblue-600 { --tw-gradient-from: ${pal.gradientFrom} !important; --tw-gradient-to: rgba(0, 0, 0, 0) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important; }
                .to-sky-500, .to-cyan-500, .to-sky-400 { --tw-gradient-to: ${pal.gradientTo} !important; }
                .via-sky-400, .via-cyan-300 { --tw-gradient-via-stops: var(--tw-gradient-from), ${pal.accent}, var(--tw-gradient-to) !important; }
                
                /* Shadows & Glow Box */
                [class*="shadow-[0_0_"] {
                    box-shadow: 0 0 20px ${pal.glow} !important;
                }
                
                /* Tab Active States */
                .tab-btn.active, .user-tab-btn.active {
                    background-color: ${pal.primary} !important;
                    border-color: ${pal.accent} !important;
                    box-shadow: 0 0 15px ${pal.glow} !important;
                }
            `;
        }

        // -- DISPLAY MODES (OLED PITCH BLACK) --
        if (isOled) {
            css += `
                body, .bg-dark-900 { background-color: #000000 !important; }
                .bg-dark-700, .bg-dark-700\\/60, .bg-dark-700\\/40 { background-color: #070709 !important; }
                .bg-dark-500, .bg-dark-500\\/80 { background-color: #0d0d12 !important; }
                aside, header, footer { background-color: #030305 !important; }
                .border-slate-800, .border-slate-800\\/80, .border-slate-800\\/60 { border-color: #161b26 !important; }
            `;
        }

        // -- DISPLAY MODES (CRISP LIGHT MODE) --
        if (isLight) {
            css += `
                body, .bg-dark-900 { background-color: #f8fafc !important; color: #0f172a !important; }
                .bg-dark-700, .bg-dark-700\\/60, .bg-dark-700\\/40, .bg-dark-700\\/80 { background-color: #ffffff !important; color: #0f172a !important; }
                .bg-dark-500, .bg-dark-500\\/80 { background-color: #f1f5f9 !important; color: #0f172a !important; }
                .bg-dark-400, .bg-dark-300 { background-color: #e2e8f0 !important; color: #0f172a !important; }
                
                /* Headers & Navigation in Light Mode */
                header, aside { background-color: rgba(255, 255, 255, 0.85) !important; border-color: #e2e8f0 !important; }
                footer { background-color: #f1f5f9 !important; border-color: #e2e8f0 !important; }
                
                /* Text Overrides */
                .text-white { color: #0f172a !important; }
                .text-slate-200, .text-slate-300 { color: #334155 !important; }
                .text-slate-400 { color: #64748b !important; }
                .text-slate-500 { color: #94a3b8 !important; }
                
                /* Border Overrides */
                .border-slate-800, .border-slate-800\\/80, .border-slate-800\\/60, .border-slate-700, .border-slate-700\\/80 { 
                    border-color: #cbd5e1 !important; 
                }
                .divide-slate-800\\/60 > :not([hidden]) ~ :not([hidden]) { border-color: #e2e8f0 !important; }
                
                /* Table & Cards */
                table thead tr { background-color: #f1f5f9 !important; }
                tr.hover\\:bg-dark-700\\/40:hover { background-color: #e2e8f0 !important; }
                
                /* Input Fields */
                input, select, textarea { 
                    background-color: #ffffff !important; 
                    border-color: #cbd5e1 !important; 
                    color: #0f172a !important; 
                }
                input::placeholder, textarea::placeholder { color: #94a3b8 !important; }
                
                /* Keep Badges & Buttons Bright */
                .bg-royalblue-600, [class*="bg-gradient-to-r"] { color: #ffffff !important; }
                .bg-royalblue-600 .text-sky-200 { color: #ffffff !important; }
            `;
        }

        // -- MESH & GRID BACKGROUND EFFECTS --
        if (!state.meshBg) {
            css += `
                .bg-hero-mesh, .bg-grid-pattern {
                    background-image: none !important;
                }
            `;
        }

        // -- GLASSMORPHISM BLUR --
        if (!state.glass) {
            css += `
                .backdrop-blur-md, .backdrop-blur-xl, .backdrop-blur-sm, .backdrop-blur-lg {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }
            `;
        }

        styleEl.innerHTML = css;
        updateUIControls();
        saveState();
    }

    /**
     * Inject Floating Theme Studio UI Widget into DOM
     */
    function injectThemeStudioUI() {
        if (document.getElementById('qa-theme-studio-widget')) return;

        const widget = document.createElement('div');
        widget.id = 'qa-theme-studio-widget';
        widget.className = 'fixed bottom-6 right-6 z-[9000] font-sans';
        
        widget.innerHTML = `
            <!-- Floating Trigger Button -->
            <button id="qa-theme-toggle-btn" onclick="window.QAThemeEngine.toggleStudio()" 
                class="w-14 h-14 rounded-full bg-gradient-to-tr from-royalblue-600 to-sky-400 text-white shadow-[0_0_25px_rgba(56,189,248,0.5)] flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all duration-300 group border border-white/20">
                <i class="fas fa-palette group-hover:rotate-45 transition-transform duration-500"></i>
            </button>

            <!-- Theme Studio Popover Drawer -->
            <div id="qa-theme-drawer" 
                class="absolute bottom-16 right-0 w-80 sm:w-88 bg-dark-700/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl p-5 text-white transform scale-95 opacity-0 pointer-events-none transition-all duration-300 origin-bottom-right">
                
                <!-- Drawer Header -->
                <div class="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 text-sm">
                            <i class="fas fa-sliders-h"></i>
                        </div>
                        <div>
                            <h4 class="text-sm font-extrabold text-white leading-none">Theme Studio</h4>
                            <span class="text-[10px] font-semibold text-sky-400 uppercase tracking-wider block mt-1">Appearance & FX</span>
                        </div>
                    </div>
                    <button onclick="window.QAThemeEngine.toggleStudio()" class="text-slate-400 hover:text-white p-1 rounded-lg text-sm">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Section 1: Display Mode (Tri-Mode) -->
                <div class="mb-5">
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Display Mode</label>
                    <div class="grid grid-cols-3 gap-1.5 bg-dark-900 p-1 rounded-xl border border-slate-800">
                        <button onclick="window.QAThemeEngine.setMode('dark')" id="mode-btn-dark" class="py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-slate-400 hover:text-white">
                            <i class="fas fa-moon text-[11px]"></i> Dark
                        </button>
                        <button onclick="window.QAThemeEngine.setMode('oled')" id="mode-btn-oled" class="py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-slate-400 hover:text-white">
                            <i class="fas fa-circle text-[10px]"></i> OLED
                        </button>
                        <button onclick="window.QAThemeEngine.setMode('light')" id="mode-btn-light" class="py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-slate-400 hover:text-white">
                            <i class="fas fa-sun text-[11px]"></i> Light
                        </button>
                    </div>
                </div>

                <!-- Section 2: Color Palette Picker -->
                <div class="mb-5">
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Accent Color Palette</label>
                    <div class="grid grid-cols-2 gap-2">
                        ${Object.entries(PALETTES).map(([key, p]) => `
                            <button onclick="window.QAThemeEngine.setPalette('${key}')" id="pal-btn-${key}" 
                                class="p-2 rounded-xl bg-dark-500 border border-slate-800 hover:border-slate-600 flex items-center gap-2.5 text-left transition-all group">
                                <span class="w-5 h-5 rounded-full bg-gradient-to-tr ${p.preview} shrink-0 shadow-sm group-hover:scale-110 transition-transform"></span>
                                <span class="text-xs font-bold text-slate-300 group-hover:text-white truncate">${p.name.split(' ')[0]}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Section 3: Visual FX & Transitions -->
                <div class="mb-5 space-y-2.5">
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Visual Effects & UX</label>
                    
                    <!-- Smooth Transitions Toggle -->
                    <div class="flex items-center justify-between p-2.5 rounded-xl bg-dark-500 border border-slate-800">
                        <span class="text-xs font-semibold text-slate-300 flex items-center gap-2">
                            <i class="fas fa-magic text-sky-400 w-4 text-center"></i> Smooth Transitions
                        </span>
                        <input type="checkbox" id="fx-transitions" onchange="window.QAThemeEngine.toggleFX('transitions', this.checked)" 
                            class="w-4 h-4 accent-royalblue-600 rounded cursor-pointer">
                    </div>

                    <!-- Mesh Background Toggle -->
                    <div class="flex items-center justify-between p-2.5 rounded-xl bg-dark-500 border border-slate-800">
                        <span class="text-xs font-semibold text-slate-300 flex items-center gap-2">
                            <i class="fas fa-vector-square text-cyan-400 w-4 text-center"></i> Mesh & Grid Pattern
                        </span>
                        <input type="checkbox" id="fx-mesh" onchange="window.QAThemeEngine.toggleFX('meshBg', this.checked)" 
                            class="w-4 h-4 accent-royalblue-600 rounded cursor-pointer">
                    </div>

                    <!-- Glassmorphism Toggle -->
                    <div class="flex items-center justify-between p-2.5 rounded-xl bg-dark-500 border border-slate-800">
                        <span class="text-xs font-semibold text-slate-300 flex items-center gap-2">
                            <i class="fas fa-window-restore text-emerald-400 w-4 text-center"></i> Glassmorphism Blur
                        </span>
                        <input type="checkbox" id="fx-glass" onchange="window.QAThemeEngine.toggleFX('glass', this.checked)" 
                            class="w-4 h-4 accent-royalblue-600 rounded cursor-pointer">
                    </div>
                </div>

                <!-- Drawer Footer Actions -->
                <div class="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span class="text-[10px] text-slate-500 font-medium">Shortcut: <kbd class="px-1.5 py-0.5 bg-dark-900 border border-slate-800 rounded text-slate-400">Alt + T</kbd></span>
                    <button onclick="window.QAThemeEngine.resetDefaults()" 
                        class="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1">
                        <i class="fas fa-undo text-[10px]"></i> Reset Defaults
                    </button>
                </div>

            </div>
        `;

        document.body.appendChild(widget);
    }

    /**
     * Update active visual indicators on the Theme Studio UI controls
     */
    function updateUIControls() {
        // Update Mode Buttons
        ['dark', 'oled', 'light'].forEach(mode => {
            const btn = document.getElementById(`mode-btn-${mode}`);
            if (!btn) return;
            if (state.mode === mode) {
                btn.className = 'py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-royalblue-600 text-white shadow-md';
            } else {
                btn.className = 'py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-slate-400 hover:text-white hover:bg-dark-700';
            }
        });

        // Update Palette Buttons
        Object.keys(PALETTES).forEach(pal => {
            const btn = document.getElementById(`pal-btn-${pal}`);
            if (!btn) return;
            if (state.palette === pal) {
                btn.classList.add('ring-2', 'ring-sky-400', 'bg-dark-700');
            } else {
                btn.classList.remove('ring-2', 'ring-sky-400', 'bg-dark-700');
            }
        });

        // Update Checkboxes
        const chkTrans = document.getElementById('fx-transitions');
        const chkMesh = document.getElementById('fx-mesh');
        const chkGlass = document.getElementById('fx-glass');
        if (chkTrans) chkTrans.checked = state.transitions;
        if (chkMesh) chkMesh.checked = state.meshBg;
        if (chkGlass) chkGlass.checked = state.glass;
    }

    /**
     * Setup Keyboard Shortcuts and Click Outside Listeners
     */
    function setupEventListeners() {
        // Shortcut: Alt + T (or Option + T) to toggle studio
        window.addEventListener('keydown', (e) => {
            if (e.altKey && (e.key === 't' || e.key === 'T')) {
                e.preventDefault();
                window.QAThemeEngine.toggleStudio();
            }
        });

        // Click outside to close drawer
        document.addEventListener('click', (e) => {
            const widget = document.getElementById('qa-theme-studio-widget');
            const drawer = document.getElementById('qa-theme-drawer');
            if (widget && drawer && !widget.contains(e.target)) {
                drawer.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
                drawer.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
            }
        });
    }

    /**
     * ============================================================================
     * PUBLIC API (window.QAThemeEngine)
     * ============================================================================
     */
    window.QAThemeEngine = {
        /**
         * Open or close the Theme Studio floating drawer
         */
        toggleStudio: function () {
            const drawer = document.getElementById('qa-theme-drawer');
            if (!drawer) return;
            const isClosed = drawer.classList.contains('opacity-0');
            if (isClosed) {
                drawer.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
                drawer.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
            } else {
                drawer.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
                drawer.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
            }
        },

        /**
         * Set display mode ('dark' | 'oled' | 'light')
         */
        setMode: function (mode) {
            if (['dark', 'oled', 'light'].includes(mode)) {
                state.mode = mode;
                applyAllSettings();
                this.triggerFeedback();
            }
        },

        /**
         * Set color palette ('royal' | 'emerald' | 'violet' | 'amber' | 'crimson' | 'teal')
         */
        setPalette: function (paletteKey) {
            if (PALETTES[paletteKey]) {
                state.palette = paletteKey;
                applyAllSettings();
                this.triggerFeedback();
            }
        },

        /**
         * Toggle specific visual FX checkboxes
         */
        toggleFX: function (key, value) {
            if (key in state) {
                state[key] = value;
                applyAllSettings();
            }
        },

        /**
         * Reset all settings back to default factory configuration
         */
        resetDefaults: function () {
            state = { ...CONFIG };
            applyAllSettings();
            this.triggerFeedback();
            console.log('🔄 Theme settings reset to factory defaults.');
        },

        /**
         * Subtle visual flash feedback when setting changes
         */
        triggerFeedback: function () {
            const btn = document.getElementById('qa-theme-toggle-btn');
            if (btn) {
                btn.classList.add('animate-ping');
                setTimeout(() => btn.classList.remove('animate-ping'), 300);
            }
        }
    };

    // Initialize automatically when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();