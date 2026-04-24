CREATE TABLE IF NOT EXISTS emojis (
  id SERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  price_cents INT NOT NULL,
  stock INT NOT NULL DEFAULT 100,
  category TEXT NOT NULL DEFAULT 'misc'
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  monopoly_balance_cents INT NOT NULL DEFAULT 100000,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  total_cents INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  emoji_id INT REFERENCES emojis(id),
  quantity INT NOT NULL,
  unit_price_cents INT NOT NULL
);

INSERT INTO emojis (symbol, name, price_cents, stock, category) VALUES
  ('😀', 'Grinning Face', 199, 100, 'faces'),
  ('😂', 'Face with Tears of Joy', 299, 75, 'faces'),
  ('🥰', 'Smiling Face with Hearts', 399, 60, 'faces'),
  ('😎', 'Smiling Face with Sunglasses', 249, 100, 'faces'),
  ('🤔', 'Thinking Face', 199, 100, 'faces'),
  ('🎉', 'Party Popper', 499, 50, 'party'),
  ('🎂', 'Birthday Cake', 599, 40, 'party'),
  ('🍕', 'Pizza', 349, 80, 'food'),
  ('🍔', 'Hamburger', 349, 80, 'food'),
  ('🍣', 'Sushi', 699, 30, 'food'),
  ('🐶', 'Dog Face', 449, 60, 'animals'),
  ('🐱', 'Cat Face', 449, 60, 'animals'),
  ('🦄', 'Unicorn', 999, 10, 'animals'),
  ('🚀', 'Rocket', 799, 25, 'travel'),
  ('⭐', 'Star', 149, 200, 'misc'),
  ('💎', 'Gem Stone', 1299, 15, 'misc'),
  ('🔥', 'Fire', 199, 150, 'misc'),
  ('❤️', 'Red Heart', 299, 100, 'misc');

INSERT INTO customers (email, name, monopoly_balance_cents) VALUES
  ('demo@emojistore.test', 'Demo Shopper', 100000);
