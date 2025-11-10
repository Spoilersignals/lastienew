# 📡 API Documentation

Complete REST API documentation for Campus Essentials Exchange.

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.yourdomain.com/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

Tokens are obtained through `/auth/login` or `/auth/register` endpoints and are valid for 7 days.

---

## 🔐 Authentication Endpoints

### Register User

Create a new user account (university email required).

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "password": "securePassword123"
}
```

**Validation:**
- `name`: min 2 characters
- `email`: valid university email (.edu, .ac., university, college)
- `password`: min 6 characters

**Success Response (201):**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "role": "STUDENT"
  }
}
```

**Error Responses:**
- `400`: Invalid email format or university email required
- `400`: Email already registered
- `500`: Registration failed

---

### Login

Authenticate existing user.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john.doe@university.edu",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "role": "STUDENT"
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `403`: Account blocked
- `500`: Login failed

---

## 📦 Item Endpoints

### Get All Items

Retrieve items with optional filtering and pagination.

**Endpoint:** `GET /items`

**Query Parameters:**
- `category` (optional): Filter by category (BOOKS, ELECTRONICS, FURNITURE, CLOTHING, SPORTS, STATIONERY, OTHER)
- `search` (optional): Search in title and description
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `status` (optional): Item status (AVAILABLE, SOLD, DONATED, EXCHANGED, FLAGGED)
- `urgent` (optional): Filter urgent items (true/false)
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page

**Example Request:**
```http
GET /items?category=BOOKS&minPrice=10&maxPrice=50&page=1&limit=20
```

**Success Response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Introduction to Computer Science",
      "category": "BOOKS",
      "description": "Great condition textbook",
      "price": 45.00,
      "imageUrl": "/uploads/image.jpg",
      "status": "AVAILABLE",
      "urgent": false,
      "datePosted": "2024-01-15T10:30:00Z",
      "postedBy": {
        "id": "uuid",
        "name": "Alice Johnson"
      }
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### Get Single Item

Get detailed information about a specific item.

**Endpoint:** `GET /items/:id`

**Success Response (200):**
```json
{
  "id": "uuid",
  "title": "Introduction to Computer Science",
  "category": "BOOKS",
  "description": "Great condition textbook, barely used",
  "price": 45.00,
  "imageUrl": "/uploads/image.jpg",
  "status": "AVAILABLE",
  "urgent": false,
  "datePosted": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "postedBy": {
    "id": "uuid",
    "name": "Alice Johnson",
    "email": "alice@university.edu"
  }
}
```

**Error Responses:**
- `404`: Item not found
- `500`: Failed to fetch item

---

### Create Item

Post a new item for sale/donation. **Requires authentication.**

**Endpoint:** `POST /items`

**Content-Type:** `multipart/form-data`

**Request Body:**
```
title: "Calculus Textbook"
category: "BOOKS"
description: "Used textbook in excellent condition"
price: "50.00"
urgent: "false"
image: <file> (optional, max 5MB, jpeg/jpg/png/gif)
```

**Success Response (201):**
```json
{
  "message": "Item posted successfully",
  "item": {
    "id": "uuid",
    "title": "Calculus Textbook",
    "category": "BOOKS",
    "description": "Used textbook in excellent condition",
    "price": 50.00,
    "imageUrl": "/uploads/123456.jpg",
    "status": "AVAILABLE",
    "urgent": false,
    "datePosted": "2024-01-15T10:30:00Z",
    "postedBy": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@university.edu"
    }
  }
}
```

**Error Responses:**
- `400`: Validation errors or inappropriate content
- `401`: Authentication required
- `500`: Failed to post item

---

### Update Item

Update item details. **Requires authentication (owner or admin).**

