# Store Rating Platform

A full-stack web application that allows users to browse stores and submit ratings, with role-based access for **Admin**, **Normal Users**, and **Store Owners**.

---

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication (httpOnly cookies)
- bcrypt

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS

---

## User Roles & Features

### System Administrator
- Login to admin panel
- Dashboard with:
  - Total users
  - Total stores
  - Total ratings
- Create users (ADMIN, USER, STORE_OWNER)
- Create and manage stores
- View users with:
  - Name, Email, Address, Role
  - Rating (for Store Owners)
- View stores with:
  - Name, Email, Address, Average Rating
- Filter and sort users and stores
- Logout

---

### Normal User
- Signup and login
- Browse all registered stores
- Search stores by name or address
- View:
  - Store name
  - Address
  - Overall rating
  - Own submitted rating
- Submit a rating (1–5) for a store
- Update existing rating
- Update password
- Logout

---

### Store Owner
- Login
- Dashboard showing:
  - Store details
  - Average rating
  - Users who rated the store
- Update password
- Logout

---

## Authentication & Security
- JWT stored in **httpOnly cookies**
- Single login system for all roles
- Role-based access control (RBAC)
- Roles assigned only by backend
- Password hashing using bcrypt
- Secure password update with current password verification

---

## Database Schema

The application uses three core tables:

- `users` – stores all user accounts and roles
- `stores` – stores registered stores and their owners
- `ratings` – stores user ratings for stores (one rating per user per store)

A unique constraint on `(user_id, store_id)` ensures a user can rate a store only once.

---

## 🧠 Key Concepts Implemented
- Secure role management (backend-controlled)
- Protected routes with role validation
- Safe dynamic SQL queries (SQL injection prevention)
- Aggregate ratings using SQL joins
- Centralized authentication handling
- Clean frontend architecture (pages vs reusable components)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yash-wavhal/store-rating-platform
cd store-rating-platform
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=
JWT_SECRET=
```

Run backend:
```bash
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on:
```
http://localhost:3000
```

---

## Notes
- `.env` files are not committed
- PostgreSQL must be running before starting backend
- Admin users are seeded or created by existing admins

---

## Assignment Compliance
- All required functionalities implemented  
- Role-based access control  
- Secure authentication  
- Sorting and filtering  
- Proper validation rules  
- Clean UI with Tailwind CSS  

---

## Author
**Yash Wavhal**