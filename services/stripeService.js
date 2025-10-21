const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create a payment link with the provided parameters
 * @param {Object} paymentData - Payment link data
 * @returns {Promise<Object>} - Stripe payment link object
 */
const createPaymentLink = async (paymentData) => {
  try {
    const {
      name,
      description,
      amount,
      currency = 'usd',
      quantity = 1,
      metadata = {}
    } = paymentData;

    // Validate required fields
    if (!name || !amount) {
      throw new Error('Name and amount are required');
    }

    // Convert amount to cents
    const amountInCents = Math.round(parseFloat(amount) * 100);

    if (amountInCents < 50) { // Minimum $0.50
      throw new Error('Amount must be at least $0.50');
    }

    // Create the price first
    const price = await stripe.prices.create({
      unit_amount: amountInCents,
      currency: currency.toLowerCase(),
      product_data: {
        name: name,
        metadata: {
          description: description || `Payment for ${name}`
        }
      }
    });

    // Create the payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: quantity
        }
      ],
      metadata: {
        created_by: paymentData.userId || 'unknown',
        ...metadata
      }
    });

    return {
      id: paymentLink.id,
      url: paymentLink.url,
      active: paymentLink.active,
      created: paymentLink.created,
      name: name,
      amount: amount,
      currency: currency
    };
  } catch (error) {
    console.error('Stripe payment link creation error:', error);
    throw new Error(`Failed to create payment link: ${error.message}`);
  }
};

/**
 * Get payment link details
 * @param {string} paymentLinkId - Payment link ID
 * @returns {Promise<Object>} - Payment link details
 */
const getPaymentLink = async (paymentLinkId) => {
  try {
    const paymentLink = await stripe.paymentLinks.retrieve(paymentLinkId);
    return paymentLink;
  } catch (error) {
    console.error('Stripe payment link retrieval error:', error);
    throw new Error(`Failed to retrieve payment link: ${error.message}`);
  }
};

/**
 * List payment links for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of links to retrieve
 * @returns {Promise<Array>} - Array of payment links
 */
const listPaymentLinks = async (userId, limit = 10) => {
  try {
    const paymentLinks = await stripe.paymentLinks.list({
      limit: limit
    });

    // Filter by user if metadata contains userId
    const userLinks = paymentLinks.data.filter(link => 
      link.metadata && link.metadata.created_by === userId
    );

    return userLinks;
  } catch (error) {
    console.error('Stripe payment links list error:', error);
    throw new Error(`Failed to list payment links: ${error.message}`);
  }
};

module.exports = {
  createPaymentLink,
  getPaymentLink,
  listPaymentLinks
};
