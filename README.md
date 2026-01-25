# 📚 Book Library - Rental Management System

<div align="center">

A modern, full-stack book rental management system with automated notifications, secure transactions, and separate admin/user dashboards.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation)

</div>

---

## 🌟 Features

### 👤 User Features
- **Browse & Search Books** - Real-time search with category filtering
- **Smart Rental System** - 30% rental fee + 70% security deposit calculation
- **Shopping Cart** - Add multiple books, adjust quantities, checkout seamlessly
- **My Rentals Dashboard** - Track active rentals with status updates
- **Automated Notifications** - Get reminders 1 day before and on return date
- **Return Books** - Request returns with admin approval workflow
- **Transaction History** - Complete record of all rental transactions
- **Rent Again** - Quick re-rent feature for previously rented books

### 🔐 Admin Features
- **Complete Book Management** - Add, edit, delete, search books with images
- **Category Management** - Organize books by custom categories
- **Request Approval System** - Approve/reject book drop-off and return requests
- **Return Management** - Dedicated interface for handling book returns
- **Admin Notifications** - Centralized notification system for all requests
- **Transaction Monitoring** - View all user transactions and rental history
- **Real-time Updates** - Auto-refresh data every 5 seconds
- **Profile Management** - Update admin contact details and information

### ⚙️ System Features
- **Dual Authentication** - Separate admin and user login systems
- **JWT Token Management** - Secure authentication with auto-refresh
- **Automated Reminder System** - Runs hourly to check rental periods
- **Security Deposit Management** - Automated refund on approved returns
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Real-time Data Sync** - Firebase Realtime Database integration
- **Toast Notifications** - User-friendly feedback for all actions

---

## 🛠 Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library with hooks
- **Vite 7.2.4** - Lightning-fast build tool
- **React Router DOM 7.12.0** - Client-side routing
- **Redux Toolkit 2.11.2** - State management
- **React Redux 9.2.0** - React bindings for Redux
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **React Icons 5.5.0** - Icon library
- **React Hot Toast 2.6.0** - Toast notifications

### Backend & Database
- **Firebase Realtime Database** - NoSQL cloud database
- **Firebase Authentication** - User authentication service
- **REST API Architecture** - Custom API layer over Firebase

---
## Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Firebase Account** (for database)

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd book-library
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database** and **Authentication**
3. Update Firebase credentials in:
   - `src/APIs/LoginAPi.jsx` (FIREBASE_API_KEY, DB_BASE_URL)
   - `src/APIs/BookAPicall.jsx` (DB_BASE_URL)
   - `src/APIs/RequestAPi.jsx` (DB_BASE_URL)
   - `src/APIs/TransactionAPI.jsx` (DB_BASE_URL)

### Step 4: Run Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

---
</div>
