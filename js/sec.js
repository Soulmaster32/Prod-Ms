/**
 * ============================================================================
 * QA MS Section Security & Mobile Anti-Screenshot Engine (v5.0 - PROD)
 * ============================================================================
 * Proprietary Data Protection, Anti-Scraping, and Telemetry Shield
 */
(function () {
    'use strict';

    // Security Configuration State
    const CONFIG = {
        enabled: true,
        adminPasscode: 'QA-ADMIN-2026',    // Passcode for UI Modal Prompt or console unlock
        allowInputSelection: true,          // Allow text selection inside <input> and <textarea>
        showModalAlerts: true,              // Show custom alert modal on blocked actions
        logToAuditHistory: true,            // Log attempts to localStorage audit trail
        enablePrivacyShield: true,          // Blur screen when window loses focus (blocks Snipping Tool & Mobile App Switcher)
        clipboardPoisoning: true,           // Overwrite clipboard text when screenshot key is pressed
        enableForensicWatermark: true,      // Display subtle diagonal watermark across portal (Anti-Leak deterrent)
        watermarkText: 'Production / MS Section',
        unlockShortcut: { ctrl: true, alt: true, key: 'u' } // Ctrl + Alt + U opens Unlock Modal Prompt
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
        injectUnlockModalPrompt();
        injectPrivacyShield();
        attachEventListeners();
        attachAntiScreenshotEngine();
        attachMobileTouchDefenses();
        printConsoleWarning();
        console.log('%c🛡️ QA MS Section Security Engine Armed (v5.0 - Modal Prompt Enabled)', 'background: #e11d48; color: #fff; font-weight: bold; padding: 6px 10px; border-radius: 4px;');
    }

    /**
     * Inject self-contained CSS rules for selection locking, iOS callouts, modals, and print protection
     */
    function injectSecurityStyles() {
        if (document.getElementById('qa-security-styles')) return;

        const styleEl = document.createElement('style');
        styleEl.id = 'qa-security-styles';
        styleEl.innerHTML = `
            /* Disable Selection & Long-Press across Desktop & Mobile Webpages */
            body, html, *:not(input):not(textarea):not([contenteditable="true"]) {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
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
                    content: "⚠️ CONFIDENTIAL & PROPRIETARY — MS SECTION QUALITY ASSURANCE.\\nPRINTING, EXPORTING, OR SCREENSHOT CAPTURING IS STRICTLY PROHIBITED UNDER PLANT SOP.";
                    display: block !important;
                    visibility: visible !important;
                    font-size: 18px;
                    font-weight: bold;
                    color: #e11d48;
                    text-align: center;
                    padding: 100px 20px;
                    font-family: system-ui, -apple-system, sans-serif;
                    white-space: pre-wrap;
                }
            }

            /* Self-Contained Modal & Shield Animations (Fallback if Tailwind is missing) */
            @keyframes qaPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.85; transform: scale(1.03); }
            }
            .qa-animate-pulse-fast { animation: qaPulse 1.5s infinite ease-in-out; }
            
            /* Glassmorphism & High-Contrast Dark UI */
            .qa-modal-backdrop {
                background-color: rgba(9, 9, 11, 0.88);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
            }
            .qa-modal-card {
                background: linear-gradient(145deg, #18181b, #09090b);
                box-shadow: 0 0 50px rgba(225, 29, 72, 0.35), 0 10px 30px rgba(0,0,0,0.8);
            }
            .qa-unlock-card {
                background: linear-gradient(145deg, #18181b, #09090b);
                box-shadow: 0 0 50px rgba(245, 158, 11, 0.25), 0 10px 30px rgba(0,0,0,0.8);
            }
        `;
        document.head.appendChild(styleEl);
    }

    /**
     * Inject Faint Forensic Watermark across the entire DOM (Anti-Leak for Mobile/Camera captures)
     */
    function injectForensicWatermark() {
        if (!CONFIG.enableForensicWatermark || document.getElementById('qa-forensic-watermark')) return;

        const wmContainer = document.createElement('div');
        wmContainer.id = 'qa-forensic-watermark';
        wmContainer.style.cssText = 'position: fixed; inset: 0; z-index: 8000; pointer-events: none; overflow: hidden; user-select: none; display: flex; flex-wrap: wrap; align-content: space-between; justify-content: space-between; padding: 16px; opacity: 0.05; font-family: monospace; font-size: 12px; font-weight: bold; color: #ffffff;';
        
        let spansHtml = '';
        const sessionID = 'ID-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        for (let i = 0; i < 30; i++) {
            spansHtml += `<span style="transform: rotate(-25deg); white-space: nowrap; margin: 24px; display: inline-block;">${CONFIG.watermarkText} [${sessionID}]</span>`;
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
        modal.className = 'qa-modal-backdrop';
        modal.style.cssText = 'position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 16px; opacity: 0; pointer-events: none; transition: all 0.3s ease; font-family: system-ui, -apple-system, sans-serif;';
        
        modal.innerHTML = `
            <div id="qa-sec-box" class="qa-modal-card" style="border: 2px solid rgba(225, 29, 72, 0.8); border-radius: 18px; max-width: 440px; width: 100%; padding: 24px; transform: scale(0.9); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); text-align: center; position: relative; overflow: hidden; color: #fff;">
                
                <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #e11d48, #f59e0b); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 8px 20px rgba(225,29,72,0.4); border: 1px solid rgba(255,255,255,0.2);">
                    <svg style="width: 32px; height: 32px; color: #fff;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                </div>

                <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-weight: 800; background: rgba(225, 29, 72, 0.2); color: #fb7185; border: 1px solid rgba(225, 29, 72, 0.3); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                    Security Interlock Triggered
                </span>
                <h3 style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px; margin: 0 0 8px 0; color: #ffffff;">RESTRICTED ACTION BLOCKED</h3>
                
                <p id="qa-sec-reason" style="font-size: 13px; color: #cbd5e1; line-height: 1.5; margin: 0 0 20px 0; font-weight: 400;">
                    Attempting to capture screenshots, inspect source code, or extract proprietary MS Section telemetry data is restricted under Plant Quality Security Protocol #SOP-SEC-01.
                </p>

                <div style="background: rgba(39, 39, 42, 0.8); padding: 12px 14px; border-radius: 12px; border: 1px solid #3f3f46; font-size: 11px; color: #a1a1aa; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; text-align: left;">
                    <span><strong style="color: #f59e0b;">● Audit Trail:</strong> Logged & Monitored</span>
                    <span style="color: #fb7185; font-family: monospace; font-weight: bold; font-size: 12px;" id="qa-sec-time">00:00:00</span>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button onclick="window.QASecurityEngine.dismissAlert()" style="flex: 1; padding: 12px; background: linear-gradient(90deg, #e11d48, #be123c); color: #ffffff; font-weight: bold; font-size: 13px; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(225,29,72,0.4); transition: opacity 0.2s;">
                        Acknowledge & Return
                    </button>
                    <button onclick="window.QASecurityEngine.showUnlockPrompt()" title="Admin Unlock Prompt (Ctrl+Alt+U)" style="padding: 12px 16px; background: #27272a; color: #f59e0b; font-weight: bold; font-size: 13px; border-radius: 12px; border: 1px solid #3f3f46; cursor: pointer; transition: background 0.2s;">
                        🔑 Admin
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    /**
     * Inject Admin Unlock Modal Prompt into DOM (Replaces console commands and browser prompts)
     */
    function injectUnlockModalPrompt() {
        if (document.getElementById('qa-unlock-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'qa-unlock-modal';
        modal.className = 'qa-modal-backdrop';
        modal.style.cssText = 'position: fixed; inset: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 16px; opacity: 0; pointer-events: none; transition: all 0.25s ease; font-family: system-ui, -apple-system, sans-serif;';
        
        modal.innerHTML = `
            <div id="qa-unlock-box" class="qa-unlock-card" style="border: 2px solid rgba(245, 158, 11, 0.8); border-radius: 18px; max-width: 400px; width: 100%; padding: 24px; transform: scale(0.9); transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); text-align: center; color: #fff;">
                
                <div style="width: 54px; height: 54px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: #f59e0b;">
                    <svg style="width: 28px; height: 28px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
                </div>

                <h3 style="font-size: 18px; font-weight: 900; margin: 0 0 6px 0; color: #ffffff;">ADMINISTRATIVE UNLOCK</h3>
                <p style="font-size: 12px; color: #a1a1aa; margin: 0 0 16px 0;">Enter Level-3 Admin Passcode to bypass security interlocks and enable screenshot/debugging permissions.</p>

                <div style="margin-bottom: 18px; text-align: left;">
                    <input type="password" id="qa-admin-passcode-input" placeholder="Enter security passcode..." 
                        style="width: 100%; box-sizing: border-box; padding: 12px 14px; background: #09090b; border: 1px solid #3f3f46; border-radius: 10px; color: #fff; font-size: 14px; font-family: monospace; outline: none; transition: border 0.2s;"
                        onfocus="this.style.borderColor='#f59e0b'" onblur="this.style.borderColor='#3f3f46'">
                    <span id="qa-unlock-error" style="display: none; color: #fb7185; font-size: 11px; margin-top: 6px; font-weight: 600;">❌ Incorrect Admin Passcode. Access Denied.</span>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button onclick="window.QASecurityEngine.hideUnlockPrompt()" style="flex: 1; padding: 11px; background: #27272a; color: #cbd5e1; font-weight: 600; font-size: 13px; border-radius: 10px; border: none; cursor: pointer;">
                        Cancel
                    </button>
                    <button onclick="window.QASecurityEngine.submitUnlock()" style="flex: 1.2; padding: 11px; background: linear-gradient(90deg, #d97706, #b45309); color: #ffffff; font-weight: bold; font-size: 13px; border-radius: 10px; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(245,158,11,0.3);">
                        Unlock Engine
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Bind Enter key on password input
        setTimeout(() => {
            const inputEl = document.getElementById('qa-admin-passcode-input');
            if (inputEl) {
                inputEl.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') window.QASecurityEngine.submitUnlock();
                    if (e.key === 'Escape') window.QASecurityEngine.hideUnlockPrompt();
                });
            }
        }, 100);
    }

    /**
     * Inject Privacy Shield (Anti-Snipping, Mobile Task Switcher & Window Blur Overlay)
     */
    function injectPrivacyShield() {
        if (document.getElementById('qa-privacy-shield')) return;

        const shield = document.createElement('div');
        shield.id = 'qa-privacy-shield';
        shield.className = 'qa-modal-backdrop';
        shield.style.cssText = 'position: fixed; inset: 0; z-index: 999998; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px; opacity: 0; pointer-events: none; transition: opacity 0.15s ease; font-family: system-ui, -apple-system, sans-serif; color: #fff;';
        
        shield.innerHTML = `
            <div style="max-width: 420px; margin: 0 auto;">
                <div class="qa-animate-pulse-fast" style="width: 76px; height: 76px; background: rgba(225, 29, 72, 0.15); border: 1px solid rgba(225, 29, 72, 0.4); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 30px rgba(244,63,94,0.3);">
                    <svg style="width: 38px; height: 38px; color: #f43f5e;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                </div>
                <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #fb7185; text-transform: uppercase; display: block; margin-bottom: 8px;">Confidential Telemetry Protection</span>
                <h2 style="font-size: 26px; font-weight: 900; margin: 0 0 12px 0; color: #ffffff;">PRIVACY SHIELD ENGAGED</h2>
                <p style="font-size: 13px; color: #a1a1aa; line-height: 1.6; margin: 0 0 24px 0;">
                    To prevent background screen capture, mobile app-switcher thumbnails, and snipping tools, dashboard contents are automatically obscured when the window loses active focus.
                </p>
                <div style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 12px; background: #27272a; border: 1px solid #3f3f46; color: #e2e8f0; font-size: 12px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                    <span style="color: #38bdf8;">●</span> Tap or click anywhere to resume viewing
                </div>
            </div>
        `;
        document.body.appendChild(shield);
    }

    /**
     * Attach Anti-Screenshot Engine (Desktop Shortcuts & Focus Defenses)
     */
    function attachAntiScreenshotEngine() {
        if (CONFIG.enablePrivacyShield) {
            window.addEventListener('blur', function () {
                if (isUnlocked) return;
                const shield = document.getElementById('qa-privacy-shield');
                if (shield) {
                    shield.style.opacity = '1';
                    shield.style.pointerEvents = 'auto';
                }
            });

            window.addEventListener('focus', function () {
                if (isUnlocked) return;
                const shield = document.getElementById('qa-privacy-shield');
                if (shield) {
                    shield.style.opacity = '0';
                    shield.style.pointerEvents = 'none';
                }
            });

            document.addEventListener('visibilitychange', function () {
                if (isUnlocked) return;
                const shield = document.getElementById('qa-privacy-shield');
                if (!shield) return;
                if (document.hidden) {
                    shield.style.opacity = '1';
                    shield.style.pointerEvents = 'auto';
                } else {
                    setTimeout(() => {
                        shield.style.opacity = '0';
                        shield.style.pointerEvents = 'none';
                    }, 150);
                }
            });
        }

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
        // Trap Multi-Touch Gestures (3-finger swipe screenshot on Xiaomi/Samsung/OnePlus, 4-finger on iPad)
        window.addEventListener('touchstart', function (e) {
            if (isUnlocked) return;
            if (e.touches && e.touches.length >= 3) {
                flashScreenBlank();
                executeScreenshotCountermeasures('Mobile Multi-Touch Screenshot Gesture Attempt');
            }
        }, { passive: true });

        // Trap Touch Interruption (Fires when OS takes over screen for hardware screenshot or iOS markup tool)
        window.addEventListener('touchcancel', function () {
            if (isUnlocked) return;
            flashScreenBlank();
            triggerViolation('Mobile OS Screen Capture / Gesture Interruption');
        }, true);

        // Block iOS Long-Press Context Menu on links/images
        window.addEventListener('touchend', function (e) {
            if (isUnlocked) return;
            if (isFormField(e.target) || e.target.closest('button') || e.target.closest('a')) return;
        }, { passive: true });
    }

    /**
     * Execute Defensive Countermeasures when Screenshot is detected
     */
    function executeScreenshotCountermeasures(reason) {
        flashScreenBlank();

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

        shield.style.opacity = '1';
        shield.style.pointerEvents = 'auto';

        if (shieldTimeout) clearTimeout(shieldTimeout);
        shieldTimeout = setTimeout(() => {
            if (document.hasFocus() && !document.hidden) {
                shield.style.opacity = '0';
                shield.style.pointerEvents = 'none';
            }
        }, 800);
    }

    /**
     * Attach Defensive Event Listeners for DOM Scraping & Admin Shortcut
     */
    function attachEventListeners() {
        // 1. Block Right-Click Context Menu
        document.addEventListener('contextmenu', function (e) {
            if (isUnlocked) return true;
            e.preventDefault();
            triggerViolation('Right-Click Context Menu');
            return false;
        }, false);

        // 2. Block Copy and Cut
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

        // 4. Keyboard Traps & Secret Admin Shortcut
        document.addEventListener('keydown', function (e) {
            const isCtrl = e.ctrlKey || e.metaKey;
            const isShift = e.shiftKey;
            const isAlt = e.altKey;
            const key = (e.key || '').toLowerCase();
            const keyCode = e.keyCode || e.which;

            // Check for Admin Unlock Shortcut (Ctrl + Alt + U)
            if (isCtrl && isAlt && key === CONFIG.unlockShortcut.key) {
                e.preventDefault();
                window.QASecurityEngine.showUnlockPrompt();
                return false;
            }

            if (isUnlocked) return true;

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
                reasonEl.innerHTML = `System Interlock activated. Attempting to execute <strong style="color: #fb7185;">"${actionName}"</strong> is restricted under MS Section QA Data Protection Protocol.`;
                if (timeEl) {
                    const now = new Date();
                    timeEl.innerText = now.toTimeString().split(' ')[0];
                }

                modal.style.opacity = '1';
                modal.style.pointerEvents = 'auto';
                box.style.transform = 'scale(1)';

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
            console.log('%cTo unlock administrative debugging via keyboard, press: Ctrl + Alt + U\nOr execute command: QASecurityEngine.unlock("YOUR_PASSCODE")', 'color: #f59e0b; font-size: 11px; font-style: italic; font-family: monospace;');
        }, 1000);
    }

    /**
     * ============================================================================
     * PUBLIC API (window.QASecurityEngine)
     * ============================================================================
     */
    window.QASecurityEngine = {
        /**
         * Dismiss the security violation alert modal
         */
        dismissAlert: function () {
            const modal = document.getElementById('qa-sec-modal');
            const box = document.getElementById('qa-sec-box');
            if (modal && box) {
                box.style.transform = 'scale(0.9)';
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
            }
            if (alertTimeout) clearTimeout(alertTimeout);
        },

        /**
         * Display the Admin Unlock Modal Prompt
         */
        showUnlockPrompt: function () {
            this.dismissAlert();
            const modal = document.getElementById('qa-unlock-modal');
            const box = document.getElementById('qa-unlock-box');
            const input = document.getElementById('qa-admin-passcode-input');
            const err = document.getElementById('qa-unlock-error');
            
            if (modal && box) {
                if (err) err.style.display = 'none';
                if (input) input.value = '';
                modal.style.opacity = '1';
                modal.style.pointerEvents = 'auto';
                box.style.transform = 'scale(1)';
                if (input) setTimeout(() => input.focus(), 150);
            }
        },

        /**
         * Hide the Admin Unlock Modal Prompt
         */
        hideUnlockPrompt: function () {
            const modal = document.getElementById('qa-unlock-modal');
            const box = document.getElementById('qa-unlock-box');
            if (modal && box) {
                box.style.transform = 'scale(0.9)';
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
            }
        },

        /**
         * Submit Passcode from UI Modal Prompt
         */
        submitUnlock: function () {
            const input = document.getElementById('qa-admin-passcode-input');
            const err = document.getElementById('qa-unlock-error');
            const passcode = input ? input.value.trim() : '';

            if (this.unlock(passcode)) {
                this.hideUnlockPrompt();
            } else {
                if (err) {
                    err.style.display = 'block';
                    if (input) {
                        input.style.borderColor = '#fb7185';
                        input.value = '';
                        input.focus();
                    }
                }
            }
        },

        /**
         * Unlock and bypass security measures (For Lead Inspectors & Developers)
         */
        unlock: function (passcode) {
            if (passcode === CONFIG.adminPasscode) {
                isUnlocked = true;
                this.dismissAlert();
                this.hideUnlockPrompt();
                const shield = document.getElementById('qa-privacy-shield');
                const wm = document.getElementById('qa-forensic-watermark');
                if (shield) shield.style.display = 'none';
                if (wm) wm.style.display = 'none';
                
                console.log('%c🔓 Security Engine Bypassed. Administrative Debugging Unlocked.', 'background: #10b981; color: #fff; font-weight: bold; padding: 6px 10px; border-radius: 4px;');
                
                // Show subtle success toast instead of browser alert
                this._showStatusToast('🔓 QA Security Interlocks Disabled: Full Admin & Screenshot Access Granted.', '#10b981');
                return true;
            } else {
                console.error('❌ Access Denied: Invalid Security Passcode.');
                if (!document.getElementById('qa-unlock-modal') || document.getElementById('qa-unlock-modal').style.opacity === '0') {
                    triggerViolation('Unauthorized Security Unlock Attempt');
                }
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
            this._showStatusToast('🔒 QA Security Interlocks Re-Armed.', '#e11d48');
        },

        /**
         * Helper: Display subtle toast notifications instead of browser alerts
         */
        _showStatusToast: function (msg, bgColor) {
            let toast = document.getElementById('qa-status-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'qa-status-toast';
                toast.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 9999999; padding: 14px 20px; border-radius: 12px; color: #fff; font-size: 13px; font-weight: bold; font-family: system-ui, -apple-system, sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.7); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); transform: translateY(100px); opacity: 0;';
                document.body.appendChild(toast);
            }
            toast.style.backgroundColor = bgColor;
            toast.innerText = msg;
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';

            setTimeout(() => {
                toast.style.transform = 'translateY(100px)';
                toast.style.opacity = '0';
            }, 4500);
        },

        /**
         * Check current lock status
         */
        getStatus: function () {
            return {
                armed: !isUnlocked,
                version: '5.0.0-PROD-MODAL',
                activeProtocols: ['AdminModalPrompt', 'MobileTouchGestures', 'MobileTaskSwitcherBlur', 'ForensicWatermark', 'ScreenshotTrap', 'ScreenBlankFlash', 'ClipboardPoison', 'WindowBlurShield', 'RightClickBlock', 'DevToolsTrap', 'SelectionLock', 'PrintProtect']
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