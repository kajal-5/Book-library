const DB_BASE_URL = "https://book-app-339c8-default-rtdb.firebaseio.com";
import { saveTransaction, createSecurityRefundTransaction } from "./TransactionAPI";

// Lock to prevent concurrent execution of checkRentalPeriods
let isCheckingRentals = false;

// Check rental periods and create notifications
// This function is called periodically (every hour) from Home.jsx
// Uses rental status to prevent duplicate notifications:
// - "not_returned" (active) → "return_window_open" (can return within 5 days) 
// - "return_window_open" → "expired_no_refund" (5 days passed)
export const checkRentalPeriods = async () => {
  // Prevent concurrent execution (especially in React StrictMode)
  if (isCheckingRentals) {
    console.log("Already checking rentals, skipping...");
    return;
  }
  
  isCheckingRentals = true;
  
  try {
    // Fetch all active rentals and notifications ONCE at the start
    const [rentalsResponse, notificationsResponse] = await Promise.all([
      fetch(`${DB_BASE_URL}/rentBook.json`),
      fetch(`${DB_BASE_URL}/notifications.json`)
    ]);
    
    const rentals = await rentalsResponse.json();
    const existingNotifications = await notificationsResponse.json();

    if (!rentals) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const [rentalId, rental] of Object.entries(rentals)) {
      // Skip if already returned or expired
      if (rental.returnStatus === "returned" || rental.returnStatus === "expired_no_refund") continue;
      // Skip if return is requested or pending
      if (rental.returnStatus === "return_requested" || rental.returnStatus === "return_pending") continue;

      const endDate = new Date(rental.endDate);
      endDate.setHours(0, 0, 0, 0);

      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Check if notifications already exist for this rental to prevent duplicates
      const hasEndingTomorrowNotif = existingNotifications && Object.values(existingNotifications).some(
        notif => notif.rentalId === rentalId && notif.type === "rental_ending_tomorrow"
      );
      
      const hasReturnWindowNotif = existingNotifications && Object.values(existingNotifications).some(
        notif => notif.rentalId === rentalId && notif.type === "return_window"
      );
      
      const hasExpiredNotif = existingNotifications && Object.values(existingNotifications).some(
        notif => notif.rentalId === rentalId && notif.type === "return_window_expired"
      );

      // NOTIFICATION 1: 1 day before end date - "Rental ending tomorrow"
      if (diffDays === 1 && rental.returnStatus === "not_returned" && !hasEndingTomorrowNotif) {
        await sendEndingTomorrowNotification(rental, rentalId);
      }

      // STATUS TRANSITION 1: On end date → Return Window Open (5 days to return)
      if (diffDays === 0 && rental.returnStatus === "not_returned" && !hasReturnWindowNotif) {
        await transitionToReturnWindow(rental, rentalId);
      }
      
      // STATUS TRANSITION 2: 5 days after end → Expired (no refund)
      if (diffDays <= -5 && (rental.returnStatus === "not_returned" || rental.returnStatus === "return_window_open") && !hasExpiredNotif) {
        await transitionToExpired(rental, rentalId);
      }
    }
  } catch (error) {
    console.error("Error checking rental periods:", error);
  } finally {
    // Release lock after completion
    isCheckingRentals = false;
  }
};

