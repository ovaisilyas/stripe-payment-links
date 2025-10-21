const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateUser } = require('../services/airtableService');
const { redirectIfAuthenticated } = require('../middleware/auth');

const router = express.Router();

// Login page
router.get('/login', redirectIfAuthenticated, (req, res) => {
  res.render('auth/login', {
    title: 'Sign In',
    errors: req.flash('error')
  });
});

// Login form submission
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('auth/login', {
        title: 'Sign In',
        errors: errors.array().map(err => err.msg),
        email: req.body.email
      });
    }

    const { email, password } = req.body;

    // Authenticate user
    const user = await authenticateUser(email, password);

    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.render('auth/login', {
        title: 'Sign In',
        errors: ['Invalid email or password'],
        email: req.body.email
      });
    }

    // Set session
    req.session.user = user;
    req.flash('success', 'Welcome back!');
    res.redirect('/payment/create');

  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'Login failed. Please try again.');
    res.render('auth/login', {
      title: 'Sign In',
      errors: ['Login failed. Please try again.'],
      email: req.body.email
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
});

// Logout GET route for convenience
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
