document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// --- Loader SVG Icon ---
const loaderIcon = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

/**
 * Handles the signup form submission.
 */
async function handleSignup(event) {
    event.preventDefault();
    const form = event.target;
    const button = form.querySelector('button[type="submit"]');
    const originalButtonText = button.innerHTML;

    // --- Show loader ---
    button.disabled = true;
    button.innerHTML = `${loaderIcon} <span>Signing up...</span>`;

    const formData = new FormData(form);
    const userType = formData.get('userType');
    
    let apiUrl = '';
    switch (userType) {
        case 'student': apiUrl = 'http://localhost:3000/api/v1/users/ragister'; break;
        case 'teacher': apiUrl = 'http://localhost:3000/api/v1/teachers/ragister'; break;
        case 'admin': apiUrl = 'http://localhost:3000/api/v1/admins/ragister'; break;
        default:
            alert('Please select a user type.');
            button.disabled = false;
            button.innerHTML = originalButtonText;
            return;
    }

    if (formData.get('password') !== formData.get('confirmPassword')) {
        alert("Passwords do not match!");
        // --- Hide loader on error ---
        button.disabled = false;
        button.innerHTML = originalButtonText;
        return;
    }
    
    try {
        await axios.post(apiUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Registration successful! Please log in.');
        window.location.reload();
    } catch (error) {
        console.error('Signup error:', error.response ? error.response.data : error.message);
        alert(`Registration failed: ${error.response?.data?.message || 'Please check your details.'}`);
    } finally {
        // --- Hide loader after completion ---
        button.disabled = false;
        button.innerHTML = originalButtonText;
    }
}

/**
 * Handles the login form submission.
 */
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const button = form.querySelector('button[type="submit"]');
    const originalButtonText = button.innerHTML;

    // --- Show loader ---
    button.disabled = true;
    button.innerHTML = `${loaderIcon} <span>Logging in...</span>`;

    const formData = new FormData(form);
    const userType = formData.get('userType');
    
    const loginData = {
        email: formData.get('email'),
        Username: formData.get('email'),
        password: formData.get('password')
    };
    
    let apiUrl = '';
    let redirectUrl = '';
    switch (userType) {
        case 'student': apiUrl = 'http://localhost:3000/api/v1/users/login'; redirectUrl = 'student-dashboard.html'; break;
        case 'teacher': apiUrl = 'http://localhost:3000/api/v1/teachers/login'; redirectUrl = 'teacher-dashboard.html'; break;
        case 'admin': apiUrl = 'http://localhost:3000/api/v1/admins/login'; redirectUrl = 'admin-dashboard.html'; break;
        default:
            alert('Please select a user type.');
            button.disabled = false;
            button.innerHTML = originalButtonText;
            return;
    }

    try {
        const response = await axios.post(apiUrl, loginData);
        const { user, accessToken } = response.data.data;

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userType', userType);

        window.location.href = redirectUrl;
    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        alert(`Login failed: ${error.response?.data?.message || 'Invalid credentials.'}`);
        // --- Hide loader after error ---
        button.disabled = false;
        button.innerHTML = originalButtonText;
    }
}

/**
 * Toggles visibility of role-specific fields in the signup form.
 */
function toggleRoleFields() {
    const userTypeInput = document.querySelector('input[name="userType"]:checked');
    if (!userTypeInput) return;
    
    const userType = userTypeInput.value;
    
    document.getElementById('rollnoField').style.display = 'none';
    document.getElementById('yearField').style.display = 'none';
    document.getElementById('departmentField').style.display = 'none';
    document.getElementById('adminFields').style.display = 'none';

    if (userType === 'student') {
        document.getElementById('rollnoField').style.display = 'block';
        document.getElementById('yearField').style.display = 'block';
        document.getElementById('departmentField').style.display = 'block';
    } else if (userType === 'teacher') {
        document.getElementById('yearField').style.display = 'block';
        document.getElementById('departmentField').style.display = 'block';
    } else if (userType === 'admin') {
        document.getElementById('adminFields').style.display = 'block';
    }
}

// Initialize fields on page load
if (document.getElementById('signupForm')) {
    toggleRoleFields();
}