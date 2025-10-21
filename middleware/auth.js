const { authenticateUser } = require('../services/airtableService');

// Middleware to require authentication
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    req.flash('error', 'Please log in to access this page');
    res.redirect('/auth/login');
  }
};

// Middleware to redirect authenticated users
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return res.redirect('/payment/create');
  }
  next();
};

module.exports = {
  requireAuth,
  redirectIfAuthenticated
};
