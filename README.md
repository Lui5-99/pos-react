# TechStore - E-commerce Platform

TechStore is a modern e-commerce platform built with React, TypeScript, and Material-UI. It features a responsive design, secure authentication, and an admin dashboard for product management.

## Features

### User Features

- User registration and authentication
- Profile management
- Password change functionality
- Account deletion
- Product browsing and search
- Shopping cart functionality
- Secure checkout process

### Admin Features

- Admin dashboard
- Product management (CRUD operations)
- User management
- Order tracking
- Analytics dashboard

## Tech Stack

- **Frontend:**

  - React 18
  - TypeScript
  - Material-UI (MUI)
  - Redux Toolkit
  - React Router v6
  - Axios

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/techstore.git
cd techstore
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add the following variables:

```env
REACT_APP_API_URL=http://localhost:5000/api
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/         # Reusable components
├── pages/             # Page components
├── services/          # API services
├── store/             # Redux store and slices
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
├── theme/             # Material-UI theme configuration
└── utils/             # Utility functions
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `DELETE /api/auth/account` - Delete user account

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin)

## Security Features

- JWT-based authentication
- Protected routes
- Password hashing
- Input validation
- XSS protection
- CSRF protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the beautiful components
- Redux Toolkit for state management
- React Router for navigation
- MongoDB for the database

## Support

For support, email support@techstore.com or create an issue in the repository.
