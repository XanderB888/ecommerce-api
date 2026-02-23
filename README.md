# E-Commerce REST API

A fully-functioning e-commerce REST API built with Node.js, Express and PostgreSQL.

## Features

- User registration and authentication with bcrypt and Passport.js
- Session management with express-session
- Full CRUD operations for products
- Shopping cart management
- Checkout with automatic order creation
- Order history
- API documentation with Swagger UI

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** Passport.js, bcrypt
- **Documentation:** Swagger UI

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL

### Installation

1. Clone the repository
```
   git clone https://github.com/YourUsername/ecommerce-api.git
```

2. Install dependencies
```
   npm install
```

3. Create a `.env` file in the root directory
```
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=ecommerce
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   SESSION_SECRET=your_session_secret
```

4. Set up the database
```
   psql -U postgres -d ecommerce -f db/schema.sql
```

5. Start the server
```
   npm run dev
```

## API Documentation

Once the server is running, visit:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login |
| GET | /auth/logout | Logout |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /products | Get all products |
| GET | /products/:id | Get single product |
| POST | /products | Create product |
| PUT | /products/:id | Update product |
| DELETE | /products/:id | Delete product |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users/:id | Get user profile |
| PUT | /users/:id | Update user |
| DELETE | /users/:id | Delete user |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /cart | Get cart |
| POST | /cart | Add item to cart |
| PUT | /cart/:itemId | Update item quantity |
| DELETE | /cart/:itemId | Remove item |

### Checkout
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /checkout | Place order |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /orders | Get all orders |
| GET | /orders/:id | Get single order |
```