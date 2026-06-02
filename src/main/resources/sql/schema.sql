CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(200) UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(50),
  location VARCHAR(200),
  avatar VARCHAR(500),
  roles TEXT NOT NULL,
  permissions TEXT NOT NULL,
  employee_number VARCHAR(50),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  barcode VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(19,2) NOT NULL,
  sale_price NUMERIC(19,2),
  stock INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100),
  category_id BIGINT,
  images TEXT,
  image_url VARCHAR(500),
  sku VARCHAR(100),
  rating NUMERIC(3,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  status VARCHAR(50) NOT NULL,
  total NUMERIC(19,2) NOT NULL,
  tax NUMERIC(19,2) NOT NULL,
  subtotal NUMERIC(19,2),
  customer_id BIGINT REFERENCES users(id),
  customer_name VARCHAR(200),
  cashier_id BIGINT REFERENCES users(id),
  payment_method VARCHAR(100),
  shipping_address TEXT,
  delivery_method VARCHAR(100),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(19,2) NOT NULL,
  image_url VARCHAR(500)
);

CREATE TABLE app_settings (
  key VARCHAR(200) PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE audit_records (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  user_id BIGINT REFERENCES users(id),
  user_username VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT NOT NULL,
  order_id BIGINT REFERENCES orders(id)
);

CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  icon VARCHAR(100)
);

CREATE TABLE support_tickets (
  id BIGSERIAL PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  priority VARCHAR(50) NOT NULL DEFAULT 'medium',
  customer_id BIGINT NOT NULL REFERENCES users(id),
  customer_name VARCHAR(200),
  customer_email VARCHAR(200),
  staff_id BIGINT REFERENCES users(id),
  staff_name VARCHAR(200),
  order_number VARCHAR(100),
  category VARCHAR(100),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE ticket_replies (
  id BIGSERIAL PRIMARY KEY,
  ticket_id BIGINT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  author VARCHAR(200) NOT NULL,
  author_role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id),
  amount NUMERIC(19,2) NOT NULL,
  gateway VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_reference VARCHAR(200),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info',
  reference_id BIGINT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE staff_messages (
  id BIGSERIAL PRIMARY KEY,
  sender_id BIGINT NOT NULL REFERENCES users(id),
  sender_name VARCHAR(200) NOT NULL,
  recipient_id BIGINT NOT NULL REFERENCES users(id),
  recipient_name VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE wishlist (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  product_id BIGINT NOT NULL REFERENCES products(id),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  label VARCHAR(100) NOT NULL DEFAULT 'Home',
  full_name VARCHAR(200),
  phone VARCHAR(50),
  address_line1 VARCHAR(300) NOT NULL,
  address_line2 VARCHAR(300),
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id),
  user_id BIGINT NOT NULL REFERENCES users(id),
  user_name VARCHAR(200),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  message TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE TABLE promo_codes (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC(19,2) NOT NULL,
  min_order NUMERIC(19,2) DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  starts_at TIMESTAMP WITHOUT TIME ZONE,
  expires_at TIMESTAMP WITHOUT TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transactions_payment_reference ON transactions(payment_reference);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_staff_messages_sender_recipient ON staff_messages(sender_id, recipient_id);
CREATE INDEX idx_support_tickets_customer_id ON support_tickets(customer_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_users_created_at ON users(created_at);
