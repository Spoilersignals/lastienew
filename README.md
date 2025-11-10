# 🎓 Campus Essentials Exchange

A modern, full-stack peer-to-peer marketplace platform designed specifically for university students to buy, sell, donate, and exchange items within their campus community.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### For Students
- 🔐 **Secure Authentication** - University email-verified registration and login
- 📝 **Post Items** - List items for sale, donation, or exchange with images
- 🔍 **Advanced Search** - Filter by category, price range, urgency, and keywords
- 💬 **Direct Messaging** - Safe in-app messaging between students
- 📊 **Personal Dashboard** - Manage your posted items and track status
- 🔔 **Notifications** - Get alerted when someone messages about your items

### For Administrators
- 📈 **Analytics Dashboard** - View platform statistics and user activity
- 🛡️ **Content Moderation** - Review, approve, or flag suspicious listings
- 👥 **User Management** - Block/unblock users, view user activity
- 📋 **Reports & Insights** - Track total users, items, and transactions

### System Features
- 🌐 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast Performance** - Optimized loading and search under 2 seconds
- 🔒 **Data Privacy** - Secure JWT authentication and password hashing
- 🎯 **Content Filtering** - Basic profanity and spam detection
- 🐳 **Docker Ready** - Easy deployment with Docker Compose

## 🛠️ Tech Stack

### Why This Stack?

We chose this modern, efficient stack for optimal performance, developer experience, and scalability:

**Frontend:**
- **React 18** - Industry-standard UI library with excellent ecosystem
- **Vite** - Lightning-fast build tool and dev server
- **TypeScript** - Type safety reduces bugs and improves maintainability
- **Tailwind CSS** - Rapid UI development with utility-first approach
- **Zustand** - Lightweight state management with persistence

**Backend:**
- **Node.js + Express** - Fast, scalable JavaScript runtime
- **TypeScript** - End-to-end type safety
- **Prisma ORM** - Type-safe database queries with great DX
- **PostgreSQL** - Robust relational database for complex queries
- **JWT** - Stateless authentication for scalability

**DevOps:**
- **Docker** - Consistent environments across dev/prod
- **Docker Compose** - Easy multi-container orchestration

**Benefits:**
- ✅ Single language (TypeScript) across entire stack
- ✅ Strong typing catches errors before runtime
- ✅ Fast development with hot reload
- ✅ Production-ready with proven technologies
- ✅ Easy to extend and maintain

## 🏗️ Architecture

```
campus-exchange/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── api/            # API client (axios)
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # State management (Zustand)
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   └── package.json
│
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Auth, validation middleware
│   │   ├── utils/          # Helper functions
│   │   ├── server.ts       # Express server setup
│   │   └── seed.ts         # Database seeding script
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── docker-compose.yml       # Docker orchestration
└── README.md               # This file
```

### Database Schema

```
Users → Items (one-to-many)
Users → Messages (many-to-many)
Users → Notifications (one-to-many)
Items → Messages (one-to-many, optional)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 15+ (or use Docker)
- **Git**

### Option 1: Local Development (Recommended for Development)

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd LASTIE
```

#### 2. Set Up Database

Install PostgreSQL locally or run with Docker:

```bash
docker run --name campus-postgres -e POSTGRES_USER=campus_user -e POSTGRES_PASSWORD=campus_pass -e POSTGRES_DB=campus_exchange -p 5432:5432 -d postgres:15-alpine
```

#### 3. Set Up Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
DATABASE_URL="postgresql://campus_user:campus_pass@localhost:5432/campus_exchange"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Run database migrations and seed:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

Start backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

#### 4. Set Up Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

#### 5. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health

### Option 2: Docker Development (Easiest Setup)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

### Option 3: Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

## 🧪 Testing the Application

### Default Credentials

After seeding, use these credentials to test:

**Admin Account:**
- Email: `admin@university.edu`
- Password: `password123`

**Student Accounts:**
- Email: `alice@university.edu` / Password: `password123`
- Email: `bob@college.edu` / Password: `password123`
- Email: `carol@university.ac.uk` / Password: `password123`

