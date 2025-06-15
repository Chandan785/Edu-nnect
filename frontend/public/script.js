 
  tailwind.config = {
    darkMode: 'class',
  }
 
    function toggleSemester() {
      const selectedUser = document.querySelector('#signup input[name="userType"]:checked');
      const semesterField = document.getElementById('semesterField');
      semesterField.style.display = selectedUser && selectedUser.value === 'student' ? 'block' : 'none';
    }

    function toggleForm(formType) {
      const signup = document.getElementById('signup');
      const login = document.getElementById('login');
      if (formType === 'signup') {
        signup.classList.remove('hidden');
        login.classList.add('hidden');
      } else {
        signup.classList.add('hidden');
        login.classList.remove('hidden');
      }
    }

    function setupDarkModeToggle() {
      const toggle = document.getElementById('darkToggle');
      
      // Check for saved user preference or system preference
      if (localStorage.getItem('darkMode') === 'true' || 
          (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        toggle.checked = true;
      } else {
        document.documentElement.classList.remove('dark');
        toggle.checked = false;
      }

      toggle.addEventListener('change', () => {
        if (toggle.checked) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('darkMode', 'true');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('darkMode', 'false');
        }
      });
    }

    function togglePassword(id) {
      const input = document.getElementById(id);
      if (input) input.type = input.type === 'password' ? 'text' : 'password';
    }

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

      if (data.password !== data.confirmPassword) return alert("Passwords do not match");

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

    window.onload = function () {
      toggleSemester();
      setupDarkModeToggle();
      document.querySelectorAll('#signup input[name="userType"]').forEach(radio =>
        radio.addEventListener('change', toggleSemester)
      );
      document.getElementById('signupForm').addEventListener('submit', handleSignup);
      document.getElementById('loginForm').addEventListener('submit', handleLogin);
    };


   