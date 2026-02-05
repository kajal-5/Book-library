# Amount Calculation Flow & Redux Storage

## Overview
The amount for admin transactions is **pre-calculated** at the point of transaction creation (purchase/rent/drop) and stored directly in the transaction object. It is NOT calculated from Redux.

---

## 1. WHERE AMOUNTS ARE CALCULATED

### A. **PURCHASE TRANSACTIONS** (Book Price × Quantity)
**Location:** [src/UserPages/Cards/UserBookCards.jsx](src/UserPages/Cards/UserBookCards.jsx)

```javascript
// BUY NOW (Direct Purchase)
const purchaseData = {
  bookName: book.name,
  quantity: quantity,
  totalPrice: book.price * quantity,  // ← AMOUNT CALCULATED HERE
  // ... other data
};

// CART PURCHASE
// Amount is stored in CartSlice as totalPrice
const cartItem = {
  quantity: quantity,
  totalPrice: book.price * quantity,  // ← Amount pre-calculated
};
```

---

### B. **RENTAL TRANSACTIONS** (Complex Calculation)
**Location:** [src/UserPages/Cards/ViewBookDetails.jsx](src/UserPages/Cards/ViewBookDetails.jsx)

```javascript
const rentalDays = calculateRentalDays();
const basePrice = book.price * quantity;  // ← Multiply price by quantity

// Rental Fee (30% or 40% based on days)
const rentalFee = rentalDays <= 180 
  ? basePrice * 0.3 
  : basePrice * 0.4 * Math.ceil(rentalDays / 365);

// Security Deposit (50% of base price)
const securityDeposit = basePrice * 0.5;

// Total Amount = Rental Fee + Security Deposit
const totalAmount = rentalFee + securityDeposit;
```

**Calculation Formula:**
- Base Price = `book.price × quantity`
- Rental Fee = `basePrice × 0.3` (≤180 days) or `basePrice × 0.4 × years` (>180 days)
- Security Deposit = `basePrice × 0.5`

---

### C. **DROP BOOK TRANSACTIONS** (70% of MRP)
**Location:** [src/UserPages/DropBook.jsx](src/UserPages/DropBook.jsx)

```javascript
// User drops a book and receives 70% of MRP
const calculatedPayment = (form.mrpPrice * quantity * 0.7) / 100;
// amount = calculatedPayment
```

---

## 2. HOW REDUX STORES THE CALCULATED AMOUNT

### **Cart Slice** ([src/Store/CartSlice.jsx](src/Store/CartSlice.jsx))

```javascript
// When adding to cart
const cartItem = {
  id: id || `${book.id}_${type}_${Date.now()}`,
  book: { /* book info */ },
  quantity: quantity,
  itemType: type,  // 'purchase' or 'rent'
  totalPrice: totalAmount || (book.price * quantity),  // ← STORED IN REDUX
  userEmail: userEmail,
  
  // Only for rental items:
  startDate: startDate,
  endDate: endDate,
  rentalFee: rentalFee,
  securityDeposit: securityDeposit,
};

// Redux state
state.cart = {
  items: [cartItem, ...],
  totalCount: sum of all quantities,
  totalAmount: sum of all item.totalPrice,  // ← TOTAL AMOUNT IN REDUX
}
```

---

## 3. TRANSACTION CREATION (From Calculated Amount)

When checkout happens, the pre-calculated amounts are used to create transactions:

### **Transaction API** ([src/APIs/TransactionAPI.jsx](src/APIs/TransactionAPI.jsx))

