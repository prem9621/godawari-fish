# Setup & Configuration Guide

## Quick Start

### 1. Backend Server (Terminal 1)
```bash
cd backend
npm install
npm start
```
Server runs on: http://localhost:5000

### 2. Frontend Server (Terminal 2)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Frontend runs on: http://localhost:5173

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
DATABASE_PATH=./data/godavari.db
ADMIN_EMAIL=godawarifish189@gmail.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## Admin Panel Access

### Default Credentials
- **Username**: admin
- **Password**: admin

### Access Admin Panel
1. Go to http://localhost:5173/admin
2. Login with above credentials
3. You can now manage products, rates, reviews, and inquiries

## Adding Sample Data

### Add Products
1. Login to admin panel
2. Go to "Products" tab
3. Click "Add Product"
4. Fill in product details:
   - Name: Pomfret
   - Description: Premium white fish
   - Upload image (optional)

### Update Daily Rates
1. Go to "Rates" tab
2. Click "Add/Update Rate"
3. Select product and enter:
   - Rate: 400 (per kg)
   - Unit: kg
   - Availability: Available

### View Inquiries
1. Go to "Inquiries" tab
2. See all wholesale inquiries
3. Click "Reply on WhatsApp" to contact customers

## Default Products to Add

```
1. Pomfret - Premium white fish - ₹400/kg
2. Surmai - King fish - ₹350/kg
3. Prawns - Fresh prawns - ₹450/kg
4. Rohu - Freshwater fish - ₹200/kg
5. Katla - Golden fish - ₹180/kg
6. Badshah Fish - Premium variety - ₹500/kg
```

## Features Walkthrough

### Home Page
- Hero banner with business info
- Highlights: Experience, Fresh, Customers, Support
- Services section
- Today's rates preview
- Customer reviews
- Call-to-action buttons

### Daily Rates Page
- Shows today's fresh stock
- Real-time rates update
- Availability status (Available/Out of Stock)
- Order on WhatsApp buttons

### Wholesale Page
- Form to submit inquiries
- Target customers info
- WhatsApp integration

### Contact Us
- Contact form
- Business hours
- Location map
- Social contact options

### Admin Panel
- Product management (CRUD)
- Rate management
- Inquiry management
- Review management

## Floating Buttons
- Green WhatsApp button (bottom right)
- Blue Call button (bottom right)
- Visible on all pages
- Pre-filled with business info

## API Testing

### Test Backend Health
```bash
curl http://localhost:5000/api/health
```

### Test Get Products
```bash
curl http://localhost:5000/api/products
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

## Troubleshooting

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Kill process on port 5173

### Database Issues
- Delete `backend/data/godavari.db`
- Restart backend to reinitialize

### CORS Errors
- Ensure frontend .env has correct API URL
- Check backend CORS configuration

### Module Not Found
- Run `npm install` in respective directory
- Use `npm install --legacy-peer-deps` for frontend

## Production Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect repo to Vercel
3. Set `VITE_API_URL` to production backend URL

### Backend (Render)
1. Push to GitHub
2. Connect repo to Render
3. Set environment variables
4. Deploy

## Mobile Responsive Design
- ✅ Mobile-first approach
- ✅ Touch-friendly buttons
- ✅ Responsive navigation
- ✅ Optimized images
- ✅ Fast loading times

## Important Notes
- ⚠️ Change admin password in production
- ⚠️ Use strong JWT_SECRET in production
- ⚠️ Configure CORS for production domains
- ⚠️ Use HTTPS in production
- ⚠️ Regular database backups

## Support
For issues or questions, refer to the main README.md
