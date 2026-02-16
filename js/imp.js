/* filename: js/imp.js */

// --- 1. CONFIGURATION ---
const SUPABASE_URL = 'https://pblvclvsfznsojjzfuxx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBibHZjbHZzZnpuc29qanpmdXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNDY5MTAsImV4cCI6MjA4NjYyMjkxMH0.yQzcLAJNCpZatTd3nTOpzduhzaS2Y-EuRqnYlFdc2Yo';

// --- 2. INITIALIZATION ---
window.supabaseClient = null;

try {
    if (typeof supabase === 'undefined') {
        console.error('Supabase SDK not loaded.');
    } else {
        window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("Supabase Client Initialized Successfully");
    }
} catch (err) {
    console.error("Init Error:", err);
}

// --- 3. REGISTER FUNCTION ---
window.handleRegister = async function(event) {
    if (event) event.preventDefault();
    
    const btn = document.getElementById('btn-register');
    const originalText = btn.innerHTML;

    // Get form values
    const fullName = document.getElementById('reg-fullname').value;
    const role = document.getElementById('reg-role').value;
    const category = document.getElementById('reg-category').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const fileInput = document.getElementById('reg-photo');

    // UI Loading State
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    try {
        let publicImageUrl = null;

        // 1. Handle Image Upload
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await window.supabaseClient.storage
                .from('team-photos') 
                .upload(filePath, file);

            if (!uploadError) {
                const { data: urlData } = window.supabaseClient.storage
                    .from('team-photos')
                    .getPublicUrl(filePath);
                publicImageUrl = urlData.publicUrl;
            }
        }

        // 2. Auth SignUp
        const { data: authData, error: authError } = await window.supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: { data: { full_name: fullName } }
        });

        if (authError) throw authError;

        // 3. Database Insert
        const { error: dbError } = await window.supabaseClient
            .from('team_members')
            .insert([{ 
                full_name: fullName, 
                role: role, 
                category: category, 
                email: email,
                image_url: publicImageUrl || 'https://via.placeholder.com/150?text=No+Img'
            }]);

        if (dbError) throw dbError;

        // Success
        Swal.fire({
            icon: 'success',
            title: 'Welcome Aboard!',
            text: 'Account created successfully.',
            background: '#002855',
            color: '#fff',
            confirmButtonColor: '#eab308'
        }).then(() => {
            // UPDATED PATH: Go into the html folder
            window.location.href = 'html/Qualitymanagement.html'; 
        });

    } catch (error) {
        console.error("Registration Error:", error);
        Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.message,
            background: '#002855',
            color: '#fff'
        });
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

// --- 4. LOGIN FUNCTION ---
window.handleLogin = async function(event) {
    if (event) event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-login');

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    btn.disabled = true;

    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        const Toast = Swal.mixin({
            toast: true, position: 'top-end', showConfirmButton: false, timer: 2000,
            background: '#eab308', color: '#0f172a'
        });
        Toast.fire({ icon: 'success', title: 'Signed in successfully' });

        setTimeout(() => {
            // UPDATED PATH: Go into the html folder
            window.location.href = 'html/Qualitymanagement.html'; 
        }, 1500);

    } catch (error) {
        Swal.fire({ 
            icon: 'error', 
            title: 'Access Denied', 
            text: error.message, 
            background: '#002855', 
            color: '#fff' 
        });
    } finally {
        btn.innerHTML = "Sign In <i class='fas fa-arrow-right ml-2'></i>";
        btn.disabled = false;
    }
};

// --- 5. LOGOUT FUNCTION ---
// Added this so the dashboard logout button works
window.handleLogout = async function() {
    try {
        const { error } = await window.supabaseClient.auth.signOut();
        if (error) throw error;
        
        // Since we are inside 'html/Qualitymanagement.html', we need to go UP (../) to get to login.html
        window.location.href = '../login.html'; 
    } catch (error) {
        console.error('Logout Error:', error);
        window.location.href = '../login.html'; // Force redirect anyway
    }
};
