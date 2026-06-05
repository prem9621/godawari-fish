# Quick Reference Guide

## 🚀 Quick Start (5 minutes)

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# Frontend runs on http://localhost:5173
```

### Access Points
- 🏠 Home: http://localhost:5173
- 🔐 Admin: http://localhost:5173/admin (admin/admin)
- 📡 API: http://localhost:5000/api

---

## 👨‍💻 Admin Login

**Default Credentials:**
- Username: `admin`
- Password: `admin`

⚠️ **Change in production!**

---

## 🔧 Common Tasks

### Add a Product
```bash
# Manual - No UI yet, use curl:
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pomfret",
    "description": "Premium white fish"
  }'
```

### Update Daily Rates
```bash
curl -X POST http://localhost:5000/api/rates \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "rate": 400,
    "unit": "kg",
    "availability": "Available"
  }'
```

### Get Today's Rates
```bash
curl http://localhost:5000/api/rates
```

### View All Inquiries (Admin)
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/inquiries
```

---

## 📂 Key Files to Edit

| File | Purpose |
|------|---------|
| `backend/.env` | Backend config (port, DB, JWT) |
| `frontend/.env.local` | Frontend API URL |
| `backend/server.js` | API endpoints & middleware |
| `backend/database.js` | Database schema |
| `frontend/src/App.jsx` | Page routes |
| `frontend/src/pages/HomePage.jsx` | Home page content |

---

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### "Module not found"
```bash
# Backend
cd backend && npm install

# Frontend (use legacy peer deps)
cd frontend && npm install --legacy-peer-deps
```

### "Database locked"
```bash
# Delete old database
rm backend/data/godavari.db

# Restart backend
npm start
```

### "CORS error"
- Check frontend .env.local has correct API URL
- Check backend allows that frontend URL

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=secret_key
DATABASE_PATH=./data/godavari.db
ADMIN_EMAIL=godawarifish189@gmail.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 Pages & Routes

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Main page |
| About | `/about` | Company info |
| Rates | `/rates` | Daily rates |
| Wholesale | `/wholesale` | B2B inquiries |
| Contact | `/contact` | Contact form |
| Admin | `/admin` | Admin panel |

---

## 📲 Features by Page

### 🏠 Home
- Hero banner
- Business highlights
- Services section
- Today's rates preview
- Customer reviews
- Call-to-action buttons

### 📖 About
- Company story
- Quality commitments
- Business hours
- Location map
- Contact info

### 💰 Rates
- All products with images
- Current rates (₹/kg)
- Availability status
- Order buttons

### 🏢 Wholesale
- Inquiry form
- Target customers list
- WhatsApp integration

### 📞 Contact
- Contact form
- Phone/WhatsApp buttons
- Email
- Hours
- Location map

### 🔐 Admin Panel
- Product management (CRUD)
- Daily rate updates
- Inquiry management
- Review management

---

## 🎯 Business Information

**Business Name:** Godavari Fish  
**Owner:** Sameer Qureshi & Brothers  
**Phone:** +91 9371306189  
**Email:** godawarifish189@gmail.com  
**Address:** Central Naka, Near MGM Hospital, Chhatrapati Sambhaji Nagar, Maharashtra  

**Hours:**
- Weekdays: 6:00 AM - 9:00 PM
- Saturday: 6:00 AM - 10:00 PM
- Sunday: 7:00 AM - 9:00 PM

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Change admin credentials
- [ ] Generate strong JWT_SECRET
- [ ] Test all features locally
- [ ] Optimize images
- [ ] Check mobile responsiveness
- [ ] Update API URLs

### Backend (Render)
- [ ] Push code to GitHub
- [ ] Connect Render
- [ ] Set environment variables
- [ ] Enable persistent disk
- [ ] Test API endpoints

### Frontend (Vercel)
- [ ] Push code to GitHub
- [ ] Connect Vercel
- [ ] Set VITE_API_URL
- [ ] Test all pages
- [ ] Setup custom domain

---

## 📊 Database Tables

```
admin_users      → Admin credentials
products         → Fish/seafood items
rates            → Daily prices
inquiries        → Wholesale requests
reviews          → Customer feedback
contact_requests → Contact form submissions
services         → Service types
```

---

## 🔑 API Response Format

### Success (200)
```json
{
  "id": 1,
  "name": "Pomfret",
  "status": "success"
}
```

### Error (4xx/5xx)
```json
{
  "error": "Error message here"
}
```

### List Response
```json
[
  { "id": 1, "name": "Pomfret" },
  { "id": 2, "name": "Surmai" }
]
```

---

## 🎨 Colors Used

- **Primary Blue:** #0066cc (Ocean)
- **Accent Aqua:** #00d4ff
- **Success Green:** #10b981
- **Warning Yellow:** #f59e0b
- **Error Red:** #ef4444
- **Gray:** #6b7280

---

## 📱 Mobile Features

- Responsive navigation menu
- Touch-friendly buttons
- Optimized images
- Fast loading
- Floating action buttons (always visible)
- Readable text on all devices

---

## ⚙️ System Requirements

- Node.js 16+
- npm or yarn
- Modern web browser
- 200MB disk space (with uploads)

---

## 📚 Documentation Files

- `README.md` - Main documentation
- `SETUP_GUIDE.md` - Setup instructions
- `DEPLOYMENT.md` - Deployment guide
- `PROJECT_STRUCTURE.md` - Architecture details
- `QUICK_REFERENCE.md` - This file

---

## 🤝 Support

For issues or questions:
1. Check documentation files
2. Review error logs
3. Check API responses
4. Test with curl commands
5. Contact developer

---

## 📝 Version Info

- **Frontend:** React 19, Vite 8, Tailwind CSS 3
- **Backend:** Node.js, Express 5, SQLite 3
- **Last Updated:** June 2026

---

**Happy coding! 🚀**
