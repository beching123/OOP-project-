-- =========================================================================
-- PostgreSQL E-Commerce Schema (Single-Seller, Physical & Digital Goods, Delivery Logistics)
-- =========================================================================

-- Enable the extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define the reusable trigger function to automatically maintain updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- -------------------------------------------------------------------------
-- 1. Users Table (Handles Admins, Customers, and Delivery Agents)
-- -------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    -- Controls access: 'admin' (the system/seller), 'customer' (buyer), 'delivery_agent' (courier)
    role VARCHAR(50) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer', 'delivery_agent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -------------------------------------------------------------------------
-- 2. Delivery Agents Profile (Extends the User table with courier logistics)
-- -------------------------------------------------------------------------
CREATE TABLE delivery_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    vehicle_details VARCHAR(255), -- e.g., "Motorcycle", "Van"
    license_plate VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    current_status VARCHAR(50) DEFAULT 'available' CHECK (current_status IN ('available', 'busy', 'offline')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_agents_modtime
    BEFORE UPDATE ON delivery_agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -------------------------------------------------------------------------
-- 3. Products (Stores primary information for Physical and Digital goods)
-- -------------------------------------------------------------------------
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'physical' CHECK (type IN ('physical', 'digital')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
    images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs/metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -------------------------------------------------------------------------
-- 4. Product Variants (Handles specific stock items, prices, and SKUs)
-- -------------------------------------------------------------------------
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE,
    title VARCHAR(255) NOT NULL, -- e.g., "Standard Edition" or "Pack of 3"
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    compare_at_price NUMERIC(12, 2), -- Original price before discounts
    inventory_quantity INT NOT NULL DEFAULT 0, -- For digital assets, stock is usually unmanaged/unlimited
    weight NUMERIC(8, 2), -- Required primarily for physical delivery weight metrics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_variants_modtime
    BEFORE UPDATE ON product_variants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -------------------------------------------------------------------------
-- 5. Digital Assets (Files or links associated with digital variants)
-- -------------------------------------------------------------------------
CREATE TABLE digital_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    file_url VARCHAR(2083) NOT NULL, -- S3/secure cloud link
    max_downloads INT, -- NULL for unlimited downloads
    expiry_days INT, -- Days download link stays valid post-purchase; NULL for lifetime
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- -------------------------------------------------------------------------
-- 6. Orders (Parent order invoices tracking customer and status summaries)
-- -------------------------------------------------------------------------
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_number SERIAL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    financial_status VARCHAR(50) DEFAULT 'pending' CHECK (financial_status IN ('pending', 'paid', 'refunded', 'voided')),
    fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'partially_fulfilled', 'fulfilled')),
    total_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    subtotal_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    shipping_address JSONB DEFAULT '{}'::jsonb, -- Empty if order contains only digital items
    billing_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    has_physical_items BOOLEAN NOT NULL DEFAULT true,
    has_digital_items BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_orders_modtime
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -------------------------------------------------------------------------
-- 7. Order Items (Preserves static invoice records at the point of sale)
-- -------------------------------------------------------------------------
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_title VARCHAR(255) NOT NULL,
    variant_title VARCHAR(255),
    sku VARCHAR(100),
    price NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    is_digital BOOLEAN NOT NULL DEFAULT false
);


-- -------------------------------------------------------------------------
-- 8. Shipments (Coordinates physical delivery assignments for couriers)
-- -------------------------------------------------------------------------
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    delivery_agent_id UUID REFERENCES delivery_agents(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'assigned', 'picked_up', 'out_for_delivery', 'delivered', 'failed_delivery')),
    tracking_number VARCHAR(100) UNIQUE,
    delivery_notes TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE,
    picked_up_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TRIGGER update_shipments_modtime
    BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- -------------------------------------------------------------------------
-- 9. Digital Downloads (Authorized, tokenized links generated post-payment)
-- -------------------------------------------------------------------------
CREATE TABLE digital_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    digital_asset_id UUID NOT NULL REFERENCES digital_assets(id) ON DELETE CASCADE,
    download_token UUID DEFAULT uuid_generate_v4() UNIQUE, -- Token appended to the client download route
    download_count INT DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE, -- Dynamic link expiration calculated when order goes to paid
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- -------------------------------------------------------------------------
-- 10. Transactions (Tracks payment system events)
-- -------------------------------------------------------------------------
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    gateway VARCHAR(100) NOT NULL, -- e.g., 'Stripe', 'Flutterwave', 'COD'
    status VARCHAR(50) NOT NULL CHECK (status IN ('success', 'failure', 'pending')),
    payment_reference VARCHAR(255) UNIQUE, -- Unique code provided by the external gateway
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================================
-- INDEX OPTIMIZATIONS (Ensures quick lookups during active use)
-- =========================================================================

-- Quick role lookups during platform logins
CREATE INDEX idx_users_role ON users(role);

-- Helps dispatchers find available delivery agents instantly
CREATE INDEX idx_agents_status_active ON delivery_agents(current_status) WHERE is_active = true;

-- Optimized filter indexes for store item lists
CREATE INDEX idx_products_status_type ON products(status, type);

-- Links physical product inventory to variant lookups
CREATE INDEX idx_product_variants_id ON product_variants(product_id);
CREATE INDEX idx_digital_assets_variant ON digital_assets(variant_id);

-- Speed up historical queries for customer panels and order pipelines
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_fulfillment ON orders(fulfillment_status);
CREATE INDEX idx_orders_financial ON orders(financial_status);

-- Links line items directly to active checkout lookups
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Speeds up route checks and status monitoring for delivery agents
CREATE INDEX idx_shipments_agent_status ON shipments(delivery_agent_id, status);

-- Ensures secure download request token queries execute rapidly
CREATE INDEX idx_downloads_token ON digital_downloads(download_token);