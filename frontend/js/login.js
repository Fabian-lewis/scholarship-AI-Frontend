
// Handle regular email login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const loginBtn = document.getElementById('loginBtn');

    if (!email) {
        alert('Please enter your email address');
        return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // check if email is exists in database
    const registeredEmail = localStorage.getItem('userEmail');
    if (registeredEmail && registeredEmail === email) {
        alert('Email is already registered');
        return;
    }

    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="loading"></span> Logging in...';

    // Simulate login process
    setTimeout(() => {
        console.log('Login attempt with email:', email);
        
        // Store email in localStorage for demo purposes
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to dashboard
        window.location.href = 'dashboard_lov.html';
    }, 1500);
});

// Handle Google Sign-In
document.getElementById('googleSignInBtn').addEventListener('click', function() {
    console.log('Google Sign-In clicked');

    // Note: In a real implementation, you would integrate with Google Sign-In API
    // For now, we'll simulate the process
    this.innerHTML = '<span class="loading"></span> Signing in with Google...';
    this.disabled = true;

    setTimeout(() => {
        // Simulate successful Google login
        localStorage.setItem('userEmail', 'user@gmail.com');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('authMethod', 'google');
        
        console.log('Google Sign-In successful (simulated)');
        window.location.href = 'dashboard_lov.html';
    }, 2000);
});

// Logout user if user is already logged in
if (localStorage.getItem('isLoggedIn') === 'true') {
    localStorage.removeItem('isLoggedIn'); // Remove login status
    localStorage.removeItem('userEmail'); // Remove user email
    localStorage.removeItem('authMethod'); // this line ensures we clear the auth method as well


    // console.log('User already logged in, redirecting to dashboard');
    // window.location.href = 'dashboard_lov.html';
}
