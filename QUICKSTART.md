# ⚡ Quick Start Guide

Get Campus Essentials Exchange running in 5 minutes!

## 🎯 Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 15+** ([Download](https://www.postgresql.org/download/)) OR **Docker** ([Download](https://www.docker.com/))

---

## 🚀 Fastest Way: Docker (Recommended)

### 1. Clone Repository
```bash
git clone <repository-url>
cd LASTIE
```

### 2. Start Everything with Docker
```bash
docker-compose up -d
```

That's it! 🎉

### 3. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Database:** localhost:5432

### 4. Login with Demo Accounts
- **Admin:** admin@university.edu / password123
- **Student:** alice@university.edu / password123

---

## 💻 Manual Setup (Without Docker)

### Step 1: Start PostgreSQL

**Option A: Local PostgreSQL**
```bash
# Create database
createdb campus_exchange

# Or with psql
psql -U postgres
CREATE DATABASE campus_exchange;
\q
```

**Option B: Docker PostgreSQL Only**
```bash
docker run --name campus-postgres \
  -e POSTGRES_USER=campus_user \
  -e POSTGRES_PASSWORD=campus_pass \
  -e POSTGRES_DB=campus_exchange \
  -p 5432:5432 \
  -d postgres:15-alpine
```

---

### Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://campus_user:campus_pass@localhost:5432/campus_exchange"
# JWT_SECRET="your-secret-key"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

Backend runs on **http://localhost:5000** ✅

---

### Step 3: Setup Frontend

**Open a NEW terminal:**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on **http://localhost:3000** ✅

---

## 🧪 Test the Application

### 1. Open Browser
Navigate to http://localhost:3000

### 2. Try These Actions

**Browse Items (No Login Required)**
- View all available items
- Search and filter by category
- Click on items to view details

**Login as Student**
- Email: `alice@university.edu`
- Password: `password123`
- Post a new item
- Send a message to another seller
- View your items dashboard

**Login as Admin**
- Email: `admin@university.edu`
- Password: `password123`
- View analytics dashboard
- Moderate flagged items
- Manage users

### 3. Register New Account
- Use any university email (must contain .edu, .ac., university, or college)
- Example: `yourname@college.edu`, `test@university.ac.uk`

---

## 🛠️ Common Commands

### Backend Commands
```bash
cd backend

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database migrations
npx prisma migrate dev

# View database in browser
npx prisma studio

# Reset and reseed database
npx prisma migrate reset
npm run seed
```

### Frontend Commands
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View running containers
docker-compose ps
```

---

## 📁 Project Structure

```
LASTIE/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth, validation
│   │   ├── utils/       # Helper functions
│   │   └── server.ts    # Main server file
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
│
├── frontend/            # React application
│   ├── src/
│   │   ├── api/        # API client
│   │   ├── components/ # UI components
│   │   ├── pages/      # Route pages
│   │   ├── store/      # State management
│   │   └── App.tsx     # Main app component
│   └── package.json
│
├── docker-compose.yml   # Docker configuration
├── README.md           # Full documentation
├── API_DOCUMENTATION.md # API reference
└── DEPLOYMENT.md       # Deployment guide
```

---

## 🔧 Troubleshooting

### Backend Won't Start

**Error: "Cannot connect to database"**
```bash
# Check PostgreSQL is running
docker ps  # if using Docker

# Verify DATABASE_URL in backend/.env
# Should match your database credentials
```

**Error: "Port 5000 already in use"**
```bash
# Change PORT in backend/.env
PORT=5001

# Update VITE_API_URL in frontend/.env
VITE_API_URL=http://localhost:5001/api
```

### Frontend Won't Start

**Error: "Port 3000 already in use"**
```bash
# Frontend will ask to use another port (3001)
# Or kill the process using port 3000:

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Error: "Failed to fetch API"**
- Make sure backend is running
- Check VITE_API_URL in browser console
- Verify CORS settings in backend

### Database Issues

**Reset Database:**
```bash
cd backend
npx prisma migrate reset
npm run seed
```

**View Database:**
```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

---

## 🎓 Next Steps

1. **Explore the code** - Check out the modular structure
2. **Customize** - Add your own features
3. **Deploy** - See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
4. **API Testing** - Use [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 📞 Need Help?

- 📖 Read full [README.md](./README.md)
- 🔍 Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md) for production
- 🐛 Open an issue on GitHub

---

**Happy Coding! 🎉**

Built with ❤️ using React, Node.js, PostgreSQL, and TypeScript
