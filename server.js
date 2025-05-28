const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
require('dotenv').config();

// Import models
const Admin = require('./model/admin.model');
const Teacher = require('./model/teacher.model');
const Student = require('./model/student.model');

// MongoDB connection
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/your-db-name';
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const SALT_ROUNDS = 10;

// Middleware to protect routes
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, userType, semester, department, roleTitle } = req.body;

    if (!name || !email || !password || !confirmPassword || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    let existingUser;
    if (userType === 'student') {
      if (!semester) return res.status(400).json({ message: 'Semester is required for students' });
      existingUser = await Student.findOne({ email });
    } else if (userType === 'teacher') {
      if (!department) return res.status(400).json({ message: 'Department is required for teachers' });
      existingUser = await Teacher.findOne({ email });
    } else if (userType === 'admin') {
      if (!roleTitle) return res.status(400).json({ message: 'Role Title is required for admins' });
      existingUser = await Admin.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    let newUser;

    if (userType === 'student') {
      newUser = new Student({ name, email, password: hashedPassword, semester });
    } else if (userType === 'teacher') {
      newUser = new Teacher({ name, email, password: hashedPassword, department });
    } else if (userType === 'admin') {
      newUser = new Admin({ name, email, password: hashedPassword, roleTitle });
    }

    await newUser.save();

    req.session.user = {
      id: newUser._id,
      email: newUser.email,
      userType
    };

    const redirect = userType === 'student' ? '/student-dashboard.html'
                    : userType === 'teacher' ? '/teacher-dashboard.html'
                    : '/admin-dashboard.html';

    res.json({
      message: 'Signup successful',
      redirect,
      user: {
        name: newUser.name,
        email: newUser.email,
        userType
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let user;
    if (userType === 'student') {
      user = await Student.findOne({ email });
    } else if (userType === 'teacher') {
      user = await Teacher.findOne({ email });
    } else if (userType === 'admin') {
      user = await Admin.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      userType
    };

    const redirect = userType === 'student' ? '/student-dashboard.html'
                    : userType === 'teacher' ? '/teacher-dashboard.html'
                    : '/admin-dashboard.html';

    res.json({
      message: 'Login successful',
      redirect,
      user: {
        name: user.name,
        email: user.email,
        userType
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected API route
app.get('/api/user', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Could not log out' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
