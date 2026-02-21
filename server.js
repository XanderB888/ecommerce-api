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
const db = require('./db/index');
const app = express();

app.use(express.json());
app.listen(3000, () => console.log('Server running on port 3000'));
