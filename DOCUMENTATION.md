# 📚 Book Library - Complete Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Authentication System](#authentication-system)
3. [State Management](#state-management)
4. [API Layer](#api-layer)
5. [Component Documentation](#component-documentation)
6. [Database Schema](#database-schema)
7. [Rental System Logic](#rental-system-logic)
8. [Notification System](#notification-system)
9. [Security Implementation](#security-implementation)
10. [Deployment Guide](#deployment-guide)
11. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Application Flow
```
User/Admin → Login → Authentication → Role Check → Dashboard
                                         ↓
                                    Admin/User Routes
                                         ↓
                          Redux Store ← → Firebase Database
                                         ↓
                                 Component Rendering
```
### Technology Stack Details

#### Frontend Architecture
- **React 19.2.0**: Component-based UI with React Hooks
- **Vite**: Build tool with Hot Module Replacement (HMR)
- **Redux Toolkit**: Centralized state management
- **React Router DOM**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first styling with responsive design

#### Backend Architecture
- **Firebase Realtime Database**: NoSQL JSON tree structure
- **Firebase Authentication**: Email/password authentication
- **REST API Pattern**: Custom API wrappers for Firebase operations

### Design Patterns
- **Container/Presentational**: Separation of logic and UI
- **Higher Order Components**: Protected routes with role checks
- **Redux Slices**: Modular state management
- **Service Layer**: API abstraction for database operations
- **Async Thunks**: Redux middleware for async operations

---

## Authentication System

### 1. User Registration Flow

#### File: `src/APIs/LoginAPi.jsx` - `signupApi()`

**Process:**
1. **Input Validation**
   - Trim all input fields
   - Validate contact number (exactly 10 digits)
   - Email format validation by Firebase

2. **Firebase Authentication**
   - Creates user account with Firebase Auth
   - Returns idToken and localId

3. **User Data Storage**
   - Converts email to Firebase-safe key (`email@domain.com` → `email_domain_com`)
   - Stores user data in `/users/{emailKey}`:
     ```json
     {
       "email": "mohan@example.com",
       "name": "Mohan",
       "role": "user",
       "contactNo": "1234567890",
       "address": "123 Delhi",
       "createdAt": "2026-01-23T10:30:00.000Z"
     }
     ```

4. **Local Storage**
   - Stores `token`, `email`, `role` in localStorage
   - Token used for authenticated requests


### 2. Login Flow

#### File: `src/APIs/LoginAPi.jsx` - `loginApi()`

**Process:**
1. **Authentication**
   - Firebase Auth validates credentials
   - Returns idToken with 1-hour expiry

2. **User Data Retrieval**
   - Fetches user profile from `/users/{emailKey}`
   - Retrieves role (user/admin)

3. **Session Management**
   - Stores token, email, role in localStorage
   - Token automatically sent with API requests

4. **Redirect Logic**
   - Admin → `/admin` dashboard
   - User → `/user` dashboard

### 3. Token Management

#### File: `src/Store/authSlice.jsx` - `checkAuth()`

**Token Refresh Logic:**

**Auto-Refresh Strategy:**
- Token validated on app load
- Invalid token triggers logout
- User redirected to login page

### 4. Role-Based Access Control

#### File: `src/Routes/AppRouter.jsx`

**Protected Routes:**

---

## State Management

### Redux Store Structure

#### File: `src/Store/Store.jsx`

```javascript
const store = configureStore({
  reducer: {
    auth: authReducer,      // Authentication state
    books: bookReducer,     // Book inventory
    requests: requestReducer, // Drop/return requests
    cart: cartReducer       // Shopping cart
  }
});
```

### 1. Auth Slice (`authSlice.jsx`)

**State Shape:**
```javascript
{
  isAuthenticated: false,
  email: null,
  role: null,
  name: null,
  notificationCount: 0,
  adminNotificationCount: 0,
  loading: false,
  error: null
}
```

**Key Actions:**
- `login()` - User login with credentials
- `logout()` - Clear session and redirect
- `checkAuth()` - Validate token on app load
- `setNotificationCount()` - Update notification badge
- `validateToken()` - Check token validity


### 2. Books Slice (`BookSlice.jsx`)

**State Shape:**
```javascript
{
  list: [],           // Array of book objects
  loading: false,
  error: null
}
```

**Key Actions:**
- `fetchBooks()` - Get all books from database
- `addBook(bookData)` - Admin adds new book
- `updateBook({ id, updates })` - Edit book details
- `deleteBook(bookId)` - Remove book from inventory

**Book Object Structure:**
```javascript
{
  id: "book-name-slug",
  name: "Book Name",
  description: "Book description",
  type: "Fiction",
  price: 100,
  quantity: 5,
  imageUrl: "https://...",
  createdAt: "2026-01-23T10:00:00.000Z"
}
```

### 3. Cart Slice (`CartSlice.jsx`)

**State Shape:**
```javascript
{
  items: [
    {
      book: { /* book object */ },
      startDate: "2026-01-23",
      endDate: "2026-01-30",
      quantity: 1,
      rentalFee: 21,
      securityDeposit: 49
    }
  ]
}
```

**Key Actions:**
- `addToCart({ book, startDate, endDate, quantity })` - Add item to cart
- `removeFromCart(bookId)` - Remove item from cart
- `updateCartItemQuantity({ bookId, quantity })` - Update quantity
- `clearCart()` - Empty cart after checkout

**Rental Calculation Logic:**
```javascript
const calculateRentalCost = (book, startDate, endDate) => {
  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const dailyRate = book.price * 0.001;
  const totalCost = dailyRate * days;
  
  return {
    rentalFee: totalCost * 0.3,        // User pays 30%
    securityDeposit: totalCost * 0.7   // Refundable 70%
  };
};
```

### 4. Request Slice (`RequestSlice.jsx`)

**State Shape:**
```javascript
{
  list: [
    {
      id: "request-id",
      type: "drop_request",
      bookName: "Book Name",
      userEmail: "user@email.com",
      status: "pending",
      createdAt: "2026-01-23T10:00:00.000Z"
    }
  ],
  loading: false,
  error: null
}
```

**Key Actions:**
- `fetchDropRequests()` - Get all drop-off requests
- `approveRequest(requestId)` - Admin approves request
- `rejectRequest({ requestId, reason })` - Admin rejects with reason

---

## API Layer

### 1. Book API (`BookAPicall.jsx`)

#### Get All Books


#### Add Book (Admin Only)
#### Update Book
#### Delete Book


### 2. Request API (`RequestAPi.jsx`)

#### Create Drop Request

#### Get User Notifications


### 3. Transaction API (`TransactionAPI.jsx`)

#### Save Transaction


#### Create Rent Transaction


### 4. Rental Notification Service (`RentalNotificationService.jsx`)

#### Check Rental Periods (Auto-runs hourly)

#### Send One Day Reminder


---

## Component Documentation

### Admin Components

#### 1. AdminHome.jsx

**Purpose:** Main admin dashboard displaying all books with management options

**Key Features:**
- Display all books in grid layout
- Search functionality (name, description)
- Category filtering with URL routing
- Add/Edit/Delete book operations
- Real-time data refresh (5-second interval)
- Pending request count badge

**State Management:**
```javascript
const books = useSelector((state) => state.books.list);
const [selectedCategory, setSelectedCategory] = useState("All");
const [searchParams] = useSearchParams();
const searchQuery = searchParams.get('search') || '';
```

**Filtering Logic:**

#### 2. AdminRequests.jsx

**Purpose:** Handle book drop-off and return requests from users

**Key Features:**
- Display all pending requests
- Approve/Reject with modal confirmations
- Automatic book quantity updates on approval
- Real-time notification count
- Status badges (pending, approved, rejected)

**Approve Request Flow:**

#### 3. AdminNotifications.jsx

**Purpose:** Centralized notification center for all admin actions

**Key Features:**
- Combined view of drop requests and return requests
- Filter by type (all, drop, return)
- Mark as read functionality
- Action buttons (approve/reject)
- Notification badges with counts

**Notification Types:**
```javascript
const notificationTypes = {
  drop_request: {
    message: "wants to drop off a book"
  },
  return_request: {
    message: "wants to return a book"
  },
  overdue: {
    message: "has an overdue rental"
  }
};
```

### User Components

#### 1. UserHome.jsx (Home.jsx)

**Purpose:** User dashboard for browsing and searching books

**Key Features:**
- Display available books
- Search by name/description
- Category filtering
- View book details modal
- Add to cart functionality
- Real-time book availability updates

**Search Implementation:**

#### 2. Cart.jsx

**Purpose:** Shopping cart for managing rental items before checkout

**Key Features:**
- Display cart items with details
- Adjust quantity for each item
- Remove items from cart
- Calculate total rental fee and security deposit
- Checkout with validation

#### 3. MyRentals.jsx

**Purpose:** Display user's active and past rentals

**Key Features:**
- List all user rentals
- Status indicators (active, overdue, returned)
- Request return functionality
- Rental details (dates, fees, deposits)
- Return date countdown

#### 4. DropBook.jsx

**Purpose:** Allow users to submit book drop-off requests

**Key Features:**
- Form for book details
- User information auto-fill
- Image upload (URL input)
- Validation before submission
- Success/error notifications

### Shared Components

#### 1. Nav.jsx (Admin & User)

**Purpose:** Navigation bar with menu, notifications, and logout

**Admin Navigation Items:**
- Home
- Add Book
- Requests (with badge)
- Notifications (with badge)
- Transactions
- Profile
- Logout

**User Navigation Items:**
- Home
- My Rentals
- Cart (with count)
- Drop Book
- Notifications (with badge)
- Transactions
- Logout

**Notification Badge Logic:**

#### 2. Categories.jsx (Admin & User)

**Purpose:** Category filter buttons

**Categories:**
- All
- Fiction
- Non-fiction
- Science
- History
- Biography
- Self-help
- Education
- Technology
- Business & Finance

### Database Rules (Security)

```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null"
      }
    },
    "books": {
      ".read": true,
      ".write": "auth != null"
    },
    "rentBook": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "adminNotifications": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "userNotifications": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "transactions": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

---

## Rental System Logic

### Rental Calculation Breakdown

#### Formula Components

1. **Daily Rate Calculation**
   ```javascript
   const dailyRate = bookPrice * 0.001;
   ```
   - Example: Book price = ₹500
   - Daily rate = 500 × 0.001 = ₹0.50

2. **Total Cost Calculation**
   ```javascript
   const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
   const totalCost = dailyRate * days;
   ```
   - Example: 7 days rental
   - Total cost = 0.50 × 7 = ₹3.50

3. **Rental Fee (30%)**
   ```javascript
   const rentalFee = totalCost * 0.3;
   ```
   - Example: Total cost = ₹3.50
   - Rental fee = 3.50 × 0.3 = ₹1.05
   - **User pays this amount**

4. **Security Deposit (70%)**
   ```javascript
   const securityDeposit = totalCost * 0.7;
   ```
   - Example: Total cost = ₹3.50
   - Security deposit = 3.50 × 0.7 = ₹2.45
   - **Refundable on book return**

#### Complete Example

```javascript
// Book: "The Great Gatsby", Price: ₹500
// Rental: 7 days (Jan 23 - Jan 30)

const bookPrice = 500;
const days = 7;

// Step 1: Calculate daily rate
const dailyRate = bookPrice * 0.001;  // ₹0.50

// Step 2: Calculate total cost
const totalCost = dailyRate * days;   // ₹3.50

// Step 3: Split into rental fee and deposit
const rentalFee = totalCost * 0.3;          // ₹1.05 (user pays)
const securityDeposit = totalCost * 0.7;    // ₹2.45 (refundable)

// Total paid by user at checkout
const totalPaid = rentalFee + securityDeposit;  // ₹3.50

// On return approval:
// - User keeps the book
// - Security deposit (₹2.45) is refunded
// - Actual cost to user: ₹1.05
```

### Rental Status Flow

```
User Rents Book
      ↓
Status: "active"
      ↓
1 Day Before End Date
      ↓
Status: "one_day_reminder"
Notification: " 1 day to go!"
      ↓
On End Date
      ↓
Status: "reminder_sent"
Notification: " Return today!"
      ↓
Past End Date
      ↓
Status: "overdue"
Notification: " Book overdue!"
      ↓
User Requests Return
      ↓
Status: "return_requested"
      ↓
Admin Approves
      ↓
Status: "returned"
Security Deposit Refunded
```

---

## Notification System

### Automated Notification Process

#### 1. Hourly Check (Cron-like behavior)

**Implementation:**
```javascript
// In UserHome.jsx or admin dashboard
useEffect(() => {
  // Run once on load
  checkRentalPeriods();
  
  // Run every hour (3600000 ms)
  const interval = setInterval(() => {
    checkRentalPeriods();
  }, 3600000);
  
  return () => clearInterval(interval);
}, []);
```

#### 2. Check Rental Periods Function

```javascript
export const checkRentalPeriods = async () => {
  try {
    // Fetch all active rentals
    const response = await fetch(
      "https://book-app-339c8-default-rtdb.firebaseio.com/rentBook.json"
    );
    const rentals = await response.json();
    
    if (!rentals) return;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset to midnight for date comparison
    
    for (const [rentalId, rental] of Object.entries(rentals)) {
      if (rental.status === "returned") continue;
      
      const endDate = new Date(rental.endDate);
      endDate.setHours(0, 0, 0, 0);
      
      const daysUntilDue = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      
      // Handle different scenarios
      if (daysUntilDue === 1 && rental.status !== "one_day_reminder") {
        await sendOneDayReminder(rental, rentalId);
      } else if (daysUntilDue === 0 && rental.status !== "reminder_sent") {
        await sendRentalReminder(rental, rentalId);
      } else if (daysUntilDue < 0 && rental.status !== "overdue") {
        await markAsOverdue(rental, rentalId);
      }
    }
  } catch (error) {
    console.error("Error checking rental periods:", error);
  }
};
```

#### 3. Notification Types

**A. One Day Reminder**
```javascript
const sendOneDayReminder = async (rental, rentalId) => {
  const notification = {
    type: "one_day_reminder",
    bookName: rental.bookName,
    userEmail: rental.userEmail,
    message: `⏰ 1 day to go! Your rental for '${rental.bookName}' ends tomorrow (${rental.endDate}). Please return the book on time.`,
    rentalId,
    createdAt: new Date().toISOString(),
    read: false,
    priority: "high"
  };
  
  const emailKey = rental.userEmail.replace(/\./g, "_");
  
  await fetch(
    `https://book-app-339c8-default-rtdb.firebaseio.com/userNotifications/${emailKey}.json`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification)
    }
  );
  
  // Update rental status
  await fetch(
    `https://book-app-339c8-default-rtdb.firebaseio.com/rentBook/${rentalId}.json`,
    {
      method: "PATCH",
      body: JSON.stringify({ 
        status: "one_day_reminder",
        lastNotified: new Date().toISOString()
      })
    }
  );
};
```

**B. Rental Reminder (Due Today)**

  
  // Same notification saving logic
  // Update status to "reminder_sent"

  
  // Same notification saving logic
  // Update status to "overdue"

### Notification Display

**User Notification Card:**


---

## Security Implementation

### 1. Authentication Security

**Token Storage:**
```javascript
// Store in localStorage (client-side)
localStorage.setItem("token", idToken);
localStorage.setItem("email", email);
localStorage.setItem("role", role);
```

**Token Validation:**

### 2. Email Sanitization

**Problem:** Firebase keys cannot contain `.` `$` `#` `[` `]` `/`

**Solution:**
```javascript
const emailToKey = (email) => {
  return email.replace(/\./g, "_");
};

// Example:
// user@email.com → user_email_com
// admin.test@domain.co.uk → admin_test@domain_co_uk
```

### 3. Input Validation

**Contact Number Validation:**
```javascript
const validateContactNo = (contactNo) => {
  const pattern = /^\d{10}$/;
  return pattern.test(contactNo);
};
```

**Email Validation:**
```javascript
const validateEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};
```

**Book Name Sanitization:**
```javascript
const sanitizeBookName = (name) => {
  return name.trim().replace(/\s+/g, " ");
};
```

### 4. Protected Routes

**Route Protection Logic:**
```javascript
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};
```

### 5. XSS Prevention

**React's Built-in Protection:**
- React automatically escapes values in JSX
- User input is safe by default



---

## Deployment Guide

### 1. Production Build

```bash
# Build for production
npm run build

# Output will be in 'dist' folder
```

### 2. Firebase Hosting Deployment

**Login to Firebase:**
```bash
firebase login
```

**Initialize Project:**
```bash
firebase init hosting

# Choose:
# - Use existing project
# - Public directory: dist
# - Configure as single-page app: Yes
# - Overwrite index.html: No
```

**Deploy:**
```bash
npm run build
```





### Common Issues & Solutions

#### 1. Authentication Issues
```javascript
// Check token validity
const token = localStorage.getItem("token");
if (!token) {
  // Redirect to login
  navigate("/login");
}

// Validate token
const result = await validateTokenApi(token);
if (!result.valid) {
  localStorage.clear();
  navigate("/login");
}
```

#### 2. Book Quantity Not Updating
```javascript

// Ensure PATCH request is used
await fetch(`${DB_BASE_URL}/books/${bookKey}.json`, {
  method: "PATCH",  // Not PUT
  body: JSON.stringify({ quantity: newQuantity })
});

// Refresh books list
dispatch(fetchBooks());
```

#### 3. Notifications Not Showing
```javascript
// Check notification fetch
const emailKey = email.replace(/\./g, "_");
const response = await fetch(
  `${DB_BASE_URL}/userNotifications/${emailKey}.json`
);

// Ensure notifications are sorted by date
const notifications = Object.entries(data)
  .map(([id, notif]) => ({ id, ...notif }))
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
```

#### 4. Cart Items Disappearing
// Persist cart to localStorage

// Load cart on app start
const persistedCart = localStorage.getItem('cart');
const preloadedState = {
  cart: persistedCart ? JSON.parse(persistedCart) : { items: [] }
};

#### 5. Firebase CORS Errors
#### 6. Rental Date Validation

#### 7. Return Request Not Processing

**Problem:** Return request stuck in pending

**Solution:**
```javascript
// Ensure all steps complete
const handleApproveReturn = async (requestId, rental) => {
  try {
    // 1. Update request status
    await updateRequestStatus(requestId, "approved");
    
    // 2. Update rental status
    await updateRentalStatus(rental.id, "returned");
    
    // 3. Refund security deposit
    await refundSecurityDeposit(rental);
    
    // 4. Update book quantity
    await incrementBookQuantity(rental.bookName);
    
    // 5. Notify user
    await sendUserNotification(rental.userEmail, "approved");
    
    toast.success("Return approved successfully!");
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to process return");
  }
};



### API Reference

### Authentication APIs

#### `signupApi(email, password, name, contactNo, address)`
- **Description:** Register new user
- **Returns:** `{ token, email, role }`
- **Errors:** Email exists, weak password, invalid contact

#### `loginApi(email, password)`
- **Description:** User/admin login
- **Returns:** `{ token, email, role, name }`
- **Errors:** Invalid credentials, email not found

#### `validateTokenApi(token)`
- **Description:** Check token validity
- **Returns:** `{ valid: boolean }`

### Book APIs

#### `getAllBooksApi()`
- **Description:** Fetch all books
- **Returns:** `Array<Book>`

#### `addBookApi(bookData)`
- **Description:** Add new book (admin)
- **Params:** `{ name, description, type, price, quantity, imageUrl }`
- **Returns:** `{ id, ...bookData }`

#### `updateBookApi(bookId, updates)`
- **Description:** Update book details (admin)
- **Returns:** Updated book object

#### `deleteBookApi(bookId)`
- **Description:** Delete book (admin)
- **Returns:** Deleted book ID

### Transaction APIs

#### `createRentTransaction(rentalData)`
- **Description:** Create new rental
- **Params:** `{ bookName, userEmail, startDate, endDate, rentalFee, securityDeposit }`
- **Returns:** Rental ID

#### `createSecurityDepositTransaction(data)`
- **Description:** Record security deposit
- **Params:** `{ userEmail, bookName, amount, rentalId }`
- **Returns:** Transaction ID

### Request APIs

#### `createDropRequestApi(requestData)`
- **Description:** User submits book drop-off request
- **Params:** `{ bookName, userEmail, userName, contactNo, message, imageUrl }`
- **Returns:** Request ID

#### `getUserNotificationsApi(userEmail)`
- **Description:** Get user's notifications
- **Returns:** `Array<Notification>`

---

## Conclusion

This documentation covers the complete technical implementation of the Book Library Rental Management System. For additional support or questions, please refer to the [RENTAL_SYSTEM_GUIDE.md](RENTAL_SYSTEM_GUIDE.md) or contact the development team.



