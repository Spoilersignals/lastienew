# 💿 Installation Guide - Campus Essentials Exchange

Complete step-by-step installation guide for Windows.

---

## 📋 Prerequisites Check

Before starting, make sure you have:

### Required
- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/) OR Docker
- ✅ **Git** (if cloning) - [Download](https://git-scm.com/)

### Optional
- **Docker Desktop** - [Download](https://www.docker.com/) (easiest option)
- **VS Code** - [Download](https://code.visualstudio.com/) (recommended editor)

---

## 🚀 Installation Methods

Choose the method that works best for you:

### Method 1: Automated Windows Setup (Easiest)
### Method 2: Docker Setup (Fastest)
### Method 3: Manual Setup (Most Control)

---

## 🎯 Method 1: Automated Windows Setup

### Step 1: Open Command Prompt
- Press `Win + R`
- Type `cmd` and press Enter
- Navigate to project folder: `cd C:\Users\pesak\Desktop\LASTIE`

### Step 2: Run Setup Script
```bash
setup.bat
```

This will:
- Check Node.js and npm
- Install all dependencies
- Create .env files

### Step 3: Start PostgreSQL

**Option A: Using Docker (Recommended)**
```bash
docker run --name campus-postgres -e POSTGRES_USER=campus_user -e POSTGRES_PASSWORD=campus_pass -e POSTGRES_DB=campus_exchange -p 5432:5432 -d postgres:15-alpine
```

**Option B: Using Local PostgreSQL**
- Open pgAdmin or psql
- Create database named `campus_exchange`
- Update `backend\.env` with your credentials

### Step 4: Setup Database
```bash
db-setup.bat
```

This will:
- Generate Prisma client
- Run database migrations
- Seed with sample data

### Step 5: Start Application
```bash
start-dev.bat
```

This opens two command windows:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

### ✅ Done! Open http://localhost:3000

---

## 🐳 Method 2: Docker Setup

### Prerequisites
- Docker Desktop installed and running

### Step 1: Open Command Prompt
```bash
cd C:\Users\pesak\Desktop\LASTIE
```

### Step 2: Start Everything
```bash
docker-compose up -d
```

### Step 3: Wait 30 seconds
Docker will:
- Download images
- Start PostgreSQL
- Build backend
- Build frontend
- Run migrations

### Step 4: Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: localhost:5432

### Useful Docker Commands
```bash
# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Restart
docker-compose restart

# Rebuild
docker-compose up -d --build
```

---

## 🔧 Method 3: Manual Setup

### Step 1: Install Backend Dependencies

Open **Command Prompt #1**:
```bash
cd C:\Users\pesak\Desktop\LASTIE\backend
npm install
```

### Step 2: Configure Backend Environment

```bash
# Create .env file
copy .env.example .env

# Edit .env file with your values
notepad .env
```

**backend\.env:**
```env
DATABASE_URL="postgresql://campus_user:campus_pass@localhost:5432/campus_exchange"
JWT_SECRET="your-random-secret-key-here"
PORT=5000
```

### Step 3: Setup Database

Make sure PostgreSQL is running, then:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npm run seed
```

### Step 4: Start Backend
```bash
npm run dev
```

Backend is now running on **http://localhost:5000** ✅

---

### Step 5: Install Frontend Dependencies

Open **Command Prompt #2** (new window):
```bash
cd C:\Users\pesak\Desktop\LASTIE\frontend
npm install
```

### Step 6: Configure Frontend Environment

```bash
# Create .env file
copy .env.example .env

# Edit if needed (default should work)
notepad .env
```

**frontend\.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 7: Start Frontend
```bash
npm run dev
```

Frontend is now running on **http://localhost:3000** ✅

---

## 🧪 Verify Installation

### 1. Check Backend Health
Open browser: http://localhost:5000/api/health

Should see:
```json
{
  "status": "ok",
  "message": "Campus Exchange API is running"
}
```

### 2. Check Frontend
Open browser: http://localhost:3000

Should see the home page.

### 3. Test Login
Try logging in with demo account:
- Email: `alice@university.edu`
- Password: `password123`

---

## 🎓 Demo Accounts

After running the seed script, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@university.edu | password123 |
| **Student** | alice@university.edu | password123 |
| **Student** | bob@college.edu | password123 |
| **Student** | carol@university.ac.uk | password123 |

---

## 🐛 Troubleshooting

### Problem: "Node.js not found"
**Solution:** 
- Install Node.js 18+ from https://nodejs.org/
- Restart Command Prompt
- Verify: `node --version`

---

### Problem: "Cannot connect to database"
**Solutions:**

1. **Check PostgreSQL is running**
   ```bash
   # For Docker
   docker ps
   
   # Should see campus-postgres
   ```

2. **Verify DATABASE_URL**
   - Open `backend\.env`
   - Make sure connection string is correct
   - Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

3. **Test connection**
   ```bash
   cd backend
   npx prisma studio
   # Opens http://localhost:5555 if connection works
   ```

---

### Problem: "Port already in use"

**For Port 5000 (Backend):**
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**For Port 3000 (Frontend):**
- Vite will automatically ask to use port 3001
- Or manually kill process like above

---

### Problem: "Prisma migrate failed"

**Solution:**
```bash
cd backend

# Reset database
npx prisma migrate reset

# Or create new migration
npx prisma migrate dev --name init

# Reseed
npm run seed
```

---

### Problem: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
cd backend
rmdir /s /q node_modules
del package-lock.json
npm install

# Repeat for frontend
cd ..\frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

### Problem: Docker issues

**Solutions:**

1. **Docker not starting:**
   - Make sure Docker Desktop is running
   - Check system tray for Docker icon

2. **Containers won't start:**
   ```bash
   # Remove everything and try again
   docker-compose down -v
   docker-compose up -d --build
   ```

3. **View detailed logs:**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs postgres
   ```

---

## 🔍 Database Tools

### Prisma Studio (Visual Database Editor)
```bash
cd backend
npx prisma studio
```
Opens at http://localhost:5555

### pgAdmin (PostgreSQL GUI)
If you installed PostgreSQL locally:
1. Open pgAdmin
2. Connect to server
3. Browse `campus_exchange` database

### Command Line (psql)
```bash
# Connect to database
psql -h localhost -U campus_user -d campus_exchange

# List tables
\dt

# Query users
SELECT * FROM users;

# Exit
\q
```

---

## 📦 Production Build

### Build Backend
```bash
cd backend
npm run build
# Creates dist/ folder
```

### Build Frontend
```bash
cd frontend
npm run build
# Creates dist/ folder
```

### Preview Production Build
```bash
cd frontend
npm run preview
```

---

## 🔄 Reset Everything

### Reset Database Only
```bash
cd backend
npx prisma migrate reset
npm run seed
```

### Reset Everything (Fresh Start)
```bash
# Stop servers (Ctrl+C in command windows)

# Delete all dependencies
rmdir /s /q backend\node_modules
rmdir /s /q frontend\node_modules

# Delete build artifacts
rmdir /s /q backend\dist
rmdir /s /q frontend\dist

# Reinstall
cd backend
npm install
cd ..\frontend
npm install

# Recreate database
cd ..\backend
npx prisma migrate reset
npm run seed
```

---

## 📚 Next Steps After Installation

1. ✅ **Explore the Application**
   - Browse items
   - Create account
   - Post items
   - Send messages
   - Try admin panel

2. ✅ **Read Documentation**
   - [START_HERE.md](./START_HERE.md) - Quick overview
   - [README.md](./README.md) - Full documentation
   - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

3. ✅ **Customize**
   - Change colors in `frontend/tailwind.config.js`
   - Add features
   - Modify database schema

4. ✅ **Deploy**
   - See [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Choose platform (Render, Vercel, Docker, etc.)

---

## 🆘 Still Having Issues?

### Check These Files:
1. `backend\.env` - Database connection correct?
2. `frontend\.env` - API URL correct?
3. `backend\prisma\schema.prisma` - Database schema

### Common File Paths on Windows:
- Project root: `C:\Users\pesak\Desktop\LASTIE`
- Backend: `C:\Users\pesak\Desktop\LASTIE\backend`
- Frontend: `C:\Users\pesak\Desktop\LASTIE\frontend`

### Verify Setup:
```bash
# Check if backend is accessible
curl http://localhost:5000/api/health

# Check if frontend is built
dir frontend\dist

# Check database tables
cd backend
npx prisma studio
```

---

## ✅ Installation Checklist

Complete this checklist to ensure proper setup:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL running (Docker or local)
- [ ] Backend dependencies installed (`backend\node_modules` exists)
- [ ] Frontend dependencies installed (`frontend\node_modules` exists)
- [ ] Backend `.env` file exists and configured
- [ ] Frontend `.env` file exists
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] Database seeded (`npm run seed`)
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can login with demo account

---

**Installation complete! Happy coding! 🎉**

For more help, see [START_HERE.md](./START_HERE.md) or [QUICKSTART.md](./QUICKSTART.md)
