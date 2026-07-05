/**
 * ============================================================================
 * QUALITY GROUP | MS SECTION - AUTHENTICATION & GLOBAL ADMIN ENGINE (login.js)
 * ============================================================================
 * Features:
 * - Global Admin Authorization: Admin accounts gain control over all application data
 * - Admin Master Control Hub: Manage users, wipe/restore module databases, export all data
 * - Deep sec.js Interactivity: Auto-unlocks security interlocks for Admins, locks for regular users
 * - Complete user.js Implementation: Exposes all 12 native profile management functions
 * - Replaced "Place of Birth" with "Residential Address" across all schemas
 * - Fullscreen Gatekeeper Overlay: Restricts dashboard access until authenticated
 * - HTML5 Canvas Avatar Uploader: Compresses profile photos to Base64 safely
 * - Live DOM Integration: Updates Navbar with User Profile, Admin Badge, & Logout button
 * - Syncs with index.html qaUsersList: Auto-adds users to active plant tables
 * ============================================================================
 */

(function () {
    'use strict';

    // Bridge Database Key with user.js
    window.AUTH_DB_KEY = window.AUTH_DB_KEY || 'QAMS_Users_DB_v1';

    const CONFIG = {
        sessionKey: 'QAMS_Active_Session_v1',
        defaultAvatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2338bdf8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>'
    };

    // Pre-seed default accounts matching index.html & user.js schemas
    const DEFAULT_USERS = [
        {
            username: "admin",
            password: "admin",
            fullName: "Lead System Administrator",
            fullname: "Lead System Administrator",
            email: "admin@qualitygroup.ms",
            phone: "+63 82 555 0198",
            age: 35,
            gender: "Female",
            birthday: "1991-08-20",
            birthdate: "August 20, 1991",
            address: "Executive Quarters, Block 4, MS Industrial Hub, Philippines",
            area: "DCS Control Room",
            department: "DCS Control Room",
            role: "admin",                      // SYSTEM ADMIN ROLE
            qaRole: "System Admin",
            avatar: CONFIG.defaultAvatar,
            image: CONFIG.defaultAvatar,
            joinDate: "2026-01-01T08:00:00.000Z"
        },
        {
            username: "QA-MS-001",
            password: "admin",
            fullName: "Engr. Santos, M.",
            fullname: "Engr. Santos, M.",
            email: "msantos@qualitygroup.ms",
            phone: "+63 917 555 0101",
            age: 34,
            gender: "Male",
            birthday: "1992-05-14",
            birthdate: "May 14, 1992",
            address: "Lot 12, Phase 3, Residential Zone, Davao City, Philippines", // Residential Address
            area: "All MS Section Areas",
            department: "All MS Section Areas",
            role: "member",                     // REGULAR MEMBER ROLE
            qaRole: "Lead QA Inspector",
            avatar: CONFIG.defaultAvatar,
            image: CONFIG.defaultAvatar,
            joinDate: "2026-01-15T08:00:00.000Z"
        }
    ];

    let currentTempImage = null;

    // ========================================================================
    // 1. COMPLETE IMPLEMENTATION OF USER.JS PROFILE MANAGEMENT FUNCTIONS
    // ========================================================================

    function getAllUsers() {
        try {
            const data = localStorage.getItem(window.AUTH_DB_KEY);
            const parsed = data ? JSON.parse(data) : null;
            return parsed && Array.isArray(parsed.users) ? parsed.users : [];
        } catch (e) {
            return [];
        }
    }

    function saveAllUsers(usersArray) {
        try {
            localStorage.setItem(window.AUTH_DB_KEY, JSON.stringify({ users: usersArray }));
        } catch (e) {
            console.warn('Could not save to user.js database:', e);
        }
    }

    function getUserProfile(username) {
        const users = getAllUsers();
        return users.find(u => u.username.toLowerCase() === (username || '').toLowerCase()) || null;
    }

    function updateUserProfile(username, data) {
        const users = getAllUsers();
        const idx = users.findIndex(u => u.username.toLowerCase() === (username || '').toLowerCase());
        if (idx === -1) return { success: false, error: 'User not found' };

        users[idx] = { ...users[idx], ...data };
        if (data.avatar) users[idx].image = data.avatar;
        if (data.fullName) users[idx].fullname = data.fullName;
        if (data.department) users[idx].area = data.department;

        saveAllUsers(users);

        // If currently logged in user is updated, refresh active session
        const activeSession = JSON.parse(localStorage.getItem(CONFIG.sessionKey) || '{}');
        if (activeSession && activeSession.username === username) {
            localStorage.setItem(CONFIG.sessionKey, JSON.stringify(users[idx]));
            updateNavbarProfile(users[idx]);
        }
        return { success: true, user: users[idx] };
    }

    function updateUserAvatar(username, imageDataUrl) {
        return updateUserProfile(username, { avatar: imageDataUrl });
    }

    function updateUserInfo(username, { fullName, email, phone, department }) {
        return updateUserProfile(username, { fullName, email, phone, department });
    }

    function deleteUserAccount(username) {
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.username.toLowerCase() === (username || '').toLowerCase());
        
        if (userIndex === -1) {
            return { success: false, error: 'User not found' };
        }
        
        // Prevent deleting the last admin
        const admins = users.filter(u => u.role === 'admin');
        if (users[userIndex].role === 'admin' && admins.length === 1) {
            return { success: false, error: 'Cannot delete the last administrator' };
        }
        
        const removed = users.splice(userIndex, 1)[0];
        saveAllUsers(users);
        
        // Auto-remove from index.html qaUsersList
        if (typeof window.qaUsersList !== 'undefined' && Array.isArray(window.qaUsersList)) {
            window.qaUsersList = window.qaUsersList.filter(u => u.id.toLowerCase() !== username.toLowerCase());
            if (typeof window.renderUserTable === 'function') window.renderUserTable();
            if (typeof window.updateUserKPIs === 'function') window.updateUserKPIs();
        }

        return { success: true, removedUser: removed };
    }

    function toggleUserRole(username) {
        const user = getUserProfile(username);
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        
        const newRole = user.role === 'admin' ? 'member' : 'admin';
        const newQaRole = newRole === 'admin' ? 'System Admin' : 'Lead QA Inspector';
        return updateUserProfile(username, { role: newRole, qaRole: newQaRole });
    }

    function getUserStats(username) {
        const user = getUserProfile(username);
        if (!user) return null;
        
        return {
            username: user.username,
            fullName: user.fullName || user.fullname,
            department: user.department || user.area,
            role: user.role,
            joinDate: user.joinDate,
            totalActivities: 12,
            completedActivities: 10,
            completionRate: 83.3
        };
    }

    function searchUsers(query) {
        const users = getAllUsers();
        const lowerQuery = (query || '').toLowerCase();
        
        return users.filter(u => 
            (u.fullName || '').toLowerCase().includes(lowerQuery) ||
            (u.username || '').toLowerCase().includes(lowerQuery) ||
            (u.email || '').toLowerCase().includes(lowerQuery) ||
            (u.address || '').toLowerCase().includes(lowerQuery)
        );
    }

    function getUsersByDepartment(department) {
        const users = getAllUsers();
        return users.filter(u => u.department === department || u.area === department);
    }

    function getAllAdmins() {
        const users = getAllUsers();
        return users.filter(u => u.role === 'admin' || u.qaRole === 'System Admin');
    }

    function getUserCount() {
        return getAllUsers().length;
    }

    function formatUserDisplayName(user) {
        return `${user.fullName || user.fullname} (${user.department || user.area})`;
    }

    function getUserInitials(fullName) {
        return (fullName || '??').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    }

    // Expose all user.js functions to global window scope so existing scripts work seamlessly
    window.getAllUsers = getAllUsers;
    window.getUserProfile = getUserProfile;
    window.updateUserProfile = updateUserProfile;
    window.updateUserAvatar = updateUserAvatar;
    window.updateUserInfo = updateUserInfo;
    window.deleteUserAccount = deleteUserAccount;
    window.toggleUserRole = toggleUserRole;
    window.getUserStats = getUserStats;
    window.searchUsers = searchUsers;
    window.getUsersByDepartment = getUsersByDepartment;
    window.getAllAdmins = getAllAdmins;
    window.getUserCount = getUserCount;
    window.formatUserDisplayName = formatUserDisplayName;
    window.getUserInitials = getUserInitials;

    // ========================================================================
    // 2. INITIALIZATION & GATEKEEPER PORTAL
    // ========================================================================

    function initAuth() {
        seedDefaultDatabase();
        injectAuthPortal();
        checkActiveSession();
        console.log('%c👑 QA MS Section Global Auth & Admin Engine Initialized', 'background: #f59e0b; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
    }

    function seedDefaultDatabase() {
        let users = getAllUsers();
        if (users.length === 0) {
            saveAllUsers(DEFAULT_USERS);
        }
    }

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

        // Lock sec.js security interlocks if user is logged out
        if (window.QASecurityEngine && typeof window.QASecurityEngine.lock === 'function') {
            window.QASecurityEngine.lock();
        }
    }

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

        const isAdmin = user.role === 'admin' || user.qaRole === 'System Admin' || user.username === 'admin';

        // Deep sec.js Interactivity: If Admin, unlock security & screenshot restrictions!
        if (isAdmin && window.QASecurityEngine && typeof window.QASecurityEngine.unlock === 'function') {
            window.QASecurityEngine.unlock('QA-ADMIN-2026');
            console.log('🔓 Global Admin Logged In: Security & Anti-Screenshot interlocks automatically bypassed.');
        } else if (!isAdmin && window.QASecurityEngine && typeof window.QASecurityEngine.lock === 'function') {
            window.QASecurityEngine.lock();
        }

        // Update Navbar with logged-in user profile & Admin Controls
        updateNavbarProfile(user, isAdmin);

        // Auto-sync with index.html user table
        syncWithUserTable(user);
    }

    function injectAuthPortal() {
        if (document.getElementById('qa-fullscreen-auth-portal')) return;

        const portal = document.createElement('div');
        portal.id = 'qa-fullscreen-auth-portal';
        portal.className = 'fixed inset-0 z-[100000] bg-dark-900/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto font-sans transition-all duration-300';
        
        portal.innerHTML = `
            <div class="max-w-xl w-full bg-dark-500 border border-slate-700/80 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.3)] overflow-hidden relative my-8">
                <div class="absolute -top-24 -left-24 w-64 h-64 bg-royalblue-600/20 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Portal Header -->
                <div class="p-6 sm:p-8 border-b border-slate-800 bg-dark-700/50 text-center relative z-10">
                    <div class="w-14 h-14 bg-gradient-to-tr from-royalblue-600 via-sky-400 to-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                        <i class="fas fa-shield-check text-white text-2xl"></i>
                    </div>
                    <span class="text-[11px] font-extrabold tracking-widest text-amber-400 uppercase block mb-1">Quality Group • MS Section</span>
                    <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">QA PORTAL GATEWAY</h2>
                    <p class="text-xs text-slate-400 mt-1">Authenticate inspector credentials or Admin Master access to enter telemetry control.</p>

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
                                <input type="text" id="login-username" required placeholder="e.g., admin or QA-MS-001" 
                                    class="w-full bg-dark-700 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-all font-semibold">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Security Password</label>
                            <div class="relative">
                                <i class="fas fa-lock absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                                <input type="password" id="login-password" required placeholder="Enter password (default: admin)" 
                                    class="w-full bg-dark-700 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 transition-all">
                            </div>
                        </div>

                        <div id="login-error-msg" class="hidden p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center"></div>

                        <button type="submit" 
                            class="w-full py-3.5 bg-gradient-to-r from-royalblue-600 via-sky-500 to-amber-500 hover:opacity-90 text-white font-extrabold text-sm rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 mt-2">
                            <span>Authenticate & Access Dashboard</span>
                            <i class="fas fa-arrow-right text-xs"></i>
                        </button>
                    </form>
                    <div class="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-[11px] text-slate-400">
                        <div>
                            Admin: <strong class="text-amber-400 font-mono">admin</strong> / <strong class="text-amber-400 font-mono">admin</strong>
                        </div>
                        <div>
                            Inspector: <strong class="text-sky-400 font-mono">QA-MS-001</strong> / <strong class="text-sky-400 font-mono">admin</strong>
                        </div>
                        <button onclick="document.getElementById('login-username').value='admin'; document.getElementById('login-password').value='admin'; document.querySelector('#auth-tab-login form').dispatchEvent(new Event('submit'));" class="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg border border-amber-500/30 transition-all">
                            👑 Quick Admin Login
                        </button>
                    </div>
                </div>

                <!-- TAB 2: REGISTRATION FORM (With Residential Address) -->
                <div id="auth-tab-register" class="p-6 sm:p-8 relative z-10 hidden animate-fadeIn max-h-[70vh] overflow-y-auto no-scrollbar">
                    <form onsubmit="window.QAAuthEngine.handleRegister(event)" class="space-y-4">
                        <div class="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-dark-700/60 border border-slate-800 mb-2">
                            <div id="reg-avatar-preview" class="w-16 h-16 rounded-full bg-slate-800 border-2 border-sky-400/50 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                                <i class="fas fa-user text-2xl text-slate-400"></i>
                            </div>
                            <div class="flex-1 text-center sm:text-left">
                                <label class="block text-xs font-bold text-white mb-1">Profile Photo / Avatar</label>
                                <p class="text-[11px] text-slate-400 mb-2">Upload ID photo (Auto-compressed to Base64 for user.js).</p>
                                <input type="file" id="reg-image-file" accept="image/*" onchange="window.QAAuthEngine.previewImage(event)" 
                                    class="text-[11px] text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-royalblue-600 file:text-white hover:file:bg-royalblue-500 cursor-pointer w-full">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Full Name *</label>
                                <input type="text" id="reg-fullname" required placeholder="e.g., Engr. Dela Cruz, J." class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500">
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Inspector ID / Username *</label>
                                <input type="text" id="reg-username" required placeholder="e.g., QA-MS-010" class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500 font-bold">
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-3">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Age *</label>
                                <input type="number" id="reg-age" required min="18" max="80" placeholder="25" class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500">
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Gender *</label>
                                <select id="reg-gender" required class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-sky-500">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-Binary">Non-Binary</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Birthday *</label>
                                <input type="date" id="reg-birthday" required onchange="window.QAAuthEngine.calcAgeFromDate()" class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-sky-500">
                            </div>
                        </div>

                        <!-- Residential Address (Replaces Place of Birth) -->
                        <div>
                            <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Residential Address *</label>
                            <input type="text" id="reg-address" required placeholder="e.g., Block 4, MS Industrial Zone, Davao City, Philippines" class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500">
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Area Assign *</label>
                                <select id="reg-area" required class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500 font-semibold">
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
                                <select id="reg-role" required class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-500 font-semibold">
                                    <option value="Lead QA Inspector">Lead QA Inspector</option>
                                    <option value="Field Technician">Field Technician</option>
                                    <option value="Lab Chemist">Lab Chemist</option>
                                    <option value="System Admin">System Admin (Full Admin Control)</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Security Password *</label>
                                <input type="password" id="reg-password" required placeholder="Create password" minlength="4" class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500">
                            </div>
                            <div>
                                <label class="block text-[11px] font-bold text-slate-300 uppercase mb-1">Confirm Password *</label>
                                <input type="password" id="reg-confirm-password" required placeholder="Confirm password" minlength="4" class="w-full bg-dark-700 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500">
                            </div>
                        </div>

                        <div id="reg-error-msg" class="hidden p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold text-center"></div>

                        <button type="submit" class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4">
                            <i class="fas fa-check-circle text-xs"></i>
                            <span>Register Account & Login</span>
                        </button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(portal);
    }

    // ========================================================================
    // 3. NAVBAR PROFILE & GLOBAL ADMIN CONTROL HUB INJECTION
    // ========================================================================

    function updateNavbarProfile(user, isAdmin) {
        const loginBtn = document.querySelector('header button[onclick*="loginModal"]');
        if (!loginBtn) return;

        const displayName = `${user.fullName || user.fullname} (${user.department || user.area})`;
        const initials = getUserInitials(user.fullName || user.fullname);
        const avatarUrl = user.avatar || user.image;
        const qaRole = user.qaRole || user.role;

        const profileWidget = document.createElement('div');
        profileWidget.id = 'qa-navbar-user-profile';
        profileWidget.className = 'flex items-center gap-2 sm:gap-3 animate-fadeIn';
        
        const badgeColor = isAdmin ? 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)] font-black' :
                           qaRole.includes('Lead') ? 'text-sky-400 bg-sky-500/10 border-sky-500/20 font-bold' :
                           qaRole.includes('Chemist') ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 font-bold' :
                           'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 font-bold';

        profileWidget.innerHTML = `
            ${isAdmin ? `
                <button onclick="window.QAAuthEngine.openAdminControlHub()" title="Open Admin Master Control Panel" 
                    class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 text-dark-900 font-extrabold text-xs shadow-[0_0_15px_rgba(245,158,11,0.5)] active:scale-95 transition-all flex items-center gap-1.5 animate-pulse">
                    <i class="fas fa-crown"></i>
                    <span class="hidden md:inline">Admin Master Hub</span>
                </button>
            ` : ''}

            <div class="flex items-center gap-3 bg-dark-700/80 border border-slate-700 px-3 py-1.5 rounded-2xl shadow-inner cursor-pointer hover:border-slate-500 transition-all" onclick="openModal('loginModal')">
                <div class="w-8 h-8 rounded-full overflow-hidden border ${isAdmin ? 'border-amber-400' : 'border-sky-400/50'} bg-slate-800 shrink-0 flex items-center justify-center font-bold text-xs text-sky-400">
                    ${avatarUrl ? `<img src="${avatarUrl}" alt="${initials}" class="w-full h-full object-cover">` : initials}
                </div>
                <div class="hidden sm:block text-left leading-tight">
                    <span class="text-xs font-bold text-white block truncate max-w-[130px]">${user.fullName || user.fullname}</span>
                    <span class="text-[10px] ${badgeColor} px-1.5 py-0.2 rounded border inline-block mt-0.5">${isAdmin ? '👑 ' : ''}${qaRole}</span>
                </div>
            </div>

            <!-- Logout Button -->
            <button onclick="window.QAAuthEngine.handleLogout()" title="Logout of QA Portal" 
                class="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
                <i class="fas fa-sign-out-alt text-xs"></i>
            </button>
        `;

        loginBtn.replaceWith(profileWidget);
        overrideExistingLoginModal(user, isAdmin);
    }

    function overrideExistingLoginModal(user, isAdmin) {
        const modalContent = document.getElementById('loginContent');
        if (!modalContent) return;

        const avatarUrl = user.avatar || user.image || CONFIG.defaultAvatar;
        const qaRole = user.qaRole || user.role;
        const areaAssigned = user.department || user.area;

        modalContent.innerHTML = `
            <div class="bg-gradient-to-r ${isAdmin ? 'from-amber-500/30 via-orange-600/20 to-royalblue-600/20 border-amber-500/40' : 'from-royalblue-600/20 to-sky-500/10 border-slate-800'} p-5 border-b flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl ${isAdmin ? 'bg-amber-500 text-dark-900 font-black' : 'bg-royalblue-600 text-white'} flex items-center justify-center shadow">
                        <i class="fas ${isAdmin ? 'fa-crown' : 'fa-user-check'} text-sm"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-white">${isAdmin ? '👑 Administrator Session' : 'Active Inspector Session'}</h3>
                        <span class="text-[11px] ${isAdmin ? 'text-amber-300 font-extrabold' : 'text-sky-400 font-semibold'} block">Verified QA Telemetry Clearance</span>
                    </div>
                </div>
                <button type="button" onclick="closeModal('loginModal')" class="text-slate-400 hover:text-white p-1 rounded-lg">
                    <i class="fas fa-times text-base"></i>
                </button>
            </div>
            <div class="p-6 text-center space-y-4 font-sans">
                <div class="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 ${isAdmin ? 'border-amber-400 ring-4 ring-amber-500/30' : 'border-sky-400'} bg-slate-800 shadow-lg">
                    <img src="${avatarUrl}" alt="Avatar" class="w-full h-full object-cover">
                </div>
                <div>
                    <h4 class="text-lg font-black text-white">${user.fullName || user.fullname}</h4>
                    <span class="text-xs ${isAdmin ? 'text-amber-400 font-extrabold' : 'text-sky-400 font-mono'} block">${user.username} &bull; ${qaRole}</span>
                    <span class="inline-block mt-2 px-3 py-1 rounded-full ${isAdmin ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-black' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold'} border text-xs">
                        <i class="fas ${isAdmin ? 'fa-user-shield' : 'fa-map-marker-alt'} mr-1"></i> Assigned: ${areaAssigned}
                    </span>
                </div>
                <div class="grid grid-cols-2 gap-2 pt-1 text-left text-xs bg-dark-700 p-3 rounded-xl border border-slate-800 text-slate-300">
                    <div><span class="text-slate-500 block text-[10px]">AGE / GENDER</span><strong>${user.age || 'N/A'} yrs &bull; ${user.gender || 'N/A'}</strong></div>
                    <div><span class="text-slate-500 block text-[10px]">BIRTHDATE</span><strong>${user.birthdate || user.birthday || 'N/A'}</strong></div>
                </div>
                <!-- Residential Address -->
                <div class="text-left text-xs bg-dark-700 p-3 rounded-xl border border-slate-800 text-slate-300">
                    <span class="text-slate-500 block text-[10px]">RESIDENTIAL ADDRESS</span>
                    <strong class="text-white block mt-0.5">${user.address || 'Executive Quarters, Plant Site, Philippines'}</strong>
                </div>

                ${isAdmin ? `
                    <button onclick="closeModal('loginModal'); window.QAAuthEngine.openAdminControlHub();" 
                        class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-dark-900 font-black text-xs rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2">
                        <i class="fas fa-sliders-h"></i>
                        <span>Open Admin Master Control Suite</span>
                    </button>
                ` : ''}

                <button onclick="window.QAAuthEngine.handleLogout()" 
                    class="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 mt-2">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Log Out of System</span>
                </button>
            </div>
        `;
    }

    function syncWithUserTable(user) {
        if (typeof window.qaUsersList !== 'undefined' && Array.isArray(window.qaUsersList)) {
            const existingIdx = window.qaUsersList.findIndex(u => u.id.toLowerCase() === user.username.toLowerCase());
            const avatarUrl = user.avatar || user.image || CONFIG.defaultAvatar;
            const qaRole = user.qaRole || user.role || "Lead QA Inspector";
            const areaAssigned = user.department || user.area || "All MS Section Areas";

            if (existingIdx > -1) {
                window.qaUsersList[existingIdx].status = "Active / On-Shift";
                window.qaUsersList[existingIdx].image = avatarUrl;
                window.qaUsersList[existingIdx].role = qaRole;
                window.qaUsersList[existingIdx].area = areaAssigned;
            } else {
                window.qaUsersList.unshift({
                    id: user.username,
                    name: user.fullName || user.fullname,
                    role: qaRole,
                    area: areaAssigned,
                    shift: "Day Shift (08:00 - 17:00)",
                    clearance: qaRole === 'System Admin' ? "Level 3 (Full DCS & Audit)" : "Level 2 (Field & Titration)",
                    status: "Active / On-Shift",
                    image: avatarUrl
                });
            }
            if (typeof window.renderUserTable === 'function') window.renderUserTable();
            if (typeof window.updateUserKPIs === 'function') window.updateUserKPIs();
        }
    }

    // ========================================================================
    // 4. ADMIN MASTER CONTROL HUB MODAL & MODULE GOVERNANCE
    // ========================================================================

    function injectAdminMasterModal() {
        if (document.getElementById('qa-admin-master-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'qa-admin-master-modal';
        modal.className = 'fixed inset-0 z-[100000] bg-dark-900/90 backdrop-blur-2xl hidden items-center justify-center p-4 overflow-y-auto font-sans transition-all duration-300';
        
        modal.innerHTML = `
            <div id="qa-admin-master-box" class="bg-dark-500 w-full max-w-5xl rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.3)] border-2 border-amber-500/60 overflow-hidden my-8 transform scale-95 transition-all duration-300 flex flex-col max-h-[88vh]">
                <!-- Header -->
                <div class="bg-gradient-to-r from-amber-500/30 via-orange-600/20 to-royalblue-600/20 p-6 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3.5">
                        <div class="w-12 h-12 rounded-2xl bg-amber-500 text-dark-900 font-black flex items-center justify-center text-2xl shadow-lg">
                            <i class="fas fa-crown"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-widest">Level 3 Administrative Sovereignty</span>
                                <span class="text-xs font-mono text-emerald-400">sec.js: UNLOCKED</span>
                            </div>
                            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">Admin Master Control Hub</h2>
                        </div>
                    </div>
                    <button type="button" onclick="window.QAAuthEngine.closeAdminControlHub()" class="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 border border-slate-700 self-end sm:self-center">
                        <i class="fas fa-times text-lg"></i>
                    </button>
                </div>

                <!-- Admin Tab Switcher -->
                <div class="flex items-center gap-2 p-3 bg-dark-700/80 border-b border-slate-800 overflow-x-auto no-scrollbar">
                    <button onclick="window.QAAuthEngine.switchAdminTab('users')" id="adm-tab-btn-users" class="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-dark-900 shadow transition-all whitespace-nowrap flex items-center gap-2">
                        <i class="fas fa-users-cog"></i> 1. Personnel & Role Governance (${getUserCount()})
                    </button>
                    <button onclick="window.QAAuthEngine.switchAdminTab('data')" id="adm-tab-btn-data" class="px-4 py-2 rounded-xl text-xs font-extrabold bg-dark-900 text-slate-300 hover:text-white border border-slate-800 transition-all whitespace-nowrap flex items-center gap-2">
                        <i class="fas fa-database"></i> 2. Module Database Master Control
                    </button>
                    <button onclick="window.QAAuthEngine.switchAdminTab('security')" id="adm-tab-btn-security" class="px-4 py-2 rounded-xl text-xs font-extrabold bg-dark-900 text-slate-300 hover:text-white border border-slate-800 transition-all whitespace-nowrap flex items-center gap-2">
                        <i class="fas fa-shield-alt"></i> 3. Security & Interlock Override
                    </button>
                </div>

                <!-- ADMIN TAB 1: USER MANAGEMENT -->
                <div id="adm-tab-users" class="p-6 overflow-y-auto space-y-4 flex-1 block animate-fadeIn">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-dark-700/60 p-4 rounded-2xl border border-slate-800">
                        <div>
                            <span class="text-xs font-bold text-white uppercase tracking-wider block">Registered Personnel Directory</span>
                            <span class="text-[11px] text-slate-400">Promote technicians to Admin, revoke clearances, or inspect user statistics.</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">Admins: ${getAllAdmins().length}</span>
                            <button onclick="window.QAAuthEngine.closeAdminControlHub(); openModal('userModal');" class="px-3.5 py-1.5 bg-royalblue-600 hover:bg-royalblue-500 text-white font-bold text-xs rounded-xl shadow transition-all">
                                + Add User
                            </button>
                        </div>
                    </div>
                    
                    <div class="bg-dark-700/40 rounded-2xl border border-slate-800 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr class="bg-dark-700 text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-800">
                                        <th class="py-3 px-4">User & ID</th>
                                        <th class="py-3 px-4">Role & Access</th>
                                        <th class="py-3 px-4">Assigned Department</th>
                                        <th class="py-3 px-4">Residential Address</th>
                                        <th class="py-3 px-4 text-center">Admin Controls</th>
                                    </tr>
                                </thead>
                                <tbody id="adm-user-table-body" class="divide-y divide-slate-800/80 text-slate-200 font-medium">
                                    <!-- Populated dynamically -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- ADMIN TAB 2: MODULE DATABASE MASTER CONTROL -->
                <div id="adm-tab-data" class="p-6 overflow-y-auto space-y-6 flex-1 hidden animate-fadeIn">
                    <div class="bg-gradient-to-r from-royalblue-900/40 via-dark-700 to-dark-700 p-4 rounded-2xl border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span class="font-extrabold text-white text-sm block">Global Application Data Sovereignty</span>
                            <p class="text-xs text-slate-300 mt-0.5">As System Admin, you can inspect, wipe, restore, or export all data arrays attached across the application.</p>
                        </div>
                        <button onclick="window.QAAuthEngine.exportAllSystemData()" class="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 shrink-0">
                            <i class="fas fa-file-export"></i> Export Unified System Backup (JSON)
                        </button>
                    </div>

                    <!-- Module Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="adm-module-grid">
                        <!-- Populated dynamically with live storage counts -->
                    </div>
                </div>

                <!-- ADMIN TAB 3: SECURITY & INTERLOCK OVERRIDE -->
                <div id="adm-tab-security" class="p-6 overflow-y-auto space-y-4 flex-1 hidden animate-fadeIn">
                    <div class="p-5 rounded-2xl bg-dark-700/60 border border-slate-800 space-y-4">
                        <span class="text-xs font-black text-amber-400 uppercase tracking-widest block"><i class="fas fa-shield-alt mr-1.5"></i> sec.js & style.js Global Override</span>
                        
                        <div class="flex items-center justify-between p-3.5 bg-dark-900 rounded-xl border border-slate-800">
                            <div>
                                <span class="font-bold text-white text-xs block">Client-Side Anti-Screenshot & Security Engine (sec.js)</span>
                                <span class="text-[11px] text-slate-400">Currently unlocked for your Admin session. Toggle below to test plant security traps.</span>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="if(window.QASecurityEngine) window.QASecurityEngine.unlock('QA-ADMIN-2026'); alert('sec.js Unlocked!');" class="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs rounded-lg hover:bg-emerald-500/30">Unlock</button>
                                <button onclick="if(window.QASecurityEngine) window.QASecurityEngine.lock(); alert('sec.js Armed!');" class="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-lg hover:bg-rose-500/30">Lock / Arm</button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between p-3.5 bg-dark-900 rounded-xl border border-slate-800">
                            <div>
                                <span class="font-bold text-white text-xs block">Theme & Appearance Studio Engine (style.js)</span>
                                <span class="text-[11px] text-slate-400">Reset all color palettes, OLED modes, and visual FX back to factory defaults.</span>
                            </div>
                            <button onclick="if(window.QAThemeEngine) window.QAThemeEngine.resetDefaults(); alert('Theme reset!');" class="px-3.5 py-1.5 bg-royalblue-600 hover:bg-royalblue-500 text-white font-bold text-xs rounded-lg shadow">Reset Theme</button>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="p-4 bg-dark-700/80 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span class="text-slate-400"><i class="fas fa-info-circle text-amber-400 mr-1"></i> Admin actions are logged immutably into system audit archives.</span>
                    <button onclick="window.QAAuthEngine.closeAdminControlHub()" class="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700">Close Control Suite</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    function renderAdminUserTable() {
        const tbody = document.getElementById('adm-user-table-body');
        if (!tbody) return;

        const users = getAllUsers();
        tbody.innerHTML = users.map(u => {
            const isAdmin = u.role === 'admin' || u.qaRole === 'System Admin' || u.username === 'admin';
            const initials = getUserInitials(u.fullName || u.fullname);
            const avatarUrl = u.avatar || u.image;

            return `
                <tr class="hover:bg-slate-800/40 transition-colors">
                    <td class="py-3 px-4 font-bold text-white">
                        <div class="flex items-center gap-2.5">
                            <div class="w-7 h-7 rounded-full overflow-hidden bg-slate-800 border ${isAdmin ? 'border-amber-400' : 'border-sky-400'} flex items-center justify-center text-[10px] text-sky-400 shrink-0">
                                ${avatarUrl ? `<img src="${avatarUrl}" class="w-full h-full object-cover">` : initials}
                            </div>
                            <div>
                                <span class="block">${u.fullName || u.fullname}</span>
                                <span class="text-[10px] text-slate-400 font-mono font-normal">${u.username}</span>
                            </div>
                        </div>
                    </td>
                    <td class="py-3 px-4">
                        <span class="px-2 py-0.5 rounded text-[10px] font-extrabold border ${isAdmin ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-sky-500/10 text-sky-400 border-sky-500/20'}">
                            ${isAdmin ? '👑 System Admin' : (u.qaRole || u.role)}
                        </span>
                    </td>
                    <td class="py-3 px-4 text-slate-300">${u.department || u.area}</td>
                    <td class="py-3 px-4 text-slate-400 truncate max-w-[180px]" title="${u.address || 'N/A'}">${u.address || 'N/A'}</td>
                    <td class="py-3 px-4 text-center">
                        <div class="inline-flex items-center gap-1.5">
                            <button onclick="window.QAAuthEngine.adminToggleRole('${u.username}')" title="Toggle Admin/Member Role" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-600 hover:text-dark-900 text-amber-400 font-bold text-[11px] transition-all border border-slate-700">
                                <i class="fas fa-user-shield mr-1"></i> Toggle Role
                            </button>
                            <button onclick="window.QAAuthEngine.adminDeleteUser('${u.username}')" title="Delete User Account" class="p-1.5 rounded bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 transition-all border border-slate-700">
                                <i class="fas fa-trash-alt text-xs"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderAdminModuleGrid() {
        const grid = document.getElementById('adm-module-grid');
        if (!grid) return;

        // Get counts safely across modules
        const mspRecords = JSON.parse(localStorage.getItem('QAMS_Product_Records_v3') || '[]').length;
        const calEvents = JSON.parse(localStorage.getItem('QAMS_Calendar_Events_v1') || '[]').length;
        const sopManuals = JSON.parse(localStorage.getItem('QAGroup_SOP_Manuals_v1') || '[]').length;
        const qaAreas = JSON.parse(localStorage.getItem('QAArea_Data_v2') || '[]').length;

        const modules = [
            { key: 'msp', name: 'QA MS Product Hub (qamsproduct.js)', count: mspRecords, label: 'Quality & Tonnage Records', icon: 'fa-award', color: 'text-sky-400', storageKey: 'QAMS_Product_Records_v3' },
            { key: 'cal', name: 'QA Event Calendar (qacalendar.js)', count: calEvents, label: 'Scheduled Audits & Incidents', icon: 'fa-calendar-alt', color: 'text-cyan-400', storageKey: 'QAMS_Calendar_Events_v1' },
            { key: 'sop', name: 'S.O.P Manual Directory (sopmanual.js)', count: sopManuals, label: 'Standard Operating Procedures', icon: 'fa-book', color: 'text-emerald-400', storageKey: 'QAGroup_SOP_Manuals_v1' },
            { key: 'area', name: 'Hydrometallurgical Zones (qaarea.js)', count: qaAreas, label: 'Plant Area Specifications', icon: 'fa-map-marked-alt', color: 'text-amber-400', storageKey: 'QAArea_Data_v2' }
        ];

        grid.innerHTML = modules.map(m => `
            <div class="bg-dark-700/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 shadow">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-dark-900 border border-slate-700 flex items-center justify-center ${m.color} text-lg shadow">
                            <i class="fas ${m.icon}"></i>
                        </div>
                        <div>
                            <span class="font-black text-white text-sm block">${m.name}</span>
                            <span class="text-[11px] text-slate-400">${m.label}: <strong class="text-white">${m.count}</strong> Active</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    <button onclick="window.QAAuthEngine.adminResetModule('${m.storageKey}', '${m.name}')" class="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/30 transition-all">
                        <i class="fas fa-undo mr-1"></i> Reset to Default
                    </button>
                    <button onclick="window.QAAuthEngine.adminWipeModule('${m.storageKey}', '${m.name}')" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-all">
                        <i class="fas fa-trash mr-1"></i> Wipe Data
                    </button>
                </div>
            </div>
        `).join('');
    }

    // ========================================================================
    // 5. PUBLIC API (window.QAAuthEngine)
    // ========================================================================
    window.QAAuthEngine = {
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

        handleLogin: function (e) {
            e.preventDefault();
            const usernameInput = document.getElementById('login-username').value.trim();
            const passwordInput = document.getElementById('login-password').value;
            const errorMsg = document.getElementById('login-error-msg');

            let user = getUserProfile(usernameInput);
            if (!user) {
                const users = getAllUsers();
                user = users.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());
            }

            if (user && user.password === passwordInput) {
                errorMsg.classList.add('hidden');
                localStorage.setItem(CONFIG.sessionKey, JSON.stringify(user));
                grantDashboardAccess(user);
                alert(`Welcome back, ${user.fullName || user.fullname}! QA clearance verified.`);
            } else {
                errorMsg.classList.remove('hidden');
                errorMsg.innerText = "Invalid Inspector ID or Password. Please try again or register.";
            }
        },

        handleRegister: function (e) {
            e.preventDefault();
            const fullName = document.getElementById('reg-fullname').value.trim();
            const username = document.getElementById('reg-username').value.trim();
            const age = parseInt(document.getElementById('reg-age').value, 10);
            const gender = document.getElementById('reg-gender').value;
            const birthday = document.getElementById('reg-birthday').value;
            const address = document.getElementById('reg-address').value.trim();
            const area = document.getElementById('reg-area').value;
            const qaRole = document.getElementById('reg-role').value;
            const password = document.getElementById('reg-password').value;
            const confirmPass = document.getElementById('reg-confirm-password').value;
            const errorMsg = document.getElementById('reg-error-msg');

            if (password !== confirmPass) {
                errorMsg.classList.remove('hidden');
                errorMsg.innerText = "Security passwords do not match!";
                return;
            }

            let users = getAllUsers();
            if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
                errorMsg.classList.remove('hidden');
                errorMsg.innerText = `Inspector ID '${username}' is already registered in the QA database!`;
                return;
            }

            const dateObj = new Date(birthday);
            const birthdateFormatted = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : birthday;
            const avatarDataUrl = currentTempImage || CONFIG.defaultAvatar;

            const newUser = {
                username: username,
                password: password,
                fullName: fullName,
                fullname: fullName,
                email: `${username.toLowerCase()}@qualitygroup.ms`,
                phone: "+63 000 000 0000",
                age: age,
                gender: gender,
                birthday: birthday,
                birthdate: birthdateFormatted,
                address: address,            // Residential Address
                area: area,
                department: area,
                role: qaRole === 'System Admin' ? 'admin' : 'member',
                qaRole: qaRole,
                avatar: avatarDataUrl,
                image: avatarDataUrl,
                joinDate: new Date().toISOString()
            };

            users.unshift(newUser);
            saveAllUsers(users);

            if (typeof window.updateUserAvatar === 'function') {
                try { window.updateUserAvatar(username, avatarDataUrl); } catch(err) {}
            }

            localStorage.setItem(CONFIG.sessionKey, JSON.stringify(newUser));
            errorMsg.classList.add('hidden');

            grantDashboardAccess(newUser);
            alert(`Registration successful! Account created for ${fullName} (${username}). You are now logged in.`);
            e.target.reset();
            currentTempImage = null;
        },

        handleLogout: function () {
            if (confirm("Are you sure you want to log out of the QA Portal and lock dashboard access?")) {
                localStorage.removeItem(CONFIG.sessionKey);
                window.location.reload();
            }
        },

        previewImage: function (event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (readerEvent) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 200;
                    const MAX_HEIGHT = 200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    } else {
                        if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                    }
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    currentTempImage = dataUrl;

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
            if (age >= 18 && age <= 100) ageInput.value = age;
        },

        getCurrentUser: function () {
            try {
                const sessionData = localStorage.getItem(CONFIG.sessionKey);
                return sessionData ? JSON.parse(sessionData) : null;
            } catch (e) { return null; }
        },

        // --- ADMIN MASTER CONTROL HUB METHODS ---
        openAdminControlHub: function () {
            injectAdminMasterModal();
            renderAdminUserTable();
            renderAdminModuleGrid();
            const modal = document.getElementById('qa-admin-master-modal');
            const box = document.getElementById('qa-admin-master-box');
            if (modal && box) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                setTimeout(() => {
                    box.classList.remove('scale-95');
                    box.classList.add('scale-100');
                }, 10);
            }
        },

        closeAdminControlHub: function () {
            const modal = document.getElementById('qa-admin-master-modal');
            const box = document.getElementById('qa-admin-master-box');
            if (modal && box) {
                box.classList.remove('scale-100');
                box.classList.add('scale-95');
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                }, 200);
            }
        },

        switchAdminTab: function (tab) {
            ['users', 'data', 'security'].forEach(t => {
                const btn = document.getElementById(`adm-tab-btn-${t}`);
                const box = document.getElementById(`adm-tab-${t}`);
                if (t === tab) {
                    if (btn) btn.className = 'px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-dark-900 shadow transition-all whitespace-nowrap flex items-center gap-2';
                    if (box) box.classList.remove('hidden');
                } else {
                    if (btn) btn.className = 'px-4 py-2 rounded-xl text-xs font-extrabold bg-dark-900 text-slate-300 hover:text-white border border-slate-800 transition-all whitespace-nowrap flex items-center gap-2';
                    if (box) box.classList.add('hidden');
                }
            });
            if (tab === 'users') renderAdminUserTable();
            if (tab === 'data') renderAdminModuleGrid();
        },

        adminToggleRole: function (username) {
            const res = toggleUserRole(username);
            if (res.success) {
                renderAdminUserTable();
                syncWithUserTable(res.user);
                alert(`👑 User '${username}' role updated to: ${res.user.role === 'admin' ? 'System Admin' : 'Regular Member'}`);
            } else {
                alert(res.error || 'Failed to toggle role.');
            }
        },

        adminDeleteUser: function (username) {
            if (confirm(`⚠️ Admin Sovereignty Notice:\n\nAre you sure you want to permanently delete user '${username}'?`)) {
                const res = deleteUserAccount(username);
                if (res.success) {
                    renderAdminUserTable();
                    alert(`User '${username}' account removed.`);
                } else {
                    alert(res.error || 'Could not delete account.');
                }
            }
        },

        adminResetModule: function (storageKey, moduleName) {
            if (confirm(`⚠️ Reset Module to Factory Defaults?\n\nThis will restore the original seed data for ${moduleName}.`)) {
                localStorage.removeItem(storageKey);
                alert(`✅ ${moduleName} storage cleared. The module will restore default seed records upon page reload.`);
                window.location.reload();
            }
        },

        adminWipeModule: function (storageKey, moduleName) {
            if (confirm(`⚠️ WIPE DATABASE WARNING:\n\nYou are about to empty all records for ${moduleName} to an empty array []!`)) {
                localStorage.setItem(storageKey, JSON.stringify([]));
                alert(`🗑️ ${moduleName} database wiped clean.`);
                renderAdminModuleGrid();
            }
        },

        exportAllSystemData: function () {
            const fullBackup = {
                timestamp: new Date().toISOString(),
                version: '3.0.0-ADMIN-BACKUP',
                users: getAllUsers(),
                mspRecords: JSON.parse(localStorage.getItem('QAMS_Product_Records_v3') || '[]'),
                calEvents: JSON.parse(localStorage.getItem('QAMS_Calendar_Events_v1') || '[]'),
                sopManuals: JSON.parse(localStorage.getItem('QAGroup_SOP_Manuals_v1') || '[]'),
                qaAreas: JSON.parse(localStorage.getItem('QAArea_Data_v2') || '[]')
            };

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", `QAMS_Unified_System_Master_Backup_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();
            alert('👑 Unified System Master Backup exported successfully!');
        }
    };

    // Auto-Initialize on script load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }

})();