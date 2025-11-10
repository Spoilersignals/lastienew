# 🚀 START HERE - Campus Essentials Exchange

## Welcome! You have a complete, production-ready web application.

### ⚡ Quick Start (Choose One)

#### Option 1: Docker (Recommended - 30 seconds)
```bash
# Make sure Docker is installed and running
docker-compose up -d

# Wait 30 seconds, then open browser:
# http://localhost:3000
```

#### Option 2: Manual Setup (5 minutes)
```bash
# Terminal 1 - Backend
cd backend
npm install
cp .env.example .env
# Edit .env if needed
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

---

## 🎯 What You Can Do Right Now

### 1. Browse Items (No Login)
- Open http://localhost:3000
- Click "Browse Items"
- Search and filter

### 2. Login as Student
- Email: `alice@university.edu`
- Password: `password123`
- Post items, send messages

### 3. Login as Admin
- Email: `admin@university.edu`
- Password: `password123`
- Access admin dashboard

### 4. Register New Account
- Use any university email
- Example: `yourname@university.edu`, `test@college.edu`
- Must contain: .edu, .ac., university, or college

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **QUICKSTART.md** | Complete 5-minute setup guide |
| **README.md** | Full project documentation |
| **API_DOCUMENTATION.md** | All API endpoints explained |
| **DEPLOYMENT.md** | How to deploy to production |
| **FEATURES.md** | Complete feature list |
| **PROJECT_SUMMARY.md** | Project overview |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT + Bcrypt
- **Deploy:** Docker ready

---

## 📁 Project Structure

```
LASTIE/
├── backend/          # Express API server
├── frontend/         # React web app
├── README.md         # 👈 Read this for full docs
├── QUICKSTART.md     # 👈 Detailed setup guide
└── docker-compose.yml
```

---

## ✅ What's Included

✓ User authentication (register, login)  
✓ Item posting with images  
✓ Search & filter items  
✓ Direct messaging  
✓ Admin dashboard  
✓ Notifications  
✓ Mobile responsive  
✓ Complete documentation  
✓ Sample data included  
✓ Docker configuration  
✓ Deployment guides  

---

## 🎓 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | password123 |
| Student | alice@university.edu | password123 |
| Student | bob@college.edu | password123 |
| Student | carol@university.ac.uk | password123 |

---

## 🐛 Troubleshooting

**"Port already in use"**
- Stop other apps using ports 3000, 5000, or 5432
- Or change ports in .env files

**"Cannot connect to database"**
- Make sure PostgreSQL is running
- Check DATABASE_URL in backend/.env

**"Docker not starting"**
- Make sure Docker Desktop is running
- Try: `docker-compose down` then `docker-compose up -d`

**More help:** See [QUICKSTART.md](./QUICKSTART.md) troubleshooting section

---

## 🚀 Deploy to Production

Read [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step guides:

- **Render** (Free tier, easiest)
- **Vercel + Railway** (Serverless)
- **Docker on VPS** (DigitalOcean, AWS)
- **Heroku** (Git-based)
- **AWS EC2 + RDS** (Enterprise)

---

## 🎯 Next Steps

1. ✅ Run the application (see Quick Start above)
2. ✅ Test all features (see Demo Accounts)
3. ✅ Read [README.md](./README.md) for full overview
4. ✅ Explore the code structure
5. ✅ Customize for your needs
6. ✅ Deploy to production

---

## 📞 Need Help?

- 📖 **Documentation:** Read files listed above
- 🐛 **Issues:** Check troubleshooting sections
- 💬 **Questions:** See inline code comments
- 🔍 **API Reference:** API_DOCUMENTATION.md

---

## 💡 Quick Commands

```bash
# Start everything (Docker)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev

# Database GUI
cd backend && npx prisma studio

# Reset database
cd backend && npx prisma migrate reset
```

---

## 🎉 You're All Set!

This is a **complete, production-ready** application. Everything you need is included:

✅ Frontend & Backend  
✅ Database schema  
✅ Authentication system  
✅ Admin panel  
✅ Full documentation  
✅ Docker setup  
✅ Deployment guides  
✅ Sample data  

**Now go build something amazing!** 🚀

---

**Questions?** Start with [QUICKSTART.md](./QUICKSTART.md) or [README.md](./README.md)
