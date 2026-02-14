/* 
   filename: js/imp.js 
   Project: QualityGroup Auth System
*/

// --- 1. CONFIGURATION ---
// DOUBLE CHECK THESE IN YOUR SUPABASE DASHBOARD -> SETTINGS -> API
const SUPABASE_URL = 'https://pblvclvsfznsojjzfuxx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBibHZjbHZzZnpuc29qanpmdXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNDY5MTAsImV4cCI6MjA4NjYyMjkxMH0.yQzcLAJNCpZatTd3nTOpzduhzaS2Y-EuRqnYlFdc2Yo';

// --- 2. INITIALIZATION ---
let supabaseClient;

try {
    if (typeof supabase === 'undefined') {
        throw new Error('Supabase SDK not loaded. Check script tags in HTML.');
    }
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase Client Initialized");
} catch (err) {
    console.error(err);
    alert("System Error: " + err.message);
}

// --- 3. REGISTER FUNCTION (Attached to Window) ---
window.handleRegister = async function(event) {
    event.preventDefault();
    console.log("Processing Registration...");

    const fullName = document.getElementById('reg-fullname').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPass = document.getElementById('reg-confirm').value;
    const btn = document.getElementById('btn-register');

    // Validation
    if (password !== confirmPass) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords do not match', background: '#1e293b', color: '#fff' });
        return;
    }

    // UI Loading
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    btn.disabled = true;

    try {
        // Submit to Supabase
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName, // This saves to 'raw_user_meta_data'
                },
            },
        });

        if (error) throw error;

        console.log("Success:", data);

        // Check if session exists (Auto-confirm vs Email Confirm)
        if (data.user && !data.session) {
            Swal.fire({
                icon: 'info',
                title: 'Check Your Email',
                text: 'Registration successful! Please click the link sent to your email to verify account.',
                background: '#1e293b', color: '#fff'
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Welcome!',
                text: 'Account created successfully.',
                background: '#1e293b', color: '#fff'
            }).then(() => {
                window.location.href = 'index.html'; // Redirect to Dashboard
            });
        }

    } catch (error) {
        console.error("Supabase Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.message,
            background: '#1e293b', color: '#fff'
        });
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

// --- 4. LOGIN FUNCTION (Attached to Window) ---
window.handleLogin = async function(event) {
    event.preventDefault();
    console.log("Processing Login...");

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login');

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    btn.disabled = true;

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        // Success
        const Toast = Swal.mixin({
            toast: true, position: 'top-end', showConfirmButton: false, timer: 2000,
            background: '#eab308', color: '#0f172a'
        });
        Toast.fire({ icon: 'success', title: 'Signed in successfully' });

        setTimeout(() => {
            // Redirect to your Dashboard file (check the filename carefully)
            window.location.href = 'html/Qualitymanagement.html'; 
        }, 1500);

    } catch (error) {
        console.error("Login Error:", error);
        Swal.fire({
            icon: 'error', 
            title: 'Access Denied', 
            text: error.message || "Invalid credentials",
            background: '#1e293b', color: '#fff'
        });
    } finally {
        btn.innerHTML = "Sign In <i class='fas fa-arrow-right ml-2'></i>";
        btn.disabled = false;
    }
};

// --- 5. LOGOUT FUNCTION ---
window.handleLogout = async function() {
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
};
