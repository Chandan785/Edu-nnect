// DOM Elements
const darkToggle = document.getElementById('darkToggle');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set initial role fields visibility
  toggleRoleFields();
  
  // Initialize dark mode
  initDarkMode();
  
  // Set up event listeners
  setupEventListeners();
});

// Set up all event listeners
function setupEventListeners() {
  // Dark mode toggle
  if (darkToggle) {
    darkToggle.addEventListener('change', toggleDarkMode);
  }
  
  // Form submissions
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Role radio buttons
  const roleRadios = document.querySelectorAll('input[name="userType"]');
  roleRadios.forEach(radio => {
    radio.addEventListener('change', toggleRoleFields);
  });
}

/* ========== ROLE FIELD TOGGLING ========== */
function toggleRoleFields() {
  const userType = document.querySelector('input[name="userType"]:checked').value;
  
  // Get all role-specific field containers
  const rollnoField = document.getElementById('rollnoField');
  const yearField = document.getElementById('yearField');
  const departmentField = document.getElementById('departmentField');
  const adminFields = document.getElementById('adminFields');
  
  // Reset all fields first
  rollnoField.classList.add('hidden');
  yearField.classList.add('hidden');
  departmentField.classList.add('hidden');
  adminFields.classList.add('hidden');
  
  // Show fields based on selected role
  switch(userType) {
    case 'student':
      rollnoField.classList.remove('hidden');
      yearField.classList.remove('hidden');
      departmentField.classList.remove('hidden');
      break;
    case 'teacher':
      yearField.classList.remove('hidden');
      departmentField.classList.remove('hidden');
      break;
    case 'admin':
      adminFields.classList.remove('hidden');
      break;
  }
}

/* ========== PASSWORD HANDLING ========== */
function togglePassword(fieldId) {
  const passwordField = document.getElementById(fieldId);
  if (!passwordField) return;
  
  const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordField.setAttribute('type', type);
}

function validatePassword() {
  const password = document.getElementById('signupPassword')?.value;
  const confirmPassword = document.getElementById('confirmPassword')?.value;
  
  if (!password || password.length < 6) {
    alert('Password must be at least 6 characters long!');
    return false;
  }
  
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return false;
  }
  
  return true;
}

/* ========== FORM TOGGLING ========== */
function toggleForm(formType) {
  const loginForm = document.getElementById('login');
  const signupForm = document.getElementById('signup');
  
  if (formType === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  } else {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  }
}

/* ========== DARK MODE HANDLING ========== */
function initDarkMode() {
  const darkMode = localStorage.getItem('darkMode') === 'true' || 
                  (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (darkToggle) {
    darkToggle.checked = darkMode;
    document.documentElement.classList.toggle('dark', darkMode);
  }
}

function toggleDarkMode() {
  const isDark = this.checked;
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('darkMode', isDark);
}

/* ========== FORM SUBMISSIONS ========== */
async function handleSignup(e) {
  e.preventDefault();
  
  if (!validatePassword()) return;
  
  const form = e.target;
  const formData = new FormData(form);
  const userType = form.querySelector('input[name="userType"]:checked').value;
  
  // Prepare data based on role
  const userData = {
    username: formData.get('Username'),
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('FullName'),
    avatar: formData.get('avatar'),
    userType: userType
  };
  
  // Role-specific data
  switch(userType) {
    case 'student':
      userData.rollno = formData.get('rollno');
      userData.year = formData.get('year');
      userData.department = formData.get('department');
      break;
    case 'teacher':
      userData.year = formData.get('year');
      userData.department = formData.get('department');
      break;
    case 'admin':
      userData.role = 'admin';
      break;
  }
  
  try {
    // In a real application, you would send this to your backend
    console.log('Submitting signup form with data:', userData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    alert('Registration successful! (Simulated)');
    
    // For demo purposes, switch to login form
    toggleForm('login');
    
    // In a real app, you would redirect or handle the response
    // window.location.href = '/dashboard.html';
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during registration');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const userType = form.querySelector('input[name="userType"]:checked').value;
  
  const credentials = {
    email: formData.get('email'),
    password: formData.get('password'),
    userType: userType
  };
  
  try {
    // In a real application, you would send this to your backend
    console.log('Submitting login form with credentials:', credentials);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    alert('Login successful! (Simulated)');
    
    // In a real app, you would redirect to the dashboard
    // window.location.href = `/${userType}/dashboard`;
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during login');
  }
}