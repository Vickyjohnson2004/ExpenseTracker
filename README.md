# 💰 Track Expense – Full Stack Expense Tracker

A full-stack Expense Tracker application that allows users to manage income and expenses with authentication, a dashboard, and persistent storage.
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

A full-stack Expense Tracker application with authentication, dashboard, and transaction management.

---

## 🌐 Live Demo

🚀 **Frontend:** https://your-frontend-url.vercel.app
🔧 **Backend API:** https://your-backend-url.onrender.com

> ⚠️ Replace these with your actual deployed links

---

## 📸 Screenshots

### 🔐 Login Page

![Login Screenshot](./frontend/public/screenshots/login.png)

---

### 📊 Dashboard

![Dashboard Screenshot](./frontend/public/screenshots/dashboard.png)

---

---

## 🚀 Overview

This project is structured as a **monorepo** containing:

* 🔧 **Backend** → Node.js + Express API
* 🎨 **Frontend** → React (Vite) application

Users can:

* Sign up / log in
* Add, edit, and delete transactions
* View their financial activity on a dashboard

---

## 📁 Project Structure

```bash
TRACK_EXPENSE/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Signup.jsx
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│
└── README.md
```

---

## 🧠 Tech Stack

### Frontend

* React (Vite)
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* REST API
* JWT Authentication

---

## 🔐 Authentication Flow

```text
User Login/Signup
   ↓
Backend validates credentials
   ↓
JWT Token issued
   ↓
Token stored (localStorage/sessionStorage)
   ↓
Protected routes verify access
```

---

## 🔄 Application Flow

```text
App Start
  ↓
Check stored token
  ↓
Fetch user (/api/user/me)
  ↓
Load transactions
  ↓
Render dashboard
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/track-expense.git
cd track-expense
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server runs on:

```
http://localhost:4000
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔌 API Endpoints (Example)

```http
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/user/me
```

---

## 📦 Environment Variables

Create a `.env` file inside **backend/**:

```env
PORT=4000
JWT_SECRET=your_secret_key
```

Frontend (optional):

```env
VITE_API_URL=http://localhost:4000
```

---

## 🛠️ Features

* 🔐 Authentication (Login / Signup)
* 📊 Dashboard UI
* ➕ Add transactions
* ✏️ Edit transactions
* ❌ Delete transactions
* 💾 Persistent storage
* 🔄 State synchronization

---

## ⚠️ Known Limitations

* Uses localStorage/sessionStorage for tokens (not fully secure)
* No refresh token system
* Limited validation on frontend

---

## 🚀 Future Improvements

* 🔐 Move to HTTP-only cookies (secure auth)
* 📊 Add analytics (charts & insights)
* ☁️ Connect to cloud database (MongoDB / PostgreSQL)
* 🔄 Real-time updates
* 📱 Mobile optimization
* 🤖 AI-powered expense insights

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push and open a PR

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Built by **Victor Johnson**

---

## ⭐ Support



---

### ➕ Add Transaction

![Add Transaction Screenshot](./frontend/public/screenshots/add-transaction.png)

---

## 🧠 Tech Stack

**Frontend**

* React (Vite)
* React Router
* Axios
* Tailwind CSS

**Backend**

* Node.js
* Express.js
* JWT Authentication

--you found this helpful, give the repo a ⭐ on GitHub!