### Testing Workflow

1. **Register** a new account with a university email
2. **Browse items** without logging in
3. **Post an item** after logging in
4. **Message sellers** about items you're interested in
5. **Manage your items** (mark as sold/donated)
6. **Admin panel** - Login as admin to moderate content

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Auth Routes

**POST /api/auth/register**
```json
{
  "name": "John Doe",
  "email": "john@university.edu",
  "password": "password123"
}
```

**POST /api/auth/login**
```json
{
  "email": "john@university.edu",
  "password": "password123"
}
```

#### Item Routes

**GET /api/items** - Get all items (with filters)
- Query params: `category`, `search`, `minPrice`, `maxPrice`, `urgent`, `page`, `limit`

**GET /api/items/:id** - Get single item

**POST /api/items** - Create item (protected, multipart/form-data)
```json
{
  "title": "Calculus Textbook",
  "category": "BOOKS",
  "description": "Great condition",
  "price": "50",
  "urgent": "false",
  "image": <file>
}
```

**PUT /api/items/:id** - Update item (protected)

**DELETE /api/items/:id** - Delete item (protected)

**GET /api/items/user/my-items** - Get current user's items (protected)

#### Message Routes

**POST /api/messages** - Send message (protected)
```json
{
  "receiverId": "user-id",
  "itemId": "item-id",
  "message": "Is this still available?"
}
```

**GET /api/messages/inbox** - Get all conversations (protected)

**GET /api/messages/conversation/:userId** - Get conversation with user (protected)

**GET /api/messages/unread-count** - Get unread message count (protected)

#### Admin Routes (All require admin role)

**GET /api/admin/stats** - Get platform statistics

**GET /api/admin/items/flagged** - Get flagged items

**PUT /api/admin/items/:id/approve** - Approve item

**PUT /api/admin/items/:id/flag** - Flag item

**DELETE /api/admin/items/:id** - Delete item

**GET /api/admin/users** - Get all users

**PUT /api/admin/users/:id/block** - Block user

**PUT /api/admin/users/:id/unblock** - Unblock user

#### User Routes

**GET /api/users/me** - Get current user (protected)

**GET /api/users/:id** - Get user profile

#### Notification Routes

**GET /api/notifications** - Get user notifications (protected)

**PUT /api/notifications/:id/read** - Mark notification as read (protected)

**PUT /api/notifications/mark-all-read** - Mark all as read (protected)

### Response Format

**Success Response:**
```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## 🐳 Docker Deployment

### Development

```bash
docker-compose up -d
```

### Production

1. Update environment variables in `docker-compose.yml`
2. Build and deploy:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop and remove containers
docker-compose down

# Rebuild containers
docker-compose up -d --build

# Access database
docker exec -it campus-db psql -U campus_user -d campus_exchange
```

## 🌐 Deployment Platforms

### Recommended Platforms

1. **Render** (Easiest)
   - Backend: Web Service
   - Frontend: Static Site
   - Database: PostgreSQL

2. **Vercel + Railway**
   - Frontend on Vercel
   - Backend + DB on Railway

3. **AWS / DigitalOcean**
   - Full control with Docker

4. **Heroku**
   - Easy deployment with Git

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step guides.

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ University email validation
- ✅ Protected API routes
- ✅ Content filtering (basic profanity detection)
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS protection (React escaping)
- ✅ CORS configuration
- ✅ File upload validation (type, size)

## 🚧 Future Enhancements

- [ ] Mobile app (React Native / Flutter)
- [ ] Real-time chat with WebSockets
- [ ] Push notifications
- [ ] Image optimization and CDN
- [ ] Advanced search with Elasticsearch
- [ ] Payment integration (Stripe)
- [ ] Rating and review system
- [ ] Campus pickup locations map
- [ ] Sustainability metrics dashboard
- [ ] Email notifications
- [ ] Social login (Google, Facebook)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@campusexchange.com

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by university student needs
- Promoting sustainability and community

---

**Made with ❤️ for university students everywhere**
