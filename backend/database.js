import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data', 'godavari.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

const initializeDatabase = () => {
  db.serialize(() => {
    // Admin Users Table
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products Table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Daily Rates Table
    db.run(`
      CREATE TABLE IF NOT EXISTS rates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        rate REAL NOT NULL,
        unit TEXT NOT NULL DEFAULT 'kg',
        availability TEXT DEFAULT 'Available',
        weight REAL,
        weight_unit TEXT DEFAULT 'kg',
        date DATE DEFAULT CURRENT_DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Safe migration: add weight columns to an existing rates table
    // (no-op if the columns already exist)
    db.run('ALTER TABLE rates ADD COLUMN weight REAL', (err) => {
      if (err && !/duplicate column/i.test(err.message)) {
        console.warn('rates.weight migration note:', err.message);
      }
    });
    db.run("ALTER TABLE rates ADD COLUMN weight_unit TEXT DEFAULT 'kg'", (err) => {
      if (err && !/duplicate column/i.test(err.message)) {
        console.warn('rates.weight_unit migration note:', err.message);
      }
    });

    // Wholesale Inquiries Table
    db.run(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        business_name TEXT,
        mobile TEXT NOT NULL,
        product_requirement TEXT,
        quantity TEXT,
        message TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reviews Table
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        review_text TEXT,
        image_url TEXT,
        is_visible INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contact Requests Table
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        mobile TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Services Table
    db.run(`
      CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        order_position INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Site Settings Table — single-row key/value bag for editable site-wide content
    // (owner profile, business story, etc.). id is always 1.
    db.run(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        owner_name TEXT,
        owner_role TEXT,
        owner_bio TEXT,
        owner_image_url TEXT,
        business_story TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed the settings row with sensible defaults from the README on first run
    db.get('SELECT id FROM site_settings WHERE id = 1', (err, row) => {
      if (err) return;
      if (!row) {
        db.run(
          `INSERT INTO site_settings
            (id, owner_name, owner_role, owner_bio, owner_image_url, business_story)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            1,
            'Sameer Qureshi',
            'Owner · Sameer Qureshi & Brothers',
            'Three generations of trusted seafood expertise, serving Chhatrapati Sambhaji Nagar with the freshest catch from the Godavari river belt and coastal suppliers.',
            null,
            'Godavari Fish, owned by Sameer Qureshi & Brothers, has been serving the community with premium quality seafood for over 15 years. Located in the heart of Central Naka, near MGM Hospital, we have built a reputation as the most trusted local seafood supplier. Our commitment to quality starts from the source — we partner with trusted suppliers to ensure that only the freshest catch reaches your table. Every product undergoes strict quality checks before reaching our customers.',
          ]
        );
      }
    });
  });

  console.log('Database tables initialized');
};

export default db;
