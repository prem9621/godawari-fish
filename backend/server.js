import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import db from './database.js';
import { verifyToken } from './middleware/auth.js';

dotenv.config();

console.log('=== JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');
console.log('=== JWT_SECRET value:', process.env.JWT_SECRET);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Use persistent uploads directory if available (for Render)
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');

// Make sure uploads directory exists
import fs from 'fs';
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Explicit fallback for uploads (Express 5 fix)
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '-' + safe);
  }
});
const upload = multer({ storage });

// Initialize admin user on first run
const initializeAdmin = () => {
  db.get('SELECT * FROM admin_users LIMIT 1', (err, row) => {
    if (!row) {
      const hashedPassword = bcryptjs.hashSync(process.env.ADMIN_PASSWORD, 10);
      db.run(
        'INSERT INTO admin_users (username, password) VALUES (?, ?)',
        [process.env.ADMIN_USERNAME, hashedPassword],
        (err) => {
          if (err) console.error('Error creating admin user:', err);
          else console.log('Admin user initialized');
        }
      );
    }
  });
};

initializeAdmin();

// ============ AUTH ROUTES ============
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  console.log('=== Login attempt for username:', username);

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get('SELECT * FROM admin_users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    console.log('=== Generating token with JWT_SECRET:', process.env.JWT_SECRET);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log('=== Generated token:', token);
    res.json({ token, message: 'Login successful' });
  });
});

// ========== PRODUCTS ROUTES ==========
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY name', (err, products) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(products);
  });
});

app.post('/api/products/import-all', verifyToken, (req, res) => {
  const FISH_CATALOGUE = [
    { name: 'Prawn', description: 'Fresh prawns, perfect for frying, curries and biryani.' },
    { name: 'King Prawn', description: 'Large juicy king prawns. Ideal for grilling, tandoor and special occasions.' },
    { name: 'Pomfret', description: 'Premium white pomfret, perfect for frying and steaming.' },
    { name: 'Indian Salmon Fish', description: 'Tasty and nutritious Indian salmon. Great for curries and fry.' },
    { name: 'Surmai (King Fish)', description: 'Premium surmai, great for curries, steaks and fry.' },
    { name: 'Halwa (Black Pomfret)', description: 'Black pomfret with rich flavor. Excellent for deep fry.' },
    { name: 'Kolkata Ilish Fish', description: 'Famous Hilsa fish from Kolkata. A delicacy with unique flavor.' },
    { name: 'Betki Fish (Chaunak)', description: 'Firm white flesh, ideal for koliwada fry.' },
    { name: 'Hamoor Fish', description: 'Premium grouper fish. Thick juicy flesh for grilling.' },
    { name: 'Bangda (Mackerel)', description: 'Fresh bangda for rava fry and curry.' },
    { name: 'Tarli Fish', description: 'Small sardine-style fish, great for frying.' },
    { name: 'Kuppa Fish (Tuna)', description: 'Fresh tuna fish, meaty and flavourful.' },
    { name: 'Rani Fish', description: 'Pink perch with tender flesh. Perfect for frying.' },
    { name: 'Bombil (Bombay Duck)', description: 'Iconic Bombay duck fish. Best for sun-dried or fried preparations.' },
    { name: 'Karli Fish', description: 'Cobia fish with firm flesh. Excellent for grilling.' },
    { name: 'Sakla (Bombay Maral)', description: 'Barracuda fish, firm and tasty.' },
    { name: 'Singada Fish', description: 'Popular in Konkan coastal cuisine.' },
    { name: 'Toll Fish (Green Bone)', description: 'Distinctive green bones, sweet white flesh.' },
    { name: 'Red Snapper', description: 'Premium red snapper with firm white flesh.' },
    { name: 'Mandeli Fish', description: 'Small coastal fish, great for frying.' },
    { name: 'Kurchi Fish', description: 'Tasty coastal fish with unique flavour.' },
    { name: 'Chand Paplet', description: 'Silver pomfret, the most premium pomfret variety.' },
    { name: 'Karimi Fish', description: 'Perfect for Konkani style masala fry.' },
    { name: 'Shark Fish (Baby Shark)', description: 'Tender baby shark meat. Rich flavour.' },
    { name: 'Baam Fish (Black Baam)', description: 'Black eel fish with rich, hearty flavour.' },
    { name: 'Pili Baam Fish', description: 'Yellow eel with distinctive taste.' },
    { name: 'Lep Fish (Sole Fish)', description: 'Flat sole fish with delicate white flesh.' },
    { name: 'Kane Fish (Lady Fish)', description: 'Slender lady fish with sweet flesh.' },
    { name: 'Tiny Prawn', description: 'Small fresh prawns, ideal for prawn masala.' },
    { name: 'Squids', description: 'Fresh squids, tender quality.' },
    { name: 'Mud Crabs', description: 'Fresh mud crabs with rich, sweet meat.' },
    { name: 'Sea Crabs', description: 'Fresh sea crabs. Perfect for crab masala.' },
    { name: 'Oyster / Sneal', description: 'Fresh oysters, great for pan fry.' },
    { name: 'Rahu', description: 'Most popular fresh water fish. Excellent for curries.' },
    { name: 'Katla', description: 'Large fresh water fish with tender flesh.' },
    { name: 'River Surmai', description: 'Fresh water king fish. Rich flavour.' },
    { name: 'Pangaasiuss', description: 'Basa fish with mild white flesh.' },
    { name: 'Tilapi', description: 'Mild and versatile fish. Easy to cook.' },
    { name: 'Gawran Baam', description: 'Local fresh water eel. Rich and hearty.' },
    { name: 'Marla Fish', description: 'Fresh water fish popular in Maharashtra.' },
    { name: 'Tengda Fish (Kudlu Katarna)', description: 'Small fresh water catfish. Very tasty.' },
  ];
  
  let inserted = 0;
  const existingNames = [];
  db.all('SELECT name FROM products', (err, existingProducts) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    existingProducts.forEach(p => existingNames.push(p.name.toLowerCase()));
    
    FISH_CATALOGUE.forEach(fish => {
      if (!existingNames.includes(fish.name.toLowerCase())) {
        db.run('INSERT INTO products (name, description) VALUES (?, ?)', [fish.name, fish.description]);
        inserted++;
      }
    });
    
    res.json({ message: `Import complete! Added ${inserted} new products.` });
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });
});

