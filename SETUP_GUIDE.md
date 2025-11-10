# 🚀 Quick Setup Guide

## For Anyone Cloning This Repository

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

That's it! No Docker or PostgreSQL needed - we use SQLite.

---

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/Spoilersignals/lastienew.git
cd lastienew
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Create Backend Environment File
Create `backend/.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
FRONTEND_URL=http://localhost:3000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 4. Setup Database
```bash
npx prisma generate
npx prisma migrate deploy
```

Optional - add demo data:
```bash
npm run seed
```

### 5. Install Frontend Dependencies
Open a new terminal:
```bash
cd frontend
npm install
```

### 6. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Access the App
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health

---

## Demo Accounts (if you ran seed)

| Email | Password | Role |
|-------|----------|------|
| admin@university.edu | password123 | Admin |
| alice@university.edu | password123 | Student |
| bob@college.edu | password123 | Student |

---

## Troubleshooting

### "Cannot find module"
```bash
# Delete node_modules and reinstall
rm -rf backend/node_modules frontend/node_modules
cd backend && npm install
cd ../frontend && npm install
```

### Port already in use
Frontend will auto-suggest another port. For backend:
- Change `PORT=5001` in `backend/.env`

### Database errors
```bash
cd backend
npx prisma migrate reset  # Resets database
npx prisma generate       # Regenerates Prisma client
```

---

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite (via Prisma ORM)
- **Auth:** JWT

---

## Project Structure
```
lastienew/
├── frontend/          # React app
│   ├── src/
│   └── package.json
├── backend/           # Express API
│   ├── src/
│   ├── prisma/
│   └── package.json
└── README.md
```

---

## Need Help?
- Check [README.md](./README.md) for full documentation
- Open an issue on GitHub
- Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API endpoints

---

**Made with ❤️ for university students**
