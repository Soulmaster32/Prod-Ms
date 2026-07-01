// auth.js - Authentication Functions

const AUTH_DB_KEY = 'qg_users_db';
const AUTH_SESSION_KEY = 'qg_current_user';

// Initialize database with sample user
function initializeAuthDB() {
    const existingDB = localStorage.getItem(AUTH_DB_KEY);
    if (!existingDB) {
        const initialDB = {
            users: [
                {
                    id: 'user_001',
                    username: 'admin',
                    password: 'admin123', // Demo only
                    fullName: 'Administrator',
                    email: 'admin@qualitygroup.com',
                    phone: '09001234567',
                    department: 'Quality Assurance',
                    role: 'admin',
                    avatar: 'https://via.placeholder.com/96?text=Admin',
                    joinDate: new Date().toISOString().split('T')[0],
                    createdAt: new Date().toISOString()
                }
            ]
        };
        localStorage.setItem(AUTH_DB_KEY, JSON.stringify(initialDB));
    }
}

// Get all users
function getAllUsers() {
    const db = JSON.parse(localStorage.getItem(AUTH_DB_KEY) || '{"users":[]}');
    return db.users || [];
}

// Login user
function loginUser(username, password) {
    const users = getAllUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
            ...user,
            loginTime: new Date().toISOString()
        }));
        return { success: true, user };
    }
    return { success: false, error: 'Invalid username or password' };
}

// Register new user
function registerUser(formData) {
    const users = getAllUsers();
    
    // Check if username exists
    if (users.find(u => u.username === formData.username)) {
        return { success: false, error: 'Username already exists' };
    }
    
    // Check required fields
    if (!formData.fullName || !formData.username || !formData.password) {
        return { success: false, error: 'Please fill in all required fields' };
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email || '',
        phone: formData.phone || '',
        department: formData.department || 'Other',
        role: users.length === 0 ? 'admin' : 'member', // First user is admin
        avatar: formData.avatar || generateDefaultAvatar(formData.fullName),
        joinDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    const db = { users };
    localStorage.setItem(AUTH_DB_KEY, JSON.stringify(db));
    
    // Auto-login after signup
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({
        ...newUser,
        loginTime: new Date().toISOString()
    }));
    
    return { success: true, user: newUser };
}

// Get current user
function getCurrentUser() {
    const sessionData = localStorage.getItem(AUTH_SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
}

// Logout user
function logoutUser() {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return { success: true };
}

// Update user profile
function updateUserProfile(username, updates) {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
        return { success: false, error: 'User not found' };
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    const db = { users };
    localStorage.setItem(AUTH_DB_KEY, JSON.stringify(db));
    
    // Update session if current user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.username === username) {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(users[userIndex]));
    }
    
    return { success: true, user: users[userIndex] };
}

// Generate initials avatar
function generateDefaultAvatar(name) {
    const initials = (name || '??').split(' ').map(n => n[0]).join('').toUpperCase();
    const colors = ['#E8A33D', '#39D6A0', '#4FA3E3', '#F2604A'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const canvas = document.createElement('canvas');
    canvas.width = 96;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 96, 96);
    ctx.fillStyle = '#EAEFF8';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 48, 48);
    
    return canvas.toDataURL();
}

// Initialize on load
initializeAuthDB();