app.post('/api/products', verifyToken, upload.single('image'), (req, res) => {
  const { name, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name) {
    return res.status(400).json({ error: 'Product name required' });
  }

  db.run(
    'INSERT INTO products (name, description, image_url) VALUES (?, ?, ?)',
    [name, description, imageUrl],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ id: this.lastID, name, description, image_url: imageUrl });
    }
  );
});

app.put('/api/products/:id', verifyToken, upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Product name required' });
  }

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : product.image_url;

    db.run(
      'UPDATE products SET name = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, description, imageUrl, id],
      (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ id, name, description, image_url: imageUrl });
      }
    );
  });
});

app.delete('/api/products/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Product deleted' });
  });
});

// ============ RATES ROUTES ============
app.get('/api/rates', (req, res) => {
  db.all(`
    SELECT r.id, r.product_id, r.rate, r.unit, r.availability,
           r.weight, r.weight_unit, r.date, r.created_at,
           p.name, p.image_url
    FROM rates r
    JOIN products p ON r.product_id = p.id
    WHERE r.date = CURRENT_DATE
    ORDER BY p.name
  `, (err, rates) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rates);
  });
});

app.get('/api/products-with-rates', (req, res) => {
  const sql = `
    SELECT p.id AS product_id, p.name, p.description, p.image_url,
           r.id AS rate_id, r.rate, r.unit, r.availability,
           r.weight, r.weight_unit, r.date
    FROM products p
    LEFT JOIN rates r ON r.id = (
      SELECT id FROM rates
      WHERE product_id = p.id
      ORDER BY date DESC, created_at DESC
      LIMIT 1
    )
    ORDER BY p.name
  `;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.get('/api/rates/history/:productId', (req, res) => {
  const { productId } = req.params;
  db.all(
    'SELECT * FROM rates WHERE product_id = ? ORDER BY date DESC LIMIT 30',
    [productId],
    (err, rates) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(rates);
    }
  );
});

app.post('/api/rates', verifyToken, (req, res) => {
  const { product_id, rate, unit, availability, weight, weight_unit } = req.body;

  if (!product_id || !rate) {
    return res.status(400).json({ error: 'Product ID and rate required' });
  }

  db.run(
    'DELETE FROM rates WHERE product_id = ? AND date = CURRENT_DATE',
    [product_id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      const hasWeight = weight !== undefined && weight !== null && weight !== '';
      db.run(
        `INSERT INTO rates (product_id, rate, unit, availability, weight, weight_unit)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          product_id, rate, unit || 'kg',
          availability || 'Available',
          hasWeight ? Number(weight) : null,
          weight_unit || 'kg',
        ],
        function(err) {
          if (err) return res.status(500).json({ error: 'Database error' });
          res.status(201).json({
            id: this.lastID, product_id, rate,
            unit: unit || 'kg',
            availability: availability || 'Available',
            weight: hasWeight ? Number(weight) : null,
            weight_unit: weight_unit || 'kg',
          });
        }
      );
    }
  );
});

app.put('/api/rates/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { rate, availability, weight, weight_unit } = req.body;

  if (!rate) {
    return res.status(400).json({ error: 'Rate required' });
  }

  const hasWeight = weight !== undefined && weight !== null && weight !== '';

  db.run(
    `UPDATE rates SET rate = ?, availability = ?, weight = ?, weight_unit = ?,
     updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [
      rate, availability || 'Available',
      hasWeight ? Number(weight) : null,
      weight_unit || 'kg', id,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({
        id, rate,
        availability: availability || 'Available',
        weight: hasWeight ? Number(weight) : null,
        weight_unit: weight_unit || 'kg',
      });
    }
  );
});

// ============ REVIEWS ROUTES ============
app.get('/api/reviews', (req, res) => {
  db.all(
    'SELECT * FROM reviews WHERE visible = 1 ORDER BY created_at DESC',
    (err, reviews) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(reviews);
    }
  );
});

app.post('/api/reviews', (req, res) => {
  const { customer_name, rating, review_text } = req.body;

  if (!customer_name || !review_text) {
    return res.status(400).json({ error: 'Customer name and review text required' });
  }

  db.run(
    'INSERT INTO reviews (customer_name, rating, review_text) VALUES (?, ?, ?)',
    [customer_name, rating || 5, review_text],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ id: this.lastID, customer_name, rating: rating || 5, review_text });
    }
  );
});

