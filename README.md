# 📚 Book Library - Rental Management System

<div align="center">

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-2.11.2-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

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

### Development Tools
- **ESLint 9.39.1** - Code linting
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.23** - CSS vendor prefixes

---

## 📁 Project Structure

```
book-library/
├── public/                          # Static assets
├── src/
│   ├── AdminPages/                  # Admin-specific pages
│   │   ├── Cards/                   # Admin card components
│   │   │   ├── AdminNotificationCard.jsx
│   │   │   ├── BooksCard.jsx
│   │   │   ├── EditBookDetails.jsx
│   │   │   └── RequestCard.jsx
│   │   ├── AddBook/
│   │   │   └── AddBook.jsx          # Add new books form
│   │   ├── AdminHome.jsx            # Admin dashboard
│   │   ├── AdminNotifications.jsx   # Notification center
│   │   ├── AdminProfile.jsx         # Admin profile management
│   │   ├── AdminRequests.jsx        # Request management
│   │   ├── AdminTransactions.jsx    # Transaction history
│   │   ├── Categories.jsx           # Category filters
│   │   ├── Nav.jsx                  # Admin navigation
│   │   ├── ReturnRequests.jsx       # Return requests handler
│   │   └── SpaceBar.jsx             # Sidebar component
│   │
│   ├── UserPages/                   # User-specific pages
│   │   ├── Cards/                   # User card components
│   │   │   ├── CartItem.jsx
│   │   │   ├── UserBookCards.jsx
│   │   │   ├── UserNotificationCard.jsx
│   │   │   └── ViewBookDetails.jsx
│   │   ├── Cart.jsx                 # Shopping cart
│   │   ├── Categories.jsx           # Category filters
│   │   ├── DropBook.jsx             # Book drop-off page
│   │   ├── Home.jsx                 # User dashboard
│   │   ├── MyRentals.jsx            # Rental history
│   │   ├── Nav.jsx                  # User navigation
│   │   ├── RentAgain.jsx            # Re-rent interface
│   │   ├── SearchBox.jsx            # Search component (unused)
│   │   ├── UserNotifications.jsx    # User notifications
│   │   └── UserTransactions.jsx     # User transaction history
│   │
│   ├── APIs/                        # API service layer
│   │   ├── BookAPicall.jsx          # Book CRUD operations
│   │   ├── LoginAPi.jsx             # Authentication APIs
│   │   ├── RentalNotificationService.jsx  # Rental logic
│   │   ├── RequestAPi.jsx           # Request handling
│   │   └── TransactionAPI.jsx       # Transaction management
│   │
│   ├── Store/                       # Redux state management
│   │   ├── authSlice.jsx            # Authentication state
│   │   ├── BookSlice.jsx            # Books state
│   │   ├── CartSlice.jsx            # Shopping cart state
│   │   ├── RequestSlice.jsx         # Requests state
│   │   └── Store.jsx                # Redux store config
│   │
│   ├── Login/                       # Authentication pages
│   │   ├── ForgotPassword.jsx
│   │   ├── LoginPage.jsx
│   │   └── SignupPage.jsx
│   │
│   ├── Routes/
│   │   └── AppRouter.jsx            # Route configuration
│   │
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   ├── firebaseConfig.jsx           # Firebase setup (unused)
│   ├── App.css                      # App-specific styles
│   └── index.css                    # Global styles
│
├── eslint.config.js                 # ESLint configuration
├── vite.config.js                   # Vite configuration
├── package.json                     # Dependencies
├── README.md                        # This file
├── RENTAL_SYSTEM_GUIDE.md          # Rental system documentation
└── DOCUMENTATION.md                # Detailed documentation (to be created)
```

---

## 🚀 Installation

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

## 📖 Usage

### For Users

#### 1. **Sign Up / Login**
- Navigate to `/signup` to create an account
- Provide: Email, Password, Name, Contact Number (10 digits), Address
- Login at `/login` with your credentials

#### 2. **Browse Books**
- View all available books on the home page
- Use the search bar to find specific books
- Filter by categories (Fiction, Non-fiction, Education, etc.)

#### 3. **Rent Books**
- Click "View Details" on any book
- Select rental duration (start and end dates)
- System calculates:
  - **Daily Rate** = Book Price × 0.001
  - **Total Cost** = Daily Rate × Days
  - **Rental Fee (30%)** = What you pay
  - **Security Deposit (70%)** = Refundable amount
- Add to cart and checkout

