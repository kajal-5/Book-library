// API for handling book drop requests
const DB_BASE_URL = "https://book-app-339c8-default-rtdb.firebaseio.com";

export const createDropRequestApi = async (requestData) => {
  // requestData: { userEmail, date, name, mrpPrice, price (70% of MRP), quantity, imageUrl }
  const dataWithStatus = { ...requestData, status: "pending" };
  const response = await fetch(`${DB_BASE_URL}/requests.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataWithStatus),
  });
  if (!response.ok) throw new Error("Failed to create request");
  const data = await response.json();
  return { id: data.name, ...dataWithStatus };
};

export const getAllDropRequestsApi = async () => {
  const response = await fetch(`${DB_BASE_URL}/requests.json`);
  if (!response.ok) throw new Error("Failed to fetch requests");
  const data = await response.json();
  if (!data) return [];
  return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
};

export const acceptDropRequestApi = async (requestId, bookData, userEmail) => {
  // Add book to /books
  const bookNameToKey = (name) => name.trim().toLowerCase().replace(/\s+/g, "-");
  const bookKey = bookNameToKey(bookData.name);
  
  // Check if book already exists
  const existingBookResponse = await fetch(`${DB_BASE_URL}/books/${bookKey}.json`);
  const existingBook = await existingBookResponse.json();
  
  const saveBook = {
    name: bookData.name,
    description: bookData.description || "",
    price: bookData.price,
    quantity: existingBook ? existingBook.quantity + bookData.quantity : bookData.quantity, // Add to existing or set new
    imageUrl: bookData.imageUrl,
    createdAt: existingBook ? existingBook.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const bookResponse = await fetch(`${DB_BASE_URL}/books/${bookKey}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(saveBook),
  });
  if (!bookResponse.ok) throw new Error("Failed to add book");
  
  // Update request status to accepted
  const updateResponse = await fetch(`${DB_BASE_URL}/requests/${requestId}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "accepted" }),
  });
  if (!updateResponse.ok) throw new Error("Failed to update request status");
  
  // Create notification for user
  const notification = {
    userEmail,
    type: "accepted",
    message: `Your book "${bookData.name}" has been accepted!`,
    bookName: bookData.name,
    imageUrl: bookData.imageUrl,
    read: false,
    createdAt: new Date().toISOString(),
  };
  
  await fetch(`${DB_BASE_URL}/notifications.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notification),
  });
  if (!updateResponse.ok) throw new Error("Failed to update request status");
  
  // Create transaction for user (amount they receive - 70% of MRP)
  const transaction = {
    type: "book_drop",
    bookName: bookData.name,
    bookImage: bookData.imageUrl,
    quantity: bookData.quantity,
    mrpPrice: bookData.mrpPrice,
    amount: bookData.price * bookData.quantity, // 70% of MRP per unit × quantity
    userEmail: userEmail,
    description: `Payment received for dropping ${bookData.quantity}x ${bookData.name}`,
    createdAt: new Date().toISOString(),
    timestamp: Date.now()
  };
  
  await fetch(`${DB_BASE_URL}/transactions.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });
  
  return { requestId, status: "accepted" };
};

export const rejectDropRequestApi = async (requestId, userEmail, bookName, imageUrl) => {
  const response = await fetch(`${DB_BASE_URL}/requests/${requestId}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "rejected" }),
  });
  if (!response.ok) throw new Error("Failed to update request status");
  
  // Create notification for user
  const notification = {
    userEmail,
    type: "rejected",
    message: `Your book "${bookName}" request has been cancelled.`,
    bookName,
    imageUrl,
    read: false,
    createdAt: new Date().toISOString(),
  };
  
  await fetch(`${DB_BASE_URL}/notifications.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notification),
  });
  
  return { requestId, status: "rejected" };
};

export const getUserNotificationsApi = async (userEmail) => {
  const response = await fetch(`${DB_BASE_URL}/notifications.json`);
  if (!response.ok) throw new Error("Failed to fetch notifications");
  const data = await response.json();
  if (!data) return [];
  
  return Object.keys(data)
    .map((key) => ({ id: key, ...data[key] }))
    .filter((notif) => notif.userEmail === userEmail)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const markNotificationAsReadApi = async (notificationId) => {
  const response = await fetch(`${DB_BASE_URL}/notifications/${notificationId}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ read: true }),
  });
  if (!response.ok) throw new Error("Failed to mark notification as read");
};

export const markAllNotificationsAsReadApi = async (userEmail) => {
  const notifications = await getUserNotificationsApi(userEmail);
  const unreadNotifications = notifications.filter(n => !n.read);
  
  await Promise.all(
    unreadNotifications.map(notif => markNotificationAsReadApi(notif.id))
  );
};