app.get('/api/reviews/admin', verifyToken, (req, res) => {
  db.all(
    'SELECT * FROM reviews ORDER BY created_at DESC',
    (err, reviews) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(reviews);
    }
  );
});

app.put('/api/reviews/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;

  db.run('UPDATE reviews SET visible = ? WHERE id = ?', [visible, id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ id, visible });
  });
});

// ============ INQUIRIES ROUTES ============
app.post('/api/inquiries', (req, res) => {
  const { name, business_name, mobile, product_requirement, quantity, message } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ error: 'Name and mobile required' });
  }

  db.run(
    'INSERT INTO inquiries (name, business_name, mobile, product_requirement, quantity, message) VALUES (?, ?, ?, ?, ?, ?)',
    [name, business_name, mobile, product_requirement, quantity, message],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ id: this.lastID, name, mobile, status: 'New' });
    }
  );
});

app.get('/api/inquiries', verifyToken, (req, res) => {
  db.all('SELECT * FROM inquiries ORDER BY created_at DESC', (err, inquiries) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(inquiries);
  });
});

app.put('/api/inquiries/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run('UPDATE inquiries SET status = ? WHERE id = ?', [status, id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ id, status });
  });
});

// ============ CONTACT REQUESTS ROUTES ============
app.post('/api/contact', (req, res) => {
  const { name, email, mobile, message } = req.body;

  if (!name || !email || !mobile || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    'INSERT INTO contact_requests (name, email, mobile, message) VALUES (?, ?, ?, ?)',
    [name, email, mobile, message],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ id: this.lastID, name, email, message: 'Contact request received' });
    }
  );
});

// ============ SITE SETTINGS ============
app.get('/api/settings', (req, res) => {
  db.get('SELECT * FROM site_settings WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) {
      return res.json({
        owner_name: 'Sameer Qureshi',
        owner_role: 'Owner · Sameer Qureshi & Brothers',
        owner_bio: '',
        owner_image_url: null,
        business_story: '',
      });
    }
    res.json(row);
  });
});

app.put('/api/settings', verifyToken, upload.single('owner_image'), (req, res) => {
  const { owner_name, owner_role, owner_bio, business_story } = req.body;

  db.get('SELECT * FROM site_settings WHERE id = 1', (err, current) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!current) return res.status(404).json({ error: 'Settings row not found' });

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : current.owner_image_url;

    db.run(
      `UPDATE site_settings
         SET owner_name = ?, owner_role = ?, owner_bio = ?,
             owner_image_url = ?, business_story = ?,
             updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [
        owner_name ?? current.owner_name,
        owner_role ?? current.owner_role,
        owner_bio ?? current.owner_bio,
        imageUrl,
        business_story ?? current.business_story,
      ],
      (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        db.get('SELECT * FROM site_settings WHERE id = 1', (e, row) => {
          if (e) return res.status(500).json({ error: 'Database error' });
          res.json(row);
        });
      }
    );
  });
});

// ============ FISH SEO ROUTE ============
app.get('/api/fish/:name', (req, res) => {
  const fishName = decodeURIComponent(req.params.name);

  db.get(
    `SELECT p.*, r.rate, r.unit, r.availability, r.weight, r.weight_unit
     FROM products p
     LEFT JOIN rates r ON r.id = (
       SELECT id FROM rates WHERE product_id = p.id ORDER BY date DESC LIMIT 1
     )
     WHERE LOWER(p.name) LIKE LOWER(?)`,
    [`%${fishName}%`],
    (err, product) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json({
        name: product?.name || fishName,
        description: product?.description || `Fresh ${fishName} available at Godawari Fish & Company, Chhatrapati Sambhaji Nagar.`,
        rate: product?.rate || null,
        unit: product?.unit || 'kg',
        availability: product?.availability || 'Available',
        shop: {
          name: 'Godawari Fish & Company',
          address: 'Central Naka, Near MGM Hospital, Chhatrapati Sambhaji Nagar',
          phone: '9371306189',
          whatsapp: 'https://wa.me/919371306189',
          maps: 'https://share.google/2MtIQfCr7kSC1STPs',
          hours: {
            weekdays: '9:00 AM - 9:00 PM',
            weekends: '8:00 AM - 10:00 PM',
          },
        },
      });
    }
  );
});

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});