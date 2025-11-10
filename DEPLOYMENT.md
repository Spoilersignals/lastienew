# 🚀 Deployment Guide

Complete guide for deploying Campus Essentials Exchange to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] Change all default passwords and secrets
- [ ] Update CORS origins for production
- [ ] Configure environment variables
- [ ] Test application locally
- [ ] Set up database backups
- [ ] Configure file storage (if using cloud)
- [ ] Set up monitoring and logging

## 🎯 Quick Deploy Options

### Option 1: Render (Recommended - Easiest)

**Render** offers free tier and easy PostgreSQL integration.

#### Deploy Backend

1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** campus-exchange-backend
   - **Root Directory:** backend
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`
   - **Environment:** Node

5. Add environment variables:
   ```
   DATABASE_URL=<provided-by-render-postgres>
   JWT_SECRET=<generate-random-secret>
   PORT=5000
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. Create PostgreSQL database:
   - Click "New +" → "PostgreSQL"
   - Copy internal database URL to `DATABASE_URL`

#### Deploy Frontend

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure:
   - **Root Directory:** frontend
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** dist

4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

5. Deploy!

---

### Option 2: Railway

**Railway** is developer-friendly with PostgreSQL included.

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select repository
4. Railway auto-detects services

**Configure Backend:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "cd backend && npx prisma migrate deploy && npm start"
  }
}
```

**Add Database:**
- Click "+ New" → "Database" → "PostgreSQL"
- Connect to backend service

**Configure Frontend:**
- Automatic build detection
- Add `VITE_API_URL` environment variable

---

### Option 3: Docker on VPS (DigitalOcean, AWS, etc.)

#### 1. Set Up VPS

**DigitalOcean Droplet:**
```bash
# Create Ubuntu 22.04 droplet (at least 2GB RAM)
# SSH into server
ssh root@your-server-ip
```

#### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt-get update
apt-get install docker-compose-plugin
```

#### 3. Clone and Configure

```bash
# Clone repository
git clone <your-repo-url>
cd campus-exchange

# Create production .env files
cd backend
cat > .env << EOF
DATABASE_URL="postgresql://campus_user:CHANGE_THIS_PASSWORD@postgres:5432/campus_exchange"
JWT_SECRET="GENERATE_RANDOM_SECRET_HERE"
PORT=5000
FRONTEND_URL=https://yourdomain.com
EOF

cd ../frontend
cat > .env << EOF
VITE_API_URL=https://api.yourdomain.com
EOF
```

#### 4. Create Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: campus_user
      POSTGRES_PASSWORD: CHANGE_THIS_PASSWORD
      POSTGRES_DB: campus_exchange
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  backend:
    build:
      context: ./backend
    restart: always
    environment:
      DATABASE_URL: postgresql://campus_user:CHANGE_THIS_PASSWORD@postgres:5432/campus_exchange
      JWT_SECRET: GENERATE_RANDOM_SECRET_HERE
      PORT: 5000
    depends_on:
      - postgres
    networks:
      - app-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`api.yourdomain.com`)"

  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_URL: https://api.yourdomain.com
    restart: always
    networks:
      - app-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`yourdomain.com`)"

  traefik:
    image: traefik:v2.10
    restart: always
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.email=your@email.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

#### 5. Deploy

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed database (optional)
docker-compose -f docker-compose.prod.yml exec backend npm run seed
```

#### 6. Set Up Domain

1. Point your domain A records to server IP:
   - `yourdomain.com` → `server-ip`
   - `api.yourdomain.com` → `server-ip`

2. SSL certificates will be auto-generated by Traefik

---

### Option 4: Heroku

#### Backend

```bash
cd backend

# Create Heroku app
heroku create campus-exchange-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET="your-secret"
heroku config:set FRONTEND_URL="https://your-frontend.herokuapp.com"

# Create Procfile
echo "web: npx prisma migrate deploy && npm start" > Procfile

# Deploy
git subtree push --prefix backend heroku main

# Run migrations
heroku run npx prisma migrate deploy
heroku run npm run seed
```

#### Frontend

```bash
cd frontend

# Create app
heroku create campus-exchange-web

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Add environment variable
heroku config:set VITE_API_URL="https://campus-exchange-api.herokuapp.com/api"

# Deploy
git subtree push --prefix frontend heroku main
```

---

### Option 5: AWS EC2 + RDS

#### 1. Create RDS PostgreSQL Instance

1. Go to AWS RDS Console
2. Create PostgreSQL 15 database
3. Note down endpoint and credentials

#### 2. Create EC2 Instance

1. Launch Ubuntu 22.04 instance (t2.medium)
2. Configure security groups:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 22 (SSH)

#### 3. Deploy Application

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@ec2-ip

# Install dependencies
sudo apt update
sudo apt install -y nodejs npm nginx certbot python3-certbot-nginx

# Clone and build
git clone <repo-url>
cd campus-exchange

# Backend
cd backend
npm install
npx prisma generate
npm run build

# Create systemd service
sudo nano /etc/systemd/system/campus-backend.service
```

**Service file:**
```ini
[Unit]
Description=Campus Exchange Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/campus-exchange/backend
Environment="DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/campus"
Environment="JWT_SECRET=your-secret"
Environment="PORT=5000"
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl enable campus-backend
sudo systemctl start campus-backend

# Frontend
cd ../frontend
npm install
npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/campus-exchange
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /home/ubuntu/campus-exchange/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/campus-exchange /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Set up SSL
sudo certbot --nginx -d yourdomain.com
```

---

## 🔐 Security Hardening

### Production Environment Variables

**Backend (.env):**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="<generate-64-char-random-string>"
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com

# Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=app-password
```

**Frontend (.env):**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Generate Secure Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

### Database Security

1. **Use strong passwords**
2. **Enable SSL connections**
3. **Regular backups:**
   ```bash
   # Backup
   pg_dump -h localhost -U campus_user campus_exchange > backup.sql
   
   # Restore
   psql -h localhost -U campus_user campus_exchange < backup.sql
   ```
4. **Limit connections**
5. **Use read replicas for scaling**

---

## 📊 Monitoring & Logging

### Application Monitoring

**Add Sentry (Error Tracking):**

```bash
npm install @sentry/node @sentry/react
```

**Backend:**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**Frontend:**
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
});
```

### Log Management

**PM2 for Process Management:**
```bash
npm install -g pm2

# Start app
pm2 start npm --name "campus-backend" -- start

# View logs
pm2 logs

# Monitor
pm2 monit

# Save configuration
pm2 save
pm2 startup
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/campus-exchange
            git pull origin main
            docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🧪 Health Checks

**Backend health endpoint:**
```typescript
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});
```

**Monitor with uptime services:**
- UptimeRobot
- Pingdom
- StatusCake

---

## 📞 Support

For deployment issues:
- Check application logs
- Verify environment variables
- Test database connection
- Check firewall rules
- Review DNS settings

Need help? Open an issue on GitHub!
