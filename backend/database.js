import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'godavari.db');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('Connected to SQLite database');

const initializeDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

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
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

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
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      review_text TEXT,
      image_url TEXT,
      is_visible INTEGER DEFAULT 1,
      visible INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      mobile TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      order_position INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      owner_name TEXT,
      owner_role TEXT,
      owner_bio TEXT,
      owner_image_url TEXT,
      business_story TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe migrations for existing DBs
  const ratesCols = db.pragma('table_info(rates)').map(c => c.name);
  if (!ratesCols.includes('weight')) {
    db.exec('ALTER TABLE rates ADD COLUMN weight REAL');
  }
  if (!ratesCols.includes('weight_unit')) {
    db.exec("ALTER TABLE rates ADD COLUMN weight_unit TEXT DEFAULT 'kg'");
  }
  if (!ratesCols.includes('updated_at')) {
    db.exec('ALTER TABLE rates ADD COLUMN updated_at DATETIME');
  }

  // Seed site_settings if empty
  const settingsRow = db.prepare('SELECT id FROM site_settings WHERE id = 1').get();
  if (!settingsRow) {
    db.prepare(`
      INSERT INTO site_settings
        (id, owner_name, owner_role, owner_bio, owner_image_url, business_story)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      1,
      'Sameer Qureshi',
      'Owner · Sameer Qureshi & Brothers',
      'Three generations of trusted seafood expertise, serving Chhatrapati Sambhaji Nagar with the freshest catch from the Godavari river belt and coastal suppliers.',
      null,
      'Godavari Fish, owned by Sameer Qureshi & Brothers, has been serving the community with premium quality seafood for over 15 years. Located in the heart of Central Naka, near MGM Hospital, we have built a reputation as the most trusted local seafood supplier. Our commitment to quality starts from the source — we partner with trusted suppliers to ensure that only the freshest catch reaches your table. Every product undergoes strict quality checks before reaching our customers.'
    );
  }

  console.log('Database tables initialized');
};

initializeDatabase();

// ── Compatibility shim ────────────────────────────────────────────────────────
// better-sqlite3 is synchronous. The rest of server.js uses the async
// callback style from the old sqlite3 package. This shim wraps every call
// so server.js needs zero changes.

const dbShim = {
  // db.get(sql, params, callback)
  get(sql, params, callback) {
    if (typeof params === 'function') { callback = params; params = []; }
    try {
      const row = db.prepare(sql).get(...(Array.isArray(params) ? params : [params]));
      callback(null, row);
    } catch (err) {
      callback(err);
    }
  },

  // db.all(sql, params, callback)
  all(sql, params, callback) {
    if (typeof params === 'function') { callback = params; params = []; }
    try {
      const rows = db.prepare(sql).all(...(Array.isArray(params) ? params : [params]));
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
  },

  // db.run(sql, params, callback)  — callback receives (err) with this.lastID / this.changes
  run(sql, params, callback) {
    if (typeof params === 'function') { callback = params; params = []; }
    try {
      const stmt = db.prepare(sql);
      const info = stmt.run(...(Array.isArray(params) ? params : [params]));
      if (callback) {
        // Mimic the old sqlite3 `this` context
        callback.call({ lastID: info.lastInsertRowid, changes: info.changes }, null);
      }
    } catch (err) {
      if (callback) callback(err);
    }
  },

  // db.serialize(fn) — no-op, better-sqlite3 is already synchronous
  serialize(fn) {
    if (fn) fn();
  },
};

export default dbShim;