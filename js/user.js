/**
 * ============================================================================
 * QUALITY GROUP | MS SECTION - USER PROFILE & DATA MANAGEMENT ENGINE (user.js)
 * ============================================================================
 * Features & Interactivity:
 * - Real-Time Interactivity Bridge: Auto-syncs with login.js registrations and logins
 * - Global UI Synchronization: Automatically updates index.html user tables & KPI cards
 * - Custom Event Broadcasting: Dispatches 'QAMS_UserListUpdated' on any data change
 * - Cross-Tab Storage Listener: Syncs user data across multiple browser tabs live
 * - Full CRUD Operations: Create, Read, Update, Delete, and Role Governance
 * - Schema Compliant: Native support for 'Residential Address' and MS Section roles
 * ============================================================================
 */

(function () {
    'use strict';

    // 1. SHARED DATABASE CONFIGURATION
    window.AUTH_DB_KEY = window.AUTH_DB_KEY || 'QAMS_Users_DB_v1';
    const SESSION_KEY = 'QAMS_Active_Session_v1';

    // ========================================================================
    // 2. CORE STORAGE & REAL-TIME SYNC ENGINE
    // ========================================================================

    /**
     * Retrieves all registered users from LocalStorage
     * @returns {Array} Array of user profile objects
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
     * Saves user array to LocalStorage and triggers real-time UI synchronization
     * @param {Array} usersArray - Updated array of user profile objects
     */
    function saveAllUsers(usersArray) {
        try {
            const dbPayload = JSON.stringify({ users: usersArray });
            localStorage.setItem(window.AUTH_DB_KEY, dbPayload);
            
            // Trigger real-time UI synchronization across the dashboard
            syncUserDatabaseToUI(usersArray);

            // Dispatch global event so login.js and index.html can react immediately
            window.dispatchEvent(new CustomEvent('QAMS_UserListUpdated', { 
                detail: { users: usersArray, timestamp: new Date().toISOString() } 
            }));
        } catch (e) {
            console.error('Failed to save to user database:', e);
        }
    }

    /**
     * Synchronizes LocalStorage users with global dashboard variables (index.html tables)
     * @param {Array} [users] - Optional array of users (will fetch if not provided)
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
                image: u.avatar || u.image || ''
            }));
        }

        // 2. Trigger DOM table rendering functions if they exist on the page
        if (typeof window.renderUserTable === 'function') {
            try { window.renderUserTable(); } catch (err) { console.warn('renderUserTable sync error:', err); }
        }

        // 3. Trigger KPI counter updates if they exist on the page
        if (typeof window.updateUserKPIs === 'function') {
            try { window.updateUserKPIs(); } catch (err) { console.warn('updateUserKPIs sync error:', err); }
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

    /**
     * Helper: Determines if a user logged in within the last 24 hours
     */
    function isRecentLogin(isoString) {
        if (!isoString) return false;
        const diffHours = (new Date() - new Date(isoString)) / (1000 * 60 * 60);
        return diffHours < 24;
    }

    // ========================================================================
    // 3. USER PROFILE MANAGEMENT FUNCTIONS (NATIVE user.js METHODS)
    // ========================================================================

    /**
     * Get user profile by username
     */
    function getUserProfile(username) {
        if (!username) return null;
        const users = getAllUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
    }

    /**
     * Updates an existing user profile with new data fields
     */
    function updateUserProfile(username, data) {
        const users = getAllUsers();
        const idx = users.findIndex(u => u.username.toLowerCase() === (username || '').toLowerCase());
        
        if (idx === -1) {
            return { success: false, error: 'User not found' };
        }

        // Merge updated properties
        users[idx] = { ...users[idx], ...data };
        
        // Maintain schema aliases for cross-script compatibility
        if (data.avatar) users[idx].image = data.avatar;
        if (data.fullName) users[idx].fullname = data.fullName;
        if (data.department) users[idx].area = data.department;

        // Save and trigger UI sync
        saveAllUsers(users);

        // If the updated user is the currently active logged-in session, update LocalStorage session
        try {
            const activeSession = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
            if (activeSession && activeSession.username === username) {
                localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]));
            }
        } catch (e) {}

        return { success: true, user: users[idx] };
    }

    /**
     * Update user avatar image (Base64 data URL)
     */
    function updateUserAvatar(username, imageDataUrl) {
        return updateUserProfile(username, { avatar: imageDataUrl, image: imageDataUrl });
    }

    /**
     * Update user general contact and departmental info
     */
    function updateUserInfo(username, { fullName, email, phone, department }) {
        return updateUserProfile(username, { 
            fullName: fullName, 
            fullname: fullName,
            email: email, 
            phone: phone, 
            department: department,
            area: department 
        });
    }

    /**
     * Delete user account from system
     */
    function deleteUserAccount(username) {
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.username.toLowerCase() === (username || '').toLowerCase());
        
        if (userIndex === -1) {
            return { success: false, error: 'User not found' };
        }
        
        // Prevent deleting the last system administrator
        const admins = users.filter(u => u.role === 'admin' || u.qaRole === 'System Admin');
        if ((users[userIndex].role === 'admin' || users[userIndex].qaRole === 'System Admin') && admins.length === 1) {
            return { success: false, error: 'Cannot delete the last remaining System Administrator' };
        }
        
        const removed = users.splice(userIndex, 1)[0];
        
        // Save database & automatically refresh all tables
        saveAllUsers(users);

        return { success: true, removedUser: removed };
    }

    /**
     * Toggle user role between Admin and Member
     */
    function toggleUserRole(username) {
        const user = getUserProfile(username);
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        
        const newRole = user.role === 'admin' ? 'member' : 'admin';
        const newQaRole = newRole === 'admin' ? 'System Admin' : 'Lead QA Inspector';
        
        return updateUserProfile(username, { role: newRole, qaRole: newQaRole });
    }

    /**
     * Get user statistics and activity metrics
     */
    function getUserStats(username) {
        const user = getUserProfile(username);
        if (!user) return null;
        
        // Calculate dynamic completion stats based on user join date
        const daysSinceJoin = Math.max(1, Math.floor((new Date() - new Date(user.joinDate || Date.now())) / (1000 * 60 * 60 * 24)));
        const totalActivities = daysSinceJoin * 3;
        const completedActivities = Math.floor(totalActivities * 0.88);
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

    /**
     * Search users by name, username, email, or residential address
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
     * Get users by assigned department / area
     */
    function getUsersByDepartment(department) {
        const users = getAllUsers();
        if (!department || department === 'All MS Section Areas') return users;
        return users.filter(u => u.department === department || u.area === department);
    }

    /**
     * Get all administrators
     */
    function getAllAdmins() {
        const users = getAllUsers();
        return users.filter(u => u.role === 'admin' || u.qaRole === 'System Admin' || u.username === 'admin');
    }

    /**
     * Get total count of registered users
     */
    function getUserCount() {
        return getAllUsers().length;
    }

    /**
     * Format user display name with department
     */
    function formatUserDisplayName(user) {
        if (!user) return 'Unknown Inspector';
        const name = user.fullName || user.fullname || user.username;
        const dept = user.department || user.area || 'MS Section';
        return `${name} (${dept})`;
    }

    /**
     * Get 2-letter uppercase user initials for avatars
     */
    function getUserInitials(fullName) {
        if (!fullName) return 'QA';
        const parts = fullName.trim().split(' ').filter(p => p.length > 0);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return fullName.slice(0, 2).toUpperCase();
    }

    // ========================================================================
    // 4. CROSS-SCRIPT & CROSS-TAB EVENT LISTENERS
    // ========================================================================

    /**
     * Listen for storage changes across browser tabs.
     * If Admin adds/deletes a user in Tab A, Tab B automatically refreshes!
     */
    window.addEventListener('storage', function (e) {
        if (e.key === window.AUTH_DB_KEY) {
            console.log('🔄 [user.js] Detected cross-tab user database modification. Syncing UI...');
            syncUserDatabaseToUI();
        }
    });

    /**
     * Listen for internal custom updates (e.g., triggered by login.js registration)
     */
    window.addEventListener('QAMS_UserListUpdated', function (e) {
        console.log('⚡ [user.js] Real-time registration/update intercepted! Synchronizing dashboard components...');
        if (e.detail && e.detail.users) {
            syncUserDatabaseToUI(e.detail.users);
        } else {
            syncUserDatabaseToUI();
        }
    });

    // Initial sync upon page load
    document.addEventListener('DOMContentLoaded', function () {
        syncUserDatabaseToUI();
        console.log('%c👥 QA MS Section User Management Engine (user.js) Active & Linked', 'background: #0284c7; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
    });

    // ========================================================================
    // 5. EXPOSE PUBLIC API TO GLOBAL WINDOW SCOPE
    // ========================================================================
    window.getAllUsers = getAllUsers;
    window.saveAllUsers = saveAllUsers;
    window.syncUserDatabaseToUI = syncUserDatabaseToUI;
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

})();