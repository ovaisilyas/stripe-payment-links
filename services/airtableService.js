const Airtable = require('airtable');
const bcrypt = require('bcryptjs');

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

const tableName = process.env.AIRTABLE_TABLE_NAME || 'Users';

/**
 * Authenticate user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object|null>} - User object if authenticated, null otherwise
 */
const authenticateUser = async (email, password) => {
  try {
    const records = await base(tableName)
      .select({
        filterByFormula: `{Email} = '${email}'`,
        maxRecords: 1
      })
      .firstPage();

      console.log('Records:', records.length);
    if (records.length === 0) {
      return null;
    }

    const user = records[0];
    const hashedPassword = user.get('Password');
    
    if (!hashedPassword) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    
    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      email: user.get('Email'),
      name: user.get('Name') || user.get('Email'),
      role: user.get('Role') || 'user'
    };
  } catch (error) {
    console.error('Airtable authentication error:', error);
    throw new Error('Authentication service unavailable');
  }
};

/**
 * Get user by ID
 * @param {string} userId - User's ID
 * @returns {Promise<Object|null>} - User object if found, null otherwise
 */
const getUserById = async (userId) => {
  try {
    const record = await base(tableName).find(userId);
    
    return {
      id: record.id,
      email: record.get('Email'),
      name: record.get('Name') || record.get('Email'),
      role: record.get('Role') || 'user'
    };
  } catch (error) {
    console.error('Airtable get user error:', error);
    return null;
  }
};

module.exports = {
  authenticateUser,
  getUserById
};
