/*Using Postbird GUI app - Create tables in order, tables that are referenced by other tables first*/

/*users*/
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATE
);

/*products*/
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  description VARCHAR(100),
  price INTEGER NOT NULL,
  quantity_in_stock INTEGER,
  created_at DATE
);

/*carts*/
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  created_at DATE
);

/*car_items*/
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES carts(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER
);

/*orders*/
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_price INTEGER,
  status VARCHAR(20),
  created_at DATE
);

/*order_items*/
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  unit_price INTEGER
);