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

// Add a reset admin endpoint (for convenience)
app.post('/api/auth/reset-admin', (req, res) => {
  const hashedPassword = bcryptjs.hashSync(process.env.ADMIN_PASSWORD, 10);
  
  db.run('DELETE FROM admin_users', (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    db.run(
      'INSERT INTO admin_users (username, password) VALUES (?, ?)',
      [process.env.ADMIN_USERNAME, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Admin user reset successfully', username: process.env.ADMIN_USERNAME });
      }
    );
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
    { name: 'Prawn', description: 'Fresh prawns, perfect for frying, curries and biryani.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20prawns%20seafood%20display&image_size=square' },
    { name: 'King Prawn', description: 'Large juicy king prawns. Ideal for grilling, tandoor and special occasions.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Large%20king%20prawns%20seafood&image_size=square' },
    { name: 'Pomfret', description: 'Premium white pomfret, perfect for frying and steaming.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=White%20pomfret%20fish&image_size=square' },
    { name: 'Indian Salmon Fish', description: 'Tasty and nutritious Indian salmon. Great for curries and fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Indian%20salmon%20fish%20rawas&image_size=square' },
    { name: 'Surmai (King Fish)', description: 'Premium surmai, great for curries, steaks and fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Surmai%20king%20fish%20seer%20fish&image_size=square' },
    { name: 'Halwa (Black Pomfret)', description: 'Black pomfret with rich flavor. Excellent for deep fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Black%20pomfret%20halwa%20fish&image_size=square' },
    { name: 'Kolkata Ilish Fish', description: 'Famous Hilsa fish from Kolkata. A delicacy with unique flavor.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hilsa%20ilish%20fish%20bengali&image_size=square' },
    { name: 'Betki Fish (Chaunak)', description: 'Firm white flesh, ideal for koliwada fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Betki%20chaunak%20fish&image_size=square' },
    { name: 'Hamoor Fish', description: 'Premium grouper fish. Thick juicy flesh for grilling.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hamoor%20grouper%20fish&image_size=square' },
    { name: 'Bangda (Mackerel)', description: 'Fresh bangda for rava fry and curry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Bangda%20mackerel%20fish&image_size=square' },
    { name: 'Tarli Fish', description: 'Small sardine-style fish, great for frying.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tarli%20sardine%20fish&image_size=square' },
    { name: 'Kuppa Fish (Tuna)', description: 'Fresh tuna fish, meaty and flavourful.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tuna%20fish%20fresh&image_size=square' },
    { name: 'Rani Fish', description: 'Pink perch with tender flesh. Perfect for frying.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Pink%20perch%20rani%20fish&image_size=square' },
    { name: 'Bombil (Bombay Duck)', description: 'Iconic Bombay duck fish. Best for sun-dried or fried preparations.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Bombay%20duck%20bombil%20fish&image_size=square' },
    { name: 'Karli Fish', description: 'Cobia fish with firm flesh. Excellent for grilling.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Cobia%20karli%20fish&image_size=square' },
    { name: 'Sakla (Bombay Maral)', description: 'Barracuda fish, firm and tasty.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Barracuda%20sakla%20fish&image_size=square' },
    { name: 'Singada Fish', description: 'Popular in Konkan coastal cuisine.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Singada%20fish%20konkan&image_size=square' },
    { name: 'Toll Fish (Green Bone)', description: 'Distinctive green bones, sweet white flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Green%20bone%20toll%20fish&image_size=square' },
    { name: 'Red Snapper', description: 'Premium red snapper with firm white flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Red%20snapper%20fish&image_size=square' },
    { name: 'Mandeli Fish', description: 'Small coastal fish, great for frying.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mandeli%20coastal%20fish&image_size=square' },
    { name: 'Kurchi Fish', description: 'Tasty coastal fish with unique flavour.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Kurchi%20coastal%20fish&image_size=square' },
    { name: 'Chand Paplet', description: 'Silver pomfret, the most premium pomfret variety.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Silver%20pomfret%20chand%20paplet&image_size=square' },
    { name: 'Karimi Fish', description: 'Perfect for Konkani style masala fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Karimi%20fish%20konkani&image_size=square' },
    { name: 'Shark Fish (Baby Shark)', description: 'Tender baby shark meat. Rich flavour.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Baby%20shark%20fish&image_size=square' },
    { name: 'Baam Fish (Black Baam)', description: 'Black eel fish with rich, hearty flavour.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Black%20eel%20baam%20fish&image_size=square' },
    { name: 'Pili Baam Fish', description: 'Yellow eel with distinctive taste.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Yellow%20eel%20pili%20baam&image_size=square' },
    { name: 'Lep Fish (Sole Fish)', description: 'Flat sole fish with delicate white flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Sole%20fish%20lep%20flatfish&image_size=square' },
    { name: 'Kane Fish (Lady Fish)', description: 'Slender lady fish with sweet flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Lady%20fish%20kane%20tenualosa&image_size=square' },
    { name: 'Tiny Prawn', description: 'Small fresh prawns, ideal for prawn masala.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tiny%20prawns%20small%20shrimp&image_size=square' },
    { name: 'Squids', description: 'Fresh squids, tender quality.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20squids%20calamari&image_size=square' },
    { name: 'Mud Crabs', description: 'Fresh mud crabs with rich, sweet meat.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mud%20crabs%20seafood&image_size=square' },
    { name: 'Sea Crabs', description: 'Fresh sea crabs. Perfect for crab masala.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Sea%20crabs%20seafood&image_size=square' },
    { name: 'Oyster / Sneal', description: 'Fresh oysters, great for pan fry.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20oysters%20seafood&image_size=square' },
    { name: 'Rahu', description: 'Most popular fresh water fish. Excellent for curries.', image: 'https://raw.githubusercontent.com/prem9621/godavari-fish/main/frontend/public/images/red-se-fish.jpeg' },
    { name: 'Katla', description: 'Large fresh water fish with tender flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Katla%20freshwater%20fish&image_size=square' },
    { name: 'River Surmai', description: 'Fresh water king fish. Rich flavour.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=River%20surmai%20freshwater%20fish&image_size=square' },
    { name: 'Pangaasiuss', description: 'Basa fish with mild white flesh.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Basa%20pangasius%20fish&image_size=square' },
    { name: 'Tilapi', description: 'Mild and versatile fish. Easy to cook.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tilapia%20fish&image_size=square' },
    { name: 'Gawran Baam', description: 'Local fresh water eel. Rich and hearty.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Freshwater%20eel%20gawran%20baam&image_size=square' },
    { name: 'Marla Fish', description: 'Fresh water fish popular in Maharashtra.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Marla%20freshwater%20fish%20maharashtra&image_size=square' },
    { name: 'Tengda Fish (Kudlu Katarna)', description: 'Small fresh water catfish. Very tasty.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Freshwater%20catfish%20tengda&image_size=square' }
  ];
  
  let inserted = 0;
  const existingNames = [];
  db.all('SELECT name FROM products', (err, existingProducts) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    existingProducts.forEach(p => existingNames.push(p.name.toLowerCase()));
    
    FISH_CATALOGUE.forEach(fish => {
      if (!existingNames.includes(fish.name.toLowerCase())) {
        db.run('INSERT INTO products (name, description, image_url) VALUES (?, ?, ?)', [fish.name, fish.description, fish.image]);
        inserted++;
      } else {
        db.run('UPDATE products SET image_url = ? WHERE name = ?', [fish.image, fish.name]);
      }
    });
    
    res.json({ message: `Import complete! Added ${inserted} new products and updated images for existing ones!` });
  });
});

