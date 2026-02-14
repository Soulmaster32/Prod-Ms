/* 
   filename: extension.js 
   Project: QualityGroup Auth System
*/

// --- CONFIGURATION ---
const supabaseUrl = 'https://pblvclvsfznsojjzfuxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBibHZjbHZzZnpuc29qanpmdXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNDY5MTAsImV4cCI6MjA4NjYyMjkxMH0.yQzcLAJNCpZatTd3nTOpzduhzaS2Y-EuRqnYlFdc2Yo';

// --- INITIALIZATION (FIXED) ---
// We check if the global 'supabase' object exists from the CDN
if (typeof supabase === 'undefined') {
    console.error('Supabase SDK not loaded. Check your internet connection or HTML script tags.');
    alert('System Error: Database connection failed to load.');
}

// Create the client with a different variable name to avoid conflict
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

console.log("System Initialized");

// --- HELPER: TOAST NOTIFICATION ---
const showToast = (icon, title, text) => {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            background: '#1e293b', 
            color: '#f1f5f9',
            confirmButtonColor: '#eab308',
            backdrop: `rgba(15, 23, 42, 0.8)`
        });
    } else {
        alert(`${title}: ${text}`);
    }
};

// --- REGISTER FUNCTION ---
async function handleRegister(event) {
    event.preventDefault();
    console.log("Attempting Registration...");

    const fullNameInput = document.getElementById('reg-fullname');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');
    const confirmInput = document.getElementById('reg-confirm');
    const btn = document.getElementById('btn-register');

    if (!emailInput || !passwordInput) {
        console.error("Input fields not found");
        return;
    }

    const fullName = fullNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPass = confirmInput.value;

    if (password !== confirmPass) {
        showToast('error', 'Password Error', 'Passwords do not match.');
        return;
    }

    // Loading UI
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    try {
        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) throw error;

        console.log("Registration Result:", data);

        // Check if email confirmation is required
        if (data.user && !data.session) {
            showToast('info', 'Check Your Email', 'Registration successful! A verification link has been sent to ' + email);
        } else {
            showToast('success', 'Registration Successful', 'Account created. Redirecting...');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }

    } catch (error) {
        console.error("Supabase Error:", error);
        showToast('error', 'Registration Failed', error.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// --- LOGIN FUNCTION ---
async function handleLogin(event) {
    event.preventDefault();
    console.log("Attempting Login...");

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login');

    // Loading UI
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    btn.disabled = true;

    try {
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        console.log("Login Successful:", data);

        // Success Toast
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            background: '#eab308',
            color: '#0f172a'
        });
        
        Toast.fire({
            icon: 'success',
            title: 'Signed in successfully'
        });

        setTimeout(() => {
            window.location.href = 'index.html'; // Or 'Qualitymanagement.html'
        }, 1500);

    } catch (error) {
        console.error("Login Error:", error);
        showToast('error', 'Access Denied', error.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// --- LOGOUT FUNCTION ---
async function handleLogout() {
    await _supabase.auth.signOut();
    window.location.href = 'login.html';
}

// --- SESSION CHECKER ---
async function checkSession() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    } else {
        console.log("User Active:", session.user.email);
    }
}
