# Project Structure & Architecture

```
godavari-fish/
├── backend/
│   ├── data/                          # Database directory
│   │   └── godavari.db               # SQLite database (auto-created)
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   ├── routes/                       # API route handlers (expandable)
│   ├── uploads/                      # Product images storage
│   ├── database.js                   # Database initialization & schema
│   ├── server.js                     # Express server setup & API endpoints
│   ├── package.json                  # Backend dependencies
│   ├── .env                          # Environment variables
│   └── sample_data.sql              # Sample data for database
│
├── frontend/
│   ├── public/                       # Static assets
│   │   └── vite.svg
│   ├── src/
│   │   ├── admin/
│   │   │   └── AdminPanel.jsx       # Admin dashboard component
│   │   ├── components/
│   │   │   ├── DailyRates.jsx       # Daily rates display
│   │   │   ├── FloatingButtons.jsx  # WhatsApp & Call buttons
│   │   │   ├── Footer.jsx           # Footer with business info
│   │   │   ├── Header.jsx           # Navigation header
│   │   │   ├── ReviewsSection.jsx   # Customer reviews display
│   │   │   └── ServicesSection.jsx  # Services showcase
│   │   ├── pages/
│   │   │   ├── AboutPage.jsx        # About us page
│   │   │   ├── ContactPage.jsx      # Contact form page
│   │   │   ├── HomePage.jsx         # Home page with hero
│   │   │   ├── RatesPage.jsx        # Daily rates page
│   │   │   └── WholesalePage.jsx    # Wholesale inquiries page
│   │   ├── utils/
│   │   │   └── api.js               # API client functions
│   │   ├── App.jsx                  # Main app component with routing
│   │   ├── App.css                  # App styles
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles with Tailwind
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Frontend dependencies
│   ├── .env.local                   # Frontend environment variables
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── eslint.config.js             # ESLint configuration
│   └── README.md                    # Frontend specific docs
│
├── README.md                        # Main project documentation
├── SETUP_GUIDE.md                  # Setup & configuration guide
├── DEPLOYMENT.md                   # Production deployment guide
├── .gitignore                      # Git ignore rules
└── PROJECT_STRUCTURE.md            # This file
```

## 🏗️ Architecture Overview

### Frontend Architecture (React + Vite)
```
User Browser
    ↓
React Router (Client-side routing)
    ↓
Pages (HomePage, AboutPage, etc.)
    ↓
Components (Header, Footer, etc.)
    ↓
API Client (src/utils/api.js)
    ↓
Backend API (http://localhost:5000/api)
```

### Backend Architecture (Express + SQLite)
```
HTTP Request
    ↓
CORS Middleware
    ↓
JSON Parser
    ↓
Route Handler
    ↓
Authentication (if needed)
    ↓
Database Query
    ↓
SQLite Database
    ↓
Response JSON
```

### Data Flow

#### Frontend to Backend
1. User interacts with UI component
2. Component calls API function (from api.js)
3. API makes HTTP request to backend
4. Backend receives, validates, processes
5. Database operation performed
6. Response sent back to frontend
7. Frontend state updated, UI re-renders

#### Admin Flow
1. Admin logs in (/admin)
2. JWT token stored in localStorage
3. Token sent with all admin requests
4. Backend verifies token with middleware
5. Only authenticated requests processed
6. Token expires in 24 hours

## 📁 Key Files Explained

### Backend

**database.js**
- Creates SQLite database connection
- Defines all table schemas
- Auto-initializes on server start
- Tables: products, rates, reviews, inquiries, admin_users, services, contact_requests

**server.js**
- Express app configuration
- CORS and middleware setup
- All API endpoints defined here
- Error handling and validation
- File upload handling

**middleware/auth.js**
- JWT token verification
- Extracts user ID from token
- Used for protected routes

### Frontend

**App.jsx**
- React Router setup
- All page routes defined
- Main layout structure

**main.jsx**
- React entry point
- Mounts React app to DOM

**api.js**
- Centralized API client
- All backend calls in one place
- Error handling
- Token management

