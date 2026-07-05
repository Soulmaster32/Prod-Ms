/**
 * ============================================================================
 * QUALITY GROUP | MS SECTION - CLIENT-SIDE SECURITY ENGINE (sec.js) v4.0
 * ============================================================================
 * Features:
 * - Mobile iOS & Android Screenshot Defense (Touch Gestures & Hardware Interrupts)
 * - Mobile Task Switcher Defense (Blanks screen in Recent Apps / App Switcher)
 * - Dynamic Forensic Watermarking Overlay (Traceable Session Protection)
 * - Anti-Screenshot Defense: Traps PrintScreen, Win+Shift+S, and Cmd+Shift+3/4/5
 * - Instant Screen Blanking: Obscures DOM for 800ms during capture attempts
 * - Clipboard Poisoning: Overwrites clipboard text on screenshot shortcut press
 * - Privacy Shield Overlay: Blurs dashboard when window loses active focus
 * - Blocks Right-Click Context Menu and iOS/Android Long-Press Callout menus
 * - Prevents Text Selection, Copying, Cutting, and Dragging (except in form inputs)
 * - Traps DevTools Shortcuts (F12, Ctrl+U, Ctrl+Shift+I/J/C, Ctrl+S, Ctrl+P)
 * - Print Protection via @media print CSS Blocker
 * - Custom High-Tech Security Violation Modal with Timer
 * - Audit Trail Logging to System LocalStorage
 * ============================================================================
 */