#### 4. **Manage Rentals**
- Go to "My Rentals" to see active rentals
- Track rental status and return dates
- Get automated notifications:
  - **1 day before** rental ends
  - **On return date**
  - **Overdue** reminders

#### 5. **Return Books**
- Click "Request Return" from My Rentals
- Admin will approve/reject your request
- Security deposit refunded upon approval

### For Admin

#### 1. **Admin Login**
- Login with admin credentials
- Automatically redirected to admin dashboard

#### 2. **Manage Books**
- **Add Book**: Navigate to "Add Book", fill details, upload image
- **Edit Book**: Click edit icon on any book card
- **Delete Book**: Remove books from inventory
- **Search**: Find books quickly with search functionality

#### 3. **Handle Requests**
- Go to "Requests" to see all drop-off and return requests
- Review request details
- **Approve**: Confirm book received/returned
- **Reject**: Provide reason for rejection

#### 4. **Monitor Notifications**
- "Notifications" page shows all pending actions
- Real-time updates every 5 seconds
- Badge count shows pending requests

#### 5. **View Transactions**
- Complete transaction history
- Filter by user, date, or type
- Track rental fees and security deposits

---

## 🔑 Key Concepts

### Rental Calculation Formula
```javascript
Daily Rate = Book Price × 0.001
Total Cost = Daily Rate × Number of Days
Rental Fee = Total Cost × 0.3   // User pays this
Security Deposit = Total Cost × 0.7  // Refundable
```

### Transaction Types
1. **Rental Fee** - Charged when book is rented (30% of total)
2. **Security Deposit** - Held as collateral (70% of total)
3. **Security Deposit Refund** - Returned when book is returned

### Notification System
- Runs automatically every hour
- Checks all active rentals
- Sends reminders based on return date
- Updates rental status automatically

---

## 🗂 Database Structure

```json
{
  "books": {
    "book-name-slug": {
      "name": "Book Name",
      "description": "Description",
      "type": "Category",
      "price": 100,
      "quantity": 5,
      "imageUrl": "url",
      "createdAt": "ISO date"
    }
  },
  "users": {
    "user_email_com": {
      "email": "user@email.com",
      "name": "User Name",
      "role": "user",
      "contactNo": "1234567890",
      "address": "User Address"
    }
  },
  "rentBook": {
    "rentalId": {
      "bookName": "Book Name",
      "userEmail": "user@email.com",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "status": "active",
      "rentalFee": 30,
      "securityDeposit": 70
    }
  },
  "adminNotifications": {
    "notificationId": {
      "type": "return_request",
      "bookName": "Book Name",
      "userEmail": "user@email.com",
      "status": "pending",
      "createdAt": "ISO date"
    }
  },
  "transactions": {
    "transactionId": {
      "userEmail": "user@email.com",
      "bookName": "Book Name",
      "type": "rental_fee",
      "amount": 30,
      "date": "ISO date"
    }
  }
}
```

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Token Refresh** - Automatic token renewal
- **Role-Based Access** - Separate admin/user permissions
- **Protected Routes** - Unauthorized access prevention
- **Input Validation** - Frontend and backend validation
- **Email Sanitization** - Convert emails to safe keys
- **Password Encryption** - Firebase Auth handles encryption

---

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Adaptive layouts
- **Desktop Experience** - Full-featured interface
- **Touch Friendly** - Gesture support
- **Loading States** - Smooth user experience

---

## 🐛 Known Issues & Unused Files

### Unused Files (Can be safely removed):
1. **`src/UserPages/SearchBox.jsx`** - Search is integrated inline
2. **`src/firebaseConfig.jsx`** - Using direct URLs instead of Firebase Storage
3. **`src/AdminPages/ReturnRequests.jsx`** - Not connected to routes

### Future Improvements:
- Add unit tests
- Implement Firebase Storage for images
- Add pagination for large datasets
- Email notifications integration
- Advanced analytics dashboard
- Export transactions to PDF/Excel

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Developer

**Himans SR**

- GitHub: [@himanssr](https://github.com/himanssr)
- Project: Book Library Rental System

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for backend infrastructure
- Tailwind CSS for styling utilities
- Redux team for state management
- All contributors and users

---

## 📞 Support

For support, please:
- Open an issue in the GitHub repository
- Contact the development team
- Check the [RENTAL_SYSTEM_GUIDE.md](RENTAL_SYSTEM_GUIDE.md) for detailed documentation

---

<div align="center">


**[⬆ Back to Top](#-book-library---rental-management-system)**

</div>