// Send "rental ending tomorrow" notification (1 day before end date)
const sendEndingTomorrowNotification = async (rental, rentalId) => {
  try {
    const notification = {
      userEmail: rental.userEmail,
      type: "rental_ending_tomorrow",
      message: `⏰ Your rental for "${rental.bookName}" ends tomorrow (${rental.endDate}). You will have 5 days after ${rental.endDate} to return the book and get your security deposit of ₹${rental.securityDeposit} back.`,
      bookName: rental.bookName,
      bookImage: rental.bookImage,
      imageUrl: rental.bookImage,
      endDate: rental.endDate,
      securityDeposit: rental.securityDeposit,
      rentalId: rentalId,
      read: false,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };

    await fetch(`${DB_BASE_URL}/notifications.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification)
    });
    
    console.log(`Ending tomorrow notification sent for rental ${rentalId}`);
  } catch (error) {
    console.error("Error sending ending tomorrow notification:", error);
  }
};

// Transition rental to "return window open" status and send notification (on end date)
const transitionToReturnWindow = async (rental, rentalId) => {
  try {
    // ATOMIC UPDATE: Change status first to prevent race conditions
    const updateResponse = await fetch(`${DB_BASE_URL}/rentBook/${rentalId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        returnStatus: "return_window_open",
        returnWindowOpenedDate: new Date().toISOString()
      })
    });
    
    if (!updateResponse.ok) {
      console.error(`Failed to update rental ${rentalId} to return_window_open`);
      return;
    }
    
    console.log(`Rental ${rentalId} transitioned to return_window_open`);

    // Check if notification already exists for this rentalId to prevent duplicates
    const notificationsResponse = await fetch(`${DB_BASE_URL}/notifications.json`);
    const existingNotifications = await notificationsResponse.json();
    
    if (existingNotifications) {
      const duplicateExists = Object.values(existingNotifications).some(
        notif => notif.rentalId === rentalId && 
                 notif.type === "return_window" &&
                 notif.userEmail === rental.userEmail
      );
      
      if (duplicateExists) {
        console.log(`Return window notification already exists for rental ${rentalId}, skipping...`);
        return;
      }
    }

    // Send notification only if no duplicate exists
    const notification = {
      userEmail: rental.userEmail,
      type: "return_window",
      message: `📅 Your rental for "${rental.bookName}" ended on ${rental.endDate}. You can return the book within 5 days to get your security deposit of ₹${rental.securityDeposit} back.`,
      bookName: rental.bookName,
      bookImage: rental.bookImage,
      imageUrl: rental.bookImage,
      endDate: rental.endDate,
      securityDeposit: rental.securityDeposit,
      rentalId: rentalId,
      read: false,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };

    await fetch(`${DB_BASE_URL}/notifications.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification)
    });
    
    console.log(`Return window notification sent for rental ${rentalId}`);
  } catch (error) {
    console.error("Error in transitionToReturnWindow:", error);
  }
};

// Transition rental to "expired" status and send notification
const transitionToExpired = async (rental, rentalId) => {
  try {
    // ATOMIC UPDATE: Change status first to prevent race conditions
    const updateResponse = await fetch(`${DB_BASE_URL}/rentBook/${rentalId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        returnStatus: "expired_no_refund",
        expiredDate: new Date().toISOString()
      })
    });
    
    if (!updateResponse.ok) {
      console.error(`Failed to update rental ${rentalId} to expired_no_refund`);
      return;
    }
    
    console.log(`Rental ${rentalId} transitioned to expired_no_refund`);
    
    // Check all notifications for this rental
    const notificationsResponse = await fetch(`${DB_BASE_URL}/notifications.json`);
    const notifications = await notificationsResponse.json();
    
    if (notifications) {
      // Check if expired notification already exists to prevent duplicates
      const expiredNotificationExists = Object.values(notifications).some(
        notif => notif.rentalId === rentalId && 
                 notif.type === "return_window_expired" &&
                 notif.userEmail === rental.userEmail
      );
      
      if (expiredNotificationExists) {
        console.log(`Expired notification already exists for rental ${rentalId}, skipping...`);
        return;
      }
      
      // Delete old "return_window" notification if it exists
      const oldReturnWindowNotification = Object.entries(notifications).find(
        ([_, notif]) => notif.rentalId === rentalId && 
                       notif.userEmail === rental.userEmail && 
                       notif.type === "return_window"
      );
      
      if (oldReturnWindowNotification) {
        const [notificationId] = oldReturnWindowNotification;
        await fetch(`${DB_BASE_URL}/notifications/${notificationId}.json`, {
          method: "DELETE"
        });
        console.log(`Deleted old return_window notification for rental ${rentalId}`);
      }
    }

    // Send expired notification only if no duplicate exists
    const userNotification = {
      userEmail: rental.userEmail,
      type: "return_window_expired",
      message: `⏰ Your rental period for "${rental.bookName}" is over. The 5-day return window has expired. No security deposit will be refunded.`,
      bookName: rental.bookName,
      bookImage: rental.bookImage,
      rentalId: rentalId,
      read: false,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };

    await fetch(`${DB_BASE_URL}/notifications.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userNotification)
    });
    
    console.log(`Expired notification sent for rental ${rentalId}`);
  } catch (error) {
    console.error("Error in transitionToExpired:", error);
  }
};

// Request book return
export const requestBookReturn = async (rentalId, userEmail) => {
  try {
    // First, fetch the rental details
    const rentalResponse = await fetch(`${DB_BASE_URL}/rentBook/${rentalId}.json`);
    const rental = await rentalResponse.json();
    
    if (!rental) {
      return { success: false, message: "Rental not found." };
    }
    
    // Update rental status to "return_requested"
    await fetch(`${DB_BASE_URL}/rentBook/${rentalId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        returnStatus: "return_requested",
        returnRequestDate: new Date().toISOString()
      })
    });

    // Create admin notification for return request
    const adminNotification = {
      type: "return_request",
      message: `📦 User ${userEmail} has requested to return "${rental.bookName}". Please review and accept/reject the return.`,
      bookName: rental.bookName,
      bookImage: rental.bookImage,
      userEmail: userEmail,
      rentalId: rentalId,
      securityDeposit: rental.securityDeposit,
      rentalFee: rental.rentalFee,
      startDate: rental.startDate,
      endDate: rental.endDate,
      quantity: rental.quantity,
      read: false,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    await fetch(`${DB_BASE_URL}/adminNotifications.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminNotification)
    });

    return { success: true, message: "Return request submitted successfully! Waiting for admin approval." };
  } catch (error) {
    console.error("Error requesting book return:", error);
    return { success: false, message: "Failed to submit return request. Please try again." };
  }
};

// Accept book return (called by admin)
export const acceptBookReturn = async (rentalId, notificationId) => {
  try {
    // Fetch rental details
    const rentalResponse = await fetch(`${DB_BASE_URL}/rentBook/${rentalId}.json`);
    const rental = await rentalResponse.json();

    if (!rental) throw new Error("Rental not found");

    // Restore book quantity in /books
    const bookNameToKey = (name) => name.trim().toLowerCase().replace(/\s+/g, "-");
    const bookKey = bookNameToKey(rental.bookName);
    
    // Fetch existing book
    const existingBookResponse = await fetch(`${DB_BASE_URL}/books/${bookKey}.json`);
    const existingBook = await existingBookResponse.json();
    
    if (existingBook) {
      // Add returned quantity back to existing book
      await fetch(`${DB_BASE_URL}/books/${bookKey}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          quantity: existingBook.quantity + rental.quantity,
          updatedAt: new Date().toISOString()
        })
      });
    }

    // Update rental status
    await fetch(`${DB_BASE_URL}/rentBook/${rentalId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        returnStatus: "returned",
        returnAcceptedDate: new Date().toISOString(),
        status: "completed"
      })
    });

    // Send notification to user about security deposit refund
    const userNotification = {
      userEmail: rental.userEmail,
      type: "security_refund",
      message: `✅ Your book "${rental.bookName}" return has been accepted! Your security deposit of ₹${rental.securityDeposit} will be refunded shortly.`,
      bookName: rental.bookName,
      bookImage: rental.bookImage,
      securityDeposit: rental.securityDeposit,
      rentalId: rentalId,
      read: false,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };

    await fetch(`${DB_BASE_URL}/notifications.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userNotification)
    });

    // Update admin notification status to accepted
    if (notificationId) {
      await fetch(`${DB_BASE_URL}/adminNotifications/${notificationId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "accepted",
          acceptedDate: new Date().toISOString()
        })
      });
    }

    // Save security refund transaction
    await saveTransaction(createSecurityRefundTransaction(rental));

    return { success: true, message: "Return accepted and security deposit will be refunded!" };
  } catch (error) {
    console.error("Error accepting book return:", error);
    return { success: false, message: "Failed to accept return" };
  }
};

// Reject book return (called by admin)
export const rejectBookReturn = async (rentalId, notificationId, reason) => {
  try {
    // Fetch rental details
    const rentalResponse = await fetch(`${DB_BASE_URL}/rentBook/${rentalId}.json`);
    const rental = await rentalResponse.json();

    if (!rental) throw new Error("Rental not found");

    // Update rental status
    await fetch(`${DB_BASE_URL}/rentBook/${rentalId}.json`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        returnStatus: "return_rejected",
        returnRejectedDate: new Date().toISOString(),
        rejectionReason: reason
      })
    });

    // Send notification to user
    const userNotification = {
      userEmail: rental.userEmail,
      type: "return_rejected",
      message: `❌ Your return request for "${rental.bookName}" has been rejected. Reason: ${reason || "Please contact admin for details."}`,
      bookName: rental.bookName,
      bookImage: rental.bookImage,
      rentalId: rentalId,
      reason: reason,
      read: false,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };

    await fetch(`${DB_BASE_URL}/notifications.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userNotification)
    });

    // Update admin notification status
    if (notificationId) {
      await fetch(`${DB_BASE_URL}/adminNotifications/${notificationId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "rejected",
          read: true,
          processedAt: new Date().toISOString(),
          rejectionReason: reason
        })
      });
    }

    return { success: true, message: "Return rejected" };
  } catch (error) {
    console.error("Error rejecting book return:", error);
    return { success: false, message: "Failed to reject return" };
  }
};
