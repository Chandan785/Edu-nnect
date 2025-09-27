// formhandler.js

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

/**
 * Handles the signup form submission.
 */
async function handleSignup(event) {
    event.preventDefault(); // Prevent default form submission
    
    const form = event.target;
    const formData = new FormData(form);
    const userType = formData.get('userType');
    
    // 1. Determine the correct API endpoint based on user type
    let apiUrl = '';
    switch (userType) {
        case 'student':
            apiUrl = 'http://localhost:3000/api/v1/users/ragister';
            break;
        case 'teacher':
            apiUrl = 'http://localhost:3000/api/v1/teachers/ragister';
            break;
        case 'admin':
            apiUrl = 'http://localhost:3000/api/v1/admins/ragister';
            break;
        default:
            alert('Please select a user type.');
            return;
    }

    // 2. Simple password confirmation check
    if (formData.get('password') !== formData.get('confirmPassword')) {
        alert("Passwords do not match!");
        return;
    }
    
    try {
        // 3. Make the API call using axios
        const response = await axios.post(apiUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('Signup success:', response.data);
        alert('Registration successful! Please log in.');
        window.location.reload(); // Reload to switch to the login form or clear fields

    } catch (error) {
        console.error('Signup error:', error.response ? error.response.data : error.message);
        alert(`Registration failed: ${error.response?.data?.message || 'Please check your details and try again.'}`);
    }
}

/**
 * Handles the login form submission.
 */
async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const userType = formData.get('userType');
    
    // Extract data into a plain object for JSON submission
    const loginData = {
        email: formData.get('email'),
        Username: formData.get('email'), // Backend accepts either email or username
        password: formData.get('password')
    };
    
    // 1. Determine API endpoint and redirect path
    let apiUrl = '';
    let redirectUrl = '';
    switch (userType) {
        case 'student':
            apiUrl = 'http://localhost:3000/api/v1/users/login';
            redirectUrl = 'student-dashboard.html';
            break;
        case 'teacher':
            apiUrl = 'http://localhost:3000/api/v1/teachers/login';
            redirectUrl = 'teacher-dashboard.html';
            break;
        case 'admin':
            apiUrl = 'http://localhost:3000/api/v1/admins/login';
            redirectUrl = 'admin-dashboard.html';
            break;
        default:
            alert('Please select a user type.');
            return;
    }

    try {
        // 2. Make the API call
        const response = await axios.post(apiUrl, loginData, {
            withCredentials: true // Crucial for sending/receiving cookies
        });

        console.log('Login success:', response.data);
        const { user, accessToken } = response.data.data;

        // 3. Store user info and token for use in the dashboard
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);

        // 4. Redirect to the appropriate dashboard
        window.location.href = redirectUrl;

    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message);
        alert(`Login failed: ${error.response?.data?.message || 'Invalid credentials.'}`);
    }
}

/**
 * Toggles visibility of role-specific fields in the signup form.
 * This function is called by the onchange event in your HTML.
 */
function toggleRoleFields() {
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
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
toggleRoleFields();