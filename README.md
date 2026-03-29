# Aperture Store — Full Stack E-Commerce Platform

A fully functional e-commerce web application built with React, Node.js, Express and PostgreSQL. Inspired by the fictional Aperture Science corporation from Valve's Portal game series.

---

## Live Demo

🔗 [Update after deployment](#)

---

## Features

- 🔐 User registration and login with bcrypt password hashing
- 🔑 Google OAuth third-party authentication via Passport.js
- 🛒 Full shopping cart with quantity controls
- 💳 Checkout flow with automatic order creation
- 📦 Order history with expandable item details
- 🔒 Protected routes for authenticated users
- 📄 Full API documentation with Swagger UI

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React (Vite) | UI framework |
| React Router v6 | Client-side routing |
| Context API | Global auth and state |
| Axios | HTTP requests |
| CSS-in-JS | Component styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Server framework |
| PostgreSQL | Database |
| Passport.js | Authentication |
| bcrypt | Password hashing |
| express-session | Session management |
| Swagger UI | API documentation |

### Deployment
| Technology | Purpose |
|---|---|
| Render | Full stack hosting |
| Render PostgreSQL | Managed database |

---

## Project Structure
```
aperture-store/
  client/                   # React frontend (Vite)
    src/
      api/                  # Axios instance
      components/           # Navbar, ProtectedRoute
      context/              # AuthContext
      pages/                # All page components
    public/
      images/               # Product images and logo
  server/                   # Express backend
    config/                 # Passport.js configuration
    db/                     # Database connection and schema
    routes/                 # API route handlers
    server.js               # Entry point
    swagger.js              # Swagger configuration
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- Google OAuth credentials

### Installation

1. Clone the repository
```
git clone https://github.com/XanderB888/aperture-store.git
cd aperture-store
```

2. Install server dependencies
```
cd server
npm install
```

3. Install client dependencies
```
cd ../client
npm install
```

4. Create `server/.env` file
```
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=ecommerce
DB_PASSWORD=your_db_password
DB_PORT=5432
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

5. Set up the database
```
psql -U postgres -d ecommerce -f server/db/schema.sql
```

6. Run the development servers

In one terminal:
```
cd server
npm run dev
```

In another terminal:
```
cd client
npm run dev
```

7. Open `http://localhost:5173`

---

## API Documentation

Full interactive API documentation available via Swagger UI.

When running locally visit:
```
http://localhost:3000/api-docs
```

After deployment visit:
```
https://your-render-url.onrender.com/api-docs
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login with username/password | No |
| GET | /auth/google | Google OAuth login | No |
| GET | /auth/google/callback | Google OAuth callback | No |
| POST | /auth/logout | Logout | Yes |
| GET | /auth/me | Get current user | Yes |

### Products
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | /products | Get all products | No |
| GET | /products/:id | Get single product | No |
| POST | /products | Create product | Yes |
| PUT | /products/:id | Update product | Yes |
| DELETE | /products/:id | Delete product | Yes |

### Users
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | /users/:id | Get user profile | Yes |
| PUT | /users/:id | Update user | Yes |
| DELETE | /users/:id | Delete user | Yes |

### Cart
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | /cart | Get user cart | Yes |
| POST | /cart | Add item to cart | Yes |
| PUT | /cart/:itemId | Update item quantity | Yes |
| DELETE | /cart/:itemId | Remove item | Yes |

### Checkout
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | /checkout | Place order | Yes |

### Orders
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | /orders | Get all orders | Yes |
| GET | /orders/:id | Get single order with items | Yes |

---

## Developer Notes

This project was built as a portfolio piece demonstrating full-stack development skills including:

- RESTful API design with Express
- Relational database design with PostgreSQL
- React component architecture with Context API
- Session-based authentication with Passport.js
- OAuth 2.0 integration with Google
- Monorepo project structure
- API documentation with Swagger UI
- Deployment to cloud hosting via Render

---

## License

MIT — Built by Xander for educational and portfolio purposes.
Aperture Science branding is the property of Valve Corporation.