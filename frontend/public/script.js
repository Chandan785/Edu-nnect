// Initialize Tailwind dark mode
 
 

 
// DOM Elements
const darkToggle = document.getElementById('darkToggle');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Set up dark mode
  setupDarkMode();
  
  // Set up form toggles
  toggleSemester();
  
  // Set up event listeners
  setupEventListeners();
});

/* ========== DARK MODE FUNCTIONALITY ========== */
function setupDarkMode() {
  // Check for saved preference or system preference
  const isDark = localStorage.getItem('darkMode') === 'true' || 
                (!localStorage.getItem('darkMode') && 
                 window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Apply initial mode
  setDarkMode(isDark);
  
  // Set up toggle listener
  if (darkToggle) {
    darkToggle.checked = isDark;
    darkToggle.addEventListener('change', () => {
      setDarkMode(darkToggle.checked);
    });
  }
}

function setDarkMode(enabled) {
  if (enabled) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
}

/* ========== FORM TOGGLES ========== */
function toggleSemester() {
  const selectedUser = document.querySelector('#signup input[name="userType"]:checked');
  const semesterField = document.getElementById('semesterField');
  if (semesterField) {
    semesterField.style.display = selectedUser && selectedUser.value === 'student' ? 'block' : 'none';
  }
}

function toggleForm(formType) {
  const signup = document.getElementById('signup');
  const login = document.getElementById('login');
  
  if (formType === 'signup') {
    signup?.classList.remove('hidden');
    login?.classList.add('hidden');
  } else {
    signup?.classList.add('hidden');
    login?.classList.remove('hidden');
  }
}

/* ========== PASSWORD VISIBILITY ========== */
function togglePassword(id) {
  const input = document.getElementById(id);
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

/* ========== FORM HANDLERS ========== */
async function handleSignup(event) {
  event.preventDefault();
  const form = event.target;
  
  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value.trim(),
    confirmPassword: form.confirmPassword.value.trim(),
    userType: form.userType.value,
    semester: form.currentSemester?.value || null,
  };

  if (data.password !== data.confirmPassword) {
    return alert("Passwords do not match");
  }

  try {
    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    alert(json.message);
    if (json.redirect) window.location.href = json.redirect;
  } catch (err) {
    console.error(err);
    alert("Error signing up.");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  
  const data = {
    email: form.email.value.trim(),
    password: form.password.value.trim(),
    userType: form.userType.value
  };

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    alert(json.message);
    if (json.redirect) window.location.href = json.redirect;
  } catch (err) {
    console.error(err);
    alert("Error logging in.");
  }
}

/* ========== EVENT LISTENER SETUP ========== */
function setupEventListeners() {
  // User type radio buttons
  document.querySelectorAll('#signup input[name="userType"]').forEach(radio => {
    radio.addEventListener('change', toggleSemester);
  });
  
  // Form submissions
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Dark mode toggle
  if (darkToggle) {
    darkToggle.addEventListener('change', () => {
      setDarkMode(darkToggle.checked);
    });
  }
}