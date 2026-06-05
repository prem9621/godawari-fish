# Godavari Fish - Business Website

A modern, professional, mobile-friendly seafood business website built with React, Node.js, Express, and SQLite. Features daily rate management, wholesale inquiry system, and admin panel.

## 🌐 Live Demo

- Frontend: (Deploy to Vercel)
- Backend: (Deploy to Render)

## ✨ Features

### Public Pages
- **Home Page**: Hero section, business highlights, featured products, reviews, and CTAs
- **About Us**: Company history, quality commitment, business hours, location map
- **Daily Rates**: Fresh stock with daily price updates, availability status, order buttons
- **Wholesale & Bulk Supply**: Inquiry form for restaurants, hotels, catering businesses
- **Contact Us**: Contact form, location map, business hours, social links

### Admin Panel
- **Product Management**: Add, edit, delete products with images
- **Rate Management**: Update daily rates and availability status
- **Inquiry Management**: View and respond to wholesale inquiries
- **Review Management**: Show/hide customer reviews

### Special Features
- ✅ Floating WhatsApp and Call buttons on every page
- ✅ Custom cutting services information
- ✅ Customer reviews section
- ✅ Google Maps integration
- ✅ Responsive design (mobile-first)
- ✅ JWT authentication for admin panel
- ✅ Real-time rate updates
- ✅ Image upload for products

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vite** - Build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** - Lightweight database
- **JWT** - Authentication
- **Multer** - File upload handling
- **Bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
DATABASE_PATH=./data/godavari.db
ADMIN_EMAIL=godawarifish189@gmail.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

4. Start the server:
```bash
npm start
# or for development with auto-restart
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🗄️ Database Schema

### Tables
- **admin_users** - Admin credentials and info
- **products** - Fish and seafood products
- **rates** - Daily rates and availability
- **inquiries** - Wholesale inquiries
- **reviews** - Customer reviews
- **contact_requests** - Contact form submissions
- **services** - Service offerings

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Rates
- `GET /api/rates` - Get today's rates
- `GET /api/rates/history/:productId` - Get rate history
- `POST /api/rates` - Create/update rate (admin)
- `PUT /api/rates/:id` - Update rate (admin)

### Reviews
- `GET /api/reviews` - Get visible reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/admin` - Get all reviews (admin)
- `PUT /api/reviews/:id` - Toggle review visibility (admin)

### Inquiries
- `POST /api/inquiries` - Submit wholesale inquiry
- `GET /api/inquiries` - Get all inquiries (admin)
- `PUT /api/inquiries/:id` - Update inquiry status (admin)

### Contact
- `POST /api/contact` - Submit contact form

## 🎨 Design

### Color Scheme
- **Primary**: Ocean Blue (#0066cc)
- **Accent**: Aqua (#00d4ff)
- **Background**: White & Light Gray
- **Text**: Dark Gray

### Components
- Responsive header with mobile menu
- Floating action buttons (WhatsApp, Call)
- Card-based layouts
- Interactive forms
- Modal dialogs
- Table views (admin)

## 📱 Pages

### Public Routes
- `/` - Home page
- `/about` - About us
- `/rates` - Daily rates
- `/wholesale` - Wholesale inquiries
- `/contact` - Contact us

### Admin Routes
- `/admin` - Admin login & panel

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variable in Vercel:
```
VITE_API_URL=https://your-backend.onrender.com/api
```

### Backend (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables:
   - PORT=5000
   - JWT_SECRET=(generate strong secret)
   - DATABASE_PATH=./data/godavari.db
4. Deploy

## 📝 Admin Login

Default credentials (CHANGE IN PRODUCTION):
- Username: `admin`
- Password: `admin`

### Admin Panel Features
1. **Product Management**
   - Add new fish/seafood products
   - Upload product images
   - Edit product details
   - Delete products

2. **Daily Rate Updates**
   - Set rates for each product
   - Update availability status
   - View rate history

3. **Wholesale Inquiries**
   - View customer inquiries
   - Contact details for follow-up
   - WhatsApp integration

4. **Review Management**
   - View customer reviews
   - Hide/show reviews on public site

## 🔒 Security

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS configuration
- Environment variables for sensitive data
- Input validation on all endpoints

## 📞 Contact Information

- **Business Name**: Godavari Fish
- **Owner**: Sameer Qureshi & Brothers
- **Phone**: +91 9371306189
- **Email**: godawarifish189@gmail.com
- **Address**: Central Naka, Near MGM Hospital, Chhatrapati Sambhaji Nagar, Maharashtra

## 📄 License

All rights reserved © 2024 Godavari Fish

## 🤝 Support

For technical issues or feature requests, contact the development team.

---

**Built with ❤️ for Godavari Fish**
