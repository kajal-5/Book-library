# Rental Management System - Complete Guide

## Overview
This system provides a complete rental workflow for books with automated notifications, security deposits, and admin approval for returns.

## Key Features

### 1. **Rental Calculation (30% + 70%)**
- **Rental Fee**: 30% of the total cost (what user pays to rent)
- **Security Deposit**: 70% of the total cost (fixed, refundable on return)
- **Formula**: 
  - Daily Rate = Base Price × 0.001
  - Total Cost = Daily Rate × Number of Days
  - Rental Fee = Total Cost × 0.3
  - Security Deposit = Total Cost × 0.7

### 2. **Automated Notifications**
The system automatically checks rental periods every hour and sends:

#### 1 Day Before Rental Ends:
- **Type**: `one_day_reminder`
- **Message**: "⏰ 1 day to go! Your rental for '[Book Name]' ends tomorrow ([End Date]). Please return the book on time."
- **Badge**: Blue with 📅 icon
- **Status**: Changes to `one_day_reminder`

#### On Rental End Date:
- **Type**: `rental_reminder`
- **Message**: "⏰ Reminder: Your rental for '[Book Name]' ends tomorrow. Please prepare to return the book."
- **Badge**: Orange with ⏰ icon
- **Status**: Changes to `reminder_sent`

#### After Rental Period Expires:
- **Type**: `rental_expired`
- **Message**: "🔴 Your rental period for '[Book Name]' has ended. Please return the book as soon as possible to get your security deposit of ₹[amount] back."
- **Badge**: Red with 🔴 icon
- **Status**: Changes to `expired`

### 3. **Return Workflow**

#### Step 1: User Requests Return
- User goes to **"My Rentals"** page
- Clicks **"Request Return"** button
- System creates admin notification
- Rental status changes to `return_requested`

#### Step 2: Admin Receives Notification
- Admin sees notification in **"Return Requests"** page
- Notification shows:
  - Book details (name, image)
  - User email
  - Rental dates
  - Quantity
  - Rental fee paid
  - Security deposit amount to refund

#### Step 3: Admin Decision

**If Admin Accepts:**
- Clicks **"Accept & Refund ₹[amount]"** button
- System sends notification to user:
  - **Type**: `security_refund`
  - **Message**: "✅ Your return for '[Book Name]' has been accepted! Security deposit of ₹[amount] will be refunded."
  - **Badge**: Green with ✅ icon
- Rental status changes to `returned`
- Admin notification is deleted

**If Admin Rejects:**
- Clicks **"Reject Return"** button
- Modal opens asking for rejection reason
- Admin enters reason (e.g., "Book is damaged")
- System sends notification to user:
  - **Type**: `return_rejected`
  - **Message**: "❌ Your return request for '[Book Name]' was rejected. Reason: [reason]"
  - **Badge**: Red with ❌ icon
- Rental status changes to `return_rejected`
- Admin notification is deleted

## User Interface Components

### For Users:

#### 1. **My Rentals Page** (`/user/rentals`)
- Shows all user's rentals with status badges:
  - 🔴 **Overdue**: Past end date, not returned
  - ⚠️ **Ending Soon**: 1 day or less remaining
  - 📚 **Active**: Currently rented, more than 1 day remaining
  - ⏳ **Return Pending**: User requested return, awaiting admin
  - ❌ **Return Rejected**: Admin rejected the return
  - ✅ **Returned**: Successfully returned, security refunded

- Each rental card shows:
  - Book image
  - Book name
  - Start and end dates
  - Quantity
  - Financial breakdown (Rental Fee, Security Deposit, Total)
  - Action button based on status

#### 2. **User Notifications Page** (`/user/notifications`)
- Enhanced to display rental-specific notifications
- Different colors and icons for different notification types:
  - ⏰ Orange: Rental reminder
  - 🔴 Red: Rental expired
  - ✅ Green: Security refund
  - ❌ Red: Return rejected
  - ✓ Green: Request accepted
  - ✗ Red: Request cancelled

#### 3. **Navigation**
- Added **"Rentals"** button in Nav bar
- Clicking navigates to My Rentals page

### For Admins:

#### 1. **All Requests Page** (`/admin/requests`)
- Combines drop book requests AND return requests in one page
- **Filter by Type**:
  - All Types
  - 📚 Drop Book (user wants to donate a book)
  - 📦 Return Request (user wants to return rented book)
- **Filter by Status**:
  - All Status
  - ⏳ Pending
  - ✅ Accepted
  - ❌ Rejected
- Each request shows appropriate details based on type
- Return requests show:
  - Book image and name
  - User email
  - Rental dates and quantity
  - Financial breakdown (30% rental fee + 70% security deposit)
  - Accept & Refund or Cancel buttons

#### 2. **Return Requests Cards**
- Shows book image for visual identification
- Displays user information and rental period
- Shows financial breakdown with 30% and 70% split
- Action buttons: Accept (refunds security) or Cancel (with reason)

#### 3. **Reject/Cancel Modal**
- Opens when admin clicks "Cancel Return"
- Requires admin to provide a reason
- Sends reason to user in notification
- Deletes admin notification after processing

