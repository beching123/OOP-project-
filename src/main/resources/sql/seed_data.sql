INSERT INTO users (username, password_hash, roles, permissions)
VALUES ('admin', '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'ADMIN,CASHIER', 'MANAGE_PRODUCTS,PROCESS_ORDERS,VIEW_AUDIT');

INSERT INTO app_settings (key, value) VALUES
('shop_name', 'Madam Store'),
('tax_rate', '0.15'),
('primary_color', '#2c3e50'),
('font_size', '18px'),
('contrast_mode', 'normal');

INSERT INTO products (barcode, name, price, stock, version)
VALUES ('000000000001', 'Sample Product', 9.99, 100, 0);
