/**
 * ============================================================================
 * QUALITY GROUP | MS SECTION - AUTHENTICATION & USER PORTAL ENGINE (login.js)
 * ============================================================================
 * Features:
 * - Fullscreen Gatekeeper Overlay: Restricts dashboard access until logged in
 * - Complete Registration Form: Fullname, Age, Gender, Birthday, Birthdate, Place of Birth, Area Assign
 * - HTML5 Canvas Image Uploader: Compresses profile pictures to Base64 safely
 * - Live DOM Integration: Updates Navbar with User Profile, Avatar, & Logout button
 * - Syncs with user.js & qaUsersList: Auto-adds registered users to the active table
 * - LocalStorage Persistence: Keeps users logged in across page reloads
 * - Pre-seeded Default Accounts for instant testing
 * ============================================================================
 */

(function () {
    'use strict';

    const CONFIG = {
        sessionKey: 'QAMS_Active_Session_v1',
        usersKey: 'QAMS_Registered_Users_v1',
        defaultImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2338bdf8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>'
    };

    // Pre-seed default accounts matching index.html table for instant testing
    const DEFAULT_USERS = [
        {
            username: "QA-MS-001",
            password: "admin",
            fullname: "Engr. Santos, M.",
            age: 34,
            gender: "Male",
            birthday: "1992-05-14",
            birthdate: "May 14, 1992",
            birthplace: "Davao City, Philippines",
            area: "All MS Section Areas",
            role: "Lead QA Inspector",
            image: CONFIG.defaultImage
        },
        {
            username: "admin",
            password: "admin",
            fullname: "Lead System Administrator",
            age: 30,
            gender: "Female",
            birthday: "1996-08-20",
            birthdate: "August 20, 1996",
            birthplace: "Manila, Philippines",
            area: "DCS Control Room",
            role: "System Admin",
            image: CONFIG.defaultImage
        }
    ];

    let currentTempImage = null;

    /**
     * Initialize Auth Engine
     */
    function initAuth() {
        seedDefaultUsers();
        injectAuthPortal();
        checkActiveSession();
        console.log('%c🔐 QA MS Section Auth & Login Engine Initialized', 'background: #2563eb; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
    }

    /**
     * Pre-seed default accounts into localStorage if empty
     */
    function seedDefaultUsers() {
        let users = getRegisteredUsers();
        if (users.length === 0) {
            localStorage.setItem(CONFIG.usersKey, JSON.stringify(DEFAULT_USERS));
        }
    }

    /**
     * Get all registered users from storage
     */
    function getRegisteredUsers() {
        try {
            const data = localStorage.getItem(CONFIG.usersKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Check if user is currently logged in
     */
    function checkActiveSession() {
        try {
            const sessionData = localStorage.getItem(CONFIG.sessionKey);
            if (sessionData) {
                const user = JSON.parse(sessionData);
                grantDashboardAccess(user);
            } else {
                restrictDashboardAccess();
            }
        } catch (e) {
            restrictDashboardAccess();
        }
    }

    /**
     * Restrict Access: Show Fullscreen Auth Portal & blur dashboard
     */
    function restrictDashboardAccess() {
        const portal = document.getElementById('qa-fullscreen-auth-portal');
        const mainContent = document.querySelector('main');
        const sidebar = document.getElementById('sidebarMenu');

        if (portal) {
            portal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            portal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
        }

        if (mainContent) mainContent.style.filter = 'blur(12px)';
        if (sidebar) sidebar.style.filter = 'blur(12px)';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Grant Access: Hide Portal, unblur dashboard, and update Navbar/Tables
     */
    function grantDashboardAccess(user) {
        const portal = document.getElementById('qa-fullscreen-auth-portal');
        const mainContent = document.querySelector('main');
        const sidebar = document.getElementById('sidebarMenu');

        if (portal) {
            portal.classList.remove('flex', 'opacity-100', 'pointer-events-auto');
            portal.classList.add('hidden', 'opacity-0', 'pointer-events-none');
        }

        if (mainContent) mainContent.style.filter = 'none';
        if (sidebar) sidebar.style.filter = 'none';
        document.body.style.overflow = '';

        // Update Navbar with logged-in user profile
        updateNavbarProfile(user);

        // Auto-sync with index.html / user.js qaUsersList table
        syncWithUserTable(user);
    }

    /**
     * Inject Fullscreen Login & Registration Portal into DOM
     */
    function injectAuthPortal() {
        if (document.getElementById('qa-fullscreen-auth-portal')) return;

        const portal = document.createElement('div');
        portal.id = 'qa-fullscreen-auth-portal';
        portal.className = 'fixed inset-0 z-[100000] bg-dark-900/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto font-sans transition-all duration-300';
        
        portal.innerHTML = `
            <div class="max-w-xl w-full bg-dark-500 border border-slate-700/80 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.3)] overflow-hidden relative my-8">
                <!-- Glowing Orb FX -->
                <div class="absolute -top-24 -left-24 w-64 h-64 bg-royalblue-600/20 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Portal Header -->
                <div class="p-6 sm:p-8 border-b border-slate-800 bg-dark-700/50 text-center relative z-10">
                    <div class="w-14 h-14 bg-gradient-to-tr from-royalblue-600 to-sky-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                        <i class="fas fa-shield-check text-white text-2xl"></i>
                    </div>
                    <span class="text-[11px] font-extrabold tracking-widest text-sky-400 uppercase block mb-1">Quality Group • MS Section</span>
                    <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">QA PORTAL GATEWAY</h2>
                    <p class="text-xs text-slate-400 mt-1">Please authenticate or register your inspector credentials to access hydrometallurgical telemetry.</p>

                    <!-- Tab Switcher -->
                    <div class="flex items-center justify-center gap-2 mt-6 p-1 bg-dark-900 rounded-xl border border-slate-800 max-w-xs mx-auto">
                        <button onclick="window.QAAuthEngine.switchTab('login')" id="auth-tab-btn-login" 
                            class="flex-1 py-2 rounded-lg text-xs font-bold transition-all bg-royalblue-600 text-white shadow">
                            <i class="fas fa-key mr-1.5"></i> Portal Login
                        </button>
                        <button onclick="window.QAAuthEngine.switchTab('register')" id="auth-tab-btn-register" 
                            class="flex-1 py-2 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white">
                            <i class="fas fa-user-plus mr-1.5"></i> Register New
                        </button>
                    </div>
                </div>

                <!-- TAB 1: LOGIN FORM -->
                <div id="auth-tab-login" class="p-6 sm:p-8 relative z-10 block animate-fadeIn">
                    <form onsubmit="window.QAAuthEngine.handleLogin(event)" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Inspector ID / Username</label>
                            <div class="relative">
                                <i class="fas fa-id-badge absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                                <input type="text" id="login-username" required placeholder="e.g., QA-MS-001 or admin" 
                                    class="w-full bg-dark-700 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 transition-all">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Security Password</label>
                            <div class="relative">
                                <i class="fas fa-lock absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                                <input type="password" id="login-password" required placeholder="Enter password (default: admin)" 
                                    class="w-full bg-dark-700 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 transition-all">
                            </div>
                        </div>

                        <!-- Login Error Msg -->
                        <div id="login-error-msg" class="hidden p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center">
                            <i class="fas fa-exclamation-circle mr-1"></i> Invalid Inspector ID or Password.
                        </div>

                        <button type="submit" 
                            class="w-full py-3.5 bg-gradient-to-r from-royalblue-600 to-sky-500 hover:from-royalblue-500 text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 mt-2">
                            <span>Authenticate & Access Dashboard</span>
                            <i class="fas fa-arrow-right text-xs"></i>
                        </button>
                    </form>
                    <div class="mt-6 pt-6 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
                        Demo Credentials: ID <strong class="text-sky-400 font-mono">QA-MS-001</strong> | Pass <strong class="text-sky-400 font-mono">admin</strong>
                    </div>
                </div>

                <!-- TAB 2: REGISTRATION FORM -->
                <div id="auth-tab-register" class="p-6 sm:p-8 relative z-10 hidden animate-fadeIn max-h-[70vh] overflow-y-auto no-scrollbar">
                    <form onsubmit="window.QAAuthEngine.handleRegister(event)" class="space-y-4">
                        
                        <!-- Profile Image Avatar Uploader -->
                        <div class="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-dark-700/60 border border-slate-800 mb-2">
                            <div id="reg-avatar-preview" class="w-16 h-16 rounded-full bg-slate-800 border-2 border-sky-400/50 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                                <i class="fas fa-user text-2xl text-slate-400"></i>
                            </div>
                            <div class="flex-1 text-center sm:text-left">
                                <label class="block text-xs font-bold text-white mb-1">Profile Photo / Avatar</label>
                                <p class="text-[11px] text-slate-400 mb-2">Upload a clear ID photo (Auto-compressed to Base64).</p>
                                <input type="file" id="reg-image-file" accept="image/*" onchange="window.QAAuthEngine.previewImage(event)" 
                                    class="text-[11px] text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-royalblue-600 file:text-white hover:file:bg-royalblue-500 cursor-pointer w-full">
                            </div>
                        </div>

                        <!-- Row 1: Fullname & Inspector ID -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Full Name *</label>
                                <input type="text" id="reg-fullname" required placeholder="e.g., Engr. Dela Cruz, J." 
                                    class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500">
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Inspector ID / Username *</label>
                                <input type="text" id="reg-username" required placeholder="e.g., QA-MS-010" 
                                    class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500">
                            </div>
                        </div>

                        <!-- Row 2: Age, Gender & Birthday -->
                        <div class="grid grid-cols-3 gap-3">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Age *</label>
                                <input type="number" id="reg-age" required min="18" max="80" placeholder="25" 
                                    class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500">
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Gender *</label>
                                <select id="reg-gender" required class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-sky-500">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-Binary">Non-Binary</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Birthday *</label>
                                <input type="date" id="reg-birthday" required onchange="window.QAAuthEngine.calcAgeFromDate()" 
                                    class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-sky-500">
                            </div>
                        </div>

                        <!-- Row 3: Place of Birth -->
                        <div>
                            <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Place of Birth *</label>
                            <input type="text" id="reg-birthplace" required placeholder="e.g., Davao City, Philippines" 
                                class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500">
                        </div>

                        <!-- Row 4: Area Assigned & Role -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Area Assign (based on index.html) *</label>
                                <select id="reg-area" required class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500">
                                    <option value="All MS Section Areas">All MS Section Areas</option>
                                    <option value="FNTRL Area">FNTRL Area</option>
                                    <option value="MS-Dezinc Area">MS-Dezinc Area</option>
                                    <option value="H2S Area">H2S Area</option>
                                    <option value="Limestone Area">Limestone Area</option>
                                    <option value="DCS Control Room">DCS Control Room</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Assigned QA Role *</label>
                                <select id="reg-role" required class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500">
                                    <option value="Lead QA Inspector">Lead QA Inspector</option>
                                    <option value="Field Technician">Field Technician</option>
                                    <option value="Lab Chemist">Lab Chemist</option>
                                    <option value="System Admin">System Admin</option>
                                </select>
                            </div>
                        </div>

                        <!-- Row 5: Password & Confirm Password -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Security Password *</label>
                                <input type="password" id="reg-password" required placeholder="Create password" minlength="4" 
                                    class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500">
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Confirm Password *</label>
                                <input type="password" id="reg-confirm-password" required placeholder="Confirm password" minlength="4" 
                                    class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500">
                            </div>
                        </div>

                        <!-- Registration Error Msg -->
                        <div id="reg-error-msg" class="hidden p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center"></div>

                        <button type="submit" 
                            class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4">
                            <i class="fas fa-check-circle text-xs"></i>
                            <span>Register Account & Login</span>
                        </button>
                    </form>
                </div>

            </div>
        `;

        document.body.appendChild(portal);
    }

    /**
     * Update Navbar in index.html to show User Profile & Logout Button
     */
    function updateNavbarProfile(user) {
        // Find existing Portal Login button or header right section
        const loginBtn = document.querySelector('header button[onclick*="loginModal"]');
        if (!loginBtn) return;

        const container = loginBtn.parentElement;
        if (!container) return;

        // Create Profile Widget
        const profileWidget = document.createElement('div');
        profileWidget.id = 'qa-navbar-user-profile';
        profileWidget.className = 'flex items-center gap-3 bg-dark-700/80 border border-slate-700 px-3.5 py-1.5 rounded-2xl shadow-inner animate-fadeIn';
        
        // Determine area badge color
        const badgeColor = user.role.includes('Lead') ? 'text-sky-400 bg-sky-500/10 border-sky-500/20' :
                           user.role.includes('Admin') ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                           user.role.includes('Chemist') ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' :
                           'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

        profileWidget.innerHTML = `
            <div class="w-8 h-8 rounded-full overflow-hidden border border-sky-400/50 bg-slate-800 shrink-0 flex items-center justify-center">
                ${user.image ? `<img src="${user.image}" alt="Avatar" class="w-full h-full object-cover">` : `<span class="text-xs font-bold text-sky-400">${user.fullname.slice(0,2).toUpperCase()}</span>`}
            </div>
            <div class="hidden sm:block text-left leading-tight">
                <span class="text-xs font-bold text-white block truncate max-w-[130px]">${user.fullname}</span>
                <span class="text-[10px] font-semibold ${badgeColor} px-1.5 py-0.2 rounded border inline-block mt-0.5">${user.role}</span>
            </div>
            <!-- Logout Button -->
            <button onclick="window.QAAuthEngine.handleLogout()" title="Logout of QA Portal" 
                class="ml-1 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
                <i class="fas fa-sign-out-alt text-xs"></i>
            </button>
        `;

        // Replace login button with profile widget
        loginBtn.replaceWith(profileWidget);

        // Also update existing login modal to act as profile modal if clicked anywhere else
        overrideExistingLoginModal(user);
    }

    /**
     * Override existing index.html loginModal so it doesn't conflict
     */
    function overrideExistingLoginModal(user) {
        const modalContent = document.getElementById('loginContent');
        if (!modalContent) return;

        modalContent.innerHTML = `
            <div class="bg-gradient-to-r from-royalblue-600/20 to-sky-500/10 p-5 border-b border-slate-800 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-royalblue-600 flex items-center justify-center text-white shadow">
                        <i class="fas fa-user-check text-sm"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white">Active Inspector Session</h3>
                        <span class="text-[11px] text-sky-400 font-semibold block">Verified QA Telemetry Clearance</span>
                    </div>
                </div>
                <button type="button" onclick="closeModal('loginModal')" class="text-slate-400 hover:text-white p-1 rounded-lg">
                    <i class="fas fa-times text-base"></i>
                </button>
            </div>
            <div class="p-6 text-center space-y-4">
                <div class="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-sky-400 bg-slate-800 shadow-lg">
                    <img src="${user.image || CONFIG.defaultImage}" alt="Avatar" class="w-full h-full object-cover">
                </div>
                <div>
                    <h4 class="text-lg font-black text-white">${user.fullname}</h4>
                    <span class="text-xs text-sky-400 font-mono block">${user.username} &bull; ${user.role}</span>
                    <span class="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                        <i class="fas fa-map-marker-alt mr-1"></i> Assigned: ${user.area}
                    </span>
                </div>
                <div class="grid grid-cols-2 gap-2 pt-2 text-left text-xs bg-dark-700 p-3 rounded-xl border border-slate-800 text-slate-300">
                    <div><span class="text-slate-500 block text-[10px]">AGE / GENDER</span><strong>${user.age || 'N/A'} yrs &bull; ${user.gender || 'N/A'}</strong></div>
                    <div><span class="text-slate-500 block text-[10px]">BIRTHDATE</span><strong>${user.birthdate || user.birthday || 'N/A'}</strong></div>
                </div>
                <button onclick="window.QAAuthEngine.handleLogout()" 
                    class="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 mt-4">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Log Out of System</span>
                </button>
            </div>
        `;
    }

    /**
     * Auto-sync registered user with index.html user table (qaUsersList / user.js)
     */
    function syncWithUserTable(user) {
        if (typeof window.qaUsersList !== 'undefined' && Array.isArray(window.qaUsersList)) {
            const existingIdx = window.qaUsersList.findIndex(u => u.id.toLowerCase() === user.username.toLowerCase());
            if (existingIdx > -1) {
                window.qaUsersList[existingIdx].status = "Active / On-Shift";
                window.qaUsersList[existingIdx].image = user.image;
            } else {
                window.qaUsersList.unshift({
                    id: user.username,
                    name: user.fullname,
                    role: user.role || "Lead QA Inspector",
                    area: user.area || "All MS Section Areas",
                    shift: "Day Shift (08:00 - 17:00)",
                    clearance: "Level 3 (Full DCS & Audit)",
                    status: "Active / On-Shift",
                    image: user.image || CONFIG.defaultImage
                });
            }
            // Trigger table re-render if function exists
            if (typeof window.renderUserTable === 'function') window.renderUserTable();
            if (typeof window.updateUserKPIs === 'function') window.updateUserKPIs();
        }
    }

    /**
     * ============================================================================
     * PUBLIC API (window.QAAuthEngine)
     * ============================================================================
     */
    window.QAAuthEngine = {
        /**
         * Switch between Login & Register tabs in portal
         */
        switchTab: function (tab) {
            const btnLogin = document.getElementById('auth-tab-btn-login');
            const btnReg = document.getElementById('auth-tab-btn-register');
            const boxLogin = document.getElementById('auth-tab-login');
            const boxReg = document.getElementById('auth-tab-register');

            if (tab === 'login') {
                btnLogin.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition-all bg-royalblue-600 text-white shadow';
                btnReg.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white';
                boxLogin.classList.remove('hidden');
                boxReg.classList.add('hidden');
            } else {
                btnReg.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition-all bg-royalblue-600 text-white shadow';
                btnLogin.className = 'flex-1 py-2 rounded-lg text-xs font-bold transition-all text-slate-400 hover:text-white';
                boxReg.classList.remove('hidden');
                boxLogin.classList.add('hidden');
            }
        },

        /**
         * Handle Login Form Submission
         */
        handleLogin: function (e) {
            e.preventDefault();
            const usernameInput = document.getElementById('login-username').value.trim();
            const passwordInput = document.getElementById('login-password').value;
            const errorMsg = document.getElementById('login-error-msg');

            const users = getRegisteredUsers();
            const user = users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase() && u.password === passwordInput);

            if (user) {
                errorMsg.classList.add('hidden');
                localStorage.setItem(CONFIG.sessionKey, JSON.stringify(user));
                grantDashboardAccess(user);
                alert(`Welcome back, ${user.fullname}! QA clearance verified.`);
            } else {
                errorMsg.classList.remove('hidden');
                errorMsg.innerText = "Invalid Inspector ID or Password. Please try again or register.";
            }
        },

        /**
         * Handle Registration Form Submission
         */
        handleRegister: function (e) {
            e.preventDefault();
            const fullname = document.getElementById('reg-fullname').value.trim();
            const username = document.getElementById('reg-username').value.trim();
            const age = parseInt(document.getElementById('reg-age').value, 10);
            const gender = document.getElementById('reg-gender').value;
            const birthday = document.getElementById('reg-birthday').value;
            const birthplace = document.getElementById('reg-birthplace').value.trim();
            const area = document.getElementById('reg-area').value;
            const role = document.getElementById('reg-role').value;
            const password = document.getElementById('reg-password').value;
            const confirmPass = document.getElementById('reg-confirm-password').value;
            const errorMsg = document.getElementById('reg-error-msg');

            if (password !== confirmPass) {
                errorMsg.classList.remove('hidden');
                errorMsg.innerText = "Security passwords do not match!";
                return;
            }

            let users = getRegisteredUsers();
            if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                errorMsg.classList.remove('hidden');
                errorMsg.innerText = `Inspector ID '${username}' is already registered in the QA database!`;
                return;
            }

            // Format readable birthdate
            const dateObj = new Date(birthday);
            const birthdateFormatted = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : birthday;

            const newUser = {
                username,
                password,
                fullname,
                age,
                gender,
                birthday,
                birthdate: birthdateFormatted,
                birthplace,
                area,
                role,
                image: currentTempImage || CONFIG.defaultImage
            };

            // Save to registered users array
            users.unshift(newUser);
            localStorage.setItem(CONFIG.usersKey, JSON.stringify(users));

            // Automatically log in the newly registered user
            localStorage.setItem(CONFIG.sessionKey, JSON.stringify(newUser));
            errorMsg.classList.add('hidden');

            grantDashboardAccess(newUser);
            alert(`Registration successful! Account created for ${fullname} (${username}). You are now logged in.`);
            e.target.reset();
            currentTempImage = null;
        },

        /**
         * Handle Logout Functionality
         */
        handleLogout: function () {
            if (confirm("Are you sure you want to log out of the QA Portal and lock dashboard access?")) {
                localStorage.removeItem(CONFIG.sessionKey);
                
                // Re-inject Portal Login button if needed by reloading or restoring
                window.location.reload();
            }
        },

        /**
         * Preview & Compress Profile Image using Canvas
         */
        previewImage: function (event) {
            const file = event.target.files[0];
            if (!file) return;
const reader = new FileReader();
            reader.onload = function (readerEvent) {
                const img = new Image();
                img.onload = function () {
                    // HTML5 Canvas compression to resize image to max 200x200
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 200;
                    const MAX_HEIGHT = 200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG Base64 at 80% quality to protect LocalStorage quota
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    currentTempImage = dataUrl;

                    // Update DOM Previewer
                    const previewBox = document.getElementById('reg-avatar-preview');
                    if (previewBox) {
                        previewBox.innerHTML = `<img src="${dataUrl}" alt="Avatar Preview" class="w-full h-full object-cover">`;
                        previewBox.classList.remove('border-sky-400/50');
                        previewBox.classList.add('border-emerald-400', 'ring-2', 'ring-emerald-400/30');
                    }
                };
                img.src = readerEvent.target.result;
            };
            reader.readAsDataURL(file);
        },

        /**
         * Automatically calculate Age when Birthday is selected in date picker
         */
        calcAgeFromDate: function () {
            const birthVal = document.getElementById('reg-birthday').value;
            const ageInput = document.getElementById('reg-age');
            if (!birthVal || !ageInput) return;

            const birthDate = new Date(birthVal);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age >= 18 && age <= 100) {
                ageInput.value = age;
            }
        },

        /**
         * Return active logged-in user profile data
         */
        getCurrentUser: function () {
            try {
                const sessionData = localStorage.getItem(CONFIG.sessionKey);
                return sessionData ? JSON.parse(sessionData) : null;
            } catch (e) {
                return null;
            }
        }
    };

    // Auto-Initialize Authentication Engine on Script Load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }

})();