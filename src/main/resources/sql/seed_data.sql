INSERT INTO users (username, email, password_hash, first_name, last_name, roles, permissions)
VALUES ('admin', 'admin@trendora.cm', '$2b$10$VYAT4JINlpcKUcHxDVlE3O56lkiBqNy1YGJXZBRM4OTpSzTHmbvsa', 'Admin', 'User', 'ADMIN', 'MANAGE_PRODUCTS,PROCESS_ORDERS,VIEW_AUDIT');

INSERT INTO app_settings (key, value) VALUES
('shop_name', 'Trendora'),
('tax_rate', '0.195'),
('primary_color', '#059669'),
('font_size', '18px'),
('contrast_mode', 'normal');

INSERT INTO products (barcode, name, description, price, stock, category, rating, reviews, is_featured, is_best_seller)
VALUES ('000000000001', 'Sample Product', 'A sample product for testing', 999.00, 100, 'Electronics', 4.5, 12, true, false);

INSERT INTO categories (name, description, icon) VALUES
('Electronics', 'Phones, TVs, laptops and accessories', 'Smartphone'),
('Fashion', 'Clothing, shoes and accessories', 'Shirt'),
('Home & Living', 'Furniture, decor and kitchen items', 'Home'),
('Beauty & Health', 'Skincare, makeup and wellness', 'Heart'),
('Sports', 'Sports equipment and activewear', 'Dumbbell');

INSERT INTO users (username, email, password_hash, first_name, last_name, roles, permissions)
VALUES ('customer@test.com', 'customer@test.com', '$2b$10$VYAT4JINlpcKUcHxDVlE3O56lkiBqNy1YGJXZBRM4OTpSzTHmbvsa', 'Test', 'Customer', 'CUSTOMER', '');

INSERT INTO users (username, email, password_hash, first_name, last_name, roles, permissions)
VALUES ('cashier@trendora.cm', 'cashier@trendora.cm', '$2b$10$VYAT4JINlpcKUcHxDVlE3O56lkiBqNy1YGJXZBRM4OTpSzTHmbvsa', 'Cashier', 'Staff', 'CASHIER', 'PROCESS_ORDERS');

INSERT INTO users (username, email, password_hash, first_name, last_name, roles, permissions)
VALUES ('processor@trendora.cm', 'processor@trendora.cm', '$2b$10$VYAT4JINlpcKUcHxDVlE3O56lkiBqNy1YGJXZBRM4OTpSzTHmbvsa', 'Order', 'Processor', 'ORDER_PROCESSOR', 'PROCESS_ORDERS,MANAGE_DELIVERIES');

INSERT INTO users (username, email, password_hash, first_name, last_name, roles, permissions)
VALUES ('support@trendora.cm', 'support@trendora.cm', '$2b$10$VYAT4JINlpcKUcHxDVlE3O56lkiBqNy1YGJXZBRM4OTpSzTHmbvsa', 'Support', 'Agent', 'SUPPORT_AGENT', 'MANAGE_TICKETS');

INSERT INTO users (username, email, password_hash, first_name, last_name, roles, permissions)
VALUES ('inventory@trendora.cm', 'inventory@trendora.cm', '$2b$10$VYAT4JINlpcKUcHxDVlE3O56lkiBqNy1YGJXZBRM4OTpSzTHmbvsa', 'Inventory', 'Manager', 'INVENTORY_MANAGER', 'MANAGE_PRODUCTS,MANAGE_CATEGORIES');

INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order, max_uses, starts_at, expires_at)
VALUES ('WELCOME10', '10% off first order', 'percentage', 10.00, 5000, 100, NOW(), NOW() + INTERVAL '6 months');