**Endpoint:** `PUT /items/:id`

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 40.00,
  "status": "SOLD"
}
```

**Success Response (200):**
```json
{
  "message": "Item updated successfully",
  "item": { /* updated item object */ }
}
```

**Error Responses:**
- `401`: Authentication required
- `403`: Unauthorized (not owner or admin)
- `404`: Item not found
- `500`: Failed to update item

---

### Delete Item

Delete an item. **Requires authentication (owner or admin).**

**Endpoint:** `DELETE /items/:id`

**Success Response (200):**
```json
{
  "message": "Item deleted successfully"
}
```

**Error Responses:**
- `401`: Authentication required
- `403`: Unauthorized
- `404`: Item not found
- `500`: Failed to delete item

---

### Get My Items

Get all items posted by current user. **Requires authentication.**

**Endpoint:** `GET /items/user/my-items`

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "My Item",
    "category": "BOOKS",
    "description": "...",
    "price": 30.00,
    "imageUrl": "/uploads/image.jpg",
    "status": "AVAILABLE",
    "urgent": false,
    "datePosted": "2024-01-15T10:30:00Z",
    "postedBy": {
      "id": "uuid",
      "name": "Current User"
    }
  }
]
```

---

## 💬 Message Endpoints

### Send Message

Send a message to another user. **Requires authentication.**

**Endpoint:** `POST /messages`

**Request Body:**
```json
{
  "receiverId": "recipient-user-id",
  "itemId": "item-id-optional",
  "message": "Hi! Is this item still available?"
}
```

**Success Response (201):**
```json
{
  "message": "Message sent",
  "data": {
    "id": "uuid",
    "senderId": "sender-id",
    "receiverId": "recipient-id",
    "itemId": "item-id",
    "message": "Hi! Is this item still available?",
    "read": false,
    "timestamp": "2024-01-15T10:30:00Z",
    "sender": {
      "id": "uuid",
      "name": "John Doe"
    },
    "receiver": {
      "id": "uuid",
      "name": "Alice Johnson"
    },
    "item": {
      "id": "uuid",
      "title": "Calculus Textbook"
    }
  }
}
```

**Error Responses:**
- `400`: Cannot message yourself
- `401`: Authentication required
- `404`: Receiver not found
- `500`: Failed to send message

---

### Get Inbox

Get all conversations grouped by user. **Requires authentication.**

**Endpoint:** `GET /messages/inbox`

**Success Response (200):**
```json
{
  "user-id-1": [
    {
      "id": "message-id",
      "senderId": "sender-id",
      "receiverId": "receiver-id",
      "message": "Message content",
      "timestamp": "2024-01-15T10:30:00Z",
      "sender": { "id": "uuid", "name": "Alice" },
      "receiver": { "id": "uuid", "name": "Bob" },
      "item": { "id": "uuid", "title": "Item Title" }
    }
  ],
  "user-id-2": [ /* more messages */ ]
}
```

---

### Get Conversation

Get all messages between current user and specified user. **Requires authentication.**

**Endpoint:** `GET /messages/conversation/:userId`

**Success Response (200):**
```json
[
  {
    "id": "message-id",
    "senderId": "sender-id",
    "receiverId": "receiver-id",
    "message": "Message content",
    "read": true,
    "timestamp": "2024-01-15T10:30:00Z",
    "sender": { "id": "uuid", "name": "Alice" },
    "receiver": { "id": "uuid", "name": "Bob" },
    "item": { "id": "uuid", "title": "Item Title" }
  }
]
```

---

### Get Unread Count

Get count of unread messages. **Requires authentication.**

**Endpoint:** `GET /messages/unread-count`

**Success Response (200):**
```json
{
  "unreadCount": 5
}
```

---

## 👤 User Endpoints

### Get Current User

Get authenticated user's profile. **Requires authentication.**

**Endpoint:** `GET /users/me`

**Success Response (200):**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@university.edu",
  "role": "STUDENT",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

### Get User Profile

Get public profile of any user.

**Endpoint:** `GET /users/:id`

**Success Response (200):**
```json
{
  "id": "uuid",
  "name": "Alice Johnson",
  "createdAt": "2024-01-01T00:00:00Z",
  "_count": {
    "items": 12
  }
}
```

**Error Responses:**
- `404`: User not found
- `500`: Failed to fetch user

