/* 
   filename: extension.js 
   Project: QualityGroup Auth System
*/

// 1. Initialize Supabase
const supabaseUrl = 'https://pblvclvsfznsojjzfuxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBibHZjbHZzZnpuc29qanpmdXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNDY5MTAsImV4cCI6MjA4NjYyMjkxMH0.yQzcLAJNCpZatTd3nTOpzduhzaS2Y-EuRqnYlFdc2Yo';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. Helper: Notification Toast (Using SweetAlert2 mixed with custom styles if available, defaulting to standard)
const showToast = (icon, title, text) => {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        background: '#1e293b', // Slate 800
        color: '#f1f5f9',      // Slate 100
        confirmButtonColor: '#eab308', // Gold 500
        backdrop: `rgba(15, 23, 42, 0.8)`
    });
};

// 3. Register Function
async function handleRegister(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('reg-fullname').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPass = document.getElementById('reg-confirm').value;
    const btn = document.getElementById('btn-register');

    if (password !== confirmPass) {
        showToast('error', 'Password Error', 'Passwords do not match.');
        return;
    }

    // Loading State
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) throw error;

        showToast('success', 'Registration Successful', 'Please check your email to verify your account, or login if verification is disabled.');
        
        // Optional: Auto redirect to login after a delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        showToast('error', 'Registration Failed', error.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// 4. Login Function
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login');

    // Loading State
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    btn.disabled = true;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        // Success
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
            // Redirect to the dashboard file mentioned in your index.html
            window.location.href = 'Qualitymanagement.html'; 
        }, 1500);

    } catch (error) {
        showToast('error', 'Access Denied', error.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// 5. Logout Function (Attach this to your Dashboard Logout Button)
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = 'login.html';
    }
}

// 6. Session Checker (Place this at the top of Qualitymanagement.html script)
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        // If not logged in, redirect to login
        window.location.href = 'login.html';
    } else {
        console.log("User Active:", session.user.email);
    }
}
