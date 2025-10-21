# Stripe Payment Links Generator

A Node.js application that allows authenticated users to generate custom Stripe payment links with Airtable authentication.

## Features

- **Airtable Authentication**: Secure user authentication using Airtable as the user database
- **Stripe Integration**: Generate custom payment links using Stripe API
- **Session Management**: Secure session handling with proper error handling
- **Form Validation**: Client and server-side validation for all forms
- **Responsive UI**: Modern, mobile-friendly interface built with Bootstrap
- **Real-time Feedback**: Success/error messages and loading states

## Prerequisites

- Node.js (v14 or higher)
- Airtable account with API key
- Stripe account with API keys
- Airtable base with a Users table

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd stripe-payment-links
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
AIRTABLE_TABLE_NAME=Users

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Session Configuration
SESSION_SECRET=your_session_secret_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Airtable Setup

Create a table in your Airtable base with the following fields:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| Email | Email | User's email address |
| Password | Long text | Hashed password |
| Name | Single line text | User's display name |
| Role | Single line text | User role (optional) |

**Important**: Passwords should be hashed using bcrypt before storing in Airtable.

### 4. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Use test keys for development, live keys for production

### 5. Run the Application

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Authentication

1. Navigate to the login page
2. Enter your email and password (stored in Airtable)
3. Upon successful authentication, you'll be redirected to the payment link creation page

### Creating Payment Links

1. Fill out the payment link form with:
   - Product/Service name (required)
   - Amount (required, minimum $0.50)
   - Description (optional)
   - Currency (default: USD)
   - Quantity (default: 1)

2. Click "Generate Payment Link"
3. Copy and share the generated Stripe payment link

### Managing Links

- View all your created payment links
- Copy links to clipboard
- Test payment links
- View link details

## API Endpoints

### Authentication Routes
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login
- `GET /auth/logout` - Logout user

### Payment Routes (Protected)
- `GET /payment/create` - Payment link creation form
- `POST /payment/create` - Create new payment link
- `GET /payment/links` - List user's payment links

## Security Features

- Session-based authentication
- Password hashing with bcrypt
- CSRF protection
- Input validation and sanitization
- Secure session configuration
- Helmet.js security headers

## Error Handling

- Comprehensive error handling for all API calls
- User-friendly error messages
- Logging for debugging
- Graceful fallbacks for service failures

## Dependencies

### Core Dependencies
- **express**: Web framework
- **express-session**: Session management
- **airtable**: Airtable API client
- **stripe**: Stripe API client
- **bcryptjs**: Password hashing
- **ejs**: Template engine

### Security & Validation
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **express-validator**: Input validation
- **connect-flash**: Flash messages

## Development

### Project Structure

```
├── server.js              # Main application file
├── middleware/
│   └── auth.js            # Authentication middleware
├── services/
│   ├── airtableService.js # Airtable integration
│   └── stripeService.js   # Stripe integration
├── routes/
│   ├── auth.js            # Authentication routes
│   └── payment.js         # Payment routes
├── views/
│   ├── layout.ejs         # Main layout template
│   ├── auth/
│   │   └── login.ejs      # Login page
│   ├── payment/
│   │   ├── create.ejs     # Payment form
│   │   ├── success.ejs    # Success page
│   │   └── links.ejs      # Links list
│   └── error.ejs          # Error page
└── public/
    ├── css/
    │   └── style.css      # Custom styles
    └── js/
        └── app.js         # Client-side JavaScript
```

## Troubleshooting

### Common Issues

1. **Airtable Authentication Fails**
   - Verify API key and base ID
   - Check table name matches configuration
   - Ensure user exists in Airtable with hashed password

2. **Stripe Payment Link Creation Fails**
   - Verify Stripe API keys
   - Check amount is valid (minimum $0.50)
   - Ensure Stripe account is properly configured

3. **Session Issues**
   - Check SESSION_SECRET is set
   - Verify session configuration
   - Clear browser cookies if needed

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong, unique SESSION_SECRET
3. Use live Stripe keys for production
4. Configure proper session store (Redis recommended)
5. Set up HTTPS
6. Configure reverse proxy (nginx/Apache)

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review error logs
3. Verify configuration settings
4. Contact support if needed