app.post('/api/products/seed-images', verifyToken, (req, res) => {
  const FISH_CATALOGUE = [
    { name: 'Prawn', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20prawns%20seafood%20display&image_size=square' },
    { name: 'King Prawn', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Large%20king%20prawns%20seafood&image_size=square' },
    { name: 'Pomfret', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=White%20pomfret%20fish&image_size=square' },
    { name: 'Indian Salmon Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Indian%20salmon%20fish%20rawas&image_size=square' },
    { name: 'Surmai (King Fish)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Surmai%20king%20fish%20seer%20fish&image_size=square' },
    { name: 'Halwa (Black Pomfret)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Black%20pomfret%20halwa%20fish&image_size=square' },
    { name: 'Kolkata Ilish Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hilsa%20ilish%20fish%20bengali&image_size=square' },
    { name: 'Betki Fish (Chaunak)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Betki%20chaunak%20fish&image_size=square' },
    { name: 'Hamoor Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Hamoor%20grouper%20fish&image_size=square' },
    { name: 'Bangda (Mackerel)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Bangda%20mackerel%20fish&image_size=square' },
    { name: 'Tarli Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tarli%20sardine%20fish&image_size=square' },
    { name: 'Kuppa Fish (Tuna)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tuna%20fish%20fresh&image_size=square' },
    { name: 'Rani Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Pink%20perch%20rani%20fish&image_size=square' },
    { name: 'Bombil (Bombay Duck)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Bombay%20duck%20bombil%20fish&image_size=square' },
    { name: 'Karli Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Cobia%20karli%20fish&image_size=square' },
    { name: 'Sakla (Bombay Maral)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Barracuda%20sakla%20fish&image_size=square' },
    { name: 'Singada Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Singada%20fish%20konkan&image_size=square' },
    { name: 'Toll Fish (Green Bone)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Green%20bone%20toll%20fish&image_size=square' },
    { name: 'Red Snapper', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Red%20snapper%20fish&image_size=square' },
    { name: 'Mandeli Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mandeli%20coastal%20fish&image_size=square' },
    { name: 'Kurchi Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Kurchi%20coastal%20fish&image_size=square' },
    { name: 'Chand Paplet', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Silver%20pomfret%20chand%20paplet&image_size=square' },
    { name: 'Karimi Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Karimi%20fish%20konkani&image_size=square' },
    { name: 'Shark Fish (Baby Shark)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Baby%20shark%20fish&image_size=square' },
    { name: 'Baam Fish (Black Baam)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Black%20eel%20baam%20fish&image_size=square' },
    { name: 'Pili Baam Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Yellow%20eel%20pili%20baam&image_size=square' },
    { name: 'Lep Fish (Sole Fish)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Sole%20fish%20lep%20flatfish&image_size=square' },
    { name: 'Kane Fish (Lady Fish)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Lady%20fish%20kane%20tenualosa&image_size=square' },
    { name: 'Tiny Prawn', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tiny%20prawns%20small%20shrimp&image_size=square' },
    { name: 'Squids', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20squids%20calamari&image_size=square' },
    { name: 'Mud Crabs', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Mud%20crabs%20seafood&image_size=square' },
    { name: 'Sea Crabs', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Sea%20crabs%20seafood&image_size=square' },
    { name: 'Oyster / Sneal', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Fresh%20oysters%20seafood&image_size=square' },
    { name: 'Rahu', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Rohu%20rahu%20freshwater%20fish&image_size=square' },
    { name: 'Katla', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Katla%20freshwater%20fish&image_size=square' },
    { name: 'River Surmai', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=River%20surmai%20freshwater%20fish&image_size=square' },
    { name: 'Pangaasiuss', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Basa%20pangasius%20fish&image_size=square' },
    { name: 'Tilapi', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Tilapia%20fish&image_size=square' },
    { name: 'Gawran Baam', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Freshwater%20eel%20gawran%20baam&image_size=square' },
    { name: 'Marla Fish', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Marla%20freshwater%20fish%20maharashtra&image_size=square' },
    { name: 'Tengda Fish (Kudlu Katarna)', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Freshwater%20catfish%20tengda&image_size=square' }
  ];
  
  let updated = 0;
  FISH_CATALOGUE.forEach(fish => {
    db.run('UPDATE products SET image_url = ? WHERE name = ?', [fish.image, fish.name], function(err) {
      if (err) {
        console.error(`Error updating ${fish.name}:`, err);
      } else {
        updated++;
      }
    });
  });
  
  res.json({ message: `Images seeded for ${updated} products!` });
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

  if (!name) {
    return res.status(400).json({ error: 'Product name required' });
  }

  // Check if we have an image URL or uploaded file
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  } else if (req.body.image_url) {
    imageUrl = req.body.image_url;
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

    // Determine new image URL: prioritize file upload, then req.body.image_url, then keep existing
    let imageUrl = product.image_url;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      imageUrl = req.body.image_url;
    }

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