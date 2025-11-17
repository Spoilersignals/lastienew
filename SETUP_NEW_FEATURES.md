# Setup Guide for New Features

## Features Implemented

✅ **Email Verification** - Users must verify email after registration  
✅ **Messaging/Chat System** - Buyers and sellers can chat about items  
✅ **Admin Dashboard** - Single admin can manage users and items  
✅ **User Management** - Admin can add, block, or remove users  
✅ **Item Status Control** - Admin can mark items as sold/pending/removed

## Quick Start

### 1. Backend is Already Running

The backend should be running on `http://localhost:5000` with all new features enabled.

### 2. Create Admin User

Open a new terminal and run:

```bash
cd backend
npx tsx src/scripts/createAdmin.ts
```

Follow the prompts to create your admin account. **Only one admin is allowed.**

Example:
```
Admin name: Admin User
Admin email: admin@university.edu
Admin password: admin123
```

### 3. Restart Frontend

The frontend needs to be restarted to load the new pages:

```bash
# Stop the frontend if running (Ctrl+C)
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## Using the New Features

### Email Verification

1. **Register a new user** at `/register`
2. **Check backend console** for verification link (in development)
3. **Copy the token** from the verification URL
4. **Visit** `http://localhost:3000/verify-email?token=YOUR_TOKEN`
5. User will be marked as verified

**Production**: Configure email service in `backend/src/utils/email.ts`

### Messaging System

1. **Browse items** and click on an item
2. **Click "Contact Seller"** (you'll need to add this button to ItemDetailPage)
3. **Send messages** to sellers
4. **View all conversations** at `/messages`
5. **Unread messages** are highlighted

#### Manual Testing

Send a message via API:
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "receiverId": "USER_ID",
    "message": "Is this item still available?",
    "itemId": "ITEM_ID"
  }'
```

### Admin Dashboard

1. **Log in as admin** user
2. **Navigate to** `/admin`
3. **View Statistics** - Total users, items, messages
4. **Manage Users**:
   - View all users
   - Block/unblock users
   - Delete users (except admin)
5. **Manage Items**:
   - View all items
   - Change item status (Available → Sold)
   - Delete items

#### Admin Restrictions

- Cannot block or delete admin users
- Only ONE admin allowed in the system
- Admin endpoints require ADMIN role

### Item Status Management

Admin can set items to:
- **AVAILABLE** - Item is for sale
- **SOLD** - Item has been sold
- **PENDING** - Transaction in progress
- **REMOVED** - Item removed from listings

## API Endpoints Reference

### Authentication
```
POST /api/auth/register - Register user (sends verification email)
POST /api/auth/login - Login
POST /api/auth/verify-email - Verify email with token
POST /api/auth/resend-verification - Resend verification email
```

### Messages
```
POST /api/messages - Send message
GET /api/messages/conversations - Get all conversations
GET /api/messages/:userId - Get messages with specific user
GET /api/messages/unread/count - Get unread message count
```

### Admin (ADMIN role required)
```
GET /api/admin/users - List all users
POST /api/admin/users - Create user
PUT /api/admin/users/:userId/block - Block/unblock user
DELETE /api/admin/users/:userId - Delete user

GET /api/admin/items - List all items
PUT /api/admin/items/:itemId/status - Update item status
DELETE /api/admin/items/:itemId - Delete item

GET /api/admin/stats - Get platform statistics
```

## Database Changes

New fields added to User model:
```prisma
emailVerified          Boolean   @default(false)
emailVerificationToken String?   @unique
tokenExpiry            DateTime?
```

Message model already existed with all required fields.

## Frontend Pages Added

- `/verify-email` - Email verification page
- `/messages` - Chat/messaging interface
- `/admin` - Admin dashboard (admin only)

## Testing Checklist

- [ ] Register new user and verify email
- [ ] Create admin user using script
- [ ] Login as admin and access `/admin`
- [ ] Block/unblock a user as admin
- [ ] Change item status to SOLD as admin
- [ ] Send message between two users
- [ ] View conversations in Messages page
- [ ] Check unread message count

## Next Steps for Production

1. **Email Service Integration**
   - Configure SendGrid/AWS SES/Nodemailer in `backend/src/utils/email.ts`
   - Add email templates
   - Update `FRONTEND_URL` in .env

2. **Real-time Messaging**
   - Add Socket.io for live chat
   - Real-time notifications

3. **Enhanced UI**
   - Add "Contact Seller" button to item details
   - Show email verification status on user profile
   - Add notification badges for unread messages

4. **Security**
   - Rate limiting on email sending
   - CSRF protection
   - Input sanitization

## Troubleshooting

**Email not verified?**
- Check backend console for verification link
- Token expires in 24 hours
- Use resend-verification endpoint

**Cannot access admin dashboard?**
- Verify user has ADMIN role in database
- Only one admin allowed

**Messages not appearing?**
- Check authentication token
- Verify both users exist
- Check browser console for errors

## Support

For issues or questions, check:
1. Backend console for errors
2. Browser console (F12) for frontend errors
3. Database content using Prisma Studio: `npx prisma studio`