---

## 🔔 Notification Endpoints

### Get Notifications

Get all notifications for current user. **Requires authentication.**

**Endpoint:** `GET /notifications`

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "userId": "user-id",
    "type": "MESSAGE",
    "title": "New Message",
    "message": "You have a new message from Alice Johnson",
    "read": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

**Notification Types:**
- `MESSAGE`: New message received
- `ITEM_APPROVED`: Item approved by admin
- `ITEM_FLAGGED`: Item flagged by admin
- `INQUIRY`: Someone interested in your item

---

### Mark Notification as Read

**Endpoint:** `PUT /notifications/:id/read`

**Success Response (200):**
```json
{
  "id": "uuid",
  "read": true,
  /* other notification fields */
}
```

---

### Mark All as Read

**Endpoint:** `PUT /notifications/mark-all-read`

**Success Response (200):**
```json
{
  "message": "All notifications marked as read"
}
```

---

## 🛡️ Admin Endpoints

**All admin endpoints require authentication with ADMIN role.**

### Get Statistics

Get platform statistics and analytics.

**Endpoint:** `GET /admin/stats`

**Success Response (200):**
```json
{
  "stats": {
    "totalUsers": 150,
    "totalItems": 450,
    "activeItems": 320,
    "flaggedItems": 5,
    "totalMessages": 1200
  },
  "recentUsers": [
    {
      "id": "uuid",
      "name": "New User",
      "email": "new@university.edu",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "recentItems": [
    /* recent items */
  ]
}
```

---

### Get Flagged Items

Get all flagged items requiring review.

**Endpoint:** `GET /admin/items/flagged`

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "title": "Suspicious Item",
    "description": "...",
    "status": "FLAGGED",
    "postedBy": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@university.edu"
    },
    /* other item fields */
  }
]
```

---

### Approve Item

Approve a flagged or pending item.

**Endpoint:** `PUT /admin/items/:id/approve`

**Success Response (200):**
```json
{
  "message": "Item approved",
  "item": { /* approved item */ }
}
```

---

### Flag Item

Flag an item for review.

**Endpoint:** `PUT /admin/items/:id/flag`

**Request Body:**
```json
{
  "reason": "Inappropriate content"
}
```

**Success Response (200):**
```json
{
  "message": "Item flagged",
  "item": { /* flagged item */ }
}
```

---

### Delete Item (Admin)

Admin can delete any item.

**Endpoint:** `DELETE /admin/items/:id`

**Success Response (200):**
```json
{
  "message": "Item deleted successfully"
}
```

---

### Get All Users

Get list of all users with statistics.

**Endpoint:** `GET /admin/users`

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Alice Johnson",
    "email": "alice@university.edu",
    "role": "STUDENT",
    "createdAt": "2024-01-01T00:00:00Z",
    "blocked": false,
    "_count": {
      "items": 5,
      "sentMessages": 12
    }
  }
]
```

---

### Block User

Block a user from posting or messaging.

**Endpoint:** `PUT /admin/users/:id/block`

**Success Response (200):**
```json
{
  "message": "User blocked",
  "user": { /* blocked user */ }
}
```

---

### Unblock User

Unblock a previously blocked user.

**Endpoint:** `PUT /admin/users/:id/unblock`

**Success Response (200):**
```json
{
  "message": "User unblocked",
  "user": { /* unblocked user */ }
}
```

---

## 📊 Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔄 Rate Limiting

Currently no rate limiting implemented. For production, consider:
- 100 requests per 15 minutes per IP
- 1000 requests per hour for authenticated users
- Use `express-rate-limit` package

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@university.edu","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@university.edu","password":"password123"}'
```

### Get Items
```bash
curl http://localhost:5000/api/items?category=BOOKS&limit=10
```

### Create Item (with auth)
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Book" \
  -F "category=BOOKS" \
  -F "description=Great book" \
  -F "price=25" \
  -F "urgent=false"
```

---

**For more examples and Postman collection, see the repository.**