**Pages/**
- HomePage: Business showcase
- AboutPage: Company info
- RatesPage: Daily rates
- WholesalePage: B2B inquiries
- ContactPage: Contact form
- AdminPanel: Admin dashboard (in admin/)

**Components/**
- Header: Navigation
- Footer: Contact info
- FloatingButtons: WhatsApp/Call
- DailyRates: Rates display
- ReviewsSection: Customer reviews
- ServicesSection: Services info

## 🗄️ Database Schema

### admin_users
- id (PK)
- username (UNIQUE)
- password (hashed)
- email
- created_at

### products
- id (PK)
- name
- description
- image_url
- created_at
- updated_at

### rates
- id (PK)
- product_id (FK)
- rate
- unit (kg/piece)
- availability (Available/Out of Stock)
- date
- created_at

### inquiries
- id (PK)
- name
- business_name
- mobile
- product_requirement
- quantity
- message
- status (pending/contacted/completed)
- created_at

### reviews
- id (PK)
- customer_name
- rating (1-5)
- review_text
- image_url
- is_visible (1/0)
- created_at

### contact_requests
- id (PK)
- name
- email
- mobile
- message
- created_at

### services
- id (PK)
- name
- description
- icon
- order_position
- created_at

## 🔄 API Endpoints Organization

### Public Endpoints (No Auth)
- GET /api/products
- GET /api/rates
- GET /api/reviews
- POST /api/inquiries
- POST /api/reviews
- POST /api/contact
- GET /api/health

### Protected Endpoints (JWT Required)
- POST /api/auth/login
- POST /api/products (admin)
- PUT /api/products/:id (admin)
- DELETE /api/products/:id (admin)
- POST /api/rates (admin)
- PUT /api/rates/:id (admin)
- GET /api/reviews/admin (admin)
- PUT /api/reviews/:id (admin)
- GET /api/inquiries (admin)
- PUT /api/inquiries/:id (admin)

## 🎨 Frontend Component Hierarchy

```
App
├── Header
│   └── Mobile Menu
├── Main Routes
│   ├── HomePage
│   │   ├── Hero Section
│   │   ├── Highlights
│   │   ├── ServicesSection
│   │   ├── DailyRates
│   │   ├── ReviewsSection
│   │   └── CTA Section
│   ├── AboutPage
│   │   ├── Story Section
│   │   ├── Quality Highlights
│   │   └── Map & Hours
│   ├── RatesPage
│   │   └── DailyRates Component
│   ├── WholesalePage
│   │   ├── Info Cards
│   │   └── Inquiry Form
│   ├── ContactPage
│   │   ├── Contact Info
│   │   ├── Contact Form
│   │   └── Map
│   └── AdminPanel
│       ├── Login Form
│       ├── Products Tab
│       ├── Rates Tab
│       ├── Inquiries Tab
│       └── Reviews Tab
├── Footer
└── FloatingButtons
```

## 🔐 Security Flow

```
User Login
    ↓
Verify Credentials (bcryptjs)
    ↓
Generate JWT Token
    ↓
Token Stored in localStorage
    ↓
Admin Request with Token
    ↓
Token Sent in Authorization Header
    ↓
Backend Verifies Token
    ↓
Decode User ID
    ↓
Allow/Deny Request
```

## 📱 Responsive Design Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

All components use Tailwind CSS responsive classes:
- `md:` prefix for tablet+
- `lg:` prefix for desktop+

## 🚀 Performance Optimizations

### Frontend
- Code splitting with React Router
- Lazy loading of images
- Optimized bundle size (~250KB gzipped)
- CSS minification via Tailwind

### Backend
- Efficient SQL queries with indexes
- Request validation before DB query
- Gzip compression for responses
- CORS configured for specific domains

## 🔄 Update Workflows

### Adding a New Product
1. Admin: Login → Go to Products tab
2. Admin: Click "Add Product" → Fill form → Upload image
3. Backend: Validate → Save to DB
4. Frontend: Refresh on new product

### Updating Daily Rates
1. Admin: Login → Go to Rates tab
2. Admin: Click "Update Rate" → Select product
3. Admin: Enter new rate → Select availability
4. Backend: Delete old rate → Save new rate
5. Frontend: Real-time update on rates page

### Managing Inquiries
1. Customer: Fill wholesale form → Submit
2. Backend: Save to DB → Email notification
3. Admin: Login → View inquiries
4. Admin: Click "Reply on WhatsApp"
5. WhatsApp opens with customer number

## 📊 Scalability Considerations

**Current Capacity**
- SQLite: ~10,000 records per table
- Concurrent users: ~50-100
- Requests/day: 10,000-50,000

**Scaling Points** (Future)
- Switch to PostgreSQL for better concurrency
- Add Redis for caching
- Implement pagination for large datasets
- Use CDN for images
- Separate upload service

## 🛠️ Development Workflow

1. Make changes in code
2. Frontend auto-reloads via Vite HMR
3. Backend auto-restarts (optional with nodemon)
4. Test in browser at localhost:5173
5. Admin test at localhost:5173/admin
6. Commit and push changes
7. Deploy automatically via CI/CD

---

For deployment details, see DEPLOYMENT.md
For setup instructions, see SETUP_GUIDE.md
