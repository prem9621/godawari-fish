-- Sample Data for Godavari Fish Database
-- Run this after setting up the database

-- Insert Sample Products
INSERT OR IGNORE INTO products (name, description) VALUES
('Pomfret', 'Premium white fish, perfect for frying and grilling'),
('Surmai', 'King fish, excellent for curries and steaks'),
('Prawns', 'Fresh succulent prawns, perfect for tandoor and curry'),
('Rohu', 'Freshwater fish, great for rich curries'),
('Katla', 'Golden fish, tender and flavorful'),
('Badshah Fish', 'Premium quality fish, best for special occasions');

-- Insert Sample Daily Rates (for today)
INSERT OR IGNORE INTO rates (product_id, rate, unit, availability) VALUES
(1, 400.00, 'kg', 'Available'),
(2, 350.00, 'kg', 'Available'),
(3, 450.00, 'kg', 'Available'),
(4, 200.00, 'kg', 'Available'),
(5, 180.00, 'kg', 'Available'),
(6, 500.00, 'kg', 'Available');

-- Insert Sample Reviews
INSERT OR IGNORE INTO reviews (customer_name, rating, review_text, is_visible) VALUES
('Rajesh Kumar', 5, 'Excellent quality fish! Fresh and hygienic. Always satisfied with Godavari Fish.', 1),
('Priya Sharma', 5, 'Best fish in town. Great service and very reliable. Highly recommended!', 1),
('Ahmed Khan', 4, 'Good variety and fresh products. WhatsApp ordering is very convenient.', 1),
('Neha Singh', 5, 'The custom cutting service is excellent. Always get fish cut exactly as needed.', 1),
('Vikram Patel', 5, 'Running a restaurant for 5 years, Godavari Fish is our trusted supplier. Never disappointed!', 1),
('Sunita Rao', 4, 'Fresh daily stock and competitive prices. Perfect for my catering business.', 1);

-- Insert Sample Services (for reference)
INSERT OR IGNORE INTO services (name, description, order_position) VALUES
('Whole Fish', 'Fresh whole fish ready for cooking', 1),
('Curry Cut', 'Cut into perfect curry pieces', 2),
('Steak Cut', 'Thick steaks for grilling', 3),
('Boneless Fillet', 'Premium boneless fillet cuts', 4),
('Cleaned & Ready', 'Fully cleaned and ready to cook', 5);

-- Admin user is automatically created on first run with credentials:
-- Username: admin
-- Password: admin
-- Change these in production!
