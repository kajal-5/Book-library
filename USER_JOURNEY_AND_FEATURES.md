# 📚 Book Library - Complete User Journey & Features Guide

## Document Overview
This document provides a comprehensive walkthrough of the Book Library Rental Management System, including all features, user journeys, and workflows for both Users and Administrators.

**Version:** 1.0.0  
**Last Updated:** January 23, 2026  
**Author:** Himans SR

---

## Table of Contents

1. [System Overview](#system-overview)
2. [User Roles](#user-roles)
3. [Complete Feature List](#complete-feature-list)
4. [User Journey - Registration & Login](#user-journey---registration--login)
5. [User Journey - Browsing & Renting Books](#user-journey---browsing--renting-books)
6. [User Journey - Managing Rentals](#user-journey---managing-rentals)
7. [User Journey - Returning Books](#user-journey---returning-books)
8. [Admin Journey - Dashboard Management](#admin-journey---dashboard-management)
9. [Admin Journey - Book Management](#admin-journey---book-management)
10. [Admin Journey - Request Management](#admin-journey---request-management)
11. [Notification System Flow](#notification-system-flow)
12. [Transaction Flow](#transaction-flow)
13. [Technical Workflow](#technical-workflow)
14. [Use Case Scenarios](#use-case-scenarios)

---

## System Overview

### What is This System?

The Book Library Rental Management System is a web-based platform that connects book owners (admins) with readers (users) through a rental service. The system automates:

- **Book inventory management**
- **Rental transactions with security deposits**
- **Return request approvals**
- **Automated reminder notifications**
- **Financial transaction tracking**

### Key Benefits

**For Users:**
- Affordable book access through rentals (pay only 30% of rental cost)
- Security deposit protection (70% refunded on return)
- Automated reminders for due dates
- Easy rental management dashboard

**For Admins:**
- Centralized book inventory control
- Automated notification system
- Request approval workflow
- Complete transaction visibility

---

## User Roles

### 1. **User (Reader/Renter)**
- Browse and search books
- Rent books with automatic calculations
- Manage active rentals
- Request book returns
- Drop off owned books for rental
- View transaction history
- Receive automated notifications

### 2. **Admin (Library Manager)**
- Manage book inventory (Add/Edit/Delete)
- Approve/Reject user requests
- Handle book returns
- Monitor all transactions
- View system-wide notifications
- Manage profile information

---

## Complete Feature List

### 🎯 Core Features

#### **User Features (10 Features)**

1. **User Registration & Authentication**
   - Sign up with email, password, name, contact, address
   - Secure login with JWT token
   - Forgot password functionality
   - Auto-redirect based on role

2. **Book Browsing & Search**
   - View all available books
   - Real-time search by name/description
   - Filter by categories (Fiction, Science, History, etc.)
   - View book details (price, quantity, description)

3. **Smart Rental Calculator**
   - Automatic price calculation based on rental duration
   - 30% rental fee (user pays)
   - 70% security deposit (refundable)
   - Daily rate: Book Price × 0.001

4. **Shopping Cart System**
   - Add multiple books to cart
   - Adjust rental dates per book
   - Modify quantity
   - Remove items
   - View total rental fee and security deposit

5. **Checkout Process**
   - Review cart items
   - Confirm rental details
   - Process multiple rentals at once
   - Automatic inventory update

6. **My Rentals Dashboard**
   - View all active rentals
   - See rental status (Active, Due Soon, Overdue)
   - Track return dates
   - Countdown timer for due dates
   - Request return option

7. **Automated Notifications**
   - 1-day reminder before due date
   - Due date notification
   - Overdue alerts
   - Request approval/rejection notifications
   - Real-time notification badge count

8. **Book Drop-Off System**
   - Submit request to drop off owned books
   - Provide book details and image
   - Track request status
   - Receive approval/rejection feedback

9. **Transaction History**
   - View all rental transactions
   - See rental fees paid
   - Track security deposits
   - View refund history
   - Filter by date and type

10. **Rent Again Feature**
    - Quick re-rent previously rented books
    - Pre-filled book information
    - Select new rental dates
    - One-click rental process

#### **Admin Features (10 Features)**

1. **Admin Dashboard**
   - Overview of all books
   - Quick stats (total books, pending requests)
   - Search and filter capabilities
   - Category-based navigation

2. **Add New Books**
   - Comprehensive book form
   - Fields: Name, Description, Category, Price, Quantity, Image
   - Custom category option
   - Real-time validation
   - Image URL support

3. **Edit Books**
   - Update book details
   - Modify prices and quantities
   - Change categories
   - Update descriptions and images

4. **Delete Books**
   - Remove books from inventory
   - Confirmation dialogs
   - Automatic cleanup of related data

5. **Request Management System**
   - View all drop-off requests
   - View all return requests
   - Combined request dashboard
   - Filter by type and status
   - Approve/Reject with reasons

6. **Return Request Processing**
   - Dedicated return request interface
   - View rental history
   - Approve returns (refund deposit)
   - Reject with explanation
   - Update book inventory automatically

7. **Admin Notifications Center**
   - Centralized notification hub
   - Drop-off and return request alerts
   - Pending action badges
   - Mark as read functionality
   - Real-time updates every 5 seconds

8. **Transaction Monitoring**
   - View all system transactions
   - Filter by user, book, or type
   - Track rental fees collected
   - Monitor security deposits held/refunded
   - Export capabilities

9. **Admin Profile Management**
   - Update contact information
   - Change admin details
   - View admin statistics

10. **Category Management**
    - Predefined categories
    - Custom category creation
    - Category-based book filtering
    - URL-friendly category routing

#### **System Features (8 Features)**

1. **Dual Authentication System**
   - Role-based access control
   - JWT token management
   - Auto-logout on token expiry
   - Protected routes

2. **Real-time Data Synchronization**
   - Firebase Realtime Database
   - Auto-refresh intervals
   - Instant updates across users

3. **Responsive Design**
   - Mobile-first approach
   - Tablet optimization
   - Desktop full-features
   - Touch-friendly interface

4. **Toast Notification System**
   - Success messages
   - Error alerts
   - Warning notifications
   - User-friendly feedback

5. **Automated Reminder System**
   - Hourly cron-like checks
   - Automatic status updates
   - Email-like notification delivery

6. **Security Deposit Management**
   - Automatic hold on rental
   - Refund on approved return
   - Transaction tracking

7. **Redux State Management**
   - Centralized state
   - Persistent cart
   - Optimistic updates

8. **Loading & Error States**
   - Skeleton loaders
   - Error boundaries
   - Retry mechanisms

---

## User Journey - Registration & Login

### Journey 1: New User Registration

```
START → Landing Page (Redirect to Login)
   ↓
Login Page
   ↓
Click "Sign Up"
   ↓
Registration Form
   ├── Email (validated format)
   ├── Password (min 6 characters)
   ├── Full Name
   ├── Contact Number (exactly 10 digits)
   └── Address
   ↓
Submit Form
   ↓
Validation Check
   ├── ✅ Valid → Create Account
   │              ↓
   │         Store in Firebase
   │              ↓
   │         Generate JWT Token
   │              ↓
   │         Store in localStorage
   │              ↓
   │         Redirect to /user Dashboard
   │
   └── ❌ Invalid → Show Error
                    ↓
                Back to Form
```

**Step-by-Step Flow:**

1. **User visits the website** → Automatically redirected to `/login`

2. **User clicks "Sign Up" link** → Navigates to `/signup`

3. **User fills registration form:**
   - **Email:** user@example.com
   - **Password:** ••••••••
   - **Name:** John Doe
   - **Contact:** 1234567890
   - **Address:** 123 Main Street, City

4. **System validates input:**
   - Email format check
   - Password strength (minimum 6 characters)
   - Contact number (must be 10 digits)
   - No field should be empty

5. **Firebase creates account:**
   - Generates unique user ID
   - Returns authentication token
   - Token expires in 1 hour

6. **System stores user data:**
   ```json
   {
     "email": "user@example.com",
     "name": "John Doe",
     "role": "user",
     "contactNo": "1234567890",
     "address": "123 Main Street",
     "createdAt": "2026-01-23T10:00:00Z"
   }
   ```

7. **User is logged in automatically:**
   - Token saved in localStorage
   - Role set as "user"
   - Redirected to `/user` dashboard

8. **Success notification shown:** "Account created successfully! Welcome to Book Library."

### Journey 2: Returning User Login

```
START → Landing Page
   ↓
Login Page
   ↓
Enter Credentials
   ├── Email
   └── Password
   ↓
Submit Login
   ↓
Firebase Authentication
   ├── ✅ Valid Credentials
   │       ↓
   │   Fetch User Data
   │       ↓
   │   Check Role
   │       ├── role = "admin" → Redirect to /admin
   │       └── role = "user" → Redirect to /user
   │
   └── ❌ Invalid Credentials
           ↓
       Show Error Message
           ↓
       Stay on Login Page
```

**Step-by-Step Flow:**

1. **User navigates to login page**

2. **Enters credentials:**
   - Email: user@example.com
   - Password: ••••••••

3. **Clicks "Login" button**

4. **System authenticates:**
   - Sends request to Firebase Auth
   - Validates email and password
   - Retrieves user token

5. **On successful authentication:**
   - Fetches user profile from database
   - Checks user role (user or admin)
   - Stores token, email, role in localStorage

6. **Role-based redirect:**
   - **If User:** → `/user` dashboard
   - **If Admin:** → `/admin` dashboard

7. **Token management:**
   - Token valid for 1 hour
   - Auto-refresh on page load
   - Logout if token expired

### Journey 3: Forgot Password

```
Login Page
   ↓
Click "Forgot Password?"
   ↓
Enter Email
   ↓
Submit
   ↓
Firebase Sends Reset Email
   ↓
User Clicks Link in Email
   ↓
Reset Password Page
   ↓
Enter New Password
   ↓
Password Updated
   ↓
Redirect to Login
```

---

## User Journey - Browsing & Renting Books

### Journey 4: Browse and Search Books

```
User Dashboard (/user)
   ↓
Book Grid Display (All Available Books)
   │
   ├── Option 1: Browse All
   │      ↓
   │   Scroll through books
   │      ↓
   │   Click "View Details"
   │
   ├── Option 2: Search
   │      ↓
   │   Type in search bar
   │      ↓
   │   Real-time filtering
   │      ↓
   │   Results update instantly
   │
   └── Option 3: Filter by Category
          ↓
      Click category button
          ↓
      URL updates: /user/category/fiction
          ↓
      See only Fiction books
```

**Step-by-Step Flow:**

1. **User lands on dashboard** → Sees grid of available books

2. **Each book card shows:**
   - Book cover image
   - Book name
   - Category/Type
   - Price (₹)
   - Available quantity
   - "View Details" button

3. **Search functionality:**
   - User types "gatsby" in search bar
   - System filters in real-time
   - Shows only books matching "gatsby" in name or description

4. **Category filtering:**
   - User clicks "Fiction" category
   - URL changes to `/user/category/fiction`
   - Only Fiction books displayed
   - Category remains selected (highlighted)

5. **Book availability indicator:**
   - **Green badge:** "5 Available"
   - **Yellow badge:** "Only 2 left"
   - **Red badge:** "Out of Stock" (cannot rent)

### Journey 5: Rent a Book (Add to Cart)

```
Book Card
   ↓
Click "View Details"
   ↓
Book Details Modal Opens
   │
   ├── Book Information
   │   ├── Name
   │   ├── Description
   │   ├── Category
   │   ├── Price
   │   └── Available Quantity
   │
   └── Rental Form
       ├── Select Start Date (Today or later)
       ├── Select End Date (After start date)
       ├── Choose Quantity (1 to available stock)
       └── See Cost Breakdown
           ├── Daily Rate = Price × 0.001
           ├── Total Days = End Date - Start Date
           ├── Total Cost = Daily Rate × Days
           ├── Rental Fee (30%) = You Pay
           └── Security Deposit (70%) = Refundable
   ↓
Click "Add to Cart"
   ↓
Validation Check
   ├── ✅ Valid → Add to Cart State
   │              ↓
   │         Show Success Toast
   │              ↓
   │         Update Cart Badge Count
   │              ↓
   │         Close Modal
   │
   └── ❌ Invalid → Show Error
                    ↓
                Stay in Modal
```

**Example Calculation:**

**Book:** "The Great Gatsby"  
**Price:** ₹500  
**Rental Period:** 7 days (Jan 23 - Jan 30)

```
Step 1: Calculate Daily Rate
Daily Rate = ₹500 × 0.001 = ₹0.50 per day

Step 2: Calculate Total Cost
Total Cost = ₹0.50 × 7 days = ₹3.50

Step 3: Split into Rental Fee & Deposit
Rental Fee (30%) = ₹3.50 × 0.3 = ₹1.05 ← You pay this
Security Deposit (70%) = ₹3.50 × 0.7 = ₹2.45 ← Refundable

Total Checkout Amount = ₹3.50
Your Actual Cost = ₹1.05 (after deposit refund)
```

**Step-by-Step Flow:**

1. **User clicks "View Details" on a book card**

2. **Modal opens with two sections:**
   - Left: Book information and image
   - Right: Rental form

3. **User fills rental form:**
   - **Start Date:** Selects 2026-01-23
   - **End Date:** Selects 2026-01-30
   - **Quantity:** Selects 1 book

4. **System calculates in real-time:**
   - Shows calculation breakdown
   - Updates as user changes dates

5. **User reviews calculation:**
   - ✅ Rental Fee: ₹1.05
   - ✅ Security Deposit: ₹2.45
   - ✅ Total: ₹3.50

6. **User clicks "Add to Cart"**

7. **System validation:**
   - Start date not in past
   - End date after start date
   - Quantity available
   - All fields filled

8. **If valid:**
   - Item added to Redux cart state
   - Success toast: "Book added to cart!"
   - Cart badge updates: (1)
   - Modal closes

9. **User can:**
   - Continue browsing (add more books)
   - Go to cart to checkout

### Journey 6: Shopping Cart & Checkout

```
Cart Page (/user/cart)
   ↓
View Cart Items
   │
   ├── For Each Item:
   │   ├── Book Details
   │   ├── Rental Dates
   │   ├── Quantity Selector (±)
   │   ├── Cost Breakdown
   │   └── Remove Button
   │
   ├── Cart Summary
   │   ├── Total Items
   │   ├── Total Rental Fee
   │   └── Total Security Deposit
   │
   └── Actions
       ├── Continue Shopping → Back to /user
       └── Checkout → Process Rentals
   ↓
Click "Checkout"
   ↓
Confirmation Dialog
"Confirm rental of 2 books for ₹X?"
   ↓
Click "Confirm"
   ↓
Processing (for each item):
   ├── Create Rental Record
   ├── Save Rental Fee Transaction
   ├── Save Security Deposit Transaction
   └── Update Book Quantity
   ↓
Success!
   ├── Clear Cart
   ├── Show Success Toast
   └── Redirect to /user/rentals
```

**Step-by-Step Flow:**

1. **User clicks cart icon** → Navigates to `/user/cart`

2. **Cart displays:**
   ```
   Cart Items (2)
   
   ╔═══════════════════════════════════════╗
   ║ 📚 The Great Gatsby                   ║
   ║ Jan 23 - Jan 30 (7 days)             ║
   ║ Qty: [1] [-][+]                      ║
   ║ Rental Fee: ₹1.05                    ║
   ║ Security Deposit: ₹2.45              ║
   ║ [Remove]                             ║
   ╚═══════════════════════════════════════╝
   
   ╔═══════════════════════════════════════╗
   ║ 📚 Sapiens                            ║
   ║ Jan 24 - Jan 31 (7 days)             ║
   ║ Qty: [1] [-][+]                      ║
   ║ Rental Fee: ₹1.26                    ║
   ║ Security Deposit: ₹2.94              ║
   ║ [Remove]                             ║
   ╚═══════════════════════════════════════╝
   
   ────────────────────────────────────────
   Total Rental Fee: ₹2.31
   Total Security Deposit: ₹5.39
   Grand Total: ₹7.70
   ────────────────────────────────────────
   
   [Continue Shopping]  [Checkout →]
   ```

3. **User can modify cart:**
   - **Increase quantity:** Click [+]
   - **Decrease quantity:** Click [-]
   - **Remove item:** Click [Remove]
   - Changes update totals instantly

4. **User clicks "Checkout"**

5. **Confirmation dialog appears:**
   ```
   ╔════════════════════════════════════╗
   ║    Confirm Your Rental             ║
   ║                                    ║
   ║ You are about to rent 2 books      ║
   ║                                    ║
   ║ Total Amount: ₹7.70                ║
   ║ Rental Fee: ₹2.31                  ║
   ║ Security Deposit: ₹5.39            ║
   ║                                    ║
   ║ Note: Security deposit will be     ║
   ║ refunded when you return books.    ║
   ║                                    ║
   ║     [Cancel]  [Confirm Rental]     ║
   ╚════════════════════════════════════╝
   ```

6. **User clicks "Confirm Rental"**

7. **System processes each book:**
   
   **For Book 1 (The Great Gatsby):**
   - Create rental record in `/rentBook`
   - Save rental fee transaction (₹1.05)
   - Save security deposit transaction (₹2.45)
   - Update book quantity: 5 → 4

   **For Book 2 (Sapiens):**
   - Create rental record in `/rentBook`
   - Save rental fee transaction (₹1.26)
   - Save security deposit transaction (₹2.94)
   - Update book quantity: 3 → 2

8. **On success:**
   - Cart cleared from Redux state
   - Success toast: "Checkout successful! Books rented."
   - Auto-redirect to `/user/rentals`

9. **User sees rentals in "My Rentals" page**

---

## User Journey - Managing Rentals

### Journey 7: View My Rentals

```
My Rentals Page (/user/rentals)
   ↓
Display All User Rentals
   │
   ├── Active Rentals (Status: Active)
   │   ├── Book Name
   │   ├── Rental Period
   │   ├── Days Remaining
   │   ├── Status Badge
   │   └── [Request Return] Button
   │
   ├── Due Soon (1 day left)
   │   └── Yellow warning badge
   │
   ├── Overdue Rentals (Past due date)
   │   └── Red alert badge
   │
   └── Returned Rentals (Status: Returned)
       └── Green completed badge
```

**Step-by-Step Flow:**

1. **User navigates to "My Rentals"**

2. **System fetches user's rental data:**
   ```javascript
   Filter rentals where userEmail = current user
   Sort by endDate (newest first)
   ```

3. **Display rental cards:**

   **Active Rental Example:**
   ```
   ╔═══════════════════════════════════════════╗
   ║ 📚 The Great Gatsby                       ║
   ║ ────────────────────────────────────────  ║
   ║ Rental Period: Jan 23 - Jan 30, 2026     ║
   ║ Status: [Active - 5 days left] 🟢        ║
   ║                                           ║
   ║ Rental Fee Paid: ₹1.05                   ║
   ║ Security Deposit: ₹2.45 (Refundable)     ║
   ║                                           ║
   ║ Return Date: January 30, 2026            ║
   ║ ⏰ 5 days remaining                       ║
   ║                                           ║
   ║        [Request Return]                   ║
   ╚═══════════════════════════════════════════╝
   ```

   **Due Soon Example:**
   ```
   ╔═══════════════════════════════════════════╗
   ║ 📚 Sapiens                                ║
   ║ ────────────────────────────────────────  ║
   ║ Rental Period: Jan 24 - Jan 25, 2026     ║
   ║ Status: [Due Tomorrow] 🟡                 ║
   ║                                           ║
   ║ ⚠️ Please prepare to return tomorrow!     ║
   ║                                           ║
   ║        [Request Return]                   ║
   ╚═══════════════════════════════════════════╝
   ```

   **Overdue Example:**
   ```
   ╔═══════════════════════════════════════════╗
   ║ 📚 1984                                   ║
   ║ ────────────────────────────────────────  ║
   ║ Rental Period: Jan 10 - Jan 20, 2026     ║
   ║ Status: [OVERDUE - 3 days] 🔴            ║
   ║                                           ║
   ║ ❌ This book is overdue!                  ║
   ║ Please return immediately.                ║
   ║                                           ║
   ║        [Request Return NOW]               ║
   ╚═══════════════════════════════════════════╝
   ```

4. **Status badge color coding:**
   - 🟢 Green: Active (more than 1 day left)
   - 🟡 Yellow: Due tomorrow or today
   - 🔴 Red: Overdue
   - ✅ Green checkmark: Returned

---

## User Journey - Returning Books

### Journey 8: Request Book Return

```
My Rentals Page
   ↓
Select Rental
   ↓
Click "Request Return"
   ↓
Confirmation Dialog
"Request return for [Book Name]?"
   ↓
Click "Confirm"
   ↓
Create Return Request
   ├── Save to adminNotifications
   ├── Update rental status: "return_requested"
   └── Notify user: "Return request submitted"
   ↓
Request Status: PENDING
   ↓
Wait for Admin Approval
   │
   ├── Admin Approves ✅
   │       ↓
   │   Rental Status: "returned"
   │       ↓
   │   Refund Security Deposit
   │       ↓
   │   Update Book Quantity (+1)
   │       ↓
   │   User Notification: "Request approved! Deposit refunded."
   │       ↓
   │   Display in Transaction History
   │
   └── Admin Rejects ❌
           ↓
       User Notification: "Request rejected. Reason: [...]"
           ↓
       Rental remains active
           ↓
       User can request again
```

**Step-by-Step Flow:**

1. **User in My Rentals page**

2. **User clicks "Request Return" button**

3. **Confirmation modal appears:**
   ```
   ╔════════════════════════════════════════╗
   ║      Request Book Return               ║
   ║                                        ║
   ║  Book: The Great Gatsby                ║
   ║  Rental Period: Jan 23 - Jan 30        ║
   ║                                        ║
   ║  Security Deposit: ₹2.45               ║
   ║  (Will be refunded upon approval)      ║
   ║                                        ║
   ║  Are you sure you want to request      ║
   ║  return for this book?                 ║
   ║                                        ║
   ║     [Cancel]  [Confirm Request]        ║
   ╚════════════════════════════════════════╝
   ```

4. **User clicks "Confirm Request"**

5. **System creates return request:**
   ```javascript
   {
     type: "return_request",
     bookName: "The Great Gatsby",
     userEmail: "user@example.com",
     rentalId: "rental-123",
     securityDeposit: 2.45,
     status: "pending",
     createdAt: "2026-01-25T14:00:00Z"
   }
   ```

6. **Request saved to:**
   - `/adminNotifications/{requestId}` (for admin to see)
   - Rental status updated to "return_requested"

7. **User sees confirmation:**
   - Success toast: "Return request submitted!"
   - Rental card updates: Status badge shows "Return Pending"

8. **User receives notification:**
   ```
   📤 Return Request Submitted
   Your request to return "The Great Gatsby" has been 
   sent to the admin. You will be notified once processed.
   ```

9. **Waiting period:**
   - User can check status in "My Rentals"
   - Badge shows: "⏳ Return Pending"

### Journey 9: Admin Approves Return

**From Admin Side:**

1. **Admin sees notification:**
   ```
   🔔 New Return Request (1)
   
   ╔═══════════════════════════════════════╗
   ║ Return Request                        ║
   ║ ───────────────────────────────────── ║
   ║ User: user@example.com                ║
   ║ Book: The Great Gatsby                ║
   ║ Rental Period: Jan 23 - Jan 30        ║
   ║ Security Deposit: ₹2.45               ║
   ║                                       ║
   ║ [Reject]         [Approve Return ✓]  ║
   ╚═══════════════════════════════════════╝
   ```

2. **Admin clicks "Approve Return"**

3. **System processes approval:**
   
   **Step A: Update Request**
   ```javascript
   adminNotifications/{requestId} → status: "approved"
   ```

   **Step B: Update Rental**
   ```javascript
   rentBook/{rentalId} → status: "returned"
   ```

   **Step C: Refund Security Deposit**
   ```javascript
   Create transaction:
   {
     type: "security_deposit_refund",
     amount: 2.45,
     userEmail: "user@example.com",
     bookName: "The Great Gatsby"
   }
   ```

   **Step D: Update Book Quantity**
   ```javascript
   books/the-great-gatsby → quantity: 4 + 1 = 5
   ```

   **Step E: Notify User**
   ```javascript
   Create notification:
   {
     type: "request_approved",
     message: "Your return for 'The Great Gatsby' has been 
              approved! Security deposit of ₹2.45 refunded."
   }
   ```

4. **User receives notification:**
   ```
   ✅ Return Approved!
   
   Your return request for "The Great Gatsby" has been 
   approved by the admin.
   
   Security deposit of ₹2.45 has been refunded.
   
   Thank you for returning the book on time!
   ```

5. **User sees in My Rentals:**
   ```
   ╔═══════════════════════════════════════════╗
   ║ 📚 The Great Gatsby                       ║
   ║ ────────────────────────────────────────  ║
   ║ Rental Period: Jan 23 - Jan 30, 2026     ║
   ║ Status: [✅ Returned] 🟢                  ║
   ║                                           ║
   ║ Returned on: Jan 25, 2026                ║
   ║ Security Deposit Refunded: ₹2.45         ║
   ║                                           ║
   ║ [Rent Again]                              ║
   ╚═══════════════════════════════════════════╝
   ```

6. **Transaction History shows:**
   - Rental Fee (Jan 23): -₹1.05
   - Security Deposit (Jan 23): -₹2.45
   - Security Deposit Refund (Jan 25): +₹2.45
   - **Net Cost:** ₹1.05

---

## Admin Journey - Dashboard Management

### Journey 10: Admin Login & Dashboard

```
Admin Login
   ↓
Enter Admin Credentials
   ↓
System Validates
   ↓
Check Role = "admin"
   ↓
Redirect to /admin Dashboard
   ↓
Admin Dashboard Loads
   │
   ├── Navigation Bar
   │   ├── Home
   │   ├── Add Book
   │   ├── Requests (Badge: 5)
   │   ├── Notifications (Badge: 3)
   │   ├── Transactions
   │   ├── Profile
   │   └── Logout
   │
   ├── Category Filters
   │   ├── All
   │   ├── Fiction
   │   ├── Non-fiction
   │   └── [More categories...]
   │
   ├── Search Bar
   │   └── "Search books by name or description"
   │
   └── Book Grid
       └── Display all books with management options
```

**Step-by-Step Flow:**

1. **Admin logs in** with admin credentials

2. **System checks role:**
   ```javascript
   if (role === "admin") {
     navigate("/admin");
   }
   ```

3. **Admin dashboard displays:**

   **Top Navigation:**
   ```
   ╔═══════════════════════════════════════════════════╗
   ║ 📚 Book Library Admin                    👤 Admin ║
   ║ ───────────────────────────────────────────────── ║
   ║ Home | Add Book | Requests (5) | Notifications(3) ║
   ║ Transactions | Profile | Logout                   ║
   ╚═══════════════════════════════════════════════════╝
   ```

4. **Category bar:**
   ```
   [All] [Fiction] [Non-fiction] [Science] [History] ...
   ```

5. **Search functionality:**
   ```
   🔍 [Search books by name or description______]
   ```

6. **Book grid with admin controls:**
   ```
   ╔════════════════════════════╗  ╔════════════════════════════╗
   ║ 📚 The Great Gatsby        ║  ║ 📚 Sapiens                 ║
   ║ Fiction                    ║  ║ History                    ║
   ║ Price: ₹500                ║  ║ Price: ₹600                ║
   ║ Available: 5               ║  ║ Available: 3               ║
   ║                            ║  ║                            ║
   ║ [Edit ✏️] [Delete 🗑️]      ║  ║ [Edit ✏️] [Delete 🗑️]      ║
   ╚════════════════════════════╝  ╚════════════════════════════╝
   ```

7. **Real-time updates:**
   - Auto-refresh every 5 seconds
   - Notification badges update automatically
   - Book quantities update when users rent/return

---

## Admin Journey - Book Management

### Journey 11: Add New Book

```
Admin Dashboard
   ↓
Click "Add Book" in Navigation
   ↓
Navigate to /admin/add-book
   ↓
Add Book Form
   ├── Book Name (Required)
   ├── Description (Optional)
   ├── Category (Dropdown + Custom)
   │   ├── Fiction
   │   ├── Non-fiction
   │   ├── Science
   │   ├── History
   │   └── Other (Custom input)
   ├── Price (₹) (Required)
   ├── Quantity (Required)
   └── Image URL (Required)
   ↓
Fill Form
   ↓
Click "Add Book"
   ↓
Validation
   ├── ✅ Valid → Process
   │              ↓
   │         Create book key from name
   │              ↓
   │         Save to Firebase /books
   │              ↓
   │         Show success toast
   │              ↓
   │         Redirect to /admin
   │
   └── ❌ Invalid → Show error
                    ↓
                Stay on form
```

**Step-by-Step Flow:**

1. **Admin clicks "Add Book"**

2. **Form displays:**
   ```
   ╔═══════════════════════════════════════╗
   ║         Add New Book                  ║
   ║ ───────────────────────────────────── ║
   ║                                       ║
   ║ Book Name: *                          ║
   ║ [_________________________________]   ║
   ║                                       ║
   ║ Description:                          ║
   ║ [_________________________________]   ║
   ║ [_________________________________]   ║
   ║                                       ║
   ║ Category: *                           ║
   ║ [▼ Select Category_____________]      ║
   ║                                       ║
   ║ Price (₹): *                          ║
   ║ [_________________________________]   ║
   ║                                       ║
   ║ Quantity: *                           ║
   ║ [_________________________________]   ║
   ║                                       ║
   ║ Image URL: *                          ║
   ║ [_________________________________]   ║
   ║                                       ║
   ║     [Cancel]  [Add Book]              ║
   ╚═══════════════════════════════════════╝
   ```

3. **Admin fills form:**
   - **Name:** "To Kill a Mockingbird"
   - **Description:** "A classic American novel about racial injustice"
   - **Category:** Fiction
   - **Price:** 450
   - **Quantity:** 10
   - **Image URL:** https://example.com/mockingbird.jpg

4. **Admin clicks "Add Book"**

5. **System validation:**
   - Name not empty (after trim)
   - Price is number > 0
   - Quantity is integer > 0
   - Image URL is valid format
   - Category selected or custom entered

6. **Book key generation:**
   ```javascript
   "To Kill a Mockingbird" → "to-kill-a-mockingbird"
   ```

7. **Save to Firebase:**
   ```javascript
   books/to-kill-a-mockingbird: {
     name: "To Kill a Mockingbird",
     description: "A classic American novel...",
     type: "Fiction",
     price: 450,
     quantity: 10,
     imageUrl: "https://...",
     createdAt: "2026-01-23T15:00:00Z"
   }
   ```

8. **Success:**
   - Toast: "Book added successfully!"
   - Redirect to `/admin`
   - Book appears in grid

### Journey 12: Edit Book

```
Admin Dashboard
   ↓
Find Book to Edit
   ↓
Click "Edit ✏️" Icon
   ↓
Edit Modal Opens
   │
   ├── Pre-filled Form with Current Values
   │   ├── Book Name
   │   ├── Description
   │   ├── Category
   │   ├── Price
   │   ├── Quantity
   │   └── Image URL
   │
   └── Action Buttons
       ├── [Cancel]
       └── [Save Changes]
   ↓
Modify Values
   ↓
Click "Save Changes"
   ↓
Update in Firebase
   ↓
Success Toast
   ↓
Modal Closes
   ↓
Book Card Updates with New Info
```

**Example Edit Flow:**

1. **Current Book Data:**
   ```
   Name: The Great Gatsby
   Price: ₹500
   Quantity: 5
   ```

2. **Admin wants to update:**
   - Increase price to ₹550
   - Add 5 more copies

3. **Admin clicks Edit icon**

4. **Modal shows pre-filled form:**
   ```
   ╔═══════════════════════════════════════╗
   ║         Edit Book                     ║
   ║ ───────────────────────────────────── ║
   ║                                       ║
   ║ Book Name:                            ║
   ║ [The Great Gatsby_________________]   ║
   ║                                       ║
   ║ Price (₹):                            ║
   ║ [500______________________________]   ║
   ║                                       ║
   ║ Quantity:                             ║
   ║ [5________________________________]   ║
   ║                                       ║
   ║     [Cancel]  [Save Changes]          ║
   ╚═══════════════════════════════════════╝
   ```

5. **Admin changes:**
   - Price: 500 → 550
   - Quantity: 5 → 10

6. **Clicks "Save Changes"**

7. **System updates:**
   ```javascript
   PATCH /books/the-great-gatsby
   {
     price: 550,
     quantity: 10
   }
   ```

8. **Success:**
   - Toast: "Book updated successfully!"
   - Book card shows new values
   - Changes reflected immediately

### Journey 13: Delete Book

```
Admin Dashboard
   ↓
Find Book to Delete
   ↓
Click "Delete 🗑️" Icon
   ↓
Confirmation Dialog
"Delete [Book Name]? This cannot be undone."
   ↓
Click "Confirm Delete"
   ↓
Remove from Firebase
   ↓
Success Toast
   ↓
Book Removed from Grid
```

**Warning:** Deleting a book with active rentals should be handled carefully (system may prevent deletion or mark as inactive).

---

## Admin Journey - Request Management

### Journey 14: Handle Drop-Off Requests

```
Admin Dashboard
   ↓
Notification Badge Shows: Requests (5)
   ↓
Click "Requests"
   ↓
Requests Page (/admin/requests)
   ↓
View All Requests
   │
   ├── Drop-Off Requests
   │   └── Users wanting to add books to library
   │
   └── Return Requests
       └── Users wanting to return rented books
   ↓
Select Drop-Off Request
   ↓
Request Card Shows:
   ├── User Details (Name, Email, Contact)
   ├── Book Details (Name, Category, Image)
   ├── Message from User
   └── Action Buttons
       ├── [Reject]
       └── [Approve]
   ↓
Admin Decision
   │
   ├── Option A: APPROVE
   │       ↓
   │   Click "Approve"
   │       ↓
   │   Confirmation Dialog
   │       ↓
   │   Click "Confirm"
   │       ↓
   │   System Actions:
   │       ├── Create new book in inventory
   │       ├── Set initial quantity to 1
   │       ├── Update request status: "approved"
   │       ├── Send user notification
   │       └── Remove from pending list
   │       ↓
   │   Success Toast
   │
   └── Option B: REJECT
           ↓
       Click "Reject"
           ↓
       Rejection Modal Opens
           ↓
       Enter Rejection Reason
           ↓
       Click "Submit"
           ↓
       System Actions:
           ├── Update request status: "rejected"
           ├── Save rejection reason
           ├── Send user notification with reason
           └── Remove from pending list
           ↓
       Success Toast
```

**Example Drop-Off Request:**

```
╔════════════════════════════════════════════════╗
║           Drop-Off Request #1                  ║
║ ────────────────────────────────────────────── ║
║                                                ║
║ 👤 User Information:                           ║
║    Name: John Doe                              ║
║    Email: john@example.com                     ║
║    Contact: 1234567890                         ║
║                                                ║
║ 📚 Book Information:                           ║
║    Name: Clean Code                            ║
║    Category: Technology                        ║
║    Suggested Price: ₹800                       ║
║                                                ║
║ 💬 Message:                                    ║
║    "I have this book in excellent condition    ║
║     and would like to add it to the library."  ║
║                                                ║
║ 🖼️  Image: [View Image]                        ║
║                                                ║
║ 📅 Requested on: Jan 23, 2026, 10:30 AM       ║
║                                                ║
║        [Reject with Reason]  [Approve ✓]      ║
╚════════════════════════════════════════════════╝
```

**Approval Process:**

1. **Admin reviews request details**
2. **Checks book image quality**
3. **Verifies book information**
4. **Clicks "Approve"**
5. **Confirmation:**
   ```
   ╔════════════════════════════════════════╗
   ║    Approve Drop-Off Request            ║
   ║                                        ║
   ║ Add "Clean Code" to inventory?         ║
   ║                                        ║
   ║ This will:                             ║
   ║ • Create new book entry                ║
   ║ • Set quantity to 1                    ║
   ║ • Notify the user                      ║
   ║                                        ║
   ║     [Cancel]  [Confirm Approval]       ║
   ╚════════════════════════════════════════╝
   ```
6. **System creates book:**
   ```javascript
   books/clean-code: {
     name: "Clean Code",
     type: "Technology",
     price: 800,
     quantity: 1,
     imageUrl: "...",
     addedBy: "john@example.com",
     createdAt: "2026-01-23T16:00:00Z"
   }
   ```
7. **User receives notification:**
   ```
   ✅ Drop-Off Request Approved!
   
   Great news! Your request to add "Clean Code" has been 
   approved by the admin.
   
   The book is now available in the library for others to rent.
   
   Thank you for contributing to our library!
   ```

**Rejection Process:**

1. **Admin clicks "Reject"**
2. **Rejection modal:**
   ```
   ╔════════════════════════════════════════╗
   ║    Reject Drop-Off Request             ║
   ║                                        ║
   ║ Reason for rejection: *                ║
   ║ [__________________________________]   ║
   ║ [__________________________________]   ║
   ║ [__________________________________]   ║
   ║                                        ║
   ║ This reason will be sent to the user.  ║
   ║                                        ║
   ║     [Cancel]  [Submit Rejection]       ║
   ╚════════════════════════════════════════╝
   ```
3. **Admin enters reason:** "Book condition not suitable for library"
4. **User receives notification:**
   ```
   ❌ Drop-Off Request Rejected
   
   Unfortunately, your request to add "Clean Code" has been 
   rejected.
   
   Reason: Book condition not suitable for library
   
   You can submit a new request with a different book.
   ```

---

## Notification System Flow

### Journey 15: Automated Rental Reminders

```
System Hourly Check (Automated)
   ↓
Fetch All Active Rentals
   ↓
For Each Rental:
   ↓
Calculate Days Until Due
   ↓
Check Status
   │
   ├── Case 1: 1 Day Remaining
   │      AND status ≠ "one_day_reminder"
   │       ↓
   │   Send One-Day Reminder
   │       ├── Create user notification
   │       ├── Update rental status: "one_day_reminder"
   │       └── User sees: "⏰ 1 day to go!"
   │
   ├── Case 2: 0 Days (Due Today)
   │      AND status ≠ "reminder_sent"
   │       ↓
   │   Send Due Date Reminder
   │       ├── Create user notification
   │       ├── Update rental status: "reminder_sent"
   │       └── User sees: "⏰ Return today!"
   │
   ├── Case 3: Past Due Date
   │      AND status ≠ "overdue"
   │       ↓
   │   Mark as Overdue
   │       ├── Create user notification
   │       ├── Update rental status: "overdue"
   │       └── User sees: "⚠️ Book overdue!"
   │
   └── Case 4: Not Due Yet
           ↓
       No action needed
           ↓
       Continue to next rental
```

**Notification Timeline Example:**

**Rental:** Jan 23 - Jan 30 (7 days)

```
Jan 23 (Day 1) - Rental Created
   ↓
   Status: "active"
   No notifications
   
   ⏬
   
Jan 28 (Day 6)
   ↓
   System Check: 1 day remaining
   ↓
   Status: "one_day_reminder"
   ↓
   Notification Sent:
   ┌─────────────────────────────────────┐
   │ ⏰ 1 Day Reminder                   │
   │                                     │
   │ Your rental for "The Great Gatsby"  │
   │ ends tomorrow (Jan 30).             │
   │                                     │
   │ Please return the book on time.     │
   └─────────────────────────────────────┘
   
   ⏬
   
Jan 30 (Day 7) - Due Date
   ↓
   System Check: 0 days (due today)
   ↓
   Status: "reminder_sent"
   ↓
   Notification Sent:
   ┌─────────────────────────────────────┐
   │ ⏰ Rental Due Today                 │
   │                                     │
   │ Your rental for "The Great Gatsby"  │
   │ ends today (Jan 30).                │
   │                                     │
   │ Please return the book today.       │
   └─────────────────────────────────────┘
   
   ⏬
   
Jan 31 (Day 8) - If Not Returned
   ↓
   System Check: -1 days (overdue)
   ↓
   Status: "overdue"
   ↓
   Notification Sent:
   ┌─────────────────────────────────────┐
   │ ⚠️ Book Overdue!                    │
   │                                     │
   │ "The Great Gatsby" is overdue!      │
   │                                     │
   │ Please return immediately to avoid  │
   │ penalties.                          │
   └─────────────────────────────────────┘
```

**User Notification Center:**

```
╔════════════════════════════════════════════════╗
║         Notifications (3)                      ║
║ ────────────────────────────────────────────── ║
║                                                ║
║ 📅 1 Day Reminder                              ║
║ Your rental for "The Great Gatsby" ends        ║
║ tomorrow (Jan 30). Please return on time.      ║
║ 2 hours ago                           [✓ Read] ║
║                                                ║
║ ────────────────────────────────────────────── ║
║                                                ║
║ ✅ Request Approved                            ║
║ Your drop-off request has been approved!       ║
║ Yesterday                              [✓ Read] ║
║                                                ║
║ ────────────────────────────────────────────── ║
║                                                ║
║ ⏰ Rental Reminder                             ║
║ Your rental for "Sapiens" ends today.          ║
║ 3 days ago                             [✓ Read] ║
║                                                ║
╚════════════════════════════════════════════════╝
```

---

## Transaction Flow

### Journey 16: Complete Transaction Lifecycle

```
RENTAL TRANSACTION FLOW
========================

Step 1: User Adds Book to Cart
   ↓
   No transaction yet (cart is temporary)
   
Step 2: User Checks Out
   ↓
   Create Transactions:
   
   Transaction #1: Rental Fee
   ┌────────────────────────────────┐
   │ Type: rental_fee               │
   │ Amount: ₹1.05                  │
   │ Book: The Great Gatsby         │
   │ User: user@example.com         │
   │ Status: completed              │
   │ Date: Jan 23, 2026             │
   └────────────────────────────────┘
   
   Transaction #2: Security Deposit
   ┌────────────────────────────────┐
   │ Type: security_deposit         │
   │ Amount: ₹2.45                  │
   │ Book: The Great Gatsby         │
   │ User: user@example.com         │
   │ Status: held                   │
   │ Date: Jan 23, 2026             │
   └────────────────────────────────┘
   
   Total Paid: ₹3.50
   
Step 3: User Returns Book
   ↓
   Admin Approves Return
   ↓
   Create Transaction:
   
   Transaction #3: Security Deposit Refund
   ┌────────────────────────────────┐
   │ Type: security_deposit_refund  │
   │ Amount: ₹2.45                  │
   │ Book: The Great Gatsby         │
   │ User: user@example.com         │
   │ Status: completed              │
   │ Date: Jan 30, 2026             │
   └────────────────────────────────┘
   
Final Summary:
   Paid: ₹3.50
   Refunded: ₹2.45
   Net Cost: ₹1.05 ✓
```

**Transaction History Display:**

```
╔════════════════════════════════════════════════╗
║         Transaction History                    ║
║ ────────────────────────────────────────────── ║
║                                                ║
║ Jan 30, 2026 - Security Deposit Refund         ║
║ The Great Gatsby                               ║
║ Amount: +₹2.45 🟢                              ║
║                                                ║
║ ────────────────────────────────────────────── ║
║                                                ║
║ Jan 23, 2026 - Security Deposit                ║
║ The Great Gatsby                               ║
║ Amount: -₹2.45 🟡                              ║
║                                                ║
║ ────────────────────────────────────────────── ║
║                                                ║
║ Jan 23, 2026 - Rental Fee                      ║
║ The Great Gatsby                               ║
║ Amount: -₹1.05 🔴                              ║
║                                                ║
║ ────────────────────────────────────────────── ║
║                                                ║
║ Total Spent: ₹3.50                             ║
║ Total Refunded: ₹2.45                          ║
║ Net Amount: ₹1.05                              ║
╚════════════════════════════════════════════════╝
```

---

## Technical Workflow

### System Architecture Flow

```
USER BROWSER
     ↓
     ↓ (HTTP Request)
     ↓
REACT APPLICATION (Frontend)
     │
     ├─→ Redux Store (State Management)
     │      │
     │      ├─→ Auth Slice (User/Admin state)
     │      ├─→ Books Slice (Book inventory)
     │      ├─→ Cart Slice (Shopping cart)
     │      └─→ Request Slice (Requests)
     │
     ├─→ API Layer (Service Functions)
     │      │
     │      ├─→ LoginAPi.jsx
     │      ├─→ BookAPicall.jsx
     │      ├─→ RequestAPi.jsx
     │      ├─→ TransactionAPI.jsx
     │      └─→ RentalNotificationService.jsx
     │
     ↓
     ↓ (REST API Calls)
     ↓
FIREBASE REALTIME DATABASE
     │
     ├─→ /users/{emailKey}
     ├─→ /books/{bookKey}
     ├─→ /rentBook/{rentalId}
     ├─→ /adminNotifications/{notificationId}
     ├─→ /userNotifications/{emailKey}/{notificationId}
     └─→ /transactions/{transactionId}
     
     ↓
     ↓ (Real-time Sync)
     ↓
AUTOMATIC UPDATES
     ↓
REACT COMPONENTS RE-RENDER
     ↓
USER SEES UPDATED DATA
```

### Request-Response Flow Example

**Scenario:** User adds book to cart

```
1. USER ACTION
   │
   └─→ Clicks "Add to Cart" button
       │
       └─→ Component: ViewBookDetails.jsx

2. COMPONENT LOGIC
   │
   ├─→ Validates form inputs
   ├─→ Calculates rental cost
   └─→ Dispatches Redux action
       │
       └─→ dispatch(addToCart({ book, dates, quantity }))

3. REDUX STORE
   │
   ├─→ Receives action in CartSlice
   ├─→ Updates cart state
   │      state.items.push(newItem)
   └─→ Components subscribed to cart re-render

4. UI UPDATE
   │
   ├─→ Cart badge shows: (1)
   ├─→ Success toast appears
   └─→ Modal closes

5. USER SEES
   │
   └─→ "Book added to cart!" notification
       └─→ Cart icon now shows badge with count
```

### Data Flow Diagram

```
┌──────────────────────────────────────────────┐
│          USER INTERACTION                    │
│   (Click, Type, Submit, etc.)                │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         REACT COMPONENT                      │
│   (Handles event, validates input)           │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         REDUX ACTION                         │
│   (Dispatched with payload)                  │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         API FUNCTION                         │
│   (Makes HTTP request to Firebase)           │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         FIREBASE DATABASE                    │
│   (Stores/Retrieves data)                    │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         API RESPONSE                         │
│   (Returns data or confirmation)             │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         REDUX REDUCER                        │
│   (Updates store state)                      │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         COMPONENT RE-RENDER                  │
│   (UI updates with new data)                 │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         USER SEES UPDATE                     │
│   (New data displayed)                       │
└──────────────────────────────────────────────┘
```

---

## Use Case Scenarios

### Scenario 1: First-Time User Renting a Book

**Actor:** Sarah (New User)

**Goal:** Rent "The Great Gatsby" for a week

**Steps:**

1. **Sarah visits the website**
   - Sees login page
   - No account yet

2. **Creates account:**
   - Clicks "Sign Up"
   - Enters: sarah@email.com, password, Sarah Johnson, 9876543210, NYC address
   - Submits form
   - Account created ✓

3. **Auto-logged in:**
   - Redirected to user dashboard
   - Sees grid of available books

4. **Searches for book:**
   - Types "gatsby" in search bar
   - Sees "The Great Gatsby" in results

5. **Views book details:**
   - Clicks "View Details"
   - Sees: Price ₹500, 5 available

6. **Configures rental:**
   - Start Date: Today (Jan 23)
   - End Date: Jan 30 (7 days)
   - Quantity: 1
   - Sees calculation: ₹1.05 rental + ₹2.45 deposit = ₹3.50 total

7. **Adds to cart:**
   - Clicks "Add to Cart"
   - Success message appears
   - Cart badge shows (1)

8. **Proceeds to checkout:**
   - Clicks cart icon
   - Reviews item
   - Clicks "Checkout"

9. **Confirms rental:**
   - Sees confirmation dialog
   - Clicks "Confirm Rental"
   - Processing...

10. **Rental complete:**
    - Success toast: "Checkout successful!"
    - Redirected to "My Rentals"
    - Sees active rental with countdown

11. **Receives notification:**
    - System will send reminder on Jan 29 (1 day before)

**Result:** Sarah successfully rented the book for 7 days, paying ₹3.50 total (₹1.05 actual cost after deposit refund).

### Scenario 2: User Returning Book Early

**Actor:** John (Existing User)

**Goal:** Return "Sapiens" before due date

**Context:**
- Rented "Sapiens" on Jan 20 for 10 days (due Jan 30)
- Finished reading on Jan 25
- Wants to return early

**Steps:**

1. **John logs in:**
   - Enters credentials
   - Redirected to dashboard

2. **Navigates to My Rentals:**
   - Clicks "My Rentals" in navigation
   - Sees active rental for "Sapiens"
   - Status: Active (5 days remaining)

3. **Requests return:**
   - Clicks "Request Return" button
   - Confirmation dialog appears
   - Shows: Security deposit ₹4.20 will be refunded

4. **Confirms request:**
   - Clicks "Confirm Request"
   - Request submitted
   - Status changes to "Return Pending"

5. **Waits for admin:**
   - Receives notification: "Return request submitted"
   - Can track status in My Rentals

6. **Admin reviews (30 minutes later):**
   - Admin sees return request
   - Checks rental details
   - Decides to approve

7. **Admin approves:**
   - Clicks "Approve Return"
   - System processes:
     - Marks rental as returned
     - Refunds ₹4.20 security deposit
     - Updates book quantity
     - Notifies John

8. **John receives approval:**
   - Notification: "Return approved! Deposit refunded."
   - My Rentals shows: Status "Returned"
   - Transaction history shows refund

9. **John checks transactions:**
   - Sees:
     - Rental Fee (Jan 20): -₹1.80
     - Security Deposit (Jan 20): -₹4.20
     - Deposit Refund (Jan 25): +₹4.20
     - Net cost: ₹1.80

**Result:** John returned the book early, got full deposit refund, and only paid ₹1.80 for the rental.

### Scenario 3: Admin Handling Multiple Requests

**Actor:** Admin Lisa

**Goal:** Process pending requests efficiently

**Context:**
- 5 drop-off requests
- 3 return requests
- Busy afternoon

**Steps:**

1. **Lisa logs in as admin:**
   - Sees dashboard
   - Notification badge: Requests (5), Notifications (3)

2. **Opens Requests page:**
   - Sees 8 total requests
   - Grouped by type

3. **Handles Drop-Off Request #1:**
   - User wants to add "Clean Code"
   - Reviews book details
   - Checks image quality: Good ✓
   - Approves request
   - Book added to inventory
   - User notified

4. **Handles Drop-Off Request #2:**
   - User wants to add "Harry Potter"
   - Reviews details
   - Image quality: Poor ✗
   - Rejects with reason: "Please provide clearer image"
   - User notified with rejection reason

5. **Handles Return Request #1:**
   - User returning "1984"
   - Rental was overdue by 2 days
   - Decides to approve anyway (first offense)
   - Approves return
   - Security deposit refunded
   - Book quantity updated

6. **Handles Return Request #2:**
   - User returning "Sapiens"
   - On time return
   - Approves immediately
   - Processed successfully

7. **Reviews Admin Notifications:**
   - Sees recent activities
   - Marks all as read
   - Badge count updates to (0)

8. **Checks Transaction Monitor:**
   - Views today's transactions
   - Total rental fees: ₹50
   - Security deposits refunded: ₹30
   - All looks good

**Result:** Lisa efficiently processed 8 requests in 30 minutes, maintaining library operations smoothly.

### Scenario 4: Overdue Book Scenario

**Actor:** Mike (User with overdue book)

**Context:**
- Rented "1984" on Jan 10 for 10 days (due Jan 20)
- Today is Jan 25 (5 days overdue)

**Automated System Actions:**

**Jan 19 (1 day before due):**
- System check runs
- Sends notification: "⏰ 1 day to go!"
- Status: "one_day_reminder"

**Jan 20 (due date):**
- System check runs
- Sends notification: "⏰ Return today!"
- Status: "reminder_sent"

**Jan 21 (1 day overdue):**
- System check runs
- Sends notification: "⚠️ Book overdue!"
- Status: "overdue"

**Mike's Experience:**

1. **Mike logs in on Jan 25:**
   - Sees overdue notification badge (3)

2. **Checks notifications:**
   - Sees all three reminders
   - Realizes book is overdue

3. **Goes to My Rentals:**
   - Sees "1984" with red badge: "OVERDUE - 5 days"
   - Understands urgency

4. **Requests return:**
   - Clicks "Request Return NOW"
   - Confirms request
   - Adds note: "Sorry for delay, returning today"

5. **Admin reviews:**
   - Sees overdue return request
   - Notes this is Mike's first offense
   - Decides to approve but adds warning

6. **Admin approves:**
   - Refunds security deposit
   - Sends notification with warning
   - "Request approved, but please return on time in future"

7. **Mike receives approval:**
   - Grateful for understanding
   - Makes note to set reminders for future rentals

**Result:** Despite being late, Mike was able to return the book and learned to be more punctual.

---

## Summary

### Key Takeaways

1. **User Journey is Intuitive:**
   - Simple signup → Browse → Rent → Return flow
   - Clear notifications guide users
   - Transparent pricing with automatic calculations

2. **Admin Has Full Control:**
   - Centralized request management
   - Quick book inventory updates
   - Complete transaction visibility

3. **Automation Reduces Manual Work:**
   - Automated reminders save time
   - Real-time updates keep data fresh
   - Security deposit handling is automatic

4. **Security is Built-in:**
   - Role-based access control
   - JWT authentication
   - Input validation at every step

5. **System is Scalable:**
   - Firebase handles growing data
   - Redux manages complex state
   - Modular architecture allows easy updates

---

## Converting This Document to PDF

### Method 1: Using Pandoc (Recommended)

```bash
# Install Pandoc
brew install pandoc   # macOS
# or visit: https://pandoc.org/installing.html

# Convert to PDF
pandoc USER_JOURNEY_AND_FEATURES.md -o UserJourney.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V fontsize=11pt
```

### Method 2: Using VS Code Extension

1. Install "Markdown PDF" extension
2. Open this file in VS Code
3. Right-click → "Markdown PDF: Export (pdf)"

### Method 3: Using Online Tools

- **Dillinger.io** - Import MD, export PDF
- **Markdown to PDF** - Direct conversion
- **CloudConvert** - MD to PDF converter

### Method 4: Using Word/Google Docs

1. Copy this markdown content
2. Paste into Word/Google Docs
3. File → Save As PDF

---

**Document End**

*This document provides a complete overview of the Book Library Rental Management System. For technical details, see DOCUMENTATION.md. For rental system specifics, see RENTAL_SYSTEM_GUIDE.md.*
