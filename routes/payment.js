const express = require('express');
const { body, validationResult } = require('express-validator');
const { createPaymentLink, listPaymentLinks } = require('../services/stripeService');

const router = express.Router();

// Payment link creation page
router.get('/create', (req, res) => {
  const { name, amount, description, currency, quantity } = req.body;

  res.render('payment/create', {
    title: 'Create Payment Link',
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    errors: req.flash('error'),
    formData: req.body
  });
});

// Create payment link form submission
router.post('/create', [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name is required and must be less than 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('amount')
    .isFloat({ min: 0.5 })
    .withMessage('Amount must be at least $0.50'),
  body('currency')
    .optional()
    .isIn(['usd', 'eur', 'gbp', 'cad', 'aud'])
    .withMessage('Invalid currency'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Quantity must be between 1 and 1000')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('payment/create', {
        title: 'Create Payment Link',
        errors: errors.array().map(err => err.msg),
        formData: req.body,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      });
    }

    const {
      name,
      description,
      amount,
      currency = 'usd',
      quantity = 1
    } = req.body;

    // Create payment link
    const paymentLink = await createPaymentLink({
      name,
      description,
      amount: parseFloat(amount),
      currency,
      quantity: parseInt(quantity),
      userId: req.session.user.id,
      metadata: {
        created_by: req.session.user.id,
        created_at: new Date().toISOString()
      }
    });

    req.flash('success', 'Payment link created successfully!');
    res.render('payment/success', {
      title: 'Payment Link Created',
      paymentLink,
      user: req.session.user
    });

  } catch (error) {
    console.error('Payment link creation error:', error);
    req.flash('error', error.message);
    res.render('payment/create', {
      title: 'Create Payment Link',
      errors: [error.message],
      formData: req.body,
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  }
});

// List user's payment links
router.get('/links', async (req, res) => {
  try {
    console.log('Listing payment links for user:', req.session.user.id);
    const paymentLinks = await listPaymentLinks(req.session.user.id, 20);
    
    res.render('payment/links', {
      title: 'My Payment Links',
      paymentLinks,
      user: req.session.user
    });
  } catch (error) {
    console.error('Payment links list error:', error);
    req.flash('error', 'Failed to load payment links');
    res.redirect('/payment/create');
  }
});

module.exports = router;
