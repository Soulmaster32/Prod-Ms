// user.js - User Profile Management Functions

// Get user profile by username
function getUserProfile(username) {
    const users = getAllUsers();
    return users.find(u => u.username === username) || null;
}

// Update user avatar
function updateUserAvatar(username, imageDataUrl) {
    return updateUserProfile(username, { avatar: imageDataUrl });
}

// Update user info
function updateUserInfo(username, { fullName, email, phone, department }) {
    return updateUserProfile(username, { fullName, email, phone, department });
}

// Delete user account
function deleteUserAccount(username) {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
        return { success: false, error: 'User not found' };
    }
    
    // Prevent deleting the last admin
    const admins = users.filter(u => u.role === 'admin');
    if (users[userIndex].role === 'admin' && admins.length === 1) {
        return { success: false, error: 'Cannot delete the last administrator' };
    }
    
    users.splice(userIndex, 1);
    const db = { users };
    localStorage.setItem(AUTH_DB_KEY, JSON.stringify(db));
    
    return { success: true };
}

// Toggle user role (admin/member)
function toggleUserRole(username) {
    const user = getUserProfile(username);
    if (!user) {
        return { success: false, error: 'User not found' };
    }
    
    const newRole = user.role === 'admin' ? 'member' : 'admin';
    return updateUserProfile(username, { role: newRole });
}

// Get user statistics
function getUserStats(username) {
    const user = getUserProfile(username);
    if (!user) {
        return null;
    }
    
    return {
        username: user.username,
        fullName: user.fullName,
        department: user.department,
        role: user.role,
        joinDate: user.joinDate,
        totalActivities: 0,
        completedActivities: 0,
        completionRate: 0
    };
}

// Search users
function searchUsers(query) {
    const users = getAllUsers();
    const lowerQuery = query.toLowerCase();
    
    return users.filter(u => 
        u.fullName.toLowerCase().includes(lowerQuery) ||
        u.username.toLowerCase().includes(lowerQuery) ||
        u.email.toLowerCase().includes(lowerQuery)
    );
}

// Get users by department
function getUsersByDepartment(department) {
    const users = getAllUsers();
    return users.filter(u => u.department === department);
}

// Get all admins
function getAllAdmins() {
    const users = getAllUsers();
    return users.filter(u => u.role === 'admin');
}

// Get user count
function getUserCount() {
    return getAllUsers().length;
}

// Format user display name
function formatUserDisplayName(user) {
    return `${user.fullName} (${user.department})`;
}

// Get user initials for avatar
function getUserInitials(fullName) {
    return (fullName || '??').split(' ').map(n => n[0]).join('').toUpperCase();
}