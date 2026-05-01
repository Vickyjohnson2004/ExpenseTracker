# 💰 Expense Tracker App

A full-stack Expense Tracker application that helps users manage their income and expenses efficiently. Users can add, edit, delete, and track transactions with a clean and intuitive dashboard.

---

## 🚀 Features

* 🔐 User Authentication (Login & Signup)
* 📊 Dashboard overview of transactions
* ➕ Add new transactions (income/expense)
* ✏️ Edit existing transactions
* ❌ Delete transactions
* 💾 Persistent storage (localStorage / backend API)
* 🔄 Auto-refresh transaction list
* 📱 Responsive UI

---

## 🧠 Tech Stack

### Frontend

* React (with Hooks)
* React Router DOM
* Axios
* Tailwind CSS

### Backend (if connected)

* Node.js
* Express.js
* REST API

---

## 📁 Project Structure

```
src/
│
├── components/
│   ├── Layout.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│
├── pages/
│   └── Dashboard.jsx
│
├── App.jsx
└── main.jsx
```

---

## 🔐 Authentication Flow

1. User logs in or signs up
2. Token is stored in:

   * `localStorage` (if "Remember me" is checked)
   * `sessionStorage` (default)
3. Protected routes verify:

   * User exists
   * Token is valid
4. Unauthorized users are redirected to `/login`

---

## 🔄 App Flow

```
App Load
  ↓
Check Stored Token
  ↓
Validate User (API or Storage)
  ↓
Load Transactions
  ↓
Render Dashboard
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Run the app

```bash
npm run dev
```

---

### 4. Backend (optional)

Make sure your backend is running at:

```
http://localhost:4000
```

And exposes:

```
GET /api/user/me
POST /api/auth/login
POST /api/auth/signup
```

---

## 📦 Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:4000
```

---

## 🛠️ Key Functionalities

### Add Transaction

* Adds new income/expense
* Updates UI instantly

### Edit Transaction

* Modify existing transaction
* Keeps state consistent

### Delete Transaction

* Removes transaction permanently

### Persist Data

* Saves transactions to localStorage
* Reload-safe

---

## ⚠️ Known Limitations

* Uses localStorage (not fully secure)
* No server-side validation (if backend is missing)
* No pagination for large datasets

---

## 🚀 Future Improvements

* 🔐 Switch to HTTP-only cookies for auth
* 📊 Add charts (analytics dashboard)
* ☁️ Cloud database (MongoDB/PostgreSQL)
* 🔄 Real-time updates (WebSockets)
* 📈 Expense insights with AI

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built by **Victor Johnson**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
