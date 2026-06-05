# Production Deployment Configuration

## Environment Variables for Production

### Backend (.env for production on Render)
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_very_secure_jwt_secret_key_here_minimum_32_characters
DATABASE_PATH=/var/data/godavari.db
ADMIN_EMAIL=godawarifish189@gmail.com
ADMIN_USERNAME=admin_production_username
ADMIN_PASSWORD=your_secure_production_password
FRONTEND_URL=https://your-godavari-domain.com
```

### Frontend (.env.production for Vercel)
```env
VITE_API_URL=https://your-api-backend.onrender.com/api
```

## Deployment Steps

### Backend on Render

1. **Prepare GitHub Repository**
   - Push backend code to GitHub
   - Include .gitignore with `node_modules/`, `*.db`, `.env`

2. **Create Render Service**
   - Go to https://render.com
   - New → Web Service
   - Connect GitHub repository
   - Select backend folder
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables in Render**
   - Dashboard → Environment
   - Add all variables from .env

4. **Database**
   - SQLite will use /var/data/godavari.db
   - Enable Persistent Disk in Render settings

### Frontend on Vercel

1. **Prepare GitHub Repository**
   - Push frontend code to GitHub

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import repository
   - Select frontend folder
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   - Settings → Environment Variables
   - Add VITE_API_URL

4. **Custom Domain**
   - Add your domain in Vercel settings
   - Update DNS records

## Security Checklist

- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
- [ ] Enable HTTPS (automatic on Vercel & Render)
- [ ] Configure CORS properly for production domain
- [ ] Set NODE_ENV=production
- [ ] Enable database backups
- [ ] Setup monitoring/logging
- [ ] Configure rate limiting
- [ ] Setup SSL certificates
- [ ] Enable security headers

## Performance Optimization

### Frontend
```bash
# Build optimized version
npm run build

# Check bundle size
npm run build -- --analyze
```

### Backend
- Enable gzip compression
- Setup CDN for static files
- Enable database indexing
- Setup caching

## Monitoring & Logging

### Render Console
- Check application logs in Render dashboard
- Monitor CPU and memory usage
- Setup alerts for errors

### Vercel Analytics
- Monitor frontend performance
- Track Core Web Vitals
- View deployment logs

## Database Backup Strategy

### Render
1. Enable Persistent Disk
2. Daily automated backups
3. Download backups regularly
4. Test restore procedures

### Manual Backup
```bash
# Download database from server
render run --service-id <service-id> --command "sqlite3 /var/data/godavari.db .dump > backup.sql"
```

## SSL/HTTPS Configuration

- **Vercel**: Automatic (*.vercel.app)
- **Render**: Automatic (*.onrender.com)
- **Custom Domain**: Setup SSL certificate
  - Free: Let's Encrypt (automatic)
  - Paid: Cloudflare SSL

## CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
```

## Email Notifications

Setup email for:
- Admin inquiries
- New reviews
- Important alerts

Configure using a service like:
- SendGrid
- Mailgun
- AWS SES

## Scaling Considerations

### Current Setup
- SQLite on single server
- Suitable for: Small to medium businesses
- Expected capacity: 10K-100K requests/day

### Future Scaling
- Migrate to PostgreSQL
- Use CDN (Cloudflare)
- Implement API rate limiting
- Add Redis caching
- Setup load balancing

## Cost Estimation

### Monthly Costs (Production)
- **Vercel Frontend**: $0-20 (free tier available)
- **Render Backend**: $15-100 (basic to standard)
- **Domain**: $10-15/year
- **Email Service**: $0-50 (free tier available)
- **Total**: ~$15-100/month

## Troubleshooting Production Issues

### Database Connection Errors
- Check DATABASE_PATH in Render Persistent Disk
- Verify environment variables

### CORS Errors
- Check FRONTEND_URL in backend .env
- Verify frontend API URL configuration

### API Timeout
- Increase Render timeout settings
- Optimize database queries
- Add caching

### Frontend Build Fails
- Clear .next or build cache
- Check node version compatibility
- Verify all dependencies are installed

## Maintenance Schedule

- **Weekly**: Review error logs, monitor performance
- **Monthly**: Update dependencies, security patches
- **Quarterly**: Database optimization, performance review
- **Yearly**: Security audit, disaster recovery test

## Support Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Express.js: https://expressjs.com
- React: https://react.dev
- SQLite: https://www.sqlite.org/docs.html