#### 3. **Navigation**
- Added **"Returns"** button in Admin Nav bar
- Clicking navigates to Return Requests page

## Technical Implementation

### Files Created/Modified:

1. **RentalNotificationService.jsx** (NEW)
   - `checkRentalPeriods()`: Checks all rentals every hour
   - `sendRentalReminder()`: 24-hour reminder
   - `sendRentalExpiredNotification()`: Overdue notification
   - `requestBookReturn()`: User initiates return
   - `acceptBookReturn()`: Admin accepts, refunds security
   - `rejectBookReturn()`: Admin rejects with reason

2. **MyRentals.jsx** (NEW)
   - User's rental dashboard
   - Status badges and financial breakdown
   - Request return functionality

3. **ReturnRequests.jsx** (NEW)
   - Admin interface for return requests
   - Accept/Reject with reason modal
   - Auto-refresh every 10 seconds

4. **UserNotifications.jsx** (UPDATED)
   - Enhanced to show rental notifications
   - Different styling for different notification types

5. **Nav.jsx** (UPDATED - Both User & Admin)
   - Added navigation links to new pages

6. **AppRouter.jsx** (UPDATED)
   - Added routes for `/user/rentals` and `/admin/return-requests`

7. **Home.jsx** (UPDATED)
   - Integrated automatic rental checking
   - Runs every hour in background

## Firebase Database Structure

### `/rentBook` (Rental Records)
```json
{
  "rentalId": {
    "bookId": "...",
    "bookName": "...",
    "bookImage": "...",
    "userEmail": "user@example.com",
    "startDate": "2024-01-18",
    "endDate": "2024-01-19",
    "quantity": 1,
    "rentalDays": 1,
    "rentalFee": 200,
    "securityDeposit": 300,
    "totalAmount": 500,
    "returnStatus": "not_returned", // or "return_requested", "returned", "return_rejected"
    "status": "active", // or "reminder_sent", "expired", "completed"
    "createdAt": "2024-01-18T10:00:00.000Z"
  }
}
```

### `/notifications` (User Notifications)
```json
{
  "notificationId": {
    "userEmail": "user@example.com",
    "type": "rental_reminder", // or "rental_expired", "security_refund", "return_rejected"
    "message": "⏰ Reminder: Your rental for 'Book Name' ends tomorrow...",
    "bookName": "Book Name",
    "imageUrl": "...",
    "read": false,
    "createdAt": "2024-01-18T10:00:00.000Z"
  }
}
```

### `/adminNotifications` (Admin Notifications)
```json
{
  "notificationId": {
    "type": "return_request",
    "message": "📦 User has requested to return 'Book Name'",
    "rentalId": "...",
    "bookName": "Book Name",
    "bookImage": "...",
    "userEmail": "user@example.com",
    "startDate": "2024-01-18",
    "endDate": "2024-01-19",
    "quantity": 1,
    "rentalFee": 200,
    "securityDeposit": 300,
    "createdAt": "2024-01-18T10:00:00.000Z"
  }
}
```

## Rental Statuses

### Return Status (`returnStatus`)
- `not_returned`: User hasn't requested return yet
- `return_requested`: User requested return, pending admin approval
- `returned`: Admin accepted return, security refunded
- `return_rejected`: Admin rejected return request

### Rental Status (`status`)
- `active`: Currently active rental
- `reminder_sent`: 24-hour reminder sent
- `expired`: Rental period ended
- `completed`: Rental completed (returned and security refunded)

## User Flow Example

1. **User rents a book** (Jan 18 - Jan 19)
   - Pays: ₹200 (rental fee) + ₹300 (security) = ₹500

2. **Jan 18, End of Day** (24 hours before)
   - User receives: "⏰ Your rental ends tomorrow"

3. **Jan 19 or Later** (rental expired)
   - User receives: "🔴 Rental period over. Return book to get ₹300 back"

4. **User clicks "Request Return"**
   - Status changes to "Return Pending"
   - Admin receives notification

5. **Admin reviews return**
   - If book is in good condition: **Accepts** → User gets "✅ Security deposit ₹300 refunded"
   - If book is damaged: **Rejects** → User gets "❌ Return rejected. Reason: Book damaged"

## Benefits

1. **Transparency**: Users see exact breakdown of fees vs security deposit
2. **Automation**: No manual notification sending required
3. **Flexibility**: Admin can accept or reject with reasons
4. **User-Friendly**: Clear status badges and visual feedback
5. **Real-Time**: Auto-refresh keeps admins updated
6. **Professional**: Complete workflow like real rental services

## Testing the System

1. Rent a book with dates close together (e.g., today to tomorrow)
2. Wait for automated notifications (or manually trigger by adjusting dates)
3. Go to "My Rentals" and request return
4. As admin, go to "Returns" and see the request
5. Accept or reject and verify user receives notification

---

**Note**: The notification checker runs every hour. For testing purposes, you can manually adjust dates in Firebase or modify the interval in Home.jsx to run more frequently.