```javascript
// PURCHASE TRANSACTION
export const createPurchaseTransaction = (purchaseData) => {
  return {
    type: "purchase",
    bookName: purchaseData.bookName,
    quantity: purchaseData.quantity,
    amount: purchaseData.totalPrice,  // ← Uses pre-calculated totalPrice
    userEmail: purchaseData.userEmail,
  };
};

// RENTAL TRANSACTION  
export const createRentTransaction = (rentalData) => {
  return {
    type: "rent",
    bookName: rentalData.bookName,
    quantity: rentalData.quantity,
    amount: rentalData.rentalFee,  // ← Only rental fee (not deposit)
    userEmail: rentalData.userEmail,
    rentalDays: rentalData.rentalDays,
  };
};

// SECURITY DEPOSIT TRANSACTION
export const createSecurityDepositTransaction = (rentalData) => {
  return {
    type: "security_deposit",
    bookName: rentalData.bookName,
    quantity: rentalData.quantity,
    amount: rentalData.securityDeposit,  // ← Separate transaction
    userEmail: rentalData.userEmail,
  };
};

// CART PURCHASE
export const createCartPurchaseTransaction = (cartItem, userEmail) => {
  return {
    type: "cart_purchase",
    bookName: cartItem.book.name,
    quantity: cartItem.quantity,
    amount: cartItem.totalPrice,  // ← From cart (price × quantity)
    userEmail: userEmail,
  };
};

// CART RENTAL
export const createCartRentTransaction = (cartItem, userEmail) => {
  return {
    type: "cart_rent",
    bookName: cartItem.book.name,
    quantity: cartItem.quantity,
    amount: cartItem.rentalFee,  // ← Rental fee only
    userEmail: userEmail,
  };
};

// DROP BOOK
export const createDropBookTransaction = (dropData) => {
  return {
    type: "book_drop",
    bookName: dropData.bookName,
    quantity: dropData.quantity,
    amount: dropData.price,  // ← 70% of MRP
    userEmail: dropData.userEmail,
  };
};
```

---

## 4. SAVING TRANSACTION TO FIREBASE

```javascript
// TransactionAPI.jsx
export const saveTransaction = async (transactionData) => {
  const response = await fetch(`${FIREBASE_URL}/transactions.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...transactionData,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    })
  });
};
```

**Stored in Firebase at:** `/transactions/{transactionId}`

---

## 5. ADMIN FETCHES & DISPLAYS TRANSACTIONS

### **Fetch All Transactions** ([src/APIs/TransactionAPI.jsx](src/APIs/TransactionAPI.jsx))

```javascript
export const getAllTransactions = async () => {
  const response = await fetch(`${FIREBASE_URL}/transactions.json`);
  const data = await response.json();
  
  return Object.entries(data)
    .map(([id, transaction]) => ({ id, ...transaction }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
```

### **Display in Admin Panel** ([src/AdminPages/AdminTransactions.jsx](src/AdminPages/AdminTransactions.jsx))

```javascript
// Line 305-309
<p className="text-lg font-bold">
  {transaction.type === "security_refund" ? "-" : "+"}
  ₹{parseFloat(transaction.amount).toFixed(2)}
</p>
{transaction.quantity && (
  <p className="text-xs md:text-md text-gray-700">Qty: {transaction.quantity}</p>
)}
```

---

## 6. COMPLETE FLOW DIAGRAM

```
USER ACTION (Buy/Rent/Drop)
         ↓
   CALCULATE AMOUNT
   (price × qty, rental fee calc, etc.)
         ↓
   STORE IN REDUX CART
   (cartItem.totalPrice, rentalFee, securityDeposit)
         ↓
   CHECKOUT
         ↓
   CREATE TRANSACTION OBJECT
   (using pre-calculated amount from cart/purchase data)
         ↓
   SAVE TO FIREBASE
   (saveTransaction API call)
         ↓
   ADMIN FETCHES
   (getAllTransactions)
         ↓
   ADMIN DISPLAYS
   (AdminTransactions component shows transaction.amount)
```

---

## 7. KEY POINTS

| Aspect | Details |
|--------|---------|
| **Where Calculated?** | At point of user action (BuyNow, AddToCart, DropBook) |
| **Redux Role** | Stores the pre-calculated amount in cart items |
| **What Gets Saved?** | The already-calculated `amount` value (not quantity × price recalculation) |
| **Admin Display** | Shows the pre-calculated `amount` directly from transaction |
| **Quantity Storage** | Stored as separate `quantity` field for reference |
| **Amount × Quantity** | Done BEFORE saving, not during admin display |

---

## 8. EXAMPLE TRANSACTION OBJECT IN FIREBASE

```json
{
  "-NaBcDefGhijk12345": {
    "type": "cart_purchase",
    "bookName": "The Great Gatsby",
    "bookImage": "image_url",
    "quantity": 2,
    "amount": 1000,  // ← This is book.price (500) × quantity (2) = 1000
    "userEmail": "user@email.com",
    "description": "Cart purchase: 2x The Great Gatsby",
    "createdAt": "2026-02-05T10:30:00.000Z",
    "timestamp": 1707121800000
  }
}
```

---

## 9. WHY THIS APPROACH?

✅ **Accurate Records** - Amount is locked in at transaction time
✅ **History Preservation** - Can't accidentally change calculation logic
✅ **Performance** - No need to recalculate on admin view
✅ **Simplicity** - Admin just displays pre-calculated amount
