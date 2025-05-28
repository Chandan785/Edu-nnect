const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcryptjs'); // For password hashing
const session = require('express-session'); // For session management

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'your-secret-key', // Change this to a real secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// In-memory "database" (replace with real DB in production)
const users = [];

// Password hashing configuration
const SALT_ROUNDS = 10;

// Helper middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Routes
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, userType, semester } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      userType,
      semester: userType === 'student' ? semester : null
    };

    users.push(newUser);

    // Set session
    req.session.user = {
      id: newUser.id,
      email: newUser.email,
      userType: newUser.userType
    };

    // Determine redirect URL
    let redirect = '';
    if (userType === 'student') redirect = '/student-dashboard.html';
    else if (userType === 'teacher') redirect = '/teacher-dashboard.html';
    else if (userType === 'admin') redirect = '/admin-dashboard.html';

    res.json({ 
      message: 'Signup successful',
      redirect,
      user: {
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validation
    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find user
    const user = users.find(u => u.email === email && u.userType === userType);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or role' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Set session
    req.session.user = {
      id: user.id,
      email: user.email,
      userType: user.userType
    };

    // Determine redirect URL
    let redirect = '';
    if (userType === 'student') redirect = '/student-dashboard.html';
    else if (userType === 'teacher') redirect = '/teacher-dashboard.html';
    else if (userType === 'admin') redirect = '/admin-dashboard.html';

    res.json({ 
      message: 'Login successful',
      redirect,
      user: {
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected route example
app.get('/api/user', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));