const FIREBASE_URL = "https://book-app-339c8-default-rtdb.firebaseio.com";

// Save transaction to Firebase
export const saveTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${FIREBASE_URL}/transactions.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...transactionData,
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
      })
    });

    if (!response.ok) throw new Error("Failed to save transaction");
    const data = await response.json();
    return { success: true, id: data.name };
  } catch (error) {
    console.error("Error saving transaction:", error);
    return { success: false, error: error.message };
  }
};

// Get all transactions for a user
export const getUserTransactions = async (userEmail) => {
  try {
    const response = await fetch(`${FIREBASE_URL}/transactions.json`);
    const data = await response.json();

    if (!data) return [];

    const transactions = Object.entries(data)
      .filter(([_, transaction]) => transaction.userEmail === userEmail)
      .map(([id, transaction]) => ({ id, ...transaction }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return transactions;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
};

// Get all transactions (for admin)
export const getAllTransactions = async () => {
  try {
    const response = await fetch(`${FIREBASE_URL}/transactions.json`);
    const data = await response.json();

    if (!data) return [];

    const transactions = Object.entries(data)
      .map(([id, transaction]) => ({ id, ...transaction }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return transactions;
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    return [];
  }
};

// Transaction types:
// - purchase: Book purchase
// - rent: Book rental (rental fee)
// - security_deposit: Security deposit for rental
// - security_refund: Security deposit refund
// - cart_purchase: Purchase from cart
// - cart_rent: Rent from cart

export const createPurchaseTransaction = (purchaseData) => {
  return {
    type: "purchase",
    bookName: purchaseData.bookName,
    bookImage: purchaseData.bookImage,
    quantity: purchaseData.quantity,
    amount: purchaseData.totalPrice,
    userEmail: purchaseData.userEmail,
    description: `Purchased ${purchaseData.quantity}x ${purchaseData.bookName}`
  };
};

export const createRentTransaction = (rentalData) => {
  return {
    type: "rent",
    bookName: rentalData.bookName,
    bookImage: rentalData.bookImage,
    quantity: rentalData.quantity,
    amount: rentalData.rentalFee,
    userEmail: rentalData.userEmail,
    startDate: rentalData.startDate,
    endDate: rentalData.endDate,
    rentalDays: rentalData.rentalDays,
    description: `Rental fee for ${rentalData.bookName} (${rentalData.rentalDays} days)`
  };
};

export const createSecurityDepositTransaction = (rentalData) => {
  return {
    type: "security_deposit",
    bookName: rentalData.bookName,
    bookImage: rentalData.bookImage,
    quantity: rentalData.quantity,
    amount: rentalData.securityDeposit,
    userEmail: rentalData.userEmail,
    startDate: rentalData.startDate,
    endDate: rentalData.endDate,
    description: `Security deposit for ${rentalData.bookName} (Refundable)`
  };
};

export const createSecurityRefundTransaction = (rentalData) => {
  return {
    type: "security_refund",
    bookName: rentalData.bookName,
    bookImage: rentalData.bookImage,
    amount: rentalData.securityDeposit,
    userEmail: rentalData.userEmail,
    description: `Security deposit refund for ${rentalData.bookName}`
  };
};

export const createCartPurchaseTransaction = (cartItem, userEmail) => {
  return {
    type: "cart_purchase",
    bookName: cartItem.book.name,
    bookImage: cartItem.book.imageUrl,
    quantity: cartItem.quantity,
    amount: cartItem.totalPrice, // Use calculated totalPrice from cart
    userEmail: userEmail,
    description: `Cart purchase: ${cartItem.quantity}x ${cartItem.book.name}`
  };
};

export const createCartRentTransaction = (cartItem, userEmail) => {
  return {
    type: "cart_rent",
    bookName: cartItem.book.name,
    bookImage: cartItem.book.imageUrl,
    quantity: cartItem.quantity,
    amount: cartItem.rentalFee,
    userEmail: userEmail,
    startDate: cartItem.startDate,
    endDate: cartItem.endDate,
    description: `Cart rental fee: ${cartItem.book.name}`
  };
};

export const createCartSecurityDepositTransaction = (cartItem, userEmail) => {
  return {
    type: "security_deposit",
    bookName: cartItem.book.name,
    bookImage: cartItem.book.imageUrl,
    quantity: cartItem.quantity,
    amount: cartItem.securityDeposit,
    userEmail: userEmail,
    startDate: cartItem.startDate,
    endDate: cartItem.endDate,
    description: `Security deposit: ${cartItem.book.name} (Refundable)`
  };
};

export const createDropBookTransaction = (dropData) => {
  return {
    type: "book_drop",
    bookName: dropData.bookName,
    bookImage: dropData.bookImage,
    quantity: dropData.quantity,
    mrpPrice: dropData.mrpPrice,
    amount: dropData.price, // 70% of MRP
    userEmail: dropData.userEmail,
    description: `Payment received for dropping ${dropData.quantity}x ${dropData.bookName}`
  };
};