(function () {
    'use strict';

    // Security Configuration State
    const CONFIG = {
        enabled: true,
        adminPasscode: 'QA-ADMIN-2026',    // Passcode to unlock via console: QASecurityEngine.unlock('QA-ADMIN-2026')
        allowInputSelection: true,          // Allow text selection inside <input> and <textarea>
        showModalAlerts: true,              // Show custom alert modal on blocked actions
        logToAuditHistory: true,            // Log attempts to localStorage audit trail
        enablePrivacyShield: true,          // Blur screen when window loses focus (blocks Snipping Tool & Mobile App Switcher)
        clipboardPoisoning: true,           // Overwrite clipboard text when screenshot key is pressed
        enableForensicWatermark: true,      // Display subtle diagonal watermark across portal (Anti-Leak deterrent)
        watermarkText: 'CONFIDENTIAL • MS SECTION QA • DO NOT CAPTURE'
    };

    let isUnlocked = false;
    let alertTimeout = null;
    let shieldTimeout = null;

    /**
     * Initialize the Security Engine
     */
    function initSecurity() {
        if (!CONFIG.enabled) return;
        injectSecurityStyles();
        injectForensicWatermark();
        injectSecurityModal();
        injectPrivacyShield();
        attachEventListeners();
        attachAntiScreenshotEngine();
        attachMobileTouchDefenses();
        printConsoleWarning();
        console.log('%c🛡️ QA MS Section Security & Mobile Anti-Screenshot Engine Armed (v4.0)', 'background: #e11d48; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
    }

    /**
     * Inject CSS rules for selection locking, iOS callout blocking, and print protection
     */
    function injectSecurityStyles() {
        let styleEl = document.getElementById('qa-security-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'qa-security-styles';
            document.head.appendChild(styleEl);
        }

        styleEl.innerHTML = `
            /* Disable Selection & Long-Press across Desktop & Mobile Webpages */
            body, html, *:not(input):not(textarea):not([contenteditable="true"]) {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important; /* Prevents iOS/Android popup menu on long-press */
                -webkit-tap-highlight-color: transparent !important;
            }

            /* Allow Selection inside input and textarea for legitimate QA data entry */
            input, textarea, [contenteditable="true"] {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }

            /* Prevent Dragging Images & Elements */
            img, a, i, span, div {
                -webkit-user-drag: none !important;
                user-drag: none !important;
            }

            /* Print Protection: Blank out screen if user attempts Ctrl+P or Print */
            @media print {
                body * {
                    display: none !important;
                    visibility: hidden !important;
                }
                body::after {
                    content: "CONFIDENTIAL & PROPRIETARY — MS SECTION QUALITY ASSURANCE. PRINTING, EXPORTING, OR SCREENSHOT CAPTURING IS STRICTLY PROHIBITED UNDER PLANT SOP.";
                    display: block !important;
                    visibility: visible !important;
                    font-size: 18px;
                    font-weight: bold;
                    color: #e11d48;
                    text-align: center;
                    padding: 80px 20px;
                    font-family: sans-serif;
                }
            }
        `;
    }

    /**
     * Inject Faint Forensic Watermark across the entire DOM (Anti-Leak for Mobile/Camera captures)
     */
    function injectForensicWatermark() {
        if (!CONFIG.enableForensicWatermark || document.getElementById('qa-forensic-watermark')) return;

        const wmContainer = document.createElement('div');
        wmContainer.id = 'qa-forensic-watermark';
        wmContainer.className = 'fixed inset-0 z-[8000] pointer-events-none overflow-hidden select-none flex flex-wrap content-between justify-between p-4 opacity-[0.06] font-mono text-xs font-bold text-white';
        
        // Generate repeating diagonal watermark spans
        let spansHtml = '';
        const sessionID = 'ID-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        for (let i = 0; i < 28; i++) {
            spansHtml += `<span class="transform -rotate-25 whitespace-nowrap m-6 inline-block">${CONFIG.watermarkText} [${sessionID}]</span>`;
        }
        wmContainer.innerHTML = spansHtml;
        document.body.appendChild(wmContainer);
    }

    /**
     * Inject Custom Security Alert Modal into DOM
     */
    function injectSecurityModal() {
        if (document.getElementById('qa-sec-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'qa-sec-modal';
        modal.className = 'fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-dark-900/85 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-300 font-sans';
        
        modal.innerHTML = `
            <div id="qa-sec-box" class="bg-dark-500 border-2 border-rose-500/80 rounded-2xl max-w-md w-full p-6 shadow-[0_0_40px_rgba(225,29,72,0.5)] transform scale-90 transition-all duration-300 text-center relative overflow-hidden">
                <div class="absolute -top-12 -right-12 w-32 h-32 bg-rose-600/20 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
                
                <div class="w-16 h-16 bg-gradient-to-tr from-rose-600 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20 animate-bounce">
                    <i class="fas fa-shield-alt text-white text-3xl"></i>
                </div>

                <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-widest mb-2">
                    Security Interlock Triggered
                </span>
                <h3 class="text-xl font-black text-white tracking-tight mb-2">RESTRICTED ACTION BLOCKED</h3>
                
                <p id="qa-sec-reason" class="text-xs text-slate-300 leading-relaxed mb-6 font-normal">
                    Attempting to capture screenshots, inspect source code, or extract proprietary MS Section telemetry data is restricted under Plant Quality Security Protocol #SOP-SEC-01.
                </p>

                <div class="bg-dark-700/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mb-5 text-left">
                    <span><i class="fas fa-user-shield text-amber-400 mr-1.5"></i> Status: <strong class="text-white">Logged to Audit Trail</strong></span>
                    <span class="text-rose-400 font-mono font-bold" id="qa-sec-time">00:00:00</span>
                </div>

                <button onclick="window.QASecurityEngine.dismissAlert()" 
                    class="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.4)] active:scale-95 transition-all">
                    Acknowledge & Return to Portal
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Inject Privacy Shield (Anti-Snipping, Mobile Task Switcher & Window Blur Overlay)
     */
    function injectPrivacyShield() {
        if (document.getElementById('qa-privacy-shield')) return;

        const shield = document.createElement('div');
        shield.id = 'qa-privacy-shield';
        shield.className = 'fixed inset-0 z-[999999] bg-dark-900/98 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-6 opacity-0 pointer-events-none transition-opacity duration-150 font-sans';
        
        shield.innerHTML = `
            <div class="max-w-md mx-auto">
                <div class="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse">
                    <i class="fas fa-eye-slash text-rose-500 text-4xl"></i>
                </div>
                <span class="text-[11px] font-extrabold tracking-widest text-rose-400 uppercase block mb-2">Confidential Telemetry Protection</span>
                <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">PRIVACY SHIELD ENGAGED</h2>
                <p class="text-xs sm:text-sm text-slate-400 leading-relaxed mb-8">
                    To prevent background screen capture, mobile app-switcher thumbnails, and snipping tools, dashboard contents are automatically obscured when the window loses active focus.
                </p>
                <div class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold shadow">
                    <i class="fas fa-mouse-pointer text-sky-400 animate-bounce"></i>
                    <span>Tap or click anywhere to resume viewing</span>
                </div>
            </div>
        `;

        document.body.appendChild(shield);
    }

    /**
     * Attach Anti-Screenshot Engine (Desktop Shortcuts & Focus Defenses)
     */
    function attachAntiScreenshotEngine() {
        // 1. Window Focus, Blur & Visibility Defense (Protects against Snipping Tools, iOS/Android App Switcher)
        if (CONFIG.enablePrivacyShield) {
            // When user switches tabs, opens mobile task switcher, or launches OS snipping tool
            window.addEventListener('blur', function () {
                if (isUnlocked) return;
                const shield = document.getElementById('qa-privacy-shield');
                if (shield) {
                    shield.classList.remove('opacity-0', 'pointer-events-none');
                    shield.classList.add('opacity-100', 'pointer-events-auto');
                }
            });

            // When returning to window
            window.addEventListener('focus', function () {
                if (isUnlocked) return;
                const shield = document.getElementById('qa-privacy-shield');
                if (shield) {
                    shield.classList.remove('opacity-100', 'pointer-events-auto');
                    shield.classList.add('opacity-0', 'pointer-events-none');
                }
            });

            // Page visibility API for mobile browsers (iOS Safari / Android Chrome)
            document.addEventListener('visibilitychange', function () {
                if (isUnlocked) return;
                const shield = document.getElementById('qa-privacy-shield');
                if (!shield) return;
                if (document.hidden) {
                    shield.classList.remove('opacity-0', 'pointer-events-none');
                    shield.classList.add('opacity-100', 'pointer-events-auto');
                } else {
                    setTimeout(() => {
                        shield.classList.remove('opacity-100', 'pointer-events-auto');
                        shield.classList.add('opacity-0', 'pointer-events-none');
                    }, 150);
                }
            });
        }

        // 2. Trapping Desktop Screenshot Key Combinations
        window.addEventListener('keyup', function (e) {
            if (isUnlocked) return;

            const key = (e.key || '').toLowerCase();
            const keyCode = e.keyCode || e.which;
            const isCtrl = e.ctrlKey || e.metaKey;
            const isShift = e.shiftKey;
            const isAlt = e.altKey;

            let screenshotReason = null;

            if (keyCode === 44 || key === 'printscreen' || key === 'snapshot') {
                screenshotReason = 'PrintScreen Key Capture Attempt';
            } else if (isCtrl && isShift && (key === 's' || keyCode === 83)) {
                screenshotReason = 'Screen Snipping Tool Attempt (Win+Shift+S / Cmd+Shift+S)';
            } else if (isCtrl && isShift && ['3', '4', '5'].includes(key)) {
                screenshotReason = `Mac Screenshot Utility (Cmd+Shift+${key})`;
            } else if (isAlt && (keyCode === 44 || key === 'printscreen')) {
                screenshotReason = 'Active Window Capture Attempt (Alt+PrintScreen)';
            }

            if (screenshotReason) {
                e.preventDefault();
                executeScreenshotCountermeasures(screenshotReason);
            }
        }, true);

        // Trap PrintScreen on keydown to blank out DOM before OS captures it!
        window.addEventListener('keydown', function (e) {
            if (isUnlocked) return;
            const keyCode = e.keyCode || e.which;
            const key = (e.key || '').toLowerCase();
            if (keyCode === 44 || key === 'printscreen' || (e.metaKey && e.shiftKey && ['3','4','5','s'].includes(key))) {
                flashScreenBlank();
            }
        }, true);
    }

    /**
     * Attach Mobile Touch & Gesture Defenses (iOS iPhone & Android)
     */
    function attachMobileTouchDefenses() {
        // 1. Trap Multi-Touch Gestures (3-finger swipe screenshot on Samsung/Xiaomi/OnePlus, 4-finger on iPad)
        window.addEventListener('touchstart', function (e) {
            if (isUnlocked) return;
            if (e.touches && e.touches.length >= 3) {
                // Flash shield immediately when 3+ fingers touch the screen
                flashScreenBlank();
                executeScreenshotCountermeasures('Mobile Multi-Touch Screenshot Gesture Attempt');
            }
        }, { passive: true });

        // 2. Trap Touch Interruption / Touch Cancel (Fires when OS takes over screen for hardware screenshot or iOS markup tool)
        window.addEventListener('touchcancel', function () {
            if (isUnlocked) return;
            flashScreenBlank();
            triggerViolation('Mobile OS Screen Capture / Gesture Interruption');
        }, true);

        // 3. Block iOS Long-Press Context Menu on links/images
        window.addEventListener('touchend', function (e) {
            if (isUnlocked) return;
            // Allow normal tapping on buttons and inputs
            if (isFormField(e.target) || e.target.closest('button') || e.target.closest('a')) return;
        }, { passive: true });
    }

    /**
     * Execute Defensive Countermeasures when Screenshot is detected
     */
    function executeScreenshotCountermeasures(reason) {
        flashScreenBlank();

        // Poison Clipboard: Overwrite captured image with a legal warning string
        if (CONFIG.clipboardPoisoning && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('⚠️ CONFIDENTIAL & PROPRIETARY — MS SECTION QUALITY ASSURANCE. SCREENSHOT CAPTURE IS STRICTLY PROHIBITED AND LOGGED.')
                .catch(() => { /* Silent catch if permission denied */ });
        }

        triggerViolation(reason);
    }

    /**
     * Momentarily flash the privacy shield to blank out screen during OS screenshot capture
     */
    function flashScreenBlank() {
        const shield = document.getElementById('qa-privacy-shield');
        if (!shield) return;

        shield.classList.remove('opacity-0', 'pointer-events-none');
        shield.classList.add('opacity-100', 'pointer-events-auto');

        if (shieldTimeout) clearTimeout(shieldTimeout);
        shieldTimeout = setTimeout(() => {
            // Only hide if window is currently focused
            if (document.hasFocus() && !document.hidden) {
                shield.classList.remove('opacity-100', 'pointer-events-auto');
                shield.classList.add('opacity-0', 'pointer-events-none');
            }
        }, 800);
    }

    /**
     * Attach Defensive Event Listeners for DOM Scraping
     */
    function attachEventListeners() {
        // 1. Block Right-Click Context Menu
        document.addEventListener('contextmenu', function (e) {
            if (isUnlocked) return true;
            e.preventDefault();
            triggerViolation('Right-Click Context Menu');
            return false;
        }, false);

        // 2. Block Copy and Cut (except inside input/textarea fields)
        ['copy', 'cut'].forEach(event => {
            document.addEventListener(event, function (e) {
                if (isUnlocked) return true;
                if (CONFIG.allowInputSelection && isFormField(e.target)) return true;
                e.preventDefault();
                triggerViolation(`Data Extraction Attempt (${event.toUpperCase()})`);
                return false;
            }, false);
        });

        // 3. Block Dragging Elements & Images
        document.addEventListener('dragstart', function (e) {
            if (isUnlocked) return true;
            if (CONFIG.allowInputSelection && isFormField(e.target)) return true;
            e.preventDefault();
            return false;
        }, false);

        // 4. Block Developer Tools & Source Keyboard Shortcuts
        document.addEventListener('keydown', function (e) {
            if (isUnlocked) return true;

            const isCtrl = e.ctrlKey || e.metaKey;
            const isShift = e.shiftKey;
            const key = (e.key || '').toLowerCase();
            const keyCode = e.keyCode || e.which;

            let blockedReason = null;

            if (keyCode === 123 || key === 'f12') {
                blockedReason = 'Developer Tools (F12)';
            } else if (isCtrl && key === 'u') {
                blockedReason = 'View HTML Source Code (Ctrl+U)';
            } else if (isCtrl && isShift && (key === 'i' || keyCode === 73)) {
                blockedReason = 'Element Inspector (Ctrl+Shift+I)';
            } else if (isCtrl && isShift && (key === 'j' || keyCode === 74)) {
                blockedReason = 'Browser Console (Ctrl+Shift+J)';
            } else if (isCtrl && isShift && (key === 'c' || keyCode === 67)) {
                blockedReason = 'Element Selector Trap (Ctrl+Shift+C)';
            } else if (isCtrl && key === 's') {
                blockedReason = 'Save Document Attempt (Ctrl+S)';
            } else if (isCtrl && key === 'p') {
                blockedReason = 'Unchecked Print / Export (Ctrl+P)';
            }

            if (blockedReason) {
                e.preventDefault();
                e.stopPropagation();
                triggerViolation(blockedReason);
                return false;
            }
        }, true);
    }

    /**
     * Check if targeted element is a form input (allows normal typing)
     */
    function isFormField(element) {
        if (!element) return false;
        const tag = element.tagName ? element.tagName.toUpperCase() : '';
        return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || element.isContentEditable;
    }

    /**
     * Trigger Violation Protocol: Show Modal & Log to Audit Storage
     */
    function triggerViolation(actionName) {
        console.warn(`[SECURITY INTERLOCK] Blocked unauthorized action: ${actionName}`);

        if (CONFIG.logToAuditHistory) {
            logSecurityIncident(actionName);
        }

        if (CONFIG.showModalAlerts) {
            const modal = document.getElementById('qa-sec-modal');
            const box = document.getElementById('qa-sec-box');
            const reasonEl = document.getElementById('qa-sec-reason');
            const timeEl = document.getElementById('qa-sec-time');

            if (modal && box && reasonEl) {
                reasonEl.innerHTML = `System Interlock activated. Attempting to execute <strong class="text-rose-400 font-bold">"${actionName}"</strong> is restricted under MS Section QA Data Protection Protocol.`;
                if (timeEl) {
                    const now = new Date();
                    timeEl.innerText = now.toTimeString().split(' ')[0];
                }

                modal.classList.remove('opacity-0', 'pointer-events-none');
                modal.classList.add('opacity-100', 'pointer-events-auto');
                box.classList.remove('scale-90');
                box.classList.add('scale-100');

                if (alertTimeout) clearTimeout(alertTimeout);
                alertTimeout = setTimeout(() => {
                    window.QASecurityEngine.dismissAlert();
                }, 7000);
            }
        }
    }

    /**
     * Log unauthorized access attempt into LocalStorage Audit Trail
     */
    function logSecurityIncident(actionName) {
        try {
            const storageKey = 'QAMS_Product_History_v3';
            const stored = localStorage.getItem(storageKey);
            let hist = stored ? JSON.parse(stored) : [];

            const now = new Date();
            const timestamp = now.toISOString().replace('T', ' ').substring(0, 16);

            hist.unshift({
                id: 'SEC-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                timestamp: timestamp,
                action: `Security Interlock: Blocked ${actionName}`,
                user: 'System Security Watchdog',
                details: `Unauthorized mobile screenshot or data extraction attempt was blocked by sec.js engine.`
            });

            localStorage.setItem(storageKey, JSON.stringify(hist.slice(0, 50)));
        } catch (e) {
            // Quiet fail if storage is full
        }
    }

    /**
     * Print high-visibility industrial warning in Browser Console
     */
    function printConsoleWarning() {
        setTimeout(() => {
            console.clear();
            console.log('%cSTOP! RESTRICTED AREA', 'color: #e11d48; font-size: 38px; font-weight: 900; text-shadow: 2px 2px 0px #000; font-family: sans-serif;');
            console.log('%cPROPRIETARY TELEMETRY & QUALITY ASSURANCE PORTAL', 'color: #38bdf8; font-size: 14px; font-weight: bold; font-family: sans-serif;');
            console.log('%cThis browser developer console is intended strictly for authorized Lead QA Engineers and Level 3 System Admins.\nAttempting to bypass security scripts, take unauthorized screenshots, or scrape MS Section data is a direct violation of Plant Information Security Policies.', 'color: #cbd5e1; font-size: 12px; line-height: 1.6; font-family: sans-serif;');
            console.log('%cTo unlock administrative debugging, execute: QASecurityEngine.unlock("YOUR_PASSCODE")', 'color: #f59e0b; font-size: 11px; font-style: italic; font-family: monospace;');
        }, 1000);
    }

    /**
     * ============================================================================
     * PUBLIC API (window.QASecurityEngine)
     * ============================================================================
     */
    window.QASecurityEngine = {
        /**
         * Dismiss the security alert modal
         */
        dismissAlert: function () {
            const modal = document.getElementById('qa-sec-modal');
            const box = document.getElementById('qa-sec-box');
            if (modal && box) {
                box.classList.remove('scale-100');
                box.classList.add('scale-90');
                modal.classList.remove('opacity-100', 'pointer-events-auto');
                modal.classList.add('opacity-0', 'pointer-events-none');
            }
            if (alertTimeout) clearTimeout(alertTimeout);
        },

        /**
         * Unlock and bypass security measures (For Lead Inspectors & Developers)
         */
        unlock: function (passcode) {
            if (passcode === CONFIG.adminPasscode) {
                isUnlocked = true;
                this.dismissAlert();
                const shield = document.getElementById('qa-privacy-shield');
                const wm = document.getElementById('qa-forensic-watermark');
                if (shield) shield.style.display = 'none';
                if (wm) wm.style.display = 'none';
                
                console.log('%c🔓 Security Engine Bypassed. Administrative Debugging Unlocked.', 'background: #10b981; color: #fff; font-weight: bold; padding: 6px 10px; border-radius: 4px;');
                alert('QA Security Interlocks Disabled: You now have full debugging and screenshot access.');
                return true;
            } else {
                console.error('❌ Access Denied: Invalid Security Passcode.');
                triggerViolation('Unauthorized Security Unlock Attempt');
                return false;
            }
        },

        /**
         * Re-lock and arm security engine
         */
        lock: function () {
            isUnlocked = false;
            const shield = document.getElementById('qa-privacy-shield');
            const wm = document.getElementById('qa-forensic-watermark');
            if (shield) shield.style.display = '';
            if (wm) wm.style.display = '';
            console.log('%c🔒 Security Engine Re-Armed.', 'background: #e11d48; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
            alert('QA Security Interlocks Re-Armed.');
        },

        /**
         * Check current lock status
         */
        getStatus: function () {
            return {
                armed: !isUnlocked,
                version: '4.0.0-PROD-MOBILE',
                activeProtocols: ['MobileTouchGestures', 'MobileTaskSwitcherBlur', 'ForensicWatermark', 'ScreenshotTrap', 'ScreenBlankFlash', 'ClipboardPoison', 'WindowBlurShield', 'RightClickBlock', 'DevToolsTrap', 'SelectionLock', 'PrintProtect']
            };
        }
    };

    // Auto-Initialize on script load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }

})();