/**
 * ============================================================================
 * QUALITY GROUP | MS SECTION - USER PROFILE & CRUD DATABASE ENGINE (user.js)
 * ============================================================================
 * Architecture:
 * - [C] CREATE: createUser() - Validates, formats, and registers new accounts
 * - [R] READ  : getAllUsers(), getUserProfile(), searchUsers(), getUserStats()
 * - [U] UPDATE: updateUserProfile(), updateUserAvatar(), toggleUserRole()
 * - [D] DELETE: deleteUserAccount() - Safely removes users & protects sole Admin
 * 
 * Interactivity & Real-Time Sync:
 * - Auto-syncs with login.js registration modals and Admin Master Control Hub
 * - Instantly updates window.qaUsersList and triggers renderUserTable() & KPIs
 * - Dispatches 'QAMS_UserListUpdated' DOM events for cross-script reactivity
 * - Cross-tab Storage Listener: Changes in Tab A instantly reflect in Tab B
 * ============================================================================
 */

(function () {
    'use strict';

    // 1. SHARED DATABASE & SESSION CONFIGURATION
    window.AUTH_DB_KEY = window.AUTH_DB_KEY || 'QAMS_Users_DB_v1';
    const SESSION_KEY = 'QAMS_Active_Session_v1';
    const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2338bdf8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';

    // ========================================================================
    // 2. STORAGE ENGINE & REAL-TIME UI SYNCHRONIZATION
    // ========================================================================

    /**
     * Saves user array to LocalStorage and triggers real-time UI synchronization
     */
    function saveAllUsers(usersArray) {
        try {
            localStorage.setItem(window.AUTH_DB_KEY, JSON.stringify({ users: usersArray }));
            
            // Trigger real-time UI synchronization across the dashboard
            syncUserDatabaseToUI(usersArray);

            // Dispatch global DOM event so login.js and index.html can react immediately
            window.dispatchEvent(new CustomEvent('QAMS_UserListUpdated', { 
                detail: { users: usersArray, timestamp: new Date().toISOString() } 
            }));
        } catch (e) {
            console.error('❌ Failed to save to user database:', e);
        }
    }

    /**
     * Synchronizes LocalStorage users with global dashboard variables (index.html tables)
     */
    function syncUserDatabaseToUI(users = null) {
        const allUsers = users || getAllUsers();

        // 1. Sync with index.html global user array (window.qaUsersList)
        if (typeof window.qaUsersList !== 'undefined' && Array.isArray(window.qaUsersList)) {
            window.qaUsersList = allUsers.map(u => ({
                id: u.username,
                name: u.fullName || u.fullname || 'Unknown Inspector',
                role: u.qaRole || u.role || 'Lead QA Inspector',
                area: u.department || u.area || 'All MS Section Areas',
                shift: "Day Shift (08:00 - 17:00)",
                clearance: (u.role === 'admin' || u.qaRole === 'System Admin') 
                    ? "Level 3 (Full DCS & Audit)" 
                    : "Level 2 (Field & Titration)",
                status: (u.lastLogin && isRecentLogin(u.lastLogin)) ? "Active / On-Shift" : "Off-Shift / Standby",
                image: u.avatar || u.image || DEFAULT_AVATAR
            }));
        }

        // 2. Trigger DOM table rendering functions if they exist on the page
        if (typeof window.renderUserTable === 'function') {
            try { window.renderUserTable(); } catch (err) {}
        }

        // 3. Trigger KPI counter updates if they exist on the page
        if (typeof window.updateUserKPIs === 'function') {
            try { window.updateUserKPIs(); } catch (err) {}
        }

        // 4. If Admin Master Control Hub is open in login.js, refresh its table too
        if (window.QAAuthEngine && typeof window.QAAuthEngine.switchAdminTab === 'function') {
            const adminTableBody = document.getElementById('adm-user-table-body');
            if (adminTableBody && !adminTableBody.closest('.hidden')) {
                try { 
                    if (typeof renderAdminUserTable === 'function') renderAdminUserTable(); 
                } catch (err) {}
            }
        }
    }

    function isRecentLogin(isoString) {
        if (!isoString) return false;
        const diffHours = (new Date() - new Date(isoString)) / (1000 * 60 * 60);
        return diffHours < 24;
    }

    // ========================================================================
    // 3. [C] CREATE FUNCTIONS (Add New Users)
    // ========================================================================

    /**
     * CREATE: Registers a new user account into the system database
     * Automatically handles schema formatting, alias mapping, and UI syncing.
     * @param {Object} userData - User profile payload
     * @returns {Object} { success: boolean, user?: Object, error?: string }
     */
    function createUser(userData) {
        if (!userData || !userData.username) {
            return { success: false, error: 'Username/ID is required for registration.' };
        }

        const users = getAllUsers();
        const cleanUsername = userData.username.trim();

        // Check for duplicate username
        if (users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
            return { success: false, error: `Inspector ID '${cleanUsername}' is already registered in the system.` };
        }

        const avatarUrl = userData.avatar || userData.image || DEFAULT_AVATAR;
        const fullName = (userData.fullName || userData.fullname || cleanUsername).trim();
        const qaRole = userData.qaRole || userData.role || 'Lead QA Inspector';
        const assignedArea = userData.department || userData.area || 'All MS Section Areas';

        // Construct standardized schema compliant with MS Section
        const newUser = {
            username: cleanUsername,
            password: userData.password || 'admin',
            fullName: fullName,
            fullname: fullName, // Alias for cross-script compatibility
            email: userData.email || `${cleanUsername.toLowerCase()}@qualitygroup.ms`,
            phone: userData.phone || '+63 000 000 0000',
            age: parseInt(userData.age, 10) || 25,
            gender: userData.gender || 'Not Specified',
            birthday: userData.birthday || '1998-01-01',
            birthdate: userData.birthdate || userData.birthday || 'January 1, 1998',
            address: (userData.address || 'Executive Quarters, Plant Site, Philippines').trim(), // Residential Address
            area: assignedArea,
            department: assignedArea, // Alias
            role: qaRole === 'System Admin' || userData.role === 'admin' ? 'admin' : 'member',
            qaRole: qaRole,
            avatar: avatarUrl,
            image: avatarUrl, // Alias
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        // Insert at top of array (newest first)
        users.unshift(newUser);
        saveAllUsers(users);

        console.log(`✅ [user.js CREATE] Registered new user: ${fullName} (${cleanUsername})`);
        return { success: true, user: newUser };
    }

    // ========================================================================
    // 4. [R] READ FUNCTIONS (Query & Inspect Users)
    // ========================================================================

    /**
     * READ: Retrieves all registered users from LocalStorage
     */
    function getAllUsers() {
        try {
            const data = localStorage.getItem(window.AUTH_DB_KEY);
            const parsed = data ? JSON.parse(data) : null;
            return parsed && Array.isArray(parsed.users) ? parsed.users : [];
        } catch (e) {
            console.error('Error reading from user database:', e);
            return [];
        }
    }

    /**
     * READ: Get single user profile by username
     */
    function getUserProfile(username) {
        if (!username) return null;
        const users = getAllUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    }

    /**
     * READ: Search users by name, username, email, address, or department
     */
    function searchUsers(query) {
        const users = getAllUsers();
        const lowerQuery = (query || '').toLowerCase().trim();
        if (!lowerQuery) return users;
        
        return users.filter(u => 
            (u.fullName || u.fullname || '').toLowerCase().includes(lowerQuery) ||
            (u.username || '').toLowerCase().includes(lowerQuery) ||
            (u.email || '').toLowerCase().includes(lowerQuery) ||
            (u.address || '').toLowerCase().includes(lowerQuery) ||
            (u.department || u.area || '').toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * READ: Filter users by assigned department or plant area
     */
    function getUsersByDepartment(department) {
        const users = getAllUsers();
        if (!department || department === 'All MS Section Areas') return users;
        return users.filter(u => u.department === department || u.area === department);
    }

    /**
     * READ: Get all Level 3 System Administrators
     */
    function getAllAdmins() {
        const users = getAllUsers();
        return users.filter(u => u.role === 'admin' || u.qaRole === 'System Admin' || u.username === 'admin');
    }

    /**
     * READ: Get total user head count
     */
    function getUserCount() {
        return getAllUsers().length;
    }

    /**
     * READ: Calculate user telemetry statistics and completion rates
     */
    function getUserStats(username) {
        const user = getUserProfile(username);
        if (!user) return null;
        
        const daysSinceJoin = Math.max(1, Math.floor((new Date() - new Date(user.joinDate || Date.now())) / (1000 * 60 * 60 * 24)));
        const totalActivities = daysSinceJoin * 4;
        const completedActivities = Math.floor(totalActivities * 0.92);
        const completionRate = totalActivities > 0 ? ((completedActivities / totalActivities) * 100).toFixed(1) : 100;

        return {
            username: user.username,
            fullName: user.fullName || user.fullname,
            department: user.department || user.area || 'MS Section',
            role: user.role || 'member',
            qaRole: user.qaRole || 'Lead QA Inspector',
            address: user.address || 'Not Specified',
            joinDate: user.joinDate || new Date().toISOString(),
            totalActivities: totalActivities,
            completedActivities: completedActivities,
            completionRate: parseFloat(completionRate)
        };
    }

    function formatUserDisplayName(user) {
        if (!user) return 'Unknown Inspector';
        return `${user.fullName || user.fullname || user.username} (${user.department || user.area || 'MS Section'})`;
    }

    function getUserInitials(fullName) {
        if (!fullName) return 'QA';
        const parts = fullName.trim().split(' ').filter(p => p.length > 0);
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return fullName.slice(0, 2).toUpperCase();
    }

    // ========================================================================
    // 5. [U] UPDATE FUNCTIONS (Modify Profiles & Roles)
    // ========================================================================

    /**
     * UPDATE: Modifies fields of an existing user profile
     */
    function updateUserProfile(username, data) {
        const users = getAllUsers();
        const idx = users.findIndex(u => u.username.toLowerCase() === (username || '').toLowerCase());
        
        if (idx === -1) return { success: false, error: 'User not found' };

        // Merge updated data
        users[idx] = { ...users[idx], ...data };
        
        // Keep schema aliases synchronized
        if (data.avatar) users[idx].image = data.avatar;
        if (data.fullName) users[idx].fullname = data.fullName;
        if (data.department) users[idx].area = data.department;

        saveAllUsers(users);

        // If the updated user is currently logged in, sync the active session storage
        try {
            const activeSession = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
            if (activeSession && activeSession.username === username) {
                localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]));
            }
        } catch (e) {}

        console.log(`✏️ [user.js UPDATE] Profile modified for: ${username}`);
        return { success: true, user: users[idx] };
    }

    /**
     * UPDATE: Update user avatar image (Base64 string or URL)
     */
    function updateUserAvatar(username, imageDataUrl) {
        return updateUserProfile(username, { avatar: imageDataUrl, image: imageDataUrl });
    }

    /**
     * UPDATE: Update contact details and departmental assignment
     */
    function updateUserInfo(username, { fullName, email, phone, department, address }) {
        const payload = {};
        if (fullName) { payload.fullName = fullName; payload.fullname = fullName; }
        if (email) payload.email = email;
        if (phone) payload.phone = phone;
        if (department) { payload.department = department; payload.area = department; }
        if (address) payload.address = address;
        
        return updateUserProfile(username, payload);
    }

    /**
     * UPDATE: Toggle user clearance between Admin (Level 3) and Member (Level 2)
     */
    function toggleUserRole(username) {
        const user = getUserProfile(username);
        if (!user) return { success: false, error: 'User not found' };
        
        const newRole = user.role === 'admin' ? 'member' : 'admin';
        const newQaRole = newRole === 'admin' ? 'System Admin' : 'Lead QA Inspector';
        
        return updateUserProfile(username, { role: newRole, qaRole: newQaRole });
    }

    // ========================================================================
    // 6. [D] DELETE FUNCTIONS (Remove Accounts)
    // ========================================================================

    /**
     * DELETE: Remove a user account permanently from the database
     * Includes safety interlock to prevent deleting the final remaining Admin.
     */
    function deleteUserAccount(username) {
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.username.toLowerCase() === (username || '').toLowerCase());
        
        if (userIndex === -1) return { success: false, error: 'User not found in directory.' };
        
        // Safety Interlock: Prevent deleting the last System Administrator
        const admins = users.filter(u => u.role === 'admin' || u.qaRole === 'System Admin');
        if ((users[userIndex].role === 'admin' || users[userIndex].qaRole === 'System Admin') && admins.length === 1) {
            return { success: false, error: 'Security Interlock: Cannot delete the sole remaining System Administrator.' };
        }
        
        const removed = users.splice(userIndex, 1)[0];
        saveAllUsers(users);

        console.warn(`🗑️ [user.js DELETE] Removed user account: ${username}`);
        return { success: true, removedUser: removed };
    }

    // ========================================================================
    // 7. CROSS-TAB & DOM EVENT LISTENERS
    // ========================================================================

    // Listen for storage changes across browser tabs (Real-time Multi-Tab Sync)
    window.addEventListener('storage', function (e) {
        if (e.key === window.AUTH_DB_KEY) {
            console.log('🔄 [user.js] Detected cross-tab database change. Syncing dashboard UI...');
            syncUserDatabaseToUI();
        }
    });

    // Listen for registration events dispatched by login.js
    window.addEventListener('QAMS_UserListUpdated', function (e) {
        if (e.detail && e.detail.users) {
            syncUserDatabaseToUI(e.detail.users);
        } else {
            syncUserDatabaseToUI();
        }
    });

    // Initialize sync upon DOM load
    document.addEventListener('DOMContentLoaded', function () {
        syncUserDatabaseToUI();
        console.log('%c👥 QA MS Section Complete CRUD User Engine (user.js) Active', 'background: #0284c7; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
    });

    // ========================================================================
    // 8. GLOBAL WINDOW EXPORTS (Exposing CRUD API)
    // ========================================================================
    
    // [C] Create
    window.createUser = createUser;

    // [R] Read
    window.getAllUsers = getAllUsers;
    window.getUserProfile = getUserProfile;
    window.searchUsers = searchUsers;
    window.getUsersByDepartment = getUsersByDepartment;
    window.getAllAdmins = getAllAdmins;
    window.getUserCount = getUserCount;
    window.getUserStats = getUserStats;
    window.formatUserDisplayName = formatUserDisplayName;
    window.getUserInitials = getUserInitials;

    // [U] Update
    window.updateUserProfile = updateUserProfile;
    window.updateUserAvatar = updateUserAvatar;
    window.updateUserInfo = updateUserInfo;
    window.toggleUserRole = toggleUserRole;
    window.saveAllUsers = saveAllUsers;

    // [D] Delete
    window.deleteUserAccount = deleteUserAccount;

    // Sync Engine
    window.syncUserDatabaseToUI = syncUserDatabaseToUI;

})();