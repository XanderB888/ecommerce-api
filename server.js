/* 
API endpoints planning

    Auth
        POST  /auth/register
        POST  /auth/login
        GET  /auth/logout

    Products
        GET  /products
        GET  /products/:id
        POST  /products
        PUT  /products/:id
        DELETE  /products/:id

    Users
        GET  /users/:id
        PUT  /users/:id
        DELETE  /users/:id

    Cart
        GET  /cart
        POST  /cart
        PUT  /cart/:itemId
        DELETE  /cart/:itemId

    Checkout
        POST  /checkout

    Orders
        GET  /orders
        GET  /orders/:id
*/

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const db = require('./db/index');
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');

const app = express();

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/products', productsRouter);
app.use('/auth', authRouter);

app.listen(3000, () => console.log('Server running on port 3000'));
